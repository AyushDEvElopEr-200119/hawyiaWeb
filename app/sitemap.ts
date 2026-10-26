import type { MetadataRoute } from "next";
import { apis, company, services, solutions } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/solutions/", ...solutions.map((s) => `/solutions/${s.slug}/`),
    "/custom-development/", ...services.map((s) => `/custom-development/${s.slug}/`),
    "/api-integrations/", ...apis.map((a) => `/api-integrations/${a.slug}/`),
    "/industries/", "/pricing/", "/hire-developers/", "/about/", "/resources/", "/contact/", "/request-demo/",
    "/privacy/", "/terms/", "/cookies/", "/disclaimer/",
  ];
  return paths.map((p) => ({ url: company.url + p }));
}
