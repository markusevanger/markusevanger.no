import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { client } from '@/lib/sanity'
import { frontpageQuery, siteSettingsQuery } from '@/lib/queries'
import type { FrontpageQueryResult, SiteSettingsQueryResult } from '@/lib/types'
import { t } from '@/lib/types'
import TopographicFieldPlayground from '@/components/TopographicFieldPlayground'
import ProjectSilhouetteGrid, { type DevProject } from '@/components/ProjectSilhouetteGrid'
import type { SilhouetteAnchor } from '@/lib/silhouette'

type Props = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Dev — Markus Evanger',
  description: 'Experiments and sketches.',
  robots: { index: false, follow: false },
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const [frontpage, siteSettings] = await Promise.all([
    client.fetch<FrontpageQueryResult>(frontpageQuery),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery),
  ])

  const anchors = (siteSettings?.silhouetteAnchors as SilhouetteAnchor[] | null) ?? []
  const projects: DevProject[] = (frontpage?.projects ?? []).map((p) => ({
    id: p._id,
    title: t(p, 'title', locale),
    featured: p.projectType === 'featured',
    technologies: p.technologies ?? [],
  }))

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-6">
        <h1 className="font-mogi text-4xl text-markus-red md:text-6xl">Dev</h1>
        <p className="mt-2 max-w-prose text-sm text-gray-600">
          Move your cursor across the field to warp the contour lines. Switch the
          frame and cursor effect below, or hit{' '}
          <span className="font-medium text-markus-red-secondary">+ SVG</span> to
          paste your own shape straight from Figma.
        </p>
      </header>

      <TopographicFieldPlayground />

      <header className="mb-6 mt-16">
        <h2 className="font-mogi text-2xl text-markus-red md:text-3xl">
          Project blobs
        </h2>
        <p className="mt-2 max-w-prose text-sm text-gray-600">
          Every project’s discipline radar. Each anchor position pinned in Site
          Settings → Homepage is one axis; the blob reaches toward the
          disciplines a project’s technologies use, and the contour summit sits
          over its strongest one.
        </p>
      </header>

      <ProjectSilhouetteGrid projects={projects} anchors={anchors} />
    </section>
  )
}
