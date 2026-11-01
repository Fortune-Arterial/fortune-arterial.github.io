import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown.mjs";
import { categories, concepts } from "../data/map.mjs";
import { truncate, readingStats, dateParts } from "./site.mjs";
import { getLang, isEn, lp } from "./i18n.mjs";

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
  const dir = path.join(root, "content", isEn() ? "en/posts" : "posts");
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
      url: lp(`/notes/${slug}/`),
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

  posts.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title, getLang() === "en" ? "en" : "zh"),
  );

  posts.forEach((post, index) => {
    post.newer = posts[index - 1] || null;
    post.older = posts[index + 1] || null;
  });

  return posts;
}

function loadPage(root, name) {
  const dir = isEn() ? path.join(root, "content", "en", "pages") : path.join(root, "content", "pages");
  const file = path.join(dir, `${name}.md`);
  assert(fs.existsSync(file), `Missing page content: ${path.relative(root, file)}`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const rendered = renderMarkdown(content);
  return {
    ...data,
    html: rendered.html,
    toc: rendered.toc,
    plain: rendered.plain,
  };
}

/** Return a localized copy of the map, with post links for the active locale. */
function attachConcepts(posts) {
  return concepts.map((concept) => {
    const post = posts.find((item) => item.concepts[0] === concept.id) || null;
    return {
      ...concept,
      displayName: isEn() ? concept.en : concept.name,
      altName: isEn() ? "" : concept.en,
      displaySummary: isEn() ? concept.summaryEn : concept.summary,
      post: post ? post.slug : null,
      postUrl: post ? post.url : null,
      postTitle: post ? post.title : null,
    };
  });
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
