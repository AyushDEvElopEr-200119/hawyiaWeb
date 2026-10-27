# SRDV Technologies — reference notes

Source: https://www.srdvtechnologies.com/ (fetched 2026-10-28). Use this as a feature and structure reference for Elyra. Rewrite everything in Elyra's own words; don't copy their text.

## Company
- Travel technology company, SRDV Limited, founded 2013, India.
- Tagline: "Smarter Search. Stronger Business."
- Claims: 13+ years, 1,800+ projects, 98% client satisfaction, 100+ travel API integrations (About page says 25+; their numbers aren't consistent).
- Offices: G-192, Sector 63, Noida (Delhi-NCR) 201307 and Elora Complex, Khandari, Agra 282005.
- Contact: +91 96437 37505, info@srdvtechnologies.com, WhatsApp chat, callback form.
- Has an AI assistant called "Ginni AI".
- Offer banner: "Up to 50% OFF" for a limited time.
- Principles: business before features, transparent collaboration, quality with accountability, support after launch.
- Timeline: 2013 web/software → specialised in travel → connected ecosystem → next: automation, analytics, AI.

## Products
**White-label portals:** B2C, B2B, B2B2B, B2B2C, B2E/corporate, on web, Android and iOS.

**Travel portal solutions:** Travel CRM, B2C, B2B, B2E, B2B2B portals, tour package website, flight, hotel, bus and car booking software, tour operator software, travel agency software, travel website development, series fare website.

**Extranets (own inventory):** flight, hotel, tour package, car and bus extranets, plus a Visa CMS (country-wise visa info, documents, processing guidance).

**Mobile apps:** Android, iOS, cross-platform (React Native).

**Other APIs:** travel insurance (and an insurance booking system), recharge and utility/bill payments, payment gateways.

## Features by module
- **Flights:** fare calendar with festival markers, route maps, markup rules, fare comparison, AI fare alerts, ancillaries/SSR (seats, meals, baggage), after-booking changes (date change, reissue), fare and inventory management, sales reports.
- **Hotels:** booking calendar, 50+ hotel API connections, hotel mapping to merge duplicates, supplier comparison, map and area search, post-booking management.
- **Buses:** live seat map, boarding/dropping points, operator settlement and commissions, route maps, analytics.
- **Cars:** multiple booking modes, shared and private rides, vehicle and driver management, zone-based dynamic pricing, fleet analytics.
- **Tour packages:** package builder, day-wise itinerary CMS, dynamic pricing, hotel and transport mapping, activity CMS, B2B agent management, supplier contract allocation.
- **Across the platform:** themes per page, website CMS, blogs, testimonials, SEO settings, coupons, markups and discounts, management and convenience fees, debit/credit notes, auto invoicing, auto refunds, multi-currency, multi-language, staff roles, customer and agent wallets, agent credit limits, corporate approvals, admin dashboard, booking/sales/agent reports, SMS and email alerts, AI chatbot, chat and voice search, smart supplier priority, lead/enquiry management.
- **Inventory options:** SRDV-connected inventory, the client's own supplier APIs, or both.
- Their stated stack for the white-label: Next.js, React, TypeScript, Python, FastAPI, AWS.

## Travel CRM
Lead intake (source, destination, dates, group size, budget), duplicate checks, traveller profiles, assignment and follow-ups with escalation, quotation versions and itinerary context, handover to operations, role permissions, reports (open, overdue, won/lost). Ready-made or custom. Integrations: web forms, email, WhatsApp Business, SMS, telephony, booking systems. AI (summaries, reply drafts, routing) is a roadmap item, not standard.

## API integrations
- **Flight (23+):** Amadeus, Travelport, Sabre, Air Arabia, SpiceJet, IndiGo, Akasa Air, Air India, FlyHub, flydubai, Mystifly, TBO, TripJack, Kafila, Etrav, Akbar Travels, and more, plus 30+ fixed-departure (series fare) suppliers.
- **Hotel (20):** Amadeus, Travelport, Expedia, Booking.com, RoomsXML, GRN Connect, Rezlive, Hotelbeds, Desiya, Hilton, Viator, MakeMyTrip, Yatra, TBO Holidays, TripJack, TravClan, Juniper, DOTW, RateHawk, OYO.
- **Bus (7+):** RedBus, AbhiBus, Bitla, TicketGoose, Travelyaari, VRL, Zingbus.
- **Car/transfer (7+):** Hertz, Europcar, Sixt, CarTrawler, Amadeus Cars, Budget, Avis.
- **Payments (18):** PayU, Razorpay, CCAvenue, Cashfree, Paytm, PhonePe, Easebuzz, Stripe, PayPal, HDFC, Atom, Telr, Khalti, Dragonpay, aamarPay, Lyra, Traknpay, AgreePay.
- **Dedicated pages:** Amadeus, Galileo, Sabre, Hotelbeds, GRNConnect, TBO, Tripjack, Kafila, RedBus.
- **Process:** define and compare → get docs and sandbox → integrate and test → approve, go live, monitor. Booking flow: search → revalidate price → traveller details → book → check status → ticket/voucher.

## Pricing (starting prices, one service, basic features)
| Plan | India | International | Yearly |
|---|---|---|---|
| Readymade Travel Website | ₹25,000 | $500 | ₹5,000 AMC / $150 |
| Custom Advance Travel Solution | ₹2,00,000 | $5,000 | ₹25,000 AMC / quoted |
| Travel Service APIs | ₹20,000 | quote | ₹3,000 AMC / quoted |
| Holiday Package Website | ₹20,000 | $500 | ₹5,000 AMC / $150 |
| Hotel CMS / Extranet | ₹30,000 | $500 | ₹6,000 AMC / $150 |
| Itinerary Builder Tour CMS | ₹50,000 | $2,500 | ₹10,000 AMC / $250 |
| Travel / Lead CRM | ₹50,000 | $1,000 | ₹5,000 AMC / $250 |

Extra: apps, more APIs, customisation, hosting, payment gateway, support. Indian prices exclude tax; AMC rises with data or users.

## Delivery process (white-label)
1. Choose modules. 2. Apply branding (logo, colours, domain, content). 3. Connect inventory, payments, pricing, permissions. 4. Test, train, launch.

## Partners and clients
- Tech partners: Amadeus, Galileo, Sabre, Travelport, SITA, Mystifly, TravelFusion, TBO, Air Arabia, SpiceJet, GOL, 24Rooms.
- Cloud: AWS, Google Cloud, Azure, CloudLinux.
- 24 listed client launches (e.g. Hojoy, EaseOtrip, Switch My Trip, Tripsouq Holidays, Bosspay, Open My Trip). No testimonials or case studies.

## FAQ themes (18 questions)
Who SRDV is, why choose them, travel experience since 2013, tech stack, supplier connections, not a travel agency, no commission-only agents, no agent IDs from SRDV (portal owners manage their own), prepaid wallet needed for bookings, who can use it, portal vs CRM, API integration steps, branding and custom workflows, timelines depend on scope, support/hosting/security set per project.

## Site structure
- Company: about, contact, clients, careers, technologies, blogs, FAQ, pricing, request demo, check-my-ip, terms.
- Technology pages: PHP, Android, JavaScript, Java, iOS, C++, .NET, Windows, Python, React Native, Cloud & AWS, AI & ML.
- CTAs: Request a Demo, Talk to an Expert, Explore Live Demo, Chat on WhatsApp, Request a Call Back, Pricing.
- Social: Facebook, X, LinkedIn, Instagram, YouTube (all `srdvtech`).

## Gaps we can beat
No testimonials, no case studies, no named team, inconsistent numbers (API counts differ between pages), and the AI features are mostly roadmap.
