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
          background: "radial-gradient(120% 90% at 70% 30%, #1546b0 0%, #0a2463 45%, #041030 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="255 154 560 560">
            <g strokeLinejoin="round" strokeWidth="8">
            <path fill="#ffffff" stroke="#ffffff" d="M286 284 L424 160 L424 318 L590 318 L597 326 L495 415 L424 415 L424 588 L286 705 Z" />
            <path fill="#ffffff" stroke="#ffffff" d="M491 462 L623 346 L623 587 L491 705 Z" />
            <path fill="#feb80a" stroke="#feb80a" d="M457 295 L569 165 L782 165 L784 388 L646 504 L646 296 Z" />
          </g>
          </svg>
          <span style={{ fontSize: 44, letterSpacing: -1 }}>{company.name}</span>
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
