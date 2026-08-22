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
import SilhouettePreview from './SilhouettePreview'
import AnimatedSkills from './AnimatedSkills'
import {
  radarForProject,
  radarPath,
  radarNest,
  type SilhouetteAnchor,
  type ProjectTech,
} from '@/lib/silhouette'

interface ProjectIndexProps {
  projects: PortfolioProject[]
  locale: Locale
  title: string
  // Corner anchors from site settings; drive how each blob leans by discipline.
  anchors?: SilhouetteAnchor[]
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
  technologies: ProjectTech[]
}

function normalize(project: PortfolioProject, locale: Locale): IndexProject {
  const image = project.image ?? null
  const buttons = project.buttons ?? null
  const link = project.link ?? null
  const dims = image?.dimensions ?? null
  const technologies = project.technologies ?? []
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
    technologies,
  }
}

export default function ProjectIndex({
  projects: input,
  locale,
  title,
  anchors,
}: ProjectIndexProps) {
  const reduce = useReducedMotion()
  const projects = useMemo(
    () => input.map((p) => normalize(p, locale)),
    [input, locale]
  )

  // `previewId` tracks the hovered/focused row instantly (drives the row
  // highlight and the sibling dimming) and is null when the pointer/focus is off the list — no
  // row is marked active just because the page loaded. `committedId` lags
  // behind by a beat so the heavier aside — which swaps a full card and fires
  // an image request — only updates once the pointer settles on a row, not for
  // every row swept past, and it stays put once the pointer leaves.
  const [previewId, setPreviewId] = useState<string | null>(null)
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

  // Instant: row highlight (null when nothing is hovered or focused).
  // Committed (debounced): the aside card + its blob, which always shows one.
  const active = projects.find((p) => p.id === previewId) ?? null
  const committed = projects.find((p) => p.id === committedId) ?? projects[0]
  // The highlighted row falls back to the committed project so the list always
  // marks whichever card the aside is previewing, even with the pointer away.
  const highlightId = active?.id ?? committed?.id

  if (projects.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="min-w-0 px-2 font-[Mogi] text-3xl font-bold text-markus-red">{title}</h2>
      </div>

      <div className="grid min-w-0 gap-x-12 md:grid-cols-[1fr_340px]">
      <ul className="flex min-w-0 flex-col" onMouseLeave={() => setPreviewId(null)}>
        {projects.map((project) => {
          const isOpen = openId === project.id
          const isActive = highlightId === project.id
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
                onBlur={() => {
                  // Only drop the highlight if it is still ours — a pointer may
                  // already have moved it to another row.
                  setPreviewId((current) => (current === project.id ? null : current))
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
                className={`group relative flex w-full items-center justify-between gap-4 py-3 text-left transition-[color,opacity] duration-300 ease-out hover:text-markus-red focus:outline-none focus-visible:rounded-sm focus-visible:text-markus-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-markus-red ${
                  isActive ? 'md:text-markus-red' : active ? 'md:opacity-40' : ''
                }`}
              >
                <span className="min-w-0 flex-1 transition-transform duration-300 ease-out group-hover:translate-x-1">
                  <span className="flex items-baseline gap-2 font-bold">
                    <span>{project.title}</span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {/* Mobile-only: rows expand on tap; desktop uses the aside. */}
                  <ChevronDown
                    size={16}
                    aria-hidden
                    className={`text-gray-400 transition-transform duration-300 ease-out md:hidden ${
                      isOpen ? 'rotate-180 text-markus-red' : ''
                    }`}
                  />
                </span>
              </button>

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
                      <ProjectDetail project={project} locale={locale} anchors={anchors} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>

      {/* Desktop detail panel. Focusable (tabIndex -1) so keyboard row
          activation can move focus here, keeping every project's links reachable.
          Every card renders stacked in the same grid cell (hidden ones inert),
          so the aside always measures the tallest card and the page height
          stays put when the committed project changes. */}
      <aside className="hidden md:block">
        <div
          ref={asideRef}
          id={detailPanelId}
          role="region"
          aria-label={locale === 'no' ? 'Prosjektdetaljer' : 'Project details'}
          tabIndex={-1}
          className="sticky top-6 grid rounded-lg focus:outline-2 focus:outline-offset-4 focus:outline-markus-red"
        >
          {projects.map((project, idx) => {
            const isCommitted = project.id === committed?.id
            return (
              <motion.div
                key={project.id}
                className="col-start-1 row-start-1"
                inert={isCommitted ? undefined : true}
                initial={false}
                animate={{ opacity: isCommitted ? 1 : 0, y: isCommitted ? 0 : 10 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectMeta
                  project={project}
                  locale={locale}
                  anchors={anchors}
                  interactive={isDesktop && isCommitted}
                  priority={idx === 0}
                />
              </motion.div>
            )
          })}
        </div>
      </aside>
      </div>
    </div>
  )
}

// Mobile-only: the expanded row's detail. The header is omitted because the row
// directly above already shows the title, subtitle and period.
function ProjectDetail({
  project,
  locale,
  anchors,
}: {
  project: IndexProject
  locale: Locale
  anchors?: SilhouetteAnchor[]
}) {
  return <ProjectMeta project={project} locale={locale} anchors={anchors} showHeader={false} />
}

// Meta block shared by the desktop pane and the mobile expanded row. Title
// leads, the screenshot is the hero visual, then description and links.
function ProjectMeta({
  project,
  locale,
  anchors,
  interactive = false,
  priority = false,
  showHeader = true,
}: {
  project: IndexProject
  locale: Locale
  anchors?: SilhouetteAnchor[]
  // Pointer-interactive blob (cursor swirl). Desktop aside only — on touch an
  // interactive field sets `touch-action: none` and swallows vertical scroll.
  interactive?: boolean
  priority?: boolean
  // The mobile accordion sets this false: the row above already shows the
  // title/subtitle/period, so repeating them in the panel reads as duplicated.
  showHeader?: boolean
}) {
  const { image, dimensions, title, subtitle, period, description, buttons, link } = project

  // A discipline radar over the configured anchors. The skill names themselves
  // are exposed textually by <AnimatedSkills> below, so the blob is decorative.
  const axes = radarForProject(project.technologies, anchors)
  const path = radarPath(axes)
  const nest = radarNest(axes)

  return (
    <div className="flex flex-col gap-5">
      {showHeader && (
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          {period && (
            <span className="text-sm text-gray-500 tabular-nums">{period}</span>
          )}
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
        <PortableTextRenderer
          value={description}
          className="break-words text-sm text-pretty text-gray-700"
        />
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

      {/* The blob is a radar of the technologies, so it sits with the tag
          list as one unit — a small glyph beside the tags, not a second hero. */}
      <div className="mt-2 flex items-center gap-4">
        {project.technologies.length > 0 && (
          <div className="min-w-0 flex-1">
            <AnimatedSkills
              skills={project.technologies.map((tech) => ({
                _id: tech._id,
                name: tech.name ?? null,
                url: tech.url,
                icon: tech.icon,
              }))}
            />
          </div>
        )}
        <div className="ml-auto w-24 shrink-0">
          <SilhouettePreview
            path={path}
            nest={nest}
            interactive={interactive}
            height="96px"
            radiusScale={0.46}
          />
        </div>
      </div>
    </div>
  )
}
