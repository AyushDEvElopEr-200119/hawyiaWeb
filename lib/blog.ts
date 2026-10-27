// The Elyra Journal: articles for /blog/ and /blog/[slug]/, from lib/data/cws-posts.json
// (newest first). Paragraph, list and quote text may carry inline links and emphasis as HTML.
import postsJson from "./data/cws-posts.json";
import type { Pair } from "./cws";

export type Block =
  | { p: string }
  | { h2: string }
  | { h3: string }
  | { list: string[] }
  | { quote: string }
  | { img: { src: string; alt: string; caption?: string } }
  | { table: string[][] }
  | { faq: Pair }
  | { note: { title: string; text: string } };

export const categories = ["Corporate Travel", "Industry Insights", "Travel Tips"] as const;

export type Post = {
  slug: string;
  tag: string;           // the category
  title: string;
  excerpt: string;
  meta: string;          // search description
  date: string;          // ISO date, YYYY-MM-DD
  minutes: number | null;
  photo: string;         // a public path, or a key in lib/media.ts
  body: Block[];
  faq: Pair[];
};

export const posts = postsJson as unknown as Post[];

/* ---------------- helpers ---------------- */
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

/** "October 21, 2026", fixed to UTC so server and browser always agree. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

const words = (b: Block): string =>
  "p" in b ? b.p : "h2" in b ? b.h2 : "h3" in b ? b.h3 : "quote" in b ? b.quote : "list" in b ? b.list.join(" ")
    : "table" in b ? b.table.flat().join(" ") : "faq" in b ? b.faq.join(" ") : "note" in b ? `${b.note.title} ${b.note.text}` : "";

/** The source's own reading time, or about 220 words a minute, never less than 2. */
export const readMinutes = (post: Post) =>
  post.minutes ?? Math.max(2, Math.round(post.body.map(words).join(" ").replace(/<[^>]+>/g, "").split(/\s+/).length / 220));

/** Heading text as a URL fragment, for the contents list. */
export const anchor = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** The card-sized view of a post, safe to pass to client components. */
export type PostCardData = Pick<Post, "slug" | "tag" | "title" | "excerpt" | "photo"> & { date: string; minutes: number };
export const toCard = (p: Post): PostCardData => ({
  slug: p.slug, tag: p.tag, title: p.title, excerpt: p.excerpt, photo: p.photo, date: formatDate(p.date), minutes: readMinutes(p),
});
