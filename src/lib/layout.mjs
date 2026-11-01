import { config, currentSite, url, abs, escapeHtml, formatDate } from "./site.mjs";
import { icon, brandMark } from "./icons.mjs";
import { concepts, disciplines, edges, categories } from "../data/map.mjs";
import { ui, getLang, isEn, altPath, langMeta, lp } from "./i18n.mjs";

const categoryLabel = (category) => (isEn() ? categories[category].en : category);

const navItems = [
  { href: "/notes/", key: "notes" },
  { href: "/map/", key: "map" },
  { href: "/resources/", key: "resources" },
  { href: "/about/", key: "about" },
];

const themeScript = `(function(){try{var k='fa-theme';var s=localStorage.getItem(k);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(d?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.classList.add('js');}catch(e){document.documentElement.classList.add('js');}})();`;

function header(active, path) {
  const L = ui();
  const site = currentSite();
  const other = getLang() === "en" ? "zh" : "en";
  const otherMeta = langMeta[other];
  const switchAria = isEn()
    ? other === "zh"
      ? "Switch to Chinese"
      : "Switch to English"
    : other === "en"
      ? "切换到英文"
      : "切换到中文";
  const links = navItems
    .map(
      (item) =>
        `<a class="nav-link${item.key === active ? " is-active" : ""}" href="${url(lp(item.href))}"${item.key === active ? ' aria-current="page"' : ""}>${escapeHtml(L.nav[item.key])}</a>`,
    )
    .join("");

  return `<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="${url(lp("/"))}" aria-label="${escapeHtml(site.name)} · ${escapeHtml(L.homeLabel)}">
      ${brandMark(34)}
      <span class="brand-text"><span class="brand-word">${escapeHtml(site.wordmark)}</span><span class="brand-sub">${escapeHtml(L.brandSub)}</span></span>
    </a>
    <nav class="nav" id="site-nav" aria-label="${escapeHtml(L.mainNav)}">${links}</nav>
    <div class="tools">
      <button class="search-trigger" type="button" data-search-open aria-label="${escapeHtml(L.searchAria)}" aria-haspopup="dialog">
        ${icon("search", 17)}<span class="search-trigger-label">${escapeHtml(L.searchLabel)}</span><kbd>⌘K</kbd>
      </button>
      <a class="lang-switch" href="${url(altPath(path))}" hreflang="${otherMeta.htmlLang}" lang="${otherMeta.htmlLang}" aria-label="${escapeHtml(switchAria)}" title="${escapeHtml(switchAria)}">${escapeHtml(langMeta[getLang()].switchLabel)}</a>
      <button class="icon-button theme-toggle" type="button" data-theme-toggle aria-label="${escapeHtml(L.themeTitle)}" title="${escapeHtml(L.themeTitle)}">
        <span class="theme-icon theme-sun">${icon("sun", 18)}</span>
        <span class="theme-icon theme-moon">${icon("moon", 18)}</span>
      </button>
      <button class="icon-button menu-toggle" type="button" data-menu-toggle aria-label="${escapeHtml(L.menuOpen)}" aria-expanded="false" aria-controls="site-nav">
        <span class="menu-open-icon">${icon("menu", 20)}</span>
        <span class="menu-close-icon">${icon("close", 20)}</span>
      </button>
    </div>
  </div>
  <div class="scroll-progress" data-progress aria-hidden="true"></div>
</header>`;
}

function searchModal() {
  const L = ui();
  return `<div class="search-modal" data-search-modal data-search-index="${url(lp("/search.json"))}" hidden>
  <div class="search-backdrop" data-search-close></div>
  <div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
    <h2 class="visually-hidden" id="search-title">${escapeHtml(L.search.title)}</h2>
    <div class="search-bar">
      ${icon("search", 20)}
      <input type="search" data-search-input placeholder="${escapeHtml(L.search.placeholder)}" autocomplete="off" spellcheck="false" aria-label="${escapeHtml(L.searchAria)}">
      <kbd>${escapeHtml(L.search.esc)}</kbd>
    </div>
    <div class="search-results" data-search-results aria-live="polite">
      <p class="search-hint">${escapeHtml(L.search.hint)}</p>
    </div>
    <div class="search-footer">
      <span><kbd>↑</kbd><kbd>↓</kbd> ${escapeHtml(L.search.select)}</span>
      <span><kbd>↵</kbd> ${escapeHtml(L.search.open)}</span>
      <span class="search-count" data-search-count></span>
    </div>
  </div>
</div>`;
}

