# Changelog

All notable changes to the C-4 Flow website are documented here.

---

## 2026-02-20

### Features

- **Rich Text for Hero & CTA** — Hero body text and CTA subtitle are now Portable Text in Sanity, allowing editors to add bold, italic, and links (e.g. linking "FAQs" or "Contact Us"). Existing plain text content renders unchanged. (`88f28b7`)
- **Headline Color Picker** — Editors can choose a custom color for the hero headline directly in Sanity Studio using a color picker with brand presets. (`838b478`)
- **Responsive Image Ratios** — Hero images support mobile/tablet/desktop aspect ratio overrides (square, 4:3, 3:4, 16:9) configurable per-page in Sanity. Desktop ratios are skipped for the Split Hero variant due to absolute positioning. (`838b478`, `f4ed8bc`)
- **Desktop Columns for Classes Grid** — New "Desktop Columns" field (2/3/4 per row) on the Classes Section in Sanity Studio so editors can control the grid layout. Defaults to 4. (`48ac553`)
- **ACME Challenge Route** — Added `/.well-known/acme-challenge/[token]` API route for Let's Encrypt SSL certificate verification on Hostinger. (`c5845b0`)

### Fixes

- **Hydration Mismatch** — Replaced `Intl.NumberFormat("en-ZA")` with a deterministic regex-based currency formatter. Node.js and browsers produced different Unicode space characters, causing React hydration errors on pricing sections. (`a9b7516`)
- **ScrollToTop & Hash Navigation** — Custom `ScrollToTop` component now respects URL hash fragments (e.g. `/contact#faqs` scrolls to the FAQs section). Kept the custom component because Next.js built-in scroll skips sticky/fixed elements (header + banner), leaving pages slightly offset. (`2ce8e3f`, `c5233dd`)
- **Mobile UI Polish** — Info icon in Classes Section stacks vertically for better balance; announcement banner has extra right padding to avoid text/close-button overlap; more vertical space before first class detail card. (`838b478`)

### Refactoring

- **Hero Section** — Broke the 251-line monolith into `CenteredHero`, `SplitHero`, and `GradientHeroClient` sub-components under `src/components/sections/hero/`. The main `HeroSection.tsx` is now a thin dispatcher (~45 lines). Inline hex colors replaced with `plum-*` design tokens. (`838b478`)
- **Shared Utilities** — Created `blurProps()` helper in `src/sanity/lib/image.ts` to DRY up `next/image` blur placeholder logic across 7 files. Created `HeroCta` button component for consistent hero CTA styling. (`838b478`)
- **Quiet Fetch Logs** — Disabled verbose Sanity API URL logging in dev terminal (`fullUrl: false`). (`48ac553`)

### Infrastructure & Onboarding

- **Cursor Agent Setup** — Added `.cursor/rules/` (project, components, sanity, tailwind) and `.cursor/skills/` to Git for team onboarding. Created `mcp.json.example` with placeholder tokens. Updated `.gitignore` to track rules/skills but exclude `mcp.json`. (`5f31d1b`)
- **Preview & Staging Branches** — Created `preview` and `staging` branches matching `main` for deployment pipeline testing.

---

## Migration Notes

### Rich Text Fields (Hero body, CTA subtitle)

The Sanity schema changed these fields from `text` to `array` (Portable Text). **No data migration is needed** — the frontend components check if the value is a string or array and render accordingly. New content saved in Studio will use rich text; old plain text strings continue to work.

### Desktop Columns (Classes Section)

New optional field — defaults to 4 if unset. No migration required.

### Headline Color & Image Ratios

New optional fields on the Hero schema. No migration required — unset values fall back to existing defaults.
