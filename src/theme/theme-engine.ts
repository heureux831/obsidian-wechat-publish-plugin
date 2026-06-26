import { App, Component, MarkdownRenderer } from 'obsidian';
import juice from 'juice';
import {
  sanitizeLinks,
  sanitizeImages,
  wrapInNiceContainer,
  wrapForInline,
} from './wechat-sanitizer';

/**
 * Use Obsidian's built-in MarkdownRenderer to convert Markdown to HTML.
 * This preserves Obsidian-specific features (wikilinks, embeds, etc.).
 */
async function renderMarkdownToHTML(app: App, mdContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    const component = new Component();

    MarkdownRenderer.render(app, mdContent, div, '', component)
      .then(() => {
        const html = div.innerHTML;
        component.unload();
        resolve(html);
      })
      .catch((err: Error) => {
        component.unload();
        reject(err);
      });
  });
}

/**
 * Render Markdown to a full HTML page with theme CSS in a <style> tag.
 * Used for preview in an iframe within Obsidian.
 *
 * @param app - The Obsidian App instance
 * @param mdContent - Raw Markdown string
 * @param themeCSS - CSS string to embed in the <style> tag
 * @returns A complete HTML document string
 */
export async function renderPreviewHTML(
  app: App,
  mdContent: string,
  themeCSS: string,
): Promise<string> {
  const bodyHtml = await renderMarkdownToHTML(app, mdContent);
  return wrapInNiceContainer(bodyHtml, themeCSS);
}

/**
 * Render Markdown to WeChat-ready HTML.
 *
 * Pipeline:
 * 1. Convert Markdown → HTML via Obsidian's MarkdownRenderer
 * 2. Sanitize for WeChat (links → footnotes, image sizing fixes)
 * 3. Inline CSS into style attributes via juice (WeChat strips <style> tags)
 *
 * @param app - The Obsidian App instance
 * @param mdContent - Raw Markdown string
 * @param themeCSS - CSS string to inline as style attributes
 * @returns WeChat-ready HTML string with all styles inlined
 */
export async function renderWechatHTML(
  app: App,
  mdContent: string,
  themeCSS: string,
): Promise<string> {
  let bodyHtml = await renderMarkdownToHTML(app, mdContent);

  // WeChat-specific sanitization
  bodyHtml = sanitizeLinks(bodyHtml);
  bodyHtml = sanitizeImages(bodyHtml);

  // Wrap in #nice container, embed CSS in <style> tag, then inline
  const htmlWithStyle = `<div><style>${themeCSS}</style>${wrapForInline(bodyHtml)}</div>`;
  const inlined = juice(htmlWithStyle);

  return inlined;
}