function footer(dateIso, dateLabel) {
  const L = ui();
  return `<footer class="site-footer">
  <div class="wrap footer-minimal">
    <div class="footer-identity">
      <p class="footer-signature">Fortune-Arterial</p>
      <p class="footer-updated">${escapeHtml(L.footerUpdated)}${isEn() ? ": " : "："}<time datetime="${escapeHtml(dateIso)}">${escapeHtml(dateLabel)}</time></p>
    </div>
    <a class="footer-top" href="#top" aria-label="${escapeHtml(L.backTop)}" title="${escapeHtml(L.backTop)}">${icon("arrowUp", 17)}</a>
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
  const L = ui();
  const site = currentSite();
  const locale = langMeta[getLang()];
  const fullTitle = title ? `${title} · ${site.name}` : site.title;
  const desc = description || site.description;
  const canonical = abs(path);
  const alternatePath = altPath(path);
  const alternateLang = getLang() === "en" ? "zh-CN" : "en";
  const ogImage = abs("/og.png");
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const datePart = (type) => dateParts.find((part) => part.type === type)?.value || "";
  const dateIso = `${datePart("year")}-${datePart("month")}-${datePart("day")}`;
  const dateLabel = isEn()
    ? formatDate(dateIso, "long")
    : `${datePart("year")}年${Number(datePart("month"))}月${Number(datePart("day"))}日`;

  const structured = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`
    : "";

  return `<!doctype html>
<html lang="${locale.htmlLang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="alternate" hreflang="${alternateLang}" href="${escapeHtml(abs(alternatePath))}">
<link rel="alternate" hreflang="${locale.htmlLang}" href="${escapeHtml(canonical)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f7f5ef" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d0f13" media="(prefers-color-scheme: dark)">
<meta name="author" content="${escapeHtml(site.author.name)}">
<meta name="generator" content="fortune-static">
<meta property="og:type" content="${escapeHtml(ogType)}">
<meta property="og:site_name" content="${escapeHtml(config.name)}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta property="og:locale" content="${locale.ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(fullTitle)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<link rel="icon" href="${url("/favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${url("/apple-touch-icon.png")}">
<link rel="alternate" type="application/rss+xml" title="${escapeHtml(site.name)} · RSS" href="${url(lp("/rss.xml"))}">
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
<a class="skip-link" href="#main">${escapeHtml(L.skip)}</a>
${header(active, path)}
<main id="main">${content}</main>
${footer(dateIso, dateLabel)}
<script type="application/json" id="fa-ui">${JSON.stringify({
  lang: getLang(),
  strings: {
    themeLight: L.themeLight,
    themeDark: L.themeDark,
    menuOpen: L.menuOpen,
    menuClose: L.menuClose,
    search: {
      unavailable: L.search.unavailable,
      noNotes: L.search.noNotes,
      recent: L.search.recent("{{n}}"),
      results: L.search.results("{{n}}"),
      none: L.search.none,
      notFound: L.search.notFound("{{q}}"),
      loading: L.search.loading,
      loadError: L.search.loadError,
    },
    post: { copySuccess: L.post.copySuccess, copyFail: L.post.copyFail, codeCopied: L.post.codeCopied, codeFail: L.post.codeFail },
    map: {
      all: L.map.all,
      lit: L.map.lit,
      close: L.map.close,
      related: L.map.related,
      independent: L.map.independent,
      readNote: L.map.readNote,
      emptyNote: L.map.emptyNote,
      filter: L.map.filter,
      clear: L.map.clear,
      discipline: L.map.discipline("{{n}}"),
      hint: L.map.hint,
      hintBody: L.map.hintBody,
    },
  },
}).replace(/</g, "\\u003c")}</script>
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
      ? `<a class="section-link" href="${escapeHtml(href)}">${escapeHtml(linkLabel || (isEn() ? "View all" : "查看全部"))} ${icon("arrowRight", 16)}</a>`
      : ""
  }
</div>`;
}

export function categoryBadge(category) {
  const meta = categories[category];
  const tone = meta?.tone || "muted";
  const label = isEn() ? meta?.en || category : category;
  return `<span class="category cat-${tone}"><i aria-hidden="true"></i>${escapeHtml(label)}</span>`;
}

export function postRow(post, index) {
  const L = ui();
  const tags = post.tags
    .slice(0, 3)
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");
  return `<article class="post-row" data-category="${escapeHtml(post.category)}" data-search="${escapeHtml(
    `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${categoryLabel(post.category)}`,
  )}">
  <a class="post-row-link" href="${url(post.url)}">
    <span class="post-index">${String(index + 1).padStart(2, "0")}</span>
    <div class="post-row-main">
      <div class="post-meta">
        ${categoryBadge(post.category)}
        <time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
        <span class="meta-sep" aria-hidden="true">·</span>
        <span>${escapeHtml(L.post.minutesShort(post.reading.minutes))}</span>
      </div>
      <h3 class="post-row-title">${escapeHtml(post.title)}</h3>
      <p class="post-row-excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="post-row-tags">${tags}</div>
    </div>
    <span class="post-row-arrow" aria-hidden="true">${icon("arrowRight", 20)}</span>
  </a>
</article>`;
}

