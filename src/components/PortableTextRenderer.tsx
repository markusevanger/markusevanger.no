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
    normal: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
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
