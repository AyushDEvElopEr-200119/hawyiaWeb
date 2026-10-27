// Company details and navigation used by every page.

/**
 * The site's public address, used for canonical links, the sitemap and social previews.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain is live (e.g. https://corporate-stay.com).
 * Until then, Vercel's production address is used automatically.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:5178");

/** Search engines may index the site only when SITE_INDEXABLE=true (turn on with the real domain). */
export const indexable = process.env.SITE_INDEXABLE === "true";

export const company = {
  name: "Elyra",
  short: "Elyra",
  legal: "Elyra",
  url: siteUrl.replace(/\/$/, ""),
  email: "contact@corporate-stay.com",
  phone: "+91 22 6232 0033",
  mobile: "+91 9619 268 883",
  whatsapp: "919619268883",
  address: "A-904/5/6, Kailas Business Park, Hiranandani Link Road, Vikhroli (West), Mumbai – 400079, India",
  tagline: "Corporate Travel Management Company in India",
  footerLine: "Empowering organizations to travel with ease, efficiency, and confidence.",
  travgenie: "https://travgenie.com/",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/corporateworldwidestay/" },
    { label: "YouTube", href: "https://www.youtube.com/@corporateworldwidestay" },
    { label: "Facebook", href: "https://www.facebook.com/61579305184218/" },
    { label: "Instagram", href: "https://www.instagram.com/corporateworldwidestay/" },
  ],
  badges: [
    { src: "/assets/cws/2026-02-iso-c-r4vg2akqnxu4kijh0hr9q6rzxewkcuog19mimp41og.webp", alt: "ISO certified" },
    { src: "/assets/cws/2026-02-Untitled-design.webp", alt: "IATA TIDS — Travel Industry Designator Service" },
    { src: "/assets/cws/2026-02-Untitled-design-2.webp", alt: "asap — Association of Serviced Apartment Providers" },
    { src: "/assets/cws/2026-02-Untitled-design-1.webp", alt: "TAFI — Travel Agents Federation of India" },
    { src: "/assets/cws/2026-09-otoai.webp", alt: "OTOAI — Outbound Tour Operators Association of India" },
  ],
};

// The service pages, in the order the menus and footer list them.
export const services = [
  { slug: "hotel", name: "Hotels", short: "Negotiated corporate rates worldwide" },
  { slug: "service-apartments", name: "Service Apartments", short: "Long stays that feel like home" },
  { slug: "car-rentals-ground-transport", name: "Car Rentals & Ground Transport", short: "Chauffeurs, from airport to boardroom" },
  { slug: "mice", name: "MICE & Events", short: "Meetings, incentives, conferences" },
  { slug: "holidays", name: "Holidays & Offsites", short: "Offsites and incentive travel" },
  { slug: "umrah-tourism", name: "Umrah & Tourism", short: "Flexible Umrah for professionals" },
  { slug: "relocation-logistics", name: "Relocation & Logistics", short: "Moves handled end to end" },
];

export type NavLink = { href: string; label: string; desc?: string };
export type MegaMenu = {
  columns: { title: string; links: NavLink[] }[];
  aside?: { title: string; text: string; links: NavLink[] };
};
export type NavItem = { label: string; href: string; mega?: undefined } | { label: string; mega: MegaMenu; href?: undefined };

// Primary navigation. `mega` entries open a panel on desktop and an accordion on mobile.
const serviceLink = (x: (typeof services)[number]) => ({ href: `/${x.slug}/`, label: x.name, desc: x.short });
export const nav: NavItem[] = [
  {
    label: "Services",
    mega: {
      columns: [
        { title: "Corporate travel", links: services.slice(0, 3).map(serviceLink) },
        { title: "Events, leisure & moves", links: services.slice(3).map(serviceLink) },
      ],
      aside: {
        title: "One brief, every vertical",
        text: "Six services under one accountable team, with Travgenie underneath.",
        links: [{ href: "/services/", label: "All services" }, { href: "/contact/#enquire", label: "Start an enquiry" }],
      },
    },
  },
  { label: "Travgenie", href: "/travgenie/" },
  {
    label: "Company",
    mega: {
      columns: [
        { title: "Company", links: [
          { href: "/about-us/", label: "About Elyra", desc: "Since 2016, corporate travel from Mumbai" },
          { href: "/team/", label: "Leadership team", desc: "The people who own it end to end" },
          { href: "/testimonial/", label: "Testimonials", desc: "What our clients say" },
          { href: "/partner-with-us/", label: "Partner with us", desc: "For hotels and serviced apartments" },
        ] },
        { title: "Resources", links: [
          { href: "/blog/", label: "The Elyra Journal", desc: "Corporate travel insights" },
          { href: "/contact/", label: "Contact", desc: "Talk to the team that will run it" },
        ] },
      ],
    },
  },
  { label: "Testimonials", href: "/testimonial/" },
  { label: "Contact", href: "/contact/" },
];
