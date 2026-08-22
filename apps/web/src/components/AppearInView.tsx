'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

const getReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface AppearInViewProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
  offset?: number
}

export default function AppearInView({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
  offset = 16,
}: AppearInViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  )

  useEffect(() => {
    // Reduced motion renders the plain, always-visible div below — no observer needed.
    if (prefersReducedMotion) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay)
          } else {
            setIsVisible(true)
          }
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, delay, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-500 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  )
}
