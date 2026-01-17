'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { HeroBlockContent } from '@/lib/sanity.types'
import AgeCounter from './AgeCounter'

interface HeroPortableTextRendererProps {
  value: HeroBlockContent | null | undefined
  birthDate?: string | null
}

export default function HeroPortableTextRenderer({
  value,
  birthDate,
}: HeroPortableTextRendererProps) {
  if (!value || value.length === 0) return null

  const components: PortableTextComponents = {
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-markus-red"
        >
          {children}
        </a>
      ),
    },
    block: {
      normal: ({ children }) => <>{children}</>,
    },
    types: {
      agePlaceholder: () => {
        if (!birthDate) return null
        return <AgeCounter birthDate={birthDate} />
      },
    },
  }

  return <PortableText value={value} components={components} />
}
