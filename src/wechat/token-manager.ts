/**
 * WeChat Access Token Manager
 * Caches token for 2 hours, refreshes 5 minutes before expiry.
 */

export class WechatTokenManager {
  private accessToken: string | null = null;
  private expiresAt: number = 0; // timestamp in ms

  async getToken(appId: string, appSecret: string): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt - 300_000) {
      return this.accessToken;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Token request failed: HTTP ${resp.status}`);
    }

    const data = await resp.json();

    if (data.errcode) {
      throw new Error(`WeChat token error: [${data.errcode}] ${data.errmsg}`);
    }

    const token: string = data.access_token;
    this.accessToken = token;
    this.expiresAt = Date.now() + (data.expires_in ?? 7200) * 1000;
    return token;
  }

  /** Force clear the cached token (e.g., if a call fails with 40001) */
  clearToken(): void {
    this.accessToken = null;
    this.expiresAt = 0;
  }
}
