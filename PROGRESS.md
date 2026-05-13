# C4 Flow — Migration Plan & Progress

## Context

The site is migrating away from Setmore (broken booking platform) toward Wix Bookings.
During the transition, all "Book Now" buttons direct visitors to WhatsApp to contact
Cattleya directly. Wix booking links will replace these once the Wix site has its own
custom domain and is ready.

---

## Phase 1 — Remove Setmore, contact-to-book interim (current)

**Goal:** No Setmore links anywhere on the site. All booking CTAs direct to WhatsApp.

| Task | Status |
|------|--------|
| Create feature branch `fix/remove-setmore-links` | ✅ |
| Update `SITE_CONFIG.booking` in `constants.ts` to WhatsApp | ✅ |
| Replace hardcoded Setmore links in `Header.tsx` (desktop + mobile) | ✅ |
| Update booking note in `ClassesSection.tsx` | ✅ |
| Update booking description in `classes/[classSlug]/page.tsx` | ✅ |
| Clean up Setmore-specific logic in `seo.ts` | ✅ |
| Update Sanity schema help text (siteSettings, danceClass, instructor) | ✅ |
| **Sanity CMS content** — update `bookingUrl` field in Site Settings to WhatsApp URL | ⬜ (manual) |
| **Sanity CMS content** — clear per-class booking URLs (or set to WhatsApp) | ⬜ (manual) |

**WhatsApp URL used as interim booking link:**
`https://wa.me/27653917901?text=Hey%2C%20I%27m%20interested%20in%20booking%20a%20class%20with%20you!`

---

## Phase 2 — Wire Wix booking URLs

**Goal:** Replace WhatsApp interim links with direct Wix Bookings URLs per class.

Once Wix is on the custom domain (`www.c4flow.co.za` or subdomain):

1. Update `SITE_CONFIG.booking.url` in `constants.ts` to main Wix booking landing page.
2. In Sanity Studio → Site Settings → set `Booking Platform URL` to Wix main URL.
3. In Sanity Studio → each Dance Class → set `Booking Link` to the Wix per-class URL:
   - Private Dance Session → Wix booking URL
   - Heels & Queens → Wix booking URL
   - Spinning Goddess → Wix booking URL
   - Exotic Baddies → Wix booking URL
   - Dynamic Static → Wix booking URL
   - Stretching & Flexibility → Wix booking URL
   - Free Play → Wix booking URL
4. Update `Header.tsx` to accept `bookingUrl` prop from Sanity Site Settings (Phase 3 fix).

---

## Phase 3 — Code quality fixes (from code review)

These do not affect user-facing content but reduce technical debt:

| Task | Priority | Notes |
|------|----------|-------|
| Fix `GoogleAnalytics.tsx` hardcoded GA ID | HIGH | Read from `NEXT_PUBLIC_GA_ID` env var |
| Fix `sitemap.ts` creating its own Sanity client | HIGH | Import shared `@/sanity/lib/client` |
| Fix `Header.tsx` to accept `bookingUrl` prop from layout | MEDIUM | Threaded from site settings |
| Fix `PageBuilder.tsx` default case (visible "Unknown section" text) | MEDIUM | Return `null` in prod |
| Fix `Footer.tsx` hardcoded Instagram handle and Maps URLs | LOW | Derive from props |
| Replace `as never` type casts with `sanity typegen` | LOW | Proper TypeScript types |

---

## Wix vs Sanity — Decision Log

**Current decision:** Keep Sanity for all content. Use Wix only for bookings/payments.

**Rationale:**
- Sanity's PageBuilder has 14+ composable section types with no Wix equivalent
- Sanity handles LQIP blur placeholders, draft mode, and ISR — Wix cannot
- Wix Bookings API can power classes/pricing in `catalog.ts` (Phase 4 if desired)
- Risk of full migration is high; cost of keeping both is low

**Wix site:** `cattleyacapetown.wixsite.com/c4-flow` (no custom domain yet)  
**Known Wix site issues to fix (no code needed):**
- Footer placeholder phone (`123-456-7890`), email (`info@mysite.com`)
- All 4 social links point to Wix corporate accounts (not C4 Flow)
- Copyright year shows `© 2035`
