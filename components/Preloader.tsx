import { LogoMark } from "./Brand";

/**
 * Page-load preloader, about 7.6s of kinetic type (paced so every word can be read), then a shutter reveal:
 *   0.25–3.75s the products, one at a time, in huge type: Flights, Hotels, Holidays, Transfers, Payments
 *   3.75–5.1s  "One platform. Your brand."
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

const products = ["Flights", "Hotels", "Holidays", "Transfers", "Payments"];
const SHUTTERS = 6;

export const preloaderScript = `(function(){var d=document.documentElement;d.classList.add("js");try{if(sessionStorage.getItem("skip-preloader")){sessionStorage.removeItem("skip-preloader");return}if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("pl-on","pl-hold");setTimeout(function(){d.classList.remove("pl-hold")},${OPEN_MS});setTimeout(function(){d.classList.remove("pl-on");dispatchEvent(new Event("elyra:preloaded"))},${DONE_MS})}catch(e){}})()`;

const vars = (v: Record<string, number>) => v as React.CSSProperties;

export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="pl-shutters">
        {Array.from({ length: SHUTTERS }, (_, i) => <span key={i} style={vars({ "--i": i })} />)}
      </div>
      <div className="pl-ui">
        <span className="pl-glow" />
        <div className="pl-corners mono">
          <span className="pl-lockup"><LogoMark /><span>Hawyia</span></span>
          <span>Travel booking software</span>
          <span className="pl-loading">Loading<i>.</i><i>.</i><i>.</i></span>
          <span className="pl-count" />
          <span className="pl-line" />
        </div>
        <div className="pl-center">
          <p className="pl-words">
            {products.map((w, i) => <span key={w} style={vars({ "--i": i })}>{w}.</span>)}
          </p>
          <p className="pl-pitch">
            <span className="pl-l"><span>One platform.</span></span>
            <span className="pl-l"><em>Your brand.</em></span>
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
