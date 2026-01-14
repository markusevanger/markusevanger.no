import type { Metadata } from 'next'
import { LanguageProvider } from '@/context/LanguageContext'
import FooterWrapper from '@/components/FooterWrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'Markus Evanger',
  description: 'Portfolio and CV of Markus Evanger - Developer and Designer',
  manifest: '/favicons/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicons/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="no">
      <body>
        <LanguageProvider>
          {children}
          <FooterWrapper />
        </LanguageProvider>
      </body>
    </html>
  )
}
