import { CoverScheme } from './schemes';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const EXPORT_WIDTH = 900;
const EXPORT_HEIGHT = 383;
// The export crops from the top — canvas renders full 500px, export takes top 383

export function renderCoverToCanvas(
  canvas: HTMLCanvasElement,
  scheme: CoverScheme,
  title: string,
  subtitle: string,
): void {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Layer 1: Background
  if (scheme.gradient) {
    const grad = ctx.createLinearGradient(
      0, 0,
      CANVAS_WIDTH * Math.cos(scheme.gradient.angle * Math.PI / 180),
      CANVAS_HEIGHT * Math.sin(scheme.gradient.angle * Math.PI / 180),
    );
    grad.addColorStop(0, scheme.gradient.start);
    grad.addColorStop(1, scheme.gradient.end);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = scheme.backgroundColor;
  }
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Layer 2: Decorations
  for (const deco of scheme.decorations) {
    ctx.save();
    ctx.globalAlpha = deco.opacity ?? 1;
    ctx.fillStyle = deco.color;
    ctx.strokeStyle = deco.color;

    const x = (deco.x / 100) * CANVAS_WIDTH;
    const y = (deco.y / 100) * CANVAS_HEIGHT;

    switch (deco.type) {
      case 'rect': {
        const w = ((deco.width ?? 10) / 100) * CANVAS_WIDTH;
        const h = ((deco.height ?? 4) / 100) * CANVAS_HEIGHT;
        ctx.fillRect(x, y, w, h);
        break;
      }
      case 'circle': {
        const r = ((deco.radius ?? 10) / 100) * CANVAS_WIDTH;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'line': {
        const w = ((deco.width ?? 20) / 100) * CANVAS_WIDTH;
        ctx.lineWidth = deco.height ?? 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.stroke();
        break;
      }
      case 'gradient-overlay': {
        // Not currently used in presets but available for custom
        break;
      }
    }
    ctx.restore();
  }

  // Layer 3: Title
  ctx.fillStyle = scheme.textColor;
  ctx.font = `700 ${scheme.titleFontSize}px ${scheme.fontFamily}`;
  ctx.textAlign = scheme.titleAlign;
  ctx.textBaseline = 'middle';

  const maxWidth = CANVAS_WIDTH - 120;
  const titleX = scheme.titleAlign === 'center' ? CANVAS_WIDTH / 2 : 60;
  const titleY = scheme.showSubtitle ? CANVAS_HEIGHT / 2 - 30 : CANVAS_HEIGHT / 2;

  wrapText(ctx, title, titleX, titleY, maxWidth, scheme.titleFontSize * 1.4);

  // Layer 4: Subtitle (optional)
  if (scheme.showSubtitle && subtitle) {
    ctx.fillStyle = scheme.subtitleColor;
    ctx.font = `400 ${Math.round(scheme.titleFontSize * 0.45)}px ${scheme.fontFamily}`;

    const subY = titleY + scheme.titleFontSize * 1.0 + 20;
    wrapText(ctx, subtitle, titleX, subY, maxWidth, scheme.titleFontSize * 0.7);
  }
}

/**
 * Word-wrap helper — draws text with line breaks at word boundaries.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const words = text.split('');
  let line = '';
  let currentY = y;
  const align = ctx.textAlign;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line.length > 0) {
      const drawX = align === 'center' ? x : x;
      ctx.fillText(line.trim(), drawX, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  const drawX = align === 'center' ? x : x;
  ctx.fillText(line.trim(), drawX, currentY);
}

/**
 * Generate cover as both dataURL and Blob (for different use cases).
 */
export function generateCover(
  scheme: CoverScheme,
  title: string,
  subtitle: string,
): { dataURL: string; blob: Blob } {
  // Render at full resolution
  const canvas = document.createElement('canvas');
  renderCoverToCanvas(canvas, scheme, title, subtitle);

  // Crop to export size (900x383 — top portion)
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = EXPORT_WIDTH;
  exportCanvas.height = EXPORT_HEIGHT;
  const exportCtx = exportCanvas.getContext('2d')!;
  exportCtx.drawImage(canvas, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  const dataURL = exportCanvas.toDataURL('image/png');
  // Also get blob (for file save and WeChat upload)
  // We'll convert dataURL to blob as needed

  return { dataURL, blob: dataURLtoBlob(dataURL) };
}

function dataURLtoBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] ?? 'image/png';
  const bytes = atob(parts[1]);
  const buffer = new ArrayBuffer(bytes.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    view[i] = bytes.charCodeAt(i);
  }
  return new Blob([buffer], { type: mime });
}

/**
 * Get dataURL from a Blob (for preview / clipboard).
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
