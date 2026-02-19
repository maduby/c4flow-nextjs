# Sanity Rules Reference

Detailed rules for GROQ performance, schema design, Visual Editing, images, Portable Text, page builders, Studio configuration, TypeGen, localization, and migrations. Based on the [Sanity Agent Toolkit](https://github.com/sanity-io/agent-toolkit).

---

## GROQ Performance (Critical)

### Optimizable Filters

GROQ uses indexes for optimizable filters. Non-optimizable filters scan ALL documents.

| Pattern | Optimizable | Example |
|---------|-------------|---------|
| `_type == "x"` | Yes | `*[_type == "post"]` |
| `_id == "x"` | Yes | `*[_id == "abc123"]` |
| `slug.current == $slug` | Yes | `*[slug.current == "hello"]` |
| `defined(field)` | Yes | `*[defined(publishedAt)]` |
| `references($id)` | Yes | `*[references("author-123")]` |
| `field->attr == x` | No | Resolves reference for every doc |
| `fieldA < fieldB` | No | Compares two attributes |

Always stack optimizable filters first to reduce the search space before non-optimizable ones.

### Avoid Joins in Filters

Reference resolution (`->`) in filters resolves for every document. Use `_ref` instead.

```groq
-- Bad: resolves reference for every post
*[_type == "post" && author->name == "Bob Woodward"]

-- Good: direct _ref comparison
*[_type == "post" && author._ref == "author-bob-woodward-id"]

-- If you need dynamic lookup, use a subquery
*[_type == "post" && author._ref in *[_type == "author" && name == "Bob Woodward"]._id]
```

### Cursor Pagination

For large result sets, use cursor-based pagination with `_id` ordering:

```groq
*[_type == "post" && _id > $lastId] | order(_id) [0...20]
```

### Order Before Slice

Always `order()` before slicing to ensure consistent results:

```groq
-- Bad: unpredictable order
*[_type == "post"][0...10]

-- Good: deterministic
*[_type == "post"] | order(publishedAt desc) [0...10]
```

### Always Project Fields

Never fetch entire documents. Explicit projections at every level:

```groq
*[_type == "post"]{
  _id, title, "slug": slug.current,
  author->{ name, "avatar": image.asset->url },
  categories[]->{ title, "slug": slug.current }
}
```

### Merge Referenced Data

Use spread operator to merge reference fields inline:

```groq
*[_type == "post"]{
  ...,
  "author": author->{ name, bio },
  "category": category->{ title }
}
```

### Always Use defineQuery

Wrap all GROQ in `defineQuery` for TypeGen:

```typescript
import { defineQuery } from "next-sanity"

const POST_QUERY = defineQuery(`*[_type == "post"]{ title, slug }`)
```

For syntax highlighting use `groq` tagged template or `/* groq */` comment prefix.

Query fragments via string interpolation:

```typescript
const imageFragment = /* groq */ `
  asset->{ _id, url, metadata { lqip, dimensions } }, alt
`
const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post"][0]{ title, mainImage { ${imageFragment} } }
`)
```

---

## Schema Design (High Impact)

### Model Data, Not Presentation

Field names describe meaning, not appearance.

| Bad (presentation) | Good (data) |
|---------------------|-------------|
| `bigHeroText` | `headline` |
| `redButton` | `primaryAction` |
| `leftSidebar` | `relatedContent` |
| `threeColumnRow` | `features` |
| `mobileImage` | `image` (with crops) |

### Always Use Define Helpers

`defineType`, `defineField`, `defineArrayMember` for type safety and autocompletion.

### Array Keys

Every array item must have a stable `_key`. Sanity generates these automatically, but if creating items programmatically, always include `_key`:

```typescript
{ _key: nanoid(), _type: 'block', ... }
```

### Validation

Add validation rules to enforce content quality:

```typescript
defineField({
  name: 'title',
  type: 'string',
  validation: (rule) => rule.required().min(10).max(100),
})
```

### References vs Objects

| Use Objects | Use References |
|-------------|----------------|
| Content unique to this document | Content reused across many documents |
| Simpler queries | Needs central management |
| Default choice | FAQs, testimonials, reusable CTAs |

### Safe Deprecation Pattern

**Never** delete fields with production data. Follow:

1. **Deprecate:** Add `deprecated`, `readOnly: true`, `hidden: ({value}) => value === undefined`
2. **Migrate:** Use `defineMigration` from `sanity/migrate`, always dry-run first
3. **Remove:** Only after verifying field is empty across all documents

```typescript
// Migration file: migrations/rename-field/index.ts
import { defineMigration, at, setIfMissing, unset } from 'sanity/migrate'

