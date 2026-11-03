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
          <svg width="64" height="64" viewBox="290 52 556 556">
            <g strokeLinejoin="round" strokeWidth="16">
            <path fill="#ffffff" stroke="#ffffff" d="M306 214 L466 70 L468 222 L624 224 L522 322 L468 322 L468 462 L308 596 Z" />
            <path fill="#ffffff" stroke="#ffffff" d="M528 368 L662 250 L662 488 L528 596 Z" />
            <path fill="#fbb31c" stroke="#fbb31c" d="M518 186 L632 68 L826 68 L826 268 L702 374 L700 188 Z" />
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
