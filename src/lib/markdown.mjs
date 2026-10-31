import MarkdownIt from "markdown-it";
import container from "markdown-it-container";
import hljs from "highlight.js";
import katex from "katex";

const CALLOUTS = {
  note: { label: "注", icon: "◎" },
  tip: { label: "提示", icon: "✦" },
  warn: { label: "注意", icon: "△" },
};

function katexHtml(source, displayMode) {
  try {
    return katex.renderToString(source, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      output: "htmlAndMathml",
    });
  } catch (error) {
    return `<code class="math-error" title="${String(error.message).replace(/"/g, "&quot;")}">${source}</code>`;
  }
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function plainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function createMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    breaks: false,
  });

  /** Inline math: $...$ (no whitespace right after the opening dollar). */
  md.inline.ruler.before("escape", "math_inline", (state, silent) => {
    const start = state.pos;
    const src = state.src;
    if (src[start] !== "$") return false;
    if (src[start + 1] === "$") return false;
    if (!src[start + 1] || /\s/.test(src[start + 1])) return false;

    let pos = start + 1;
    while (pos < src.length) {
      const ch = src[pos];
      if (ch === "\\") {
        pos += 2;
        continue;
      }
      if (ch === "\n") return false;
      if (ch === "$") {
        if (src[pos + 1] === "$") return false;
        const content = src.slice(start + 1, pos);
        if (!content.trim()) return false;
        if (silent) return true;
        const token = state.push("math_inline", "math", 0);
        token.content = content;
        token.markup = "$";
        state.pos = pos + 1;
        return true;
      }
      pos += 1;
    }
    return false;
  });

  /** Display math: $$ ... $$ on one line or across lines. */
  md.block.ruler.before(
    "fence",
    "math_block",
    (state, startLine, endLine, silent) => {
      const lineStart = state.bMarks[startLine] + state.tShift[startLine];
      const lineEnd = state.eMarks[startLine];
      if (state.src.slice(lineStart, lineStart + 2) !== "$$") return false;
      if (silent) return true;

      let content = state.src.slice(lineStart + 2, lineEnd);
      let nextLine = startLine;
      let found = false;

      if (content.includes("$$")) {
        content = content.slice(0, content.indexOf("$$"));
        found = true;
      } else {
        const lines = [content];
        nextLine = startLine + 1;
        while (nextLine < endLine) {
          const ls = state.bMarks[nextLine] + state.tShift[nextLine];
          const le = state.eMarks[nextLine];
          const line = state.src.slice(ls, le);
          const close = line.indexOf("$$");
          if (close !== -1) {
            lines.push(line.slice(0, close));
            found = true;
            break;
          }
          lines.push(line);
          nextLine += 1;
        }
        if (!found) return false;
        content = lines.join("\n");
      }

      const token = state.push("math_block", "math", 0);
      token.block = true;
      token.content = content.trim();
      token.markup = "$$";
      token.map = [startLine, nextLine + 1];
      state.line = nextLine + 1;
      return true;
    },
  );

  md.renderer.rules.math_inline = (tokens, idx) =>
    katexHtml(tokens[idx].content, false);

  md.renderer.rules.math_block = (tokens, idx) =>
    `<div class="math-display">${katexHtml(tokens[idx].content, true)}</div>`;

  for (const [type, meta] of Object.entries(CALLOUTS)) {
    md.use(container, type, {
      validate: (params) => params.trim().split(/\s+/)[0] === type,
      render: (tokens, idx) => {
        if (tokens[idx].nesting === 1) {
          const title =
            tokens[idx].info.trim().replace(new RegExp(`^${type}\\s*`), "") ||
            meta.label;
          return `<aside class="callout callout-${type}">
  <p class="callout-head"><span class="callout-icon" aria-hidden="true">${meta.icon}</span>${md.utils.escapeHtml(title)}</p>
  <div class="callout-body">`;
        }
        return "</div></aside>\n";
      },
    });
  }

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const lang = (token.info || "").trim().split(/\s+/)[0];
    let body;
    if (lang && hljs.getLanguage(lang)) {
      body = hljs.highlight(token.content, { language: lang, ignoreIllegals: true }).value;
    } else {
      body = md.utils.escapeHtml(token.content);
    }
    return `<div class="code-block" data-lang="${md.utils.escapeHtml(lang || "text")}">
  <div class="code-head"><span class="code-lang">${md.utils.escapeHtml(lang || "text")}</span><button class="code-copy" type="button" data-copy>复制</button></div>
  <pre class="hljs"><code>${body}</code></pre>
</div>`;
  };

  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>';
  md.renderer.rules.table_close = () => "</table></div>";

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const href = token.attrGet("href") || "";
    if (/^https?:\/\//i.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    }
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    token.attrSet("loading", "lazy");
    token.attrSet("decoding", "async");
    const alt = token.content;
    const src = token.attrGet("src");
    const title = token.attrGet("title");
    let html = `<img src="${md.utils.escapeHtml(src)}" alt="${md.utils.escapeHtml(alt || "")}" loading="lazy" decoding="async"`;
    if (title) html += ` title="${md.utils.escapeHtml(title)}"`;
    html += ">";
    if (title) {
      return `<figure class="prose-figure">${html}<figcaption>${md.utils.escapeHtml(title)}</figcaption></figure>`;
    }
    return html;
  };

  md.core.ruler.push("heading_ids", (state) => {
    const toc = [];
    const used = new Map();
    for (let i = 0; i < state.tokens.length; i += 1) {
      const token = state.tokens[i];
      if (token.type !== "heading_open") continue;
      const level = Number(token.tag.slice(1));
      if (level !== 2 && level !== 3) continue;
      const inline = state.tokens[i + 1];
      const text = inline.content
        .replace(/\$([^$]+)\$/g, (_, math) => math.replace(/\\[a-zA-Z]+|[{}]/g, ""))
        .replace(/[*_`~]/g, "")
        .trim();
      let id = slugify(text) || `section-${toc.length + 1}`;
      const count = used.get(id) || 0;
      used.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;
      token.attrSet("id", id);
      toc.push({ level, text, id });
    }
    state.env.toc = toc;
  });

  return md;
}

const md = createMarkdown();

export function renderMarkdown(source) {
  const env = {};
  let html = md.render(source, env);
  html = html.replace(
    /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g,
    (_, level, id, inner) =>
      `<h${level} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="链接到本节" tabindex="-1">#</a></h${level}>`,
  );
  return { html, toc: env.toc || [], plain: plainText(html) };
}

export { plainText, slugify };
