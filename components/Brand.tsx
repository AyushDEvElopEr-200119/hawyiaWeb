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

export function Chev() {
  return <i className="chev" />;
}
