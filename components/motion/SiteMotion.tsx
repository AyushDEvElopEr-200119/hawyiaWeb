"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initSite } from "./initSite";

/**
 * Runs the site's motion and interactions for the current page, and tears them down
 * before the next one: every route change (and React's dev double-run) gets a clean start.
 */
export function SiteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      cleanup = initSite();
    };
    // wait one frame so the new page's DOM and styles are in place before measuring;
    // the timer covers throttled or backgrounded tabs, where frames may not fire
    const frame = requestAnimationFrame(start);
    const timer = window.setTimeout(start, 60);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      cleanup?.();
    };
  }, [pathname]);
  return null;
}
