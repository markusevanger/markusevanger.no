'use client'

import SilhouettePreview from './SilhouettePreview'
import {
  radarForProject,
  radarPath,
  radarNest,
  POS_LABEL,
  type SilhouetteAnchor,
  type ProjectTech,
  type AnchorPos,
} from '@/lib/silhouette'

export type DevProject = {
  id: string
  title: string
  featured: boolean
  technologies: ProjectTech[]
}

type Props = {
  projects: DevProject[]
  anchors: SilhouetteAnchor[]
}

// Dev-only: render every project's generated blob so anchors can be tuned
// against real content.
export default function ProjectSilhouetteGrid({ projects, anchors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Anchor legend: the configured positions and their skills. */}
      <div className="rounded-xl border border-markus-red/20 p-4">
        <p className="mb-3 text-sm font-medium text-markus-red-secondary">
          Anchors (technical left · design right)
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          {anchors.length === 0 && <span className="text-gray-400">None configured</span>}
          {anchors.map((a, i) => (
            <span
              key={i}
              className="rounded-lg bg-markus-red/5 px-3 py-1.5"
            >
              <span className="font-medium text-markus-red-secondary">
                {a.skillName || a.skillId || '?'}
              </span>
              <span className="text-gray-400"> · {POS_LABEL[a.corner] || '?'}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {projects.map((p) => {
          const axes = radarForProject(p.technologies, anchors)
          const nest = radarNest(axes)
          // Dominant discipline (the axis nearest the rim), for a quick readout.
          const top = axes.reduce(
            (best, a) => (a.value > best.value ? a : best),
            { pos: 'tl' as AnchorPos, value: 0, skillName: null as string | null },
          )
          return (
            <div key={p.id} className="flex flex-col items-center text-center">
              <div className="w-full max-w-[160px]">
                <SilhouettePreview
                  path={radarPath(axes)}
                  nest={nest}
                  radiusScale={0.5}
                  height="150px"
                />
              </div>
              <p className="mt-1 text-sm font-medium">{p.title}</p>
              <p className="text-xs text-gray-500">
                {top.value > 0 ? `${top.skillName || POS_LABEL[top.pos]}` : 'unclassified'}
                {p.technologies.length > 0 && (
                  <span className="text-gray-400">
                    {' '}
                    · {p.technologies.length} tech
                  </span>
                )}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
