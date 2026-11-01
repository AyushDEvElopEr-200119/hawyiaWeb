import { useId } from "react";

/** The Hawyia mark: two navy uprights joined by a bar, with an amber flag rising to the right. */
export function LogoMark() {
  const id = useId();
  return (
    <svg className="logo-mark" viewBox="290 52 556 556" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}n`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--logo-blue, #0b45a8)" />
          <stop offset="1" stopColor="var(--logo-navy, #061a4d)" />
        </linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fdc12a" />
          <stop offset="1" stopColor="#f39a05" />
        </linearGradient>
      </defs>
      <g strokeLinejoin="round" strokeWidth="16">
        <path fill={`url(#${id}n)`} stroke={`url(#${id}n)`} d="M306 214 L466 70 L468 222 L624 224 L522 322 L468 322 L468 462 L308 596 Z" />
        <path fill={`url(#${id}n)`} stroke={`url(#${id}n)`} d="M528 368 L662 250 L662 488 L528 596 Z" />
        <path fill={`url(#${id}a)`} stroke={`url(#${id}a)`} d="M518 186 L632 68 L826 68 L826 268 L702 374 L700 188 Z" />
      </g>
    </svg>
  );
}

/** The full lockup: mark, rule and the two-line "Hawyia / Premium" wordmark. */
export function Logo() {
  return (
    <span className="brand">
      <LogoMark />
      <span className="brand-rule" aria-hidden="true" />
      <span className="brand-words"><b>Hawyia</b><em>Premium</em></span>
    </span>
  );
}

export function Chev() {
  return <i className="chev" />;
}
