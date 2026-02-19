---
name: sanity-studio
description: Sanity IO and Sanity Studio development best practices for the C4 Flow project. Covers GROQ query optimization, schema design, Visual Editing, Portable Text, page builders, images, Studio configuration, TypeGen, localization, and migrations. Integrated with Next.js App Router. Use when building, reviewing, or optimizing Sanity schemas, GROQ queries, Studio configuration, content models, or frontend Sanity integration.
---

# Sanity IO & Sanity Studio

Best practices for Sanity development in the C4 Flow project, based on the official [Sanity Agent Toolkit](https://github.com/sanity-io/agent-toolkit). Covers schema design, GROQ performance, Visual Editing, and Next.js integration.

## Quick Reference

| Priority | Category | Impact | Details |
|----------|----------|--------|---------|
| 1 | GROQ Performance | CRITICAL | Optimizable filters, avoid joins, projections |
| 2 | Schema Design | HIGH | Data over presentation, define helpers, validation |
| 3 | Visual Editing | HIGH | Stega cleaning, Presentation Tool, SEO metadata |
| 4 | Images | HIGH | Hotspots, LQIP, URL builder |
| 5 | Portable Text | HIGH | Typed components, custom blocks, marks |
| 6 | Page Builder | MEDIUM | Objects vs refs, block previews |
| 7 | Studio Config | MEDIUM | Singletons, structure, icons |
| 8 | TypeGen | MEDIUM | defineQuery, extract + generate workflow |
| 9 | Localization | MEDIUM | Document-level vs field-level i18n |
| 10 | Migration | LOW-MEDIUM | Safe deprecation, HTML import |

## CLI Commands

```bash
npx sanity@latest mcp configure  # Configure MCP for Cursor
npx sanity schema deploy         # Deploy schema to Content Lake
npx sanity schema extract        # Extract schema for TypeGen
npx sanity typegen generate      # Generate TypeScript types
npx sanity dev                   # Start Studio dev server
npx sanity build                 # Build Studio for production
npx sanity deploy                # Deploy Studio to Sanity hosting
```

## MCP Server

Add to `.cursor/mcp.json` for direct project access:

```json
{
  "mcpServers": {
    "Sanity": {
      "type": "http",
      "url": "https://mcp.sanity.io"
    }
  }
}
```

MCP tools: `query_documents`, `create_document_from_markdown`, `patch_document`, `deploy_schema`, `get_schema`, `transform_image`, `list_sanity_rules`, `get_sanity_rules`.

## Essential Rules

### 1. GROQ: Use Optimizable Filters First

Stack indexed filters first to avoid full dataset scans.

```groq
-- Bad: scans everything
*[salePrice < displayPrice]

-- Good: index-backed filter narrows first
*[_type == "product" && defined(salePrice) && salePrice < displayPrice]
```

**Optimizable patterns:** `_type == "x"`, `_id == "x"`, `slug.current == $slug`, `defined(field)`, `references($id)`.
**Not optimizable:** `field->attr == x`, `fieldA < fieldB`.

### 2. GROQ: Avoid Joins in Filters

Never use `->` in filter expressions. Use `_ref` for direct comparison.

```groq
-- Bad: resolves reference for every document
*[_type == "post" && author->name == "Bob"]

-- Good: direct string comparison, uses index
*[_type == "post" && author._ref == "author-bob-id"]
```

### 3. GROQ: Always Project Fields

Never fetch entire documents. Use explicit projections at every level.

```groq
-- Bad
*[_type == "post"]

-- Good
*[_type == "post"]{
  _id, title, "slug": slug.current, publishedAt,
  author->{ name, "avatar": image.asset->url }
}
```

### 4. GROQ: Always Use defineQuery

Wrap all queries in `defineQuery` for TypeGen support.

```typescript
import { defineQuery } from "next-sanity"

const POST_QUERY = defineQuery(`*[_type == "post"]{ title, slug }`)
// Generated type: POST_QUERYResult
```

### 5. Schema: Model Data, Not Presentation

Field names describe **what content is**, not what it looks like.

```typescript
// Bad: bigHeroText, redButton, threeColumnRow
// Good: headline, primaryAction, features
```

**Test:** "If we redesigned the site, would this field name still make sense?"

### 6. Schema: Always Use Define Helpers

Use `defineType`, `defineField`, `defineArrayMember` from `sanity`.

```typescript
import { defineType, defineField, defineArrayMember } from 'sanity'

export const article = defineType({
  name: 'article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tag' }] })]
    })
  ]
})
```

### 7. Schema: Safe Field Deprecation

**Never** delete fields with production data. Follow ReadOnly -> Hidden -> Deprecated lifecycle.

```typescript
defineField({
  name: 'oldTitle',
  type: 'string',
  deprecated: { reason: 'Use "seoTitle" instead. Will be removed in v2.' },
  readOnly: true,
  hidden: ({ value }) => value === undefined,
})
```

Use `defineMigration` from `sanity/migrate` for data migration. Always dry-run first.

### 8. Visual Editing: Clean Stega for Logic

Stega characters break string comparisons. Always clean before logic operations.

```typescript
import { stegaClean } from "@sanity/client/stega"

const cleanAlign = stegaClean(align)
if (cleanAlign === 'center') { /* ... */ }
```

**Clean for:** string comparisons, object key lookups, HTML IDs, third-party libraries.
**Don't clean for:** rendering text, passing to `<Image>`, passing to image helpers.

### 9. Images: Always Enable Hotspots

```typescript
defineField({
  name: 'mainImage',
  type: 'image',
  options: { hotspot: true }  // Critical for editor-controlled cropping
})
```

### 10. Page Builder: Objects by Default

Use objects for page-specific blocks. Only use references for truly shared content.

```typescript
defineType({
  name: 'pageBuilder',
  type: 'array',
  of: [
    defineArrayMember({ type: 'hero' }),
    defineArrayMember({ type: 'features' }),
    // Reference only for shared content
    defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] }),
  ]
})
```

### 11. Studio: Singletons via Structure

No `singleton: true` schema option. Use Structure with fixed `documentId`.

```typescript
S.listItem().title('Site Settings').child(
  S.document().schemaType('settings').documentId('settings')
)
```

### 12. TypeGen Workflow

After schema or query changes:

```bash
npm run typegen  # = sanity schema extract && sanity typegen generate
```

## Agent Behavior

- Use `defineQuery` for all GROQ queries
- Use MCP tools for content operations when available
- Run `deploy_schema` after schema changes
- Follow the deprecation pattern when removing fields
- Run `npm run typegen` after schema or query changes
- Never hardcode API tokens (use `process.env`)
- Never use `any` for Sanity content types

## Additional Resources

- For detailed GROQ, schema, and Visual Editing rules, see [rules-reference.md](rules-reference.md)
- For Next.js + Sanity integration patterns, see [nextjs-integration.md](nextjs-integration.md)
- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Language Reference](https://www.sanity.io/docs/groq)
- [Sanity Agent Toolkit](https://github.com/sanity-io/agent-toolkit)
