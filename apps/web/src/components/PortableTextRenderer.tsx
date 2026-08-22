'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { BlockContent } from '@/lib/sanity.types'

interface PortableTextRendererProps {
  value: BlockContent | null | undefined
  className?: string
}

const components: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-markus-red hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
  block: {
    // `whitespace-pre-line` keeps soft breaks (Shift+Enter in the Studio, which
    // Sanity stores as a "\n" inside one block) instead of collapsing them —
    // without it the only way to break a line is a whole new paragraph.
    normal: ({ children }) => (
      <p className="mb-3 whitespace-pre-line leading-relaxed last:mb-0">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-3 ml-4 list-disc space-y-1 leading-relaxed marker:text-markus-red last:mb-0">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-3 ml-4 list-decimal space-y-1 leading-relaxed marker:text-gray-400 last:mb-0">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
}

export default function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
