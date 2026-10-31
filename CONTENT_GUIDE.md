# Content guide

Posts live in `content/posts/*.md` and are built into static pages. The seven
finished examples in `examples/posts/` are intentionally **not** built; copy one
into `content/posts/` to publish it. The filename
becomes the URL: `content/posts/typical-set.md` → `/notes/typical-set/`.

## Front matter

Every post starts with YAML front matter:

```yaml
---
title: "典型集与 AEP：概率质量为何集中在薄壳上"
subtitle: "从渐近均分性理解高维概率的几何直觉"
date: "2026-01-21"
category: "信息论"
tags: ["典型集", "AEP", "信息论"]
concepts: ["typical-set", "entropy"]
excerpt: "一句话摘要，会出现在列表页、搜索结果与社交卡片中。"
draft: false
---
```

- `title` (required): plain text, no Markdown.
- `subtitle` (optional): one line, shown under the title on the post page.
- `date` (required): `YYYY-MM-DD`, quoted.
- `category` (required): one of 信息论 / 统计 / 优化 / 强化学习 / 学习理论 / 深度学习 / 概率论.
- `tags` (optional): 2–4 short Chinese or English tags.
- `concepts` (optional): IDs from the knowledge map. See `src/data/map.mjs`.
  The **first** concept is the post's anchor and lights up that node on the map;
  the rest are used for related reading. Current IDs: `law-large-numbers`, `typical-set`, `entropy`, `kl-divergence`,
  `mle`, `score-matching`, `sgd`, `convex-optimization`, `mdp`,
  `policy-gradient`, `littlestone`, `vc-dimension`, `attention`, `vae`, `sigreg`.
- `excerpt` (required): 1–2 sentences, 40–90 Chinese characters.
- `draft: true` excludes the post from the build.

## Voice

- Write in Chinese, first person, precise and unhurried. No hype, no "众所周知".
- Every piece should answer three questions: **结构** (what does the conclusion
  depend on?), **机制** (why does the method work?), **边界** (when does it fail?).
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
