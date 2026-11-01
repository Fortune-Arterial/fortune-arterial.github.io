import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config, currentSite, url, abs, escapeHtml, formatDate } from "./lib/site.mjs";
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
import { setLang, getLang, isEn, lp, ui } from "./lib/i18n.mjs";

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

function categoryLabel(category) {
  return isEn() ? categories[category]?.en || category : category;
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
    ${disciplines
      .map((discipline) => `<span><i class="legend-line"></i>${escapeHtml(isEn() ? discipline.en : discipline.name)}</span>`)
      .join("\n    ")}
  </div>
</div>`;
}

function hero(posts) {
  const L = ui();
  const site = currentSite();
  return `<section class="hero">
  <div class="wrap hero-inner">
    <div class="hero-copy">
      <p class="kicker"><span class="kicker-dot" aria-hidden="true"></span>${escapeHtml(site.hero.kicker)}</p>
      <h1 class="hero-title"><span class="hero-line">${escapeHtml(site.hero.line1)}</span><span class="hero-line">${escapeHtml(
        site.hero.line2,
      )}<em>${escapeHtml(site.hero.emphasis)}</em>${escapeHtml(site.hero.line2Tail)}</span></h1>
      <p class="hero-lede">${escapeHtml(site.hero.statement)}</p>
      <div class="hero-actions">
        <a class="button button-solid" href="${
          posts.length ? url(lp("/notes/")) : url(lp("/map/"))
        }">${posts.length ? escapeHtml(L.hero.start) : escapeHtml(L.hero.browseMap)} ${icon("arrowRight", 17)}</a>
        <a class="button button-quiet" href="${
          posts.length ? url(lp("/map/")) : url(lp("/about/"))
        }">${posts.length ? icon("spark", 15) : ""} ${posts.length ? escapeHtml(L.hero.map) : escapeHtml(L.hero.about)}</a>
      </div>
    </div>
    ${heroArt()}
  </div>
  <div class="wrap hero-foot">
    <span>EST. ${escapeHtml(site.established)}</span>
    <span class="hero-foot-mid">${escapeHtml(site.tagline)}</span>
    <span>${escapeHtml(site.author.location)}</span>
  </div>
