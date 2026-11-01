import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="132" height="132" viewBox="290 52 556 556">
          <g strokeLinejoin="round" strokeWidth="16">
            <path fill="#0a3a94" stroke="#0a3a94" d="M306 214 L466 70 L468 222 L624 224 L522 322 L468 322 L468 462 L308 596 Z" />
            <path fill="#0a3a94" stroke="#0a3a94" d="M528 368 L662 250 L662 488 L528 596 Z" />
            <path fill="#fbb31c" stroke="#fbb31c" d="M518 186 L632 68 L826 68 L826 268 L702 374 L700 188 Z" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
