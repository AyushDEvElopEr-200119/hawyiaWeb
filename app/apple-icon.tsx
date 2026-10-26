import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f3e39" }}>
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M4 18 Q16 8 28 14" stroke="#82d5c7" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="12.6" r="2.4" fill="#82d5c7" />
        </svg>
      </div>
    ),
    size,
  );
}
