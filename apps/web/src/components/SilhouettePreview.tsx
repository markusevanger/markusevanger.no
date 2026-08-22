'use client'

import TopographicField from './TopographicField'
import { RADAR_FRAME, type Lean } from '@/lib/silhouette'

type Props = {
  /** Radar blob `d` (in the RADAR_FRAME box) for this project. */
  path: string
  /** Where the contour rings nest — the summit over the dominant discipline. */
  nest?: Lean
  interactive?: boolean
  height?: string
  radiusScale?: number
  className?: string
}

// A radar chart drawn as a topographic field: the blob reaches toward the
// disciplines a project uses, the rings summit over its strongest one.
export default function SilhouettePreview({
  path,
  nest,
  interactive = false,
  height = 'clamp(160px, 22vh, 200px)',
  radiusScale = 0.52,
  className,
}: Props) {
  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <TopographicField
        path={path}
        frame={RADAR_FRAME}
        nestCenter={nest}
        radiusScale={radiusScale}
        interactive={interactive}
        secondaryColor="#dc2626"
        height={height}
      />
    </div>
  )
}
