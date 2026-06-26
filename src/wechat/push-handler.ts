import { App, Notice, TFile } from 'obsidian';
import { MoodCodeSettings } from '../settings';
import { ThemeRegistry } from '../theme/theme-registry';
import { renderWechatHTML } from '../theme/theme-engine';
import { getActiveNoteContent, getNoteTitle } from '../utils/file-utils';
import { WechatTokenManager } from './token-manager';
import { uploadCoverImage, createDraft } from './api';
import type { MainView } from '../ui/main-view';

export async function pushToWechatDraft(
  app: App,
  settings: MoodCodeSettings,
  themeRegistry: ThemeRegistry,
  mainView: MainView | null,
  lastActiveFile: TFile | null = null,
): Promise<void> {
  // === 1. Pre-checks ===

  if (!settings.wechatAppId || !settings.wechatAppSecret) {
    new Notice('❌ 请先在设置中配置微信公众号 AppID 和 AppSecret', 6000);
    return;
  }

  const content = await getActiveNoteContent(app, lastActiveFile);
  if (!content.trim()) {
    new Notice('❌ 当前笔记内容为空', 6000);
    return;
  }

  const title = getNoteTitle(app, lastActiveFile);
  if (!title || title === 'Untitled') {
    new Notice('❌ 请设置文章标题', 6000);
    return;
  }

  // === 2. Get cover dataURL ===

  let coverDataURL: string;
  if (mainView) {
    coverDataURL = mainView.getCoverDataURL();
  } else {
    new Notice('⚠️ 请先在封面面板生成封面图', 6000);
    return;
  }

  if (!coverDataURL) {
    new Notice('❌ 封面图未生成', 6000);
    return;
  }

  // Convert dataURL to Blob for upload
  const coverBlob = dataURLToBlob(coverDataURL);

  // === 3. Render WeChat HTML ===

  const selectedThemeId = settings.defaultTheme || 'basic';
  const themeCSS = themeRegistry.getThemeCSS(selectedThemeId);

  const loadingNotice = new Notice('⏳ 正在推送到微信草稿箱...', 0);

  let wechatHTML: string;
  try {
    wechatHTML = await renderWechatHTML(app, content, themeCSS);
  } catch (err) {
    loadingNotice.hide();
    new Notice(`❌ HTML 渲染失败: ${err}`, 8000);
    console.error('WeChat render error:', err);
    return;
  }

  // === 4. Get access token ===

  const tokenManager = new WechatTokenManager();
  let token: string;
  try {
    token = await tokenManager.getToken(settings.wechatAppId, settings.wechatAppSecret);
  } catch (err) {
    loadingNotice.hide();
    new Notice(`❌ 获取 access_token 失败: ${err}`, 8000);
    console.error('Token error:', err);
    return;
  }

  // === 5. Upload cover image ===

  let thumbMediaId: string;
  try {
    thumbMediaId = await uploadCoverImage(token, coverBlob);
  } catch (err) {
    loadingNotice.hide();
    new Notice(`❌ 封面上传失败: ${err}`, 8000);
    console.error('Upload error:', err);
    return;
  }

  // === 6. Create draft ===

  try {
    const result = await createDraft(token, title, wechatHTML, thumbMediaId);
    loadingNotice.hide();
    new Notice(
      `✅ 推送成功！草稿 ID: ${result.media_id}\n请前往微信公众号后台查看草稿箱`,
      8000,
    );
  } catch (err) {
    loadingNotice.hide();
    new Notice(`❌ 创建草稿失败: ${err}`, 8000);
    console.error('Draft error:', err);
  }
}

function dataURLToBlob(dataURL: string): Blob {
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
