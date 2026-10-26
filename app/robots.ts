import type { MetadataRoute } from "next";
import { company, indexable } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // keep the temporary address out of search results until the real domain is live
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${company.url}/sitemap.xml` };
}
