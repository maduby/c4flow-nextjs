# C4 Flow — Claude Code Guide

Marketing website and embedded CMS for C4 Flow, a pole and exotic dance studio in Cape Town.
Built on Next.js 16 App Router, Sanity, Tailwind CSS v4, and deployed to Vercel.

---

## Dev Commands

```bash
npm run dev      # local dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

Sanity Studio is embedded at `/admin` — runs inside the same Next.js app, no separate process needed.

---

## Architecture

### Data Layer — `src/lib/catalog.ts`

The single source of truth for all content. `getKnowledgeBase()` makes one batched GROQ query
to Sanity and returns a fully-typed `KnowledgeBase` object covering site settings, pages,
classes, bundles, schedule, and pricing.

It is wrapped in React `cache()`, which deduplicates calls within a single server request —
including across `generateMetadata` and the page component. This is per-request only: each
ISR revalidation or fresh page request triggers a new Sanity fetch.

**Always fetch through `getKnowledgeBase()` — never write ad-hoc Sanity queries in page
components.** If you need a single record (e.g. one class), use `getClassBySlug()` which
reads from the already-built knowledge base rather than hitting Sanity again.

### Content Queries — `src/sanity/lib/queries.ts`

GROQ queries used by `sanityFetch` (live/draft-mode-aware). These run in layouts and pages
that need Sanity Live support (real-time preview in the Studio). Keep queries here, not
inline in components.

### Structured Data — `src/lib/structured-data.ts`

All JSON-LD builders live here. Each builder accepts typed `KnowledgeBase` slices — never
raw Sanity data. Add new schema.org types here, keep page components clean.

### SEO helpers — `src/lib/seo.ts`

FAQ JSON-LD and link-rel helpers. Extend here rather than in components.

### Site Origin — `src/lib/site-origin.ts` + `src/lib/site-url.ts`

`getSiteOriginForMetadata()` returns the canonical origin (`https://www.c4flow.co.za`),
never a Vercel preview URL. Use this for all canonical links, sitemaps, and Open Graph URLs.
Do not use `process.env.NEXT_PUBLIC_SITE_URL` directly in metadata.

### CMS Schemas — `src/sanity/schemaTypes/`

- `documents/` — top-level Sanity documents (page, danceClass, siteSettings, etc.)
- `objects/` — section types that compose pages via PageBuilder
- `shared/` — reusable field groups (SEO fields, rich text)

---

## Key Patterns

### Page composition via PageBuilder

Pages are built from an array of section objects managed in Sanity. The `PageBuilder`
component (`src/components/sections/PageBuilder.tsx`) maps `_type` to the corresponding
section component. To add a new section type:

1. Create the Sanity schema in `src/sanity/schemaTypes/objects/`
2. Register it in `src/sanity/schemaTypes/index.ts`
3. Create the React component in `src/components/sections/`
4. Add the case to `PageBuilder.tsx`

### Knowledge feeds (AEO / machine-readable)

The site exposes machine-readable JSON and text feeds for AI/agent discoverability:

- `/knowledge.json` — full site knowledge base
- `/classes.json` — class catalog
- `/schedule.json` — weekly schedule
- `/pricing.json` — bundle pricing
- `/llms.txt` + `/llms-full.txt` — LLM-readable plain text

These are route handlers under `src/app/`. They all call `getKnowledgeBase()` — no
separate data fetching.

### Revalidation

Sanity webhooks hit `/api/revalidate`. The handler verifies the HMAC signature, then
calls `revalidatePath` for all affected routes. Tag-based revalidation (`revalidateTag`)
is also supported for next-sanity/live.

### Client-side analytics

`src/lib/analytics.ts` wraps GA4 event calls. Import tracking helpers from there — do
not call `window.gtag` directly in components.

### Currency formatting

Always use `formatCurrency()` and `formatPriceLabel()` from `src/lib/utils.ts`. Do **not**
use `Intl.NumberFormat` — it produces different Unicode space characters on Node vs the
browser, causing hydration mismatches.

---

## Conventions

- **No inline Sanity queries in page components** — use `catalog.ts` or `queries.ts`.
- **No direct `window.gtag` calls** — use `analytics.ts` helpers.
- **No `Intl.NumberFormat` for ZAR** — use `formatCurrency()`.
- **No `.vercel.app` URLs in metadata** — use `getSiteOriginForMetadata()`.
- **Booking links** always go through `BookNowLink` (`src/components/ui/BookNowLink.tsx`)
  so clicks are tracked via `TrackedCtaLink`.
- Tailwind v4 — no `tailwind.config.js`. CSS variables and theme tokens live in
  `src/app/globals.css`.
- All structured data (JSON-LD) built in `structured-data.ts`, injected via `JsonLd`
  component.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (`production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API date version |
| `SANITY_API_WRITE_TOKEN` | Write token — contact form submissions to Sanity |
| `SANITY_REVALIDATE_SECRET` | HMAC secret for webhook revalidation |
| `RESEND_API_KEY` | Transactional email (contact form) |
| `CONTACT_EMAIL` | Recipient(s) for contact form — comma-separated |
| `CONTACT_REPLY_TO` | Reply-to override (defaults to submitter's email) |
| `RESEND_FROM_ADDRESS` | Sender address for contact emails (e.g. `C4 Flow <noreply@mail.c4flow.co.za>`) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for contact form rate limiting (optional — skipped if absent) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token for rate limiting |
| `NEXT_PUBLIC_CANONICAL_SITE_URL` | Override canonical origin (must not be vercel.app) |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console meta tag |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |

---

## Sanity Configuration

- **Studio** — embedded at `/admin` (`src/app/admin/[[...tool]]/`)
- **Live content** — `sanityFetch` from `src/sanity/lib/live.ts` (draft-mode-aware)
- **Static fetches** — `client` from `src/sanity/lib/client.ts` (uses CDN in production)
- **Write operations** — use a fresh `createClient` with `SANITY_API_WRITE_TOKEN` (see contact route)

---

## Deployment

- Host: Vercel (under Marc's workspace)
- Canonical domain: `https://www.c4flow.co.za`
- Apex redirect: `c4flow.co.za` → `www.c4flow.co.za` (308, handled in middleware)
- Vercel preview URLs get `X-Robots-Tag: noindex` via middleware — they will not be indexed
