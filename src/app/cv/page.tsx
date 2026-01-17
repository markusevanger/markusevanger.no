import type { Metadata } from 'next'
import { client, urlFor } from '@/lib/sanity'
import { cvPageQuery, siteSettingsQuery } from '@/lib/queries'
import type { CvPageQueryResult, SiteSettingsQueryResult } from '@/lib/types'
import CVPageComponent from '@/components/CVPage'

const siteUrl = 'https://markusevanger.no'

async function getData() {
  const [cvPage, siteSettings] = await Promise.all([
    client.fetch<CvPageQueryResult>(cvPageQuery),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery),
  ])
  return { cvPage, siteSettings }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteSettings } = await getData()

  const profileImageUrl = siteSettings?.cvProfileImage
    ? urlFor(siteSettings.cvProfileImage).width(1200).height(630).url()
    : undefined

  return {
    title: 'CV | Markus Evanger',
    description: 'CV and resume of Markus Evanger - Developer and Designer',
    openGraph: {
      title: 'CV | Markus Evanger',
      description: 'CV and resume of Markus Evanger - Developer and Designer',
      url: `${siteUrl}/cv`,
      type: 'profile',
      images: profileImageUrl ? [{ url: profileImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CV | Markus Evanger',
      description: 'CV and resume of Markus Evanger - Developer and Designer',
      images: profileImageUrl ? [profileImageUrl] : undefined,
    },
  }
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

  const profileImageUrl = siteSettings.cvProfileImage
    ? urlFor(siteSettings.cvProfileImage).width(400).height(400).url()
    : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteSettings.name || 'Markus Evanger',
    url: siteUrl,
    email: siteSettings.email,
    jobTitle: 'Developer and Designer',
    image: profileImageUrl,
    sameAs: [
      siteSettings.githubUrl,
      siteSettings.linkedinUrl,
    ].filter(Boolean),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CVPageComponent cvPage={cvPage} siteSettings={siteSettings} />
    </>
  )
}
