import type { Metadata } from "next";
import { company } from "./site";
import type { Pair } from "./cws";

export type Crumb = { label: string; href?: string };

export const siteDescription =
  "Elyra manages corporate travel end to end — hotels, serviced apartments, chauffeur cars, MICE and relocation across 185+ countries. Since 2016.";

// the share card drawn by app/og.png/route.tsx
const shareImage = { url: "/og.png", width: 1200, height: 630, alt: `${company.name} — ${company.tagline}` };

/** Per-page metadata: title, description, canonical URL, Open Graph and Twitter card.
    A page's `openGraph` replaces the layout's instead of merging with it, so every field is set here. */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const full = title ? `${title} | ${company.short}` : `${company.tagline} | ${company.short}`;
  return {
    title: title ?? { absolute: full },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: company.name, locale: "en_US", title: full, description, url: path, images: [shareImage] },
    twitter: { card: "summary_large_image", title: full, description, images: [shareImage] },
  };
}

export function breadcrumbSchema(trail: Crumb[], path: string) {
  const items = [{ name: "Home", item: `${company.url}/` }, ...trail.map((t) => ({ name: t.label, item: company.url + (t.href ?? path) }))];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, ...it })),
  };
}

export function faqSchema(faq: Pair[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

/** A product or service page: what it is, who provides it, and where it lives. */
export function serviceSchema({ name, description, path, type }: { name: string; description: string; path: string; type: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: type,
    description,
    url: company.url + path,
    provider: { "@id": `${company.url}/#organization` },
    areaServed: "Worldwide",
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${company.url}/#organization`,
  name: company.name,
  url: company.url,
  logo: `${company.url}/icon.svg`,
  alternateName: company.short,
  foundingDate: "2016",
  sameAs: company.social.map((s) => s.href),
  description: siteDescription,
  ...(company.email && { email: company.email }),
  ...(company.phone && { telephone: company.phone }),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${company.url}/#website`,
  name: company.name,
  url: company.url,
  publisher: { "@id": `${company.url}/#organization` },
  inLanguage: "en",
};
