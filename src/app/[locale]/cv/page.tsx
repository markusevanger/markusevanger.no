import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { cvPageQuery, siteSettingsQuery } from '@/lib/queries'
import type { CvPageQueryResult, SiteSettingsQueryResult } from '@/lib/types'
import CVPageComponent from '@/components/CVPage'
import { isValidLocale, cvMetadata, ogLocales, locales } from '@/i18n/config'

const siteUrl = 'https://markusevanger.no'

type Props = {
  params: Promise<{ locale: string }>
}

async function getData() {
  const [cvPage, siteSettings] = await Promise.all([
    client.fetch<CvPageQueryResult>(cvPageQuery),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery),
  ])
  return { cvPage, siteSettings }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const { siteSettings } = await getData()
  const meta = cvMetadata[locale]

  const profileImageUrl = siteSettings?.cvProfileImage
    ? urlFor(siteSettings.cvProfileImage).width(1200).height(630).url()
    : undefined

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: locale === 'no' ? `${siteUrl}/cv` : `${siteUrl}/${locale}/cv`,
      languages: {
        'no': `${siteUrl}/no/cv`,
        'en': `${siteUrl}/en/cv`,
        'x-default': `${siteUrl}/no/cv`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: locale === 'no' ? `${siteUrl}/cv` : `${siteUrl}/${locale}/cv`,
      type: 'profile',
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: profileImageUrl ? [{ url: profileImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: profileImageUrl ? [profileImageUrl] : undefined,
    },
  }
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

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
    inLanguage: locale,
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
      <CVPageComponent cvPage={cvPage} siteSettings={siteSettings} locale={locale} />
    </>
  )
}
