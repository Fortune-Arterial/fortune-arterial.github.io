# Fortune Arterial

个人数学笔记，线上地址：**<https://fortune-arterial.github.io>**

独立设计、独立实现的静态站点。主题是**数学分析、高等代数与解析几何**：记录定义、定理、证明与反例，以及三门课之间的联系。站点提供完整的中英文版本，右上角可随时切换。

当前已发布三篇起始笔记，知识地图、搜索、RSS 与部署流程都已跑通。推送 `main` 即自动构建并发布到 GitHub Pages。

![首页预览](docs/preview.png)

## 现在的状态

| 部分 | 状态 |
| --- | --- |
| 首页 / 笔记 / 知识地图 / 关于 / 资源 / 404 | 已完成 |
| Markdown 文章系统、KaTeX、代码高亮、提示框 | 已完成 |
| 全文搜索、明暗主题、RSS、sitemap、SEO | 已完成 |
| 中英文双语（`/` 与 `/en/`） | 全部页面、文章、搜索、地图、RSS 已接通 |
| 知识地图（15 个概念、3 个学科） | 交互已完成，3 个节点已由笔记点亮 |
| 文章 | **3 篇**：极限、线性映射、二次曲线 |
| GitHub Actions 部署 | 已完成，线上运行中 |
| 线上地址 | <https://fortune-arterial.github.io> |

## 技术栈

纯静态站点，没有前端框架，没有数据库，没有运行时服务。

- **构建**：一段 Node 脚本（`src/build.mjs` + `src/lib/`）
- **写作**：Markdown + YAML front matter
- **公式**：KaTeX 在构建时渲染为静态 HTML
- **样式**：手写 CSS，自托管 Inter / Instrument Serif / JetBrains Mono / Bodoni Moda
- **交互**：原生 JavaScript，负责搜索、主题、目录、筛选与知识地图
- **部署**：GitHub Actions → GitHub Pages

## 快速开始

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

打开 <http://127.0.0.1:4321>。修改 `content/`、`src/` 或 `site.config.mjs` 后会自动重建。

其他命令：

```bash
npm run build     # 生成 dist/
npm run preview   # 预览已构建的 dist/
npm run new -- my-note "一篇新笔记"   # 创建草稿
```

## 写作

中文文章放在 `content/posts/*.md`，英文文章放在 `content/en/posts/*.md`，两边的文件名和 slug 保持一致：

```
content/posts/epsilon-delta.md     →  /notes/epsilon-delta/
content/en/posts/epsilon-delta.md  →  /en/notes/epsilon-delta/
```

英文页面的界面文案在 `src/lib/i18n.mjs`，英文页面正文在 `content/en/pages/`。`category` 字段两种语言都使用同一组中文键（`数学分析` / `高等代数` / `解析几何`），页面会根据当前语言显示对应英文名；`concepts` 也共用同一组 ID。

Front matter 示例：

```yaml
---
title: "ε–δ 到底在说什么"
subtitle: "把「无限接近」翻译成量词顺序"
date: "2026-10-28"
category: "数学分析"
tags: ["极限", "ε–δ", "量词", "连续"]
concepts: ["limit", "derivative"]
excerpt: "极限的定义难，不难在 ε 和 δ，而难在「对任意」与「存在」的先后顺序。"
draft: false
---
```

- `category` 必须是 `src/data/map.mjs` 中 `categories` 的键：`数学分析` / `高等代数` / `解析几何`（英文文章也用这些键）。
- `concepts` 是知识地图里的概念 ID。**第一个概念是文章的主节点**，会点亮地图；其余概念用于关联与相关阅读。
- 当前概念 ID：`limit`、`derivative`、`mvt`、`integral`、`series`、`linear-space`、`linear-map`、`matrix`、`eigen`、`quadratic-form`、`vector`、`line-plane`、`conic`、`quadric`、`curvature`。
- `draft: true` 的文章不会进入构建。
- 公式：行内 `$x_t$`，独立成行 `$$ ... $$`。
- 提示框：

  ```md
  ::: note 直觉
  这里是一段补充说明。
  :::
  ```

  支持 `note`、`tip`、`warn`。
- 英文文章沿用相同的 front matter；`title`、`subtitle`、`tags`、`excerpt` 写英文即可。
- 图片放在 `public/images/`。用户站点可以用 `/images/xxx.png`；如果部署在子路径，请写完整的 `basePath` 路径，或使用相对路径。Markdown 中的图片地址不会被自动加上 `basePath`。

详细规范见 [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md)。

新增概念：编辑 `src/data/map.mjs`，添加节点（含 `x` / `y` 坐标）与连线，然后把概念 ID 写进文章 front matter。

## 把它变成你的

站点身份已经指向你：

```js
siteUrl: "https://fortune-arterial.github.io",
basePath: "/",
name: "Fortune Arterial",
wordmark: "FORTUNE",
socials: [
  { label: "GitHub", href: "https://github.com/fortune-arterial", icon: "github" },
  { label: "RSS", href: "/rss.xml", icon: "rss" },
],
```

可以继续补充的：

- [ ] `site.config.mjs` 中的 `author.email`（留空时页脚显示 GitHub；填上后显示邮箱）与 `author.location`
- [ ] `content/pages/about.md` 里的自我介绍
- [ ] `src/data/resources.mjs` 里的资源清单
- [ ] `public/og.png` 社交分享卡片（1200×630）
- [ ] `public/apple-touch-icon.png` 与 `public/favicon.svg`（可选）
- [ ] `LICENSE` 中的版权人
- [ ] 知识地图 `src/data/map.mjs` 中的概念与坐标

