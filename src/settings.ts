import { App, PluginSettingTab, Setting } from 'obsidian';
import type MoodCodePlugin from './main';

export interface MoodCodeSettings {
  wechatAppId: string;
  wechatAppSecret: string;
  defaultTheme: string;
  defaultCoverScheme: string;
}

export const DEFAULT_SETTINGS: MoodCodeSettings = {
  wechatAppId: '',
  wechatAppSecret: '',
  defaultTheme: 'basic',
  defaultCoverScheme: 'morandi',
};

export class MoodCodeSettingTab extends PluginSettingTab {
  plugin: MoodCodePlugin;

  constructor(app: App, plugin: MoodCodePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'MoodCode Publisher Settings' });

    new Setting(containerEl)
      .setName('WeChat AppID')
      .setDesc('Your WeChat Official Account developer AppID')
      .addText(text => text
        .setPlaceholder('wx0000000000000000')
        .setValue(this.plugin.settings.wechatAppId)
        .onChange(async (value) => {
          this.plugin.settings.wechatAppId = value.trim();
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('WeChat AppSecret')
      .setDesc('Your WeChat Official Account developer AppSecret')
      .addText(text => {
        text.inputEl.type = 'password';
        text.setPlaceholder('Your AppSecret')
          .setValue(this.plugin.settings.wechatAppSecret)
          .onChange(async (value) => {
            this.plugin.settings.wechatAppSecret = value.trim();
            await this.plugin.saveSettings();
          });
        return text;
      });
  }
}
