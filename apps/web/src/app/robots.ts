import type { MetadataRoute } from 'next'

const siteUrl = 'https://markusevanger.no'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sanity/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
