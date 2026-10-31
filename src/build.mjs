import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config, url, abs, escapeHtml, formatDate } from "./lib/site.mjs";
import {
  layout,
  sectionHead,
  postRow,
  renderMap,
  postTocAside,
  categoryBadge,
} from "./lib/layout.mjs";
import { loadPosts, loadPage, attachConcepts, relatedPosts } from "./lib/content.mjs";
import { concepts, disciplines, categories } from "./data/map.mjs";
import { resourceGroups } from "./data/resources.mjs";
import { icon, brandMark } from "./lib/icons.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");

/* ------------------------------------------------------------------ */
/* Utilities                                                          */
/* ------------------------------------------------------------------ */

function write(route, html) {
  const clean = route.replace(/^\//, "");
  const target = route.endsWith("/")
    ? path.join(dist, clean, "index.html")
    : path.join(dist, clean);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  return route;
}

function categoryColor(category) {
  const discipline = disciplines.find((item) => item.id === categories[category]?.tone);
  return discipline?.color || "#777";
}

function socialHref(social) {
  return social.href.startsWith("/") ? url(social.href) : social.href;
}

/* ------------------------------------------------------------------ */
/* Home                                                               */
/* ------------------------------------------------------------------ */

function heroArt() {
  return `<div class="hero-art" aria-hidden="true">
  <div class="hero-art-card">
    <svg viewBox="0 0 460 460" fill="none">
      <circle class="art-ring" cx="230" cy="230" r="212" stroke-dasharray="2 7"></circle>
      <circle class="art-ring" cx="230" cy="230" r="158"></circle>
      <circle class="art-ring" cx="230" cy="230" r="104"></circle>
      <path class="art-axis" d="M230 12v436M12 230h436"></path>
      <g class="art-spin">
        <circle class="art-ring" cx="230" cy="230" r="185" stroke-dasharray="1 11"></circle>
        <circle class="art-satellite" cx="230" cy="45" r="4"></circle>
      </g>
      <path class="art-star" d="M230 100v260M115 165l230 130M345 165 115 295"></path>
      <circle class="art-core" cx="230" cy="230" r="7"></circle>
      <circle class="art-halo" cx="230" cy="230" r="22"></circle>
      <text class="art-label" x="52" y="78">lim</text>
      <text class="art-label" x="332" y="78">f′(x)</text>
      <text class="art-label" x="52" y="398">∫ f dx</text>
      <text class="art-label" x="398" y="398">det A</text>
      <text class="art-label art-label-center" x="230" y="278" text-anchor="middle">ε–δ</text>
    </svg>
    <span class="art-index">FIG. 01</span>
    <span class="art-corner art-corner-tl"></span>
    <span class="art-corner art-corner-tr"></span>
    <span class="art-corner art-corner-bl"></span>
    <span class="art-corner art-corner-br"></span>
  </div>
  <div class="art-legend">
    <span><i class="legend-line"></i>分析</span>
    <span><i class="legend-line"></i>代数</span>
    <span><i class="legend-line"></i>几何</span>
  </div>
</div>`;
}

function hero(posts) {
  const socials = config.socials
    .map(
      (social) =>
        `<a class="hero-social" href="${escapeHtml(socialHref(social))}" aria-label="${escapeHtml(social.label)}" title="${escapeHtml(social.label)}"${
          /^https?:/i.test(socialHref(social)) ? ' target="_blank" rel="noopener me"' : ""
        }>${icon(social.icon, 18)}</a>`,
    )
    .join("");

  return `<section class="hero">
  <div class="wrap hero-inner">
    <div class="hero-copy">
      <p class="kicker"><span class="kicker-dot" aria-hidden="true"></span>${escapeHtml(config.hero.kicker)}</p>
      <h1 class="hero-title"><span class="hero-line">${escapeHtml(config.hero.line1)}</span><span class="hero-line">${escapeHtml(
        config.hero.line2,
      )}<em>${escapeHtml(config.hero.emphasis)}</em>${escapeHtml(config.hero.line2Tail)}</span></h1>
      <p class="hero-lede">${escapeHtml(config.hero.statement)}</p>
      <div class="hero-actions">
        <a class="button button-solid" href="${
          posts.length ? url("/notes/") : url("/map/")
        }">${posts.length ? "开始阅读" : "浏览知识地图"} ${icon("arrowRight", 17)}</a>
        <a class="button button-quiet" href="${
          posts.length ? url("/map/") : url("/about/")
        }">${posts.length ? icon("spark", 15) : ""} ${posts.length ? "知识地图" : "关于本站"}</a>
      </div>
      <div class="hero-elsewhere">
        <span class="hero-elsewhere-label">ELSEWHERE</span>
        <div class="hero-socials">${socials}</div>
        <span class="hero-note-count">${String(posts.length).padStart(2, "0")} 篇笔记</span>
      </div>
    </div>
    ${heroArt()}
  </div>
  <div class="wrap hero-foot">
    <span>EST. ${escapeHtml(config.established)}</span>
    <span class="hero-foot-mid">${escapeHtml(config.tagline)}</span>
    <span>${escapeHtml(config.author.location)}</span>
  </div>
</section>`;
}

function ticker() {
  const items = ["LIMIT", "DERIVATIVE", "INTEGRAL", "MATRIX", "VECTOR", "CURVE"];
  const chunk = items.map((item) => `<span class="ticker-item">${item}</span><span class="ticker-star" aria-hidden="true">✳</span>`).join("");
  return `<div class="ticker" aria-hidden="true"><div class="ticker-track">${chunk.repeat(4)}</div></div>`;
}

function principles() {
  const items = [
    {
      n: "01",
      label: "DEFINITION",
      title: "先问定义",
      body: "对象是什么？量词、条件与记号必须先说清楚。很多争论其实源于把两个不同的定义当成了同一个。",
    },
    {
      n: "02",
      label: "THEOREM",
      title: "再问定理",
      body: "在哪些假设下，结论成立？把条件逐条拆开，找出真正被用到的那一条，才算读懂定理。",
    },
    {
      n: "03",
      label: "PROOF",
      title: "最后看证明",
      body: "证明如何从假设走到结论？每一步用了什么定义或前一条定理？能否举出反例说明条件不可省？",
    },
  ];

  return `<section class="principles">
  <div class="wrap principles-inner">
    <div class="principles-intro">
      <p class="section-label"><span>02</span>METHOD</p>
      <h2 class="principles-title">三件事，<br>反复问。</h2>
      <p>写作不是展示结论，而是把“为什么”逼到不能再退的地方。</p>
    </div>
    <div class="principles-list">
      ${items
        .map(
          (item) => `<article class="principle">
        <div class="principle-top"><span class="principle-num">${item.n}</span><span class="principle-label">${item.label}</span></div>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function emptyLatest() {
  return `<div class="empty-latest">
    <span class="empty-latest-number" aria-hidden="true">00</span>
    <div class="empty-latest-copy">
      <p class="empty-kicker">THE FIRST NOTE</p>
      <h3>还没有笔记，但地图已经铺好。</h3>
      <p>数学分析的极限、高等代数的线性映射、解析几何的二次曲线，都在图上等待第一篇笔记。</p>
    </div>
    <a class="empty-latest-link" href="${url("/map/")}">先看看知识地图 ${icon("arrowRight", 16)}</a>
  </div>`;
}

function homePage(posts) {
  const latest = posts.slice(0, 4);

  const content = `${hero(posts)}
${ticker()}
<section class="section section-latest" id="latest">
  <div class="wrap">
    ${sectionHead({
      index: "01",
      eyebrow: "LATEST NOTES",
      title: "最新笔记",
      href: posts.length ? url("/notes/") : null,
      linkLabel: `全部 ${posts.length} 篇`,
    })}
    ${
      latest.length
        ? `<div class="post-list">${latest.map((post, index) => postRow(post, index)).join("\n")}</div>`
        : emptyLatest()
    }
  </div>
</section>
${principles()}
<section class="section section-map" id="map">
  <div class="wrap">
    ${sectionHead({
      index: "03",
      eyebrow: "KNOWLEDGE MAP",
      title: "知识地图",
      href: url("/map/"),
      linkLabel: "打开完整地图",
    })}
    <p class="section-lede">把笔记放回概念之间：点一个节点，看看它依赖什么、延伸到哪里，以及哪些问题还没有写。</p>
    ${renderMap({ mapId: "home-map" })}
  </div>
</section>
<section class="closing">
  <div class="wrap closing-inner">
    <div class="closing-copy">
      <p class="section-label"><span>04</span>ABOUT</p>
      <h2>这是一个<br><em>公开的</em>思考练习。</h2>
      <p>不追逐更新频率，也不假装完整。只是在把一些问题想得更清楚之后，把过程留下来。</p>
      <div class="hero-actions">
        <a class="button button-solid" href="${url("/about/")}">关于本站 ${icon("arrowRight", 17)}</a>
        <a class="button button-quiet" href="${url("/resources/")}">资源清单</a>
      </div>
    </div>
    <div class="closing-stats">
      <div class="stat"><strong>${String(posts.length).padStart(2, "0")}</strong><span>篇笔记</span></div>
      <div class="stat"><strong>${String(concepts.length).padStart(2, "0")}</strong><span>个概念</span></div>
      <div class="stat"><strong>${String(disciplines.length).padStart(2, "0")}</strong><span>个学科</span></div>
    </div>
  </div>
</section>`;

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    url: abs("/"),
    description: config.description,
    inLanguage: "zh-CN",
    author: {
      "@type": "Person",
      name: config.author.name,
      url: config.socials.find((social) => social.icon === "github")?.href || abs("/about/"),
    },
  };

  return layout({
    title: null,
    description: config.description,
    path: "/",
    active: "home",
    bodyClass: "page-home",
    content,
    jsonLd: websiteLd,
  });
}

/* ------------------------------------------------------------------ */
/* Notes index                                                        */
/* ------------------------------------------------------------------ */

function emptyNotes() {
  return `<section class="section section-list section-empty">
  <div class="wrap">
    <div class="empty-page">
      <p class="empty-page-kicker">NO NOTES YET</p>
      <h2>第一篇笔记，<br>还在路上。</h2>
      <p>站点框架已经就位。等内容写下来，这里会自动按时间排列，并生成搜索索引与 RSS。</p>
      <div class="hero-actions">
        <a class="button button-quiet" href="${url("/about/")}">关于本站</a>
        <a class="button button-quiet" href="${url("/map/")}">看看知识地图 ${icon("arrowRight", 16)}</a>
      </div>
    </div>
  </div>
</section>`;
}

function notesPage(posts) {
  const present = [...new Set(posts.map((post) => post.category))].sort(
    (a, b) => Object.keys(categories).indexOf(a) - Object.keys(categories).indexOf(b),
  );
  const filters = [
    `<button class="filter-button is-active" type="button" data-filter="all">全部<span>${posts.length}</span></button>`,
    ...present.map(
      (category) =>
        `<button class="filter-button" type="button" data-filter="${escapeHtml(category)}" style="--cat-base:${categoryColor(
          category,
        )}">${escapeHtml(category)}<span>${posts.filter((post) => post.category === category).length}</span></button>`,
    ),
  ].join("");

  const content = `<section class="page-hero">
  <div class="wrap">
    <p class="page-kicker"><span>NOTES</span> / 笔记</p>
    <div class="page-hero-grid">
      <h1 class="page-title">笔记<span class="page-title-count">${String(posts.length).padStart(2, "0")}</span></h1>
      <p class="page-lede">${posts.length ? "按时间倒序排列。没有标签墙，也没有分页器；用上面的筛选和搜索找到你关心的部分。" : "这里会按时间倒序排列所有笔记。现在还没有内容，第一篇文章正在酝酿。"}</p>
    </div>
  </div>
</section>

${
  posts.length
    ? `<section class="section section-list">
  <div class="wrap">
    <div class="list-toolbar">
      <div class="filters" data-filters>${filters}</div>
      <label class="list-search">
        ${icon("search", 16)}
        <input type="search" placeholder="筛选标题、标签…" data-list-search aria-label="筛选笔记">
      </label>
    </div>
    <div class="post-list" data-post-list>
      ${posts.map((post, index) => postRow(post, index)).join("\n")}
    </div>
    <p class="empty-state" data-empty-state hidden>没有匹配的笔记。换个关键词，或者点“全部”。</p>
  </div>
</section>`
    : emptyNotes()
}`;

  return layout({
    title: "笔记",
    description: "数学分析、高等代数与解析几何的笔记：从定义、定理到证明与反例。",
    path: "/notes/",
    active: "notes",
    content,
  });
}

/* ------------------------------------------------------------------ */
/* Post                                                               */
/* ------------------------------------------------------------------ */

function postPage(post, posts) {
  const related = relatedPosts(post, posts, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: "zh-CN",
    url: abs(post.url),
    mainEntityOfPage: abs(post.url),
    image: abs("/og.png"),
    author: { "@type": "Person", name: config.author.name, url: abs("/about/") },
    publisher: { "@type": "Organization", name: config.name, url: abs("/") },
    keywords: post.tags.join(", "),
    articleSection: post.category,
  };

  const pager = `<nav class="post-pager" aria-label="上一篇与下一篇">
    ${
      post.newer
        ? `<a class="pager-link pager-newer" href="${url(post.newer.url)}"><span>${icon("arrowLeft", 15)} 较新</span><strong>${escapeHtml(
            post.newer.title,
          )}</strong></a>`
        : `<span class="pager-link is-empty"><span>已经是最新一篇</span></span>`
    }
    ${
      post.older
        ? `<a class="pager-link pager-older" href="${url(post.older.url)}"><span>较早 ${icon("arrowRight", 15)}</span><strong>${escapeHtml(
            post.older.title,
          )}</strong></a>`
        : `<span class="pager-link is-empty"><span>已经是最早一篇</span></span>`
    }
  </nav>`;

  const relatedMarkup = related.length
    ? `<section class="related">
    <div class="wrap">
      <div class="related-head"><p class="section-label"><span>NEXT</span>继续阅读</p><a class="section-link" href="${url("/notes/")}">全部笔记 ${icon(
        "arrowRight",
        16,
      )}</a></div>
      <div class="related-grid">
        ${related
          .map(
            (item) => `<a class="related-card" href="${url(item.url)}">
          <div class="post-meta">${categoryBadge(item.category)}<time datetime="${item.date}">${formatDate(item.date)}</time></div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.excerpt)}</p>
          <span class="related-more">阅读 ${icon("arrowRight", 15)}</span>
        </a>`,
          )
          .join("")}
      </div>
    </div>
  </section>`
    : "";

  const content = `<article class="post">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="面包屑">
      <a href="${url("/notes/")}">笔记</a><span aria-hidden="true">/</span><span>${escapeHtml(post.category)}</span>
    </nav>
    <header class="post-header">
      <div class="post-meta post-meta-top">
        ${categoryBadge(post.category)}
        <time datetime="${post.date}">${formatDate(post.date, "long")}</time>
        <span class="meta-sep" aria-hidden="true">·</span>
        <span>${post.reading.minutes} 分钟阅读</span>
      </div>
      <h1 class="post-title">${escapeHtml(post.title)}</h1>
      ${post.subtitle ? `<p class="post-subtitle">${escapeHtml(post.subtitle)}</p>` : ""}
      <div class="post-byline">
        <span class="byline-mark">${brandMark(30)}</span>
        <span>${escapeHtml(config.author.name)}</span>
        <span class="meta-sep" aria-hidden="true">·</span>
        <span>${post.reading.characters.toLocaleString("zh-CN")} 字</span>
      </div>
    </header>

    <div class="post-grid">
      ${postTocAside(post)}
      <div class="prose" data-prose>
        ${post.html}
      </div>
    </div>

    <footer class="post-footer">
      <div class="post-tags">
        ${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <p class="post-license">本文由 ${escapeHtml(config.author.name)} 写作，采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a> 许可。欢迎指正。</p>
    </footer>
    ${pager}
  </div>
</article>
${relatedMarkup}`;

  return layout({
    title: post.title,
    description: post.excerpt,
    path: post.url,
    active: "notes",
    bodyClass: "page-post",
    content,
    ogType: "article",
    jsonLd,
    extraHead: `<meta property="article:published_time" content="${post.date}">
<meta property="article:section" content="${escapeHtml(post.category)}">
${post.tags.map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}">`).join("\n")}`,
  });
}

/* ------------------------------------------------------------------ */
/* Map, about, resources, 404                                         */
/* ------------------------------------------------------------------ */

function mapPage(posts) {
  const litCount = concepts.filter((concept) => concept.postUrl).length;
  const content = `<section class="page-hero">
  <div class="wrap">
    <p class="page-kicker"><span>KNOWLEDGE MAP</span> / 知识地图</p>
    <div class="page-hero-grid">
      <h1 class="page-title">知识地图</h1>
      <p class="page-lede">概念不是孤岛。这里把已经写过的与准备写的放在同一张图上：实线表示依赖与延伸，虚线表示对照。点一个节点开始。</p>
    </div>
    <div class="page-stats">
      <div class="stat"><strong>${String(litCount).padStart(2, "0")}</strong><span>个概念已点亮</span></div>
      <div class="stat"><strong>${String(concepts.length).padStart(2, "0")}</strong><span>个概念在图中</span></div>
      <div class="stat"><strong>${String(disciplines.length).padStart(2, "0")}</strong><span>个学科</span></div>
    </div>
  </div>
