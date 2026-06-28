import basicCSS from './presets/basic.css';
import morandiCSS from './presets/morandi.css';
import minimalCSS from './presets/minimal.css';
import warmCSS from './presets/warm.css';
import coolCSS from './presets/cool.css';
import forestCSS from './presets/forest.css';
import darkCSS from './presets/dark.css';

export interface ThemeInfo {
  id: string;
  name: string;
  source: 'preset' | 'custom';
}

export class ThemeRegistry {
  private presets: Map<string, string> = new Map();
  private customCSS: string | null = null;

  constructor() {
    this.registerBuiltins();
  }

  private registerBuiltins(): void {
    this.presets.set('basic', basicCSS);
    this.presets.set('morandi', morandiCSS);
    this.presets.set('minimal', minimalCSS);
    this.presets.set('warm', warmCSS);
    this.presets.set('cool', coolCSS);
    this.presets.set('forest', forestCSS);
    this.presets.set('dark', darkCSS);
  }

  /** Register a preset theme CSS */
  register(id: string, name: string, css: string): void {
    this.presets.set(id, css);
  }

  /** List all available themes (presets + custom, if any) */
  listThemes(): ThemeInfo[] {
    const themes: ThemeInfo[] = [];
    for (const [id] of this.presets) {
      themes.push({ id, name: this.getDisplayName(id), source: 'preset' });
    }
    if (this.customCSS) {
      themes.push({ id: 'custom', name: '自定义 (Custom)', source: 'custom' });
    }
    return themes;
  }

  /** Get CSS string for a theme by ID */
  getThemeCSS(id: string): string {
    if (id === 'custom' && this.customCSS) {
      return this.customCSS;
    }
    return this.presets.get(id) ?? '';
  }

  /** Save user-edited custom theme */
  saveCustomTheme(css: string): void {
    this.customCSS = css;
  }

  /** Get display name for a preset ID */
  private getDisplayName(id: string): string {
    const names: Record<string, string> = {
      'basic': '基础',
      'morandi': '素笺',
      'minimal': '白描',
      'warm': '柿染',
      'cool': '青瓷',
      'forest': '苔色',
      'dark': '墨韵',
    };
    return names[id] ?? id;
  }
}
