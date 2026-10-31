import config from "../../site.config.mjs";

const rawBase = config.basePath || "/";
export const base = rawBase.startsWith("/") ? rawBase : `/${rawBase}`;
export const baseWithSlash = base.endsWith("/") ? base : `${base}/`;

export { config };

/** Prefix an internal path with the configured base path. */
export function url(path = "/") {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(path)) return path;
  const clean = String(path).replace(/^\//, "");
  return `${baseWithSlash}${clean}`;
}

/** Absolute URL for canonical links, feeds and OG tags. */
export function abs(path = "/") {
  let origin = config.siteUrl.replace(/\/$/, "");
  const baseNoSlash = baseWithSlash.replace(/\/$/, "");
  // Accept siteUrl with or without the project path already appended.
  if (baseNoSlash && origin.endsWith(baseNoSlash)) {
    origin = origin.slice(0, -baseNoSlash.length);
  }
  return `${origin}${url(path)}`;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const pad = (n) => String(n).padStart(2, "0");

export function dateParts(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!match) throw new Error(`Invalid date: ${iso}`);
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function formatDate(iso, style = "dot") {
  const { year, month, day } = dateParts(iso);
  switch (style) {
    case "long":
      return `${year} 年 ${month} 月 ${day} 日`;
    case "short":
      return `${pad(month)}.${pad(day)}`;
    case "machine":
      return `${year}-${pad(month)}-${pad(day)}`;
    case "rfc":
      return new Date(Date.UTC(year, month - 1, day)).toUTCString();
    case "dot":
    default:
      return `${year}.${pad(month)}.${pad(day)}`;
  }
}

/** Rough reading time: 400 CJK characters or 220 Latin words per minute. */
export function readingStats(source) {
  const clean = String(source)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+\$/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]/g, " ");

  const cjk = (clean.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  const latin = (clean.replace(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g, " ").match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length;
  const minutes = Math.max(1, Math.round(cjk / 400 + latin / 220));
  return { minutes, cjk, latin, characters: cjk + latin };
}

export function truncate(text, limit = 120) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if ([...clean].length <= limit) return clean;
  return `${[...clean].slice(0, limit).join("").replace(/[，。；、,\s]+$/, "")}…`;
}


