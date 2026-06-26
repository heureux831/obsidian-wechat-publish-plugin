import { ItemView, WorkspaceLeaf } from 'obsidian';
import type MoodCodePlugin from '../main';

export const VIEW_TYPE_MAIN = 'moodcode-main-view';

export class MainView extends ItemView {
  plugin: MoodCodePlugin;

  constructor(leaf: WorkspaceLeaf, plugin: MoodCodePlugin) {
    super(leaf);
    this.plugin = plugin;
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
    container.createEl('h3', { text: 'MoodCode Publisher' });
    container.createEl('p', { text: 'Theme engine, cover generator, and push coming soon.' });
  }

  async onClose() {
    // cleanup
  }
}