</section>

<section class="section section-map-page">
  <div class="wrap">
    ${renderMap({ mapId: "page-map" })}
  </div>
</section>

<section class="map-explainer">
  <div class="wrap map-explainer-grid">
    <article>
      <p class="section-label"><span>01</span>NODES</p>
      <h2>实心是已经写过的</h2>
      <p>亮色实心节点对应至少一篇笔记；空心节点是准备写、但还没有写完的概念。它们留在图上，是为了让缺口可见。</p>
    </article>
    <article>
      <p class="section-label"><span>02</span>EDGES</p>
      <h2>连线是关系，不是装饰</h2>
      <p>实线表示前置或延伸，点线表示方法的应用，虚线表示互相参照。点一个节点，与它相关的边会亮起来。</p>
    </article>
    <article>
      <p class="section-label"><span>03</span>COLORS</p>
      <h2>颜色是学科，不是难度</h2>
      <p>一个概念可以同时属于多个学科，因此节点会有两种颜色的环。颜色只表示归属，不表示重要程度。</p>
    </article>
  </div>
</section>`;

  return layout({
    title: "知识地图",
    description: "一张关于数学分析、高等代数与解析几何的概念地图：笔记之间的依赖、延伸与应用。",
    path: "/map/",
    active: "map",
    content,
  });
}

function aboutPage(page, posts) {
  const litCount = concepts.filter((concept) => concept.postUrl).length;
  const socials = config.socials
    .map(
      (social) =>
        `<a href="${escapeHtml(socialHref(social))}"${/^https?:/i.test(socialHref(social)) ? ' target="_blank" rel="noopener me"' : ""}>${icon(
          social.icon,
          16,
        )}<span>${escapeHtml(social.label)}</span></a>`,
    )
    .join("");

  const content = `<section class="page-hero about-hero">
  <div class="wrap about-hero-grid">
    <div>
      <p class="page-kicker"><span>ABOUT</span> / 关于</p>
      <h1 class="page-title">关于</h1>
      <p class="page-lede">${escapeHtml(page.subtitle || config.author.bio)}</p>
      <p class="about-hero-note">写作、设计与代码，是同一件事的不同侧面。</p>
    </div>
    <div class="about-portrait" aria-hidden="true">
      <div class="portrait-frame">
        ${brandMark(76)}
        <span class="portrait-coord">ONLINE / UTC+8</span>
        <span class="portrait-name">${escapeHtml(config.wordmark)}</span>
        <span class="portrait-role">ANALYSIS · ALGEBRA · GEOMETRY</span>
        <span class="portrait-line"></span>
        <span class="portrait-year">EST. ${escapeHtml(config.established)}</span>
      </div>
    </div>
  </div>
