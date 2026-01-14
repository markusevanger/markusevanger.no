'use client'

import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { useLanguage } from '@/context/LanguageContext'
import type { Language } from '@/lib/types'

export interface ButtonData {
  text_en?: string | null
  text_no?: string | null
  link?: string | null
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

function getButtonText(button: ButtonData, language: Language): string {
  if (language === 'no' && button.text_no) return button.text_no
  return button.text_en || ''
}

export default function Button({ button, className = '' }: ButtonProps) {
  const { language } = useLanguage()

  if (!button.link) return null

  const buttonClass = buttonStyles[button.type || 'primary'] || 'button-primary'
  const text = getButtonText(button, language)

  return (
    <a
      href={button.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonClass} ${className}`}
    >
      {button.icon && (
        <DynamicIcon name={button.icon as IconName} size={16} />
      )}
      {text}
    </a>
  )
}
