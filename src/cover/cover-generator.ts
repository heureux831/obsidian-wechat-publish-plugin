import { CoverScheme } from './schemes';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const EXPORT_WIDTH = 900;
const EXPORT_HEIGHT = 383;

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

  // ── Layer 1: Background ──
  if (scheme.gradient) {
    const rad = (scheme.gradient.angle * Math.PI) / 180;
    const dirX = Math.cos(rad);
    const dirY = Math.sin(rad);
    const diag = Math.sqrt(CANVAS_WIDTH * CANVAS_WIDTH + CANVAS_HEIGHT * CANVAS_HEIGHT);
    const half = diag / 2;
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;
    const grad = ctx.createLinearGradient(
      cx - dirX * half, cy - dirY * half,
      cx + dirX * half, cy + dirY * half,
    );
    grad.addColorStop(0, scheme.gradient.start);
    grad.addColorStop(1, scheme.gradient.end);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = scheme.backgroundColor;
  }
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // ── Layer 2: Decorations ──
  for (const deco of scheme.decorations) {
    ctx.save();
    ctx.globalAlpha = deco.opacity ?? 1;

    const x = (deco.x / 100) * CANVAS_WIDTH;
    const y = (deco.y / 100) * CANVAS_HEIGHT;

    switch (deco.type) {
      case 'rect': {
        const w = ((deco.width ?? 10) / 100) * CANVAS_WIDTH;
        const h = ((deco.height ?? 4) / 100) * CANVAS_HEIGHT;
        ctx.fillStyle = deco.color;
        if (deco.rotation) {
          ctx.translate(x + w / 2, y + h / 2);
          ctx.rotate((deco.rotation * Math.PI) / 180);
          ctx.fillRect(-w / 2, -h / 2, w, h);
        } else {
          ctx.fillRect(x, y, w, h);
        }
        break;
      }

      case 'circle': {
        const r = ((deco.radius ?? 10) / 100) * CANVAS_WIDTH;
        ctx.fillStyle = deco.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'large-circle': {
        const r = ((deco.radius ?? 30) / 100) * CANVAS_WIDTH;
        ctx.fillStyle = deco.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'line': {
        const w = ((deco.width ?? 20) / 100) * CANVAS_WIDTH;
        ctx.lineWidth = deco.height ?? 2;
        ctx.strokeStyle = deco.color;
        if (deco.rotation) {
          ctx.translate(x, y);
          ctx.rotate((deco.rotation * Math.PI) / 180);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(w, 0);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y);
          ctx.stroke();
        }
        break;
      }

      case 'accent-bar': {
        // A full-width or partial-width colored bar — clean, bold
        const w = ((deco.width ?? 100) / 100) * CANVAS_WIDTH;
        const h = ((deco.height ?? 4) / 100) * CANVAS_HEIGHT;
        ctx.fillStyle = deco.color;
        if (deco.rotation) {
          ctx.translate(x + w / 2, y + h / 2);
          ctx.rotate((deco.rotation * Math.PI) / 180);
          ctx.fillRect(-w / 2, -h / 2, w, h);
        } else {
          ctx.fillRect(x, y, w, h);
        }
        break;
      }

      case 'dot-grid': {
        // A grid of small dots — editorial texture
        const gw = ((deco.width ?? 20) / 100) * CANVAS_WIDTH;
        const gh = ((deco.height ?? 10) / 100) * CANVAS_HEIGHT;
        const spacing = 30;
        const dotRadius = 1.5;
        ctx.fillStyle = deco.color;
        const cols = Math.floor(gw / spacing);
        const rows = Math.floor(gh / spacing);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            ctx.beginPath();
            ctx.arc(x + c * spacing, y + r * spacing, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      }
    }

    ctx.restore();
  }

  // ── Layer 3: Title ──
  ctx.fillStyle = scheme.textColor;
  if (scheme.textShadow) {
    ctx.shadowColor = scheme.textShadow.split(' ').slice(-2)[0] || 'rgba(0,0,0,0.3)';
    // Parse the text shadow roughly for blur + offset
    const parts = scheme.textShadow.split(' ');
    if (parts.length >= 3) {
      ctx.shadowOffsetX = parseInt(parts[0]) || 0;
      ctx.shadowOffsetY = parseInt(parts[1]) || 1;
      ctx.shadowBlur = parseInt(parts[2]) || 2;
    }
  }
  ctx.font = `700 ${scheme.titleFontSize}px ${scheme.fontFamily}`;
  ctx.textAlign = scheme.titleAlign;
  ctx.textBaseline = 'middle';

  const maxWidth = CANVAS_WIDTH - 120;
  const titleX = scheme.titleAlign === 'center' ? CANVAS_WIDTH / 2 : 60;
  const titleY = scheme.showSubtitle ? CANVAS_HEIGHT / 2 - 30 : CANVAS_HEIGHT / 2;

  wrapText(ctx, title, titleX, titleY, maxWidth, scheme.titleFontSize * 1.4);

  // ── Layer 4: Subtitle ──
  ctx.shadowColor = 'transparent';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;

  if (scheme.showSubtitle && subtitle) {
    ctx.fillStyle = scheme.subtitleColor;
    ctx.font = `400 ${Math.round(scheme.titleFontSize * 0.42)}px ${scheme.fontFamily}`;

    const subY = titleY + scheme.titleFontSize * 1.0 + 20;
    wrapText(ctx, subtitle, titleX, subY, maxWidth, scheme.titleFontSize * 0.65);
  }
}

/**
 * Character-level word wrapping for CJK text.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const chars = text.split('');
  let line = '';
  let currentY = y;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line.length > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = chars[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

// ── Export ──

export function generateCover(
  scheme: CoverScheme,
  title: string,
  subtitle: string,
): { dataURL: string; blob: Blob } {
  const canvas = document.createElement('canvas');
  renderCoverToCanvas(canvas, scheme, title, subtitle);

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = EXPORT_WIDTH;
  exportCanvas.height = EXPORT_HEIGHT;
  const exportCtx = exportCanvas.getContext('2d')!;
  exportCtx.drawImage(canvas, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  const dataURL = exportCanvas.toDataURL('image/png');
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

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
