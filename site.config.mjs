/**
 * Site configuration — the only file you need to edit to make this blog yours.
 *
 * For a user site (https://<username>.github.io) keep basePath = "/".
 * For a project site (https://<username>.github.io/<repo>) set it to "/<repo>/".
 */
export default {
  siteUrl: "https://fortune-arterial.github.io",
  basePath: "/",

  name: "Fortune Arterial",
  wordmark: "FORTUNE",
  title: "Fortune Arterial · 数学、算法与智能",
  description:
    "Fortune Arterial 的个人笔记：关于数学、算法与人工智能，关心结论依赖的结构、方法有效的机制，以及它们失效的边界。",
  tagline: "Mathematics, Algorithms & Intelligence",

  hero: {
    kicker: "PERSONAL NOTEBOOK · EST. 2026",
    line1: "把复杂的问题，",
    line2: "想得",
    emphasis: "更清楚",
    line2Tail: "一点。",
    statement:
      "这里记录数学、算法与人工智能中值得反复理解的问题：结论依赖怎样的结构，方法为何有效，又在什么条件下失效。",
  },

  author: {
    name: "Fortune Arterial",
    bio: "在数学、算法与智能系统的交界处学习与写作。相信好的解释应该同时给出结构与边界。",
    /** Leave empty to show GitHub instead of an email in the footer. */
    email: "",
    location: "China",
  },

  established: "2026",

  socials: [
    { label: "GitHub", href: "https://github.com/fortune-arterial", icon: "github" },
    { label: "RSS", href: "/rss.xml", icon: "rss" },
  ],
};
