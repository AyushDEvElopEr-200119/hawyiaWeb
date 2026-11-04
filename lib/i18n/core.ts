// The language machinery, kept free of translations so it adds almost nothing to browser bundles.
// The catalog itself is registered by ./index.ts, which only server code imports.
import { cache } from "react";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const isRtl = (lang: Locale) => lang === "ar";
export const asLocale = (v: string): Locale => (v === "ar" ? "ar" : "en");

/** Props shape for every page under app/[lang]. */
export type LangParams = { params: Promise<{ lang: string }> };

let catalog: Record<string, string> = {};
export const registerCatalog = (entries: Record<string, string>) => { catalog = entries; };

// The language of the page being rendered. It is scoped to one server render, so pages call
// setLang before rendering, and everything below them can read it without passing props.
const store = cache(() => ({ lang: defaultLocale as Locale }));
export const setLang = (lang: Locale | string) => { store().lang = asLocale(lang); };
export const getLang = (): Locale => store().lang;

/** Translate one string into the given language; anything not in the catalog stays as written. */
export function tr(lang: Locale, text: string): string {
  if (lang === "en") return text;
  const key = text.trim();
  if (!key) return text;
  const hit = catalog[key];
  if (hit === undefined) { reportMissing(key); return text; }
  return hit;
}

/** Translate into the language of the page being rendered. */
export const t = (text: string) => tr(getLang(), text);

/** Prefix an internal path for the given language; external links, anchors and files are left alone. */
export function localePath(lang: Locale, href: string): string {
  if (lang === "en" || !href.startsWith("/") || href.startsWith("//")) return href;
  if (href === "/ar" || href.startsWith("/ar/")) return href;
  if (href.startsWith("/assets/") || href.startsWith("/_next/") || /\.[a-z0-9]+($|[?#])/i.test(href)) return href;
  return `/ar${href}`;
}

/** Translate every string in a data structure: used for JSON-LD and data handed to client components. */
export function localize<T>(value: T, lang: Locale = getLang(), siteUrl = ""): T {
  if (lang === "en") return value;
  if (typeof value === "string") {
    if (siteUrl && value.startsWith(`${siteUrl}/`)) return (siteUrl + localePath(lang, value.slice(siteUrl.length))) as T;
    return tr(lang, value) as T;
  }
  if (Array.isArray(value)) return value.map((v) => localize(v, lang, siteUrl)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "inLanguage" ? lang : k.startsWith("@") && k !== "@id" ? v : localize(v, lang, siteUrl)])) as T;
  }
  return value;
}

const TEXT_PROPS = ["alt", "aria-label", "placeholder", "title"] as const;
type Props = Record<string, unknown>;

function swapText(value: unknown, lang: Locale): unknown {
  if (typeof value === "string") {
    if (!value.trim()) return value;
    // keep the spaces that separate a string from its neighbours in JSX
    return value.match(/^\s*/)![0] + tr(lang, value) + value.match(/\s*$/)![0];
  }
  return Array.isArray(value) ? value.map((v) => swapText(v, lang)) : value;
}

/** What the JSX runtime does to every element: swaps its text and internal links on translated pages. */
export function localizeProps<P>(type: unknown, props: P): P {
  const lang = getLang();
  if (lang === "en") return props;
  const out = { ...props } as Props;
  if (type !== "script" && type !== "style" && "children" in out) out.children = swapText(out.children, lang);
  for (const k of TEXT_PROPS) if (typeof out[k] === "string") out[k] = swapText(out[k], lang);
  if (typeof out.href === "string") out.href = localePath(lang, out.href);
  return out as P;
}

// `I18N_COLLECT=<file> next build` lists every string the Arabic pages render without a translation.
function reportMissing(key: string) {
  const file = typeof process !== "undefined" ? process.env.I18N_COLLECT : undefined;
  if (!file || !/\p{L}/u.test(key) || /\p{Script=Arabic}/u.test(key)) return;   // already-translated text passes through here too
  (process as unknown as { getBuiltinModule(id: string): typeof import("node:fs") })
    .getBuiltinModule("node:fs").appendFileSync(file, `${JSON.stringify(key)}\n`);
}
