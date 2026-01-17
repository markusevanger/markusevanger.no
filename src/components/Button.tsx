'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/i18n/config'

export interface ButtonData {
  text_en?: string | null
  text_no?: string | null
  link?: string | null
  internalLink?: string | null
  linkType?: 'external' | 'internal' | null
  type?: 'primary' | 'secondary' | 'outline' | 'ghost' | null
  icon?: string | null
}

interface ButtonProps {
  button: ButtonData
  locale?: Locale
  className?: string
}

const buttonStyles: Record<string, string> = {
  primary: 'button-primary',
  secondary: 'button',
  outline: 'button',
  ghost: 'button-ghost',
}

const pageRoutes: Record<string, string> = {
  frontpage: '',
  cv: '/cv',
}

function getButtonText(button: ButtonData, locale: Locale): string {
  if (locale === 'no' && button.text_no) return button.text_no
  return button.text_en || ''
}

export default function Button({ button, locale, className = '' }: ButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Extract locale from pathname if not provided as prop
  const currentLocale: Locale = locale || (pathname.startsWith('/en') ? 'en' : 'no')

  const isInternal = button.linkType === 'internal'
  const href = isInternal
    ? (button.internalLink ? `/${currentLocale}${pageRoutes[button.internalLink]}` : null)
    : button.link

  if (!href) return null

  const buttonClass = `${buttonStyles[button.type || 'primary'] || 'button-primary'} ${className}`.trim()
  const text = getButtonText(button, currentLocale)

  const handleInternalClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (document.startViewTransition) {
      document.startViewTransition(() => router.push(href!))
    } else {
      router.push(href!)
    }
  }

  if (isInternal) {
    return (
      <Link href={href} onClick={handleInternalClick} className={buttonClass}>
        {button.icon && <DynamicIcon name={button.icon as IconName} size={16} />}
        {text}
        <ArrowRight size={16} className="arrow-icon-right" />
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
    >
      {button.icon && <DynamicIcon name={button.icon as IconName} size={16} />}
      {text}
      <ArrowUpRight size={16} className="arrow-icon" />
    </a>
  )
}