</section>`;
}

function ticker() {
  const items = ["LIMIT", "DERIVATIVE", "INTEGRAL", "MATRIX", "VECTOR", "CURVE"];
  const chunk = items.map((item) => `<span class="ticker-item">${item}</span><span class="ticker-star" aria-hidden="true">✳</span>`).join("");
  return `<div class="ticker" aria-hidden="true"><div class="ticker-track">${chunk.repeat(4)}</div></div>`;
}

function principles() {
  const L = ui();
  const items = L.principles.items
    .map((item, index) => ({ ...item, n: String(index + 1).padStart(2, "0") }));

  return `<section class="principles">
  <div class="wrap principles-inner">
    <div class="principles-intro">
      <p class="section-label"><span>02</span>${escapeHtml(L.principles.eyebrow)}</p>
      <h2 class="principles-title">${L.principles.title}</h2>
      <p>${escapeHtml(L.principles.intro)}</p>
    </div>
    <div class="principles-list">
      ${items
        .map(
          (item) => `<article class="principle">
        <div class="principle-top"><span class="principle-num">${item.n}</span><span class="principle-label">${escapeHtml(item.label)}</span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function emptyLatest() {
  const L = ui();
  return `<div class="empty-latest">
    <span class="empty-latest-number" aria-hidden="true">00</span>
    <div class="empty-latest-copy">
      <p class="empty-kicker">${escapeHtml(L.home.emptyKicker)}</p>
      <h3>${escapeHtml(L.home.emptyTitle)}</h3>
      <p>${escapeHtml(L.home.emptyBody)}</p>
    </div>
    <a class="empty-latest-link" href="${url(lp("/map/"))}">${escapeHtml(L.home.emptyLink)} ${icon("arrowRight", 16)}</a>
  </div>`;
}

function homePage(posts, mapConcepts) {
  const L = ui();
  const site = currentSite();
  const latest = posts.slice(0, 4);

  const content = `${hero(posts)}
${ticker()}
<section class="section section-latest" id="latest">
  <div class="wrap">
    ${sectionHead({
      index: "01",
      eyebrow: isEn() ? "LATEST NOTES" : "LATEST NOTES",
      title: L.home.latest,
      href: posts.length ? url(lp("/notes/")) : null,
      linkLabel: L.home.allPosts(posts.length),
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
      title: L.home.map,
      href: url(lp("/map/")),
      linkLabel: L.home.openMap,
    })}
    <p class="section-lede">${escapeHtml(L.home.mapLede)}</p>
    ${renderMap({ mapId: "home-map", concepts: mapConcepts })}
  </div>
</section>`;
  const twitter = site.socials?.find((social) => social.icon === "github")?.href;
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: abs(lp("/")),
    description: site.description,
    inLanguage: isEn() ? "en" : "zh-CN",
    author: {
      "@type": "Person",
      name: site.author.name,
      url: twitter || abs(lp("/about/")),
    },
  };

  return layout({
    title: null,
    description: site.description,
    path: lp("/"),
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
  const L = ui();
  return `<section class="section section-list section-empty">
  <div class="wrap">
    <div class="empty-page">
      <p class="empty-page-kicker">NO NOTES YET</p>
      <h2>${L.notes.emptyTitle}</h2>
      <p>${escapeHtml(L.notes.emptyBody)}</p>
      <div class="hero-actions">
        <a class="button button-quiet" href="${url(lp("/about/"))}">${escapeHtml(L.notes.emptyAbout)}</a>
        <a class="button button-quiet" href="${url(lp("/map/"))}">${escapeHtml(L.notes.emptyMap)} ${icon("arrowRight", 16)}</a>
      </div>
    </div>
  </div>
</section>`;
}

function notesPage(posts) {
  const L = ui();
  const present = [...new Set(posts.map((post) => post.category))].sort(
    (a, b) => Object.keys(categories).indexOf(a) - Object.keys(categories).indexOf(b),
  );
  const filters = [
    `<button class="filter-button is-active" type="button" data-filter="all">${escapeHtml(L.notes.all)}<span>${posts.length}</span></button>`,
    ...present.map(
      (category) =>
        `<button class="filter-button" type="button" data-filter="${escapeHtml(category)}" style="--cat-base:${categoryColor(
          category,
        )}">${escapeHtml(categoryLabel(category))}<span>${posts.filter((post) => post.category === category).length}</span></button>`,
    ),
  ].join("");

  const content = `<section class="page-hero">
  <div class="wrap">
    <p class="page-kicker"><span>NOTES</span>${isEn() ? "" : " / 笔记"}</p>
    <div class="page-hero-grid is-single">
      <h1 class="page-title">${escapeHtml(L.notes.title)}<span class="page-title-count">${String(posts.length).padStart(2, "0")}</span></h1>
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
        <input type="search" placeholder="${escapeHtml(L.notes.filter)}" data-list-search aria-label="${escapeHtml(L.notes.filterAria)}">
      </label>
    </div>
    <div class="post-list" data-post-list>
      ${posts.map((post, index) => postRow(post, index)).join("\n")}
    </div>
    <p class="empty-state" data-empty-state hidden>${escapeHtml(L.notes.empty)}</p>
  </div>
</section>`
    : emptyNotes()
}`;

  return layout({
    title: L.notes.title,
    description: L.notes.description,
    path: lp("/notes/"),
    active: "notes",
    content,
  });
}

/* ------------------------------------------------------------------ */
/* Post                                                               */
/* ------------------------------------------------------------------ */

function postPage(post, posts) {
  const L = ui();
  const site = currentSite();
  const related = relatedPosts(post, posts, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: isEn() ? "en" : "zh-CN",
    url: abs(post.url),
    mainEntityOfPage: abs(post.url),
    image: abs("/og.png"),
    author: { "@type": "Person", name: site.author.name, url: abs(lp("/about/")) },
    publisher: { "@type": "Organization", name: site.name, url: abs(lp("/")) },
    keywords: post.tags.join(", "),
    articleSection: categoryLabel(post.category),
  };

  const pager = `<nav class="post-pager" aria-label="${escapeHtml(L.post.pagerAria)}">
    ${
      post.newer
        ? `<a class="pager-link pager-newer" href="${url(post.newer.url)}"><span>${icon("arrowLeft", 15)} ${escapeHtml(L.post.newer)}</span><strong>${escapeHtml(
            post.newer.title,
          )}</strong></a>`
        : `<span class="pager-link is-empty"><span>${escapeHtml(L.post.noNewer)}</span></span>`
    }
    ${
      post.older
        ? `<a class="pager-link pager-older" href="${url(post.older.url)}"><span>${escapeHtml(L.post.older)} ${icon("arrowRight", 15)}</span><strong>${escapeHtml(
            post.older.title,
          )}</strong></a>`
        : `<span class="pager-link is-empty"><span>${escapeHtml(L.post.noOlder)}</span></span>`
    }
  </nav>`;

  const relatedMarkup = related.length
    ? `<section class="related">
    <div class="wrap">
      <div class="related-head"><p class="section-label"><span>NEXT</span>${escapeHtml(L.post.related)}</p><a class="section-link" href="${url(lp("/notes/"))}">${escapeHtml(L.post.allNotes)} ${icon(
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
          <span class="related-more">${escapeHtml(L.post.read)} ${icon("arrowRight", 15)}</span>
        </a>`,
          )
          .join("")}
      </div>
    </div>
  </section>`
    : "";

  const content = `<article class="post">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${escapeHtml(L.post.breadcrumbAria)}">
      <a href="${url(lp("/notes/"))}">${escapeHtml(L.post.breadcrumb)}</a><span aria-hidden="true">/</span><span>${escapeHtml(categoryLabel(post.category))}</span>
    </nav>
    <header class="post-header">
      <div class="post-meta post-meta-top">
        ${categoryBadge(post.category)}
        <time datetime="${post.date}">${formatDate(post.date, "long")}</time>
        <span class="meta-sep" aria-hidden="true">·</span>
        <span>${escapeHtml(L.post.minutes(post.reading.minutes))}</span>
      </div>
      <h1 class="post-title">${escapeHtml(post.title)}</h1>
      ${post.subtitle ? `<p class="post-subtitle">${escapeHtml(post.subtitle)}</p>` : ""}
      <div class="post-byline">
        <span class="byline-mark">${brandMark(30)}</span>
        <span>${escapeHtml(site.author.name)}</span>
        <span class="meta-sep" aria-hidden="true">·</span>
        <span>${escapeHtml(L.post.chars(post.reading.characters.toLocaleString(isEn() ? "en-US" : "zh-CN")))}</span>
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
      <p class="post-license">${L.post.license(escapeHtml(site.author.name))}</p>
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
<meta property="article:section" content="${escapeHtml(categoryLabel(post.category))}">
${post.tags.map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}">`).join("\n")}`,
  });
}

/* ------------------------------------------------------------------ */
/* Map, about, resources, 404                                         */
/* ------------------------------------------------------------------ */

function mapPage(mapConcepts) {
  const L = ui();
  const litCount = mapConcepts.filter((concept) => concept.postUrl).length;
  const content = `<section class="page-hero">
  <div class="wrap">
    <p class="page-kicker"><span>KNOWLEDGE MAP</span>${isEn() ? "" : " / 知识地图"}</p>
    <div class="page-hero-grid">
      <h1 class="page-title">${escapeHtml(L.mapPage.title)}</h1>
      <p class="page-lede">${escapeHtml(L.mapPage.lede)}</p>
    </div>
    <div class="page-stats">
      <div class="stat"><strong>${String(litCount).padStart(2, "0")}</strong><span>${escapeHtml(L.mapPage.lit)}</span></div>
      <div class="stat"><strong>${String(mapConcepts.length).padStart(2, "0")}</strong><span>${escapeHtml(L.mapPage.total)}</span></div>
      <div class="stat"><strong>${String(disciplines.length).padStart(2, "0")}</strong><span>${escapeHtml(L.mapPage.disciplines)}</span></div>
    </div>
  </div>
