"use client";

import { useState } from "react";

/** Shares the article: the system share sheet where there is one, otherwise copies the link. */
export function ShareLink({ title, labels }: { title: string; labels: { share: string; copied: string } }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // the share sheet was dismissed, or the clipboard is unavailable; nothing to do
    }
  };

  return (
    <button type="button" className={`share press${copied ? " done" : ""}`} onClick={share} aria-live="polite">
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v9M6.5 6.5 10 3l3.5 3.5M5 10.5V15a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4.5" /></svg>
      <span>{copied ? labels.copied : labels.share}</span>
    </button>
  );
}
