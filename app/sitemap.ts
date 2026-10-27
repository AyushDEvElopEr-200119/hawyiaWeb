import type { MetadataRoute } from "next";
import { company } from "@/lib/site";
import { posts } from "@/lib/blog";
import { team, topPages } from "@/lib/cws";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") =>
    ({ url: company.url + path, changeFrequency, priority });
  return [
    entry("/", 1, "weekly"),
    ...topPages.map((p) => entry(`/${p.slug}/`, p.slug === "services" ? 0.9 : 0.8)),
    entry("/team/", 0.6), ...team.map((t) => entry(`/team/${t}/`, 0.5)),
    entry("/contact/", 0.7),
    entry("/blog/", 0.8, "weekly"), ...posts.map((p) => ({ ...entry(`/blog/${p.slug}/`, 0.6), lastModified: p.date })),
    ...["/privacy-policy/", "/terms-conditions/"].map((p) => entry(p, 0.2, "yearly")),
  ];
}
