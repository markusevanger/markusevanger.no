'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Skill } from '@/lib/types'

interface AbilityItemProps {
  skill: Skill
}

export default function AbilityItem({ skill }: AbilityItemProps) {
  if (!skill.url) {
    return (
      <li className="grid grid-cols-[1fr_auto] border-b-2 mb-2 p-2">
        <span>{skill.name}</span>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={skill.url}
        target="_blank"
        className="grid grid-cols-[1fr_auto] border-b-2 mb-2 hover:border-b-markus-red transition-all p-2"
      >
        <span>{skill.name}</span>
        <ArrowRight />
      </Link>
    </li>
  )
}
