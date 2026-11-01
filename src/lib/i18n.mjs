/**
 * Locale state and interface copy.
 *
 * The static generator renders one language at a time. `setLang` is called
 * before each language pass in build.mjs; layout and page templates read the
 * active locale through `ui()`.
 */
export const langMeta = {
  zh: {
    id: "zh",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    switchLabel: "EN",
    switchTitle: "切换到英文",
    switchAria: "切换到英文",
  },
  en: {
    id: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    switchLabel: "中文",
    switchTitle: "Switch to Chinese",
    switchAria: "Switch to Chinese",
  },
};

let current = "zh";

export function setLang(value) {
  if (!langMeta[value]) throw new Error(`Unknown locale: ${value}`);
  current = value;
}

export function getLang() {
  return current;
}

export function isEn() {
  return current === "en";
}

/** Prefix a logical site path for the active locale. */
export function lp(path = "/") {
  const clean = String(path).startsWith("/") ? String(path) : `/${path}`;
  if (current === "zh") return clean;
  if (clean === "/") return "/en/";
  return `/en${clean}`;
}

/** The same page in the other locale. `path` is already localized. */
export function altPath(path = "/") {
  if (current === "en") {
    const rest = String(path).replace(/^\/en(?=\/|$)/, "");
    return rest || "/";
  }
  return String(path) === "/" ? "/en/" : `/en${path}`;
}

