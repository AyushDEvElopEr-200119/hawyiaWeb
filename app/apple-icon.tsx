import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="132" height="132" viewBox="255 154 560 560">
          <g strokeLinejoin="round" strokeWidth="8">
            <path fill="#003180" stroke="#003180" d="M286 284 L424 160 L424 318 L590 318 L597 326 L495 415 L424 415 L424 588 L286 705 Z" />
            <path fill="#003180" stroke="#003180" d="M491 462 L623 346 L623 587 L491 705 Z" />
            <path fill="#feb80a" stroke="#feb80a" d="M457 295 L569 165 L782 165 L784 388 L646 504 L646 296 Z" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
