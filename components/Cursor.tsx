"use client";

import { useEffect, useRef } from "react";
import { Spring } from "@/lib/spring";

const TARGETS = "a, button, summary, label, [role='button'], [role='tab'], .press";
const TEXT_FIELDS = "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']):not([type='range']), textarea, select, [contenteditable='true']";
const RING = 34;

/**
 * Site-wide custom cursor, after the iPad pointer (see .claude/skills/apple-design):
 * a dot glued 1:1 to the pointer (no latency), and a ring that follows on critically damped
 * springs. Over buttons and small links the ring morphs to the element's own shape and
 * leans slightly toward the pointer; over large links it swells into a soft disc; it
 * tightens on press. Text fields get the native I-beam back. Fine pointers only.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const root = document.documentElement;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resp = still ? 0.02 : 0.28;

    const x = new Spring(-100, resp), y = new Spring(-100, resp);
    const w = new Spring(RING, still ? 0.02 : 0.32), h = new Spring(RING, still ? 0.02 : 0.32);
    const r = new Spring(RING / 2, still ? 0.02 : 0.32);
    const springs = [x, y, w, h, r];

    let px = -100, py = -100, raf = 0, last = 0, pressed = false, shown = false;
    let hover: Element | null = null;
    let mode: "free" | "wrap" | "disc" | "text" = "free";

    const classify = (el: Element | null) => {
      if (!el) return null;
      if (el.closest(TEXT_FIELDS)) return { el: null, mode: "text" as const };
      const t = el.closest(TARGETS);
      if (!t) return { el: null, mode: "free" as const };
      const b = t.getBoundingClientRect();
      return { el: t, mode: b.width <= 360 && b.height <= 96 ? ("wrap" as const) : ("disc" as const) };
    };

    const retarget = () => {
      if (mode === "wrap" && hover) {
        const b = hover.getBoundingClientRect();
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        const rad = parseFloat(getComputedStyle(hover).borderTopLeftRadius) || 8;
        x.target = cx + (px - cx) * 0.12;
        y.target = cy + (py - cy) * 0.18;
        w.target = b.width + 12;
        h.target = b.height + 10;
        r.target = Math.min(rad + 5, (b.height + 10) / 2);
      } else {
        const size = mode === "disc" ? (pressed ? 60 : 72) : pressed ? 24 : RING;
        x.target = px; y.target = py;
        w.target = h.target = size;
        r.target = size / 2;
      }
      if (pressed && mode === "wrap") { w.target *= 0.94; h.target *= 0.9; }
    };

    const frame = (t: number) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60);
      last = t;
      springs.forEach((s) => s.step(dt));
      ring.style.transform = `translate3d(${x.value - w.value / 2}px, ${y.value - h.value / 2}px, 0)`;
      ring.style.width = `${w.value}px`;
      ring.style.height = `${h.value}px`;
      ring.style.borderRadius = `${r.value}px`;
      raf = springs.every((s) => s.settled) ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };

    const setMode = (next: typeof mode, el: Element | null) => {
      mode = next; hover = el;
      root.dataset.cursor = next;
    };

    const update = () => {
      const c = classify(document.elementFromPoint(px, py));
      if (c) setMode(c.mode, c.el);
      retarget();
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      px = e.clientX; py = e.clientY;
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`; // 1:1, no spring
      if (!shown) {
        shown = true;
        root.classList.add("cursor-on");
        x.jump(px); y.jump(py);
      }
      update();
    };
    const onDown = () => { pressed = true; root.dataset.pressed = ""; retarget(); kick(); };
    const onUp = () => { pressed = false; delete root.dataset.pressed; retarget(); kick(); };
    const onLeave = () => { shown = false; root.classList.remove("cursor-on"); };
    const onScroll = () => { if (shown) update(); };

    root.classList.add("has-cursor");
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      root.classList.remove("has-cursor", "cursor-on");
      delete root.dataset.cursor;
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
