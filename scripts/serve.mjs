import path from "node:path";
import { createStaticServer, listen } from "./server.mjs";

const port = Number(process.env.PORT) || 4321;
const root = path.resolve("dist");
const server = createStaticServer(root);

try {
  await listen(server, { port });
  console.log(`\n  Fortune Arterial preview → http://127.0.0.1:${port}\n  serving ${root}\n`);
} catch (error) {
  console.error(`Could not start preview on port ${port}: ${error.message}`);
  console.error("Build the site first with `npm run build`, or run `npm run dev`.");
  process.exit(1);
}