export function renderMap({ mapId = "map", compact = false, concepts: mapConcepts = concepts } = {}) {
  const L = ui();
  const list = mapConcepts;
  const byId = new Map(list.map((concept) => [concept.id, concept]));
  const litCount = list.filter((concept) => concept.postUrl).length;
  const disciplineLabel = (discipline) => (isEn() ? discipline.en : discipline.name);

  const counts = Object.fromEntries(
    disciplines.map((discipline) => [
      discipline.id,
      list.filter((concept) => concept.disciplines.includes(discipline.id)).length,
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
      return `<path class="map-edge edge-${edge.type}" data-from="${edge.from}" data-to="${edge.to}" d="M${a.x} ${a.y} Q${cx} ${cy} ${b.x} ${b.y}"><title>${escapeHtml(a.displayName)} — ${escapeHtml(b.displayName)}</title></path>`;
    })
    .join("\n      ");

  const nodes = list
    .map((concept) => {
      const lit = Boolean(concept.postUrl);
      const primary = disciplines.find((d) => d.id === concept.disciplines[0]);
      const secondary = disciplines.find((d) => d.id === concept.disciplines[1]);
      return `<g class="map-node ${lit ? "is-lit" : "is-empty"}" transform="translate(${concept.x} ${concept.y})" data-id="${concept.id}" data-disciplines="${concept.disciplines.join(" ")}" tabindex="0" role="button" aria-label="${escapeHtml(L.map.nodeAria(concept.displayName, lit))}">
        <circle class="node-halo" r="25"></circle>
        <circle class="node-ring" r="11" style="--node:${primary?.color || "#888"};--node-2:${secondary?.color || primary?.color || "#888"}"></circle>
        <circle class="node-core" r="5.5" style="--node:${primary?.color || "#888"}"></circle>
        <text class="node-label" y="33" text-anchor="middle">${escapeHtml(concept.displayName)}</text>
      </g>`;
    })
    .join("\n      ");

  const data = {
    litCount,
    total: list.length,
    disciplines: disciplines.map((discipline) => ({ ...discipline, name: disciplineLabel(discipline) })),
    concepts: list.map((concept) => ({
      id: concept.id,
      name: concept.displayName,
      altName: concept.altName,
      disciplines: concept.disciplines,
      summary: concept.displaySummary,
      postUrl: concept.postUrl,
      postTitle: concept.postTitle,
      related: edges
        .filter((edge) => edge.from === concept.id || edge.to === concept.id)
        .map((edge) => (edge.from === concept.id ? edge.to : edge.from)),
    })),
  };

  const chips = [
    `<button class="map-chip is-active" type="button" data-discipline="all">${escapeHtml(L.map.all)} <span>${list.length}</span></button>`,
    ...disciplines.map(
      (discipline) =>
        `<button class="map-chip" type="button" data-discipline="${discipline.id}" style="--node:${discipline.color}"><i aria-hidden="true"></i>${escapeHtml(disciplineLabel(discipline))} <span>${counts[discipline.id]}</span></button>`,
    ),
  ].join("");

  return `<div class="map" data-map>
  <div class="map-toolbar">
    <div class="map-filters" data-map-filters aria-label="${escapeHtml(isEn() ? "Filter by discipline" : "按学科筛选")}">${chips}</div>
    <p class="map-legend"><span class="legend-dot is-lit"></span>${escapeHtml(L.map.hasNotes)}<span class="legend-dot is-empty"></span>${escapeHtml(L.map.pending)}</p>
    <p class="map-swipe">${escapeHtml(L.map.swipe)}</p>
  </div>
  <div class="map-stage${compact ? " is-compact" : ""}">
    <div class="map-scroll">
      <svg class="knowledge-map" viewBox="0 0 1000 600" role="group" aria-labelledby="${mapId}-title">
        <title id="${mapId}-title">${escapeHtml(L.map.svgTitle)}</title>
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
        <p class="map-panel-lead">${escapeHtml(L.map.panelLead)}</p>
        <p class="map-panel-meta"><strong>${litCount}</strong> / ${list.length} ${escapeHtml(isEn() ? "explored" : "已点亮")}</p>
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
  const L = ui();
  return `<aside class="post-aside">
    <details class="toc-box" open>
      <summary>${escapeHtml(L.post.toc)}</summary>
      ${tocMarkup(post.toc)}
    </details>
    <button class="share-button" type="button" data-copy-link>${icon("link", 15)}<span>${escapeHtml(L.post.copyLink)}</span></button>
    <a class="aside-back" href="${url(lp("/notes/"))}">${icon("arrowLeft", 14)} ${escapeHtml(L.post.allNotes)}</a>
  </aside>`;
}
