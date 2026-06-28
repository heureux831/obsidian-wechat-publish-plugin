/**
 * WeChat HTML sanitizer — handles constraints that WeChat enforces:
 * - Links are not clickable in WeChat body text → convert to footnotes
 * - Images must be properly styled for WeChat layout
 *
 * All functions operate on HTML strings and return modified HTML strings.
 */

/**
 * Convert <a href="URL">text</a> to text [注：URL].
 * WeChat body text links are not clickable, so we turn them into
 * visible footnotes.
 */
export function sanitizeLinks(html: string): string {
  return html.replace(
    /<a\s+(?:[^>]*?\s+)?href\s*=\s*"([^"]*)"[^>]*>(.*?)<\/a>/gi,
    (_match: string, url: string, text: string) => {
      // Skip internal anchors
      if (url.startsWith('#')) return _match;
      return `${text} [注：${url}]`;
    },
  );
}

/**
 * Ensure images have proper sizing for WeChat.
 * Adds max-width:100% and height:auto to images that lack explicit width.
 */
export function sanitizeImages(html: string): string {
  return html.replace(
    /<img\s+([^>]*?)src\s*=\s*"([^"]*)"([^>]*)>/gi,
    (_match: string, before: string, src: string, after: string) => {
      const hasWidth = before.includes('width') || after.includes('width');
      if (hasWidth) return _match;

      // Add responsive style to existing style attribute
      if (before.includes('style=')) {
        const newBefore = before.replace(
          /style="([^"]*)"/,
          'style="$1;max-width:100%;height:auto"',
        );
        return `<img ${newBefore}src="${src}"${after}>`;
      }

      // Handle style attribute that appears after src
      if (after.includes('style=')) {
        const newAfter = after.replace(
          /style="([^"]*)"/,
          'style="$1;max-width:100%;height:auto"',
        );
        return `<img ${before}src="${src}"${newAfter}>`;
      }

      // Add a new style attribute
      return `<img ${before}src="${src}" style="max-width:100%;height:auto"${after}>`;
    },
  );
}

/**
 * Wrap body HTML in a full HTML document with theme CSS in a <style> tag.
 * Used for iframe-based preview in Obsidian.
 */
export function wrapInNiceContainer(bodyHtml: string, themeCSS: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>html,body{background:#fff;}${themeCSS}</style>
</head>
<body>
<div id="nice">${bodyHtml}</div>
</body>
</html>`;
}

/**
 * Wrap body HTML in a #nice container div only (no full document).
 * Used before juice CSS inlining — juice needs the CSS in a <style> tag
 * next to the HTML it inlines.
 */
export function wrapForInline(bodyHtml: string): string {
  return `<div id="nice">${bodyHtml}</div>`;
}