</section>

<section class="section about-section">
  <div class="wrap about-layout">
    <div class="prose about-prose">
      ${page.html}
    </div>
    <aside class="about-aside">
      <div class="fact">
        <p class="fact-label">现在</p>
        <p>读数学，写笔记，维护这个站点。最近在整理极限、线性映射与二次曲线之间的连接。</p>
      </div>
      <div class="fact">
        <p class="fact-label">联系</p>
        ${
          config.author.email
            ? `<a class="fact-mail" href="mailto:${escapeHtml(config.author.email)}">${escapeHtml(config.author.email)}</a>`
            : `<a class="fact-mail" href="https://github.com/fortune-arterial" target="_blank" rel="noopener me">github.com/fortune-arterial</a>`
        }
        <div class="fact-socials">${socials}</div>
      </div>
      <div class="fact">
        <p class="fact-label">本站</p>
        <dl class="fact-stats">
          <div><dt>笔记</dt><dd>${posts.length}</dd></div>
          <div><dt>已点亮概念</dt><dd>${litCount} / ${concepts.length}</dd></div>
          <div><dt>始于</dt><dd>${escapeHtml(config.established)}</dd></div>
        </dl>
      </div>
    </aside>
  </div>
</section>`;

  return layout({
    title: "关于",
    description: `${config.author.name} 的个人笔记：为什么写，写什么，以及这个站点如何构建。`,
    path: "/about/",
    active: "about",
    content,
  });
}

const tagLabels = {
  analysis: "数学分析",
  algebra: "高等代数",
  geometry: "解析几何",
  tool: "工具",
};

function resourcesPage() {
  const groups = resourceGroups
    .map(
      (group, groupIndex) => `<section class="resource-group">
      <div class="resource-group-head">
        <p class="section-label"><span>${String(groupIndex + 1).padStart(2, "0")}</span>${group.en}</p>
        <h2>${group.label}</h2>
        <p>${group.note}</p>
      </div>
      <div class="resource-grid">
        ${group.items
          .map(
            (item, index) => `<a class="resource-card" href="${escapeHtml(item.href)}" target="_blank" rel="noopener">
          <div class="resource-top">
            <span class="resource-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="resource-tag">${escapeHtml(tagLabels[item.tag] || item.tag)}</span>
            ${icon("arrowUpRight", 17)}
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="resource-by">${escapeHtml(item.by)}</p>
          <p class="resource-desc">${escapeHtml(item.desc)}</p>
        </a>`,
          )
          .join("")}
      </div>
    </section>`,
    )
    .join("");

  const content = `<section class="page-hero">
  <div class="wrap">
    <p class="page-kicker"><span>LIBRARY</span> / 资源</p>
    <div class="page-hero-grid">
      <h1 class="page-title">资源</h1>
      <p class="page-lede">一些常被反复查阅的公开资源。这份清单还是起始版本，之后会慢慢换成更适合自己的书桌。</p>
    </div>
  </div>
