import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'

const siteUrl = 'https://markusevanger.no'

// Define all routes
const routes = ['', '/cv']

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    // Create alternates object for hreflang
    const languages: Record<string, string> = {}
    for (const locale of locales) {
      languages[locale] = `${siteUrl}/${locale}${route}`
    }
    languages['x-default'] = `${siteUrl}/no${route}`

    // Add entry for each locale
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages,
        },
      })
    }
  }

  return sitemapEntries
}
