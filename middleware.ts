import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['no', 'en'] as const
type Locale = (typeof locales)[number]
const defaultLocale: Locale = 'no'

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale

  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, quality] = lang.trim().split(';q=')
      return {
        locale: locale.split('-')[0].toLowerCase(),
        quality: quality ? parseFloat(quality) : 1,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { locale } of preferredLocales) {
    if (isValidLocale(locale)) {
      return locale
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  const locale = getPreferredLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicons|.*\\..*|robots\\.txt|sitemap\\.xml).*)',
  ],
}
