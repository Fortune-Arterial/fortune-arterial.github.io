import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createStaticServer, listen } from "./server.mjs";

const root = process.cwd();
const dist = path.join(root, "dist");
let timer = null;
let building = false;
let pending = false;

function build() {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  const started = Date.now();
  const result = spawnSync(process.execPath, [path.join(root, "src", "build.mjs")], {
    cwd: root,
    stdio: "inherit",
  });
  building = false;
  if (result.status !== 0) {
    console.error(`\n  build failed after ${Date.now() - started}ms — waiting for changes…\n`);
  }
  if (pending) {
    pending = false;
    build();
  }
}

function scheduleBuild() {
  clearTimeout(timer);
  timer = setTimeout(build, 120);
}

build();

const port = Number(process.env.PORT) || 4321;
const server = createStaticServer(dist);

async function start(portToTry) {
  try {
    await listen(server, { port: portToTry });
    console.log(`\n  Fortune Arterial dev → http://127.0.0.1:${portToTry}\n  watching content/, src/, public/ and site.config.mjs\n`);
  } catch (error) {
    if (error.code === "EADDRINUSE" && portToTry < port + 10) {
      await start(portToTry + 1);
    } else {
      console.error(`Could not start dev server: ${error.message}`);
      process.exit(1);
    }
  }
}

await start(port);

const watched = ["content", "src", "public"];
for (const entry of watched) {
  const target = path.join(root, entry);
  if (!fs.existsSync(target)) continue;
  try {
    fs.watch(target, { recursive: true }, scheduleBuild);
  } catch {
    fs.watch(target, scheduleBuild);
  }
}

try {
  fs.watch(path.join(root, "site.config.mjs"), scheduleBuild);
} catch {
  /* optional */
}

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 300).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
