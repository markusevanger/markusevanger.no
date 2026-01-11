'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/types'
import { urlFor } from '@/lib/sanity'

interface ProjectCarouselProps {
  projects: Project[]
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const shouldReduceMotion = useReducedMotion()
  const { language } = useLanguage()
  const scrollRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselAutoRun, setCarouselAutoRun] = useState(true)

  const goTo = useCallback((index: number) => {
    if (scrollRef.current) {
      const child = scrollRef.current.children[index] as HTMLElement
      if (child) {
        scrollRef.current.scrollTo({
          left: child.offsetLeft,
          behavior: 'smooth',
        })
        setActiveIndex(index)
      }
    }
  }, [])

  const next = useCallback(() => {
    goTo((activeIndex + 1) % projects.length)
  }, [activeIndex, projects.length, goTo])

  const prev = useCallback(() => {
    goTo((activeIndex - 1 + projects.length) % projects.length)
  }, [activeIndex, projects.length, goTo])

  useEffect(() => {
    if (!carouselAutoRun || shouldReduceMotion) return

    const interval = setInterval(() => {
      goTo((activeIndex + 1) % projects.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, carouselAutoRun, projects.length, shouldReduceMotion, goTo])

  const hasPrevPage = activeIndex > 0
  const hasNextPage = activeIndex < projects.length - 1

  return (
    <>
      <div
        className="flex items-center gap-2"
        onMouseEnter={() => setCarouselAutoRun(false)}
        onMouseLeave={() => setCarouselAutoRun(true)}
      >
        <button
          tabIndex={0}
          className={`transition-all hover:text-markus-red focus:text-markus-red ${
            hasPrevPage ? 'opacity-40 hover:opacity-100' : 'invisible cursor-default'
          } -ml-8`}
          onClick={prev}
        >
          <ChevronLeftCircle />
        </button>

        <ul
          className="flex flex-1 scrollbar-none scroll-smooth overflow-x-auto snap-x snap-mandatory gap-10"
          ref={scrollRef}
        >
          {projects.map((project, index) => (
            <li
              key={project._id}
              className="w-full flex-shrink-0 snap-center p-1"
            >
              <div className="aspect-video rounded-2xl outline outline-markus-red shadow-md transition-all overflow-hidden relative">
                {project.image && (
                  <Image
                    src={urlFor(project.image).width(800).url()}
                    alt={t(project, 'imageAlt', language) || t(project, 'title', language)}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col">
                <div>
                  <h2 className="font-bold mt-2 text-lg">
                    {t(project, 'title', language)}
                  </h2>
                  <p className="italic text-sm">{t(project, 'subtitle', language)}</p>
                  <p className="break-words">{t(project, 'description', language)}</p>
                </div>

                <div className="w-full flex flex-col md:flex-row justify-end gap-2 mt-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button"
                    >
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-primary"
                    >
                      {t(project, 'buttonText', language) || 'Demo'}
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          tabIndex={1}
          className={`transition-all hover:text-markus-red focus:text-markus-red focus:opacity-100 ${
            hasNextPage ? 'opacity-40 hover:opacity-100' : 'invisible cursor-default'
          } -mr-8`}
          onClick={next}
        >
          <ChevronRightCircle />
        </button>
      </div>

      <div className="flex gap-1 justify-center mt-4">
        {projects.map((_, i) => (
          <button
            onClick={() => goTo(i)}
            className={`transition-all rounded-full h-2 w-2 bg-markus-red ${
              activeIndex === i ? 'scale-125 mx-1' : 'opacity-40'
            }`}
            key={i}
          />
        ))}
      </div>
    </>
  )
}
