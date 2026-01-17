import 'server-only'
import { locales, type Locale } from './config'

/**
 * Get the alternate locale path for a given path and target locale
 */
export function getLocalePath(pathname: string, targetLocale: Locale): string {
  // pathname is like /no/cv or /en or /no
  const segments = pathname.split('/')

  // segments[0] is empty string (before first /)
  // segments[1] is the locale
  if (segments.length >= 2 && locales.includes(segments[1] as Locale)) {
    segments[1] = targetLocale
  } else {
    // No locale in path, prepend it
    segments.splice(1, 0, targetLocale)
  }

  return segments.join('/') || `/${targetLocale}`
}

/**
 * Get all alternate paths for hreflang
 */
export function getAlternatePaths(pathname: string): Record<Locale, string> {
  return {
    no: getLocalePath(pathname, 'no'),
    en: getLocalePath(pathname, 'en'),
  }
}