export default defineMigration({
  title: 'Rename oldTitle to newTitle',
  documentTypes: ['article'],
  filter: 'defined(oldTitle) && !defined(newTitle)',
  migrate: {
    document(doc) {
      return [
        at('newTitle', setIfMissing(doc.oldTitle)),
        at('oldTitle', unset())
      ]
    }
  }
})
```

Run: `sanity migration run <name>` (dry-run by default), then `--no-dry-run` when ready.

---

## Visual Editing (High Impact)

### Stega Cleaning

When Visual Editing is enabled, strings contain invisible Stega characters. Clean before logic:

| Scenario | Clean? |
|----------|--------|
| String comparisons (`if (x === 'y')`) | Yes |
| Object key lookups | Yes |
| HTML IDs | Yes |
| Third-party library input | Yes |
| Rendering text (`{title}`) | No |
| Passing to `<Image>` | No |
| Passing to image helpers | No |

```typescript
import { stegaClean } from "@sanity/client/stega"
// Or: import { stegaClean } from "next-sanity"
```

### SEO Metadata

**Never** let Stega leak into `<meta>` tags. Always fetch with `stega: false`:

```typescript
export async function generateMetadata({ params }) {
  const { data } = await sanityFetch({
    query: SEO_QUERY,
    params: await params,
    stega: false  // Critical for SEO
  })
  return { title: data?.title }
}
```

### Presentation Tool Setup

Configure `studioUrl` in `sanity.config.ts` for the Presentation Tool. Wire up `VisualEditing` in root layout.

---

## Images (High Impact)

### Always Enable Hotspots

```typescript
defineField({
  name: 'mainImage',
  type: 'image',
  options: { hotspot: true }
})
```

### Query LQIP for Blur Placeholders

```groq
mainImage {
  asset->{ _id, url, metadata { lqip, dimensions } },
  alt, hotspot, crop
}
```

### URL Builder

```typescript
import { urlFor } from '@/sanity/lib/image'

const imageUrl = urlFor(mainImage)
  .width(800)
  .height(600)
  .fit('crop')     // Respects hotspot
  .url()
```

---

## Portable Text (High Impact)

### Define Typed Components

Always create a typed `components` object:

```typescript
import { PortableText, PortableTextComponents } from "next-sanity"

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
  },
  types: {
    image: ({ value }) => <SanityImage value={value} />,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value.href} rel={!value.href?.startsWith("/") ? "noreferrer noopener" : undefined}>
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-6">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-6">{children}</ol>,
  },
}
```

| Type | Examples | Access Pattern |
|------|----------|----------------|
| `block` | h1, h2, blockquote | `{ children }` |
| `types` | image, video, CTA | `{ value }` |
| `marks` | link, strong | `{ children, value }` |
| `list` | bullet, number | `{ children }` |

---

## Page Builder (Medium Impact)

### Objects vs References

Default to objects. Only use references for truly shared content.

### Block Previews

Add `preview` config for better editor experience:

```typescript
defineType({
  name: 'hero',
  type: 'object',
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Hero', media })
  },
  fields: [/* ... */]
})
```

---

## Studio Configuration (Medium Impact)

### Singletons via Structure

No `singleton: true` option. Use fixed `documentId` in Structure:

```typescript
S.listItem().title('Settings').child(
  S.document().schemaType('settings').documentId('settings')
)
```

### Icons

Use `@sanity/icons` for consistent icons:

```typescript
import { CogIcon, DocumentTextIcon } from '@sanity/icons'
```

---

## TypeGen Workflow (Medium Impact)

### Setup

```json
// package.json
{ "scripts": { "typegen": "sanity schema extract --path=./schema.json && sanity typegen generate" } }
```

```json
// sanity-typegen.json
{ "path": "./src/**/*.{ts,tsx}", "schema": "./schema.json", "generates": "./src/sanity/types.ts" }
```

### Workflow

1. Modify schema or queries
2. Run `npm run typegen`
3. Restart TS Server if types don't update

---

## Localization (Medium Impact)

### Document-Level vs Field-Level

| Approach | Best For |
|----------|----------|
| **Document-level** (separate docs per locale) | Fully translated content, different structures per locale |
| **Field-level** (localized fields in one doc) | Small number of translatable fields, simpler setup |

---

## Migration (Low-Medium Impact)

### HTML/Markdown Import

Use `sanity/migrate` with `htmlToBlocks` or `markdownToBlocks` for rich text conversion. Always validate imported content against schema.

### General Migration Rules

- Use `defineMigration` from `sanity/migrate` — never raw client patches
- Use idempotent filter patterns (e.g., `defined(oldField) && !defined(newField)`)
- Always dry-run first
- Back up data before running migrations
