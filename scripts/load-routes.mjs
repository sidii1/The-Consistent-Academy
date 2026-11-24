// Bundles src/seo/buildRoutes.ts (TypeScript, "@" alias) with esbuild so plain Node
// build scripts can use the exact same route/course data as the app.
import { build } from "esbuild";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

export const SITE_URL = "https://www.theconsistentacademy.in";

export async function loadRoutes() {
  const outDir = path.resolve("node_modules/.cache/tca-seo");
  fs.mkdirSync(outDir, { recursive: true });
  const outfile = path.join(outDir, `routes-${process.pid}.mjs`);
  await build({
    entryPoints: [path.resolve("src/seo/buildRoutes.ts")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "error",
    alias: { "@": path.resolve("src") },
  });
  const mod = await import(pathToFileURL(outfile).href);
  fs.rmSync(outfile, { force: true });
  return mod.buildRoutes();
}
