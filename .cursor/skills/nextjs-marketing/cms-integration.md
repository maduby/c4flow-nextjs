# CMS Integration

Patterns for integrating Sanity or Payload as a headless CMS with Next.js App Router.

## Sanity

### Setup

```bash
npm install next-sanity @sanity/image-url
```

### Client Configuration

```ts
// lib/cms/client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
```

### Type-Safe Queries with GROQ

```ts
// lib/cms/queries.ts
import { client } from './client'

export async function getAllPosts() {
  return client.fetch<Post[]>(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      "author": author->{ name, image },
      mainImage
    }`
  )
}

export async function getPostBySlug(slug: string) {
  return client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      body,
      publishedAt,
      "author": author->{ name, image },
      mainImage,
      seo { title, description }
    }`,
    { slug }
  )
}

export async function getPageBySlug(slug: string) {
  return client.fetch<Page | null>(
    `*[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      sections[] {
        _type,
        ...
      },
      seo { title, description }
    }`,
    { slug }
  )
}
```

### Sanity Image Helper

```ts
// lib/cms/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

Usage in components:

```tsx
import Image from 'next/image'
import { urlFor } from '@/lib/cms/image'

<Image
  src={urlFor(post.mainImage).width(1200).height(630).url()}
  alt={post.mainImage.alt ?? post.title}
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

### Sanity Draft Mode (Preview)

```ts
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  (await draftMode()).enable()
  redirect(slug ?? '/')
}
```

### Sanity Webhook Revalidation

Configure in Sanity: Settings > API > Webhooks

```
URL: https://yourdomain.com/api/revalidate
Method: POST
Headers: x-revalidate-secret: your-secret
Trigger on: Create, Update, Delete
Filter: _type in ["post", "page"]
```

### Sanity Environment Variables

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-read-token        # Server-only
SANITY_PREVIEW_SECRET=your-preview-secret # Server-only
```

---

## Payload CMS

### Setup (Self-Hosted or Payload Cloud)

```bash
npm install payload @payloadcms/richtext-lexical
```

Payload 3+ runs as a Next.js plugin, embedding the admin panel in your app.

### Payload Configuration

```ts
// payload.config.ts
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    {
      slug: 'pages',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'content', type: 'richText' },
        {
          name: 'seo',
          type: 'group',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    {
      slug: 'posts',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'excerpt', type: 'textarea' },
        { name: 'content', type: 'richText' },
        { name: 'publishedAt', type: 'date' },
        { name: 'featuredImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'public/media',
        mimeTypes: ['image/*'],
      },
      fields: [
        { name: 'alt', type: 'text', required: true },
      ],
    },
  ],
})
```

### Fetching Data from Payload

Payload provides a Local API that runs server-side with no HTTP overhead:

```ts
// lib/cms/client.ts
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getAllPosts() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: 50,
  })
  return docs
}

export async function getPostBySlug(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}
```

### Payload with Static Export

When using `output: 'export'`, Payload admin panel won't work in the exported build. Options:

1. **Separate admin**: Run Payload admin on a subdomain (admin.yourdomain.com) or Payload Cloud
2. **API-only**: Use Payload's REST API from a separate deployment
3. **Build-time only**: Use Local API during `npm run build`, not at runtime

### Payload Environment Variables

```bash
PAYLOAD_SECRET=your-payload-secret
DATABASE_URI=mongodb://localhost/c4flow  # or postgres connection string
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## Shared Patterns (Both CMS Options)

### Static Generation with CMS Data

```tsx
// app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/cms/client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Render content */}
    </article>
  )
}
```

### CMS Type Definitions

```ts
// lib/cms/types.ts
export interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  body?: unknown // Rich text content
  publishedAt: string
  author?: { name: string; image?: unknown }
  mainImage?: unknown
  seo?: { title?: string; description?: string }
}

export interface Page {
  _id: string
  title: string
  slug: string
  sections?: unknown[]
  seo?: { title?: string; description?: string }
}
```

### Content Rendering

For rich text from either CMS, use a dedicated render component:

```tsx
// components/shared/rich-text.tsx
// For Sanity: use @portabletext/react
// For Payload: use Payload's built-in Lexical renderer

import { PortableText } from '@portabletext/react'

export function RichText({ content }: { content: unknown }) {
  return <PortableText value={content as any} />
}
```

## Choosing Between Sanity and Payload

| Criteria | Sanity | Payload |
|----------|--------|---------|
| Hosting | Managed (Sanity.io) | Self-hosted or Payload Cloud |
| Data fetching | GROQ / GraphQL over HTTP | Local API (zero HTTP overhead) |
| Admin panel | Hosted separately (Sanity Studio) | Embedded in Next.js app |
| Static export compat | Excellent (API-only) | Needs separate admin deployment |
| Free tier | Generous | Open source (free self-hosted) |
| Complexity | Lower setup | More control, more setup |

**Recommendation for Hostinger**: Sanity is simpler for static export. Payload is better if using VPS with full Next.js server.
