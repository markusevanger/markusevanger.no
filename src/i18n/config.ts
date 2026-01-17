export const locales = ['no', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'no'

export const localeNames: Record<Locale, string> = {
  no: 'Norsk',
  en: 'English',
}

// Maps locale to OpenGraph locale format
export const ogLocales: Record<Locale, string> = {
  no: 'no_NO',
  en: 'en_US',
}

// Metadata translations
export const siteMetadata: Record<Locale, { title: string; description: string }> = {
  no: {
    title: 'Markus Evanger',
    description: 'Portefølje og CV for Markus Evanger - Utvikler og designer',
  },
  en: {
    title: 'Markus Evanger',
    description: 'Portfolio and CV of Markus Evanger - Developer and Designer',
  },
}

export const cvMetadata: Record<Locale, { title: string; description: string }> = {
  no: {
    title: 'CV | Markus Evanger',
    description: 'CV og sammendrag for Markus Evanger - Utvikler og designer',
  },
  en: {
    title: 'CV | Markus Evanger',
    description: 'CV and resume of Markus Evanger - Developer and Designer',
  },
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
