# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Markus Evanger (markusevanger.no). Built with Next.js 16 and Sanity CMS as a pnpm monorepo.

## Commands

```bash
# Development (runs both Next.js and Sanity Studio)
pnpm dev

# Run only Next.js (with Turbopack)
pnpm dev:next

# Run only Sanity Studio
pnpm dev:sanity

# Build for production
pnpm build

# Lint
pnpm lint

# Generate TypeScript types from Sanity schemas
pnpm typegen
```

### Sanity-specific (run from root with pnpm sanity or from /sanity directory)

```bash
# Deploy studio to Sanity.io
pnpm sanity deploy

# Import migration data
pnpm sanity migrate
```

## Architecture

### Monorepo Structure
- **Root**: Next.js 16 app (App Router)
- **`/sanity`**: Sanity Studio v5 (separate package in pnpm workspace)

### Next.js App (`/src`)
- **`/app/[locale]`**: Locale-based routing (Norwegian `no` default, English `en`)
- **`/components`**: React components (no barrel exports, import directly)
- **`/lib/queries.ts`**: All GROQ queries using `defineQuery` from next-sanity
- **`/lib/sanity.ts`**: Sanity client and `urlFor()` image helper
- **`/lib/sanity.types.ts`**: Auto-generated types (from `pnpm typegen`)
- **`/i18n/config.ts`**: Locale configuration and metadata

### Sanity Schema (`/sanity/schemaTypes`)
- **Singletons**: `siteSettings`, `frontpage`, `cv` (one document each)
- **Content types**: `project`, `education`, `workExperience`, `skill`, `skillCategory`
- **Field-level i18n**: All translatable fields use `_en`/`_no` suffixes (not separate documents)
- **Reusable button schema**: `button.ts` used across projects, education, work experience

### Data Flow
1. Sanity queries defined in `/lib/queries.ts`
2. Server components fetch data directly using the Sanity client
3. Components receive locale prop and select `field_en` or `field_no` accordingly

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- Tailwind v4 with PostCSS (configured in `postcss.config.mjs`)
- View Transitions API enabled in Next.js config
- Images from `cdn.sanity.io` allowed via `next.config.ts`

## Environment Variables

Required in `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN` (optional, for preview/write)
