import type { MetadataRoute } from "next";
import { apis, company, products, services, solutions } from "@/lib/site";
import { posts } from "@/lib/blog";
import { hasSamples } from "@/lib/testimonials";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") =>
    ({ url: company.url + path, changeFrequency, priority, path });
  const pages = [
    entry("/", 1, "weekly"),
    entry("/solutions/", 0.9), ...solutions.map((s) => entry(`/solutions/${s.slug}/`, 0.8)),
    entry("/business-software/", 0.9), ...products.map((p) => entry(`/business-software/${p.slug}/`, 0.8)),
    entry("/automation/", 0.9),
    entry("/custom-development/", 0.9), ...services.map((s) => entry(`/custom-development/${s.slug}/`, 0.8)),
    entry("/api-integrations/", 0.9), ...apis.map((a) => entry(`/api-integrations/${a.slug}/`, 0.8)),
    ...["/industries/", "/pricing/", "/hire-developers/", "/about/", "/resources/", "/contact/", "/request-demo/"].map((p) => entry(p, 0.7)),
    // listed once the sample stories in lib/testimonials.ts are replaced with real ones
    ...(hasSamples ? [] : [entry("/testimonials/", 0.7)]),
    entry("/blog/", 0.8, "weekly"), ...posts.map((p) => ({ ...entry(`/blog/${p.slug}/`, 0.6), lastModified: p.date })),
    ...["/privacy/", "/terms/", "/cookies/", "/disclaimer/"].map((p) => entry(p, 0.2, "yearly")),
  ];
  // every page in both languages, each pointing at its counterpart
  return pages.flatMap(({ path, ...page }) => {
    const alternates = { languages: { en: company.url + path, ar: `${company.url}/ar${path}` } };
    return [{ ...page, alternates }, { ...page, url: `${company.url}/ar${path}`, alternates }];
  });
}
