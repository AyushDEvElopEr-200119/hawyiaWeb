import { photos } from "@/lib/media";

type Props = {
  name: string;
  sizes?: string;
  className?: string;
  /** above-the-fold images load immediately at high priority */
  priority?: boolean;
};

/**
 * A photo from lib/media.ts. Each one is pre-cut at 800 and 1600px wide (see `npm run media`),
 * so a plain <img> with srcset is enough and the site needs no image server.
 */
export function Photo({ name, sizes = "100vw", className, priority = false, alt }: Props & { alt?: string }) {
  // a public path (CWS images in /assets/cws) is served as-is
  if (name.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={className} src={name} alt={alt ?? ""} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
    );
  }
  const p = photos[name];
  if (!p) throw new Error(`Unknown photo: ${name}`);
  const base = `/assets/media/${name}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={`${base}-${p.hd ? 2400 : 1600}.webp`}
      srcSet={`${base}-800.webp 800w, ${base}-1600.webp 1600w${p.hd ? `, ${base}-2400.webp 2400w` : ""}`}
      sizes={sizes}
      alt={p.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}

/** Muted background loop. The motion controller plays it only while visible, so only the
    first-screen video (`eager`) fetches anything before it is needed. */
export function BgVideo({ name, poster, wide = false, eager = false, manual = false }: {
  name: string; poster?: string; wide?: boolean; eager?: boolean;
  /** played by its own section (e.g. only while its chapter is on screen) rather than by visibility */
  manual?: boolean;
}) {
  return (
    <video className="bg-video" data-autoplay={manual ? undefined : ""} muted loop playsInline preload={eager ? "metadata" : "none"} poster={poster ?? `/assets/media/${name}-poster.jpg`} aria-hidden="true">
      {wide && <source src={`/assets/media/${name}-1920.mp4`} type="video/mp4" media="(min-width: 1100px)" />}
      <source src={`/assets/media/${name}-1280.mp4`} type="video/mp4" />
    </video>
  );
}
