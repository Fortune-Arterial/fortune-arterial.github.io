import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown.mjs";
import { categories, concepts } from "../data/map.mjs";
import { truncate, readingStats, dateParts } from "./site.mjs";

const REQUIRED = ["title", "date", "category", "excerpt"];
const conceptIds = new Set(concepts.map((concept) => concept.id));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (!Array.isArray(tags)) return [String(tags)];
  return tags.map((tag) => String(tag).trim()).filter(Boolean);
}

function loadPosts(root) {
  const dir = path.join(root, "content", "posts");
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const posts = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");

    for (const key of REQUIRED) {
      assert(data[key], `${file}: missing required front matter "${key}"`);
    }
    assert(/^\d{4}-\d{2}-\d{2}$/.test(String(data.date)), `${file}: date must be YYYY-MM-DD`);
    dateParts(data.date);
    assert(categories[data.category], `${file}: unknown category "${data.category}"`);

    const conceptSlugs = Array.isArray(data.concepts) ? data.concepts : [];
    for (const id of conceptSlugs) {
      assert(conceptIds.has(id), `${file}: unknown concept "${id}"`);
    }

    if (data.draft) continue;

    const rendered = renderMarkdown(content);
    const stats = readingStats(content);
    const excerpt = String(data.excerpt).trim() || truncate(rendered.plain, 100);

    posts.push({
      slug,
      url: `/notes/${slug}/`,
      sourcePath: fullPath,
      title: String(data.title).trim(),
      subtitle: data.subtitle ? String(data.subtitle).trim() : "",
      date: String(data.date),
      updated: data.updated ? String(data.updated) : null,
      category: data.category,
      tags: normalizeTags(data.tags),
      concepts: conceptSlugs,
      excerpt,
      draft: false,
      html: rendered.html,
      toc: rendered.toc,
      plain: rendered.plain,
      reading: stats,
      featured: Boolean(data.featured),
    });
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title, "zh")));

  posts.forEach((post, index) => {
    post.newer = posts[index - 1] || null;
    post.older = posts[index + 1] || null;
  });

  return posts;
}

function loadPage(root, name) {
  const file = path.join(root, "content", "pages", `${name}.md`);
  assert(fs.existsSync(file), `Missing page content: content/pages/${name}.md`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const rendered = renderMarkdown(content);
  return {
    ...data,
    html: rendered.html,
    toc: rendered.toc,
    plain: rendered.plain,
  };
}

/** Attach the newest published post to each knowledge-map concept. */
function attachConcepts(posts) {
  for (const concept of concepts) {
    const post = posts.find((item) => item.concepts[0] === concept.id) || null;
    concept.post = post ? post.slug : null;
    concept.postUrl = post ? post.url : null;
    concept.postTitle = post ? post.title : null;
  }
  return concepts;
}

function relatedPosts(post, posts, limit = 2) {
  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      const sharedConcepts = candidate.concepts.filter((id) => post.concepts.includes(id)).length;
      const sameCategory = candidate.category === post.category ? 1 : 0;
      return { candidate, score: sharedTags * 3 + sharedConcepts * 2 + sameCategory };
    })
    .sort((a, b) => b.score - a.score || (a.candidate.date < b.candidate.date ? 1 : -1))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export { loadPosts, loadPage, attachConcepts, relatedPosts };
