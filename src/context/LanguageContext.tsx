'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Language } from '@/lib/types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  hasToggled: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('no')
  const [hasToggled, setHasToggled] = useState(false)

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'no' : 'en'))
    setHasToggled(true)
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, hasToggled }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
