import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { cvPageQuery, siteSettingsQuery } from '@/lib/queries'
import type { CvPageQueryResult, SiteSettingsQueryResult } from '@/lib/types'
import CVPageComponent from '@/components/CVPage'

export const metadata: Metadata = {
  title: 'CV | Markus Evanger',
}

async function getData() {
  const [cvPage, siteSettings] = await Promise.all([
    client.fetch<CvPageQueryResult>(cvPageQuery),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery),
  ])
  return { cvPage, siteSettings }
}

export default async function Page() {
  const { cvPage, siteSettings } = await getData()

  if (!cvPage || !siteSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-markus-red mb-4">No content found</h1>
          <p>Please run the Sanity migration and add content in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  return <CVPageComponent cvPage={cvPage} siteSettings={siteSettings} />
}