const zh = {
  brandSub: "笔记",
  nav: { notes: "笔记", map: "知识地图", resources: "资源", about: "关于" },
  homeLabel: "首页",
  skip: "跳到正文",
  mainNav: "主导航",
  homeAria: "首页",
  searchLabel: "搜索",
  searchAria: "搜索笔记",
  themeTitle: "切换深浅色",
  themeLight: "切换到浅色模式",
  themeDark: "切换到深色模式",
  menuOpen: "打开菜单",
  menuClose: "关闭菜单",
  footerUpdated: "最新更新",
  backTop: "回到顶部",
  rssTitle: "RSS",
  search: {
    title: "搜索",
    placeholder: "搜索笔记、概念、标签…",
    hint: "输入关键词开始搜索。支持标题、标签与正文内容。",
    select: "选择",
    open: "打开",
    esc: "ESC",
    unavailable: "搜索索引不可用。",
    noNotes: "还没有可搜索的笔记。<br>第一篇文章发布后，这里会自动建立索引。",
    recent: (n) => `最近 ${n} 篇`,
    results: (n) => `${n} 条结果`,
    none: "0 条结果",
    notFound: (q) => `没有找到「${q}」。<br>试试更短的关键词，或者只搜标签。`,
    loading: "正在载入索引…",
    loadError: "搜索索引加载失败。请确认页面是通过本地服务器或 GitHub Pages 打开的。",
  },
  hero: {
    start: "开始阅读",
    map: "知识地图",
    browseMap: "浏览知识地图",
    about: "关于本站",
  },
  home: {
    latest: "最新笔记",
    allPosts: (n) => `全部 ${n} 篇`,
    map: "知识地图",
    openMap: "打开完整地图",
    mapLede: "把笔记放回概念之间：点一个节点，看看它依赖什么、延伸到哪里，以及哪些问题还没有写。",
    emptyTitle: "还没有笔记，但地图已经铺好。",
    emptyBody: "数学分析的极限、高等代数的线性映射、解析几何的二次曲线，都在图上等待第一篇笔记。",
    emptyKicker: "THE FIRST NOTE",
    emptyLink: "先看看知识地图",
  },
  principles: {
    eyebrow: "METHOD",
    title: "三件事，<br>反复问。",
    intro: "写作不是展示结论，而是把“为什么”逼到不能再退的地方。",
    items: [
      {
        label: "DEFINITION",
        title: "先问定义",
        body: "对象是什么？量词、条件与记号必须先说清楚。很多争论其实源于把两个不同的定义当成了同一个。",
      },
      {
        label: "THEOREM",
        title: "再问定理",
        body: "在哪些假设下，结论成立？把条件逐条拆开，找出真正被用到的那一条，才算读懂定理。",
      },
      {
        label: "PROOF",
        title: "最后看证明",
        body: "证明如何从假设走到结论？每一步用了什么定义或前一条定理？能否举出反例说明条件不可省？",
      },
    ],
  },
  notes: {
    kicker: "笔记",
    title: "笔记",
    description: "数学分析、高等代数与解析几何的笔记：从定义、定理到证明与反例。",
    all: "全部",
    filter: "筛选标题、标签…",
    filterAria: "筛选笔记",
    empty: "没有匹配的笔记。换个关键词，或者点“全部”。",
    emptyTitle: "第一篇笔记，<br>还在路上。",
    emptyBody: "站点框架已经就位。等内容写下来，这里会自动按时间排列，并生成搜索索引与 RSS。",
    emptyAbout: "关于本站",
    emptyMap: "看看知识地图",
  },
  post: {
    breadcrumb: "笔记",
    breadcrumbAria: "面包屑",
    minutes: (n) => `${n} 分钟阅读`,
    minutesShort: (n) => `${n} 分钟`,
    chars: (n) => `${n} 字`,
    newer: "较新",
    older: "较早",
    noNewer: "已经是最新一篇",
    noOlder: "已经是最早一篇",
    pagerAria: "上一篇与下一篇",
    related: "继续阅读",
    allNotes: "全部笔记",
    read: "阅读",
    license: (author) => `本文由 ${author} 写作，采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a> 许可。欢迎指正。`,
    toc: "本文目录",
    copyLink: "复制链接",
    copySuccess: "链接已复制",
    copyFail: "复制失败",
    codeCopy: "复制",
    codeCopied: "已复制",
    codeFail: "复制失败",
  },
  mapPage: {
    kicker: "知识地图",
    title: "知识地图",
    description: "一张关于数学分析、高等代数与解析几何的概念地图：笔记之间的依赖、延伸与应用。",
    lede: "概念不是孤岛。这里把已经写过的与准备写的放在同一张图上：实线表示依赖与延伸，虚线表示对照。点一个节点开始。",
    lit: "个概念已点亮",
    total: "个概念在图中",
    disciplines: "个学科",
    nodesTitle: "实心是已经写过的",
    nodesBody: "亮色实心节点对应至少一篇笔记；空心节点是准备写、但还没有写完的概念。它们留在图上，是为了让缺口可见。",
    edgesTitle: "连线是关系，不是装饰",
    edgesBody: "实线表示前置或延伸，点线表示方法的应用，虚线表示互相参照。点一个节点，与它相关的边会亮起来。",
    colorsTitle: "颜色是学科，不是难度",
    colorsBody: "一个概念可以同时属于多个学科，因此节点会有两种颜色的环。颜色只表示归属，不表示重要程度。",
  },
  map: {
    all: "全部",
    hasNotes: "已有笔记",
    pending: "待写",
    swipe: "左右滑动查看完整地图 →",
    svgTitle: "知识地图：概念之间的依赖、延伸与应用关系",
    panelKicker: "CONCEPT MAP",
    panelLead: "点一个节点，这里会显示它的说明，以及它和其他节点之间的关系。",
    lit: (n, total) => `${n} / ${total} 已点亮`,
    nodeAria: (name, lit) => `${name}，${lit ? "已有笔记" : "待写"}`,
    close: "关闭详情",
    related: "关联概念",
    independent: "独立节点",
    readNote: "阅读笔记",
    emptyNote: "这个概念还没有写。它已经在待写清单里，只是还欠一次足够清楚的推导。",
    filter: "FILTER",
    clear: "清除筛选",
    discipline: (n) => `这个学科在地图上有 ${n} 个概念。亮色实心节点表示已经写过的笔记。`,
    hint: "提示",
    hintBody: "再次点击“全部”可以恢复完整视图。",
  },
  about: {
    kicker: "关于",
    greeting: "你好，我是",
    lead: "这里整理我在学习过程中做过的内容。",
    description: (name) => `${name} 的个人笔记：记录数学学习、笔记与备考过程中的内容。`,
    now: "现在",
    nowText: "学数学，写笔记，正在全力备考。",
    contact: "联系",
    site: "本站",
    notes: "笔记",
    lit: "已点亮概念",
    since: "始于",
  },
  resources: {
    kicker: "资源",
    title: "资源",
    description: "数学分析、高等代数与解析几何的书桌：教材、几何工具与写作工具。",
    tags: { analysis: "数学分析", algebra: "高等代数", geometry: "解析几何", tool: "工具" },
  },
  notFound: {
    kicker: "404 / NOT FOUND",
    title: "这一页<br>还没有被<em>写下</em>。",
    lede: "链接可能过期了，也可能是我在重构站点时弄丢了它。",
    home: "返回首页",
    notes: "全部笔记",
    titleTag: "页面未找到",
    description: "这个页面不存在。",
  },
  feed: {
    titleSuffix: "",
    description: "数学分析、高等代数与解析几何的笔记。",
  },
};

