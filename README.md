# C4 Flow Website Handover

Marketing website and CMS for [C4 Flow](https://www.c4flow.co.za), a pole and exotic dance studio in Cape Town.

This README is written for a developer taking over or extending the project, especially if the next phase includes replacing the current external booking links with a proper booking system.

Last updated: 30 April 2026.

## Current Ownership Snapshot

| Area | Current setup |
| --- | --- |
| Website hosting | Vercel, currently under Marc's Vercel Pro workspace |
| Live domain | `https://www.c4flow.co.za` |
| Apex domain | `https://c4flow.co.za` permanently redirects to `www` |
| DNS nameservers | `ns1.fahrenheit.sui-inter.net`, `ns2.fahrenheit.sui-inter.net` |
| DNS/admin panel | `https://fahrenheit.sui-inter.net/` |
| Email hosting | POP/SMTP mailbox service on Marc's server |
| CMS | Sanity Cloud, embedded Studio at `/admin` |
| Transactional email | Resend, used by the contact form |
| Booking | External Setmore links managed through Sanity/site config |
| Repository | `git@github.com:maduby/c4flow-nextjs.git` |

## Handover Notes

The site is currently running without hosting or email charges being passed on to the client. The website is under Marc's Vercel Pro plan, and the email service is a simple POP/SMTP mailbox on Marc's server. Both can stay where they are for collaboration, or they can be migrated if a new developer takes over the full project.

If taking over fully, plan for these handovers:

- GitHub repository access
- Vercel project transfer or a new Vercel project connected to the repo
- Sanity project access or Sanity project transfer
- DNS control at `fahrenheit.sui-inter.net`
- Email mailbox/DNS migration if moving email off Marc's server
- Resend account/API key handover or replacement
- Google Search Console and analytics access
- Setmore access if preserving the existing booking flow during transition

Do not commit secrets into the repository. Share environment variables through Vercel, a password manager, or another secure channel.

## Tech Stack

| Layer | Technology |
| --- | --- |
| App framework | Next.js 16, App Router, React Server Components, TypeScript |
| CMS | Sanity, embedded Studio, Visual Editing support |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Forms/email | Resend |
| Images | Sanity image CDN, Next image optimization |
| SEO/AEO | Metadata API, sitemap, robots, JSON-LD, machine-readable knowledge files |
| Deployment | Vercel |

## Live Infrastructure

### Domains and DNS

The canonical public host is:

```text
https://www.c4flow.co.za
```

The apex domain redirects permanently:

```text
https://c4flow.co.za -> https://www.c4flow.co.za
```

The nameservers are currently on Marc's server:

```text
ns1.fahrenheit.sui-inter.net
ns2.fahrenheit.sui-inter.net
```

Important DNS records at handover:

| Host | Type | Value | Purpose |
| --- | --- | --- | --- |
| `c4flow.co.za` | `A` | `216.150.1.1` | Vercel apex handling |
| `www.c4flow.co.za` | `CNAME` | `225a20385c815432.vercel-dns-016.com.` | Vercel custom domain |
| `mail.c4flow.co.za` | `A` | `80.74.145.45` | Mail server |
| `webmail.c4flow.co.za` | `A` | `80.74.145.45` | Webmail |
| `c4flow.co.za` | `MX` | `mail.c4flow.co.za` | Incoming mail |
| `c4flow.co.za` | `TXT` | SPF record | Mail authentication |
| `default._domainkey.c4flow.co.za` | `TXT` | DKIM record | Mail authentication |
| `_dmarc.c4flow.co.za` | `TXT` | DMARC record | Mail policy |
| `c4flow.co.za` | `TXT` | Google verification | Search Console |

Keep `www` as the canonical host unless you intentionally redo all canonical URLs, sitemap entries, redirects, and Search Console setup.

### Email

The client's email currently runs through Marc's server as a simple POP/SMTP mailbox service. This is separate from the website application.

If migrating DNS or nameservers, preserve mail records until the mailbox is migrated. Changing nameservers without recreating MX, SPF, DKIM, and DMARC records can break email delivery.

### Vercel

The active Vercel project is:

```text
pixel-poetry/c4flow-nextjs
```

Production aliases:

```text
https://www.c4flow.co.za
https://c4flow.co.za
https://c4flow.vercel.app
```

Vercel handles:

- Production builds
- Preview deployments
- Custom domain certificates
- Apex to `www` redirect
- Environment variables
- Serverless API routes

## Repository Workflow

Current branch convention:

| Branch | Purpose |
| --- | --- |
| `staging` | Integration/review branch before promoting to production |
| `main` | Production branch |

Recommended flow:

```bash
git checkout staging
git pull
git checkout -b feature/your-change

# make changes
npm run lint
npm run build

git add .
git commit -m "feat: describe the change"
git push -u origin feature/your-change
```

Open a pull request into `staging`. After review and testing, merge or promote `staging` into `main`.

Vercel creates preview deployments for pushed branches and deploys production from `main`.

## Local Development

### Requirements

- Node.js 22, pinned by `.nvmrc`
- npm
- GitHub repo access
- Sanity project access
- A populated `.env.local`

### Setup

```bash
git clone git@github.com:maduby/c4flow-nextjs.git
cd c4flow-nextjs

nvm install
nvm use

npm install
cp .env.example .env.local
npm run dev
```

Local URLs:

```text
Website: http://localhost:3000
Sanity Studio: http://localhost:3000/admin
```

## Environment Variables

Use `.env.example` as the template. The real values live outside Git.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID, currently `ik9ho36m` |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, currently `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date |
| `NEXT_PUBLIC_SITE_URL` | Local or deployment URL |
| `NEXT_PUBLIC_CANONICAL_SITE_URL` | Production canonical host, use `https://www.c4flow.co.za` |
| `SANITY_API_READ_TOKEN` | Server-side Sanity read token |
| `SANITY_API_WRITE_TOKEN` | Server-side Sanity write token |
| `SANITY_REVALIDATE_SECRET` | Shared secret for `/api/revalidate` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console verification token |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_EMAIL` | Destination address for contact form messages |
| `CONTACT_REPLY_TO` | Optional reply-to override |

Production Vercel should use:

```text
NEXT_PUBLIC_SITE_URL=https://www.c4flow.co.za
NEXT_PUBLIC_CANONICAL_SITE_URL=https://www.c4flow.co.za
```

Do not point production canonical variables at a `*.vercel.app` URL.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Build production app |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```text
src/
  app/
    page.tsx                    Homepage
    [slug]/page.tsx             CMS pages such as /about, /classes, /contact
    classes/[classSlug]/page.tsx Dedicated class landing pages
    api/contact/route.ts        Contact form endpoint
    api/revalidate/route.ts     Sanity webhook revalidation endpoint
    admin/[[...tool]]/          Embedded Sanity Studio
    sitemap.ts                  Sitemap generation
    robots.ts                   Robots generation, if present
    knowledge.json/             Machine-readable site knowledge route
    classes.json/               Machine-readable class catalogue route
    schedule.json/              Machine-readable schedule route
    pricing.json/               Machine-readable pricing route
    llms.txt/                   LLM summary route
    llms-full.txt/              Full LLM summary route
  components/
    layout/                     Header, footer, announcement bar
    sections/                   CMS-rendered page sections
    shared/                     Shared primitives and JSON-LD renderer
    ui/                         Small UI components
  lib/
    catalog.ts                  Normalized site/class/schedule/pricing data
    knowledge-files.ts          JSON and llms.txt payload builders
    structured-data.ts          Schema.org JSON-LD builders
    site-origin.ts              Canonical origin helper
    constants.ts                Site defaults and fallback config
    utils.ts                    Shared utilities
  sanity/
    lib/queries.ts              GROQ queries
    lib/client.ts               Sanity client
    lib/image.ts                Sanity image URL builder
    schemaTypes/                Sanity document/object schemas
```

## Sanity CMS

Sanity is the content source. The Studio is embedded at:

```text
https://www.c4flow.co.za/admin
```

Main content types:

| Content type | Purpose |
| --- | --- |
| Site Settings | Logo, contact details, social links, default images |
| Announcement Bar | Optional top banner |
| Pages | Homepage and static pages |
| Dance Classes | Class descriptions, images, price, duration, booking URL |
| Weekly Schedule | Day/time slots mapped to dance classes |
| Pricing Bundles | Group/private package pricing |
| Discounts | Global or class-specific discount logic |
| Instructors | Instructor bios and performer data |
| Testimonials | Student testimonials |
| Contact Submissions | Stored form submissions |

When content is published, Sanity should call `/api/revalidate` with `SANITY_REVALIDATE_SECRET`. The revalidation endpoint refreshes the relevant pages, sitemap, class pages, and machine-readable feeds.

If live content is stale after publishing:

- Confirm the Sanity document was published, not just saved as a draft
- Check the Sanity webhook target and secret
- Check Vercel function logs for `/api/revalidate`
- Confirm the relevant route is included in [`src/app/api/revalidate/route.ts`](src/app/api/revalidate/route.ts)

## SEO, Structured Data, and AEO

The site has dedicated landing pages for classes:

```text
/classes/free-play
/classes/exotic-baddies
/classes/dynamic-static
/classes/spinning-goddess
/classes/heels-and-queens
/classes/stretching-and-flexibility
```

These are included in `sitemap.xml` and publish self-referencing canonical URLs on `https://www.c4flow.co.za`.

Machine-readable routes:

| Route | Purpose |
| --- | --- |
| `/knowledge.json` | Full normalized site knowledge |
| `/classes.json` | Class catalogue |
| `/schedule.json` | Weekly schedule |
| `/pricing.json` | Pricing and bundles |
| `/llms.txt` | Concise LLM-facing summary |
| `/llms-full.txt` | Fuller LLM-facing summary |

Structured data lives in [`src/lib/structured-data.ts`](src/lib/structured-data.ts). Keep JSON-LD aligned with visible page content. If schedule, price, class image, or instructor data changes, the visible page and JSON-LD should change together.

## Current Booking Flow

The site currently sends bookings to Setmore.

Booking URLs come from:

- `siteSettings.bookingUrl`
- `danceClass.bookingUrl`
- fallback constants in [`src/lib/constants.ts`](src/lib/constants.ts)

Main UI integration points:

- [`src/components/ui/BookNowLink.tsx`](src/components/ui/BookNowLink.tsx)
- [`src/components/sections/ClassesSection.tsx`](src/components/sections/ClassesSection.tsx)
- [`src/components/sections/ClassDetailsSection.tsx`](src/components/sections/ClassDetailsSection.tsx)
- [`src/components/sections/ScheduleSection.tsx`](src/components/sections/ScheduleSection.tsx)
- [`src/app/classes/[classSlug]/page.tsx`](src/app/classes/%5BclassSlug%5D/page.tsx)

## Notes for Implementing a Booking System

A future booking system should decide early whether Sanity remains the content catalogue only, or whether class availability, capacity, bookings, and payments move into a transactional database.

Recommended direction:

- Keep Sanity for editorial content: class names, descriptions, images, SEO text, public schedule copy
- Use a transactional database for bookings, customers, attendance, capacity, cancellations, and payment state
- Keep the public class landing pages as the SEO source of truth
- Keep schedule and pricing visible in HTML, JSON-LD, and the machine-readable feeds
- Use Resend or the chosen booking platform for booking confirmations and admin notifications
- Add admin workflows only where the studio actually needs them; avoid making Sanity handle transactional booking state

Likely booking-system entities:

| Entity | Notes |
| --- | --- |
| Class | Can reference the Sanity `danceClass` slug or ID |
| Session | Specific date/time instance of a recurring class |
| Instructor | Can reference Sanity instructor data |
| Customer | Name, email, phone, consent fields |
| Booking | Customer, session, status, notes |
| Payment | Provider ID, amount, currency, status |
| Capacity | Per session limit and waitlist state |
| Notification | Confirmation, cancellation, reminder records |

Important implementation points:

- Preserve existing URLs under `/classes/[slug]`
- Preserve the `www` canonical host
- Preserve sitemap generation for class pages
- Update JSON-LD if the source of price, availability, or schedule changes
- Keep Setmore links in place until the replacement booking flow is production-ready
- If taking payments, choose and document the payment provider before designing the database schema
- If customer data is stored, document retention, access, and deletion responsibilities

## Contact Form

The contact form uses:

- `src/app/api/contact/route.ts`
- Resend via `RESEND_API_KEY`
- `CONTACT_EMAIL` as the destination
- Sanity write token for storing submissions, if enabled by the route

If replacing email infrastructure, this does not necessarily affect the contact form. The contact form is API-based through Resend, while the client's mailbox is DNS/mail-server based.

## Deployment Checklist

Before merging to production:

```bash
npm run lint
npm run build
```

After deployment, check:

- `https://www.c4flow.co.za`
- `https://www.c4flow.co.za/classes`
- one class page, such as `https://www.c4flow.co.za/classes/free-play`
- `https://www.c4flow.co.za/sitemap.xml`
- `https://www.c4flow.co.za/robots.txt`
- `https://www.c4flow.co.za/knowledge.json`
- contact form submission
- a booking link

For SEO-sensitive changes, inspect:

- canonical URL
- meta title and description
- sitemap entry
- Event/Service JSON-LD
- Search Console after recrawl

## Useful Links

| Resource | URL |
| --- | --- |
| Live site | https://www.c4flow.co.za |
| Apex redirect | https://c4flow.co.za |
| Vercel alias | https://c4flow.vercel.app |
| Sanity Studio | https://www.c4flow.co.za/admin |
| Sanity project | https://www.sanity.io/manage/project/ik9ho36m |
| GitHub repo | https://github.com/maduby/c4flow-nextjs |
| DNS/admin panel | https://fahrenheit.sui-inter.net/ |
| Next.js docs | https://nextjs.org/docs |
| Sanity docs | https://www.sanity.io/docs |
| Tailwind docs | https://tailwindcss.com/docs |
| Resend docs | https://resend.com/docs |

## Troubleshooting

### Content does not update after publishing

Check the Sanity webhook and `/api/revalidate` logs in Vercel. The static pages and JSON/LLM feeds rely on revalidation after content changes.

### Canonical URLs point at the wrong host

Check these Vercel environment variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_CANONICAL_SITE_URL
```

Production should use `https://www.c4flow.co.za`.

### Email stops working after DNS changes

Check MX, SPF, DKIM, and DMARC records in the DNS zone. The mailbox service is separate from Vercel.

### Contact form fails

Check:

- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- Vercel function logs for `/api/contact`
- Resend account status and sending limits

### Git push fails from this machine

The local `origin` remote may be configured with a machine-specific SSH alias. The canonical GitHub remote is:

```text
git@github.com:maduby/c4flow-nextjs.git
```

## License

Private project for C4 Flow. All rights reserved.
