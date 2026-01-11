'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      className="w-fit h-fit mb-10 underline hover:text-markus-red cursor-pointer"
      onClick={toggleLanguage}
    >
      {language === 'en' ? 'Bytt til Norsk' : 'Swap to English'}
    </button>
  )
}