const en = {
  brandSub: "notes",
  nav: { notes: "Notes", map: "Knowledge map", resources: "Resources", about: "About" },
  homeLabel: "Home",
  skip: "Skip to content",
  mainNav: "Main navigation",
  homeAria: "Home",
  searchLabel: "Search",
  searchAria: "Search notes",
  themeTitle: "Toggle color theme",
  themeLight: "Switch to light mode",
  themeDark: "Switch to dark mode",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  footerUpdated: "Last updated",
  backTop: "Back to top",
  rssTitle: "RSS",
  search: {
    title: "Search",
    placeholder: "Search notes, concepts, tags…",
    hint: "Type to search. Titles, tags and full text are included.",
    select: "select",
    open: "open",
    esc: "ESC",
    unavailable: "Search index unavailable.",
    noNotes: "No notes to search yet.<br>The index will appear after the first note is published.",
    recent: (n) => `Recent ${n} notes`,
    results: (n) => `${n} results`,
    none: "0 results",
    notFound: (q) => `No results for “${q}”.<br>Try a shorter keyword, or search a tag.`,
    loading: "Loading index…",
    loadError: "Could not load the search index. Make sure the site is opened through a local server or GitHub Pages.",
  },
  hero: {
    start: "Start reading",
    map: "Knowledge map",
    browseMap: "Browse the map",
    about: "About this site",
  },
  home: {
    latest: "Latest notes",
    allPosts: (n) => `All ${n} notes`,
    map: "Knowledge map",
    openMap: "Open the full map",
    mapLede: "Put notes back among concepts: select a node to see what it depends on, where it leads, and what is still unwritten.",
    emptyTitle: "No notes yet, but the map is ready.",
    emptyBody: "The ε–δ definition, linear maps and conic sections are already on the map, waiting for the first note.",
    emptyKicker: "THE FIRST NOTE",
    emptyLink: "Explore the knowledge map",
  },
  principles: {
    eyebrow: "METHOD",
    title: "Three questions,<br>asked again.",
    intro: "Writing is not a display of conclusions; it is the attempt to push “why” until it cannot retreat any further.",
    items: [
      {
        label: "DEFINITION",
        title: "Ask what it is",
        body: "What is the object? Quantifiers, hypotheses and notation must be stated first. Many disagreements come from treating two different definitions as one.",
      },
      {
        label: "THEOREM",
        title: "Then ask when it holds",
        body: "Under which hypotheses does the conclusion hold? Separate the conditions and find the one actually used; only then have you understood the theorem.",
      },
      {
        label: "PROOF",
        title: "Finally, read the proof",
        body: "How does the argument move from hypotheses to conclusion? Which definition or earlier theorem does each step use? Can a counterexample show a hypothesis is needed?",
      },
    ],
  },
  notes: {
    kicker: "Notes",
    title: "Notes",
    description: "Notes on mathematical analysis, higher algebra and analytic geometry: definitions, theorems, proofs and counterexamples.",
    all: "All",
    filter: "Filter by title or tag…",
    filterAria: "Filter notes",
    empty: "No matching notes. Try another keyword, or select “All”.",
    emptyTitle: "The first note<br>is still on its way.",
    emptyBody: "The site is ready. Once a note is written, it will be sorted by date and indexed for search and RSS.",
    emptyAbout: "About this site",
    emptyMap: "Explore the knowledge map",
  },
  post: {
    breadcrumb: "Notes",
    breadcrumbAria: "Breadcrumb",
    minutes: (n) => `${n} min read`,
    minutesShort: (n) => `${n} min`,
    chars: (n) => `${n} words`,
    newer: "Newer",
    older: "Older",
    noNewer: "This is the newest note",
    noOlder: "This is the oldest note",
    pagerAria: "Newer and older notes",
    related: "Keep reading",
    allNotes: "All notes",
    read: "Read",
    license: (author) => `Written by ${author} and licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>. Corrections are welcome.`,
    toc: "Contents",
    copyLink: "Copy link",
    copySuccess: "Link copied",
    copyFail: "Copy failed",
    codeCopy: "Copy",
    codeCopied: "Copied",
    codeFail: "Copy failed",
  },
  mapPage: {
    kicker: "Knowledge map",
    title: "Knowledge map",
    description: "A concept map of mathematical analysis, higher algebra and analytic geometry: dependencies, extensions and applications between notes.",
    lede: "Concepts are not islands. Written and planned notes share one map: solid lines are dependencies and extensions, dashed lines are contrasts. Select a node to begin.",
    lit: "concepts explored",
    total: "concepts on the map",
    disciplines: "disciplines",
    nodesTitle: "Filled nodes are written",
    nodesBody: "A bright filled node has at least one note; a hollow node is planned but not finished. They stay on the map so the gaps remain visible.",
    edgesTitle: "Lines are relations, not decoration",
    edgesBody: "Solid lines are prerequisites or extensions, dotted lines are applications, dashed lines are cross-references. Select a node and its edges light up.",
    colorsTitle: "Colour is discipline, not difficulty",
    colorsBody: "A concept can belong to more than one discipline, so a node may have rings of two colours. Colour marks membership, not importance.",
  },
  map: {
    all: "All",
    hasNotes: "With notes",
    pending: "To write",
    swipe: "Swipe to see the full map →",
    svgTitle: "Knowledge map: dependencies, extensions and applications between concepts",
    panelKicker: "CONCEPT MAP",
    panelLead: "Select a node to see its description and how it connects to the rest of the map.",
    lit: (n, total) => `${n} / ${total} explored`,
    nodeAria: (name, lit) => `${name}, ${lit ? "with a note" : "to write"}`,
    close: "Close details",
    related: "Related concepts",
    independent: "Standalone node",
    readNote: "Read the note",
    emptyNote: "This concept has no note yet. It is on the list, but still owes a sufficiently clear derivation.",
    filter: "FILTER",
    clear: "Clear filter",
    discipline: (n) => `This discipline has ${n} concepts on the map. Bright filled nodes mark concepts with a note.`,
    hint: "Tip",
    hintBody: "Select “All” again to restore the full view.",
  },
  about: {
    kicker: "About",
    greeting: "Hello, I'm",
    lead: "This is where I keep what I have worked through while learning.",
    description: (name) => `${name}'s notes on learning mathematics, writing, and preparing for exams.`,
    now: "Now",
    nowText: "Studying mathematics, writing notes, and preparing for exams.",
    contact: "Contact",
    site: "Site",
    notes: "Notes",
    lit: "Concepts explored",
    since: "Since",
  },
  resources: {
    kicker: "Resources",
    title: "Resources",
    description: "A desk for mathematical analysis, higher algebra and analytic geometry: textbooks, geometry tools and writing tools.",
    tags: { analysis: "Analysis", algebra: "Algebra", geometry: "Geometry", tool: "Tool" },
  },
  notFound: {
    kicker: "404 / NOT FOUND",
    title: "This page<br>has not been <em>written</em> yet.",
    lede: "The link may be stale, or I may have lost it while rebuilding the site.",
    home: "Back home",
    notes: "All notes",
    titleTag: "Page not found",
    description: "This page does not exist.",
  },
  feed: {
    titleSuffix: "",
    description: "Notes on mathematical analysis, higher algebra and analytic geometry.",
  },
};

const copy = { zh, en };

export function ui() {
  return copy[current];
}