</section>

<section class="section section-map-page">
  <div class="wrap">
    ${renderMap({ mapId: "page-map", concepts: mapConcepts })}
  </div>
</section>

<section class="map-explainer">
  <div class="wrap map-explainer-grid">
    <article>
      <p class="section-label"><span>01</span>NODES</p>
      <h2>${escapeHtml(L.mapPage.nodesTitle)}</h2>
      <p>${escapeHtml(L.mapPage.nodesBody)}</p>
    </article>
    <article>
      <p class="section-label"><span>02</span>EDGES</p>
      <h2>${escapeHtml(L.mapPage.edgesTitle)}</h2>
      <p>${escapeHtml(L.mapPage.edgesBody)}</p>
    </article>
    <article>
      <p class="section-label"><span>03</span>COLORS</p>
      <h2>${escapeHtml(L.mapPage.colorsTitle)}</h2>
      <p>${escapeHtml(L.mapPage.colorsBody)}</p>
    </article>
  </div>
</section>`;

  return layout({
    title: L.mapPage.title,
    description: L.mapPage.description,
    path: lp("/map/"),
    active: "map",
    content,
  });
}

function aboutPage(page, posts, mapConcepts) {
  const L = ui();
  const site = currentSite();
  const litCount = mapConcepts.filter((concept) => concept.postUrl).length;
  const socials = site.socials
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
      <p class="page-kicker"><span>ABOUT</span>${isEn() ? "" : " / 关于"}</p>
      <h1 class="about-greeting">${escapeHtml(L.about.greeting)} <span class="about-name">${escapeHtml(site.author.name.split(" ")[0])}</span></h1>
      <p class="about-lead">${escapeHtml(L.about.lead)}</p>
    </div>
    <div class="about-portrait" aria-hidden="true">
      <div class="portrait-frame">
        ${brandMark(76)}
        <span class="portrait-coord">ONLINE / UTC+8</span>
        <span class="portrait-name">${escapeHtml(site.wordmark)}</span>
        <span class="portrait-role">ANALYSIS · ALGEBRA · GEOMETRY</span>
        <span class="portrait-line"></span>
        <span class="portrait-year">EST. ${escapeHtml(site.established)}</span>
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
        <p class="fact-label">${escapeHtml(L.about.now)}</p>
        <p>${escapeHtml(L.about.nowText)}</p>
      </div>
      <div class="fact">
        <p class="fact-label">${escapeHtml(L.about.contact)}</p>
        ${
          site.author.email
            ? `<a class="fact-mail" href="mailto:${escapeHtml(site.author.email)}">${escapeHtml(site.author.email)}</a>`
            : `<a class="fact-mail" href="https://github.com/fortune-arterial" target="_blank" rel="noopener me">github.com/fortune-arterial</a>`
        }
        <div class="fact-socials">${socials}</div>
      </div>
      <div class="fact">
        <p class="fact-label">${escapeHtml(L.about.site)}</p>
        <dl class="fact-stats">
          <div><dt>${escapeHtml(L.about.notes)}</dt><dd>${posts.length}</dd></div>
          <div><dt>${escapeHtml(L.about.lit)}</dt><dd>${litCount} / ${mapConcepts.length}</dd></div>
          <div><dt>${escapeHtml(L.about.since)}</dt><dd>${escapeHtml(site.established)}</dd></div>
        </dl>
      </div>
    </aside>
  </div>
</section>`;

  return layout({
    title: isEn() ? "About" : "关于",
    description: L.about.description(site.author.name),
    path: lp("/about/"),
    active: "about",
    extraHead: `<link rel="preload" href="${url("/assets/fonts/bodoni-moda-italic-700.woff2")}" as="font" type="font/woff2" crossorigin>`,
    content,
  });
}

