import { Plugin, WorkspaceLeaf } from 'obsidian';
import { MoodCodeSettings, DEFAULT_SETTINGS } from './settings';
import { MoodCodeSettingTab } from './settings';
import { MainView, VIEW_TYPE_MAIN } from './ui/main-view';
import { CoverView, VIEW_TYPE_COVER } from './cover/cover-view';
import { ThemeRegistry } from './theme/theme-registry';
import { ThemeEditorModal } from './ui/theme-editor';

export default class MoodCodePlugin extends Plugin {
  settings!: MoodCodeSettings;
  themeRegistry!: ThemeRegistry;

  async onload() {
    await this.loadSettings();
    this.themeRegistry = new ThemeRegistry();

    // Restore persisted custom CSS into the in-memory theme registry
    const data: Record<string, unknown> | null = await this.loadData();
    if (data?.customCSS && typeof data.customCSS === 'string') {
      this.themeRegistry.saveCustomTheme(data.customCSS);
    }

    // Register main view
    this.registerView(
      VIEW_TYPE_MAIN,
      (leaf: WorkspaceLeaf) => new MainView(leaf, this)
    );

    // Register cover view
    this.registerView(
      VIEW_TYPE_COVER,
      (leaf: WorkspaceLeaf) => new CoverView(leaf, this)
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

    // Command: open cover generator
    this.addCommand({
      id: 'open-moodcode-cover',
      name: 'Open Cover Generator',
      callback: () => {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_COVER)[0];
        if (!leaf) {
          leaf = workspace.getRightLeaf(false);
          if (leaf) {
            leaf.setViewState({ type: VIEW_TYPE_COVER, active: true });
          }
        }
        if (leaf) workspace.revealLeaf(leaf);
      },
    });

    // Command: push to WeChat draft
    this.addCommand({
      id: 'push-to-wechat-draft',
      name: 'Push to WeChat Draft',
      callback: async () => {
        const { pushToWechatDraft } = await import('./wechat/push-handler');

        const coverLeaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_COVER)[0];
        const coverView = coverLeaf?.view as CoverView | null;

        await pushToWechatDraft(this.app, this.settings, this.themeRegistry, coverView);
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
