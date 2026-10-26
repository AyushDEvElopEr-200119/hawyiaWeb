/* Elyra — site interactions. GSAP + ScrollTrigger + Flip for motion, Lenis for smooth scroll. */
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger, ...(window.Flip ? [window.Flip] : []));
  gsap.defaults({ ease: "expo.out", duration: 0.9 });

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Lenis smooth scroll, driven by GSAP's ticker ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.__lenis = lenis;   // shared with micro.js
  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: -90 });
    else (typeof target === "string" ? $(target) : target)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"], a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === "#") return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    closeAllMega();
    setMenu(false);
    scrollToTarget(el);
    history.pushState(null, "", url.hash);
  });
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => scrollToTarget(el), 300);
  }

  /* ---------- header state ---------- */
  const header = $("#header");
  const darkZones = $$(".hero, .bleed");
  const updateHeader = () => {
    const probe = 50;
    const onDark = darkZones.some((z) => {
      const r = z.getBoundingClientRect();
      if (z.classList.contains("hero")) return r.top <= probe && window.scrollY < (z.offsetHeight - innerHeight) * 0.78;
      return r.top <= probe && r.bottom > probe && innerWidth > 860;
    });
    header.classList.toggle("on-dark", onDark);
    header.classList.toggle("scrolled", window.scrollY > (darkZones[0]?.classList.contains("hero") ? innerHeight * 0.5 : 20));
  };
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: updateHeader });
  updateHeader();

  /* ---------- mega menus: grow out of their trigger, close on Esc / outside ---------- */
  const megaItems = $$(".has-mega");
  let closeTimer;
  function openMega(li) {
    megaItems.forEach((x) => x !== li && closeMega(x));
    const btn = $(".nav-link", li), panel = $(".mega", li);
    if (btn.getAttribute("aria-expanded") === "true") return;
    li.dataset.openedAt = String(performance.now());
    btn.setAttribute("aria-expanded", "true");
    panel.classList.add("open");
    gsap.fromTo(panel,
      { opacity: 0, y: -8, scale: 0.97, filter: "blur(6px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: reduced ? 0.01 : 0.45, transformOrigin: "50% 0%", overwrite: true });
    gsap.fromTo($$(".mega-link, .mega-aside", panel), { opacity: 0, y: 6 }, { opacity: 1, y: 0, stagger: 0.02, duration: reduced ? 0.01 : 0.5, overwrite: true });
  }
  function closeMega(li) {
    const btn = $(".nav-link", li), panel = $(".mega", li);
    if (btn.getAttribute("aria-expanded") !== "true") return;
    btn.setAttribute("aria-expanded", "false");
    // exit the same way it came in, starting from wherever it is now
    gsap.to(panel, { opacity: 0, y: -8, scale: 0.97, filter: "blur(6px)", duration: reduced ? 0.01 : 0.25, ease: "power2.in", overwrite: true,
      onComplete: () => panel.classList.remove("open") });
  }
  function closeAllMega() { megaItems.forEach(closeMega); }
  const canHover = window.matchMedia("(hover: hover)").matches;
  megaItems.forEach((li) => {
    const btn = $(".nav-link", li);
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      // a click that lands just after hover opened the panel shouldn't immediately close it
      if (open && performance.now() - Number(li.dataset.openedAt || 0) > 400) closeMega(li);
      else openMega(li);
    });
    if (canHover) {
      li.addEventListener("pointerenter", () => { clearTimeout(closeTimer); openMega(li); });
      li.addEventListener("pointerleave", () => { closeTimer = setTimeout(() => closeMega(li), 160); });
    }
    li.addEventListener("focusout", (e) => { if (!li.contains(e.relatedTarget)) closeMega(li); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = megaItems.find((li) => $(".nav-link", li).getAttribute("aria-expanded") === "true");
    if (open) { closeMega(open); $(".nav-link", open).focus(); }
    setMenu(false);
  });
  document.addEventListener("pointerdown", (e) => { if (!e.target.closest(".has-mega")) closeAllMega(); });

  /* ---------- mobile menu ---------- */
  const menuBtn = $("#menuBtn");
  const menu = $("#mobileMenu");
  function setMenu(open) {
    if (!menu || menu.classList.contains("open") === open) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
    open ? lenis?.stop() : lenis?.start();
    if (open && !reduced) gsap.fromTo($$(".mm-link, .mobile-menu > .btn-pill", menu), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.035, duration: 0.6, delay: 0.05 });
  }
  menuBtn?.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- reveals (batched so neighbours stagger together) ---------- */
  if (reduced) {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  } else {
    ScrollTrigger.batch(".reveal", {
      start: "top 92%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.07, duration: 1.1, overwrite: "auto",
        onComplete() { batch.forEach((el) => el.classList.add("in")); } }),
    });
  }

  /* ---------- statements: words brighten as you scroll ---------- */
  $$(".statement-text").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="sw">${w}</span>`).join(" ");
    if (reduced) return;
    gsap.fromTo($$(".sw", el), { opacity: 0.18 }, {
      opacity: 1, ease: "none", stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: true },
    });
  });

  /* ---------- inner-page hero: title words rise, media band opens ---------- */
  $$("[data-split]").forEach((el) => {
    el.innerHTML = el.innerHTML.split(/(<br\s*\/?>)/).map((part) =>
      part.startsWith("<br") ? part : part.split(/\s+/).filter(Boolean).map((w) => `<span class="w">${w}</span>`).join(" ")).join("");
  });
  const phMedia = $("[data-ph-media]");
  if (!reduced) {
    const tl = gsap.timeline({ delay: 0.1 });
    const words = $$("[data-split] .w");
    if (words.length) tl.from(words, { yPercent: 60, opacity: 0, filter: "blur(8px)", stagger: 0.05, duration: 1.2 });
    const intro = $$(".ph-intro > *, .contact-copy > :not(h1), .crumbs");
    if (intro.length) tl.from(intro, { y: 18, opacity: 0, stagger: 0.08, duration: 1 }, "-=0.9");
    if (phMedia) {
      tl.fromTo(phMedia, { clipPath: "inset(14% 10% 0% 10% round 60px)" }, { clipPath: "inset(0% 0% 0% 0% round 40px)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" }, 0.15)
        .fromTo($(".ph-bg", phMedia), { scale: 1.18 }, { scale: 1.04, duration: 2, ease: "expo.out" }, 0.15);
      const hl = $("[data-ph-hl]", phMedia);
      if (hl) {
        // the glass strip materializes (blur + rise), then its items follow one by one
        tl.from(hl, { y: 40, opacity: 0, filter: "blur(10px)", duration: 1.2 }, 0.7)
          .from($$("li", hl), { y: 16, opacity: 0, stagger: 0.08, duration: 1 }, 0.9);
      }
    }
  }

  /* ---------- background videos: play only while visible, never for reduced motion ---------- */
  $$("video[data-autoplay]").forEach((v) => {
    if (reduced) { v.removeAttribute("autoplay"); return; }
    v.muted = true;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.1 }).observe(v);
  });

  /* ---------- photo parallax (subtle; transform only) ---------- */
  if (!reduced) {
    const drift = (sel, trigger, from, to) => $$(sel).forEach((el) =>
      gsap.fromTo(el, { yPercent: from }, { yPercent: to, ease: "none",
        scrollTrigger: { trigger: trigger ? el.closest(trigger) : el, start: "top bottom", end: "bottom top", scrub: true } }));
    drift(".ph-bg", "[data-ph-media]", -4, 6);
    drift(".bleed-media .media-bg", ".bleed", -6, 6);
    drift(".post-media img, .ind-img", null, -3, 3);
  }

  /* ---------- home hero: headline sharpens, media collapses into a band on scroll ---------- */
  const hero = $(".hero");
  if (hero) {
    const media = $("#heroMedia");
    const spans = $$("#heroTitle span");
    const state = { intro: reduced ? 1 : 0, p: 0 };
    const paint = () => {
      spans.forEach((s, i) => {
        const k = clamp(state.intro * 1.4 - i * 0.25);
        const out = clamp((state.p - 0.45) / 0.3);
        s.style.setProperty("--blur", `${(1 - k) * 10 + out * 8}px`);
        s.style.setProperty("--op", String(Math.max(0.15, k) * (1 - out)));
        s.style.setProperty("--ty", `${(1 - k) * 16 - out * 30}px`);
      });
      const collapse = clamp((state.p - 0.35) / 0.65);
      media.style.setProperty("--clip", `${collapse * 88}%`);
      media.style.setProperty("--r", `${collapse * 60}px`);
    };
    if (!reduced) gsap.to(state, { intro: 1, duration: 1.6, delay: 0.3, ease: "power2.out", onUpdate: paint });
    ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom bottom", onUpdate: (st) => { state.p = st.progress; if (st.progress > 0.02) state.intro = 1; paint(); } });
    paint();
  }

  /* ---------- expanding stages: a rounded card grows to fill the screen while pinned ----------
     CSS sizes each frame from --p (0 = card, 1 = full screen); GSAP only scrubs --p. */
  const mm = gsap.matchMedia();
  const expand = (stage) =>
    gsap.timeline({ scrollTrigger: { trigger: stage, start: "top top", end: "+=110%", pin: true, scrub: 0.6, anticipatePin: 1 } })
      .fromTo(stage, { "--p": 0 }, { "--p": 1, ease: "power2.inOut", duration: 1 })
      .to({}, { duration: 0.3 });   // hold at full screen before moving on
  mm.add("(prefers-reduced-motion: no-preference)", () => { $$("[data-expand]").forEach(expand); });
  mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => { $$(".product-row").forEach(expand); });

  /* ---------- parallax & drawn routes ---------- */
  if (!reduced) {
    // custom development: headline block rises, then the service grid materializes cell by cell
    const cd = $(".cd-layout");
    if (cd) {
      gsap.timeline({ scrollTrigger: { trigger: ".bleed", start: "top 60%" } })
        .from($$(".cd-head > *", cd), { y: 28, opacity: 0, filter: "blur(8px)", stagger: 0.08, duration: 1.1 })
        .from($(".cd-grid", cd), { y: 40, opacity: 0, filter: "blur(10px)", duration: 1.2 }, 0.25)
        .from($$(".cd-item", cd), { y: 14, opacity: 0, stagger: 0.06, duration: 0.9 }, 0.45);
    }
    const effect = $("#effectMedia");
    if (effect) {
      const arcs = $$(".arcs path", effect);
      arcs.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      gsap.to(arcs, { strokeDashoffset: 0, duration: 2.4, stagger: 0.15, ease: "power2.inOut", scrollTrigger: { trigger: effect, start: "top 70%" } });
      gsap.from(".effect-title", { yPercent: 20, opacity: 0, duration: 1.6, scrollTrigger: { trigger: effect, start: "top 70%" } });
    }
    // bento photos drift slightly inside their frames
    $$(".b-photo .b-img").forEach((im) =>
      gsap.fromTo(im, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: im.closest(".b-card"), start: "top bottom", end: "bottom top", scrub: true } }));
  } else {
    $("#effectMedia")?.classList.add("in");
  }

  /* ---------- footer ring: rises, settles to full size and turns into place with the scroll ---------- */
  const ring = $(".footer .ring");
  if (ring && !reduced) {
    // scrubbed to the last screen of the page, so it lands exactly as you reach the bottom
    gsap.timeline({ scrollTrigger: { trigger: ".footer-mark", start: "top bottom", end: "bottom bottom", scrub: 0.8 } })
      .fromTo(ring,
        { yPercent: 22, scale: 0.88, rotation: -16, transformOrigin: "50% 50%" },
        { yPercent: 0, scale: 1, rotation: 0, ease: "none" })
      .fromTo(".fm-logo", { y: 40, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", ease: "none" }, 0.35);
  }

  /* ---------- business models: the first slide fills the screen, then scroll moves sideways ---------- */
  $$("[data-hscroll]").forEach((stage) => {
    const track = $(".car-track", stage);
    const slides = $$(".car-slide", track);
    const n = slides.length;
    const total = 1 + (n - 1) + 0.3;          // expand, travel through slides, hold
    const dotsWrap = $(".car-dots", stage);
    let idx = -1, st = null;
    const dots = slides.map((s, i) => {
      const b = document.createElement("button");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `${$("small", s)?.textContent || "Slide " + (i + 1)} (${i + 1} of ${n})`);
      b.addEventListener("click", () => goTo(i));
      dotsWrap?.appendChild(b);
      return b;
    });
    const setIndex = (i) => {
      if (i === idx) return;
      idx = i;
      dots.forEach((d, j) => { d.setAttribute("aria-selected", String(j === i)); d.tabIndex = j === i ? 0 : -1; });
    };
    function goTo(i) {
      i = clamp(i, 0, n - 1);
      if (st) {
        // scroll the page to where that slide sits in the pinned timeline
        const y = st.start + ((1 + i) / total) * (st.end - st.start);
        if (lenis) lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        setIndex(i);
        gsap.to(track, { xPercent: -100 * i, duration: reduced ? 0 : 0.6, ease: "power3.out", overwrite: true });
      }
    }
    $(".car-arrow.prev", stage)?.addEventListener("click", () => goTo(idx - 1));
    $(".car-arrow.next", stage)?.addEventListener("click", () => goTo(idx + 1));
    dotsWrap?.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = clamp(idx + (e.key === "ArrowRight" ? 1 : -1), 0, n - 1);
      goTo(next); dots[next].focus();
    });
    setIndex(0);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
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
      st = tl.scrollTrigger;
      return () => { st = null; };
    });
  });

  /* ---------- tabs (any number per page) ---------- */
  $$("[data-tabs]").forEach((list) => {
    const tabs = $$("[role=tab]", list);
    const ind = $(".tab-ind", list);
    const moveInd = (t) => { ind.style.setProperty("--x", `${t.offsetLeft}px`); ind.style.setProperty("--w", `${t.offsetWidth}px`); };
    const select = (t) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      moveInd(t);
      ScrollTrigger.refresh();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("pointerdown", () => select(t));   // respond on press
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        const n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus();
      });
    });
    const init = () => moveInd(tabs.find((t) => t.getAttribute("aria-selected") === "true"));
    init(); addEventListener("resize", init); document.fonts?.ready.then(init);
  });

  /* ---------- directory filter (GSAP Flip) ---------- */
  const dir = $("[data-directory]");
  if (dir) {
    const items = $$(".dir-item", dir);
    const buttons = $$("[data-filter]");
    buttons.forEach((b) => b.addEventListener("click", () => {
      const cat = b.dataset.filter;
      buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const state = window.Flip && !reduced ? window.Flip.getState(items) : null;
      items.forEach((it) => it.classList.toggle("is-hidden", cat !== "All" && it.dataset.cat !== cat));
      if (state) window.Flip.from(state, { duration: 0.6, ease: "expo.out", scale: true, absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh() });
    }));
  }

  /* ---------- lead forms: inline validation, then send ---------- */
  $$("form.lead").forEach((form) => {
    const status = $(".form-status", form);
    const rules = {
      name: (v) => (v.trim() ? "" : "Please enter your name."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid business email."),
    };
    const check = (input) => {
      const msg = rules[input.name](input.value);
      const f = input.closest(".f");
      f.classList.toggle("invalid", !!msg);
      $(".err", f).textContent = msg;
      input.setAttribute("aria-invalid", String(!!msg));
      return !msg;
    };
    Object.keys(rules).forEach((n) => {
      const input = form.elements[n];
      input.addEventListener("blur", () => input.value && check(input));
      input.addEventListener("input", () => input.closest(".f").classList.contains("invalid") && check(input));
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = Object.keys(rules).map((n) => check(form.elements[n])).every(Boolean);
      if (!ok) { form.querySelector("[aria-invalid=true]").focus(); return; }
      const data = Object.fromEntries(new FormData(form));
      data.page = location.pathname;
      const btn = form.querySelector("[type=submit]");
      if (form.dataset.endpoint) {
        btn.disabled = true; status.textContent = "Sending…";
        try {
          const res = await fetch(form.dataset.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.textContent = "Thanks. We'll be in touch within one business day.";
        } catch {
          status.textContent = "Something went wrong. Please try again, or email us directly.";
        } finally { btn.disabled = false; }
        return;
      }
      // no handler configured yet: open a pre-filled email draft instead
      const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
      location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
      status.textContent = "Your email app should open with the details filled in.";
    });
  });

  /* ---------- keep measurements right once fonts and images settle ---------- */
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
})();
