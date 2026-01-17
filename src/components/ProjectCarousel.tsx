'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'
import Image from 'next/image'
import type { FeaturedProject } from '@/lib/types'
import { t, tPortableText } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import type { Locale } from '@/i18n/config'
import Button from './Button'
import PortableTextRenderer from './PortableTextRenderer'
import { toPlainText } from '@portabletext/react'

interface ProjectCarouselProps {
  projects: FeaturedProject[]
  locale: Locale
}

export default function ProjectCarousel({ projects, locale }: ProjectCarouselProps) {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoRunning, setIsAutoRunning] = useState(true)
  const isPausedByHover = useRef(false)

  // Find the project with the most content to use for height calculation
  const tallestProject = useMemo(() => {
    return projects.reduce((longest, current) => {
      const currentDesc = tPortableText(current, 'description', locale)
      const longestDesc = tPortableText(longest, 'description', locale)
      const currentLength =
        (t(current, 'title', locale)?.length || 0) +
        (t(current, 'subtitle', locale)?.length || 0) +
        (currentDesc ? toPlainText(currentDesc).length : 0) +
        (current.buttons?.length || 0) * 20
      const longestLength =
        (t(longest, 'title', locale)?.length || 0) +
        (t(longest, 'subtitle', locale)?.length || 0) +
        (longestDesc ? toPlainText(longestDesc).length : 0) +
        (longest.buttons?.length || 0) * 20
      return currentLength > longestLength ? current : longest
    }, projects[0])
  }, [projects, locale])

  const goTo = (index: number, dir?: number) => {
    if (index === activeIndex) return
    const newDir = dir ?? (index > activeIndex ? 1 : -1)
    setDirection(newDir)
    setActiveIndex(index)
  }

  const next = () => {
    setIsAutoRunning(false)
    const nextIndex = (activeIndex + 1) % projects.length
    goTo(nextIndex, 1)
  }

  const prev = () => {
    setIsAutoRunning(false)
    const prevIndex = (activeIndex - 1 + projects.length) % projects.length
    goTo(prevIndex, -1)
  }

  const goToManual = (index: number) => {
    setIsAutoRunning(false)
    goTo(index)
  }

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoRunning || shouldReduceMotion || projects.length <= 1) return

    const interval = setInterval(() => {
      if (!isPausedByHover.current) {
        const nextIndex = (activeIndex + 1) % projects.length
        setDirection(1)
        setActiveIndex(nextIndex)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, isAutoRunning, projects.length, shouldReduceMotion])

  const showChevrons = projects.length > 1
  const project = projects[activeIndex]

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
    }),
    center: {
      x: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
    }),
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onMouseEnter={() => { isPausedByHover.current = true }}
      onMouseLeave={() => { isPausedByHover.current = false }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous project"
          className={`hidden md:block transition-all hover:text-markus-red focus:text-markus-red shrink-0 opacity-70 hover:opacity-100 cursor-pointer ${
            showChevrons ? '' : 'invisible'
          }`}
          onClick={prev}
        >
          <ChevronLeftCircle aria-hidden="true" />
        </button>

        <div
          className="flex-1 min-w-0 overflow-hidden relative"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Invisible sizing element using tallest project */}
          <div className="invisible p-1 pointer-events-none" aria-hidden="true">
            <div className="aspect-video rounded-2xl" />
            <div className="flex flex-col flex-1">
              <div>
                <div className="font-bold mt-2 text-lg">
                  {t(tallestProject, 'title', locale)}
                </div>
                <div className="italic text-sm">{t(tallestProject, 'subtitle', locale)}</div>
                <PortableTextRenderer value={tPortableText(tallestProject, 'description', locale)} className="break-words" />
              </div>
              {tallestProject.buttons && tallestProject.buttons.length > 0 && (
                <div className="w-full flex flex-col md:flex-row justify-end gap-2 mt-auto pt-4">
                  {tallestProject.buttons.map((button, idx) => (
                    <span key={idx} className="button-primary">
                      {button.text_en || button.text_no}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence mode="sync" custom={direction} initial={false}>
            <motion.article
              key={activeIndex}
              custom={direction}
              variants={shouldReduceMotion ? undefined : variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'tween', duration: 0.4, ease: 'easeInOut' },
              }}
              className="w-full flex flex-col p-1 absolute top-0 left-0 right-0"
              aria-roledescription="slide"
              aria-label={`${activeIndex + 1} of ${projects.length}: ${t(project, 'title', locale)}`}
            >
              <div className="aspect-video rounded-2xl outline outline-markus-red shadow-md overflow-hidden relative">
                {project.image && (
                  <Image
                    src={urlFor(project.image).width(800).format('webp').quality(80).url()}
                    alt={t(project, 'imageAlt', locale) || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                    priority={activeIndex === 0}
                    fetchPriority={activeIndex === 0 ? "high" : "auto"}
                  />
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div>
                  <h3 className="font-bold mt-2 text-lg">
                    {t(project, 'title', locale)}
                  </h3>
                  <p className="italic text-sm">{t(project, 'subtitle', locale)}</p>
                  <PortableTextRenderer value={tPortableText(project, 'description', locale)} className="break-words" />
                </div>

                {project.buttons && project.buttons.length > 0 && (
                  <div className="w-full flex flex-col md:flex-row justify-end gap-2 mt-auto pt-4">
                    {project.buttons.map((button, idx) => (
                      <Button key={idx} button={button} locale={locale} />
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <button
          type="button"
          aria-label="Next project"
          className={`hidden md:block transition-all hover:text-markus-red focus:text-markus-red shrink-0 opacity-70 hover:opacity-100 cursor-pointer ${
            showChevrons ? '' : 'invisible'
          }`}
          onClick={next}
        >
          <ChevronRightCircle aria-hidden="true" />
        </button>
      </div>

      <div className="flex gap-2 items-center justify-center mt-4">
        {showChevrons && (
          <button
            type="button"
            aria-label="Previous project"
            className="md:hidden transition-all hover:text-markus-red focus:text-markus-red opacity-80 hover:opacity-100 cursor-pointer"
            onClick={prev}
          >
            <ChevronLeftCircle size={20} aria-hidden="true" />
          </button>
        )}

        <div
          className="flex gap-2"
          role="tablist"
          aria-label="Select project"
        >
          {projects.map((p, i) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Go to project ${i + 1}: ${t(p, 'title', locale)}`}
              onClick={() => goToManual(i)}
              className="transition-all rounded-full min-h-6 min-w-6 flex items-center justify-center cursor-pointer"
              key={p._id}
            >
              <span className={`rounded-full h-2 w-2 bg-markus-red transition-all ${
                activeIndex === i ? 'scale-125' : 'opacity-70'
              }`} />
            </button>
          ))}
        </div>

        {showChevrons && (
          <button
            type="button"
            aria-label="Next project"
            className="md:hidden transition-all hover:text-markus-red focus:text-markus-red opacity-80 hover:opacity-100 cursor-pointer"
            onClick={next}
          >
            <ChevronRightCircle size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  )
}
