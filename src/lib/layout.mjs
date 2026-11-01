import { config, url, abs, escapeHtml, formatDate } from "./site.mjs";
import { icon, brandMark } from "./icons.mjs";
import { concepts, disciplines, edges, categories } from "../data/map.mjs";

export const nav = [
  { label: "笔记", href: "/notes/", key: "notes" },
  { label: "知识地图", href: "/map/", key: "map" },
  { label: "资源", href: "/resources/", key: "resources" },
  { label: "关于", href: "/about/", key: "about" },
];

const themeScript = `(function(){try{var k='fa-theme';var s=localStorage.getItem(k);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(d?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.classList.add('js');}catch(e){document.documentElement.classList.add('js');}})();`;

function header(active) {
  const links = nav
    .map(
      (item) =>
        `<a class="nav-link${item.key === active ? " is-active" : ""}" href="${url(item.href)}"${item.key === active ? ' aria-current="page"' : ""}>${item.label}</a>`,
    )
    .join("");

  return `<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="${url("/")}" aria-label="${escapeHtml(config.name)} · 首页">
      ${brandMark(34)}
      <span class="brand-text"><span class="brand-word">${escapeHtml(config.wordmark)}</span><span class="brand-sub">笔记</span></span>
    </a>
    <nav class="nav" id="site-nav" aria-label="主导航">${links}</nav>
    <div class="tools">
      <button class="search-trigger" type="button" data-search-open aria-label="搜索笔记" aria-haspopup="dialog">
        ${icon("search", 17)}<span class="search-trigger-label">搜索</span><kbd>⌘K</kbd>
      </button>
      <button class="icon-button theme-toggle" type="button" data-theme-toggle aria-label="切换深浅色" title="切换深浅色">
        <span class="theme-icon theme-sun">${icon("sun", 18)}</span>
        <span class="theme-icon theme-moon">${icon("moon", 18)}</span>
      </button>
      <button class="icon-button menu-toggle" type="button" data-menu-toggle aria-label="打开菜单" aria-expanded="false" aria-controls="site-nav">
        <span class="menu-open-icon">${icon("menu", 20)}</span>
        <span class="menu-close-icon">${icon("close", 20)}</span>
      </button>
    </div>
  </div>
  <div class="scroll-progress" data-progress aria-hidden="true"></div>
</header>`;
}

function searchModal() {
  return `<div class="search-modal" data-search-modal data-search-index="${url("/search.json")}" hidden>
  <div class="search-backdrop" data-search-close></div>
  <div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
    <h2 class="visually-hidden" id="search-title">搜索</h2>
    <div class="search-bar">
      ${icon("search", 20)}
      <input type="search" data-search-input placeholder="搜索笔记、概念、标签…" autocomplete="off" spellcheck="false" aria-label="搜索笔记">
      <kbd>ESC</kbd>
    </div>
    <div class="search-results" data-search-results aria-live="polite">
      <p class="search-hint">输入关键词开始搜索。支持标题、标签与正文内容。</p>
    </div>
    <div class="search-footer">
      <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
      <span><kbd>↵</kbd> 打开</span>
      <span class="search-count" data-search-count></span>
    </div>
  </div>
</div>`;
}

function footer(dateIso, dateLabel) {
  return `<footer class="site-footer">
  <div class="wrap footer-minimal">
    <p class="footer-signature">Fortune-Arterial</p>
    <p class="footer-updated">
      <span>LAST UPDATED</span>
      <time datetime="${escapeHtml(dateIso)}">${escapeHtml(dateLabel)}</time>
    </p>
  </div>
</footer>
${searchModal()}`;
}

