'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import type { SanityImageSource } from '@sanity/image-url'
import type { PortfolioProject, BlockContent } from '@/lib/types'
import { t, tPortableText } from '@/lib/types'
import { formatProjectPeriod } from '@/lib/projectPeriod'
import { urlFor } from '@/lib/sanity'
import type { Locale } from '@/i18n/config'
import Button, { type ButtonData } from './Button'
import PortableTextRenderer from './PortableTextRenderer'
import TopographicField from './TopographicField'
import { silhouetteForTitle } from '@/lib/silhouette'

interface ProjectIndexProps {
  projects: PortfolioProject[]
  locale: Locale
  title: string
}

interface IndexProject {
  id: string
  kind: 'featured' | 'small'
  title: string
  subtitle: string
  period: string
  imageAlt: string
  image: SanityImageSource | null
  dimensions: { width: number; height: number } | null
  description: BlockContent | null
  buttons: ButtonData[] | null
  link: string | null
  silhouette: string | null
}

function normalize(project: PortfolioProject, locale: Locale): IndexProject {
  const image = project.image ?? null
  const buttons = project.buttons ?? null
  const link = project.link ?? null
  const dims = image?.dimensions ?? null
  return {
    id: project._id,
    kind: project.projectType === 'featured' ? 'featured' : 'small',
    title: t(project, 'title', locale),
    subtitle: t(project, 'subtitle', locale),
    period: formatProjectPeriod(project.startDate, project.endDate, project.ongoing, locale),
    imageAlt: t(project, 'imageAlt', locale),
    image,
    dimensions:
      dims?.width && dims?.height ? { width: dims.width, height: dims.height } : null,
    description: tPortableText(project, 'description', locale),
    buttons: buttons as ButtonData[] | null,
    link,
    silhouette: (project as { silhouette?: string | null }).silhouette ?? null,
  }
}

