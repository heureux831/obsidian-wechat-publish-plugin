export interface DecorationConfig {
  type: 'rect' | 'circle' | 'line' | 'accent-bar' | 'large-circle' | 'dot-grid';
  x: number;        // percentage 0-100
  y: number;
  width?: number;   // percentage 0-100
  height?: number;
  color: string;
  opacity?: number;  // 0-1
  radius?: number;   // for circles / rect corners
  rotation?: number; // degrees
}

export interface CoverScheme {
  id: string;
  name: string;
  backgroundColor: string;
  gradient?: { start: string; end: string; angle: number };
  textColor: string;
  subtitleColor: string;
  decorations: DecorationConfig[];
  fontFamily: string;
  titleFontSize: number;
  titleAlign: 'center' | 'left';
  showSubtitle: boolean;
  /** Subtle text shadow for readability on gradients */
  textShadow?: string;
}

export const COVER_SCHEMES: CoverScheme[] = [
  // ── 1. 墨 · 学术 ──
  {
    id: 'morandi',
    name: '墨 · 学术',
    backgroundColor: '#e8ddd0',
    gradient: { start: '#ede3d8', end: '#e0d2c0', angle: 160 },
    textColor: '#4a3728',
    subtitleColor: '#8b7355',
    decorations: [
      // Large soft circle — focal anchor behind title area
      { type: 'large-circle', x: 50, y: 42, radius: 32, color: '#d4c4b0', opacity: 0.35 },
      // Smaller accent circle — balance
      { type: 'circle', x: 82, y: 22, radius: 6, color: '#c4b09a', opacity: 0.45 },
      // Bottom accent bar — grounds the composition
      { type: 'accent-bar', x: 15, y: 88, width: 70, height: 2, color: '#bfa58a', opacity: 0.6 },
      // Dot grid texture — editorial feel
      { type: 'dot-grid', x: 60, y: 8, width: 25, height: 12, color: '#c4b09a', opacity: 0.18 },
    ],
    fontFamily: '"Noto Serif SC", "STSong", "SimSun", serif',
    titleFontSize: 44,
    titleAlign: 'center',
    showSubtitle: true,
    textShadow: '0 1px 2px rgba(255,255,240,0.3)',
  },

  // ── 2. 简 · 黑白 ──
  {
    id: 'minimal',
    name: '简 · 黑白',
    backgroundColor: '#fafaf8',
    textColor: '#1a1a1a',
    subtitleColor: '#777777',
    decorations: [
      // Bold left accent — Swiss design
      { type: 'accent-bar', x: 0, y: 0, width: 5, height: 100, color: '#1a1a1a', opacity: 1 },
      // Thin rule at bottom
      { type: 'line', x: 8, y: 92, width: 84, height: 1, color: '#d0d0d0', opacity: 1 },
      // Small square accent near title
      { type: 'rect', x: 8, y: 38, width: 3, height: 3, color: '#1a1a1a', opacity: 1, rotation: 0 },
    ],
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
    titleFontSize: 42,
    titleAlign: 'left',
    showSubtitle: true,
  },

  // ── 3. 晨 · 暖橙 ──
  {
    id: 'warm',
    name: '晨 · 暖橙',
    backgroundColor: '#fdf2e4',
    gradient: { start: '#fef7f0', end: '#fbe4cc', angle: 145 },
    textColor: '#b8512a',
    subtitleColor: '#d4855c',
    decorations: [
      // Warm glow circles — layered depth
      { type: 'large-circle', x: 78, y: 15, radius: 28, color: '#f5c8a0', opacity: 0.35 },
      { type: 'large-circle', x: 15, y: 75, radius: 20, color: '#f0c090', opacity: 0.25 },
      { type: 'circle', x: 25, y: 20, radius: 10, color: '#f8d4b8', opacity: 0.4 },
      { type: 'circle', x: 68, y: 82, radius: 5, color: '#e8a870', opacity: 0.3 },
      // Warm accent line
      { type: 'accent-bar', x: 35, y: 90, width: 30, height: 2, color: '#e89868', opacity: 0.5 },
    ],
    fontFamily: '"PingFang SC", "STKaiti", "KaiTi", serif',
    titleFontSize: 46,
    titleAlign: 'center',
    showSubtitle: true,
  },

  // ── 4. 海 · 冷蓝 ──
  {
    id: 'cool',
    name: '海 · 冷蓝',
    backgroundColor: '#e6f1fa',
    gradient: { start: '#edf4fc', end: '#dce8f5', angle: 180 },
    textColor: '#1a3a5c',
    subtitleColor: '#5b7fa5',
    decorations: [
      // Horizontal accent strip
      { type: 'accent-bar', x: 0, y: 0, width: 100, height: 4, color: '#3a7bd5', opacity: 0.8 },
      // Geometric rectangles — tech/analytics feel
      { type: 'rect', x: 80, y: 88, width: 16, height: 8, color: '#3a7bd5', opacity: 0.12, rotation: -12 },
      { type: 'rect', x: 72, y: 82, width: 12, height: 6, color: '#2b5fa8', opacity: 0.15, rotation: -8 },
      // Subtle dot grid
      { type: 'dot-grid', x: 55, y: 70, width: 30, height: 12, color: '#3a7bd5', opacity: 0.1 },
    ],
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
    titleFontSize: 42,
    titleAlign: 'left',
    showSubtitle: true,
  },

  // ── 5. 森 · 墨绿 ──
  {
    id: 'forest',
    name: '森 · 墨绿',
    backgroundColor: '#e8f0e8',
    gradient: { start: '#edf4ed', end: '#dce8dc', angle: 155 },
    textColor: '#2d4a2d',
    subtitleColor: '#5a7a5a',
    decorations: [
      // Organic overlapping circles
      { type: 'large-circle', x: 18, y: 22, radius: 18, color: '#a8d5a8', opacity: 0.28 },
      { type: 'large-circle', x: 70, y: 65, radius: 22, color: '#8cc48c', opacity: 0.22 },
      { type: 'circle', x: 55, y: 18, radius: 8, color: '#95c895', opacity: 0.3 },
      { type: 'circle', x: 85, y: 85, radius: 5, color: '#7ab87a', opacity: 0.25 },
      // Ground line
      { type: 'accent-bar', x: 10, y: 90, width: 60, height: 2, color: '#6aaa6a', opacity: 0.45 },
    ],
    fontFamily: '"Noto Serif SC", "PingFang SC", "STSong", serif',
    titleFontSize: 44,
    titleAlign: 'center',
    showSubtitle: true,
  },

  // ── 6. 夜 · 深色 ──
  {
    id: 'dark',
    name: '夜 · 深色',
    backgroundColor: '#1a1a2e',
    gradient: { start: '#1a1a2e', end: '#162032', angle: 135 },
    textColor: '#f0e6d3',
    subtitleColor: '#a09888',
    decorations: [
      // Dramatic large circle — moon-like focal point
      { type: 'large-circle', x: 80, y: 22, radius: 36, color: '#e8c56d', opacity: 0.08 },
      // Accent line — the one bold element
      { type: 'accent-bar', x: 12, y: 15, width: 30, height: 2, color: '#e8c56d', opacity: 0.7 },
      // Subtle geometric accents
      { type: 'circle', x: 18, y: 78, radius: 3, color: '#e8c56d', opacity: 0.25 },
      { type: 'circle', x: 45, y: 72, radius: 2, color: '#e8c56d', opacity: 0.2 },
      { type: 'circle', x: 38, y: 82, radius: 4, color: '#e8c56d', opacity: 0.18 },
      // Dot grid for texture
      { type: 'dot-grid', x: 60, y: 73, width: 30, height: 15, color: '#c0b090', opacity: 0.08 },
    ],
    fontFamily: '"PingFang SC", "Noto Serif SC", "STKaiti", serif',
    titleFontSize: 44,
    titleAlign: 'center',
    showSubtitle: true,
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
];
