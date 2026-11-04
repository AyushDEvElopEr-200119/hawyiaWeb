"use client";

import { useEffect, useState } from "react";

/** "On this page": the article's sections, with the one being read highlighted. */
export function ArticleToc({ items, title }: { items: { id: string; text: string }[]; title: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => !!el);
    let frame = 0;
    // a heading counts as current once it passes the upper third of the screen
    const update = () => {
      frame = 0;
      const passed = headings.filter((h) => h.getBoundingClientRect().top < window.innerHeight * 0.35);
      setActive((passed.at(-1) ?? headings[0])?.id);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [items]);

  return (
    <nav className="toc" aria-label={title}>
      <p className="toc-title mono">{title}</p>
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={it.id === active ? "on" : undefined} aria-current={it.id === active ? "location" : undefined}>{it.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
