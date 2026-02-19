---
name: nextjs-marketing
description: Guides Next.js development for a marketing website using App Router, TypeScript, Tailwind CSS, headless CMS (Sanity or Payload), and self-hosted deployment on Hostinger. Use when creating pages, components, routes, layouts, CMS integration, SEO metadata, image optimization, static export, or deployment configuration for this project.
---

# Next.js Marketing Website

Build a performant, SEO-optimized marketing website using Next.js App Router with TypeScript, Tailwind CSS, and a headless CMS. Deploy to Hostinger via static export or Node.js hosting.

## Tech Stack

- **Next.js 15+** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (utility-first styling)
- **Headless CMS**: Sanity or Payload (to be finalized)
- **Hosting**: Hostinger (VPS or static hosting)

## Project Structure

```
app/
├── layout.tsx              # Root layout with fonts, metadata, analytics
├── page.tsx                # Homepage
├── loading.tsx             # Global loading skeleton
├── error.tsx               # Global error boundary
├── not-found.tsx           # Custom 404
├── sitemap.ts              # Dynamic sitemap generation
├── robots.ts               # Robots.txt configuration
├── opengraph-image.tsx     # Default OG image
├── (marketing)/            # Route group for marketing pages
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── contact/page.tsx
│   └── pricing/page.tsx
├── blog/
│   ├── page.tsx            # Blog listing
│   └── [slug]/
│       ├── page.tsx        # Blog post (SSG with generateStaticParams)
│       └── opengraph-image.tsx
├── api/
│   ├── health/route.ts     # Health check endpoint
│   ├── revalidate/route.ts # On-demand revalidation webhook
│   └── draft/route.ts      # CMS preview/draft mode
lib/
├── cms/                    # CMS client and queries
│   ├── client.ts
│   ├── queries.ts
│   └── types.ts
├── utils.ts                # cn() helper, formatting utilities
└── constants.ts            # Site config, navigation, social links
components/
├── ui/                     # Shadcn/Radix primitives
├── layout/                 # Header, Footer, Navigation
├── sections/               # Hero, CTA, Features, Testimonials
└── shared/                 # Reusable: Button, Card, Image wrapper
public/
├── fonts/                  # Self-hosted fonts
├── images/                 # Static images
└── favicon.ico
```

## Core Principles

### Server Components First

Default to Server Components. Only add `'use client'` for interactive elements (modals, forms, carousels, mobile nav toggles).

### Static Generation for Marketing Pages

Use `generateStaticParams` for all CMS-driven pages. Marketing pages should be statically generated at build time for maximum performance.

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### ISR for Content Freshness

Use Incremental Static Regeneration for pages that update via CMS:

```tsx
export const revalidate = 3600 // Revalidate every hour
```

Combine with on-demand revalidation via CMS webhooks for instant updates.

### SEO as a First-Class Concern

Every page must export metadata. Use title templates in root layout:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: { default: 'C4Flow', template: '%s | C4Flow' },
  description: 'Your site description',
  metadataBase: new URL('https://yourdomain.com'),
}
```

### Image Optimization

Always use `next/image`. For Hostinger static export, use `unoptimized: true` or a custom loader (Cloudinary, Imgix). For Node.js hosting, built-in optimization works.

```tsx
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority  // For above-the-fold (LCP) images
  sizes="100vw"
/>
```

## Deployment Strategy

Two options depending on Hostinger plan:

**Option A: Static Export** (simpler, works with basic hosting)
- Set `output: 'export'` in `next.config.ts`
- Upload `out/` directory to Hostinger
- No server-side features (ISR, middleware, image optimization)
- Rebuild and redeploy on CMS content changes via webhook

**Option B: Node.js on VPS** (full Next.js features)
- Use `output: 'standalone'` in `next.config.ts`
- Deploy via Docker or PM2 on Hostinger VPS
- Full ISR, middleware, and image optimization support

For detailed deployment instructions, see [hosting-deployment.md](hosting-deployment.md).

## CMS Integration

Both Sanity and Payload support headless operation with Next.js:

- Fetch content in Server Components (no API layer needed)
- Use `generateStaticParams` for static paths
- Set up webhook-based revalidation for content updates
- Implement draft/preview mode for editors

For detailed CMS setup, see [cms-integration.md](cms-integration.md).

## Key Rules

### RSC Boundaries

- Never use `async` in `'use client'` components
- Only pass serializable props to client components (no Date, Map, Set, functions)
- Server Actions (`'use server'`) are the exception: they can be passed to client components
- Serialize dates with `.toISOString()` before passing to client

### Data Fetching

- **Reads**: Fetch directly in Server Components (preferred) or Route Handlers
- **Mutations**: Use Server Actions with `'use server'`
- **Avoid waterfalls**: Use `Promise.all()` for parallel fetches or Suspense boundaries
- **Cache**: Use React `cache()` when same data is needed in metadata and page

### Error Handling

- Place `error.tsx` (client component) in route segments for error boundaries
- `global-error.tsx` catches root layout errors (must include `<html>` and `<body>`)
- Never wrap `redirect()`, `notFound()`, `forbidden()` in try-catch
- Use `unstable_rethrow()` if navigation APIs are inside catch blocks

### Performance

- Use `priority` on LCP images (hero, above-the-fold)
- Add `sizes` attribute to responsive images
- Use `loading.tsx` for route-level loading states
- Implement Suspense boundaries for streaming
- Self-host fonts via `next/font` for zero layout shift

### Accessibility

- Semantic HTML structure with proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigation for all interactive components
- Color contrast meeting WCAG AA standards
- Focus management on route transitions

## Additional Resources

- For detailed Next.js patterns (RSC, async APIs, file conventions), see [nextjs-patterns.md](nextjs-patterns.md)
- For CMS integration details, see [cms-integration.md](cms-integration.md)
- For Hostinger deployment, see [hosting-deployment.md](hosting-deployment.md)
