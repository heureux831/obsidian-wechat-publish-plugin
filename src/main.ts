import { Plugin, WorkspaceLeaf } from 'obsidian';
import { MoodCodeSettings, DEFAULT_SETTINGS } from './settings';
import { MoodCodeSettingTab } from './settings';
import { MainView, VIEW_TYPE_MAIN } from './ui/main-view';

export default class MoodCodePlugin extends Plugin {
  settings!: MoodCodeSettings;

  async onload() {
    await this.loadSettings();

    // Register main view
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
