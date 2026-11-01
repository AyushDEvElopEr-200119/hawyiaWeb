import type { Metadata } from "next";
import { company } from "./site";
import type { Pair } from "./content";

export type Crumb = { label: string; href?: string };

export const siteDescription =
  "Hawyia helps travel businesses launch, customize and scale their own online booking platforms with white-label solutions, custom development and travel API integrations.";

// the share card drawn by app/og.png/route.tsx
const shareImage = { url: "/og.png", width: 1200, height: 630, alt: `${company.name} — ${company.tagline}` };

/** Per-page metadata: title, description, canonical URL, Open Graph and Twitter card.
    A page's `openGraph` replaces the layout's instead of merging with it, so every field is set here. */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const full = title ? `${title} | ${company.name}` : `${company.name} — ${company.tagline}`;
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
