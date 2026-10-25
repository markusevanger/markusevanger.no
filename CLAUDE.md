# CLAUDE.md

@AGENTS.md

## Project

Revamp of markusevanger.no — branch `revamp`, built from scratch (no Sanity, no monorepo). Single Next.js 16 app, pnpm, Tailwind v4.

- Scene: `src/components/forest-scene.tsx` — three.js port of `~/Projects/personal/depthmap/parallax-demo/index.html` (depth-map parallax forest, purple/red duotone filter, wisps). Assets in `public/scenes/forest/`.
- Grid overlay: `.grid-overlay` in `src/app/globals.css`.
- Content: `content/about.md`, `content/blog/<slug>.md` — Markdown with a small frontmatter block (title, date, summary), read by `src/lib/content.ts`, edited via GitHub.
- Routes: `src/app/(site)/layout.tsx` holds the persistent forest/grid/nav/floor guy; `(site)/(menu)/` pages (about, blog, blog/[slug]) open in the game-style `MenuPanel` (open/close/swap animations in `globals.css`, React `<ViewTransition>`).
- Figures: chrome character driven by baked pose clips (`src/lib/figure.ts`), tuned at `/dev/character` (dev only) and saved to `src/data/character.json`.

## Commands

```bash
pnpm dev     # next dev
pnpm build
pnpm lint
```
