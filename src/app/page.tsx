import { client } from '@/lib/sanity'
import { frontpageQuery, siteSettingsQuery } from '@/lib/queries'
import type { FrontpageQueryResult, SiteSettingsQueryResult } from '@/lib/types'
import HomePage from '@/components/HomePage'

export const dynamic = 'force-dynamic'

async function getData() {
  const [frontpage, siteSettings] = await Promise.all([
    client.fetch<FrontpageQueryResult>(frontpageQuery),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery),
  ])
  return { frontpage, siteSettings }
}

export default async function Page() {
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

  return <HomePage frontpage={frontpage} siteSettings={siteSettings} />
}
