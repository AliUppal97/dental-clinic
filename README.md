# Dental Clinic Website

[![CI](https://github.com/YOUR_GITHUB_USERNAME/dental-clinic/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/dental-clinic/actions/workflows/ci.yml)
[![CD](https://github.com/YOUR_GITHUB_USERNAME/dental-clinic/actions/workflows/cd.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/dental-clinic/actions/workflows/cd.yml)

A production-ready, white-label **Next.js 14** template for dental clinics and in-house dental laboratories. Swap one JSON file and image assets to rebrand the entire site — no component changes required.

Built for agencies and freelancers who need a trustworthy, SEO-friendly, mobile-first clinic website they can resell across multiple clients.

---

## Features

| Area | Highlights |
|------|------------|
| **Content** | Single source of truth in `content/site-data.json` — clinic info, services, doctors, FAQs, testimonials, theme colors |
| **Sections** | Hero, Services, About, In-House Laboratory, Gallery, Testimonials, FAQ, Contact |
| **Forms** | Appointment form with `react-hook-form` + Zod validation and server-side API route |
| **Contact** | WhatsApp floating button, phone, email, Google Maps embed |
| **SEO** | Metadata API, `sitemap.xml`, `robots.txt`, LocalBusiness + FAQ JSON-LD |
| **UX** | Framer Motion scroll reveals, reduced-motion support, responsive from 375px up |
| **UI** | shadcn/ui primitives, Tailwind theme tokens synced from JSON |

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion
- **Forms:** react-hook-form, Zod, sonner toasts
- **Icons:** lucide-react

---

## Prerequisites

- **Node.js** 18 or 20 (LTS recommended)
- **npm** 9+
- A **GitHub** account (for CI/CD)
- A **Vercel** account (recommended for deployment)

---

## Quick start

```bash
# Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/dental-clinic.git
cd dental-clinic

# Install dependencies
npm install

# Copy environment template and set your production URL
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_SITE_URL to your live domain

# Start development server (http://localhost:3001)
npm run dev
```

The dev script syncs brand colors from `content/site-data.json` into CSS variables before starting.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical site URL for metadata, Open Graph, sitemap, and robots.txt. Example: `https://smilecareclinic.pk` |

Copy `.env.example` to `.env.local` for local development. Never commit `.env.local` — it is gitignored.

For Vercel deployment, add `NEXT_PUBLIC_SITE_URL` in the Vercel project **Settings → Environment Variables**.

---

## Project structure

```
app/
  api/contact/       POST handler for appointment form (stub — wire email before launch)
  layout.tsx         Root layout, fonts, JSON-LD
  page.tsx           Single-page homepage
  robots.ts          Dynamic robots.txt
  sitemap.ts         Dynamic sitemap.xml
components/
  sections/          Page sections (Hero, Services, FAQ, Contact, etc.)
  shared/            Navbar, Footer, WhatsApp button, logo
  ui/                shadcn/ui primitives
content/
  site-data.json     Single source of truth for all client content
lib/
  get-site-data.ts   Typed loader — import siteData from here only
  site-data-types.ts TypeScript interfaces
public/images/       Logos, doctor photos, gallery, certifications
scripts/
  sync-theme.mjs     Syncs theme colors from JSON → app/theme-vars.css
.github/workflows/
  ci.yml             Lint, typecheck, and build on every PR/push
  cd.yml             Deploy to Vercel on push to main
```

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Sync theme, then start dev server on port **3001** |
| `npm run build` | Sync theme, then create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run verify` | Sync theme + TypeScript check + ESLint (use before committing) |
| `npm run sync-theme` | Regenerate CSS variables from `site-data.json` |
| `npm run clean` | Remove `.next` and `.next-dev` build caches |
| `npm run dev:reset` | Clean caches and restart dev server |

> **Note:** Dev uses `.next-dev/` and production build uses `.next/` — they are isolated so you can run `npm run dev` and `npm run build` without corrupting the dev cache.

---

## Onboarding a new client

1. **Edit** `content/site-data.json` — clinic name, contact info, services, doctors, FAQs, testimonials, and theme colors.
2. **Replace** images in `public/images/` (logo, doctors, gallery, certifications).
3. **Set** `NEXT_PUBLIC_SITE_URL` in `.env.local` (dev) and Vercel (production).
4. **Run** `npm run dev` or `npm run build` — theme colors sync automatically.

No component code changes are required for a rebrand.

### Theme colors

Defined under `theme` in `site-data.json`:

```json
{
  "theme": {
    "primaryColor": "#0F766E",
    "accentColor": "#F97316",
    "backgroundColor": "#FAF9F6"
  }
}
```

`scripts/sync-theme.mjs` writes CSS variables to `app/theme-vars.css` (auto-generated, gitignored).

---

## Single source of truth

All components import content through the typed loader:

```ts
import { siteData } from "@/lib/get-site-data";
```

Never import `site-data.json` directly in components, and never hardcode client-specific strings (names, phone numbers, colors) in JSX.

---

## CI/CD pipelines

This repo includes two GitHub Actions workflows:

### CI (`ci.yml`)

Runs on every **push** and **pull request** to `main`:

1. `npm ci`
2. `npm run verify` (theme sync + TypeScript + ESLint)
3. `npm run build`

### CD (`cd.yml`)

Runs on every **push to `main`** (and manual dispatch):

1. Pulls Vercel project settings
2. Builds with `vercel build --prod`
3. Deploys prebuilt output with `vercel deploy --prebuilt --prod`

---

## GitHub setup — step by step

### 1. Create the GitHub repository

**Option A — GitHub website**

1. Go to [github.com/new](https://github.com/new).
2. Repository name: `dental-clinic` (or your preferred name).
3. Set visibility (Private recommended for client work).
4. Do **not** initialize with README, `.gitignore`, or license (this repo already has them).
5. Click **Create repository**.

**Option B — GitHub CLI**

```bash
gh repo create dental-clinic --private --source=. --remote=origin
```

### 2. Stage and commit all code locally

From the project root:

```bash
# Review what will be committed
git status

# Stage everything (respects .gitignore)
git add .

# First commit
git commit -m "Initial commit: dental clinic website template with CI/CD"
```

### 3. Connect remote and push

Replace `YOUR_GITHUB_USERNAME` with your GitHub username or org:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dental-clinic.git
git branch -M main
git push -u origin main
```

If you used `gh repo create` with `--source=.`, the remote may already exist — run `git push -u origin main` only.

### 4. Update README badges

After pushing, replace `YOUR_GITHUB_USERNAME/dental-clinic` in the badge URLs at the top of this README with your actual `owner/repo` path, then commit and push again.

---

## Vercel deployment setup

### Option A — Vercel Git integration (simplest)

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variable: `NEXT_PUBLIC_SITE_URL` = your production domain.
4. Deploy. Vercel redeploys automatically on every push to `main`.

You can disable the `cd.yml` workflow if you prefer Vercel's native Git integration only.

### Option B — GitHub Actions CD (this repo's `cd.yml`)

1. Install Vercel CLI locally: `npm i -g vercel`
2. Link the project: `vercel link` (creates `.vercel/project.json` locally — do not commit).
3. Get your tokens and IDs:

```bash
# Log in and link
vercel login
vercel link

# Print org and project IDs (from .vercel/project.json)
cat .vercel/project.json
```

4. Create a Vercel token: [vercel.com/account/tokens](https://vercel.com/account/tokens)

5. In GitHub → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Your Vercel personal access token |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

6. In Vercel project settings, set `NEXT_PUBLIC_SITE_URL` for the **Production** environment.

7. Push to `main` — the CD workflow deploys automatically.

---

## Pre-launch checklist

- [ ] Replace demo content in `site-data.json` with real clinic data
- [ ] Add real photos to `public/images/` (logo, doctors, gallery)
- [ ] Set `NEXT_PUBLIC_SITE_URL` in production
- [ ] Wire `/app/api/contact/route.ts` to Resend, SendGrid, or your booking system (currently logs only)
- [ ] Run `npm run verify` and confirm CI passes on GitHub
- [ ] Test at 375px width, keyboard navigation, and `prefers-reduced-motion`
- [ ] Verify metadata in page source (title, OG tags, JSON-LD)

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and run `npm run verify`
3. Open a pull request to `main` — CI must pass before merge

---

## License

Private / proprietary — update this section with your chosen license if you plan to open-source or resell the template.

---

## Support

For issues or client onboarding questions, open a GitHub Issue or contact the maintainer.
