# Next.js Patterns Reference

Detailed patterns for Next.js App Router development. Based on [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills).

## File Conventions

### Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | UI for a route segment |
| `layout.tsx` | Shared UI for segment and children |
| `loading.tsx` | Loading UI (Suspense boundary) |
| `error.tsx` | Error UI (Error boundary, must be `'use client'`) |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint (cannot coexist with `page.tsx` in same segment) |
| `template.tsx` | Like layout but re-renders on navigation |
| `default.tsx` | Fallback for parallel routes |

### Route Segments

```
app/
├── blog/               # Static: /blog
├── [slug]/             # Dynamic: /:slug
├── [...slug]/          # Catch-all: /a/b/c
├── [[...slug]]/        # Optional catch-all: / or /a/b/c
├── (marketing)/        # Route group (no URL impact)
└── _components/        # Private folder (not a route)
```

### Middleware (v14-15) / Proxy (v16+)

```ts
// middleware.ts (project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

## RSC Boundaries

### Rules

1. **Async client components are invalid.** Only Server Components can be async. Move data fetching to a parent Server Component and pass data as props.
2. **Props to client components must be serializable.** No functions (except Server Actions), no Date objects, no Map/Set/class instances.
3. **Server Actions are the exception.** Functions marked `'use server'` can be passed to client components.

### Common Fixes

```tsx
// Date: serialize to string
<ClientComponent date={post.createdAt.toISOString()} />

// Map/Set: convert to object/array
<ClientComponent items={Object.fromEntries(map)} />

// Functions: define inside client component or use Server Action
```

## Async APIs (Next.js 15+)

`params`, `searchParams`, `cookies()`, and `headers()` are now async:

```tsx
// Page component
type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <div>{slug}</div>
}

// Cookies
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
}
```

## Data Fetching Decision Tree

| Need | Pattern |
|------|---------|
| Read data in Server Component | Fetch directly (no API needed) |
| Mutation from UI | Server Action (`'use server'`) |
| External API / webhook | Route Handler (`route.ts`) |
| Client Component needs data | Pass from Server Component parent |

### Avoiding Waterfalls

```tsx
// Parallel fetching
const [posts, categories] = await Promise.all([
  getPosts(),
  getCategories(),
])

// Streaming with Suspense
<Suspense fallback={<Skeleton />}>
  <PostsSection />
</Suspense>
```

### Preload Pattern

```ts
import { cache } from 'react'

export const getPost = cache(async (slug: string) => {
  return await fetchPost(slug)
})

export const preloadPost = (slug: string) => {
  void getPost(slug) // Fire and forget
}
```

## Metadata

### Static

```tsx
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description for search engines',
}
```

### Dynamic

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return { title: post.title, description: post.description }
}
```

### Title Template (Root Layout)

```tsx
export const metadata: Metadata = {
  title: { default: 'Site Name', template: '%s | Site Name' },
}
```

### Viewport (Separate Export)

```tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}
```

### File-Based Metadata

Place in `app/` or route segments:

| File | Purpose |
|------|---------|
| `favicon.ico` | Favicon |
| `opengraph-image.png/.tsx` | OG image (static or dynamic) |
| `sitemap.ts` | Dynamic sitemap |
| `robots.ts` | Robots directives |

### Sitemap Generation

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const postUrls = posts.map((post) => ({
    url: `https://yourdomain.com/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: 'https://yourdomain.com', changeFrequency: 'daily', priority: 1 },
    { url: 'https://yourdomain.com/about', changeFrequency: 'monthly', priority: 0.8 },
    ...postUrls,
  ]
}
```

### Robots.ts

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

## Image Optimization

### Always Use next/image

```tsx
import Image from 'next/image'

// Local images (dimensions inferred)
import hero from './hero.png'
<Image src={hero} alt="Hero" placeholder="blur" />

// Remote images (dimensions required)
<Image src="https://cdn.example.com/photo.jpg" alt="Photo" width={800} height={400} />

// Fill mode (parent must be position: relative)
<div className="relative h-96 w-full">
  <Image src="/hero.jpg" alt="Hero" fill sizes="100vw" className="object-cover" />
</div>
```

### Key Props

| Prop | When |
|------|------|
| `priority` | Above-the-fold / LCP images |
| `sizes` | Always with `fill`, or responsive images |
| `placeholder="blur"` | Local images for smooth loading |
| `unoptimized` | Static export without custom loader |

### Static Export Image Strategy

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
```

Or use a custom loader for a CDN like Cloudinary:

```ts
// lib/image-loader.ts
export default function cloudinaryLoader({
  src, width, quality
}: { src: string; width: number; quality?: number }) {
  return `https://res.cloudinary.com/your-cloud/image/upload/w_${width},q_${quality || 'auto'}/${src}`
}
```

## Error Handling

### Error Boundaries

```tsx
// app/error.tsx (must be 'use client')
'use client'

export default function Error({
  error, reset
}: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Navigation API Safety

Never wrap these in try-catch: `redirect()`, `permanentRedirect()`, `notFound()`, `forbidden()`, `unauthorized()`.

```tsx
// Correct pattern
let post
try {
  post = await getPost(slug)
} catch (error) {
  return { error: 'Failed to load post' }
}
if (!post) notFound() // Outside try-catch
```

If unavoidable, use `unstable_rethrow()`:

```tsx
import { unstable_rethrow } from 'next/navigation'

try {
  redirect('/success')
} catch (error) {
  unstable_rethrow(error)
  return { error: 'Something went wrong' }
}
```

## Font Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

Tailwind integration:

```ts
// tailwind.config.ts
theme: {
  fontFamily: {
    sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  },
}
```

## Scripts and Analytics

```tsx
import Script from 'next/script'

// Google Analytics
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
  strategy="afterInteractive"
/>
<Script id="gtag-init" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXX');`}
</Script>
```
