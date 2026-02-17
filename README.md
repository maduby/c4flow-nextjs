# C-4 Flow — Pole & Exotic Dance Studio

Marketing website for C-4 Flow Dance Studio, Cape Town.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, Standalone output)
- **Sanity v3** (Embedded Studio, Visual Editing, Live Content API)
- **Tailwind CSS v4** (Custom design system)
- **Resend** (Contact form emails)
- **Framer Motion** (Animations)

## Getting Started

```bash
# Use correct Node version
nvm use

# Install dependencies
npm install

# Copy env file and fill in secrets
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sanity Studio

Embedded at `/studio` — accessible after starting the dev server.

## Project Structure

```
src/
├── app/            # Next.js routes and pages
├── components/     # React components (layout, sections, ui, shared)
├── lib/            # Utilities, constants, server actions
├── sanity/         # Sanity schemas, client, queries
docs/
├── analysis/       # Website analysis from c4flow.co.za
├── progress/       # Timestamped progress logs
```

## Deployment

Deployed to Hostinger Business Hosting via GitHub integration.

## License

Private — C-4 Flow Dance Studio.