</section>
<section class="section resources-section">
  <div class="wrap">${groups}</div>
</section>
<section class="closing closing-small">
  <div class="wrap closing-inner">
    <div class="closing-copy">
      <p class="section-label"><span>NOTE</span>关于这份清单</p>
      <h2>少而<em>常用</em>。</h2>
      <p>清单会随阅读缓慢更新。如果有一本你觉得应该在这里，欢迎告诉我。</p>
    </div>
    <a class="button button-solid" href="${
      config.author.email
        ? `mailto:${escapeHtml(config.author.email)}`
        : "https://github.com/fortune-arterial"
    }"${config.author.email ? "" : ' target="_blank" rel="noopener me"'}>${
      config.author.email ? "写信推荐" : "在 GitHub 推荐"
    } ${icon("arrowRight", 17)}</a>
  </div>
</section>`;

  return layout({
    title: "资源",
    description: "数学分析、高等代数与解析几何的书桌：教材、几何工具与写作工具。",
    path: "/resources/",
    active: "resources",
    content,
  });
}

function notFoundPage() {
  const content = `<section class="not-found">
  <div class="wrap">
    <p class="page-kicker"><span>404</span> / NOT FOUND</p>
    <h1>这一页<br>还没有被<em>写下</em>。</h1>
    <p class="page-lede">链接可能过期了，也可能是我在重构站点时弄丢了它。</p>
    <div class="hero-actions">
      <a class="button button-solid" href="${url("/")}">返回首页 ${icon("arrowRight", 17)}</a>
      <a class="button button-quiet" href="${url("/notes/")}">全部笔记</a>
    </div>
    <div class="not-found-mark" aria-hidden="true">✳</div>
  </div>