function resourceCard(item, index, L) {
  const number = String(index + 1).padStart(2, "0");
  const tag = L.resources.tags[item.tag] || item.tag;
  const desc = isEn() ? item.descEn || item.desc : item.desc;
  const by = isEn() ? item.byEn || item.by : item.by;
  const title = isEn() ? item.titleEn || item.title : item.title;

  if (item.files) {
    const primary = item.files[0];
    return `<article class="resource-card resource-card-file">
          <div class="resource-top">
            <span class="resource-index">${number}</span>
            <span class="resource-tag">${escapeHtml(tag)}</span>
            <a class="resource-arrow" href="${url(primary.href)}" download="${escapeHtml(primary.name)}" aria-label="${escapeHtml(L.resources.download)} ${escapeHtml(title)} ${primary.label}">${icon("arrowUpRight", 17)}</a>
          </div>
          <h3><a class="resource-title" href="${url(primary.href)}" download="${escapeHtml(primary.name)}">${escapeHtml(title)}</a></h3>
          <p class="resource-by">${escapeHtml(by)}</p>
          <p class="resource-desc">${escapeHtml(desc)}</p>
          <div class="resource-files">
            ${item.files
              .map(
                (file) => `<a class="resource-file" href="${url(file.href)}" download="${escapeHtml(file.name)}">
              <span class="resource-file-label">${escapeHtml(file.label)}</span>
              <span class="resource-file-meta">${file.source ? escapeHtml(L.resources.source) + " · " : ""}${escapeHtml(file.size)}</span>
            </a>`,
              )
              .join("")}
          </div>
        </article>`;
  }

  return `<a class="resource-card" href="${escapeHtml(item.href)}" target="_blank" rel="noopener">
          <div class="resource-top">
            <span class="resource-index">${number}</span>
            <span class="resource-tag">${escapeHtml(tag)}</span>
            ${icon("arrowUpRight", 17)}
          </div>
          <h3>${escapeHtml(title)}</h3>
          <p class="resource-by">${escapeHtml(by)}</p>
          <p class="resource-desc">${escapeHtml(desc)}</p>
        </a>`;
}

