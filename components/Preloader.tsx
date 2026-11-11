import { LogoMark } from "./Brand";

/**
 * Page-load preloader, about 7.6s of kinetic type (paced so every word can be read), then a shutter reveal:
 *   0.25–3.75s the words, one at a time, in huge type: Business, Household duties, Marketing, Promotions
 *   3.75–5.1s  "We help you automate everything!"
 *   5.1–6.1s   the Hawyia mark and wordmark
 *   6.15–7.6s  the screen splits into six shutters that lift one after another onto the page
 * Corners carry the brand, a label, "Loading" and a 0–100 counter over a filling hairline.
 * Everything moves with transform and opacity only, so it stays smooth on phones.
 *
 * It is pure CSS, so it never waits on a script. The inline script in app/layout.tsx shows it
 * on every full page load, reloads included (not on in-site navigation, where the layout stays
 * mounted), never with reduced motion: "pl-on" shows it and locks scrolling, "pl-hold" keeps the page's own
 * entrances paused until the shutters lift (resuming, not delaying, so nothing jumps).
 * Without that script it never shows. The timings match the keyframes in globals.css ("PRELOADER").
 */
const OPEN_MS = 6410;
const DONE_MS = 7600;

const products = ["Business", "Household duties", "Marketing", "Promotions"];
const SHUTTERS = 6;

// "Skip intro" (the button, or Esc) clears both timers, fades the preloader out over SKIP_MS
// and hands the page over exactly as the natural ending does. Wired here, by delegation on the
// document, so it works from the first frame, before any other script has loaded.
const SKIP_MS = 450;

export const preloaderScript = `(function(){var d=document.documentElement;d.classList.add("js");try{if(sessionStorage.getItem("skip-preloader")){sessionStorage.removeItem("skip-preloader");return}if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("pl-on","pl-hold");var done=false;var finish=function(){if(done)return;done=true;d.classList.remove("pl-on","pl-hold","pl-skipping");document.removeEventListener("click",onClick,true);document.removeEventListener("keydown",onKey,true);dispatchEvent(new Event("elyra:preloaded"))};var a=setTimeout(function(){d.classList.remove("pl-hold")},${OPEN_MS});var b=setTimeout(finish,${DONE_MS});var skip=function(){if(done||d.classList.contains("pl-skipping"))return;clearTimeout(a);clearTimeout(b);d.classList.add("pl-skipping");d.classList.remove("pl-hold");setTimeout(finish,${SKIP_MS})};var onClick=function(e){if(e.target&&e.target.closest&&e.target.closest(".pl-skip")){e.preventDefault();skip()}};var onKey=function(e){if(e.key==="Escape")skip()};document.addEventListener("click",onClick,true);document.addEventListener("keydown",onKey,true)}catch(e){}})()`;

const vars = (v: Record<string, number>) => v as React.CSSProperties;

export function Preloader() {
  return (
    <div className="preloader">
      <div className="pl-shutters" aria-hidden="true">
        {Array.from({ length: SHUTTERS }, (_, i) => <span key={i} style={vars({ "--i": i })} />)}
      </div>
      <button type="button" className="pl-skip">
        <span>Skip intro</span>
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 3.5 8 8l-5 4.5M8.5 3.5 13.5 8l-5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className="pl-ui" aria-hidden="true">
        <span className="pl-glow" />
        <div className="pl-corners mono">
          <span className="pl-lockup"><LogoMark /><span>Hawyia</span></span>
          <span>Business automation</span>
          <span className="pl-loading">Loading<i>.</i><i>.</i><i>.</i></span>
          <span className="pl-count" />
          <span className="pl-line" />
        </div>
        <div className="pl-center">
          <p className="pl-words">
            {products.map((w, i) => <span key={w} style={vars({ "--i": i })}>{w}.</span>)}
          </p>
          <p className="pl-pitch">
            <span className="pl-l"><span>We help you</span></span>
            <span className="pl-l"><em>automate everything!</em></span>
          </p>
          <p className="pl-brand">
            <span className="pl-mark"><LogoMark /></span>
            <span className="pl-l"><span>Hawyia</span></span>
          </p>
        </div>
      </div>
    </div>
  );
}
