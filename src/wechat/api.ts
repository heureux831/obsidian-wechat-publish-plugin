const WECHAT_API_BASE = 'https://api.weixin.qq.com/cgi-bin';

/**
 * Upload an image as permanent material to WeChat.
 * Returns the media_id needed for draft creation.
 */
export async function uploadCoverImage(token: string, imageBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('media', imageBlob, 'cover.png');
  formData.append('type', 'image');

  const url = `${WECHAT_API_BASE}/material/add_material?access_token=${token}&type=image`;

  const resp = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await resp.json();

  if (data.errcode) {
    throw new Error(`WeChat upload error: [${data.errcode}] ${data.errmsg}`);
  }

  return data.media_id;
}

/**
 * Create a draft in WeChat Official Account draft box.
 */
export async function createDraft(
  token: string,
  title: string,
  content: string,
  thumbMediaId: string,
): Promise<{ media_id: string }> {
  const url = `${WECHAT_API_BASE}/draft/add?access_token=${token}`;

  const body = {
    articles: [
      {
        title,
        content,
        thumb_media_id: thumbMediaId,
        need_open_comment: 0,
        show_cover_pic: 1,
        content_source_url: '',
      },
    ],
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  if (data.errcode) {
    throw new Error(`WeChat draft error: [${data.errcode}] ${data.errmsg}`);
  }

  return { media_id: data.media_id };
}

/**
 * Map common WeChat error codes to Chinese messages.
 */
export function wechatErrorMessage(errcode: number): string {
  const messages: Record<number, string> = {
    40001: 'access_token 无效或已过期',
    40007: '不支持的媒体文件类型',
    40009: '图片文件大小超出限制',
    41001: '缺少 access_token 参数',
    42001: 'access_token 超时',
    43002: '需要 POST 请求',
    44002: '请求体为空',
    45001: '多媒体文件大小超出限制',
    48001: 'API 未授权',
  };
  return messages[errcode] ?? `未知错误 (${errcode})`;
}
