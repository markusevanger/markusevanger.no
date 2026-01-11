# Markus Evanger Portfolio - Next.js + Sanity

This is a migrated version of the portfolio website, now using:
- **Next.js 15** with App Router
- **Sanity v3** as the CMS
- **Tailwind CSS v4**
- **Framer Motion** for animations
- **TypeScript**

## Project Structure

```
sanity-next/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Homepage (server component)
│   │   ├── cv/page.tsx      # CV page (server component)
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles + Tailwind
│   ├── components/          # React components
│   │   ├── HomePage.tsx     # Homepage client component
│   │   ├── CVPage.tsx       # CV page client component
│   │   ├── ProjectCarousel.tsx
│   │   ├── WindowAnimation.tsx
│   │   └── assets/          # SVG components
│   ├── context/
│   │   └── LanguageContext.tsx  # i18n state management
│   └── lib/
│       ├── sanity.ts        # Sanity client
│       ├── queries.ts       # GROQ queries
│       └── types.ts         # TypeScript types
├── sanity/                  # Sanity Studio
│   ├── schemaTypes/         # Content schemas
│   ├── sanity.config.ts     # Studio config
│   └── migration.ndjson     # Initial data migration
└── public/
    └── fonts/               # Custom fonts
```

## Setup Instructions

### 1. Create Sanity Project

Go to [sanity.io/manage](https://www.sanity.io/manage) and create a new project.

### 2. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

Also update the same values in `sanity/sanity.config.ts` and `sanity/sanity.cli.ts`.

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Migration

Import all your content to Sanity:

```bash
cd sanity
pnpm migrate
```

### 5. Upload Images

The migration file doesn't include images. You need to manually upload these in Sanity Studio:

**Site Settings:**
- Profile Image (Homepage): `markus.jpg` or similar
- CV Profile Image: `markus1.jpeg`
- Logo Image: `v5-red.webp`

**Projects:**
- Polaris: `projectImages/polaris.webp`
- Pawcast: `projectImages/pawcast.webp`
- Karbon: `projectImages/karbon.webp`

**Work Experience (Certificates):**
- Polaris: `documents/pmgrafisksør_attest.pdf`
- Clear Karbon: `documents/Attest - Clear Karbon Exchange AS - Markus Evanger.pdf`

### 6. Start Development

```bash
# Terminal 1: Start Next.js
pnpm dev

# Terminal 2: Start Sanity Studio
cd sanity && pnpm dev
```

- Next.js: http://localhost:3000
- Sanity Studio: http://localhost:3333

## Sanity Schema Overview

### Singleton Documents (one instance each)
- **siteSettings**: Name, email, birth date, social links, profile images
- **frontpage**: Hero content, portfolio projects, footer content
- **cv**: CV page sections and references

### Content Documents
- **project**: Both featured and small projects (unified with `projectType` field)
- **education**: Education entries with periods and related projects
- **workExperience**: Work history with certificates
- **skill**: Individual skills (reusable)
- **skillCategory**: Groups of skills (Development, Hosting, Creative)

## i18n Approach

All text content uses field-level translations:
- `title_en` / `title_no`
- `description_en` / `description_no`

The `useLanguage` hook provides language state, and the `t()` helper function retrieves localized content.

## Deployment

### Sanity Studio
```bash
cd sanity && pnpm deploy
```

### Next.js
Deploy to Vercel, Netlify, or any Node.js hosting platform.

Set environment variables in your hosting provider's dashboard.
