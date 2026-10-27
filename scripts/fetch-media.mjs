// Downloads the photos and videos listed in lib/media.ts into public/assets/media.
// Skips files that already exist. Run: npm run media
import { mkdirSync, existsSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { photos, videos } from "../lib/media.ts";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/media");
mkdirSync(dir, { recursive: true });

const save = async (url, file) => {
  if (existsSync(file) && statSync(file).size > 0) return "skip";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return "ok";
};

const jobs = [];
for (const [key, p] of Object.entries(photos)) {
  for (const w of p.hd ? [800, 1600, 2400] : [800, 1600]) {
    const url = `https://images.unsplash.com/${p.id}?w=${w}&q=${p.hd ? 82 : 72}&fm=webp&${p.crop ?? "fit=max"}`;
    jobs.push([url, join(dir, `${key}-${w}.webp`)]);
  }
}
for (const [key, v] of Object.entries(videos)) {
  for (const [w, url] of Object.entries(v.files)) jobs.push([url, join(dir, `${key}-${w}.mp4`)]);
}

let failed = 0;
// a few at a time, to be polite to the CDNs
for (let i = 0; i < jobs.length; i += 6) {
  await Promise.all(jobs.slice(i, i + 6).map(async ([url, file]) => {
    try { await save(url, file); } catch (e) { failed++; console.error("FAILED", e.message); }
  }));
}
console.log(`${jobs.length - failed}/${jobs.length} media files ready in public/assets/media`);
if (failed) process.exit(1);
