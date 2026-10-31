import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const slug = args[0];
if (!slug) {
  console.log(`
用法: npm run new -- <slug> ["标题"]

示例:
  npm run new -- scaling-laws "缩放定律的边界"
  npm run new -- my-note

slug 会成为 URL: content/posts/<slug>.md → /notes/<slug>/
创建后编辑 front matter 中的分类、标签与概念。
`);
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) {
  console.error("slug 只能包含小写字母、数字和连字符，例如 typical-set。");
  process.exit(1);
}

const target = path.join(process.cwd(), "content", "posts", `${slug}.md`);
if (fs.existsSync(target)) {
  console.error(`文件已存在: ${path.relative(process.cwd(), target)}`);
  process.exit(1);
}

const now = new Date();
const pad = (value) => String(value).padStart(2, "0");
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const title = args.slice(1).join(" ").trim() || slug;

const template = `---
title: "${title.replace(/"/g, '\\"')}"
subtitle: ""
date: "${date}"
category: "信息论"
tags: []
concepts: []
excerpt: "用一两句话说明这篇笔记想回答的问题。"
draft: true
---

## 问题

这里写清楚要回答的问题，以及它为什么值得回答。

## 结构

结论依赖哪些定义与假设？

## 机制

方法为什么有效？

## 边界

它在什么条件下失效？

## 参考文献

- 
`;

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, template);
console.log(`\n已创建 content/posts/${slug}.md`);
console.log("draft 为 true，写完后改成 false 才会出现在站点里。\n");
