# Elyra — company website

Marketing site for Elyra, a B2B travel technology company (white-label and custom travel booking software, travel API integrations).

## Static site (current)

Pages are generated from shared templates into `dist/`.

```bash
npm install
npm run media   # download photos and videos listed in src/media.mjs (first time only)
npm run dev     # build and serve at http://localhost:5178
```

- `src/site.mjs` — company details and navigation
- `src/content.mjs` — page copy
- `src/media.mjs` — photo and video manifest (Unsplash / Pexels licences)
- `src/layout.mjs`, `src/pages.mjs` — templates
- `src/assets/` — CSS, JS (GSAP, Lenis) and media

See `docs/website-plan.md` for the business model, sitemap and content plan.
