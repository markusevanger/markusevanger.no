// One-off: standardize project preview-card buttons (ran 2026-08-22).
// Every project button becomes one of three variants:
//   GitHub  → "GitHub"/"GitHub", icon github, outline
//   Demo    → "Demo"/"Demo", icon flask-conical, primary
//   Website → "Website"/"Nettside", icon globe, primary
// Idempotent — only sets fields that differ. Run:
//   pnpm exec sanity exec scripts/standardize-buttons.mjs --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2025-02-19' })

const VARIANTS = {
  github: { text_en: 'GitHub', text_no: 'GitHub', icon: 'github', type: 'outline' },
  demo: { text_en: 'Demo', text_no: 'Demo', icon: 'flask-conical', type: 'primary' },
  website: { text_en: 'Website', text_no: 'Nettside', icon: 'globe', type: 'primary' },
}

const projects = await client.fetch(
  `*[_type == "project" && defined(buttons)]{_id, title_en, buttons[]{_key, text_en, text_no, icon, type, link}}`,
)

const tx = client.transaction()
let dirtyDocs = 0
for (const project of projects) {
  const patch = client.patch(project._id)
  let dirty = false
  for (const btn of project.buttons) {
    const variant = btn.link?.includes('github.com')
      ? VARIANTS.github
      : /demo/i.test(btn.text_en ?? '') || /demo/i.test(btn.link ?? '')
        ? VARIANTS.demo
        : VARIANTS.website
    const set = {}
    for (const [field, value] of Object.entries(variant)) {
      if (btn[field] !== value) set[`buttons[_key=="${btn._key}"].${field}`] = value
    }
    if (Object.keys(set).length) {
      patch.set(set)
      dirty = true
      console.log(`${project.title_en} · "${btn.text_en}" →`, set)
    }
  }
  if (dirty) {
    tx.patch(patch)
    dirtyDocs++
  }
}

if (!dirtyDocs) {
  console.log('All buttons already standardized — nothing to do.')
  process.exit(0)
}

const res = await tx.commit()
console.log(`Patched ${res.results.length} document(s).`)
