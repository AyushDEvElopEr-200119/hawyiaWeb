import type { MetadataRoute } from "next";
import { company } from "@/lib/site";
import { siteDescription } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${company.name} — ${company.tagline}`,
    short_name: company.name,
    description: siteDescription,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0a2463",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon/", sizes: "180x180", type: "image/png" },
    ],
  };
}
