import type { MetadataRoute } from "next";
import { apis, company, services, solutions } from "@/lib/site";
import { posts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") =>
    ({ url: company.url + path, changeFrequency, priority });
  return [
    entry("/", 1, "weekly"),
    entry("/solutions/", 0.9), ...solutions.map((s) => entry(`/solutions/${s.slug}/`, 0.8)),
    entry("/custom-development/", 0.9), ...services.map((s) => entry(`/custom-development/${s.slug}/`, 0.8)),
    entry("/api-integrations/", 0.9), ...apis.map((a) => entry(`/api-integrations/${a.slug}/`, 0.8)),
    ...["/industries/", "/pricing/", "/hire-developers/", "/about/", "/resources/", "/contact/", "/request-demo/"].map((p) => entry(p, 0.7)),
    entry("/blog/", 0.8, "weekly"), ...posts.map((p) => ({ ...entry(`/blog/${p.slug}/`, 0.6), lastModified: p.date })),
    ...["/privacy/", "/terms/", "/cookies/", "/disclaimer/"].map((p) => entry(p, 0.2, "yearly")),
  ];
}
