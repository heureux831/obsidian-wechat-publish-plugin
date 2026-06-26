export interface DecorationConfig {
  type: 'rect' | 'circle' | 'line' | 'gradient-overlay';
  x: number;        // percentage 0-100
  y: number;
  width?: number;   // percentage 0-100
  height?: number;
  color: string;
  opacity?: number; // 0-1
  radius?: number;  // for circles / rect corners
  rotation?: number; // degrees
}

export interface CoverScheme {
  id: string;
  name: string;
  backgroundColor: string;
  gradient?: { start: string; end: string; angle: number }; // angle in degrees
  textColor: string;
  subtitleColor: string;
  decorations: DecorationConfig[];
  fontFamily: string;
  titleFontSize: number;
  titleAlign: 'center' | 'left';
  showSubtitle: boolean;
}

export const COVER_SCHEMES: CoverScheme[] = [
  {
    id: 'morandi',
    name: '墨 · 学术',
    backgroundColor: '#e8d5c4',
    textColor: '#5c4b3a',
    subtitleColor: '#9b8c7c',
    decorations: [
      { type: 'rect', x: 0, y: 0, width: 100, height: 100, color: '#d4c4b0', opacity: 0.3 },
      { type: 'circle', x: 85, y: 15, radius: 15, color: '#c4b4a0', opacity: 0.4 },
      { type: 'line', x: 10, y: 85, width: 80, height: 2, color: '#b8a99a', opacity: 0.5 },
    ],
    fontFamily: '"STSong", "SimSun", "Noto Serif SC", serif',
    titleFontSize: 42,
    titleAlign: 'center',
    showSubtitle: true,
  },
  {
    id: 'minimal',
    name: '简 · 黑白',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    subtitleColor: '#888888',
    decorations: [
      { type: 'rect', x: 0, y: 0, width: 100, height: 4, color: '#000000' },
      { type: 'rect', x: 0, y: 96, width: 100, height: 4, color: '#000000' },
    ],
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    titleFontSize: 40,
    titleAlign: 'left',
    showSubtitle: true,
  },
  {
    id: 'warm',
    name: '晨 · 暖橙',
    backgroundColor: '#fef3e4',
    gradient: { start: '#fef3e4', end: '#fde4c8', angle: 135 },
    textColor: '#c06030',
    subtitleColor: '#d49060',
    decorations: [
      { type: 'circle', x: 90, y: 10, radius: 18, color: '#f8c898', opacity: 0.5 },
      { type: 'circle', x: 5, y: 80, radius: 8, color: '#f8c898', opacity: 0.3 },
      { type: 'line', x: 10, y: 88, width: 30, height: 2, color: '#e8b888', opacity: 0.6 },
    ],
    fontFamily: '"PingFang SC", "KaiTi", sans-serif',
    titleFontSize: 44,
    titleAlign: 'center',
    showSubtitle: true,
  },
  {
    id: 'cool',
    name: '海 · 冷蓝',
    backgroundColor: '#e8f4fd',
    gradient: { start: '#e8f4fd', end: '#d0e8f8', angle: 180 },
    textColor: '#1a5276',
    subtitleColor: '#5b8fb9',
    decorations: [
      { type: 'rect', x: 0, y: 0, width: 100, height: 5, color: '#3498db' },
      { type: 'line', x: 80, y: 90, width: 15, height: 2, color: '#85c1e9', opacity: 0.7 },
    ],
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    titleFontSize: 40,
    titleAlign: 'left',
    showSubtitle: true,
  },
  {
    id: 'forest',
    name: '森 · 墨绿',
    backgroundColor: '#eaf5ea',
    gradient: { start: '#eaf5ea', end: '#d4e8d4', angle: 160 },
    textColor: '#2d4a2d',
    subtitleColor: '#6a8a6a',
    decorations: [
      { type: 'circle', x: 10, y: 10, radius: 10, color: '#95d5b2', opacity: 0.3 },
      { type: 'circle', x: 80, y: 75, radius: 14, color: '#b7e4c7', opacity: 0.3 },
      { type: 'line', x: 8, y: 92, width: 25, height: 2, color: '#52b788', opacity: 0.5 },
    ],
    fontFamily: '"PingFang SC", "Noto Serif SC", serif',
    titleFontSize: 42,
    titleAlign: 'center',
    showSubtitle: true,
  },
  {
    id: 'dark',
    name: '夜 · 深色',
    backgroundColor: '#1a1a2e',
    gradient: { start: '#1a1a2e', end: '#16213e', angle: 90 },
    textColor: '#e8e8e8',
    subtitleColor: '#aaa',
    decorations: [
      { type: 'circle', x: 50, y: 50, radius: 30, color: '#0f3460', opacity: 0.5 },
      { type: 'line', x: 15, y: 15, width: 20, height: 1, color: '#e94560', opacity: 0.6 },
    ],
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    titleFontSize: 42,
    titleAlign: 'center',
    showSubtitle: true,
  },
];
