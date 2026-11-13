import type { Metadata } from "next";
import { asLocale, localePath, tr, type LangParams, type Locale } from "./i18n";
import { company } from "./site";
import type { Pair } from "./content";

export type Crumb = { label: string; href?: string };

export const siteDescription =
  "Hawyia Premium helps businesses and households automate everything: business processes, marketing, promotions and household duties, with ready-made CRM, HRMS and ERP modules, custom software, AI and integrations.";

// the share card drawn by app/og.png/route.tsx
const shareImage = { url: "/og.png", width: 1200, height: 630, alt: `${company.name} — ${company.tagline}` };

/** Per-page metadata: title, description, canonical URL, language alternates, Open Graph and Twitter card.
    A page's `openGraph` replaces the layout's instead of merging with it, so every field is set here. */
export function pageMeta({ title, description: text, path }: { title?: string; description: string; path: string }, lang: Locale = "en"): Metadata {
  const name = tr(lang, title ?? "");
  const description = tr(lang, text);
  const brand = tr(lang, company.name);
  const full = title ? `${name} | ${brand}` : `${brand} — ${tr(lang, company.tagline)}`;
  const url = localePath(lang, path);
  const image = { ...shareImage, alt: `${brand} — ${tr(lang, company.tagline)}` };
  return {
    title: title ? name : { absolute: full },
    description,
    alternates: { canonical: url, languages: { en: path, ar: localePath("ar", path), "x-default": path } },
    openGraph: { type: "website", siteName: brand, locale: lang === "ar" ? "ar_AR" : "en_US", alternateLocale: lang === "ar" ? "en_US" : "ar_AR", title: full, description, url, images: [image] },
    twitter: { card: "summary_large_image", title: full, description, images: [image] },
  };
}

/** `generateMetadata` for a page whose metadata doesn't depend on anything but the language. */
export const metaFor = (meta: Parameters<typeof pageMeta>[0]) =>
  async ({ params }: LangParams) => pageMeta(meta, asLocale((await params).lang));

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
  ...(company.address && {
    address: { "@type": "PostalAddress", streetAddress: company.street, addressLocality: company.locality, addressCountry: company.country },
    location: {
      "@type": "Place",
      name: "Alliance Business Centers Network, DoubleTree by Hilton Muscat Qurum",
      geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${company.geo.lat},${company.geo.lng}`,
    },
  }),
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
