import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isValidLocale } from '@/i18n/config'

// Get the preferred locale from Accept-Language header
function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale

  // Parse Accept-Language header and find best match
  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, quality] = lang.trim().split(';q=')
      return {
        locale: locale.split('-')[0].toLowerCase(), // Get primary language subtag
        quality: quality ? parseFloat(quality) : 1,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  // Find first matching locale
  for (const { locale } of preferredLocales) {
    if (isValidLocale(locale)) {
      return locale
    }
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a valid locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect to locale-prefixed path
  const locale = getPreferredLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  // Preserve query string
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  // Match all paths except static files, API routes, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicons|.*\\..*|robots\\.txt|sitemap\\.xml).*)',
  ],
}
