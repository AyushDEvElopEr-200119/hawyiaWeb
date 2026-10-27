// Site content, taken from corporate-stay.com and published under the Elyra brand.
// The page copy lives in lib/data/cws-pages.json; each page is a list of sections that
// components/cws/Blocks.tsx renders in this site's design.
import pagesJson from "./data/cws-pages.json";

export type Pair = [string, string];
export type Img = { src: string; alt: string };
export type CwsLink = { href: string; text: string };
export type Card = {
  title?: string; kicker?: string; text?: string[]; list?: string[]; meta?: Pair[];
  img?: Img; href?: string; cta?: string;
};
export type Quote = { quote: string; name?: string; org?: string; by?: string };

export type Section = {
  kind: "hero" | "answer" | "split" | "prose" | "cards" | "steps" | "stats" | "faq" | "quotes"
    | "pay" | "cta" | "logos" | "genie" | "reach" | "founder" | "timeline" | "gallery";
  variant?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  text?: string[];
  links?: CwsLink[];
  images?: Img[];
  image?: Img;
  bullets?: Pair[];
  reverse?: boolean;
  role?: string;
  lead?: string;
  stats?: string[][];
  // the shape depends on `kind`: Card[] for cards/timeline, Pair[] for faq/pay, string[][] for
  // stats, Quote[] for quotes, Img[] for logos/gallery, string[] for reach, {title,text}[] for steps
  items?: unknown[];
};

export type Member = { name: string; role: string; lead: string; text: string[]; image: Img; linkedin?: string };
export type CwsPage = { title: string; meta: string; sections: Section[]; member?: Member };

const pages = pagesJson as unknown as Record<string, CwsPage>;

export function cwsPage(slug: string): CwsPage {
  const p = pages[slug];
  if (!p) throw new Error(`Unknown CWS page: ${slug}`);
  return p;
}


export const sectionsOf = (slug: string, ...kinds: Section["kind"][]) =>
  cwsPage(slug).sections.filter((s) => kinds.includes(s.kind));

/** The service and company pages served at the top level (/hotel/, /mice/ …) by app/[page]. */
export const topPages: { slug: string; label: string }[] = [
  { slug: "about-us", label: "About Us" },
  { slug: "services", label: "Services" },
  { slug: "hotel", label: "Hotel" },
  { slug: "service-apartments", label: "Service Apartments" },
  { slug: "car-rentals-ground-transport", label: "Car Rentals & Ground Transport" },
  { slug: "holidays", label: "Holidays" },
  { slug: "mice", label: "MICE" },
  { slug: "relocation-logistics", label: "Relocation & Logistics" },
  { slug: "umrah-tourism", label: "Umrah & Tourism" },
  { slug: "travgenie", label: "Travgenie" },
  { slug: "testimonial", label: "Testimonials" },
  { slug: "partner-with-us", label: "Partner with Elyra" },
];

export const team = ["rohan-kapoor", "kabir-malhotra", "meera-iyer", "vikram-rao"];
