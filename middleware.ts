// Re-export middleware from proxy.ts
// Next.js requires the middleware file at project root with function named 'middleware'
// Note: config must be defined here directly (can't be re-exported)
import { proxy } from '@/proxy'

export const middleware = proxy

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicons|.*\\..*|robots\\.txt|sitemap\\.xml).*)',
  ],
}