export function layout({
  title,
  description,
  path = "/",
  active = "",
  bodyClass = "",
  content,
  ogType = "website",
  jsonLd = null,
  extraHead = "",
}) {
  const fullTitle = title ? `${title} · ${config.name}` : config.title;
  const desc = description || config.description;
  const canonical = abs(path);
  const ogImage = abs("/og.png");
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const datePart = (type) => dateParts.find((part) => part.type === type)?.value || "";
  const dateIso = `${datePart("year")}-${datePart("month")}-${datePart("day")}`;
  const dateLabel = dateIso.replaceAll("-", ".");

  const structured = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`
    : "";

  return `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f7f5ef" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d0f13" media="(prefers-color-scheme: dark)">
<meta name="author" content="${escapeHtml(config.author.name)}">
<meta name="generator" content="fortune-static">
<meta property="og:type" content="${escapeHtml(ogType)}">
<meta property="og:site_name" content="${escapeHtml(config.name)}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta property="og:locale" content="zh_CN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(fullTitle)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<link rel="icon" href="${url("/favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${url("/apple-touch-icon.png")}">
<link rel="alternate" type="application/rss+xml" title="${escapeHtml(config.name)} · RSS" href="${url("/rss.xml")}">
<link rel="sitemap" type="application/xml" href="${url("/sitemap.xml")}">
<link rel="preload" href="${url("/assets/fonts/inter-var.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url("/assets/fonts/instrument-serif-400.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${url("/assets/katex/katex.min.css")}">
<link rel="stylesheet" href="${url("/assets/site.css")}">
<script>${themeScript}</script>
${extraHead}
${structured}
</head>
<body class="${escapeHtml(bodyClass)}" id="top">
<a class="skip-link" href="#main">跳到正文</a>
${header(active)}
<main id="main">${content}</main>
${footer(dateIso, dateLabel)}
<script src="${url("/assets/site.js")}" defer></script>
</body>
</html>`;
}

export function sectionHead({ index, eyebrow, title, href, linkLabel }) {
  return `<div class="section-head">
  <div class="section-head-main">
    <p class="section-label"><span>${escapeHtml(index)}</span>${escapeHtml(eyebrow)}</p>
    <h2 class="section-title">${escapeHtml(title)}</h2>
  </div>
  ${
    href
      ? `<a class="section-link" href="${escapeHtml(href)}">${escapeHtml(linkLabel || "查看全部")} ${icon("arrowRight", 16)}</a>`
      : ""
  }
</div>`;
}

export function categoryBadge(category) {
  const tone = categories[category]?.tone || "muted";
  return `<span class="category cat-${tone}"><i aria-hidden="true"></i>${escapeHtml(category)}</span>`;
}

export function postRow(post, index) {
  const tags = post.tags
    .slice(0, 3)
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");
  return `<article class="post-row" data-category="${escapeHtml(post.category)}" data-search="${escapeHtml(
    `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.category}`,
  )}">
  <a class="post-row-link" href="${url(post.url)}">
    <span class="post-index">${String(index + 1).padStart(2, "0")}</span>
    <div class="post-row-main">
      <div class="post-meta">
        ${categoryBadge(post.category)}
        <time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
        <span class="meta-sep" aria-hidden="true">·</span>
        <span>${post.reading.minutes} 分钟</span>
      </div>
      <h3 class="post-row-title">${escapeHtml(post.title)}</h3>
      <p class="post-row-excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="post-row-tags">${tags}</div>
    </div>
    <span class="post-row-arrow" aria-hidden="true">${icon("arrowRight", 20)}</span>
  </a>
