import type { Locale } from '@/i18n/config'

const LOCALE_TAG: Record<Locale, string> = { en: 'en-US', no: 'nb-NO' }
const PRESENT: Record<Locale, string> = { en: 'present', no: 'nå' }

// Parse a Sanity `date` value ("YYYY-MM-DD") at midday UTC so timezone offsets
// can never bump it into an adjacent month.
function monthLabel(iso: string, locale: Locale): string {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`)
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/**
 * Render a project's timeframe from its date fields, month granularity.
 *  - single month:   "Mar 2024"
 *  - range:          "Feb 2024 – May 2024"
 *  - ongoing:        "Mar 2025 – present"
 */
export function formatProjectPeriod(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  ongoing: boolean | null | undefined,
  locale: Locale
): string {
  if (!startDate) return ''
  const start = monthLabel(startDate, locale)
  if (ongoing) return `${start} – ${PRESENT[locale]}`
  if (endDate && endDate.slice(0, 7) !== startDate.slice(0, 7)) {
    return `${start} – ${monthLabel(endDate, locale)}`
  }
  return start
}
