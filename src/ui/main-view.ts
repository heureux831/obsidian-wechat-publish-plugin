import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import type MoodCodePlugin from '../main';
import { renderPreviewHTML, renderWechatHTML } from '../theme/theme-engine';
import { getActiveNoteContent, getNoteTitle, getNoteSubtitle, writeCoverPng, getCoverAttachmentPath } from '../utils/file-utils';
import { CoverScheme, COVER_SCHEMES } from '../cover/schemes';
import { renderCoverToCanvas, generateCover } from '../cover/cover-generator';

export const VIEW_TYPE_MAIN = 'moodcode-main-view';

export class MainView extends ItemView {
  plugin: MoodCodePlugin;

  // --- Theme tab state ---
  private selectedThemeId: string;
  private previewIframe: HTMLIFrameElement | null = null;
  private themeSelect: HTMLSelectElement | null = null;

  // --- Cover tab state ---
  private selectedSchemeId: string;
  private coverCanvas: HTMLCanvasElement | null = null;
  private titleInput: HTMLInputElement | null = null;
  private subtitleInput: HTMLInputElement | null = null;
  private coverDataURL: string = '';

  // --- Tab elements ---
  private tabThemeBtn: HTMLButtonElement | null = null;
  private tabCoverBtn: HTMLButtonElement | null = null;
  private panelTheme: HTMLDivElement | null = null;
  private panelCover: HTMLDivElement | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: MoodCodePlugin) {
    super(leaf);
    this.plugin = plugin;
    this.selectedThemeId = plugin.settings.defaultTheme || 'basic';
    this.selectedSchemeId = plugin.settings.defaultCoverScheme || 'morandi';
  }

  getViewType(): string { return VIEW_TYPE_MAIN; }
  getDisplayText(): string { return '微信发布'; }
  getIcon(): string { return 'send'; }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('moodcode-panel');

    container.createDiv('moodcode-panel-header').createEl('span', { text: '微信发布' });

    // === Tab bar ===
    const tabBar = container.createDiv('moodcode-tab-bar');
    this.tabThemeBtn = tabBar.createEl('button', { text: '排版', cls: 'moodcode-tab active' });
    this.tabCoverBtn = tabBar.createEl('button', { text: '封面', cls: 'moodcode-tab' });

    this.tabThemeBtn.addEventListener('click', () => this.switchTab('theme'));
    this.tabCoverBtn.addEventListener('click', () => this.switchTab('cover'));

    // === Tab panels ===
    this.panelTheme = container.createDiv('moodcode-tab-panel active');
    this.panelCover = container.createDiv('moodcode-tab-panel');

    // --- Build Theme tab ---
    this.buildThemeTab(this.panelTheme);

    // --- Build Cover tab ---
    this.buildCoverTab(this.panelCover);

    // --- Push section (always visible, below tabs) ---
    const pushSection = container.createDiv('moodcode-push-section');
    pushSection.createEl('p', { text: '确认排版和封面后推送到微信草稿箱', cls: 'moodcode-push-hint' });
    const pushBtn = pushSection.createEl('button', {
      text: '推送到微信草稿箱',
      cls: 'moodcode-push-btn',
    });
    pushBtn.addEventListener('click', () => this.handlePush());

    // Listen for note changes
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        this.refreshPreview();
        this.refreshCoverFromNote();
      })
    );
  }

  // ======================== Tab switching ========================

  private switchTab(tab: 'theme' | 'cover'): void {
    const isTheme = tab === 'theme';
    this.tabThemeBtn?.toggleClass('active', isTheme);
    this.tabCoverBtn?.toggleClass('active', !isTheme);
    this.panelTheme?.toggleClass('active', isTheme);
    this.panelCover?.toggleClass('active', !isTheme);
  }

  // ======================== Theme Tab ========================

  private buildThemeTab(panel: HTMLElement): void {
    const controls = panel.createDiv('moodcode-controls');

    const themeRow = controls.createDiv('moodcode-control-row');
    themeRow.createEl('label', { text: '主题' });
    this.themeSelect = themeRow.createEl('select');
    this.populateThemeList();
    this.themeSelect.addEventListener('change', () => {
      this.selectedThemeId = this.themeSelect!.value;
      this.refreshPreview();
    });

    const btnRow = controls.createDiv('moodcode-control-row');
    btnRow.createEl('button', { text: '🔄 刷新预览' })
      .addEventListener('click', () => this.refreshPreview());
    btnRow.createEl('button', { text: '📋 复制 HTML' })
      .addEventListener('click', () => this.copyHTML());

    this.previewIframe = panel.createEl('iframe', 'moodcode-preview-iframe');
    this.refreshPreview();
  }

  private populateThemeList(): void {
    if (!this.themeSelect) return;
    this.themeSelect.empty();
    const themes = this.plugin.themeRegistry.listThemes();
    for (const theme of themes) {
      const option = this.themeSelect.createEl('option');
      option.value = theme.id;
      option.text = theme.name;
      if (theme.id === this.selectedThemeId) option.selected = true;
    }
  }

  public refreshThemeList(): void {
    this.populateThemeList();
  }

  async refreshPreview(): Promise<void> {
    if (!this.previewIframe) return;

    const content = await getActiveNoteContent(this.app, this.plugin.lastActiveMarkdownFile);
    const themeCSS = this.plugin.themeRegistry.getThemeCSS(this.selectedThemeId);

    if (!content) {
      this.previewIframe.srcdoc = '<p style="padding:20px;color:#999;">No note is open. Please open a note first.</p>';
      return;
    }

    try {
      const html = await renderPreviewHTML(this.app, content, themeCSS);
      this.previewIframe.srcdoc = html;
    } catch (err) {
      this.previewIframe.srcdoc = `<p style="padding:20px;color:red;">Preview render error: ${err}</p>`;
      console.error('Preview render error:', err);
    }
  }

  async copyHTML(): Promise<void> {
    const content = await getActiveNoteContent(this.app, this.plugin.lastActiveMarkdownFile);
    const themeCSS = this.plugin.themeRegistry.getThemeCSS(this.selectedThemeId);

    if (!content) {
      new Notice('Please open a note first');
      return;
    }

    try {
      const html = await renderWechatHTML(this.app, content, themeCSS);
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([html], { type: 'text/plain' }),
        }),
      ]);
      new Notice('✅ HTML 已复制（可直接粘贴到微信编辑器）');
    } catch (err) {
      new Notice(`❌ 复制失败: ${err}`);
      console.error('Copy HTML error:', err);
    }
  }

  // ======================== Cover Tab ========================

  private buildCoverTab(panel: HTMLElement): void {
    const controls = panel.createDiv('moodcode-controls');

    // Title
    const titleRow = controls.createDiv('moodcode-control-row');
    titleRow.createEl('label', { text: '标题' });
    this.titleInput = titleRow.createEl('input', { type: 'text' });
    this.titleInput.value = getNoteTitle(this.app, this.plugin.lastActiveMarkdownFile);
    this.titleInput.addEventListener('input', () => { this.refreshCanvas(); this.generateCoverDataURL(); });

    // Subtitle
    const subRow = controls.createDiv('moodcode-control-row');
    subRow.createEl('label', { text: '副标题' });
    this.subtitleInput = subRow.createEl('input', { type: 'text' });
    this.subtitleInput.value = getNoteSubtitle(this.app, this.plugin.lastActiveMarkdownFile);
    this.subtitleInput.addEventListener('input', () => { this.refreshCanvas(); this.generateCoverDataURL(); });

    // Scheme picker
    controls.createEl('p', { text: '配色方案', cls: 'moodcode-section-label' });
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
        this.generateCoverDataURL();
      });
    }

    // Canvas
    this.coverCanvas = panel.createEl('canvas', 'moodcode-cover-canvas');
    this.refreshCanvas();
    this.generateCoverDataURL();

    // Export buttons
    const btnRow = controls.createDiv('moodcode-control-row');
    btnRow.createEl('button', { text: '💾 保存到 Vault' })
      .addEventListener('click', () => this.saveCover());
    btnRow.createEl('button', { text: '📋 复制图片' })
      .addEventListener('click', () => this.copyCover());
  }

  private getCurrentScheme(): CoverScheme {
    return COVER_SCHEMES.find(s => s.id === this.selectedSchemeId) ?? COVER_SCHEMES[0];
  }

  refreshCanvas(): void {
    if (!this.coverCanvas) return;
    const scheme = this.getCurrentScheme();
    const title = this.titleInput?.value || 'Untitled';
    const subtitle = this.subtitleInput?.value || '';
    renderCoverToCanvas(this.coverCanvas, scheme, title, subtitle);
  }

  private generateCoverDataURL(): void {
    const scheme = this.getCurrentScheme();
    const title = this.titleInput?.value || 'Untitled';
    const subtitle = this.subtitleInput?.value || '';
    this.coverDataURL = generateCover(scheme, title, subtitle).dataURL;
  }

  /** Public API for push handler */
  getCoverDataURL(): string {
    if (!this.coverDataURL) this.generateCoverDataURL();
    return this.coverDataURL;
  }

  private refreshCoverFromNote(): void {
    if (this.titleInput) this.titleInput.value = getNoteTitle(this.app, this.plugin.lastActiveMarkdownFile);
    if (this.subtitleInput) this.subtitleInput.value = getNoteSubtitle(this.app, this.plugin.lastActiveMarkdownFile);
    this.refreshCanvas();
    this.generateCoverDataURL();
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
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      new Notice('✅ 封面已复制到剪贴板');
    } catch (err) {
      new Notice(`❌ 复制失败: ${err}`);
    }
  }

  // ======================== Push ========================

  private async handlePush(): Promise<void> {
    const { pushToWechatDraft } = await import('../wechat/push-handler');

    await pushToWechatDraft(
      this.app,
      this.plugin.settings,
      this.plugin.themeRegistry,
      this,
      this.plugin.lastActiveMarkdownFile,
    );
  }

  async onClose() {
    this.previewIframe = null;
    this.themeSelect = null;
    this.coverCanvas = null;
    this.titleInput = null;
    this.subtitleInput = null;
  }
}
