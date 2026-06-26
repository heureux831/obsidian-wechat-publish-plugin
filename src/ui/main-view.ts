import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import type MoodCodePlugin from '../main';
import { renderPreviewHTML, renderWechatHTML } from '../theme/theme-engine';
import { getActiveNoteContent } from '../utils/file-utils';

export const VIEW_TYPE_MAIN = 'moodcode-main-view';

export class MainView extends ItemView {
  plugin: MoodCodePlugin;
  private selectedThemeId: string;
  private previewIframe: HTMLIFrameElement | null = null;
  private themeSelect: HTMLSelectElement | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: MoodCodePlugin) {
    super(leaf);
    this.plugin = plugin;
    this.selectedThemeId = plugin.settings.defaultTheme || 'basic';
  }

  getViewType(): string {
    return VIEW_TYPE_MAIN;
  }

  getDisplayText(): string {
    return 'MoodCode Publisher';
  }

  getIcon(): string {
    return 'send';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('moodcode-panel');

    // Header
    container.createEl('h3', { text: 'MoodCode Publisher' });

    // Controls section
    const controls = container.createDiv('moodcode-controls');

    // Theme selector row
    const themeRow = controls.createDiv('moodcode-control-row');
    themeRow.createEl('label', { text: 'Theme' });
    this.themeSelect = themeRow.createEl('select');
    this.populateThemeList();
    this.themeSelect.addEventListener('change', () => {
      this.selectedThemeId = this.themeSelect!.value;
      this.refreshPreview();
    });

    // Button row
    const btnRow = controls.createDiv('moodcode-control-row');
    const refreshBtn = btnRow.createEl('button', { text: 'Refresh Preview' });
    refreshBtn.addEventListener('click', () => this.refreshPreview());

    const copyBtn = btnRow.createEl('button', { text: 'Copy HTML' });
    copyBtn.addEventListener('click', () => this.copyHTML());

    // Preview iframe
    this.previewIframe = container.createEl('iframe', 'moodcode-preview-iframe');

    // Initial preview
    this.refreshPreview();

    // Listen for active note changes
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        this.refreshPreview();
      })
    );
  }

  private populateThemeList(): void {
    if (!this.themeSelect) return;
    this.themeSelect.empty();
    const themes = this.plugin.themeRegistry.listThemes();
    for (const theme of themes) {
      const option = this.themeSelect.createEl('option');
      option.value = theme.id;
      option.text = theme.name;
      if (theme.id === this.selectedThemeId) {
        option.selected = true;
      }
    }
  }

  async refreshPreview(): Promise<void> {
    if (!this.previewIframe) return;

    const content = getActiveNoteContent(this.app);
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
    const content = getActiveNoteContent(this.app);
    const themeCSS = this.plugin.themeRegistry.getThemeCSS(this.selectedThemeId);

    if (!content) {
      new Notice('Please open a note first');
      return;
    }

    try {
      const html = await renderWechatHTML(this.app, content, themeCSS);
      await navigator.clipboard.writeText(html);
      new Notice('HTML copied to clipboard');
    } catch (err) {
      new Notice(`Copy failed: ${err}`);
      console.error('Copy HTML error:', err);
    }
  }

  async onClose() {
    this.previewIframe = null;
    this.themeSelect = null;
  }
}
