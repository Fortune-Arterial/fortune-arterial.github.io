# Content guide

Posts live in `content/posts/*.md` and are built into static pages. The filename
becomes the URL:

```
content/posts/epsilon-delta.md  →  /notes/epsilon-delta/
```

The site currently publishes three starter notes: one each in mathematical
analysis, higher algebra and analytic geometry. They are meant to be rewritten,
extended or replaced.

## Front matter

Every post starts with YAML front matter:

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

- `title` (required): plain text, no Markdown.
- `subtitle` (optional): one line, shown under the title on the post page.
- `date` (required): `YYYY-MM-DD`, quoted.
- `category` (required): one of 数学分析 / 高等代数 / 解析几何.
- `tags` (optional): 2–4 short Chinese or English tags.
- `concepts` (optional): IDs from the knowledge map. See `src/data/map.mjs`.
  The **first** concept is the post's anchor and lights up that node on the map;
  the rest are used for related reading. Current IDs:

  | 学科 | 概念 ID |
  | --- | --- |
  | 数学分析 | `limit`, `derivative`, `mvt`, `integral`, `series` |
  | 高等代数 | `linear-space`, `linear-map`, `matrix`, `eigen`, `quadratic-form` |
  | 解析几何 | `vector`, `line-plane`, `conic`, `quadric`, `curvature` |

- `excerpt` (required): 1–2 sentences, 40–90 Chinese characters.
- `draft: true` excludes the post from the build.

## Voice

- Write in Chinese, first person, precise and unhurried. No hype, no "众所周知".
- Every piece should answer three questions: **定义** (what is the object, and
  are the quantifiers and hypotheses clear?), **定理/证明** (what follows from
  what, and where is the key step?), **边界** (when does it fail? is there a
  counterexample?).
- Prefer a concrete example or derivation over a list of facts.
- End with a short "边界" or "什么时候会失效" section. Honesty is the house style.

## Structure

- Do **not** write an H1 — the title comes from front matter.
- Use 3–5 `##` sections, optionally `###` subsections.
- Include at least one display formula (`$$ ... $$`) and one inline formula.
- Include at least one table, list, or code block.
- 800–1400 Chinese characters is a good length. Depth over breadth.
- Link canonical sources at the end under `## 参考文献` when relevant.

## Math and code

- Inline math: `$x_t$`. Display math: `$$ ... $$` on its own lines.
- KaTeX renders at build time, so formulas appear even with JavaScript disabled.
- Fenced code blocks with a language tag are highlighted and get a copy button.
- Callouts:

```md
::: note 直觉
这里是一段补充说明。
:::
```

Types: `note`, `tip`, `warn`.

## References

Use a plain list with author, title, year, and a link when available. Do not invent
citations or page numbers.
