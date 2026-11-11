import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * DEV ONLY: serves the Vercel-style `api/*.ts` handlers from the Vite dev server,
 * so payments (and the other API routes) work with plain `npm run dev` — no
 * `vercel dev` needed. Server-only env vars (RAZORPAY_*, RESEND_API_KEY …) are
 * loaded into process.env here; they are never exposed to the browser bundle.
 */
const localApi = (): Plugin => ({
  name: "local-vercel-api",
  apply: "serve",
  configureServer(server) {
    const env = loadEnv("development", process.cwd(), "");
    for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v;

    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url || "/", "http://localhost");
      const m = url.pathname.match(/^\/api\/([\w-]+)$/);
      if (!m) return next();

      try {
        const mod: any = await server.ssrLoadModule(`/api/${m[1]}.ts`);
        const handler = mod.default;
        if (typeof handler !== "function") return next();

        const rawBodyParser = mod.config?.api?.bodyParser === false;
        if (!rawBodyParser && req.method !== "GET" && req.method !== "HEAD") {
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const text = Buffer.concat(chunks).toString("utf8");
          try { (req as any).body = text ? JSON.parse(text) : {}; } catch { (req as any).body = {}; }
        }
        (req as any).query = Object.fromEntries(url.searchParams);

        // Minimal VercelResponse shim
        const r = res as any;
        r.status = (code: number) => { res.statusCode = code; return r; };
        r.json = (data: unknown) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(data)); return r; };
        r.send = (data: unknown) => { res.end(typeof data === "string" || Buffer.isBuffer(data) ? data : JSON.stringify(data)); return r; };

        await handler(req, r);
      } catch (e) {
        console.error(`[local-api] /api/${m[1]} crashed:`, e);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Local API error — see dev server console." }));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), localApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
