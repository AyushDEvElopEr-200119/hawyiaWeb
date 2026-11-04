# Hawyia — company website

Marketing site for Hawyia, a software, automation and AI company with ready-made business and travel platforms, in English and Arabic. Built with Next.js (App Router), React and TypeScript, with GSAP and Lenis for motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:5178
npm run build      # production build (every page is pre-rendered as static HTML)
npm start          # serve the production build
```

Photos and videos are committed in `public/assets/media`. To re-download them (or add new ones), list them in `lib/media.ts` and run `npm run media`.

## Where things live

| Path | What it is |
|---|---|
| `lib/site.ts` | Company details (email, phone, domain) and navigation |
| `lib/content.ts` | Copy for solution, service and API pages, industries, FAQ |
| `lib/home.ts` | Homepage copy |
| `lib/media.ts` | Photo and video manifest (Unsplash / Pexels licences) |
| `lib/legal.ts` | Starter legal text (have it reviewed before launch) |
| `app/` | Routes. `solutions/[slug]`, `custom-development/[slug]` and `api-integrations/[slug]` are generated from `lib/content.ts` |
| `components/` | Header, footer, page sections, photos |
| `components/motion/initSite.ts` | All motion and interactions (GSAP, ScrollTrigger, Flip, Lenis). Runs after every route change and cleans up before the next |
| `app/globals.css` | Styles |

## Before launch

- Fill in real contact details and the domain in `lib/site.ts`.
- Add "starting from" prices in `app/pricing/page.tsx`.
- Connect the enquiry forms: pass an `endpoint` to `<LeadForm>` (CRM or email service). Without one, forms open a pre-filled email.
- Have the legal pages reviewed.

## Notes for developers

- Pinned scroll sections must sit **inside** a page's top-level `<section>`, never be one. GSAP wraps pinned elements in a spacer, and React needs each top-level section to still be a direct child of `<main>` when it swaps pages. Development builds warn if this rule is broken.
- Markup is rendered by React; `initSite` only animates and wires behaviour, so it never creates or replaces React-owned DOM.

See `docs/website-plan.md` for the business model, sitemap and content plan.

## Languages

English lives at bare URLs (`/about/`) and Arabic under `/ar/` (`/ar/about/`). Pages are written in English under `app/[lang]/`; `next.config.ts` rewrites bare URLs to `/en/...`, and `/en/...` redirects back to the bare URL.

- `lib/i18n/ar.json` maps each English string to its Arabic translation. A string with no entry shows in English.
- A custom JSX runtime (`lib/i18n/jsx`) swaps text and internal links on Arabic pages, so components stay in English. Client components don't get translations from it, so pass them translated text as props.
- `npm run i18n:missing` builds the site and lists every string the Arabic pages render without a translation. Brand and technology names are expected there.
- The stylesheet uses logical properties (`margin-inline-start`, not `margin-left`) so the layout mirrors by itself. Keep new rules logical; what doesn't mirror on its own is at the end of `app/globals.css`.
