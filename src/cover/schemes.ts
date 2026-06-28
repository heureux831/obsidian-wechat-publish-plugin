export interface DecorationConfig {
  type: 'rect' | 'circle' | 'line' | 'accent-bar' | 'large-circle' | 'dot-grid';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  opacity?: number;
  radius?: number;
  rotation?: number;
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
  textShadow?: string;
}

export const COVER_SCHEMES: CoverScheme[] = [
  // ── 1. 素笺 · Plain Letter ──
  {
    id: 'sujian',
    name: '素笺',
    backgroundColor: '#f5f0e8',
    gradient: { start: '#f8f4ed', end: '#f0e8d8', angle: 170 },
    textColor: '#4a3f35',
    subtitleColor: '#8b7d6b',
    decorations: [
      { type: 'large-circle', x: 50, y: 45, radius: 34, color: '#e8dcc8', opacity: 0.3 },
      { type: 'circle', x: 85, y: 18, radius: 5, color: '#d4c8b0', opacity: 0.45 },
      { type: 'accent-bar', x: 12, y: 88, width: 50, height: 2, color: '#c8b898', opacity: 0.5 },
      { type: 'dot-grid', x: 55, y: 10, width: 30, height: 14, color: '#d8ccb8', opacity: 0.15 },
    ],
    fontFamily: '"Noto Serif SC", "STSong", "SimSun", serif',
    titleFontSize: 44,
    titleAlign: 'center',
    showSubtitle: true,
    textShadow: '0 1px 2px rgba(255,252,245,0.4)',
  },

  // ── 2. 白描 · Ink Outline ──
  {
    id: 'baimiao',
    name: '白描',
    backgroundColor: '#fdfdfc',
    textColor: '#1a1a1a',
    subtitleColor: '#888888',
    decorations: [
      { type: 'accent-bar', x: 0, y: 0, width: 4, height: 100, color: '#1a1a1a', opacity: 1 },
      { type: 'line', x: 8, y: 93, width: 75, height: 1, color: '#cccccc', opacity: 1 },
      { type: 'circle', x: 6, y: 85, radius: 2, color: '#1a1a1a', opacity: 0.7 },
    ],
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
    titleFontSize: 42,
    titleAlign: 'left',
    showSubtitle: true,
  },

  // ── 3. 柿染 · Persimmon Dye ──
  {
    id: 'shiran',
    name: '柿染',
    backgroundColor: '#fdf2e8',
    gradient: { start: '#fef8f2', end: '#fbe8d4', angle: 140 },
    textColor: '#8b3a20',
    subtitleColor: '#c07850',
    decorations: [
      { type: 'large-circle', x: 75, y: 18, radius: 30, color: '#f0c8a0', opacity: 0.32 },
      { type: 'large-circle', x: 12, y: 72, radius: 22, color: '#e8b888', opacity: 0.22 },
      { type: 'circle', x: 22, y: 22, radius: 8, color: '#f5d0b0', opacity: 0.38 },
      { type: 'circle', x: 65, y: 78, radius: 6, color: '#e0a070', opacity: 0.28 },
      { type: 'accent-bar', x: 30, y: 90, width: 35, height: 2, color: '#d89860', opacity: 0.5 },
    ],
    fontFamily: '"PingFang SC", "STKaiti", "KaiTi", serif',
    titleFontSize: 46,
    titleAlign: 'center',
    showSubtitle: true,
  },

  // ── 4. 青瓷 · Celadon ──
  {
    id: 'qingci',
    name: '青瓷',
    backgroundColor: '#eaf3f0',
    gradient: { start: '#f0f6f4', end: '#e0ece6', angle: 175 },
    textColor: '#2d4a42',
    subtitleColor: '#5a8a7a',
    decorations: [
      { type: 'accent-bar', x: 0, y: 0, width: 100, height: 4, color: '#5a9e8a', opacity: 0.7 },
      { type: 'large-circle', x: 85, y: 75, radius: 25, color: '#a0d4c4', opacity: 0.22 },
      { type: 'rect', x: 75, y: 88, width: 18, height: 7, color: '#5a9e8a', opacity: 0.1, rotation: -10 },
      { type: 'dot-grid', x: 50, y: 68, width: 28, height: 14, color: '#7aba9e', opacity: 0.1 },
    ],
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
    titleFontSize: 42,
    titleAlign: 'left',
    showSubtitle: true,
  },

  // ── 5. 苔色 · Moss ──
  {
    id: 'taise',
    name: '苔色',
    backgroundColor: '#eaf0e8',
    gradient: { start: '#eef4ec', end: '#dde8d8', angle: 150 },
    textColor: '#3a4a38',
    subtitleColor: '#6a7a68',
    decorations: [
      { type: 'large-circle', x: 20, y: 25, radius: 20, color: '#a8c8a0', opacity: 0.26 },
      { type: 'large-circle', x: 72, y: 68, radius: 24, color: '#90b888', opacity: 0.2 },
      { type: 'circle', x: 52, y: 18, radius: 9, color: '#a0c898', opacity: 0.28 },
      { type: 'circle', x: 88, y: 82, radius: 4, color: '#78a870', opacity: 0.24 },
      { type: 'accent-bar', x: 10, y: 90, width: 55, height: 2, color: '#6a9a60', opacity: 0.42 },
    ],
    fontFamily: '"Noto Serif SC", "PingFang SC", "STSong", serif',
    titleFontSize: 44,
    titleAlign: 'center',
    showSubtitle: true,
  },

  // ── 6. 墨韵 · Ink Wash ──
  {
    id: 'moyun',
    name: '墨韵',
    backgroundColor: '#1c1c24',
    gradient: { start: '#22222c', end: '#181820', angle: 130 },
    textColor: '#e8e0d0',
    subtitleColor: '#a09888',
    decorations: [
      { type: 'large-circle', x: 78, y: 24, radius: 38, color: '#d4c090', opacity: 0.07 },
      { type: 'accent-bar', x: 10, y: 14, width: 28, height: 2, color: '#d4c090', opacity: 0.6 },
      { type: 'circle', x: 15, y: 76, radius: 3, color: '#d4c090', opacity: 0.22 },
      { type: 'circle', x: 42, y: 70, radius: 2, color: '#d4c090', opacity: 0.18 },
      { type: 'circle', x: 35, y: 80, radius: 4, color: '#d4c090', opacity: 0.15 },
      { type: 'dot-grid', x: 58, y: 72, width: 32, height: 16, color: '#c0b898', opacity: 0.07 },
    ],
    fontFamily: '"PingFang SC", "Noto Serif SC", "STKaiti", serif',
    titleFontSize: 44,
    titleAlign: 'center',
    showSubtitle: true,
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
];
