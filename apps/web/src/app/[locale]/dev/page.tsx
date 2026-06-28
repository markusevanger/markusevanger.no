import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import TopographicFieldPlayground from '@/components/TopographicFieldPlayground'

type Props = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Dev — Markus Evanger',
  description: 'Experiments and sketches.',
  robots: { index: false, follow: false },
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-6">
        <h1 className="font-mogi text-4xl text-markus-red md:text-6xl">Dev</h1>
        <p className="mt-2 max-w-prose text-sm text-gray-600">
          Move your cursor across the field to warp the contour lines. Switch the
          frame and cursor effect below, or hit{' '}
          <span className="font-medium text-markus-red-secondary">+ SVG</span> to
          paste your own shape straight from Figma.
        </p>
      </header>

      <TopographicFieldPlayground />
    </section>
  )
}
