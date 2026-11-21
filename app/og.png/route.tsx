import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { company } from "@/lib/site";

// One share card for every page, served at /og.png (lib/seo.ts points every page at it).
// A route with a file extension skips the trailing-slash redirect, so crawlers get it directly.
export const dynamic = "force-static";

// the white-lettered logo, made for dark backgrounds like this card
const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/assets/brand/hawiyah-logo-white.png")).toString("base64")}`;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, color: "#fff",
          background: "radial-gradient(120% 90% at 70% 30%, #1546b0 0%, #0a2463 45%, #041030 100%)",
        }}
      >
        <div style={{ display: "flex", alignSelf: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={332} height={130} alt={company.name} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -3.5, maxWidth: 980 }}>{company.tagline}.</span>
          <span style={{ fontSize: 30, color: "#fcd77a" }}>Software development · Automation · AI</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
