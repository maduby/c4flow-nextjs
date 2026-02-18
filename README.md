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

- **Node.js 22** — managed via nvm (see setup below)
- **npm** (comes with Node)
- **Git** with SSH access to the GitHub repo
- **Cursor** (recommended) or **VS Code** as your editor
- The `.env.local` secrets file (ask Marc for this)

---

## Setting Up Your Machine (Windows)

If this is a fresh Windows laptop, follow these steps first. If you already have Git, nvm, and Node working, skip to [Getting Started](#getting-started-step-by-step).

### Install Git

1. Download Git for Windows from [git-scm.com/downloads/win](https://git-scm.com/downloads/win)
2. Run the installer — accept all defaults
3. Open a terminal (see below) and verify: `git --version`

### Install nvm for Windows

The standard `nvm` is for Mac/Linux. On Windows, use **nvm-windows** instead:

1. Go to [github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. Download `nvm-setup.exe` from the latest release
3. Run the installer — accept all defaults
4. **Close and reopen your terminal** after installing
5. Verify it worked:

```bash
nvm version
# Should print a version number like 1.2.2
```

### Install Node.js via nvm

```bash
nvm install 22.17.0
nvm use 22.17.0
```

Verify:

```bash
node -v
# Should print v22.17.0

npm -v
# Should print a version number
```

> **Important:** Every time you open a new terminal, you may need to run `nvm use 22.17.0` again. To make it the default, run: `nvm alias default 22.17.0` (Mac/Linux) or `nvm use 22.17.0` sets it permanently on Windows.

### Set up your editor

We recommend **Cursor** ([cursor.com](https://www.cursor.com/)) — it's VS Code with AI built in. If you prefer plain VS Code, that works too.

Useful extensions to install:

- **ESLint** — shows code errors inline
- **Tailwind CSS IntelliSense** — autocomplete for CSS classes
- **Prettier** — auto-formats your code on save

### Set up SSH for GitHub

You need an SSH key to push/pull code. Open your terminal and run:

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Press Enter for all the prompts (default file location, no passphrase is fine).

Then copy your public key:

```bash
# Windows (PowerShell)
cat ~/.ssh/id_ed25519.pub | clip

# Mac
cat ~/.ssh/id_ed25519.pub | pbcopy
```

Go to [github.com/settings/keys](https://github.com/settings/keys), click **New SSH key**, paste it, and save.

Test the connection:

```bash
ssh -T git@github.com
# Should say "Hi username! You've successfully authenticated"
```

---

## Getting Started (Step by Step)

### 1. Clone the repo

```bash
git clone git@github.com:maduby/c4flow-nextjs.git
cd c4flow-nextjs
```

> If you get a permission error, your SSH key isn't set up or you haven't been added as a collaborator. Ask Marc for help.

### 2. Switch to the correct Node version

The project requires Node 22. There's an `.nvmrc` file that pins the exact version.

**Mac/Linux:**

```bash
nvm install
nvm use
```

**Windows:**

```bash
nvm use 22.17.0
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

### Branches

The **`main`** branch is **protected** — it deploys directly to the live site. You cannot push to it directly.

Instead, we use **feature branches** and **Pull Requests (PRs)**:

```
main (protected, deploys to live)
 └── fix/broken-whatsapp-link    ← you work here
 └── feat/add-gallery-section    ← or here
```

### The workflow (step by step)

Here's the full cycle for every task you work on:

```
1. Start from main       → make sure you have the latest code
2. Create a branch       → your own workspace for this task
3. Do your work          → make changes, commit often
4. Push your branch      → upload it to GitHub
5. Open a Pull Request   → ask Marc to review your code
6. Marc reviews          → he may leave comments or request changes
7. You fix any feedback  → commit and push again (the PR updates automatically)
8. Marc merges           → your code goes live!
9. Clean up              → switch back to main, pull, delete old branch
```

> **Important:** You cannot merge to `main` yourself. Only Marc can merge Pull Requests. This protects the live site from accidental changes.

---

### Step 1: Start from the latest main

Before starting any new work, always make sure you have the latest code.

**In Cursor / VS Code:**
1. Click the branch name in the **bottom-left corner** of the editor
2. Select **`main`** from the list
3. Open the **Source Control panel** (Git icon in left sidebar, or `Ctrl+Shift+G`)
4. Click the **...** menu → **Pull**

**In terminal:**

```bash
git checkout main
git pull
```

---

### Step 2: Create a new branch

**In Cursor / VS Code:**
1. Click the branch name in the **bottom-left corner** (it should say `main`)
2. Click **"Create new branch..."** in the dropdown
3. Type a name like `fix/update-class-description` and press Enter
4. You're now on your new branch — you'll see the name changed in the bottom-left

**In terminal:**

```bash
git checkout -b fix/update-class-description
```

> **Branch naming:** Always use a prefix followed by a short dash-separated description:
>
> | Prefix    | When to use            | Example                      |
> | --------- | ---------------------- | ---------------------------- |
> | `fix/`    | Bug fix                | `fix/mobile-nav-bug`         |
> | `feat/`   | New feature or section | `feat/add-faq-page`          |
> | `style/`  | Visual/CSS changes     | `style/footer-spacing`       |
> | `content/`| Content updates        | `content/update-class-times` |

---

### Step 3: Do your work and make commits

Make your code changes, then commit them. Commit often — small commits are easier to review.

**In Cursor / VS Code:**
1. Make your code changes and save
2. Open the **Source Control panel** (`Ctrl+Shift+G`)
3. You'll see changed files listed under "Changes"
4. Click the **+** button next to each file to stage it (or click **+** next to "Changes" to stage all)
5. Type a short commit message in the text box (e.g. `fix: update class description text`)
6. Click the **checkmark button** (or press `Ctrl+Enter`) to commit
7. Repeat as you keep working — you can make multiple commits on the same branch

**In terminal:**

```bash
git add .
git commit -m "fix: update class description text"
```

---

### Step 4: Push your branch to GitHub

**In Cursor / VS Code:**
1. In the Source Control panel, click the **...** menu
2. Click **"Push"**
3. If it's your first push on this branch, it will ask to "publish" — click **OK**

**In terminal:**

```bash
git push -u origin fix/update-class-description
```

> Every time you make more commits, just push again. The branch on GitHub updates automatically.

---

### Step 5: Open a Pull Request on GitHub

This is how you ask Marc to review your work.

1. Go to [github.com/maduby/c4flow-nextjs](https://github.com/maduby/c4flow-nextjs) in your browser
2. You'll see a yellow banner: **"fix/update-class-description had recent pushes — Compare & pull request"**
3. Click that button
4. Fill in the PR form:
   - **Title:** A short summary of what you did (e.g. "Fix: update class description text")
   - **Description:** Explain **what** you changed and **why**. For example:

     ```
     ## What I changed
     - Updated the description text for the Dynamic Static class
     - Fixed a typo in the pricing section footer

     ## How to test
     - Go to /classes and scroll to Dynamic Static
     - Check that the new description looks correct
     ```

5. Click **"Create pull request"**
6. Message Marc (Slack, WhatsApp, etc.) to let him know it's ready

> **You only open a PR once per branch.** If you push more commits later, the PR updates automatically — you don't need to create a new one.

---

### Step 6: Respond to review feedback

Marc will review your PR on GitHub. He might:
- **Approve it** — great, he'll merge it and you're done
- **Request changes** — he'll leave comments explaining what to fix

If changes are requested:

1. Read the comments on the PR page on GitHub
2. Go back to your editor — make sure you're still on your branch (check bottom-left)
3. Make the fixes
4. Commit and push again:

**In Cursor / VS Code:**
1. Stage your changes (Source Control panel → **+** button)
2. Write a commit message like `fix: address review feedback`
3. Click the checkmark to commit
4. Click **...** → **Push**

**In terminal:**

```bash
git add .
git commit -m "fix: address review feedback"
git push
```

The PR on GitHub updates automatically. Marc will see your new changes and review again.

---

### Step 7: After your PR is merged

Once Marc merges your PR, your code is live. Now clean up:

**In Cursor / VS Code:**
1. Click the branch name in the bottom-left
2. Select **`main`**
3. Source Control panel → **...** → **Pull** (to get the merged code)
4. To delete your old branch: open a terminal (`Ctrl+`` `) and run:

```bash
git branch -d fix/update-class-description
```

**In terminal:**

```bash
git checkout main
git pull
git branch -d fix/update-class-description
```

> **Never** continue working on a merged branch. Always start fresh from `main` for your next task.

### What happens when code reaches main

Merging a PR into `main` triggers **automatic deployments** on both platforms:

| Platform      | URL                       | What happens                                |
| ------------- | ------------------------- | ------------------------------------------- |
| **Vercel**    | https://c4flow.vercel.app | Builds and deploys automatically (~1-2 min) |
| **Hostinger** | https://c4flow.co.za      | Builds and deploys automatically (~3-5 min) |

> **Tip:** Vercel also creates **preview deployments** for every PR, so you can test your changes on a live URL before merging. Look for the Vercel bot comment on your PR.

### Commit message style

Keep messages short and descriptive. Use a prefix:

| Prefix      | When to use                           | Example                                    |
| ----------- | ------------------------------------- | ------------------------------------------ |
| `feat:`     | New feature or section                | `feat: add testimonials carousel`          |
| `fix:`      | Bug fix                               | `fix: WhatsApp button URL on mobile`       |
| `style:`    | Visual/CSS changes                    | `style: reduce section padding on mobile`  |
| `content:`  | Content or copy updates               | `content: update pricing bundle names`     |
| `docs:`     | Documentation changes                 | `docs: update README setup steps`          |
| `refactor:` | Code cleanup (no behavior change)     | `refactor: extract PricingCard component`  |

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

### `nvm` not recognized (Windows)

- Make sure you installed **nvm-windows** (not regular nvm)
- Close and reopen your terminal after installing
- If using Cursor/VS Code, restart the editor entirely

### `node -v` shows the wrong version

```bash
nvm use 22.17.0
```

If that version isn't installed yet: `nvm install 22.17.0`

### "Module not found" or dependency errors

```bash
# Windows
rd /s /q node_modules .next
npm install
npm run dev

# Mac/Linux
rm -rf node_modules .next
npm install
npm run dev
```

### Content not updating after editing in Studio

- Make sure you clicked **Publish** in Studio (drafts don't show on the live site)
- Hard refresh the browser (`Ctrl + Shift + R` on Windows, `Cmd + Shift + R` on Mac)
- If on Hostinger, it may take a few minutes due to CDN caching

### Sanity Studio won't load at /admin

- Check that `.env.local` has the correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Make sure you're logged into Sanity with an account that has project access
- Try clearing the Next.js cache and restarting:

```bash
# Windows
rd /s /q .next
npm run dev

# Mac/Linux
rm -rf .next && npm run dev
```

### Build fails locally

```bash
npm run build
```

Read the error output. Common causes:
- TypeScript errors (missing types, wrong props)
- Missing environment variables in `.env.local`
- Sanity schema changes that don't match existing queries

### Permission denied when pushing to GitHub

- Your SSH key isn't set up — follow the [SSH setup steps](#set-up-ssh-for-github) above
- Or you haven't been added as a collaborator on the repo — ask Marc

---

## License

Private — C-4 Flow Dance Studio. All rights reserved.
