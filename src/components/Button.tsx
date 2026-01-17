'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import type { Language } from '@/lib/types'

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
  className?: string
}

const buttonStyles: Record<string, string> = {
  primary: 'button-primary',
  secondary: 'button',
  outline: 'button',
  ghost: 'button-ghost',
}

const pageRoutes: Record<string, string> = {
  frontpage: '/',
  cv: '/cv',
}

function getButtonText(button: ButtonData, language: Language): string {
  if (language === 'no' && button.text_no) return button.text_no
  return button.text_en || ''
}

export default function Button({ button, className = '' }: ButtonProps) {
  const { language } = useLanguage()

  const isInternal = button.linkType === 'internal'
  const href = isInternal
    ? (button.internalLink ? pageRoutes[button.internalLink] : null)
    : button.link

  if (!href) return null

  const buttonClass = `${buttonStyles[button.type || 'primary'] || 'button-primary'} ${className}`.trim()
  const text = getButtonText(button, language)

  const router = useRouter()

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
