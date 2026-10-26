import type { Metadata } from "next";
import { company } from "./site";
import type { Pair } from "./content";

export type Crumb = { label: string; href?: string };

/** Per-page metadata: title, description, canonical URL and Open Graph. */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  return {
    title: title ?? { absolute: `${company.name} — ${company.tagline}` },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", title: title ? `${title} | ${company.name}` : `${company.name} — ${company.tagline}`, description, url: path },
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

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: company.url,
  ...(company.email && { email: company.email }),
};
