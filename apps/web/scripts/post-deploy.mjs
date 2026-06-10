/**
 * Post-build script — genera la configuración específica de plataforma.
 *
 * Uso:
 *   DEPLOY_TARGET=github-pages node scripts/post-deploy.mjs
 *   DEPLOY_TARGET=netlify node scripts/post-deploy.mjs
 *   DEPLOY_TARGET=cloudflare node scripts/post-deploy.mjs
 *
 * Si DEPLOY_TARGET no está definido, default = netlify.
 */
import { copyFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "..", "dist");
const target = process.env.DEPLOY_TARGET;

if (!target) {
  console.log("ℹ️  DEPLOY_TARGET no definido. Skipping post-deploy (modo dev).");
  process.exit(0);
}

if (!existsSync(dist)) {
  console.error("❌ dist/ no existe. Ejecuta `vite build` primero.");
  process.exit(1);
}

const RAILWAY_API = "https://treqe-production-8518.up.railway.app";

switch (target) {
  case "github-pages": {
    // SPA routing: GitHub Pages sirve 404.html para rutas no encontradas
    copyFileSync(`${dist}/index.html`, `${dist}/404.html`);
    // Si hay CNAME custom domain, descomenta:
    // writeFileSync(`${dist}/CNAME`, "treqe.es");
    console.log("✓ GitHub Pages: 404.html creado (SPA routing)");
    break;
  }

  case "netlify": {
    // Proxy API + SPA routing
    const redirects = [
      `/api/*  ${RAILWAY_API}/api/:splat  200`,
      `/ws/*   ${RAILWAY_API}/ws/:splat   200`,
      `/*      /index.html                200`,
    ].join("\n");
    writeFileSync(`${dist}/_redirects`, redirects);
    console.log("✓ Netlify: _redirects creado (proxy + SPA)");
    break;
  }

  case "cloudflare": {
    // Cloudflare Pages soporta _redirects (mismo formato que Netlify para proxies)
    const redirects = [
      `/api/*  ${RAILWAY_API}/api/:splat  200`,
      `/ws/*   ${RAILWAY_API}/ws/:splat   200`,
    ].join("\n");
    writeFileSync(`${dist}/_redirects`, redirects);
    // CF Pages usa _routes.json para excluir del routing
    const routes = {
      version: 1,
      include: ["/*"],
      exclude: ["/assets/*"],
    };
    writeFileSync(`${dist}/_routes.json`, JSON.stringify(routes, null, 2));
    console.log("✓ Cloudflare Pages: _redirects + _routes.json creados");
    break;
  }

  default:
    console.warn(`⚠️ DEPLOY_TARGET="${target}" no reconocido. No se aplicó config.`);
}
