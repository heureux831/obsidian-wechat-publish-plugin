# MoodCode Blog Publisher

Obsidian 插件 — 将笔记一键发布到微信公众号：排版、封面生成、一键推送到草稿箱。

## 工作流

```
Obsidian 写文章 → 选主题看预览 → 生成封面图 → 一键推送到微信草稿箱
```

配合 [claudian](https://github.com/YishenTu/claudian) 插件使用，在 Obsidian 里用 Claude Code 辅助写作，写完用本插件排版发布。

## 功能

- **主题排版** — 7 套预设 CSS 主题，Markdown 转微信公众号富文本 HTML
- **封面生成** — 6 套封面方案，Canvas 实时渲染，一键导出 PNG
- **一键推送** — 配置 AppID/AppSecret 后直接推送到微信公众号草稿箱
- **自定义主题** — 内置 CSS 编辑器，实时预览，保存为自定义主题

## 安装

1. 下载 `main.js`、`styles.css`、`manifest.json` 放到 vault 的 `.obsidian/plugins/moodcode-blog-publisher/` 目录下
2. 在 Obsidian 设置 → 第三方插件中启用 "MoodCode Blog Publisher"
3. 点击左侧 ribbon 图标（📨）打开面板

## 使用

### 排版

1. 在 Obsidian 中打开一篇笔记
2. 打开 MoodCode Publisher 面板，切换到"排版"标签
3. 在下拉菜单中选择主题，右侧实时预览效果
4. 点击"复制 HTML"粘贴到微信公众号编辑器

### 封面

1. 切换到"封面"标签
2. 标题自动取自笔记 frontmatter，也可手动修改
3. 选择配色方案，Canvas 实时预览
4. 点击"保存到 Vault"或"复制图片"

### 推送

1. 在插件设置中配置微信公众号 AppID 和 AppSecret
2. 确认排版效果和封面图
3. 点击"推送到微信草稿箱"
4. 前往微信公众号后台查看草稿箱

## 笔记 Frontmatter 约定

```yaml
---
title: 文章标题
subtitle: 可选副标题
cover-scheme: morandi    # 封面方案
theme: warm              # 排版主题
---
```

## 预设主题

| 主题 | 风格 |
|------|------|
| 基础 (Basic) | 默认样式，适合通用场景 |
| 墨 · 学术 | 莫兰迪色系，适合深度长文 |
| 简 · 黑白 | 极简黑白，适合技术干货 |
| 晨 · 暖橙 | 暖色调，适合生活随笔 |
| 海 · 冷蓝 | 冷色调，适合产品分析 |
| 森 · 墨绿 | 清新自然，适合读书笔记 |
| 夜 · 深色 | 深色背景，适合夜间阅读 |

## 封面方案

| 方案 | 风格 |
|------|------|
| 墨 · 学术 | 莫兰迪背景 + 居中衬线字体 |
| 简 · 黑白 | 白色背景 + 黑色边框装饰 |
| 晨 · 暖橙 | 暖色渐变 + 圆形装饰 |
| 海 · 冷蓝 | 蓝色渐变 + 顶部色条 |
| 森 · 墨绿 | 绿色渐变 + 几何圆形 |
| 夜 · 深色 | 深色背景 + 红色点缀线 |

## 开发

```bash
npm install
npm run dev    # watch 模式
npm run build  # 生产构建
```

## 参考

- [mdnice/markdown-nice](https://github.com/mdnice/markdown-nice) — 主题系统设计参考
- [eternityspring/article-tools](https://github.com/eternityspring/article-tools) — 封面生成与微信排版参考
- [YishenTu/claudian](https://github.com/YishenTu/claudian) — Obsidian Claude Code 集成插件