function resourcesPage() {
  const L = ui();
  const groups = resourceGroups
    .map(
      (group, groupIndex) => `<section class="resource-group">
      <div class="resource-group-head">
        <p class="section-label"><span>${String(groupIndex + 1).padStart(2, "0")}</span>${group.en}</p>
        <h2>${escapeHtml(isEn() ? group.labelEn || group.label : group.label)}</h2>
        <p>${escapeHtml(isEn() ? group.noteEn || group.note : group.note)}</p>
      </div>
      <div class="resource-grid">
        ${group.items.map((item, index) => resourceCard(item, index, L)).join("")}
      </div>
    </section>`,
    )
    .join("");

  const content = `<section class="page-hero">
  <div class="wrap">
    <p class="page-kicker"><span>LIBRARY</span>${isEn() ? "" : " / 资源"}</p>
    <div class="page-hero-grid is-single">
      <h1 class="page-title">${escapeHtml(L.resources.title)}</h1>
    </div>
  </div>
</section>
<section class="section resources-section">
  <div class="wrap">${groups}</div>
</section>
`;

  return layout({
    title: L.resources.title,
    description: L.resources.description,
    path: lp("/resources/"),
    active: "resources",
    content,
  });
}

function notFoundPage() {
  const L = ui();
  const content = `<section class="not-found">
  <div class="wrap">
    <p class="page-kicker"><span>404</span> / NOT FOUND</p>
    <h1>${L.notFound.title}</h1>
    <p class="page-lede">${escapeHtml(L.notFound.lede)}</p>
    <div class="hero-actions">
      <a class="button button-solid" href="${url(lp("/"))}">${escapeHtml(L.notFound.home)} ${icon("arrowRight", 17)}</a>
      <a class="button button-quiet" href="${url(lp("/notes/"))}">${escapeHtml(L.notFound.notes)}</a>
    </div>
    <div class="not-found-mark" aria-hidden="true">✳</div>
  </div>
</section>`;

  return layout({
    title: L.notFound.titleTag,
    description: L.notFound.description,
    path: lp("/404.html"),
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
    category: categoryLabel(post.category),
    tone: categories[post.category].tone,
    tags: post.tags,
    date: post.date,
    excerpt: post.excerpt,
    content: post.plain.slice(0, 5000),
  }));
}

