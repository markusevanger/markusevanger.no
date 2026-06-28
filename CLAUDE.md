# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Markus Evanger (markusevanger.no). Built with Next.js 16 and Sanity CMS as a pnpm monorepo.

## Commands

All commands run from the repo root.

```bash
# Development (runs both Next.js and Sanity Studio)
pnpm dev

# Run only Next.js (with Turbopack)
pnpm dev:web

# Run only Sanity Studio
pnpm dev:studio

# Build for production (web)
pnpm build

# Lint (web)
pnpm lint

# Generate TypeScript types from Sanity schemas (writes to apps/web/src/lib/sanity.types.ts)
pnpm typegen
```

### Studio-specific (run from root with `pnpm studio <cmd>` or from `apps/studio`)

```bash
# Deploy studio to Sanity.io
pnpm studio deploy

# Import migration data
pnpm studio migrate
```

## Architecture

### Monorepo Structure
- **`apps/web`**: Next.js 16 app (App Router) — deployed to Vercel as `markusevanger-no-site`
- **`apps/studio`**: Sanity Studio v5 — deployed to Vercel as `markusevanger-studio`

pnpm workspace: `packages: ['apps/*']`. Each app has its own `package.json` and `.vercel/` link.

### Next.js App (`apps/web/src`)
- **`/app/[locale]`**: Locale-based routing (Norwegian `no` default, English `en`)
- **`/components`**: React components (no barrel exports, import directly)
- **`/lib/queries.ts`**: All GROQ queries using `defineQuery` from next-sanity
- **`/lib/sanity.ts`**: Sanity client and `urlFor()` image helper
- **`/lib/sanity.types.ts`**: Auto-generated types (from `pnpm typegen`)
- **`/i18n/config.ts`**: Locale configuration and metadata

### Sanity Schema (`apps/studio/schemaTypes`)
- **Singletons**: `siteSettings`, `frontpage`, `cv` (one document each)
- **Content types**: `project`, `education`, `workExperience`, `skill`, `skillCategory`
- **Field-level i18n**: All translatable fields use `_en`/`_no` suffixes (not separate documents)
- **Reusable button schema**: `button.ts` used across projects, education, work experience

### Data Flow
1. Sanity queries defined in `apps/web/src/lib/queries.ts`
2. Server components fetch data directly using the Sanity client
3. Components receive locale prop and select `field_en` or `field_no` accordingly

## Key Conventions

- Path alias: `@/*` maps to `apps/web/src/*` (configured in `apps/web/tsconfig.json`)
- Tailwind v4 with PostCSS (configured in `apps/web/postcss.config.mjs`)
- View Transitions API enabled in Next.js config
- Images from `cdn.sanity.io` allowed via `apps/web/next.config.ts`
- Studio typegen reads from `../web/src/**/*.{ts,tsx}` and writes to `../web/src/lib/sanity.types.ts` (see `apps/studio/sanity.cli.ts`)

## Environment Variables

Required in `apps/web/.env.local` (see `apps/web/.env.local.example`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN` (optional, for preview/write)

Studio reads `apps/studio/.env.local` for its own write tokens / asset upload scripts.
