# C-4 Flow — Pole & Exotic Dance Studio

Marketing website for [C-4 Flow Dance Studio](https://c4flow.co.za), Cape Town.

Built with **Next.js 16**, **Sanity CMS**, **Tailwind CSS v4**, and deployed to **Vercel** and **Hostinger**.

---

## Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Framework    | Next.js 16 (App Router, TypeScript, RSC)        |
| CMS          | Sanity v3 (embedded Studio, Visual Editing)     |
| Styling      | Tailwind CSS v4, custom design tokens           |
| Animations   | Framer Motion                                   |
| Email        | Resend (contact form)                           |
| Fonts        | Montserrat (body), Mynerve (headings)           |
| Hosting      | Vercel (primary), Hostinger (secondary mirror)  |

---

## Prerequisites

- **Node.js 22** — managed via [nvm](https://github.com/nvm-sh/nvm)
- **npm** (comes with Node)
- **Git** with SSH access to the GitHub repo
- The `.env.local` secrets file (ask Marc for this)

---

## Getting Started (Step by Step)

### 1. Clone the repo

```bash
git clone git@github.com-maduby:maduby/c4flow-nextjs.git
cd c4flow-nextjs
```

> If you get a permission error, your SSH key hasn't been added to GitHub yet. Ask Marc for help.

### 2. Switch to the correct Node version

The project requires Node 22. There's an `.nvmrc` file that pins the exact version.

```bash
nvm install
nvm use
```

Verify it worked:

```bash
node -v
# Should print v22.17.0
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up environment variables

The project needs secret API tokens that are **not** stored in Git.

```bash
cp .env.example .env.local
```

This creates a copy of `.env.example` with placeholder values. **Ask Marc for the real secrets** and paste them into `.env.local`. The file should never be committed to Git.

Here's what each variable does:

| Variable                           | What it is                                                    |
| ---------------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`    | Sanity project ID (already filled in)                         |
| `NEXT_PUBLIC_SANITY_DATASET`       | Sanity dataset name (already filled in)                       |
| `NEXT_PUBLIC_SANITY_API_VERSION`   | Sanity API version date (already filled in)                   |
| `NEXT_PUBLIC_SITE_URL`             | Site URL — keep as `http://localhost:3000` for local dev      |
| `SANITY_API_READ_TOKEN`            | **Secret.** Sanity read token for server-side data fetching   |
| `SANITY_API_WRITE_TOKEN`           | **Secret.** Sanity write token for contact form submissions   |
| `SANITY_REVALIDATE_SECRET`         | **Secret.** Webhook secret for on-demand revalidation         |
| `RESEND_API_KEY`                   | **Secret.** API key for the Resend email service              |
| `CONTACT_EMAIL`                    | Where contact form submissions are sent                       |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION`  | Google Search Console tag (optional for local dev)            |

### 5. Start the dev server

```bash
npm run dev
```

Then open:

- **Website** — [http://localhost:3000](http://localhost:3000)
- **Sanity Studio** — [http://localhost:3000/admin](http://localhost:3000/admin)

You'll need to log into Sanity Studio with your Sanity account. Ask Marc to invite you to the project if you haven't been added yet.

---

## Available Scripts

| Command         | What it does                                     |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Start the development server (with hot reload)   |
| `npm run build` | Create a production build                        |
| `npm run start` | Serve the production build locally               |
| `npm run lint`  | Run ESLint to check for code issues              |

---

## Project Structure

```
c4flow-nextjs/
├── src/
│   ├── app/                        # Next.js pages and routes
│   │   ├── page.tsx                #   Homepage (/)
│   │   ├── [slug]/page.tsx         #   Dynamic pages (/about, /classes, /contact)
│   │   ├── admin/[[...tool]]/      #   Sanity Studio (/admin)
│   │   └── api/                    #   API routes (contact form, revalidation, draft mode)
│   ├── components/
│   │   ├── layout/                 #   Header, Footer, MobileNav
│   │   ├── sections/               #   Page sections (HeroSection, PricingSection, etc.)
│   │   ├── shared/                 #   Reusable components (Container, SectionHeading)
│   │   └── ui/                     #   Small UI pieces (PricingCards, BookNowLink, etc.)
│   ├── lib/
│   │   ├── utils.ts                #   Utility functions (cn, formatCurrency)
│   │   ├── constants.ts            #   Site-wide config (booking URL, social links)
│   │   └── actions/                #   Server actions (contact form submission)
│   └── sanity/
│       ├── client.ts               #   Sanity client setup
│       ├── structure.ts            #   Studio sidebar layout
│       ├── lib/
│       │   ├── queries.ts          #   All GROQ queries
│       │   ├── live.ts             #   Sanity Live / real-time content
│       │   └── image.ts            #   Image URL builder
│       └── schemaTypes/
│           ├── index.ts            #   Schema registry (all types exported here)
│           ├── documents/          #   Document schemas (page, danceClass, discount, etc.)
│           ├── objects/            #   Object schemas (hero, pricingSection, etc.)
│           └── shared/             #   Shared field definitions
├── scripts/                        # One-time migration/seed scripts
├── docs/                           # Project documentation and analysis
├── public/                         # Static assets (favicon, robots, etc.)
├── .env.example                    # Template for environment variables
├── .nvmrc                          # Node version (22.17.0)
├── sanity.config.ts                # Sanity Studio configuration
├── sanity.cli.ts                   # Sanity CLI configuration
├── next.config.mjs                 # Next.js configuration
└── tailwind.config.ts              # Tailwind CSS configuration
```

---

## Sanity CMS

### What is Sanity?

Sanity is the headless CMS that powers all the site content. The client (C-4 Flow) edits content in **Sanity Studio**, and the Next.js frontend fetches that content at build/request time.

The Studio is **embedded** inside the Next.js app at `/admin` — there's no separate Sanity deployment.

### Accessing the Studio

- **Local:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Production:** [https://c4flow.co.za/admin](https://c4flow.co.za/admin)

Log in with your Sanity account (Google or GitHub).

### Studio Sidebar

The Studio sidebar is organized like this:

| Section                | Type        | What it manages                                |
| ---------------------- | ----------- | ---------------------------------------------- |
| **Site Settings**      | Singleton   | Logo, contact info, social links, default OG   |
| **Announcement Bar**   | Singleton   | Top banner message and link                    |
| **Discounts**          | Singleton   | Global discount %, scope (all/specific classes) |
| ─                      |             |                                                |
| **Pages**              | Collection  | All site pages (Home, About, Classes, Contact) |
| ─                      |             |                                                |
| **Dance Classes**      | Collection  | Individual class details and descriptions      |
| **Pricing Bundles**    | Collection  | Group and private class packages with prices   |
| **Weekly Schedule**    | Singleton   | Class timetable (day + time slots)             |
| **Instructors**        | Collection  | Instructor bios and photos                     |
| **Testimonials**       | Collection  | Student testimonials                           |
| ─                      |             |                                                |
| **Contact Submissions**| Collection  | Form submissions from the contact page         |

### Key Sanity Concepts

- **Document** = a content entry (a page, a class, a testimonial, etc.)
- **Singleton** = a document type that only has one instance (Site Settings, Discounts, etc.)
- **Draft vs Published** = when you edit a document in Studio, it creates a draft. You must click **Publish** to make changes live on the website.
- **GROQ** = the query language Sanity uses (like SQL but for JSON). All queries live in `src/sanity/lib/queries.ts`.
- **Schema** = defines what fields a document has. Schemas live in `src/sanity/schemaTypes/`.

### How Content Flows

```
Sanity Studio (edit & publish)
       ↓
GROQ queries fetch content (src/sanity/lib/queries.ts)
       ↓
Server Components render pages (src/components/sections/)
       ↓
User sees the website
```

### Adding or Editing a Schema

1. Find (or create) the schema file in `src/sanity/schemaTypes/documents/` or `objects/`
2. If it's a new schema, register it in `src/sanity/schemaTypes/index.ts`
3. If it needs a sidebar entry, add it in `src/sanity/structure.ts`
4. Add a GROQ query for it in `src/sanity/lib/queries.ts`
5. Create or update the component that renders it

---

## Pages and the Page Builder

Pages are built with a **section-based page builder**. Each page in Sanity has a `sections` array, and each section is a different content block (hero, classes, pricing, gallery, map, etc.).

The component `src/components/sections/PageBuilder.tsx` reads the `sections` array and renders the correct component for each `_type`.

To add a new section type:

1. Create the object schema in `src/sanity/schemaTypes/objects/`
2. Register it in the schema index and add it to the page's `sections` array options
3. Create the React component in `src/components/sections/`
4. Add a `case` for it in `PageBuilder.tsx`

---

## Git Workflow

### Branch

We work on a single branch: **`main`**.

### How to commit and push

```bash
# Check what changed
git status
git diff

# Stage and commit
git add .
git commit -m "Brief description of what you changed"

# Push to GitHub
git push
```

### What happens when you push

Pushing to `main` triggers **automatic deployments** on both platforms:

| Platform   | URL                                | What happens                           |
| ---------- | ---------------------------------- | -------------------------------------- |
| **Vercel** | https://c4flow.vercel.app          | Builds and deploys automatically (~1-2 min) |
| **Hostinger** | https://c4flow.co.za            | Builds and deploys automatically (~3-5 min)  |

Both platforms pull the latest code from the `main` branch, run `npm run build`, and serve the result. You don't need to do anything extra — just push.

> **Tip:** Vercel updates faster and shows build logs in the [Vercel dashboard](https://vercel.com). If something breaks, check there first.

### Commit message style

Keep messages short and descriptive:

```
feat: add testimonials carousel to homepage
fix: WhatsApp button URL encoding on mobile
style: reduce section padding on mobile
content: update pricing bundle names
```

---

## Deployment

### Vercel (primary)

- Auto-deploys on every push to `main`
- Dashboard: [vercel.com](https://vercel.com) (ask Marc for access)
- Preview deployments are created for pull requests

### Hostinger (secondary)

- Also auto-deploys from `main` via GitHub integration
- Slightly slower builds and more aggressive browser caching
- Dashboard: [hpanel.hostinger.com](https://hpanel.hostinger.com) (ask Marc for access)

### Environment variables on hosting

Both Vercel and Hostinger have their own copies of the environment variables. If a new env var is added, it must be configured on both platforms (ask Marc to do this).

---

## Useful Links

| Resource              | URL                                                                 |
| --------------------- | ------------------------------------------------------------------- |
| Live site             | https://c4flow.co.za                                                |
| Vercel preview        | https://c4flow.vercel.app                                           |
| Sanity Studio (prod)  | https://c4flow.co.za/admin                                          |
| Sanity project        | https://www.sanity.io/manage/project/ik9ho36m                       |
| GitHub repo           | https://github.com/maduby/c4flow-nextjs                             |
| Sanity docs           | https://www.sanity.io/docs                                          |
| Next.js docs          | https://nextjs.org/docs                                             |
| Tailwind CSS docs     | https://tailwindcss.com/docs                                        |

---

## Troubleshooting

### "Module not found" or dependency errors

```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Content not updating after editing in Studio

- Make sure you clicked **Publish** in Studio (drafts don't show on the live site)
- Hard refresh the browser (`Cmd + Shift + R`)
- If on Hostinger, it may take a few minutes due to CDN caching

### Sanity Studio won't load at /admin

- Check that `.env.local` has the correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Make sure you're logged into Sanity with an account that has project access
- Try clearing the Next.js cache: `rm -rf .next && npm run dev`

### Build fails locally

```bash
npm run build
```

Read the error output. Common causes:
- TypeScript errors (missing types, wrong props)
- Missing environment variables in `.env.local`
- Sanity schema changes that don't match existing queries

---

## License

Private — C-4 Flow Dance Studio. All rights reserved.