### 部署到 GitHub Pages

目标仓库叫 **`fortune-arterial.github.io`**，当前部署已经配置好：

1. 推送 `main`。
2. GitHub Actions 运行 `Deploy to GitHub Pages`。
3. 发布完成后访问 <https://fortune-arterial.github.io>。

仓库的 **Settings → Pages → Build and deployment** 中，Source 需要是 **GitHub Actions**。构建产物 `dist/` 不进入版本库。

**自定义域名**：在 Pages 设置中绑定域名，把 `siteUrl` 改为 `https://your-domain.com`、`basePath` 保持 `/`，并在 `public/` 下添加内容为域名的 `CNAME` 文件。

**项目站点**（`https://<username>.github.io/<repo>`）：把 `basePath` 改为 `/<repo>/`，`siteUrl` 写 `https://<username>.github.io/<repo>` 或只写域名均可（`abs()` 会避免重复拼接），重新构建即可。

> `basePath` 必须以 `/` 开头和结尾。导航、字体、图片、RSS 与搜索索引都会自动加上这个前缀；Markdown 正文里的绝对图片路径需要自行处理。

## 资源详情页

LaTeX 模板卡片会进入各自的详情页：`/resources/fortune-book/` 与 `/resources/latex-formula-sheet/`（英文为 `/en/resources/...`）。详情页左侧是可上下滚动的完整 PDF 预览，右侧提供 ZIP 源文件与 PDF 两个下载按钮。

- 预览页图：`public/previews/<slug>/page-XX.png`（构建时按 `preview.pages` 全部输出）
- 源文件：`public/downloads/latex/`
- 详情页数据：`src/data/resources.mjs` 中对应 item 的 `detail`、`preview`、`sourceNote`

## 项目结构

```
.
├── content/
│   ├── pages/about.md          # 关于页正文
│   └── posts/                  # 已发布文章
├── public/                     # favicon、OG 图、字体、图片
├── scripts/                    # dev / preview / new-post
├── src/
│   ├── build.mjs               # 构建入口与页面模板
│   ├── data/map.mjs            # 知识地图数据
│   ├── data/resources.mjs      # 资源页数据
│   ├── lib/
│   │   ├── content.mjs         # 读取、校验、排序文章
│   │   ├── markdown.mjs        # Markdown + KaTeX + 代码高亮
│   │   ├── layout.mjs          # 页头、页脚、地图、搜索弹窗
│   │   └── site.mjs            # URL、日期、阅读时间等工具
│   ├── scripts/site.js         # 客户端交互
│   └── styles/site.css         # 全部样式
├── site.config.mjs             # 站点配置
└── .github/workflows/deploy.yml
```

构建时会复制 `public/`、CSS、JS、字体与 KaTeX 资源，并生成：

```
dist/
├── index.html
├── notes/index.html
├── map/index.html
├── about/index.html
├── resources/index.html
├── resources/fortune-book/index.html
├── resources/latex-formula-sheet/index.html
├── 404.html
├── search.json
├── rss.xml
├── sitemap.xml
├── robots.txt
└── assets/…
```

有文章时还会生成 `notes/<slug>/index.html`，并自动更新首页、笔记列表、搜索索引、RSS 与 sitemap。

## 设计说明

- **排版**：Instrument Serif（标题）+ Inter（正文/界面）+ JetBrains Mono（标签与数字）+ Bodoni Moda Italic（About 艺术署名），中文回退到宋体/苹方；资源详情页标题与 LaTeX 模板卡片标题使用 Times New Roman。字体自托管在 `public/fonts/`。
- **颜色**：暖纸色背景、钴蓝强调色、浅色页脚。token 在 `src/styles/site.css` 顶部的 `:root` 与 `[data-theme="dark"]`。
- **知识地图**：坐标基于 1000×600 画布，构建时生成 SVG，交互由 `site.js` 完成。三个学科各有自己的颜色；笔记点亮对应节点。
- **无跟踪**：默认不加载任何统计或分析脚本。

## 常见问题

**想加一篇新文章？** 运行 `npm run new -- <slug> "标题"`，编辑生成的文件，把 `draft` 改为 `false`，再 `npm run build`。

**知识地图上的节点没有点亮？** 检查文章的 `concepts` 是否包含地图里的 ID，并且文章不是草稿。

**页面样式或链接 404？** 检查 `basePath` 是否与部署路径一致，然后重新构建。

**Actions 部署失败？** 确认 Settings → Pages 的 Source 是 GitHub Actions，并允许 workflow 的 `pages: write` 权限（已写在 workflow 中）。

**公式显示为源码？** 确认安装了 `katex` 依赖，并检查构建日志；公式只在构建时渲染。

**想换主题色？** 修改 `site.css` 中的 `--accent`（亮色）与 `[data-theme="dark"]` 下的 `--accent`。分类颜色在 `.cat-*` 规则中。

## 许可

- 代码：[MIT](LICENSE)
- 文字内容：CC BY-NC-SA 4.0

“Fortune Arterial”是站点当前的品牌名，可在 `site.config.mjs` 中修改。
