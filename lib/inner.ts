// Extra storytelling for the inner pages, drawn by components/cws/Premium.tsx.
// Every figure, credential and date here already appears in lib/data/cws-pages.json;
// this copy only describes how the work runs, so keep it that way when editing.
import type { Section } from "./cws";

export type Chapter = {
  kicker: string; title: string; text: string; points?: string[];
  /** a photo (lib/media.ts key or /assets path), and optionally a film that plays over it */
  media: string; video?: string; alt: string;
  /** short line shown on the photo stage; defaults to the kicker */
  caption?: string;
};
export type ChaptersBlock = { eyebrow: string; title: string; intro?: string; items: Chapter[] };

export type Tile = {
  kind: "film" | "photo" | "stat" | "note" | "list";
  /** big = 2×2, wide = 2×1, tall = 1×2; default 1×1 */
  size?: "big" | "wide" | "tall";
  kicker?: string; title?: string; text?: string;
  media?: string; video?: string; alt?: string;
  value?: string; items?: string[]; href?: string; cta?: string;
};
export type BentoBlock = { eyebrow: string; title: string; intro?: string; tiles: Tile[] };

/** Where a block goes: just before the `nth` (default first) section of this kind and variant. */
export type Spot = { kind: Section["kind"]; variant?: string; nth?: number };

export type InnerExtra = {
  ribbon?: { words: string[]; before: Spot };
  chapters?: ChaptersBlock & { before: Spot };
  bento?: BentoBlock & { before: Spot };
};

const cws = (f: string) => `/assets/cws/${f}.webp`;
const film = (f: string) => `/assets/media/${f}-poster.jpg`;