</section>`;

  return layout({
    title: "页面未找到",
    description: "这个页面不存在。",
    path: "/404.html",
    content,
    extraHead: '<meta name="robots" content="noindex">',
  });
}

/* ------------------------------------------------------------------ */
/* Search, feed, sitemap                                              */
/* ------------------------------------------------------------------ */

function searchIndex(posts) {
  return posts.map((post) => ({
    title: post.title,
    url: url(post.url),
    category: post.category,
    tone: categories[post.category].tone,
    tags: post.tags,
    date: post.date,
    excerpt: post.excerpt,
    content: post.plain.slice(0, 5000),
  }));
}

function feed(posts) {
  const items = posts
    .slice(0, 20)
    .map(
      (post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${abs(post.url)}</link>
      <guid isPermaLink="true">${abs(post.url)}</guid>
      <pubDate>${formatDate(post.date, "rfc")}</pubDate>
      <category>${escapeHtml(post.category)}</category>
      <description>${escapeHtml(post.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(config.title)}</title>
    <link>${abs("/")}</link>
    <description>${escapeHtml(config.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${abs("/rss.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function sitemap(posts) {
  const latestDate = posts[0]?.date || new Date().toISOString().slice(0, 10);
  const entries = [
    { loc: abs("/"), lastmod: latestDate },
    { loc: abs("/notes/"), lastmod: latestDate },
    { loc: abs("/map/"), lastmod: latestDate },
    { loc: abs("/resources/"), lastmod: latestDate },
    { loc: abs("/about/"), lastmod: latestDate },
    ...posts.map((post) => ({ loc: abs(post.url), lastmod: post.updated || post.date })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeHtml(entry.loc)}</loc>
    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

/* ------------------------------------------------------------------ */
/* Assets and build                                                   */
/* ------------------------------------------------------------------ */

function copyAssets() {
  const publicDir = path.join(root, "public");
  if (fs.existsSync(publicDir)) {
    for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
      if (entry.name === "fonts") continue;
      const source = path.join(publicDir, entry.name);
      const target = path.join(dist, entry.name);
      if (entry.isDirectory()) {
        fs.cpSync(source, target, { recursive: true });
      } else {
        fs.copyFileSync(source, target);
      }
    }
  }

  const assets = path.join(dist, "assets");
  fs.mkdirSync(assets, { recursive: true });
  fs.copyFileSync(path.join(root, "src", "styles", "site.css"), path.join(assets, "site.css"));
  fs.copyFileSync(path.join(root, "src", "scripts", "site.js"), path.join(assets, "site.js"));
  fs.cpSync(path.join(publicDir, "fonts"), path.join(assets, "fonts"), { recursive: true });

  const katexSource = path.join(root, "node_modules", "katex", "dist");
  const katexTarget = path.join(assets, "katex");
  fs.mkdirSync(katexTarget, { recursive: true });
  fs.copyFileSync(path.join(katexSource, "katex.min.css"), path.join(katexTarget, "katex.min.css"));
  fs.cpSync(path.join(katexSource, "fonts"), path.join(katexTarget, "fonts"), { recursive: true });
}

function build() {
  const started = performance.now();
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });

  const posts = loadPosts(root);
  attachConcepts(posts);
  const about = loadPage(root, "about");

  copyAssets();

  const routes = [];
  routes.push(write("/", homePage(posts)));
  routes.push(write("/notes/", notesPage(posts)));
  for (const post of posts) {
    routes.push(write(post.url, postPage(post, posts)));
  }
  routes.push(write("/map/", mapPage(posts)));
  routes.push(write("/about/", aboutPage(about, posts)));
  routes.push(write("/resources/", resourcesPage()));
  routes.push(write("/404.html", notFoundPage()));

  fs.writeFileSync(path.join(dist, ".nojekyll"), "");
  fs.writeFileSync(path.join(dist, "search.json"), JSON.stringify(searchIndex(posts), null, 0));
  fs.writeFileSync(path.join(dist, "rss.xml"), feed(posts));
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap(posts));
  fs.writeFileSync(
    path.join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`,
  );

  const elapsed = Math.round(performance.now() - started);
  console.log(`\n  ${config.name} · built ${routes.length} pages, ${posts.length} posts in ${elapsed}ms`);
  console.log(`  ${routes.slice(0, 6).join("  ")}${routes.length > 6 ? "  …" : ""}\n`);
}

build();
