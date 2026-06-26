import { Plugin, WorkspaceLeaf, TFile, MarkdownView } from 'obsidian';
import { MoodCodeSettings, DEFAULT_SETTINGS } from './settings';
import { MoodCodeSettingTab } from './settings';
import { MainView, VIEW_TYPE_MAIN } from './ui/main-view';
import { ThemeRegistry } from './theme/theme-registry';
import { ThemeEditorModal } from './ui/theme-editor';

export default class MoodCodePlugin extends Plugin {
  settings!: MoodCodeSettings;
  themeRegistry!: ThemeRegistry;
  lastActiveMarkdownFile: TFile | null = null;

  async onload() {
    await this.loadSettings();
    this.themeRegistry = new ThemeRegistry();

    // Restore persisted custom CSS into the in-memory theme registry
    const data: Record<string, unknown> | null = await this.loadData();
    if (data?.customCSS && typeof data.customCSS === 'string') {
      this.themeRegistry.saveCustomTheme(data.customCSS);
    }

    // Register the unified main view
    this.registerView(
      VIEW_TYPE_MAIN,
      (leaf: WorkspaceLeaf) => new MainView(leaf, this)
    );

    // Ribbon icon
    this.addRibbonIcon('send', 'MoodCode Publisher', () => {
      this.activateView();
    });

    // Command: open panel
    this.addCommand({
      id: 'open-moodcode-panel',
      name: 'Open Publisher Panel',
      callback: () => this.activateView(),
    });

    // Command: push to WeChat draft
    this.addCommand({
      id: 'push-to-wechat-draft',
      name: 'Push to WeChat Draft',
      callback: async () => {
        const { pushToWechatDraft } = await import('./wechat/push-handler');
        const mainLeaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_MAIN)[0];
        const mainView = mainLeaf?.view as MainView | null;
        await pushToWechatDraft(this.app, this.settings, this.themeRegistry, mainView, this.lastActiveMarkdownFile);
      },
    });

    // Command: open custom theme editor
    this.addCommand({
      id: 'open-theme-editor',
      name: 'Open Custom Theme Editor',
      callback: () => {
        new ThemeEditorModal(this.app, this).open();
      },
    });

    // Settings tab
    this.addSettingTab(new MoodCodeSettingTab(this.app, this));

    // Track last active markdown file for when our panel gets focus
    // Initialize from currently active leaf in case a note was already open
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf?.view instanceof MarkdownView && activeLeaf.view.file) {
      this.lastActiveMarkdownFile = activeLeaf.view.file;
    }

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf) => {
        if (leaf?.view instanceof MarkdownView && leaf.view.file) {
          this.lastActiveMarkdownFile = leaf.view.file;
        }
      })
    );

    console.log('MoodCode Blog Publisher loaded');
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(VIEW_TYPE_MAIN)[0] ?? null;
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({ type: VIEW_TYPE_MAIN, active: true });
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    console.log('MoodCode Blog Publisher unloaded');
  }
}
