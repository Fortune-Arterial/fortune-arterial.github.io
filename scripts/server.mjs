import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
};

function safePath(root, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const clean = decoded.replace(/^\/+/, "");
  if (clean.split("/").includes("..")) return null;
  const target = path.resolve(root, clean);
  return target === root || target.startsWith(root + path.sep) ? target : null;
}

function send(res, status, body, type = "text/plain; charset=utf-8", headOnly = false) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  if (headOnly) res.end();
  else res.end(body);
}

export function createStaticServer(root) {
  const docRoot = path.resolve(root);
  return http.createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, "Method Not Allowed");
      return;
    }

    const url = new URL(req.url || "/", "http://localhost");
    let target = safePath(docRoot, url.pathname);
    if (!target) {
      send(res, 400, "Bad Request");
      return;
    }

    try {
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        target = path.join(target, "index.html");
      }
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
        const asDirectory = path.join(target, "index.html");
        const asHtml = `${target}.html`;
        if (fs.existsSync(asDirectory) && fs.statSync(asDirectory).isFile()) {
          target = asDirectory;
        } else if (fs.existsSync(asHtml) && fs.statSync(asHtml).isFile()) {
          target = asHtml;
        } else {
          const notFound = path.join(docRoot, "404.html");
          if (fs.existsSync(notFound)) {
            send(res, 404, fs.readFileSync(notFound), "text/html; charset=utf-8", req.method === "HEAD");
          } else {
            send(res, 404, "Not Found");
          }
          return;
        }
      }

      const type = MIME[path.extname(target).toLowerCase()] || "application/octet-stream";
      send(res, 200, fs.readFileSync(target), type, req.method === "HEAD");
    } catch (error) {
      console.error(error);
      send(res, 500, "Internal Server Error");
    }
  });
}

export function listen(server, { port = 4321, host = "127.0.0.1" } = {}) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve(server);
    });
  });
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) {
  const root = path.resolve("dist");
  const port = Number(process.env.PORT) || 4321;
  const server = createStaticServer(root);
  listen(server, { port })
    .then(() => {
      console.log(`\n  Fortune Arterial preview → http://127.0.0.1:${port}\n  serving ${root}\n`);
    })
    .catch((error) => {
      console.error(`Could not start server on port ${port}:`, error.message);
      process.exit(1);
    });
}
