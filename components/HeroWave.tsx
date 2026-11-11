"use client";

import { useEffect, useRef } from "react";

/**
 * The home hero's particle wave: two ribbons of glowing dots that twist around each other,
 * coloured cyan → blue → violet → magenta across the screen. Canvas 2D, additive blending.
 * Pauses when off screen or in a background tab; draws one still frame with reduced motion.
 */
export function HeroWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, t0 = performance.now();

    // colour stops across the width
    const stops = [[34, 211, 238], [59, 130, 246], [139, 92, 246], [217, 70, 239]];
    const colourAt = (u: number) => {
      const x = Math.min(0.999, Math.max(0, u)) * (stops.length - 1);
      const i = Math.floor(x), f = x - i, a = stops[i], b = stops[i + 1];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const t = (time - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const strands = w < 700 ? 28 : 46;
      const step = w < 700 ? 5 : 4;
      const k = (Math.PI * 2) / Math.max(w * 0.85, 520);
      const mid = h * 0.52;
      const amp = h * 0.24;
      const band = h * 0.22;
      for (let ribbon = 0; ribbon < 2; ribbon++) {
        const phase = ribbon * Math.PI;
        for (let s = 0; s < strands; s++) {
          const v = s / (strands - 1) * 2 - 1;            // -1 … 1 across the ribbon
          for (let x = -10; x <= w + 10; x += step) {
            const a = k * x + t * 0.35 + phase;
            const twist = Math.cos(k * x * 0.55 - t * 0.25 + phase);
            const y = mid + Math.sin(a) * amp + v * band * twist + Math.sin(a * 2.3 + v * 1.7) * 6;
            const depth = 0.5 + 0.5 * Math.sin(a + v * 1.2);   // 0 back … 1 front
            const [r, g, b] = colourAt(x / w);
            const alpha = (0.3 + 0.7 * depth) * (1 - Math.abs(v) * 0.35);
            const size = 0.9 + depth * 1.4;
            ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha.toFixed(3)})`;
            ctx.fillRect(x, y, size, size);
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (time: number) => {
      draw(time);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => { if (!raf && !still) raf = requestAnimationFrame(loop); };

    resize();
    draw(performance.now());
    start();

    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return <canvas className="hw-canvas" ref={ref} aria-hidden="true" />;
}
