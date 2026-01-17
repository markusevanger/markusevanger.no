import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { frontpageQuery, siteSettingsQuery } from '@/lib/queries'
import type { FrontpageQueryResult, SiteSettingsQueryResult } from '@/lib/types'
import HomePage from '@/components/HomePage'
import { isValidLocale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string }>
}

async function getData() {
  const [frontpage, siteSettings] = await Promise.all([
    client.fetch<FrontpageQueryResult>(frontpageQuery),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery),
  ])
  return { frontpage, siteSettings }
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const { frontpage, siteSettings } = await getData()

  if (!frontpage || !siteSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-markus-red mb-4">No content found</h1>
          <p>Please run the Sanity migration and add content in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  // Preload LCP image (first featured project image)
  const firstProject = frontpage.featuredProjects?.[0]
  const lcpImageUrl = firstProject?.image
    ? urlFor(firstProject.image).width(800).format('webp').quality(80).url()
    : null

  return (
    <>
      {lcpImageUrl && (
        <link
          rel="preload"
          as="image"
          href={lcpImageUrl}
          fetchPriority="high"
        />
      )}
      <HomePage frontpage={frontpage} siteSettings={siteSettings} locale={locale} />
    </>
  )
}
