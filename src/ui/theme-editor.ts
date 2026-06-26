import { App, Modal, Setting, Notice } from 'obsidian';
import type MoodCodePlugin from '../main';

export class ThemeEditorModal extends Modal {
  plugin: MoodCodePlugin;
  private cssEditor: HTMLTextAreaElement | null = null;
  private previewIframe: HTMLIFrameElement | null = null;

  constructor(app: App, plugin: MoodCodePlugin) {
    super(app);
    this.plugin = plugin;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('moodcode-theme-editor');
    contentEl.createEl('h2', { text: 'Custom Theme Editor' });

    // Load current custom CSS from persisted data, fall back to in-memory, then to basic preset
    const data = (await this.plugin.loadData()) || {};
    const persistedCSS: string | undefined = data.customCSS;
    const inMemoryCSS = this.plugin.themeRegistry.getThemeCSS('custom');
    const startingCSS = persistedCSS || inMemoryCSS || this.plugin.themeRegistry.getThemeCSS('basic');

    // If persisted data has custom CSS but in-memory doesn't match, restore it
    if (persistedCSS && inMemoryCSS !== persistedCSS) {
      this.plugin.themeRegistry.saveCustomTheme(persistedCSS);
    }

    // Editor
    new Setting(contentEl)
      .setName('CSS')
      .setDesc('Edit CSS to customize the typography theme (selectors target the #nice container)');

    this.cssEditor = contentEl.createEl('textarea', {
      attr: {
        style:
          'width:100%;height:300px;font-family:monospace;font-size:13px;padding:12px;' +
          'border:1px solid var(--background-modifier-border);border-radius:4px;' +
          'background:var(--background-primary);color:var(--text-normal);resize:vertical;',
        placeholder: '/* Edit CSS here */\n#nice { ... }',
      },
    });
    this.cssEditor.value = startingCSS;

    // Preview section
    contentEl.createEl('h3', { text: 'Live Preview' });
    this.previewIframe = contentEl.createEl('iframe', {
      attr: {
        style:
          'width:100%;height:250px;border:1px solid var(--background-modifier-border);border-radius:4px;',
      },
    });

    // Debounced preview
    let debounceTimer: ReturnType<typeof setTimeout>;
    this.cssEditor.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.refreshPreview(), 500);
    });

    // Initial preview
    this.refreshPreview();

    // Buttons
    const btnContainer = contentEl.createDiv({
      attr: { style: 'margin-top:12px;display:flex;gap:8px;' },
    });

    const saveBtn = btnContainer.createEl('button', {
      text: 'Save as Custom Theme',
      cls: 'mod-cta',
    });
    saveBtn.addEventListener('click', () => this.saveCustom());

    const resetBtn = btnContainer.createEl('button', {
      text: 'Reset to Basic Theme',
    });
    resetBtn.addEventListener('click', () => {
      if (this.cssEditor) {
        this.cssEditor.value = this.plugin.themeRegistry.getThemeCSS('basic');
        this.refreshPreview();
      }
    });

    const closeBtn = btnContainer.createEl('button', { text: 'Close' });
    closeBtn.addEventListener('click', () => this.close());
  }

  private async refreshPreview(): Promise<void> {
    if (!this.previewIframe || !this.cssEditor) return;

    const mdContent =
      this.app.workspace.activeEditor?.editor?.getValue() ?? '';

    if (!mdContent) {
      this.previewIframe.srcdoc =
        '<p style="padding:20px;color:var(--text-muted);">Please open a note first to preview content.</p>';
      return;
    }

    const css = this.cssEditor.value;

    try {
      const { renderPreviewHTML } = await import('../theme/theme-engine');
      const html = await renderPreviewHTML(this.app, mdContent, css);
      this.previewIframe.srcdoc = html;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.previewIframe.srcdoc =
        `<p style="padding:20px;color:red;">CSS Error: ${message}</p>`;
    }
  }

  private async saveCustom(): Promise<void> {
    if (!this.cssEditor) return;

    const css = this.cssEditor.value;

    // Update in-memory registry
    this.plugin.themeRegistry.saveCustomTheme(css);

    // Persist to plugin data
    const data = (await this.plugin.loadData()) || {};
    data.customCSS = css;
    await this.plugin.saveData(data);

    new Notice('Custom theme saved. Select "Custom" from the theme dropdown to use it.');
    this.close();
  }

  onClose() {
    this.cssEditor = null;
    this.previewIframe = null;
    this.contentEl.empty();
  }
}
