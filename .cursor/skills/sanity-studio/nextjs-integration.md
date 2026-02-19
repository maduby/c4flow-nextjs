# Next.js + Sanity Integration

Patterns for integrating Sanity with Next.js App Router in the C4 Flow project. Based on `next-sanity` v11+ and the Live Content API.

---

## Architecture

### Embedded Studio (Recommended)

Studio lives inside the Next.js app at `/app/studio/[[...tool]]/page.tsx`. Unified deployment, simpler setup.

```
app/
├── studio/[[...tool]]/page.tsx   # Embedded Sanity Studio
src/
├── sanity/
│   ├── lib/
│   │   ├── client.ts             # Sanity client
│   │   ├── live.ts               # defineLive setup
│   │   ├── image.ts              # urlFor helper
│   │   └── token.ts              # Token helper
│   ├── schemaTypes/              # Schema definitions
│   └── types.ts                  # Generated TypeGen types
sanity.config.ts                  # Studio configuration
sanity-typegen.json               # TypeGen configuration
```

### Monorepo (Alternative)

Separate `apps/studio/` and `apps/web/` folders. Add Next.js URL to CORS origins in Sanity project settings.

---

## Data Fetching: Live Content API

Use `defineLive` for real-time content updates and Visual Editing.

### Setup

```typescript
// src/sanity/lib/live.ts
import { defineLive } from 'next-sanity'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: 'v2024-08-01' }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})
```

### Root Layout

Render `<SanityLive />` and `<VisualEditing />` in root layout:

```typescript
// src/app/layout.tsx
import { SanityLive } from '@/sanity/lib/live'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  )
}
```

---

## Caching & Revalidation

### Default: Live Content API

`defineLive` handles caching and invalidation automatically. Only implement manual caching for fine-grained control.

| Scenario | Approach |
|----------|----------|
| Real-time updates, Visual Editing | `defineLive` (default) |
| Static marketing pages | Time-based revalidation |
| Blog posts, frequent edits | Tag-based revalidation |
| Critical accuracy (prices) | Path-based + short revalidation |

### Tag-Based Revalidation

```typescript
// Tag your queries
const posts = await sanityFetch({
  query: POSTS_QUERY,
  tags: ['post', 'author', 'category'],
})

// API route for webhook
// src/app/api/revalidate/tag/route.ts
import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req) {
  const { isValidSignature, body } = await parseBody(
    req, process.env.SANITY_REVALIDATE_SECRET, true
  )
  if (!isValidSignature) return new Response('Invalid', { status: 401 })
  body.tags.forEach((tag) => revalidateTag(tag))
  return Response.json({ revalidated: body.tags })
}
```

Webhook projection: `{ "tags": [_type, _type + ":" + slug.current] }`

### CDN vs API

| Setting | Speed | Freshness | Use When |
|---------|-------|-----------|----------|
| `useCdn: true` | Fast | Brief delay | Default runtime fetches |
| `useCdn: false` | Slower | Guaranteed fresh | `generateStaticParams`, webhooks |

---

## Visual Editing & Stega

### SEO Metadata (Critical)

Never let Stega characters leak into `<meta>` tags:

```typescript
export async function generateMetadata({ params }) {
  const { data } = await sanityFetch({
    query: SEO_QUERY,
    params: await params,
    stega: false  // Critical
  })
  return { title: data?.title }
}
```

### Static Params

Fetch only published content, disable stega:

```typescript
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return data
}
```

### Stega Cleaning for Logic

```typescript
import { stegaClean } from "next-sanity"

const cleanAlign = stegaClean(align)
const className = cleanAlign === 'center' ? 'mx-auto' : ''
```

---

## Embedded Studio Setup

```typescript
// src/app/studio/[[...tool]]/page.tsx
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

---

## Draft Mode

```typescript
// src/app/api/draft-mode/enable/route.ts
import { client } from '@/sanity/lib/client'
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { token } from '@/sanity/lib/token'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
})
```

---

## Presentation Queries

For faster live editing, use `usePresentationQuery` to fetch only the block being edited:

```typescript
'use client'
import { usePresentationQuery } from 'next-sanity/hooks'

export function Hero({ _key, documentId, title, subtitle }) {
  const { data } = usePresentationQuery({
    query: HERO_PRESENTATION_QUERY,
    params: { documentId, blockKey: _key },
  })
  const blockData = data?.heroBlock || { title, subtitle }
  return <section><h1>{blockData.title}</h1></section>
}
```

Pass `documentId` from PageBuilder to each block component.

---

## Pagination

```typescript
const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]
  | order(date desc) [$start...$end] {
    _id, title, "slug": slug.current, date
  }
`)

const ARTICLES_COUNT_QUERY = defineQuery(`
  count(*[_type == "article" && defined(slug.current)])
`)
```

Use `Promise.all` to fetch articles and count in parallel.

---

## Error Handling

```typescript
import { notFound } from 'next/navigation'

export default async function PostPage({ params }) {
  const { data } = await sanityFetch({ query: POST_QUERY, params: await params })
  if (!data) notFound()
  return <Post data={data} />
}
```

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/missing token | Check `SANITY_API_READ_TOKEN` |
| 403 Forbidden | CORS not configured | Add URL to CORS origins |
| Query syntax error | Invalid GROQ | Test in Vision plugin first |
| Empty result | Wrong filter/params | Log params, check `_type` spelling |

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-08-01
SANITY_API_READ_TOKEN=sk...          # Server-only
SANITY_REVALIDATE_SECRET=your-secret # For webhooks
```

Never expose `SANITY_API_READ_TOKEN` in client code. Use `NEXT_PUBLIC_` prefix only for public values.

---

## Debug: Fetch Logging

```typescript
// next.config.ts
const nextConfig = {
  logging: { fetches: { fullUrl: true } },
}
```

Shows cache HIT/MISS status in console.
