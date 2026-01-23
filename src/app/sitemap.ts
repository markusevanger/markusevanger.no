import type { MetadataRoute } from 'next'
import { locales, type Locale } from '@/i18n/config'

const siteUrl = 'https://markusevanger.no'

// Define all routes (without locale prefix)
const routes = ['', '/cv']

// Helper to get URL for a locale and route
function getLocaleUrl(locale: Locale, route: string): string {
  if (locale === 'no') {
    return `${siteUrl}${route}`
  }
  return `${siteUrl}/en${route}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    // Create alternates object for hreflang
    const languages: Record<string, string> = {}
    for (const locale of locales) {
      languages[locale] = getLocaleUrl(locale, route)
    }
    languages['x-default'] = getLocaleUrl('no', route)

    // Add entry for each locale
    for (const locale of locales) {
      sitemapEntries.push({
        url: getLocaleUrl(locale, route),
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
