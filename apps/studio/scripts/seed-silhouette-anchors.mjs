// One-off: seed siteSettings.silhouetteAnchors (ran 2026-06-28).
// Idempotent — skips if anchors already exist. Run: `pnpm studio exec scripts/seed-silhouette-anchors.mjs`
import { getCliClient } from 'sanity/cli'
import { NEXT } from './skillIds.mjs'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Technical disciplines on the left, design on the right.
const anchors = [
  { corner: 'tl', skill: NEXT }, // Next → Code
  { corner: 'bl', skill: 'skill-blender' }, // Blender → 3D
  { corner: 'tr', skill: 'skill-figma' }, // Figma → UX
  { corner: 'br', skill: 'skill-illustrator' }, // Illustrator → Graphic
]

const existing = await client.fetch(`*[_id == "siteSettings"][0].silhouetteAnchors`)
if (existing?.length) {
  console.log(`siteSettings already has ${existing.length} anchors — skipping.`)
  process.exit(0)
}

const value = anchors.map((a) => ({
  _type: 'object',
  _key: `anchor-${a.corner}`,
  corner: a.corner,
  skill: { _type: 'reference', _ref: a.skill },
}))

const res = await client
  .transaction()
  .patch('siteSettings', (p) => p.set({ silhouetteAnchors: value }))
  .commit()

console.log('Seeded silhouetteAnchors:', res.transactionId)
console.log('Docs:', res.results.map((r) => r.id).join(', '))
