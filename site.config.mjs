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
  title: "Fortune Arterial · 数学分析、高等代数与解析几何",
  description:
    "Fortune Arterial 的数学笔记：数学分析、高等代数与解析几何。记录定义、定理、证明与反例，以及它们之间的联系。",
  tagline: "Analysis · Algebra · Geometry",

  hero: {
    kicker: "PERSONAL NOTEBOOK · EST. 2026",
    line1: "把复杂的问题，",
    line2: "想得",
    emphasis: "更清楚",
    line2Tail: "一点。",
    statement:
      "这里记录数学分析、高等代数与解析几何中值得反复理解的问题。",
  },

  author: {
    name: "Fortune Arterial",
    bio: "在数学分析、高等代数与解析几何之间学习与写作。相信好的解释应该同时给出证明与反例。",
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
