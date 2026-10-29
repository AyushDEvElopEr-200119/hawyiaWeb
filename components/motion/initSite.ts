/* Elyra — site interactions, kept deliberately minimal: no smooth-scroll library, no scroll-
   driven or pointer-driven motion. The only movement is short CSS fades and hover states
   (see "MINIMAL MOTION" in globals.css); this script just wires behaviour.

   initSite() runs after every route change and returns a cleanup that removes every listener
   (one AbortSignal) and disconnects observers. React renders all the markup; this only toggles
   classes and attributes, so it never creates or replaces DOM that React owns. */

type El = HTMLElement;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const $ = <T extends Element = El>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element = El>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];

export function initSite(): () => void {
  const canHover = matchMedia("(hover: hover)").matches;

  const ac = new AbortController();
  const on = <K extends string>(
    target: EventTarget, type: K, fn: (e: any) => void, opts: AddEventListenerOptions = {},
  ) => target.addEventListener(type, fn, { ...opts, signal: ac.signal });
  const observers: IntersectionObserver[] = [];
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };

  const header = $("#header");
  const menuBtn = $("#menuBtn");
  const menu = $("#mobileMenu");
  const megaItems = $$(".has-mega");

  const scrollToTarget = (target: El) => scrollTo({ top: target.getBoundingClientRect().top + scrollY - 90, behavior: "smooth" });

  function setMenu(open: boolean) {
    if (!menu || !menuBtn || menu.classList.contains("open") === open) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  }

  let closeTimer = 0;
  function openMega(li: El) {
    megaItems.forEach((x) => x !== li && closeMega(x));
    const btn = $(".nav-link", li)!;
    if (btn.getAttribute("aria-expanded") === "true") return;
    li.dataset.openedAt = String(performance.now());
    btn.setAttribute("aria-expanded", "true");
    $(".mega", li)!.classList.add("open");
  }
  function closeMega(li: El) {
    const btn = $(".nav-link", li)!;
    if (btn.getAttribute("aria-expanded") !== "true") return;
    btn.setAttribute("aria-expanded", "false");
    $(".mega", li)!.classList.remove("open");
  }
  const closeAllMega = () => megaItems.forEach((li) => closeMega(li));

  /* ---------- same-page anchors (runs before Next's <Link>) ---------- */
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

  /* ---------- scroll-linked chrome: header state, reading progress, back to top ---------- */
  const darkZones = $$(".hero, .bleed");
  const bar = $(".progress");
  const top = $(".to-top");
  const onScroll = () => {
    if (header) {
      const probe = 50;
      const onDark = darkZones.some((z) => {
        const r = z.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe && (z.classList.contains("hero") || innerWidth > 860);
      });
      header.classList.toggle("on-dark", onDark);
      header.classList.toggle("scrolled", scrollY > (darkZones[0]?.classList.contains("hero") ? innerHeight * 0.5 : 20));
    }
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max) : 0})`;
    top?.classList.toggle("is-shown", scrollY > innerHeight * 1.5);
  };
  on(window, "scroll", onScroll, { passive: true });
  on(window, "resize", onScroll);
  onScroll();
  if (top) on(top, "click", () => {
    scrollTo({ top: 0, behavior: "smooth" });
    $("#main")?.focus({ preventScroll: true });
  });

  /* ---------- mega menus: open on hover or click, close on Esc / outside ---------- */
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
    $$("a", li).forEach((a) => on(a, "click", () => closeMega(li)));
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

  /* ---------- reveals: a short fade the first time each block enters the screen ---------- */
  const reveal = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    reveal.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => reveal.observe(el));
  observers.push(reveal);

  /* ---------- background videos: play only while visible ---------- */
  $$<HTMLVideoElement>("video[data-autoplay]").forEach((v) => {
    v.muted = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.1 });
    io.observe(v);
    observers.push(io);
  });

  /* ---------- business models: a plain carousel with arrows and dots ---------- */
  $$("[data-hscroll]").forEach((stage) => {
    const track = $(".car-track", stage)!;
    const n = $$(".car-slide", track).length;
    const dots = $$<HTMLButtonElement>(".car-dots button", stage);
    const dotsWrap = $(".car-dots", stage);
    let idx = -1;
    const goTo = (i: number) => {
      i = clamp(i, 0, n - 1);
      if (i === idx) return;
      idx = i;
      dots.forEach((d, j) => { d.setAttribute("aria-selected", String(j === i)); d.tabIndex = j === i ? 0 : -1; });
      track.style.transform = `translateX(${-100 * i}%)`;
    };
    dots.forEach((d, i) => on(d, "click", () => goTo(i)));
    const prev = $(".car-arrow.prev", stage), next = $(".car-arrow.next", stage);
    if (prev) on(prev, "click", () => goTo(idx - 1));
    if (next) on(next, "click", () => goTo(idx + 1));
    if (dotsWrap) on(dotsWrap, "keydown", (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      goTo(idx + (e.key === "ArrowRight" ? 1 : -1));
      dots[idx].focus();
    });
    goTo(0);
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
    };
    tabs.forEach((t, i) => {
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

  /* ---------- directory and story filter ---------- */
  const dir = $("[data-directory]");
  if (dir) {
    const items = $$("[data-cat]", dir);
    const buttons = $$("[data-filter]");
    buttons.forEach((b) => on(b, "click", () => {
      const cat = b.dataset.filter;
      buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      items.forEach((it) => it.classList.toggle("is-hidden", cat !== "All" && it.dataset.cat !== cat));
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
        form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
        return;
      }
      const btn = form.querySelector<HTMLButtonElement>("[type=submit]")!;
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

  /* ---------- images fade in as they load (opacity only; layout never shifts) ---------- */
  $$<HTMLImageElement>("img[loading='lazy']").forEach((img) => {
    if (img.complete && img.naturalWidth) return;
    img.classList.add("is-loading");
    const done = () => img.classList.remove("is-loading");
    on(img, "load", done, { once: true });
    on(img, "error", done, { once: true });
  });

  /* ---------- copy email: tap the address, get a confirmation toast ---------- */
  const toast = $(".toast");
  if (toast) {
    let hideTimer = 0;
    const showToast = (msg: string) => {
      toast.textContent = msg;
      toast.classList.add("is-shown");
      clearTimeout(hideTimer);
      hideTimer = later(() => toast.classList.remove("is-shown"), 2000);
    };
    $$<HTMLAnchorElement>("a[href^='mailto:']").forEach((a) => {
      if (a.closest("form")) return;
      on(a, "click", (e: MouseEvent) => {
        if (!navigator.clipboard) return;            // fall back to the mail app
        e.preventDefault();
        navigator.clipboard.writeText(a.href.replace("mailto:", "")).then(
          () => showToast("Email address copied"),
          () => { location.href = a.href; });
      });
    });
  }

  return () => {
    ac.abort();
    timers.forEach((id) => clearTimeout(id));
    clearTimeout(closeTimer);
    observers.forEach((io) => io.disconnect());
    // leave persistent chrome (header, menus) in a clean state for the next page
    closeAllMega();
    setMenu(false);
    document.body.style.overflow = "";
    header?.classList.remove("on-dark", "scrolled");
  };
}
