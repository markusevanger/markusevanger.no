import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { SmallProject } from '@/lib/types'
import { t } from '@/lib/types'
import type { Locale } from '@/i18n/config'

interface ProjectItemSmallProps {
  project: SmallProject
  locale: Locale
}

function isExternalLink(url: string): boolean {
  if (!url || url.startsWith('/')) return false
  try {
    const linkHost = new URL(url).hostname
    return !linkHost.endsWith('markusevanger.no')
  } catch {
    return false
  }
}

export default function ProjectItemSmall({ project, locale }: ProjectItemSmallProps) {
  const link = project.link || ''
  const isExternal = isExternalLink(link)

  if (!link) {
    return (
      <li className="grid grid-cols-[1fr_1fr_auto] items-center border-b-2 mb-2 p-2">
        <h3 className="font-bold">{t(project, 'title', locale)}</h3>
        <p className="text-sm">{t(project, 'subtitle', locale)}</p>
        <div className="w-6" />
      </li>
    )
  }

  return (
    <li>
      <Link
        href={link}
        target="_blank"
        className="group grid grid-cols-[1fr_1fr_auto] items-center border-b-2 mb-2 hover:border-b-markus-red transition-all p-2"
      >
        <h3 className="font-bold">{t(project, 'title', locale)}</h3>
        <p className="text-sm">{t(project, 'subtitle', locale)}</p>
        {isExternal ? (
          <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        ) : (
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        )}
      </Link>
    </li>
  )
}
