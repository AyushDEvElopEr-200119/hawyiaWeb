/** The Hawiyah mark: two navy uprights joined by a bar, with an amber flag rising to the right. */
export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="255 154 560 560" aria-hidden="true">
      <g strokeLinejoin="round" strokeWidth="8">
        <path fill="var(--logo-blue, #003180)" stroke="var(--logo-blue, #003180)" d="M286 284 L424 160 L424 318 L590 318 L597 326 L495 415 L424 415 L424 588 L286 705 Z" />
        <path fill="var(--logo-blue, #003180)" stroke="var(--logo-blue, #003180)" d="M491 462 L623 346 L623 587 L491 705 Z" />
        <path fill="#feb80a" stroke="#feb80a" d="M457 295 L569 165 L782 165 L784 388 L646 504 L646 296 Z" />
      </g>
    </svg>
  );
}

/** The full lockup: mark, rule and the two-line "Hawiyah / Premium" wordmark, in English in every language. */
export function Logo() {
  return (
    <span className="brand" translate="no" lang="en">
      <LogoMark />
      <span className="brand-rule" aria-hidden="true" />
      <span className="brand-words"><b translate="no">Hawiyah</b><em translate="no">Premium</em></span>
    </span>
  );
}

export function Chev() {
  return <i className="chev" />;
}
