# Phase 1: Project Scaffolding

**Date:** 2026-02-17
**Status:** Complete

## What Was Done

- Scaffolded Next.js 16.1.6 app with TypeScript, Tailwind CSS v4, ESLint, App Router, `src/` directory
- Installed all dependencies:
  - Core: next, react 19, react-dom 19
  - CMS: next-sanity, sanity, @sanity/image-url, @sanity/vision, @portabletext/react
  - UI: framer-motion, lucide-react, yet-another-react-lightbox
  - Forms: react-hook-form, @hookform/resolvers, zod
  - Email: resend
  - Utils: clsx, tailwind-merge
- Configured Tailwind with C4 Flow design system (colors, fonts, breakpoints, shadows)
- Set up Google Fonts: Montserrat (400, 500, 700) + Mynerve (400) via next/font
- Created project directory structure (components, sanity, lib, docs)
- Set up `.env.example` and `.env.local` with Sanity project ID and dataset
- Configured `next.config.ts` with `output: 'standalone'` and Sanity CDN remote patterns
- Created utility functions: `cn()` for class merging, `formatCurrency()` for ZAR
- Created `constants.ts` with site config, nav links, social links, booking info
- Updated `.gitignore` to protect `.cursor/` and `.env*` files
- Created placeholder homepage with C4 Flow branding
- Created README.md with project overview
- Moved website analysis docs to `docs/analysis/`

## Decisions Made

- Using `output: 'standalone'` for Hostinger Node.js deployment (full ISR + server features)
- Embedded Sanity Studio at `/studio` route (unified deployment)
- Mynerve for headings, Montserrat for body text (matching original site)
- Main breakpoint at 920px (matching original site)
- Using `next-sanity` v11+ with `defineLive` for real-time content
- Contact form: Resend for email delivery + Sanity for storage

## Next Steps

- Phase 2: Sanity schema design and Studio setup
