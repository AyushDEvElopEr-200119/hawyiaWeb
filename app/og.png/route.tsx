import { ImageResponse } from "next/og";
import { company } from "@/lib/site";

// One share card for every page, served at /og.png (lib/seo.ts points every page at it).
// A route with a file extension skips the trailing-slash redirect, so crawlers get it directly.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, color: "#fff",
          background: "radial-gradient(120% 90% at 70% 30%, #2d8f83 0%, #0f3e39 45%, #061a18 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 44, letterSpacing: -1 }}>{company.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -3.5, maxWidth: 980 }}>You Travel, We Accommodate.</span>
          <span style={{ fontSize: 30, color: "#aeeae0" }}>{company.tagline}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
