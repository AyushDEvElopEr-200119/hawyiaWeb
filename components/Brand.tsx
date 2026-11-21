/* Hawiyah Premium logo (public/assets/brand), always on a transparent background.
   hawiyah-logo-source.png is the file as supplied (white background). Cut out from it:
   - hawiyah-logo.webp / hawiyah-mark.webp              navy and amber, for light backgrounds
   - hawiyah-logo-white.webp / hawiyah-mark-white.webp  navy turned white, for dark backgrounds
   `on` says what the logo sits on: "light", "dark", or "auto" (carries both, and CSS shows the
   white one where the background turns dark, as in the header over the hero). */
const BRAND = "/assets/brand";

type On = "auto" | "light" | "dark";

function Pair({ on, name, className, w, h, alt }: { on: On; name: string; className: string; w: number; h: number; alt: string }) {
  const img = (white: boolean) => (
    <img
      className={`${className} ${className}-${white ? "white" : "color"}`}
      src={`${BRAND}/${name}${white ? "-white" : ""}.webp`}
      width={w}
      height={h}
      alt={white && on === "auto" ? "" : alt}
    />
  );
  return (
    <span className={`${className}-pair`} translate="no">
      {on !== "dark" && img(false)}
      {on !== "light" && img(true)}
    </span>
  );
}

/** Just the mark (the H with the amber flag). */
export function LogoMark({ on = "light" }: { on?: On }) {
  return <Pair on={on} name="hawiyah-mark" className="logo-mark" w={438} h={470} alt="" />;
}

/** The full logo: mark, rule and "Hawiyah / Premium", in English in every language. */
export function Logo({ on = "auto" }: { on?: On }) {
  return (
    <span className="logo-lockup" lang="en">
      <Pair on={on} name="hawiyah-logo" className="logo-img" w={1200} h={470} alt="Hawiyah Premium" />
    </span>
  );
}

export function Chev() {
  return <i className="chev" />;
}
