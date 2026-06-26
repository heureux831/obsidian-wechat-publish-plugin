import { ItemView, WorkspaceLeaf, Notice, setIcon } from 'obsidian';
import type MoodCodePlugin from '../main';
import { CoverScheme, COVER_SCHEMES } from './schemes';
import { renderCoverToCanvas, generateCover } from './cover-generator';
import { getNoteTitle, getNoteSubtitle, writeCoverPng, getCoverAttachmentPath } from '../utils/file-utils';

export const VIEW_TYPE_COVER = 'moodcode-cover-view';

export class CoverView extends ItemView {
  plugin: MoodCodePlugin;
  private selectedSchemeId: string;
  private canvas: HTMLCanvasElement | null = null;
  private titleInput: HTMLInputElement | null = null;
  private subtitleInput: HTMLInputElement | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: MoodCodePlugin) {
    super(leaf);
    this.plugin = plugin;
    this.selectedSchemeId = plugin.settings.defaultCoverScheme || 'morandi';
  }

  getViewType(): string { return VIEW_TYPE_COVER; }
  getDisplayText(): string { return '封面生成'; }
  getIcon(): string { return 'image'; }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('moodcode-panel');
    container.createEl('h3', { text: '🎨 封面生成' });

    const controls = container.createDiv('moodcode-controls');

    // Title input
    const titleRow = controls.createDiv('moodcode-control-row');
    titleRow.createEl('label', { text: '标题' });
    this.titleInput = titleRow.createEl('input', { type: 'text' });
    this.titleInput.value = getNoteTitle(this.app, this.plugin.lastActiveMarkdownFile);
    this.titleInput.addEventListener('input', () => this.refreshCanvas());

    // Subtitle input
    const subRow = controls.createDiv('moodcode-control-row');
    subRow.createEl('label', { text: '副标题' });
    this.subtitleInput = subRow.createEl('input', { type: 'text' });
    this.subtitleInput.value = getNoteSubtitle(this.app, this.plugin.lastActiveMarkdownFile);
    this.subtitleInput.addEventListener('input', () => this.refreshCanvas());

    // Scheme picker
    const schemeLabel = controls.createEl('p', { text: '配色方案' });
    const schemeGrid = controls.createDiv('moodcode-scheme-grid');
    for (const scheme of COVER_SCHEMES) {
      const btn = schemeGrid.createEl('button', {
        text: scheme.name,
        cls: 'moodcode-scheme-btn' + (scheme.id === this.selectedSchemeId ? ' active' : ''),
      });
      btn.addEventListener('click', () => {
        this.selectedSchemeId = scheme.id;
        schemeGrid.querySelectorAll('.moodcode-scheme-btn').forEach(b => b.removeClass('active'));
        btn.addClass('active');
        this.refreshCanvas();
      });
    }

    // Canvas preview
    this.canvas = container.createEl('canvas', 'moodcode-cover-canvas');
    this.refreshCanvas();

    // Export buttons
    const btnRow = controls.createDiv('moodcode-control-row');
    const saveBtn = btnRow.createEl('button', { text: '💾 保存到 Vault' });
    saveBtn.addEventListener('click', () => this.saveCover());

    const copyBtn = btnRow.createEl('button', { text: '📋 复制图片' });
    copyBtn.addEventListener('click', () => this.copyCover());

    // Listen for note changes
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        if (this.titleInput) this.titleInput.value = getNoteTitle(this.app, this.plugin.lastActiveMarkdownFile);
        if (this.subtitleInput) this.subtitleInput.value = getNoteSubtitle(this.app, this.plugin.lastActiveMarkdownFile);
        this.refreshCanvas();
      })
    );
  }

  private getCurrentScheme(): CoverScheme {
    return COVER_SCHEMES.find(s => s.id === this.selectedSchemeId) ?? COVER_SCHEMES[0];
  }

  refreshCanvas(): void {
    if (!this.canvas) return;
    const scheme = this.getCurrentScheme();
    const title = this.titleInput?.value || 'Untitled';
    const subtitle = this.subtitleInput?.value || '';
    renderCoverToCanvas(this.canvas, scheme, title, subtitle);
  }

  async saveCover(): Promise<void> {
    const scheme = this.getCurrentScheme();
    const title = this.titleInput?.value || 'Untitled';
    const subtitle = this.subtitleInput?.value || '';
    const { blob } = generateCover(scheme, title, subtitle);

    const path = getCoverAttachmentPath(this.app, title, this.plugin.lastActiveMarkdownFile);
    if (!path) {
      new Notice('❌ 请先打开一篇笔记');
      return;
    }

    try {
      await writeCoverPng(this.app, blob, path);
      new Notice(`✅ 封面已保存: ${path}`);
    } catch (err) {
      new Notice(`❌ 保存失败: ${err}`);
    }
  }

  async copyCover(): Promise<void> {
    const scheme = this.getCurrentScheme();
    const title = this.titleInput?.value || 'Untitled';
    const subtitle = this.subtitleInput?.value || '';
    const { blob } = generateCover(scheme, title, subtitle);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      new Notice('✅ 封面已复制到剪贴板');
    } catch (err) {
      new Notice(`❌ 复制失败: ${err}`);
    }
  }

  /** Get the current cover as dataURL (for push handler) */
  getCoverDataURL(): string {
    const scheme = this.getCurrentScheme();
    const title = this.titleInput?.value || 'Untitled';
    const subtitle = this.subtitleInput?.value || '';
    return generateCover(scheme, title, subtitle).dataURL;
  }

  async onClose() {
    this.canvas = null;
    this.titleInput = null;
    this.subtitleInput = null;
  }
}
