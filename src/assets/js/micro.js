/* Elyra — micro-interactions, after the apple-design skill:
   respond on press, track the pointer 1:1, start every animation from the
   current on-screen value (see follow() below), and keep it
   all subtle. Pointer effects only run on devices with a precise, hovering
   pointer; nothing runs for prefers-reduced-motion except plain fades. */
(() => {
  const { gsap, ScrollTrigger } = window;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const haptic = (p) => { try { navigator.vibrate?.(p); } catch {} };
  // Like gsap.quickTo, but survives other tweens on the same element: each call starts
  // from the current on-screen value and only replaces tweens of its own property.
  const follow = (el, prop, { duration = 0.5, ease = "power3.out" } = {}) =>
    (v) => gsap.to(el, { [prop]: v, duration, ease, overwrite: "auto" });

  /* ---------- 1. Press: scale down instantly on pointer-down, spring back on release ---------- */
  // Applies to every .press element. Composes with magnetic/tilt below because GSAP
  // keeps x, y, scale and rotation as separate channels on one transform.
  const springBack = { duration: 0.5, ease: "power3.out" };
  $$(".press").forEach((el) => {
    if (reduced) return;
    const down = () => gsap.to(el, { scale: 0.97, duration: 0.1, ease: "power2.out", overwrite: "auto" });
    const up = () => gsap.to(el, { scale: 1, ...springBack, overwrite: "auto" });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { down(); setTimeout(up, 120); } });
  });

  /* ---------- 2. Magnetic buttons: lean toward the pointer, settle back without overshoot ---------- */
  if (finePointer && !reduced) {
    $$(".btn-pill, .btn-nav, .car-arrow").forEach((el) => {
      const x = follow(el, "x"), y = follow(el, "y");
      el.addEventListener("pointermove", (e) => {
        if (el.closest(".reveal:not(.in)")) return;      // don't fight the reveal tween
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        x(gsap.utils.clamp(-10, 10, dx * 0.22));
        y(gsap.utils.clamp(-8, 8, dy * 0.3));
      });
      el.addEventListener("pointerleave", () => { x(0); y(0); });
    });
  }

  /* ---------- 3. Cards: gentle 3D tilt + a specular highlight that follows the pointer ---------- */
  const tiltSel = ".sol, .engine, .dir-item, .tier, .post, .mini-card, .opt, .b-card, .mv";
  if (finePointer && !reduced) {
    $$(tiltSel).forEach((el) => {
      el.classList.add("tilt");
      const max = 3.5;   // degrees: enough to feel physical, not enough to distract
      gsap.set(el, { transformPerspective: 900 });
      const rx = follow(el, "rotationX", { duration: 0.6 }), ry = follow(el, "rotationY", { duration: 0.6 });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        rx((0.5 - py) * max);
        ry((px - 0.5) * max);
      });
      el.addEventListener("pointerenter", () => el.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => { el.classList.remove("is-hover"); rx(0); ry(0); });
    });
  }

  /* ---------- 4. Nav: one highlight pill that glides between items ---------- */
  const navList = $(".nav > ul");
  if (navList) {
    const pill = document.createElement("span");
    pill.className = "nav-hover";
    pill.setAttribute("aria-hidden", "true");
    navList.prepend(pill);
    let shown = false;
    const moveTo = (li) => {
      const link = $(".nav-link", li);
      const lr = link.getBoundingClientRect(), ur = navList.getBoundingClientRect();
      const props = { x: lr.left - ur.left - navList.clientLeft, width: lr.width, opacity: 1 };
      if (!shown || reduced) { gsap.set(pill, { ...props, opacity: 0 }); }
      gsap.to(pill, { ...props, duration: reduced ? 0 : 0.42, ease: "power3.out", overwrite: true });
      shown = true;
    };
    $$(":scope > li", navList).forEach((li) => {
      li.addEventListener("pointerenter", () => moveTo(li));
      $(".nav-link", li)?.addEventListener("focus", () => moveTo(li));
    });
    navList.addEventListener("pointerleave", () => { gsap.to(pill, { opacity: 0, duration: 0.25, overwrite: true }); shown = false; });
  }

  /* ---------- 5. Header: slides away while reading, returns the moment you scroll up ---------- */
  const header = $("#header");
  if (header) {
    let hidden = false;
    const setHidden = (h) => {
      if (h === hidden) return;
      hidden = h;
      gsap.to(header, { yPercent: h ? -130 : 0, duration: reduced ? 0 : 0.55, ease: h ? "power2.in" : "power3.out", overwrite: true });
    };
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const menuOpen = $("#mobileMenu.open") || $(".nav-link[aria-expanded='true']");
        if (y < 300 || menuOpen) return setHidden(false);
        if (Math.abs(self.getVelocity()) < 40) return;
        setHidden(self.direction === 1);
      },
    });
    header.addEventListener("focusin", () => setHidden(false));
  }

  /* ---------- 6. Reading progress: a hairline that fills as you scroll ---------- */
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  gsap.set(bar, { scaleX: 0, transformOrigin: "0 50%" });
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) });

  /* ---------- 7. Back to top: materializes (blur + scale) rather than just fading ---------- */
  const top = document.createElement("button");
  top.className = "to-top";
  top.setAttribute("aria-label", "Back to top");
  top.innerHTML = '<i class="chev up"></i>';
  document.body.appendChild(top);
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
  top.addEventListener("click", () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
    else scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    $("#main")?.focus?.({ preventScroll: true });
  });

  /* ---------- 8. Marquee: driven by GSAP so hover decelerates instead of stopping dead,
                  and scrolling briefly speeds it up ---------- */
  $$(".marquee").forEach((mq) => {
    if (reduced) return;
    const tracks = $$(".marquee-track", mq);
    const tl = gsap.timeline({ repeat: -1 }).to(tracks, { xPercent: -100, ease: "none", duration: 45 });
    mq.addEventListener("pointerenter", () => gsap.to(tl, { timeScale: 0.12, duration: 0.8, ease: "power2.out" }));
    mq.addEventListener("pointerleave", () => gsap.to(tl, { timeScale: 1, duration: 0.8, ease: "power2.inOut" }));
    ScrollTrigger.create({
      trigger: mq, start: "top bottom", end: "bottom top",
      onUpdate: (s) => {
        const boost = 1 + Math.min(4, Math.abs(s.getVelocity()) / 600);
        gsap.to(tl, { timeScale: boost, duration: 0.25, overwrite: true, onComplete: () => gsap.to(tl, { timeScale: 1, duration: 1.2, ease: "power2.out" }) });
      },
    });
  });

  /* ---------- 9. Hero: video drifts a few pixels with the pointer (depth, not distraction) ---------- */
  const heroVideo = $(".hero .bg-video");
  if (heroVideo && finePointer && !reduced) {
    gsap.set(heroVideo, { scale: 1.06 });
    const vx = follow(heroVideo, "x", { duration: 1.2 }), vy = follow(heroVideo, "y", { duration: 1.2 });
    $(".hero").addEventListener("pointermove", (e) => {
      vx((e.clientX / innerWidth - 0.5) * -18);
      vy((e.clientY / innerHeight - 0.5) * -12);
    });
  }

  /* ---------- 10. Images materialize as they load (opacity only; layout never shifts) ---------- */
  $$("img[loading='lazy']").forEach((img) => {
    if (img.complete && img.naturalWidth) return;
    img.classList.add("is-loading");
    img.addEventListener("load", () => img.classList.remove("is-loading"), { once: true });
    img.addEventListener("error", () => img.classList.remove("is-loading"), { once: true });
  });

  /* ---------- 11. Forms: show a check when a field is valid, shake (like a wrong passcode) when not ---------- */
  $$("form.lead").forEach((form) => {
    $$("input[required]", form).forEach((input) => {
      const mark = () => input.closest(".f").classList.toggle("valid", input.getAttribute("aria-invalid") === "false" && !!input.value);
      input.addEventListener("blur", () => setTimeout(mark, 0));
      input.addEventListener("input", () => setTimeout(mark, 0));
    });
    form.addEventListener("submit", () => {
      setTimeout(() => {
        const bad = $$(".f.invalid", form);
        if (bad.length) {
          haptic(30);
          if (!reduced) gsap.fromTo(bad, { x: 0 }, { keyframes: { x: [-8, 7, -5, 4, -2, 0] }, duration: 0.45, ease: "none", overwrite: true });
        } else {
          haptic([8, 40, 8]);
          const btn = $("[type=submit]", form);
          btn.classList.add("is-sent");
          setTimeout(() => btn.classList.remove("is-sent"), 2400);
        }
      }, 0);
    });
  });

  /* ---------- 12. Copy email: tap the address, get a confirmation toast ---------- */
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  const showToast = (msg) => {
    toast.textContent = msg;
    gsap.fromTo(toast, { autoAlpha: 0, y: 16, scale: 0.96, filter: "blur(4px)" },
      { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: reduced ? 0 : 0.45, ease: "power3.out", overwrite: true });
    gsap.to(toast, { autoAlpha: 0, y: 8, duration: 0.3, delay: 2, ease: "power2.in" });
  };
  $$("a[href^='mailto:']").forEach((a) => {
    if (a.closest("form")) return;
    a.addEventListener("click", (e) => {
      if (!navigator.clipboard) return;            // fall back to the mail app
      e.preventDefault();
      navigator.clipboard.writeText(a.href.replace("mailto:", "")).then(
        () => { showToast("Email address copied"); haptic(8); },
        () => { location.href = a.href; });
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
