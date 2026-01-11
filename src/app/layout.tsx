import type { Metadata } from 'next'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Markus Evanger',
  description: 'Portfolio and CV of Markus Evanger - Developer and Designer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="no">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