export const inner: Record<string, InnerExtra> = {
  /* ============ HOTEL ============ */
  hotel: {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "Anatomy of a corporate stay",
      title: "One booking, followed from brief to invoice.",
      intro: "What actually happens between the moment your team asks for a room and the moment finance closes the month.",
      items: [
        {
          kicker: "The brief", caption: "City · dates · policy",
          title: "It starts with the trip, not the hotel.",
          text: "City, dates, duration and the travel policy the traveller is booked against. One brief covers a single executive or a whole project team, and nobody has to repeat it to three different desks.",
          points: ["Single trips, team movements and project stays", "Your policy and preferred chains applied from the start"],
          media: film("terminal"), video: "terminal", alt: "Travellers on a moving walkway in an airport",
        },
        {
          kicker: "The shortlist", caption: "Negotiated corporate rates",
          title: "Costed options, checked before you see them.",
          text: "Properties are shortlisted at negotiated corporate rates from a network of every major international and premium brand, and checked for availability and location before they reach you. You choose; we have already done the legwork.",
          points: ["Close to the office, the site or the airport", "Rates aligned to your budget and your volume"],
          media: "a-hotel-api", alt: "Modern hotel lobby",
        },
        {
          kicker: "The stay", caption: "Coordinated 24/7",
          title: "Somebody is awake when plans change.",
          text: "Late arrivals, extensions, early check-outs and the occasional escalation are handled round the clock by email and app, so the traveller keeps working and the booking keeps up with them.",
          points: ["Extensions and changes without a fresh negotiation", "Issues resolved in real time, not next morning"],
          media: film("suite"), video: "suite", alt: "Guest relaxing in a hotel room",
        },
        {
          kicker: "The invoice", caption: "Mapped to your cost centres",
          title: "Billing that lands in the right place.",
          text: "Every stay is routed to the right cost centre and rolled into centralised invoicing — across short stays, extended assignments and long-term projects — so reconciliation is a check, not a hunt.",
          points: ["Centralised or cost-centre billing", "One consolidated view across every city"],
          media: "tileAdmin", alt: "Performance analytics on a laptop screen",
        },
      ],
    },
    ribbon: { before: { kind: "split", nth: 2 }, words: ["Negotiated rates", "Every major brand", "185+ countries", "24/7 coordination", "Cost-centre billing", "Two booking models"] },
    bento: {
      before: { kind: "faq" },
      eyebrow: "The hotel desk at a glance",
      title: "Everything a corporate stay needs, in one place.",
      tiles: [
        { kind: "film", size: "big", media: film("arrivals"), video: "arrivals", kicker: "Global reach", title: "Wherever the project lands.", text: "Leading hotel chains across 185+ countries, booked to one standard." },
        { kind: "stat", value: "700,000+", title: "Properties worldwide", text: "Hotels and serviced apartments on one programme." },
        { kind: "stat", value: "1.5M+", title: "Room nights booked", text: "And counted, city by city." },
        { kind: "list", size: "wide", kicker: "Two booking models", title: "Managed for you, or self-service.", items: ["Offline managed coordination by our desk", "Self-booking in Travgenie, inside your policy", "Mix both across teams and cities"] },
        { kind: "photo", media: cws("2026-02-Banner-3"), alt: "Executive overlooking a city skyline at sunrise", kicker: "Executive travel", title: "From one MD to a whole team." },
        { kind: "note", title: "Availability, pricing, billing and compliance — accountable on every booking.", href: "/travgenie/", cta: "See Travgenie" },
        { kind: "photo", size: "wide", media: "s-hotel-booking-software", kicker: "Rooms", title: "Rooms that work for work." },
      ],
    },
  },

  /* ============ SERVICE APARTMENTS ============ */
  "service-apartments": {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "Living on assignment",
      title: "A home, not a room, for the weeks that matter.",
      intro: "Long stays need continuity. Here is how a serviced apartment assignment runs with Elyra, from the first message to the day the keys go back.",
      items: [
        {
          kicker: "Scope", caption: "Location · duration · headcount",
          title: "We start with the assignment.",
          text: "Where the work is, how long it runs, how many people are going and whether it is a relocation, a secondment or a project team. The answer decides the apartment, not the other way round.",
          media: cws("2026-08-cws-card-accommodation"), alt: "Serviced apartment building with a pool at dusk",
        },
        {
          kicker: "Select", caption: "Close to where you work",
          title: "Shortlisted for the commute, then negotiated.",
          text: "From one of the largest directly contracted portfolios — with access to over 2 lakh properties — we shortlist against commute, amenities and budget, and negotiate the rate before you sign off.",
          points: ["Near offices, project sites and business hubs", "A real saving against hotels on longer stays"],
          media: film("skyline"), video: "skyline", alt: "City skyline across the water",
        },
        {
          kicker: "Live", caption: "Kitchen · housekeeping · Wi-Fi",
          title: "Everything a home needs, already running.",
          text: "Fully equipped kitchens, proper living space, housekeeping, high-speed internet and security — so the first evening feels like an evening, not a check-in.",
          points: ["Housekeeping and in-house services", "Space to work, cook and actually rest"],
          media: film("housekeeping"), video: "housekeeping", alt: "Housekeepers making up a bed",
        },
        {
          kicker: "Stay supported", caption: "Extensions · swaps · maintenance",
          title: "The team stays with the stay.",
          text: "Extensions, apartment swaps, maintenance and billing changes are handled by a dedicated team for the whole duration — not just at booking — with invoicing set up the way your finance team needs it.",
          media: "post4", alt: "Hotel bedroom with a wooden bed",
        },
      ],
    },
    ribbon: { before: { kind: "split", nth: 2 }, words: ["Since 2016", "2 lakh+ properties", "Fully equipped", "Near the office", "Housekeeping included", "Flexible billing"] },
    bento: {
      before: { kind: "faq" },
      eyebrow: "Why apartments, why Elyra",
      title: "Built for stays measured in weeks.",
      tiles: [
        { kind: "photo", size: "big", media: cws("2026-09-freepik__a-professional-photograph-of-a-stylish-serviced-ap__55662"), alt: "Open-plan serviced apartment kitchen and living area", kicker: "Pioneer in the segment", title: "We brought long-stay apartments to Indian corporates.", text: "Since 2016 it has been our core expertise." },
        { kind: "stat", value: "150+", title: "Corporate clients", text: "Running assignments with us today." },
        { kind: "photo", media: cws("2026-08-cws-contact-domestic"), alt: "City skyline in the morning haze", kicker: "Location", title: "Close to the office." },
        { kind: "list", size: "wide", kicker: "Who stays", title: "Made for the people on the move.", items: ["Project teams on long deployments", "Expatriates and relocating employees", "Executives on extended assignments"] },
        { kind: "note", size: "wide", title: "A true home away from home — and one invoice at the end of it." },
        { kind: "photo", size: "wide", media: cws("2026-08-cws-hero-apartments-1"), alt: "Serviced apartment bedroom at dusk", kicker: "Evenings", title: "Room to switch off." },
      ],
    },
  },

  /* ============ CAR RENTALS ============ */
  "car-rentals-ground-transport": {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "A day on the road",
      title: "From the arrivals hall to the boardroom, on time.",
      intro: "Ground transport is where a trip feels organised or doesn't. This is how a chauffeur-driven day runs.",
      items: [
        {
          kicker: "Arrival", caption: "Airport transfers",
          title: "Airport transfers, arranged with the trip.",
          text: "Airport transfers are arranged with the trip, so a car and a professional chauffeur are ready when the traveller lands — the first five minutes of a trip set the tone for the rest of it.",
          media: film("terminal"), video: "terminal", alt: "Travellers on an airport walkway",
        },
        {
          kicker: "The vehicle", caption: "Sedans · SUVs · luxury · coaches",
          title: "The right car for the role.",
          text: "The fleet is matched to the traveller and the occasion — sedans and SUVs through to premium luxury cars and coaches — so a consultant, an MD and a visiting board each get what fits.",
          points: ["Assigned by employee role and travel need", "Coaches for teams, events and site visits"],
          media: cws("2026-08-cws-hero-carrentals-v2"), alt: "Chauffeur beside a car at dusk",
        },
        {
          kicker: "On the road", caption: "Trained · vetted · discreet",
          title: "Professionals who know the job.",
          text: "Chauffeurs are trained and vetted, and hold to standards of safety, discretion and service. Real-time coordination and safety protocols keep the day punctual.",
          media: "carB2B2B", alt: "City skyline across the water at night",
        },
        {
          kicker: "The bill", caption: "One consolidated invoice",
          title: "Every journey, one invoice.",
          text: "Journeys roll up into centralised invoicing mapped to your cost centres, and the whole programme can be booked and tracked in Travgenie alongside your stays.",
          media: cws("2026-08-cws-card-carrentals"), alt: "Chauffeur opening a car door at night outside an office",
        },
      ],
    },
    ribbon: { before: { kind: "split", nth: 2 }, words: ["Airport transfers", "Executive mobility", "Professional chauffeurs", "Sedans to coaches", "Real-time coordination", "Central billing"] },
    bento: {
      before: { kind: "faq" },
      eyebrow: "Ground transport, handled",
      title: "Every kind of movement your business makes.",
      tiles: [
        { kind: "film", size: "big", media: film("arrivals"), video: "arrivals", kicker: "Executive mobility", title: "From arrivals to the boardroom.", text: "Chauffeur-driven services across key business destinations worldwide." },
        { kind: "list", kicker: "What we cover", title: "Movements", items: ["Airport transfers", "Day-long executive use", "Event shuttles", "Long-term project transport"] },
        { kind: "stat", value: "185+", title: "Countries", text: "Covered by our global network." },
        { kind: "photo", size: "wide", media: "a-car-rental-api", kicker: "Project transport", title: "Teams moved, day after day." },
        { kind: "note", size: "wide", title: "Vehicle quality, punctuality, billing transparency — structured, not improvised.", href: "/travgenie/", cta: "Book it in Travgenie" },
        { kind: "photo", size: "wide", media: "s-corporate-travel-software", kicker: "Airport runs", title: "Every terminal, handled." },
      ],
    },
  },

  /* ============ HOLIDAYS ============ */
  holidays: {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "How an offsite comes together",
      title: "Planned around what the trip is actually for.",
      intro: "An offsite is a business decision with a budget behind it. Here is how we turn the brief into a few days your team will talk about.",
      items: [
        {
          kicker: "Purpose", caption: "Reward · retreat · reset",
          title: "First, why are you going?",
          text: "A reward trip, a leadership retreat and a team reset need different places. We start with the purpose, the group and the dates the business has set — then choose destinations that fit.",
          media: "carTour", alt: "Group walking on a grassy hill",
        },
        {
          kicker: "Place", caption: "Domestic · international · cruise",
          title: "Destinations chosen for the group.",
          text: "Domestic escapes, international destinations and cruises across standard and premium categories — each weighed for experience value, accommodation quality, accessibility and comfort.",
          media: cws("2026-08-cws-card-leisure"), alt: "Wooden boat moored beside a tropical deck",
        },
        {
          kicker: "Moments", caption: "Groups of 10 to 100+",
          title: "Days that feel like time off.",
          text: "Group bookings, coordinated transfers and customised itineraries, for intimate groups of ten or gatherings of a hundred and more — paced so the time away actually feels like it.",
          points: ["Dinners, activities and free time in balance", "Premium stays and serviced apartments"],
          media: "i-dmcs", alt: "Seaside terrace in Mykonos",
        },
        {
          kicker: "Return", caption: "Accountable to the budget",
          title: "Home again, and on budget.",
          text: "From the first booking to the return leg, one desk answers for the trip — and for the budget afterwards.",
          media: cws("2026-08-cws-hero-holidays"), alt: "Couple on a beach under palm trees at sunset",
        },
      ],
    },
    ribbon: { before: { kind: "split", nth: 2 }, words: ["Corporate offsites", "Incentive travel", "Group holidays", "Domestic", "International", "Cruise"] },
    bento: {
      before: { kind: "faq" },
      eyebrow: "Trips worth the time away",
      title: "From a department day out to an international incentive.",
      tiles: [
        { kind: "film", size: "big", media: film("effect"), video: "effect", kicker: "Escapes", title: "Somewhere the team will remember.", text: "Beach getaways, cultural explorations and adventure escapes." },
        { kind: "stat", value: "185+", title: "Countries", text: "To choose from, near or far." },
        { kind: "photo", size: "tall", media: "carOTA", kicker: "International", title: "Further afield." },
        { kind: "list", kicker: "Included in the plan", title: "Handled for you", items: ["Flights and stays", "Transfers", "Activities", "Dedicated support"] },
        { kind: "photo", size: "wide", media: "s-holiday-package-booking-software", kicker: "Culture", title: "Cultural explorations, planned well." },
        { kind: "note", size: "wide", title: "Planning corporate offsites and incentive travel since 2016." },
      ],
    },
  },

  /* ============ MICE ============ */
  mice: {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "Behind every event",
      title: "From the first brief to the closing session.",
      intro: "A conference is a hundred small decisions that all have to land on the same day. This is how we run them.",
      items: [
        {
          kicker: "Objective", caption: "Audience · outcome · window",
          title: "What does the event have to achieve?",
          text: "Who is attending, what the business needs from them and the window the event has to fit. The objective shapes the destination, the venue and the agenda — not the other way round.",
          media: "tileB2B", alt: "Team talking around a table",
        },
        {
          kicker: "Venue", caption: "Partners worldwide",
          title: "The right room, in the right city.",
          text: "Venues, hotels and service providers sourced from our partnerships across domestic and international destinations, chosen for the audience and the format.",
          media: "a-hotel-api", alt: "Modern hotel lobby",
        },
        {
          kicker: "Logistics", caption: "Tickets · transfers · rooms",
          title: "Everyone arrives, together.",
          text: "Group ticketing, transfers, accommodation and the schedule that ties them together — planned so attendees think about the content, not the shuttle.",
          media: "i-corporate", alt: "People walking through a terminal",
        },
        {
          kicker: "On the day", caption: "Teams on site",
          title: "Experienced people, on the ground.",
          text: "Our teams are on site, focused on execution accuracy, attendee satisfaction and keeping the timeline — from ideation through to the closing session.",
          media: cws("2026-08-cws-journey-2019"), alt: "Guests networking at a standing reception",
        },
      ],
    },
    ribbon: { before: { kind: "split", nth: 2 }, words: ["Meetings", "Incentives", "Conferences", "Exhibitions", "Brand events", "Annual meets"] },
    bento: {
      before: { kind: "faq" },
      eyebrow: "MICE, end to end",
      title: "Events that move the business forward.",
      tiles: [
        { kind: "film", size: "big", media: film("handshake"), video: "handshake", kicker: "Partnerships", title: "Venues, hotels and partners, aligned.", text: "Venues, accommodation and logistics managed end to end." },
        { kind: "list", kicker: "Formats", title: "What we run", items: ["Leadership meetings", "Incentive programmes", "Conferences", "Brand events and annual meets"] },
        { kind: "stat", value: "150+", title: "Corporate clients", text: "Trust us with their people." },
        { kind: "photo", size: "wide", media: "i-otas", kicker: "Incentives", title: "Rewards that feel like one." },
        { kind: "note", size: "wide", title: "Support available 24/7, from ideation to execution." },
        { kind: "photo", size: "wide", media: "carB2B2C", kicker: "Engagement", title: "People talking, not waiting." },
      ],
    },
  },

  /* ============ RELOCATION ============ */
  "relocation-logistics": {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "A move, step by step",
      title: "New city. Same work. No lost week.",
      intro: "Relocating an employee or an office is about continuity. Elyra Logistix runs every move on a defined workflow so the work never stalls.",
      items: [
        {
          kicker: "Assess", caption: "Volume · destination · timeline",
          title: "We assess before we move.",
          text: "Volume, destination, timeline and the compliance requirements the move has to meet — agreed up front, so schedules hold and costs stay controlled.",
          media: "post1", alt: "Planning notes on paper",
        },
        {
          kicker: "Pack", caption: "Trained crews · quality materials",
          title: "Handled like it's ours.",
          text: "Trained personnel and quality packing materials, with personal belongings, office equipment and corporate assets tracked in transit.",
          media: film("boxes"), video: "boxes", alt: "Person carrying a packed box down the stairs",
        },
        {
          kicker: "Transit", caption: "Domestic · international",
          title: "Across cities, across borders.",
          text: "Safe transportation for household moves, office relocations and project deployments — domestic and international — with real-time updates along the way.",
          media: cws("2025-12-freepik__a-professional-wide-photograph-of-a-modern-logisti__93939-scaled"), alt: "Moving truck being loaded outside an office tower",
        },
        {
          kicker: "Settle", caption: "Accommodation · mobility · onboarding",
          title: "Settled in, not just delivered.",
          text: "Accommodation, local mobility and onboarding logistics are coordinated alongside the move, and our team stays on the ground until it is genuinely done.",
          media: cws("2026-08-cws-journey-2022"), alt: "Boxes stacked in a bright new home",
        },
      ],
    },
    ribbon: { before: { kind: "split", nth: 2 }, words: ["Employee relocation", "Office moves", "Project logistics", "Secure handling", "Domestic & international", "On-ground support"] },
    bento: {
      before: { kind: "faq" },
      eyebrow: "Elyra Logistix",
      title: "Moving people and everything they own.",
      tiles: [
        { kind: "photo", size: "big", media: "ways", kicker: "Domestic & international", title: "Across cities and across borders.", text: "A strong logistics network for timely execution without delays." },
        { kind: "film", media: film("terminal"), video: "terminal", kicker: "Arrival", title: "Arrival, coordinated." },
        { kind: "stat", value: "150+", title: "Corporate clients", text: "Rely on us for transitions." },
        { kind: "list", size: "wide", kicker: "One partner for", title: "The whole move", items: ["Household moves for employees", "Whole-office relocations", "Accommodation on arrival", "Local mobility and onboarding"] },
        { kind: "note", size: "wide", title: "Efficiency, cost control and operational speed — by design." },
        { kind: "photo", size: "wide", media: cws("2026-08-cws-card-relocation"), alt: "Movers loading a truck outside a house", kicker: "Door to door", title: "Loaded with care." },
      ],
    },
  },

  /* ============ SERVICES HUB ============ */
  services: {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "One programme",
      title: "Start with one service. Consolidate the rest.",
      intro: "Most clients begin with the service they need most urgently. This is what it looks like when the rest moves onto the same programme.",
      items: [
        {
          kicker: "One brief", caption: "One accountable team",
          title: "Tell us what you run today.",
          text: "Routes, volumes, the policy you are working to and which services you buy where. We map it before we propose anything.",
          media: cws("2026-08-cws-about-who-v2"), alt: "Team planning around a table in front of a world map",
        },
        {
          kicker: "Specialist desks", caption: "Each desk owns its service",
          title: "Specialists behind every service.",
          text: "Hotels, apartments, ground transport, MICE, holidays and relocation are each run by the desk that specialises in them — so expertise never gets diluted by consolidation.",
          media: cws("2026-08-cws-contact-reception"), alt: "Bright, modern office reception",
        },
        {
          kicker: "One platform", caption: "Travgenie underneath",
          title: "Booked and tracked in one place.",
          text: "Travgenie sits underneath the programme, so self-booking, approvals and spend visibility work the same across every service.",
          media: film("workspace"), video: "workspace", alt: "Hands typing on a laptop",
        },
        {
          kicker: "One relationship", caption: "Account management",
          title: "A single point of contact.",
          text: "A dedicated account manager who knows your policies and preferences, and one consolidated billing relationship your finance team can work with.",
          media: cws("2026-08-cws-journey-2024"), alt: "Two professionals shaking hands in a sunlit office",
        },
      ],
    },
    ribbon: { before: { kind: "pay" }, words: ["Hotels", "Serviced apartments", "Chauffeur-driven cars", "MICE", "Offsites", "Umrah", "Relocation"] },
  },

  /* ============ ABOUT ============ */
  "about-us": {
    ribbon: { before: { kind: "stats" }, words: ["Since 2016", "185+ countries", "150+ corporate clients", "30,000+ bookings", "1.5M+ room nights", "24/7"] },
    chapters: {
      before: { kind: "founder" },
      eyebrow: "What working with us feels like",
      title: "Personal service, at corporate scale.",
      items: [
        {
          kicker: "Mumbai", caption: "Head office · Vikhroli",
          title: "Run from Mumbai, every day.",
          text: "Our teams work from Kailas Business Park in Vikhroli, with domestic and international locations behind them — and since 2016, still answering the phone.",
          media: cws("2026-08-cws-contact-office"), alt: "Glass office building",
        },
        {
          kicker: "Partnership", caption: "Dedicated account management",
          title: "Someone who knows your programme.",
          text: "A single point of contact who knows your needs, preferences and travel policies — and tailors solutions to them instead of starting from scratch each time.",
          media: "tileB2B", alt: "Team talking around a table",
        },
        {
          kicker: "Technology", caption: "Travgenie",
          title: "Tools that give you control.",
          text: "With Travgenie we added automation, policy compliance and real-time visibility to the service — so the human side has more time for the moments that need it.",
          media: "tileAdmin", alt: "Analytics on a laptop screen",
        },
      ],
    },
  },

  /* ============ TRAVGENIE ============ */
  travgenie: {
    chapters: {
      before: { kind: "genie" },
      eyebrow: "A booking, start to finish",
      title: "From policy to report, in one platform.",
      intro: "Travgenie gives each person the part of a booking that is theirs. Here is one trip, followed through the platform.",
      items: [
        {
          kicker: "Set the rules", caption: "Travel managers",
          title: "Your policy, built in.",
          text: "Travel managers set up employees, policies and approval workflows in the admin dashboard once. From then on, every booking runs against them at the point of booking.",
          media: "tileAdmin", alt: "Analytics dashboard on a laptop",
        },
        {
          kicker: "Book", caption: "1M+ accommodation options",
          title: "Search, shortlist, share.",
          text: "Employees and central bookers search over a million accommodation options worldwide — including Travgenie Assured hotels and serviced apartments — and shortlist options to share.",
          media: "c-travel-mobile-app-development", alt: "Hand holding a smartphone",
        },
        {
          kicker: "Approve", caption: "Transparent workflows",
          title: "Approvals without the email chain.",
          text: "Requests, approvals and itineraries are tracked in one place, so nobody is chasing a thread to find out whether the trip is confirmed.",
          media: cws("2026-08-cws-journey-2023"), alt: "Laptop and phone on a bright desk",
        },
        {
          kicker: "Report", caption: "MIS · reconciliation · audit",
          title: "Spend you can actually see.",
          text: "MIS and spend reports, price-drop alerts, multi-currency billing and integration with ERP and HRMS systems — with easy-to-use reports for reconciliation and audits.",
          media: "post5", alt: "Card resting on a laptop keyboard",
        },
      ],
    },
    ribbon: { before: { kind: "quotes" }, words: ["Policy-compliant", "Smart approvals", "1M+ stays", "ERP & HRMS", "Price-drop alerts", "MIS reports"] },
  },

  /* ============ UMRAH ============ */
  "umrah-tourism": {
    chapters: {
      before: { kind: "steps" },
      eyebrow: "Your pilgrimage, cared for",
      title: "So you can focus entirely on your devotion.",
      intro: "Every part of the journey is arranged around your calendar, your family and your intentions.",
      items: [
        {
          kicker: "Before you leave", caption: "Visa assistance",
          title: "The paperwork, handled.",
          text: "Visa documentation is managed by experienced people, and your flights, hotels and transport are chosen with you — for four nights or fifteen and beyond.",
          media: cws("2026-08-cws-card-umrah"), alt: "Mosque courtyard at sunset",
        },
        {
          kicker: "In Makkah", caption: "Premium hotels near the Haram",
          title: "Close to the Haram.",
          text: "Carefully selected premium accommodation near the Haram, for effortless access.",
          media: film("umrah"), video: "umrah", alt: "Pilgrims walking through a corridor of the Grand Mosque",
        },
        {
          kicker: "Between cities", caption: "Private transfers",
          title: "Travel in comfort.",
          text: "Comfortable, air-conditioned private vehicles for every transfer, so the time between cities is restful too.",
          media: cws("2026-07-Untitled-design-72"), alt: "Pilgrims in the courtyard of the Grand Mosque",
        },
        {
          kicker: "In Madinah", caption: "Guided Ziyarah",
          title: "Time for Ziyarah and reflection.",
          text: "Guided Ziyarah tours and optional visits in Makkah and Madinah, with round-the-clock support before, during and after your journey.",
          media: cws("2026-07-pexels-sultan-175963006-18274181-scaled"), alt: "The Grand Mosque at dusk",
        },
      ],
    },
    ribbon: { before: { kind: "cards", variant: "acts" }, words: ["Flexible dates", "Premium hotels", "Private transfers", "Visa assistance", "Guided Ziyarah", "24/7 support"] },
  },

  /* ============ PARTNERS ============ */
  "partner-with-us": {
    chapters: {
      before: { kind: "stats" },
      eyebrow: "Hosting Elyra guests",
      title: "What a direct contract looks like in practice.",
      items: [
        {
          kicker: "The guests", caption: "Business travellers from India",
          title: "Travellers who are already on their way.",
          text: "Our guests are business travellers booked through our managed desks and our platforms — consultants, project teams and executives travelling for work.",
          media: "carB2E", alt: "Business traveller in an airport lounge",
        },
        {
          kicker: "The stays", caption: "Weeks, not nights",
          title: "Long stays are core to us.",
          text: "Serviced apartments and employee relocation are central Elyra services, so partners see stays that hold for weeks at a time.",
          media: cws("2026-09-freepik__a-professional-photograph-of-a-stylish-serviced-ap__55662"), alt: "Stylish serviced apartment living area",
        },
        {
          kicker: "The contract", caption: "One direct relationship",
          title: "Two parties, no chain of intermediaries.",
          text: "Rates, availability, cancellation and billing are agreed directly between you and Elyra — and we represent your property to Indian companies from Mumbai, every day.",
          media: film("handshake"), video: "handshake", alt: "Business partners shaking hands",
        },
      ],
    },
    ribbon: { before: { kind: "steps" }, words: ["Hotels", "Serviced apartments", "Aparthotels", "DMCs", "Direct contracts", "Long stays"] },
  },

  /* ============ TESTIMONIALS ============ */
  testimonial: {
    ribbon: { before: { kind: "logos" }, words: ["150+ corporate programmes", "30,000+ bookings", "1.5M+ room nights", "Since 2016", "24/7 support"] },
    bento: {
      before: { kind: "logos" },
      eyebrow: "Why they stay",
      title: "The programmes behind the reviews.",
      tiles: [
        { kind: "photo", size: "big", media: "p-about", kicker: "Partnership", title: "Trust, built booking by booking.", text: "Dedicated account managers who know every programme." },
        { kind: "stat", value: "150+", title: "Corporate clients" },
        { kind: "stat", value: "30,000+", title: "Bookings" },
        { kind: "photo", size: "wide", media: "t-team", alt: "The team celebrating together", kicker: "The team", title: "The people behind the reviews." },
        { kind: "note", size: "wide", title: "Add your programme to the list.", href: "#enquire", cta: "Start a conversation" },
        { kind: "stat", size: "wide", value: "1.5M+", title: "Room nights booked", text: "Across every Elyra programme since 2016." },
      ],
    },
  },

  /* ============ CONTACT ============ */
  contact: {
    chapters: {
      before: { kind: "cards" },
      eyebrow: "After you write",
      title: "What happens next.",
      items: [
        {
          kicker: "Received", caption: "Every enquiry gets a reply",
          title: "It reaches the right desk.",
          text: "Your message goes to the team that runs that line of business — hotels, apartments, cars, leisure and MICE, or relocation — not a general inbox.",
          media: cws("2026-08-cws-about-who-v2"), alt: "Team planning together",
        },
        {
          kicker: "Understood", caption: "Mumbai desk",
          title: "We ask what we need to know.",
          text: "Routes, volumes, dates and the policy you are working to. A short conversation now saves a long thread later.",
          media: cws("2026-08-cws-contact-office"), alt: "Glass office building",
        },
        {
          kicker: "Costed", caption: "Something costed, not a brochure",
          title: "You get a real proposal.",
          text: "A costed programme built around your travel pattern — and, for travellers already on the move, 24/7 coordination from the first booking.",
          media: cws("2026-08-cws-contact-domestic"), alt: "City skyline in the morning haze",
        },
      ],
    },
  },

  /* ============ TEAM ============ */
  team: {
    ribbon: { before: { kind: "cards" }, words: ["Operations", "Leisure", "General management", "Finance", "Since 2016"] },
    bento: {
      before: { kind: "cta" },
      eyebrow: "Life at Elyra",
      title: "On the road and at home.",
      tiles: [
        { kind: "photo", size: "big", media: "t-party", alt: "The team celebrating in the office", kicker: "The team", title: "One team, every vertical." },
        { kind: "photo", media: "t-event", alt: "Guests talking at an event", kicker: "Out there", title: "Meeting travellers." },
        { kind: "stat", value: "150+", title: "Corporate clients", text: "Looked after by this team, since 2016." },
        { kind: "photo", size: "wide", media: "g-11", alt: "Colleagues taking a selfie", kicker: "Milestones", title: "Celebrated together." },
        { kind: "photo", size: "wide", media: "t-desk", alt: "Colleagues working at their desks", kicker: "Every day", title: "At the desk and at the expo." },
        { kind: "note", size: "wide", title: "Speak to the person who owns it.", href: "/contact/", cta: "Contact the team" },
      ],
    },
  },
};

/** Index of the section each extra block goes in front of (undefined: the page has no such section). */
export function spotIndex(sections: Section[], spot: Spot): number | undefined {
  let seen = 0;
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (s.kind === spot.kind && (!spot.variant || s.variant === spot.variant) && ++seen === (spot.nth ?? 1)) return i;
  }
  return undefined;
}