</article>`;
}

export function renderMap({ mapId = "map", compact = false } = {}) {
  const byId = new Map(concepts.map((concept) => [concept.id, concept]));
  const litCount = concepts.filter((concept) => concept.postUrl).length;

  const counts = Object.fromEntries(
    disciplines.map((discipline) => [
      discipline.id,
      concepts.filter((concept) => concept.disciplines.includes(discipline.id)).length,
    ]),
  );

  const edgePaths = edges
    .map((edge, index) => {
      const a = byId.get(edge.from);
      const b = byId.get(edge.to);
      if (!a || !b) return "";
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.hypot(dx, dy) || 1;
      const nx = -dy / length;
      const ny = dx / length;
      const bend = (index % 2 === 0 ? 1 : -1) * (edge.type === "contrast" ? 26 : 14);
      const cx = (a.x + b.x) / 2 + nx * bend;
      const cy = (a.y + b.y) / 2 + ny * bend;
      return `<path class="map-edge edge-${edge.type}" data-from="${edge.from}" data-to="${edge.to}" d="M${a.x} ${a.y} Q${cx} ${cy} ${b.x} ${b.y}"><title>${escapeHtml(a.name)} — ${escapeHtml(b.name)}</title></path>`;
    })
    .join("\n      ");

  const nodes = concepts
    .map((concept) => {
      const lit = Boolean(concept.postUrl);
      const primary = disciplines.find((d) => d.id === concept.disciplines[0]);
      const secondary = disciplines.find((d) => d.id === concept.disciplines[1]);
      return `<g class="map-node ${lit ? "is-lit" : "is-empty"}" transform="translate(${concept.x} ${concept.y})" data-id="${concept.id}" data-disciplines="${concept.disciplines.join(" ")}" tabindex="0" role="button" aria-label="${escapeHtml(concept.name)}，${lit ? "已有笔记" : "待写"}">
        <circle class="node-halo" r="25"></circle>
        <circle class="node-ring" r="11" style="--node:${primary?.color || "#888"};--node-2:${secondary?.color || primary?.color || "#888"}"></circle>
        <circle class="node-core" r="5.5" style="--node:${primary?.color || "#888"}"></circle>
        <text class="node-label" y="33" text-anchor="middle">${escapeHtml(concept.name)}</text>
      </g>`;
    })
    .join("\n      ");

  const data = {
    litCount,
    total: concepts.length,
    disciplines,
    concepts: concepts.map((concept) => ({
      id: concept.id,
      name: concept.name,
      en: concept.en,
      disciplines: concept.disciplines,
      summary: concept.summary,
      postUrl: concept.postUrl,
      postTitle: concept.postTitle,
      related: edges
        .filter((edge) => edge.from === concept.id || edge.to === concept.id)
        .map((edge) => (edge.from === concept.id ? edge.to : edge.from)),
    })),
  };

  const chips = [
    `<button class="map-chip is-active" type="button" data-discipline="all">全部 <span>${concepts.length}</span></button>`,
    ...disciplines.map(
      (discipline) =>
        `<button class="map-chip" type="button" data-discipline="${discipline.id}" style="--node:${discipline.color}"><i aria-hidden="true"></i>${escapeHtml(discipline.name)} <span>${counts[discipline.id]}</span></button>`,
    ),
  ].join("");

  return `<div class="map" data-map>
  <div class="map-toolbar">
    <div class="map-filters" data-map-filters aria-label="按学科筛选">${chips}</div>
    <p class="map-legend"><span class="legend-dot is-lit"></span>已有笔记<span class="legend-dot is-empty"></span>待写</p>
    <p class="map-swipe">左右滑动查看完整地图 →</p>
  </div>
  <div class="map-stage${compact ? " is-compact" : ""}">
    <div class="map-scroll">
      <svg class="knowledge-map" viewBox="0 0 1000 600" role="group" aria-labelledby="${mapId}-title">
        <title id="${mapId}-title">知识地图：概念之间的依赖、延伸与应用关系</title>
        <defs>
          <pattern id="${mapId}-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="var(--dot-color)"></circle>
          </pattern>
        </defs>
        <rect class="map-bg" x="0" y="0" width="1000" height="600" fill="url(#${mapId}-dots)"></rect>
        <g class="map-edges">${edgePaths}</g>
        <g class="map-nodes">${nodes}</g>
      </svg>
    </div>
    <aside class="map-panel" data-map-panel>
      <div class="map-panel-empty">
        <span class="map-panel-glyph" aria-hidden="true">✳</span>
        <p class="map-panel-kicker">CONCEPT MAP</p>
        <p class="map-panel-lead">点一个节点，这里会显示它的说明，以及它和其他节点之间的关系。</p>
        <p class="map-panel-meta"><strong>${litCount}</strong> / ${concepts.length} 已点亮</p>
      </div>
    </aside>
  </div>
  <script type="application/json" id="${mapId}-data">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
</div>`;
}

export function tocMarkup(toc) {
  if (!toc.length) return "";
  return `<ol class="toc-list">${toc
    .map(
      (item) =>
        `<li class="toc-item toc-level-${item.level}"><a href="#${item.id}">${escapeHtml(item.text)}</a></li>`,
    )
    .join("")}</ol>`;
}

export function postTocAside(post) {
  return `<aside class="post-aside">
    <details class="toc-box" open>
      <summary>本文目录</summary>
      ${tocMarkup(post.toc)}
    </details>
    <button class="share-button" type="button" data-copy-link>${icon("link", 15)}<span>复制链接</span></button>
    <a class="aside-back" href="${url("/notes/")}">${icon("arrowLeft", 14)} 全部笔记</a>
  </aside>`;
}
