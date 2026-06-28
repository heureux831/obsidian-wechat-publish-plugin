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

## 排版主题

| 主题 | 灵感 |
|------|------|
| 基础 | 默认样式，适合通用场景 |
| 素笺 | 米白纸色 + 衬线体，适合随笔散文 |
| 白描 | 极简黑白 + 左侧竖线，适合技术文章 |
| 柿染 | 暖柿色渐变 + 圆晕层次，适合生活分享 |
| 青瓷 | 青釉色 + 顶部色条，适合产品分析 |
| 苔色 | 绿调有机重叠圆，适合自然读书笔记 |
| 墨韵 | 墨色底 + 淡金点缀，适合深度阅读 |

## 封面方案

| 方案 | 特点 |
|------|------|
| 素笺 | 米黄纸感渐变 + 大圆底衬 + 点阵纹理 |
| 白描 | 纯白背景 + 左侧粗竖线强调 + 极简排版 |
| 柿染 | 柿色暖光 + 多层圆叠加 + 有机手工感 |
| 青瓷 | 青釉渐变 + 顶部细色条 + 斜矩形点缀 |
| 苔色 | 绿调渐变 + 重叠柔圆 + 自然清新 |
| 墨韵 | 墨色底 + 金色淡光晕 + 点阵星空感 |

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