function feed(posts) {
  const L = ui();
  const site = currentSite();
  const feedPath = lp("/rss.xml");
  const items = posts
    .slice(0, 20)
    .map(
      (post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${abs(post.url)}</link>
      <guid isPermaLink="true">${abs(post.url)}</guid>
      <pubDate>${formatDate(post.date, "rfc")}</pubDate>
      <category>${escapeHtml(categoryLabel(post.category))}</category>
      <description>${escapeHtml(post.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(site.name)}</title>
    <link>${abs(lp("/"))}</link>
    <description>${escapeHtml(L.feed.description)}</description>
    <language>${isEn() ? "en" : "zh-CN"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${abs(feedPath)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function sitemap(entries) {
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

  copyAssets();

  const routes = [];
  const sitemapEntries = [];
  const postCounts = {};

  for (const lang of ["zh", "en"]) {
    setLang(lang);
    const posts = loadPosts(root);
    postCounts[lang] = posts.length;
    const mapConcepts = attachConcepts(posts);
    const about = loadPage(root, "about");

    routes.push(write(lp("/"), homePage(posts, mapConcepts)));
    routes.push(write(lp("/notes/"), notesPage(posts)));
    for (const post of posts) {
      routes.push(write(post.url, postPage(post, posts)));
    }
    routes.push(write(lp("/map/"), mapPage(mapConcepts)));
    routes.push(write(lp("/about/"), aboutPage(about, posts, mapConcepts)));
    routes.push(write(lp("/resources/"), resourcesPage()));
    routes.push(write(lp("/404.html"), notFoundPage()));

    fs.writeFileSync(path.join(dist, lp("/search.json").replace(/^\//, "")), JSON.stringify(searchIndex(posts), null, 0));
    fs.writeFileSync(path.join(dist, lp("/rss.xml").replace(/^\//, "")), feed(posts));

    const latestDate = posts[0]?.date || new Date().toISOString().slice(0, 10);
    for (const path of ["/", "/notes/", "/map/", "/resources/", "/about/"]) {
      sitemapEntries.push({ loc: abs(lp(path)), lastmod: latestDate });
    }
    for (const post of posts) {
      sitemapEntries.push({ loc: abs(post.url), lastmod: post.updated || post.date });
    }
  }

  setLang("zh");
  fs.writeFileSync(path.join(dist, ".nojekyll"), "");
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap(sitemapEntries));
  fs.writeFileSync(
    path.join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`,
  );

  const elapsed = Math.round(performance.now() - started);
  console.log(`\n  ${config.name} · built ${routes.length} pages, ${postCounts.zh} + ${postCounts.en} posts in ${elapsed}ms`);
  console.log(`  ${routes.slice(0, 8).join("  ")}${routes.length > 8 ? "  …" : ""}\n`);
}

build();
