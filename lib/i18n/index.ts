// Site languages. Copy is written in English everywhere; lib/i18n/ar.json maps each English
// string to its Arabic text, and a string with no entry shows in English. English keeps the bare
// URLs and Arabic lives under /ar/ (see the rewrites in next.config.ts).
// `npm run i18n:check` lists anything the Arabic pages render without a translation.
import ar from "./ar.json";
import { registerCatalog } from "./core";

registerCatalog(ar as Record<string, string>);

export * from "./core";
