'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { SmallProject } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/types'

interface ProjectItemSmallProps {
  project: SmallProject
}

export default function ProjectItemSmall({ project }: ProjectItemSmallProps) {
  const { language } = useLanguage()
  const link = project.externalUrl || project.githubUrl || ''

  if (!link) {
    return (
      <div className="grid grid-cols-[1fr_1fr_auto] border-b-2 mb-2 p-2">
        <h3 className="font-bold">{t(project, 'title', language)}</h3>
        <p className="text-sm pr-2">{t(project, 'subtitle', language)}</p>
      </div>
    )
  }

  return (
    <Link
      href={link}
      target="_blank"
      className="grid grid-cols-[1fr_1fr_auto] border-b-2 mb-2 hover:border-b-markus-red transition-all p-2"
    >
      <h3 className="font-bold">{t(project, 'title', language)}</h3>
      <p className="text-sm pr-2">{t(project, 'subtitle', language)}</p>
      <ArrowRight />
    </Link>
  )
}
