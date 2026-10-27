// Company details and navigation used by every page.
// Replace the placeholder contact details once they are confirmed.

/**
 * The site's public address, used for canonical links, the sitemap and social previews.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain is live (e.g. https://www.elyra.com).
 * Until then, Vercel's production address is used automatically.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:5178");

/** Search engines may index the site only when SITE_INDEXABLE=true (turn on with the real domain). */
export const indexable = process.env.SITE_INDEXABLE === "true";

export const company = {
  name: "Elyra",
  legal: "ELYRA",
  url: siteUrl.replace(/\/$/, ""),
  email: "hello@example.com",
  phone: "",          // e.g. "+91 00000 00000"
  whatsapp: "",       // e.g. "910000000000" (digits only, used for wa.me)
  address: "",        // office address
  tagline: "White-label & custom travel booking software",
};

export const solutions = [
  { slug: "white-label-travel-booking-software", name: "White-Label Travel Booking Software", short: "A complete OTA platform under your brand" },
  { slug: "flight-booking-software", name: "Flight Booking Software", short: "Search, fares, ancillaries and post-booking" },
  { slug: "hotel-booking-software", name: "Hotel Booking Software", short: "Rooms, rates, mapping and vouchers" },
  { slug: "holiday-package-booking-software", name: "Holiday Package Booking Software", short: "Itineraries, departures and pricing" },
  { slug: "b2c-travel-portal", name: "B2C Travel Portal", short: "Self-service booking for travellers" },
  { slug: "b2b-travel-portal", name: "B2B Travel Agent Portal", short: "Credit, markups and agent control" },
  { slug: "corporate-travel-software", name: "Corporate Travel Software", short: "Policies, approvals and spend" },
  { slug: "travel-management-software", name: "Travel Management Software", short: "Back-office, accounting and reports" },
];

export const services = [
  { slug: "custom-travel-website-development", name: "Custom Travel Website Development", short: "Brand-first sites that sell trips" },
  { slug: "booking-engine-development", name: "Booking Engine Development", short: "Engines built around your inventory" },
  { slug: "travel-mobile-app-development", name: "Travel Mobile App Development", short: "Android & iOS apps for travellers and agents" },
  { slug: "custom-travel-portal-development", name: "Custom Travel Portal Development", short: "B2B, B2C and hybrid portals" },
  { slug: "crm-back-office-development", name: "CRM & Back-Office Development", short: "Operations, finance and customer tools" },
  { slug: "custom-software-integrations", name: "Custom Software Integrations", short: "Connect the systems you already use" },
];

export const apis = [
  { slug: "flight-gds-api", name: "Flight & GDS API Integration", short: "GDS, LCC, NDC and consolidators", cat: "Flights" },
  { slug: "hotel-api", name: "Hotel API Integration", short: "Wholesalers, aggregators and mapping", cat: "Hotels" },
  { slug: "car-rental-api", name: "Car Rental API Integration", short: "Rental fleets by location and date", cat: "Ground" },
  { slug: "bus-api", name: "Bus API Integration", short: "Routes, live seats and ticketing", cat: "Ground" },
  { slug: "transfers-activities-api", name: "Transfers & Activities API", short: "Airport transfers, tours and tickets", cat: "Experiences" },
  { slug: "payment-gateway-integration", name: "Payment Gateway Integration", short: "Gateways, wallets and multi-currency", cat: "Payments" },
];

export type NavLink = { href: string; label: string; desc?: string };
export type MegaMenu = {
  columns: { title: string; links: NavLink[] }[];
  aside?: { title: string; text: string; links: NavLink[] };
};
export type NavItem = { label: string; href: string; mega?: undefined } | { label: string; mega: MegaMenu; href?: undefined };

// Primary navigation. `mega` entries open a panel on desktop and an accordion on mobile.
export const nav: NavItem[] = [
  {
    label: "Solutions",
    mega: {
      columns: [
        { title: "Ready-made platforms", links: solutions.slice(0, 4).map((s) => ({ href: `/solutions/${s.slug}/`, label: s.name, desc: s.short })) },
        { title: "Portals & back-office", links: solutions.slice(4).map((s) => ({ href: `/solutions/${s.slug}/`, label: s.name, desc: s.short })) },
      ],
      aside: {
        title: "Not sure where to start?",
        text: "Compare every platform, then see our starting-from pricing.",
        links: [{ href: "/solutions/", label: "All solutions" }, { href: "/pricing/", label: "Pricing" }],
      },
    },
  },
  {
    label: "Services",
    mega: {
      columns: [
        { title: "Custom development", links: services.map((s) => ({ href: `/custom-development/${s.slug}/`, label: s.name, desc: s.short })) },
        { title: "Hire developers", links: [
          { href: "/hire-developers/#web", label: "Web Developers", desc: "Front-end, back-end and full-stack" },
          { href: "/hire-developers/#mobile", label: "Mobile Developers", desc: "Native Android & iOS" },
          { href: "/hire-developers/#cross-platform", label: "Cross-Platform Developers", desc: "One codebase, both stores" },
        ] },
      ],
      aside: {
        title: "Have something unique in mind?",
        text: "We'll scope it, recommend white-label or custom, and plan it in milestones.",
        links: [{ href: "/custom-development/", label: "Custom development" }, { href: "/contact/", label: "Discuss your project" }],
      },
    },
  },
  {
    label: "API Integrations",
    mega: {
      columns: [
        { title: "Supplier connectivity", links: apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, label: a.name, desc: a.short })) },
      ],
      aside: {
        title: "Integration directory",
        text: "Browse every category we connect, filtered by what you sell.",
        links: [{ href: "/api-integrations/", label: "View directory" }],
      },
    },
  },
  { label: "Industries", href: "/industries/" },
  {
    label: "Company",
    mega: {
      columns: [
        { title: "Company", links: [
          { href: "/about/", label: "About Elyra", desc: "Who we are and what we build" },
          { href: "/about/#mission", label: "Mission & Vision", desc: "Why we do it" },
          { href: "/about/#process", label: "How We Work", desc: "Our 10-step delivery process" },
          { href: "/contact/", label: "Contact", desc: "Talk to a specialist" },
        ] },
        { title: "Resources", links: [
          { href: "/blog/", label: "Blog", desc: "The Elyra Journal: guides and insights" },
          { href: "/resources/", label: "Resources", desc: "Travel tech, explained plainly" },
          { href: "/resources/#faq", label: "FAQ", desc: "Answers before you ask" },
          { href: "/pricing/", label: "Pricing", desc: "Starting-from tiers" },
        ] },
      ],
    },
  },
  { label: "Contact", href: "/contact/" },
];
