"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// The interaction script loads in its own chunk, after the page has painted and hydrated,
// so it never holds up the first screen. Started once, reused per page.
let motion: Promise<typeof import("./initSite")> | undefined;
const loadMotion = () => (motion ??= import("./initSite"));

/**
 * Runs the site's interactions for the current page, and tears them down
 * before the next one: every route change (and React's dev double-run) gets a clean start.
 */
export function SiteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let started = false;
    let cancelled = false;
    const start = () => {
      if (started) return;
      started = true;
      loadMotion().then(
        ({ initSite }) => { if (!cancelled) cleanup = initSite(); },
        // if the chunk can't load, show everything rather than leave reveals hidden
        () => document.documentElement.classList.remove("js"),
      );
    };
    // wait one frame so the new page's DOM and styles are in place before measuring;
    // the timer covers throttled or backgrounded tabs, where frames may not fire
    const frame = requestAnimationFrame(start);
    const timer = window.setTimeout(start, 60);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      cleanup?.();
    };
  }, [pathname]);
  return null;
}
