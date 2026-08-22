// One-off: set project.technologies from a fixed mapping (ran 2026-06-28).
// Idempotent — skips any project that already has technologies.
// Run: `pnpm studio exec scripts/set-project-tech.mjs`
import { getCliClient } from 'sanity/cli'
import { NEXT } from './skillIds.mjs'

const client = getCliClient({ apiVersion: '2024-01-01' })

const mapping = {
  'project-pawcast': ['skill-kotlin', 'skill-jetpack', 'skill-figma'],
  'project-karbon': ['skill-react', 'skill-nodejs', 'skill-mongodb'],
  'project-digital-house': ['skill-blender', 'skill-aftereffects', 'skill-illustrator'],
  'project-disc': ['skill-blender'],
  'project-leetcode': ['skill-react'],
  'project-nuovo': ['skill-illustrator', 'skill-blender'],
  'project-polaris': ['skill-react', 'skill-nodejs', 'skill-mongodb', 'skill-tailwind', 'skill-shadcn', 'skill-typescript'],
  'project-ruter': ['skill-react'],
  'project-setningsbygger': [NEXT, 'skill-cloudflare'],
  'drafts.project-setningsbygger': [NEXT, 'skill-cloudflare'],
  'project-stavanger-move': ['skill-illustrator', 'skill-blender'],
  'project-web-to-svg': ['skill-typescript', 'skill-javascript'],
}

const refs = (docId, skillIds) =>
  skillIds.map((sid, i) => ({
    _type: 'reference',
    _ref: sid,
    _key: `${docId.replace(/\./g, '-')}-tech-${i}`,
  }))

const existing = await client.fetch(
  `*[_id in $ids && defined(technologies) && count(technologies) > 0]._id`,
  { ids: Object.keys(mapping) },
)
const skip = new Set(existing)

let tx = client.transaction()
let count = 0
for (const [docId, skillIds] of Object.entries(mapping)) {
  if (skip.has(docId)) continue
  tx = tx.patch(docId, (p) => p.set({ technologies: refs(docId, skillIds) }))
  count++
}

if (count === 0) {
  console.log('All mapped projects already have technologies — skipping.')
  process.exit(0)
}

const res = await tx.commit()
console.log('Committed:', res.transactionId)
console.log(`Documents updated (${count}):`, res.results.map((r) => r.id).join(', '))
