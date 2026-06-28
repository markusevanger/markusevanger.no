/**
 * One-off migration: replace project `period_en`/`period_no` strings with real
 * `startDate` / `endDate` / `ongoing` date fields (month granularity), backfill
 * `projectType` on every project, and convert the frontpage's two reference
 * arrays (`featuredProjects` + `smallProjects`) into a single ordered `projects`
 * list.
 *
 * Run with the logged-in user's credentials:
 *   cd apps/studio
 *   npx sanity exec migrations/restructureProjectDates.ts --with-user-token
 *
 * Idempotent: re-running just re-sets the same values.
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Dates reconstructed from tweet timestamps, GitHub repo dates, and the old
// period strings. Stored on day 01 — only month + year are ever displayed.
const PROJECTS: Record<
  string,
  { startDate: string; endDate?: string; ongoing?: boolean; projectType: 'featured' | 'small' }
> = {
  '2230e147-907b-4134-a306-eb8b74232204': { startDate: '2025-03-01', ongoing: true, projectType: 'featured' }, // feed_
  'project-polaris': { startDate: '2024-06-01', endDate: '2024-08-01', projectType: 'featured' },
  'project-pawcast': { startDate: '2024-02-01', endDate: '2024-05-01', projectType: 'featured' },
  'project-karbon': { startDate: '2024-03-01', endDate: '2024-05-01', projectType: 'featured' },
  'project-nuovo': { startDate: '2022-05-01', projectType: 'small' },
  'project-stavanger-move': { startDate: '2022-07-01', projectType: 'small' },
  'project-disc': { startDate: '2022-07-01', projectType: 'small' },
  'project-digital-house': { startDate: '2022-03-01', projectType: 'small' },
  'project-leetcode': { startDate: '2023-10-01', projectType: 'small' },
  'project-ruter': { startDate: '2023-09-01', projectType: 'small' },
}

// Ordered portfolio list: featured group first, then small (preserves the old
// curation order, with the previously-orphaned carbon demo added to featured).
const PROJECT_ORDER = [
  '2230e147-907b-4134-a306-eb8b74232204',
  'project-polaris',
  'project-pawcast',
  'project-karbon',
  'project-nuovo',
  'project-stavanger-move',
  'project-disc',
  'project-digital-house',
  'project-leetcode',
  'project-ruter',
]

async function run() {
  const tx = client.transaction()

  for (const [id, p] of Object.entries(PROJECTS)) {
    const set: Record<string, unknown> = {
      startDate: p.startDate,
      projectType: p.projectType,
      ongoing: p.ongoing ?? false,
    }
    const unset = ['period_en', 'period_no']
    if (p.endDate) set.endDate = p.endDate
    else unset.push('endDate')
    if (p.ongoing) unset.push('endDate')
    tx.patch(id, (patch) => patch.set(set).unset(unset))
  }

  const projectsArray = PROJECT_ORDER.map((ref, i) => ({
    _type: 'reference',
    _ref: ref,
    _key: `p${i}`,
  }))

  // Patch both the published doc and its draft so Studio + site stay in sync.
  for (const id of ['frontpage', 'drafts.frontpage']) {
    tx.patch(id, (patch) =>
      patch.set({ projects: projectsArray }).unset(['featuredProjects', 'smallProjects'])
    )
  }

  const result = await tx.commit()
  console.log(`✓ Migrated ${Object.keys(PROJECTS).length} projects + frontpage`)
  console.log(`  transaction: ${result.transactionId}`)
}

run().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
