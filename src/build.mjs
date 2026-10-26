// Builds the static site into dist/.  Run: npm run build
import { mkdirSync, writeFileSync, cpSync, rmSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { allPages } from "./pages.mjs";
import { company } from "./site.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// pages: "/about/" -> dist/about/index.html, "/404.html" -> dist/404.html
const pages = allPages();
for (const p of pages) {
  const file = p.path.endsWith(".html") ? join(out, p.path) : join(out, p.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, p.html);
}

// assets + vendor libraries (served locally, no CDN dependency)
cpSync(join(root, "src/assets"), join(out, "assets"), { recursive: true });
const vendor = join(out, "assets/vendor");
mkdirSync(vendor, { recursive: true });
for (const [from, to] of [
  ["node_modules/gsap/dist/gsap.min.js", "gsap.min.js"],
  ["node_modules/gsap/dist/ScrollTrigger.min.js", "ScrollTrigger.min.js"],
  ["node_modules/gsap/dist/Flip.min.js", "Flip.min.js"],
  ["node_modules/lenis/dist/lenis.min.js", "lenis.min.js"],
  ["node_modules/lenis/dist/lenis.css", "lenis.css"],
]) copyFileSync(join(root, from), join(vendor, to));

// favicon
mkdirSync(join(out, "assets/img"), { recursive: true });
writeFileSync(join(out, "assets/img/favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#0f3e39"/><path d="M4 18 Q16 8 28 14" stroke="#82d5c7" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="24" cy="12.6" r="2.4" fill="#82d5c7"/></svg>`);

// sitemap + robots
const urls = pages.filter((p) => !p.path.endsWith(".html")).map((p) => `  <url><loc>${company.url}${p.path}</loc></url>`).join("\n");
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${company.url}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages into dist/`);
