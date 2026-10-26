/** The Elyra mark: a disc with a flight path. `inner` colours the path and the dot. */
export function LogoMark({ inner = "var(--bg)" }: { inner?: string }) {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="currentColor" />
      <path d="M4 18 Q16 8 28 14" stroke={inner} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="12.6" r="2.4" fill={inner} />
    </svg>
  );
}

/**
 * Footer ring: an 8-lobed wave around a circle, drawn as a thick mint band with a blurred
 * white core on top, so the edges stay crisp and mint while the middle fades to white.
 */
export function Ring({ radius = 420, depth = 0.07, lobes = 8, band = 190 }) {
  const pts: string[] = [];
  for (let deg = 0; deg < 360; deg += 1) {
    const t = (deg * Math.PI) / 180;
    // + PI puts a soft dip at the top centre, between two lobes
    const r = radius * (1 + depth * Math.cos(lobes * t + Math.PI));
    pts.push(`${(r * Math.cos(t - Math.PI / 2)).toFixed(1)} ${(r * Math.sin(t - Math.PI / 2)).toFixed(1)}`);
  }
  const d = `M${pts.join("L")}Z`;
  return (
    <svg className="ring" viewBox="-600 -600 1200 1200" focusable="false">
      <defs>
        <filter id="ringSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>
      <g fill="none" strokeLinejoin="round">
        <path d={d} stroke="rgb(130 213 199)" strokeWidth={band} />
        <path d={d} stroke="#fff" strokeWidth={Math.round(band * 0.56)} filter="url(#ringSoft)" />
      </g>
    </svg>
  );
}

export function Chev() {
  return <i className="chev" />;
}
