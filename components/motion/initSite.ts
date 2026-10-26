/* Elyra — site motion and interactions (GSAP + ScrollTrigger + Flip, Lenis smooth scroll).
   Ported from the static site's main.js and micro.js, following the apple-design skill:
   respond on press, track the pointer 1:1, start every animation from the current
   on-screen value, and keep it subtle. Pointer effects only run with a precise,
   hovering pointer; nothing runs for prefers-reduced-motion except plain fades.

   initSite() runs after every route change and returns a cleanup that reverts every
   tween and ScrollTrigger (one gsap.context), removes every listener (one AbortSignal),
   disconnects observers and destroys Lenis. React renders all the markup; this only
   animates and wires behaviour, so it never creates or replaces DOM that React owns. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Flip);

type El = HTMLElement;
declare global {
  interface Window { __lenis?: Lenis | null }
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const $ = <T extends Element = El>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element = El>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];

export function initSite(): () => void {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  const ac = new AbortController();
  const on = <K extends string>(
    target: EventTarget, type: K, fn: (e: any) => void, opts: AddEventListenerOptions = {},
  ) => target.addEventListener(type, fn, { ...opts, signal: ac.signal });
  const observers: IntersectionObserver[] = [];
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const haptic = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch { /* not supported */ } };
  // Like gsap.quickTo, but survives other tweens on the same element: each call starts
  // from the current on-screen value and only replaces tweens of its own property.
  const follow = (el: Element, prop: string, { duration = 0.5, ease = "power3.out" } = {}) =>
    (v: number) => gsap.to(el, { [prop]: v, duration, ease, overwrite: "auto" });

  gsap.defaults({ ease: "expo.out", duration: 0.9 });

  /* ---------- Lenis smooth scroll, driven by GSAP's ticker ---------- */
  let lenis: Lenis | null = null;
  const raf = (time: number) => lenis?.raf(time * 1000);
  if (!reduced) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }
  window.__lenis = lenis;

  const header = $("#header");
  const menuBtn = $("#menuBtn");
  const menu = $("#mobileMenu");
  const megaItems = $$(".has-mega");

  const scrollToTarget = (target: El) => {
    if (lenis) lenis.scrollTo(target, { offset: -90 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  function setMenu(open: boolean) {
    if (!menu || !menuBtn || menu.classList.contains("open") === open) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop(); else lenis?.start();
    if (open && !reduced) gsap.fromTo($$(".mm-link, .mobile-menu > .btn-pill", menu), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.035, duration: 0.6, delay: 0.05 });
  }

  let closeTimer = 0;
  function openMega(li: El) {
    megaItems.forEach((x) => x !== li && closeMega(x));
    const btn = $(".nav-link", li)!, panel = $(".mega", li)!;
    if (btn.getAttribute("aria-expanded") === "true") return;
    li.dataset.openedAt = String(performance.now());
    btn.setAttribute("aria-expanded", "true");
    panel.classList.add("open");
    gsap.fromTo(panel,
      { opacity: 0, y: -8, scale: 0.97, filter: "blur(6px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: reduced ? 0.01 : 0.45, transformOrigin: "50% 0%", overwrite: true });
    gsap.fromTo($$(".mega-link, .mega-aside", panel), { opacity: 0, y: 6 }, { opacity: 1, y: 0, stagger: 0.02, duration: reduced ? 0.01 : 0.5, overwrite: true });
  }
  function closeMega(li: El, instant = false) {
    const btn = $(".nav-link", li)!, panel = $(".mega", li)!;
    if (btn.getAttribute("aria-expanded") !== "true") return;
    btn.setAttribute("aria-expanded", "false");
    if (instant) { gsap.set(panel, { opacity: 0 }); panel.classList.remove("open"); return; }
    // exit the same way it came in, starting from wherever it is now
    gsap.to(panel, { opacity: 0, y: -8, scale: 0.97, filter: "blur(6px)", duration: reduced ? 0.01 : 0.25, ease: "power2.in", overwrite: true,
      onComplete: () => panel.classList.remove("open") });
  }
  const closeAllMega = () => megaItems.forEach((li) => closeMega(li));

  const ctx = gsap.context(() => {
    /* ---------- same-page anchors scroll smoothly (runs before Next's <Link>) ---------- */
    on(document, "click", (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href*='#']");
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash || url.hash === "#") return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      closeAllMega();
      setMenu(false);
      scrollToTarget(el);
      history.pushState(null, "", url.hash);
    }, { capture: true });
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) later(() => scrollToTarget(el), 300);
    }

    /* ---------- header state over dark media ---------- */
    const darkZones = $$(".hero, .bleed");
    const updateHeader = () => {
      if (!header) return;
      const probe = 50;
      const onDark = darkZones.some((z) => {
        const r = z.getBoundingClientRect();
        if (z.classList.contains("hero")) return r.top <= probe && scrollY < (z.offsetHeight - innerHeight) * 0.78;
        return r.top <= probe && r.bottom > probe && innerWidth > 860;
      });
      header.classList.toggle("on-dark", onDark);
      header.classList.toggle("scrolled", scrollY > (darkZones[0]?.classList.contains("hero") ? innerHeight * 0.5 : 20));
    };
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: updateHeader });
    updateHeader();

    /* ---------- mega menus: grow out of their trigger, close on Esc / outside ---------- */
    megaItems.forEach((li) => {
      const btn = $(".nav-link", li)!;
      on(btn, "click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        // a click that lands just after hover opened the panel shouldn't immediately close it
        if (open && performance.now() - Number(li.dataset.openedAt || 0) > 400) closeMega(li);
        else openMega(li);
      });
      if (canHover) {
        on(li, "pointerenter", () => { clearTimeout(closeTimer); openMega(li); });
        on(li, "pointerleave", () => { closeTimer = later(() => closeMega(li), 160); });
      }
      on(li, "focusout", (e: FocusEvent) => { if (!li.contains(e.relatedTarget as Node)) closeMega(li); });
      // following a link closes the panel right away (the page is about to change)
      $$("a", li).forEach((a) => on(a, "click", () => closeMega(li, true)));
    });
    on(document, "keydown", (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const open = megaItems.find((li) => $(".nav-link", li)!.getAttribute("aria-expanded") === "true");
      if (open) { closeMega(open); $(".nav-link", open)!.focus(); }
      setMenu(false);
    });
    on(document, "pointerdown", (e: PointerEvent) => { if (!(e.target as Element).closest(".has-mega")) closeAllMega(); });

    /* ---------- mobile menu ---------- */
    if (menu && menuBtn) {
      on(menuBtn, "click", () => setMenu(!menu.classList.contains("open")));
      $$("a", menu).forEach((a) => on(a, "click", () => setMenu(false)));
    }

    /* ---------- reveals (batched so neighbours stagger together) ---------- */
    if (reduced) {
      $$(".reveal").forEach((el) => el.classList.add("in"));
    } else {
      ScrollTrigger.batch(".reveal", {
        start: "top 92%",
        once: true,
        // transform + opacity only: blurring a whole batch at once is costly to paint on phones
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 1.1, overwrite: "auto",
          onComplete() { batch.forEach((el) => el.classList.add("in")); } }),
      });
    }

    /* ---------- statements: words brighten as you scroll ---------- */
    if (!reduced) {
      $$(".statement-text").forEach((el) => {
        gsap.fromTo($$(".sw", el), { opacity: 0.18 }, {
          opacity: 1, ease: "none", stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: true },
        });
      });
    }

    /* ---------- background videos: play only while visible, never for reduced motion ---------- */
    $$<HTMLVideoElement>("video[data-autoplay]").forEach((v) => {
      if (reduced) { v.pause(); return; }
      v.muted = true;
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }, { threshold: 0.1 });
      io.observe(v);
      observers.push(io);
    });

    /* ---------- photo parallax (subtle; transform only) ---------- */
    if (!reduced) {
      const drift = (sel: string, trigger: string | null, from: number, to: number) => $$(sel).forEach((el) =>
        gsap.fromTo(el, { yPercent: from }, { yPercent: to, ease: "none",
          scrollTrigger: { trigger: trigger ? el.closest(trigger) : el, start: "top bottom", end: "bottom top", scrub: true } }));
      drift(".ph-bg", "[data-ph-media]", -4, 6);
      drift(".bleed-media .media-bg", ".bleed", -6, 6);
      drift(".post-media img, .ind-img", null, -3, 3);
      $$(".b-photo .b-img").forEach((im) =>
        gsap.fromTo(im, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: im.closest(".b-card"), start: "top bottom", end: "bottom top", scrub: true } }));
    }

    /* ---------- media unveil: a frame opens from an inset window while its photo settles
       from a slight zoom, tied to scroll so it tracks the reader 1:1 and reverses on the way up ---------- */
    if (!reduced) {
      $$(".feature-media, .post-media").forEach((frame) => {
        const r = getComputedStyle(frame).borderTopLeftRadius;
        gsap.fromTo(frame, { clipPath: `inset(7% 7% 7% 7% round ${r})` }, { clipPath: `inset(0% 0% 0% 0% round ${r})`, ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "top 55%", scrub: 0.4 } });
      });
      $$(".feature-media .media-bg, .post-media img, .b-photo .b-img").forEach((img) =>
        gsap.fromTo(img, { scale: 1.16 }, { scale: 1, ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "top 40%", scrub: 0.4 } }));
    }

    /* ---------- home hero: headline sharpens, media collapses into a band on scroll ---------- */
    const hero = $(".hero");
    const heroMedia = $("#heroMedia");
    if (hero && heroMedia) {
      const spans = $$("#heroTitle span");
      // the headline's entrance is CSS (it paints with the HTML); this only scrubs the exit
      const state = { p: 0 };
      const paint = () => {
        const out = clamp((state.p - 0.45) / 0.3);
        spans.forEach((s) => {
          s.style.setProperty("--blur", `${out * 8}px`);
          s.style.setProperty("--op", String(1 - out));
          s.style.setProperty("--ty", `${-out * 30}px`);
        });
        const collapse = clamp((state.p - 0.35) / 0.65);
        heroMedia.style.setProperty("--clip", `${collapse * 88}%`);
        heroMedia.style.setProperty("--r", `${collapse * 60}px`);
      };
      ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom bottom", onUpdate: (st) => { state.p = st.progress; paint(); } });
      paint();
    }

    /* ---------- expanding stages: a rounded card grows to fill the screen while pinned ----------
       CSS sizes each frame from --p (0 = card, 1 = full screen); GSAP only scrubs --p. */
    const mm = gsap.matchMedia();
    // GSAP wraps a pinned element in a spacer. React removes each page's top-level sections
    // from <main> on navigation, so a pinned element must never be one of them.
    const assertPinnable = (el: El) => {
      if (process.env.NODE_ENV !== "production" && el.parentElement?.id === "main") {
        console.warn("Pinned element is a direct child of <main>. Wrap it in a <section> so page changes keep working.", el);
      }
    };
    const expand = (stage: El) => {
      assertPinnable(stage);
      return gsap.timeline({ scrollTrigger: { trigger: stage, start: "top top", end: "+=110%", pin: true, scrub: 0.6, anticipatePin: 1 } })
        .fromTo(stage, { "--p": 0 }, { "--p": 1, ease: "power2.inOut", duration: 1 })
        .to({}, { duration: 0.3 });   // hold at full screen before moving on
    };
    mm.add("(prefers-reduced-motion: no-preference)", () => { $$("[data-expand]").forEach(expand); });
    mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => { $$(".product-row").forEach(expand); });

    /* ---------- custom development, the Elyra Effect and the footer ring ---------- */
    if (!reduced) {
      const cd = $(".cd-layout");
      if (cd) {
        gsap.timeline({ scrollTrigger: { trigger: ".bleed", start: "top 60%" } })
          .from($$(".cd-head > *", cd), { y: 28, opacity: 0, filter: "blur(8px)", stagger: 0.08, duration: 1.1 })
          .from($(".cd-grid", cd), { y: 40, opacity: 0, filter: "blur(10px)", duration: 1.2 }, 0.25)
          .from($$(".cd-item", cd), { y: 14, opacity: 0, stagger: 0.06, duration: 0.9 }, 0.45);
      }
      const effect = $("#effectMedia");
      if (effect) {
        const arcs = $$<SVGPathElement>(".arcs path", effect);
        arcs.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
        gsap.to(arcs, { strokeDashoffset: 0, duration: 2.4, stagger: 0.15, ease: "power2.inOut", scrollTrigger: { trigger: effect, start: "top 70%" } });
        gsap.from(".effect-title", { yPercent: 20, opacity: 0, duration: 1.6, scrollTrigger: { trigger: effect, start: "top 70%" } });
      }
      const ring = $(".footer .ring");
      if (ring) {
        // scrubbed to the last screen of the page, so it lands exactly as you reach the bottom
        gsap.timeline({ scrollTrigger: { trigger: ".footer-mark", start: "top bottom", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(ring, { yPercent: 22, scale: 0.88, rotation: -16, transformOrigin: "50% 50%" }, { yPercent: 0, scale: 1, rotation: 0, ease: "none" })
          .fromTo(".fm-logo", { y: 40, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", ease: "none" }, 0.35);
      }
    }

    /* ---------- business models: the first slide fills the screen, then scroll moves sideways ---------- */
    $$("[data-hscroll]").forEach((stage) => {
      const track = $(".car-track", stage)!;
      const n = $$(".car-slide", track).length;
      const total = 1 + (n - 1) + 0.3;          // expand, travel through slides, hold
      const dots = $$<HTMLButtonElement>(".car-dots button", stage);
      const dotsWrap = $(".car-dots", stage);
      let idx = -1;
      let st: ScrollTrigger | null = null;
      const setIndex = (i: number) => {
        if (i === idx) return;
        idx = i;
        dots.forEach((d, j) => { d.setAttribute("aria-selected", String(j === i)); d.tabIndex = j === i ? 0 : -1; });
      };
      const goTo = (i: number) => {
        i = clamp(i, 0, n - 1);
        if (st) {
          // scroll the page to where that slide sits in the pinned timeline
          const y = st.start + ((1 + i) / total) * (st.end - st.start);
          if (lenis) lenis.scrollTo(y, { duration: 1.1 }); else scrollTo({ top: y, behavior: "smooth" });
        } else {
          setIndex(i);
          gsap.to(track, { xPercent: -100 * i, duration: reduced ? 0 : 0.6, ease: "power3.out", overwrite: true });
        }
      };
      dots.forEach((d, i) => on(d, "click", () => goTo(i)));
      const prev = $(".car-arrow.prev", stage), next = $(".car-arrow.next", stage);
      if (prev) on(prev, "click", () => goTo(idx - 1));
      if (next) on(next, "click", () => goTo(idx + 1));
      if (dotsWrap) on(dotsWrap, "keydown", (e: KeyboardEvent) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const to = clamp(idx + (e.key === "ArrowRight" ? 1 : -1), 0, n - 1);
        goTo(to); dots[to].focus();
      });
      setIndex(0);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        assertPinnable(stage);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage, start: "top top", end: () => "+=" + innerHeight * total * 0.9,
            pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (self) => setIndex(Math.round(clamp(self.progress * total - 1, 0, n - 1))),
          },
        });
        tl.fromTo(stage, { "--p": 0 }, { "--p": 1, duration: 1, ease: "power2.inOut" })
          .fromTo(track, { xPercent: 0 }, { xPercent: -100 * (n - 1), duration: n - 1, ease: "none" })
          .to({}, { duration: 0.3 });
        st = tl.scrollTrigger ?? null;
        return () => { st = null; };
      });
    });

    /* ---------- tabs (any number per page) ---------- */
    $$("[data-tabs]").forEach((list) => {
      const tabs = $$<HTMLButtonElement>("[role=tab]", list);
      const ind = $(".tab-ind", list);
      const moveInd = (t?: El) => { if (!t || !ind) return; ind.style.setProperty("--x", `${t.offsetLeft}px`); ind.style.setProperty("--w", `${t.offsetWidth}px`); };
      const select = (t: El) => {
        tabs.forEach((x) => {
          const isOn = x === t;
          x.setAttribute("aria-selected", String(isOn));
          x.tabIndex = isOn ? 0 : -1;
          const panel = document.getElementById(x.getAttribute("aria-controls") || "");
          if (panel) panel.hidden = !isOn;
        });
        moveInd(t);
        ScrollTrigger.refresh();
      };
      tabs.forEach((t, i) => {
        on(t, "pointerdown", () => select(t));   // respond on press
        on(t, "click", () => select(t));
        on(t, "keydown", (e: KeyboardEvent) => {
          const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          const n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus();
        });
      });
      const place = () => moveInd(tabs.find((t) => t.getAttribute("aria-selected") === "true"));
      place();
      on(window, "resize", place);
      document.fonts?.ready.then(() => { if (!ac.signal.aborted) place(); });
    });

    /* ---------- directory filter (GSAP Flip) ---------- */
    const dir = $("[data-directory]");
    if (dir) {
      const items = $$(".dir-item", dir);
      const buttons = $$("[data-filter]");
      buttons.forEach((b) => on(b, "click", () => {
        const cat = b.dataset.filter;
        buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const state = reduced ? null : Flip.getState(items);
        items.forEach((it) => it.classList.toggle("is-hidden", cat !== "All" && it.dataset.cat !== cat));
        if (state) Flip.from(state, { duration: 0.6, ease: "expo.out", scale: true, absolute: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.3 }),
          onComplete: () => ScrollTrigger.refresh() });
      }));
    }

    /* ---------- lead forms: inline validation, then send ---------- */
    $$<HTMLFormElement>("form.lead").forEach((form) => {
      const status = $(".form-status", form);
      const rules: Record<string, (v: string) => string> = {
        name: (v) => (v.trim() ? "" : "Please enter your name."),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid business email."),
      };
      const field = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
      const check = (input: HTMLInputElement) => {
        const msg = rules[input.name](input.value);
        const f = input.closest(".f")!;
        f.classList.toggle("invalid", !!msg);
        $(".err", f)!.textContent = msg;
        input.setAttribute("aria-invalid", String(!!msg));
        // a check mark appears once a required field is valid
        f.classList.toggle("valid", !msg && !!input.value);
        return !msg;
      };
      Object.keys(rules).forEach((n) => {
        const input = field(n);
        on(input, "blur", () => input.value && check(input));
        on(input, "input", () => (input.closest(".f")!.classList.contains("invalid") || input.closest(".f")!.classList.contains("valid")) && check(input));
      });
      on(form, "submit", async (e: SubmitEvent) => {
        e.preventDefault();
        const ok = Object.keys(rules).map((n) => check(field(n))).every(Boolean);
        if (!ok) {
          // shake like a wrong passcode
          haptic(30);
          if (!reduced) gsap.fromTo($$(".f.invalid", form), { x: 0 }, { keyframes: { x: [-8, 7, -5, 4, -2, 0] }, duration: 0.45, ease: "none", overwrite: true });
          form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
          return;
        }
        haptic([8, 40, 8]);
        const btn = form.querySelector<HTMLButtonElement>("[type=submit]")!;
        btn.classList.add("is-sent");
        later(() => btn.classList.remove("is-sent"), 2400);
        const data: Record<string, string> = Object.fromEntries(new FormData(form) as any);
        data.page = location.pathname;
        if (form.dataset.endpoint) {
          btn.disabled = true;
          if (status) status.textContent = "Sending…";
          try {
            const res = await fetch(form.dataset.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error(String(res.status));
            form.reset();
            if (status) status.textContent = "Thanks. We'll be in touch within one business day.";
          } catch {
            if (status) status.textContent = "Something went wrong. Please try again, or email us directly.";
          } finally { btn.disabled = false; }
          return;
        }
        // no handler configured yet: open a pre-filled email draft instead
        const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
        location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
        if (status) status.textContent = "Your email app should open with the details filled in.";
      });
    });

    /* ================= micro-interactions ================= */

    /* Press: scale down instantly on pointer-down, spring back on release. Composes with
       magnetic and tilt because GSAP keeps x, y, scale and rotation as separate channels. */
    if (!reduced) {
      $$(".press").forEach((el) => {
        const down = () => gsap.to(el, { scale: 0.97, duration: 0.1, ease: "power2.out", overwrite: "auto" });
        const up = () => gsap.to(el, { scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        on(el, "pointerdown", down);
        on(el, "pointerup", up);
        on(el, "pointerleave", up);
        on(el, "pointercancel", up);
        on(el, "keydown", (e: KeyboardEvent) => { if (e.key === " " || e.key === "Enter") { down(); later(up, 120); } });
      });
    }

    /* Magnetic buttons: lean toward the pointer, settle back without overshoot */
    if (finePointer && !reduced) {
      $$(".btn-pill, .btn-nav, .car-arrow").forEach((el) => {
        const x = follow(el, "x"), y = follow(el, "y");
        on(el, "pointermove", (e: PointerEvent) => {
          if (el.closest(".reveal:not(.in)")) return;      // don't fight the reveal tween
          const r = el.getBoundingClientRect();
          x(gsap.utils.clamp(-10, 10, (e.clientX - (r.left + r.width / 2)) * 0.22));
          y(gsap.utils.clamp(-8, 8, (e.clientY - (r.top + r.height / 2)) * 0.3));
        });
        on(el, "pointerleave", () => { x(0); y(0); });
      });
    }

    /* Cards: gentle 3D tilt + a specular highlight that follows the pointer */
    if (finePointer && !reduced) {
      $$(".sol, .engine, .dir-item, .tier, .post, .mini-card, .opt, .b-card, .mv").forEach((el) => {
        el.classList.add("tilt");
        const max = 3.5;   // degrees: enough to feel physical, not enough to distract
        gsap.set(el, { transformPerspective: 900 });
        const rx = follow(el, "rotationX", { duration: 0.6 }), ry = follow(el, "rotationY", { duration: 0.6 });
        on(el, "pointermove", (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          el.style.setProperty("--mx", `${px * 100}%`);
          el.style.setProperty("--my", `${py * 100}%`);
          rx((0.5 - py) * max);
          ry((px - 0.5) * max);
        });
        on(el, "pointerenter", () => el.classList.add("is-hover"));
        on(el, "pointerleave", () => { el.classList.remove("is-hover"); rx(0); ry(0); });
      });
    }

    /* Nav: one highlight pill that glides between items */
    const navList = $(".nav > ul");
    const pill = $(".nav-hover");
    if (navList && pill) {
      let shown = false;
      const moveTo = (li: El) => {
        const link = $(".nav-link", li)!;
        const lr = link.getBoundingClientRect(), ur = navList.getBoundingClientRect();
        const props = { x: lr.left - ur.left - navList.clientLeft, width: lr.width, opacity: 1 };
        if (!shown || reduced) gsap.set(pill, { ...props, opacity: 0 });
        gsap.to(pill, { ...props, duration: reduced ? 0 : 0.42, ease: "power3.out", overwrite: true });
        shown = true;
      };
      $$(":scope > li:not(.nav-hover)", navList).forEach((li) => {
        on(li, "pointerenter", () => moveTo(li));
        const link = $(".nav-link", li);
        if (link) on(link, "focus", () => moveTo(li));
      });
      on(navList, "pointerleave", () => { gsap.to(pill, { opacity: 0, duration: 0.25, overwrite: true }); shown = false; });
    }

    /* Header: slides away while reading, returns the moment you scroll up */
    if (header) {
      let hidden = false;
      const setHidden = (h: boolean) => {
        if (h === hidden) return;
        hidden = h;
        gsap.to(header, { yPercent: h ? -130 : 0, duration: reduced ? 0 : 0.55, ease: h ? "power2.in" : "power3.out", overwrite: true });
      };
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          const menuOpen = $("#mobileMenu.open") || $(".nav-link[aria-expanded='true']");
          if (self.scroll() < 300 || menuOpen) return setHidden(false);
          if (Math.abs(self.getVelocity()) < 40) return;
          setHidden(self.direction === 1);
        },
      });
      on(header, "focusin", () => setHidden(false));
    }

    /* Reading progress: a hairline that fills as you scroll */
    const bar = $(".progress");
    if (bar) {
      gsap.set(bar, { scaleX: 0, transformOrigin: "0 50%" });
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) });
    }

    /* Back to top: materializes (blur + scale) rather than just fading */
    const top = $(".to-top");
    if (top) {
      gsap.set(top, { autoAlpha: 0, scale: 0.8, filter: "blur(6px)" });
      let topShown = false;
      ScrollTrigger.create({
        start: () => innerHeight * 1.5, end: "max",
        onToggle: (s) => {
          if (s.isActive === topShown) return;
          topShown = s.isActive;
          gsap.to(top, topShown
            ? { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: reduced ? 0 : 0.5, ease: "power3.out", overwrite: true }
            : { autoAlpha: 0, scale: 0.8, filter: "blur(6px)", duration: reduced ? 0 : 0.3, ease: "power2.in", overwrite: true });
        },
      });
      on(top, "click", () => {
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        $("#main")?.focus({ preventScroll: true });
      });
    }

    /* Marquee: hover decelerates instead of stopping dead; scrolling briefly speeds it up */
    if (!reduced) {
      $$(".marquee").forEach((mq) => {
        const tl = gsap.timeline({ repeat: -1 }).to($$(".marquee-track", mq), { xPercent: -100, ease: "none", duration: 45 });
        on(mq, "pointerenter", () => gsap.to(tl, { timeScale: 0.12, duration: 0.8, ease: "power2.out" }));
        on(mq, "pointerleave", () => gsap.to(tl, { timeScale: 1, duration: 0.8, ease: "power2.inOut" }));
        ScrollTrigger.create({
          trigger: mq, start: "top bottom", end: "bottom top",
          onUpdate: (s) => {
            const boost = 1 + Math.min(4, Math.abs(s.getVelocity()) / 600);
            gsap.to(tl, { timeScale: boost, duration: 0.25, overwrite: true, onComplete: () => { gsap.to(tl, { timeScale: 1, duration: 1.2, ease: "power2.out" }); } });
          },
        });
      });
    }

    /* Hero: video drifts a few pixels with the pointer (depth, not distraction) */
    const heroVideo = $(".hero .bg-video");
    if (hero && heroVideo && finePointer && !reduced) {
      gsap.set(heroVideo, { scale: 1.06 });
      const vx = follow(heroVideo, "x", { duration: 1.2 }), vy = follow(heroVideo, "y", { duration: 1.2 });
      on(hero, "pointermove", (e: PointerEvent) => {
        vx((e.clientX / innerWidth - 0.5) * -18);
        vy((e.clientY / innerHeight - 0.5) * -12);
      });
    }

    /* Images materialize as they load (opacity only; layout never shifts) */
    $$<HTMLImageElement>("img[loading='lazy']").forEach((img) => {
      if (img.complete && img.naturalWidth) return;
      img.classList.add("is-loading");
      const done = () => img.classList.remove("is-loading");
      on(img, "load", done, { once: true });
      on(img, "error", done, { once: true });
    });

    /* Copy email: tap the address, get a confirmation toast */
    const toast = $(".toast");
    if (toast) {
      const showToast = (msg: string) => {
        toast.textContent = msg;
        gsap.fromTo(toast, { autoAlpha: 0, y: 16, scale: 0.96, filter: "blur(4px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: reduced ? 0 : 0.45, ease: "power3.out", overwrite: true });
        gsap.to(toast, { autoAlpha: 0, y: 8, duration: 0.3, delay: 2, ease: "power2.in" });
      };
      $$<HTMLAnchorElement>("a[href^='mailto:']").forEach((a) => {
        if (a.closest("form")) return;
        on(a, "click", (e: MouseEvent) => {
          if (!navigator.clipboard) return;            // fall back to the mail app
          e.preventDefault();
          navigator.clipboard.writeText(a.href.replace("mailto:", "")).then(
            () => { showToast("Email address copied"); haptic(8); },
            () => { location.href = a.href; });
        });
      });
    }
  });

  /* ---------- measure once layout, fonts and images settle ---------- */
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => { if (!ac.signal.aborted) ScrollTrigger.refresh(); });
  on(window, "load", () => ScrollTrigger.refresh());

  return () => {
    ac.abort();
    timers.forEach((id) => clearTimeout(id));
    clearTimeout(closeTimer);
    observers.forEach((io) => io.disconnect());
    // leave persistent chrome (header, menus) in a clean state for the next page
    megaItems.forEach((li) => {
      $(".nav-link", li)?.setAttribute("aria-expanded", "false");
      $(".mega", li)?.classList.remove("open");
    });
    if (menu?.classList.contains("open")) {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      menuBtn?.setAttribute("aria-expanded", "false");
      if (menuBtn) menuBtn.textContent = "Menu";
    }
    document.body.style.overflow = "";
    header?.classList.remove("on-dark", "scrolled");
    $$(".tilt").forEach((el) => el.classList.remove("tilt", "is-hover"));
    ctx.revert();
    gsap.ticker.remove(raf);
    lenis?.destroy();
    window.__lenis = null;
  };
}