export default function ProjectIndex({ projects: input, locale, title }: ProjectIndexProps) {
  const reduce = useReducedMotion()
  const projects = useMemo(
    () => input.map((p) => normalize(p, locale)),
    [input, locale]
  )

  // `previewId` tracks the hovered/focused row instantly (drives the blob and
  // the row highlight). `committedId` lags behind by a beat so the heavier
  // aside — which swaps a full card and fires an image request — only updates
  // once the pointer settles on a row, not for every row swept past.
  const [previewId, setPreviewId] = useState(projects[0]?.id)
  const [committedId, setCommittedId] = useState(projects[0]?.id)
  // First project starts expanded in the mobile accordion.
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null)
  // The desktop detail panel; we move focus here on keyboard activation so its
  // links are reachable (see the row onClick handler).
  const asideRef = useRef<HTMLDivElement>(null)
  const detailPanelId = useId()

  // Mirror the viewport so each row's ARIA matches the actual mechanism: a
  // disclosure (accordion) on mobile, a focusable details region on desktop.
  // Starts false (mobile-first, matching SSR) and corrects after hydration.
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Debounce the aside commit while the pointer is still moving between rows.
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const commitNow = (id: string) => {
    if (commitTimer.current) {
      clearTimeout(commitTimer.current)
      commitTimer.current = null
    }
    setCommittedId(id)
  }
  const scheduleCommit = (id: string) => {
    if (commitTimer.current) clearTimeout(commitTimer.current)
    commitTimer.current = setTimeout(() => {
      commitTimer.current = null
      setCommittedId(id)
    }, 150)
  }
  useEffect(
    () => () => {
      if (commitTimer.current) clearTimeout(commitTimer.current)
    },
    []
  )

  // Instant: blob + row highlight. Committed (debounced): the aside card.
  const active = projects.find((p) => p.id === previewId) ?? projects[0]
  const committed = projects.find((p) => p.id === committedId) ?? active

  if (projects.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {/* Section header: the title with one morphing emblem beside it. The
          emblem changes shape as the active project changes (hover on desktop,
          tap on mobile), giving the section a single signature. Stacks below
          the title on small screens. */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h2 className="min-w-0 px-2 font-[Mogi] text-3xl font-bold text-markus-red">{title}</h2>
        {active && (
          <div className="mx-auto w-full max-w-[240px] sm:mx-0 sm:shrink-0">
            <TopographicField
              path={active.silhouette || silhouetteForTitle(active.title, active.kind === 'featured')}
              // Pointer-interactive only on desktop. On touch, an interactive
              // field sets `touch-action: none`, which would swallow vertical
              // scroll that starts on the blob.
              interactive={isDesktop}
              secondaryColor="#dc2626"
              height="clamp(110px, 15vh, 150px)"
            />
          </div>
        )}
      </div>

      <div className="grid min-w-0 gap-x-12 md:grid-cols-[1fr_340px]">
      <ul className="flex min-w-0 flex-col">
        {projects.map((project) => {
          const isOpen = openId === project.id
          const isActive = active?.id === project.id
          const detailId = `project-detail-${project.id}`
          return (
            <li key={project.id}>
              <button
                type="button"
                aria-expanded={isDesktop ? undefined : isOpen}
                aria-controls={isDesktop ? detailPanelId : detailId}
                onMouseEnter={() => {
                  setPreviewId(project.id)
                  scheduleCommit(project.id)
                }}
                onFocus={() => {
                  setPreviewId(project.id)
                  commitNow(project.id)
                }}
                onClick={(e) => {
                  setPreviewId(project.id)
                  commitNow(project.id)
                  setOpenId(isOpen ? null : project.id)
                  // Keyboard activation (Enter/Space) reports detail === 0 and a
                  // visible desktop aside: jump focus into the detail panel so
                  // its links are reachable without tabbing past the whole list
                  // (which would otherwise only ever land on the last project's
                  // links). Mouse clicks (detail >= 1) leave focus on the row.
                  if (e.detail === 0 && asideRef.current?.offsetParent) {
                    asideRef.current.focus()
                  }
                }}
                className={`group relative flex w-full items-baseline justify-between gap-4 border-b py-3 text-left transition-colors hover:text-markus-red focus:outline-none focus-visible:rounded-sm focus-visible:text-markus-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-markus-red ${
                  isActive ? 'md:text-markus-red' : ''
                }`}
              >
                {/* Red underline that glides between rows as the active project changes */}
                {isActive && (
                  <motion.span
                    layoutId="projectUnderline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-markus-red"
                    transition={
                      reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                    }
                  />
                )}

                <span className="min-w-0 transition-transform duration-300 ease-out group-hover:translate-x-1">
                  <span className="flex items-center gap-2 font-bold">
                    {project.kind === 'featured' && (
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-markus-red" />
                    )}
                    <span className="truncate">{project.title}</span>
                  </span>
                  {project.subtitle && (
                    <span className="mt-0.5 block truncate text-sm text-gray-500">
                      {project.subtitle}
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {project.period && (
                    <span className="text-sm text-gray-500 tabular-nums">
                      {project.period}
                    </span>
                  )}
                  {/* Mobile-only affordance: rows expand/collapse on tap. On
                      desktop the detail lives in the aside instead. */}
                  <ChevronDown
                    size={16}
                    aria-hidden
                    className={`text-gray-400 transition-transform duration-300 ease-out md:hidden ${
                      isOpen ? 'rotate-180 text-markus-red' : ''
                    }`}
                  />
                </span>
              </button>

              {/* Mobile only: tap a row to expand its detail inline. The title
                  already sits in the row above, so the panel omits it (no
                  duplicate heading). On desktop the detail lives in the aside. */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="detail"
                    id={detailId}
                    className="overflow-hidden md:hidden"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { height: { type: 'spring', stiffness: 320, damping: 34 }, opacity: { duration: 0.2 } }
                    }
                  >
                    <div className="pb-6 pt-4">
                      <ProjectDetail project={project} locale={locale} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>

      {/* Desktop: the detail panel for the hovered/focused project, with its
          working links. It's focusable (tabIndex -1) so keyboard activation of
          a row can move focus here — that's what makes every project's links
          reachable without the list becoming a keyboard trap. */}
      <aside className="hidden md:block">
        {committed && (
          <div
            ref={asideRef}
            id={detailPanelId}
            role="region"
            aria-label={locale === 'no' ? 'Prosjektdetaljer' : 'Project details'}
            tabIndex={-1}
            className="sticky top-6 rounded-lg focus:outline-2 focus:outline-offset-4 focus:outline-markus-red"
          >
            <motion.div
              key={committed.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectMeta project={committed} locale={locale} priority />
            </motion.div>
          </div>
        )}
      </aside>
      </div>
    </div>
  )
}

// Mobile-only: the expanded row's detail. The header is omitted because the row
// directly above already shows the title, subtitle and period.
function ProjectDetail({ project, locale }: { project: IndexProject; locale: Locale }) {
  return <ProjectMeta project={project} locale={locale} showHeader={false} />
}

// Meta block shared by the desktop pane and the mobile expanded row. Title
// leads, the screenshot is the hero visual, then description and links.
function ProjectMeta({
  project,
  locale,
  priority = false,
  showHeader = true,
}: {
  project: IndexProject
  locale: Locale
  priority?: boolean
  // The mobile accordion sets this false: the row above already shows the
  // title/subtitle/period, so repeating them in the panel reads as duplicated.
  showHeader?: boolean
}) {
  const { image, dimensions, title, subtitle, period, description, buttons, link } = project

  return (
    <div className="flex flex-col gap-3">
      {showHeader && (
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-bold">{title}</h3>
            {period && (
              <span className="shrink-0 text-sm text-gray-500 tabular-nums">{period}</span>
            )}
          </div>
          {subtitle && <p className="text-sm italic text-gray-600">{subtitle}</p>}
        </div>
      )}

      {image && (
        <div className="overflow-hidden rounded-xl">
          <Image
            src={urlFor(image).width(680).format('webp').quality(80).url()}
            alt={project.imageAlt || title}
            width={dimensions?.width ?? 1600}
            height={dimensions?.height ?? 1200}
            sizes="(max-width: 768px) 100vw, 340px"
            className="h-auto w-full"
            priority={priority}
          />
        </div>
      )}

      {description && (
        <PortableTextRenderer value={description} className="break-words text-sm" />
      )}

      {buttons && buttons.length > 0 ? (
        <div className="flex flex-col flex-wrap gap-2 md:flex-row">
          {buttons.map((button, idx) => (
            <Button key={idx} button={button} locale={locale} />
          ))}
        </div>
      ) : (
        link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary"
          >
            {locale === 'no' ? 'Besøk' : 'Visit'}
            <ArrowUpRight size={16} className="arrow-icon" />
          </a>
        )
      )}
    </div>
  )
}
