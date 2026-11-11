"use client";

import { useEffect, useRef } from "react";

/**
 * A floating page scrollbar for mouse/trackpad devices. The native one is hidden (only on
 * the page itself) and this slim pill floats over the content instead, so it never draws a
 * white strip beside dark sections. Dragging the thumb tracks the pointer 1:1 from where it
 * was grabbed; clicking the track jumps there. Keyboard, wheel and touch scrolling are the
 * browser's own, untouched. Touch devices keep their native overlay scrollbars.
 */
export function Scrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const track = trackRef.current!;
    const thumb = thumbRef.current!;
    const root = document.documentElement;
    root.classList.add("has-scrollbar");

    let raf = 0, idle = 0, thumbH = 0, trackH = 0, maxScroll = 0;

    const measure = () => {
      trackH = track.clientHeight;
      maxScroll = root.scrollHeight - innerHeight;
      thumbH = maxScroll > 0 ? Math.max(48, (innerHeight / root.scrollHeight) * trackH) : 0;
      thumb.style.height = `${thumbH}px`;
      track.classList.toggle("is-empty", maxScroll <= 1);
    };
    const paint = () => {
      raf = 0;
      const p = maxScroll > 0 ? scrollY / maxScroll : 0;
      thumb.style.transform = `translate3d(0, ${p * (trackH - thumbH)}px, 0)`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const onScroll = () => {
      schedule();
      track.classList.add("is-active");
      clearTimeout(idle);
      idle = window.setTimeout(() => track.classList.remove("is-active"), 900);
    };

    // drag: 1:1 with the pointer, respecting where the thumb was grabbed
    let grab = -1;
    const toScroll = (clientY: number) => {
      const top = track.getBoundingClientRect().top;
      const p = (clientY - top - grab) / Math.max(1, trackH - thumbH);
      scrollTo({ top: Math.min(1, Math.max(0, p)) * maxScroll, behavior: "instant" as ScrollBehavior });
    };
    const onThumbDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      grab = e.clientY - thumb.getBoundingClientRect().top;
      thumb.setPointerCapture(e.pointerId);
      track.classList.add("is-dragging");
      root.classList.add("is-scrubbing");
    };
    const onThumbMove = (e: PointerEvent) => { if (grab >= 0) toScroll(e.clientY); };
    const onThumbUp = (e: PointerEvent) => {
      if (grab < 0) return;
      grab = -1;
      thumb.releasePointerCapture(e.pointerId);
      track.classList.remove("is-dragging");
      root.classList.remove("is-scrubbing");
    };
    // click on the track: centre the thumb on that point
    const onTrackDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.target === thumb) return;
      const top = track.getBoundingClientRect().top;
      const p = (e.clientY - top - thumbH / 2) / Math.max(1, trackH - thumbH);
      scrollTo({ top: Math.min(1, Math.max(0, p)) * maxScroll, behavior: "smooth" });
    };

    const refresh = () => { measure(); paint(); };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    refresh();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", refresh);
    thumb.addEventListener("pointerdown", onThumbDown);
    thumb.addEventListener("pointermove", onThumbMove);
    thumb.addEventListener("pointerup", onThumbUp);
    thumb.addEventListener("pointercancel", onThumbUp);
    track.addEventListener("pointerdown", onTrackDown);

    return () => {
      root.classList.remove("has-scrollbar", "is-scrubbing");
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", refresh);
      thumb.removeEventListener("pointerdown", onThumbDown);
      thumb.removeEventListener("pointermove", onThumbMove);
      thumb.removeEventListener("pointerup", onThumbUp);
      thumb.removeEventListener("pointercancel", onThumbUp);
      track.removeEventListener("pointerdown", onTrackDown);
    };
  }, []);

  return (
    <div className="sbar" ref={trackRef} aria-hidden="true">
      <div className="sbar-thumb" ref={thumbRef} />
    </div>
  );
}
