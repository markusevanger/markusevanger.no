'use client'

import { useEffect, useRef } from 'react'
import { extractPathD } from '@/lib/pathUtils'

const RED = '#dc2626'
const RED_SECONDARY = '#991b1b'

type Pt = { x: number; y: number }
// A resampled outline point at unit scale (R = 1) with its precomputed unit
// normal. Normals are scale-invariant, so we compute them once per shape and
// reuse them across every ring and resize.
type UnitPt = { x: number; y: number; nx: number; ny: number }

// Default frame: an abstract badge silhouette (paste a `d` straight from Figma).
export const BADGE_D =
  'M36.0001 0.5H140.017C147.935 0.500006 155.627 3.14775 161.867 8.02148L194.834 33.7666C201.251 38.7776 209.159 41.5 217.3 41.5H304.408C324.014 41.5 339.908 57.3939 339.908 77V181C339.908 200.606 324.014 216.5 304.408 216.5H167.394C162.002 216.5 156.681 215.271 151.835 212.908L99.0958 187.192C94.1131 184.763 88.6423 183.5 83.0988 183.5H37.8263C18.446 183.5 2.64733 167.957 2.33118 148.579L0.505005 36.5791C0.181693 16.7492 16.1676 0.5 36.0001 0.5Z'

// Dependency-free smooth pseudo-noise built from layered trig. Roughly [-1, 1].
function fbm(x: number, y: number, t: number) {
  let v = 0
  v += Math.sin(x * 1.0 + t) * Math.cos(y * 1.0 - t)
  v += 0.5 * Math.sin(x * 2.1 - t * 1.3) * Math.cos(y * 1.9 + t * 0.7)
  v += 0.25 * Math.sin(x * 4.3 + t * 0.5) * Math.cos(y * 3.7 - t)
  return v / 1.75
}

// --- SVG path → dense point list -------------------------------------------

function flattenCubic(
  out: Pt[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
) {
  const SEG = 18
  for (let s = 1; s <= SEG; s++) {
    const tt = s / SEG
    const o = 1 - tt
    out.push({
      x: o * o * o * x0 + 3 * o * o * tt * x1 + 3 * o * tt * tt * x2 + tt * tt * tt * x3,
      y: o * o * o * y0 + 3 * o * o * tt * y1 + 3 * o * tt * tt * y2 + tt * tt * tt * y3,
    })
  }
}

function flattenQuad(
  out: Pt[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const SEG = 14
  for (let s = 1; s <= SEG; s++) {
    const tt = s / SEG
    const o = 1 - tt
    out.push({
      x: o * o * x0 + 2 * o * tt * x1 + tt * tt * x2,
      y: o * o * y0 + 2 * o * tt * y1 + tt * tt * y2,
    })
  }
}

// Parse a subset of SVG path commands (M L H V C S Q T Z, abs + rel) into a
// flat point list. Arcs (A) are approximated as a line to the endpoint.
function parsePath(d: string): Pt[] {
  const tokens = d.match(/[a-df-zA-DF-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []
  const pts: Pt[] = []
  let i = 0
  let cx = 0
  let cy = 0
  let sx = 0
  let sy = 0
  let pcx = 0
  let pcy = 0
  let cmd = ''
  let prev = ''
  const num = () => parseFloat(tokens[i++])
  const isCmd = (tok: string) => /^[a-zA-Z]$/.test(tok)

  while (i < tokens.length) {
    if (isCmd(tokens[i])) cmd = tokens[i++]
    const rel = cmd === cmd.toLowerCase()
    const C = cmd.toUpperCase()

    if (C === 'M') {
      let x = num()
      let y = num()
      if (rel) {
        x += cx
        y += cy
      }
      cx = x
      cy = y
      sx = x
      sy = y
      pts.push({ x, y })
      cmd = rel ? 'l' : 'L' // subsequent coordinate pairs are implicit lineto
    } else if (C === 'L') {
      let x = num()
      let y = num()
      if (rel) {
        x += cx
        y += cy
      }
      pts.push({ x, y })
      cx = x
      cy = y
    } else if (C === 'H') {
      let x = num()
      if (rel) x += cx
      pts.push({ x, y: cy })
      cx = x
    } else if (C === 'V') {
      let y = num()
      if (rel) y += cy
      pts.push({ x: cx, y })
      cy = y
    } else if (C === 'C') {
      let x1 = num()
      let y1 = num()
      let x2 = num()
      let y2 = num()
      let x = num()
      let y = num()
      if (rel) {
        x1 += cx
        y1 += cy
        x2 += cx
        y2 += cy
        x += cx
        y += cy
      }
      flattenCubic(pts, cx, cy, x1, y1, x2, y2, x, y)
      pcx = x2
      pcy = y2
      cx = x
      cy = y
    } else if (C === 'S') {
      let x2 = num()
      let y2 = num()
      let x = num()
      let y = num()
      if (rel) {
        x2 += cx
        y2 += cy
        x += cx
        y += cy
      }
      const x1 = prev === 'C' || prev === 'S' ? 2 * cx - pcx : cx
      const y1 = prev === 'C' || prev === 'S' ? 2 * cy - pcy : cy
      flattenCubic(pts, cx, cy, x1, y1, x2, y2, x, y)
      pcx = x2
      pcy = y2
      cx = x
      cy = y
    } else if (C === 'Q') {
      let x1 = num()
      let y1 = num()
      let x = num()
      let y = num()
      if (rel) {
        x1 += cx
        y1 += cy
        x += cx
        y += cy
      }
      flattenQuad(pts, cx, cy, x1, y1, x, y)
      pcx = x1
      pcy = y1
      cx = x
      cy = y
    } else if (C === 'T') {
      let x = num()
      let y = num()
      if (rel) {
        x += cx
        y += cy
      }
      const x1 = prev === 'Q' || prev === 'T' ? 2 * cx - pcx : cx
      const y1 = prev === 'Q' || prev === 'T' ? 2 * cy - pcy : cy
      flattenQuad(pts, cx, cy, x1, y1, x, y)
      pcx = x1
      pcy = y1
      cx = x
      cy = y
    } else if (C === 'A') {
      // skip arc params (rx ry rot large sweep x y), line to endpoint
      i += 5
      let x = num()
      let y = num()
      if (rel) {
        x += cx
        y += cy
      }
      pts.push({ x, y })
      cx = x
      cy = y
    } else if (C === 'Z') {
      pts.push({ x: sx, y: sy })
      cx = sx
      cy = sy
    } else {
      i++ // unknown token, skip
    }
    prev = C
  }
  return pts
}

// A fixed mapping frame: map the path's own coordinate box (centre `cx,cy`,
// half-extent `half`) to unit space, preserving absolute position. Use this for
// shapes whose location carries meaning (e.g. a radar chart) — bbox-normalising
// them would re-centre the lobe and erase the direction.
export type Frame = { cx: number; cy: number; half: number }

// Center a point list and scale to roughly [-1, 1]. With a `frame`, the centre
// and scale are fixed (position preserved); otherwise they're taken from the
// point list's bounding box, scaling the longer axis to fill.
function normalize(pts: Pt[], frame?: Frame | null): Pt[] {
  if (frame) {
    const half = frame.half || 1
    return pts.map((p) => ({ x: (p.x - frame.cx) / half, y: (p.y - frame.cy) / half }))
  }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }
  const mx = (minX + maxX) / 2
  const my = (minY + maxY) / 2
  const half = Math.max(maxX - minX, maxY - minY) / 2 || 1
  return pts.map((p) => ({ x: (p.x - mx) / half, y: (p.y - my) / half }))
}

// Resample a closed point list into `n` evenly spaced points at unit scale,
// precomputing each point's unit normal (direction from center). Done once per
// shape — rings and resizes just multiply by a radius.
function resampleUnit(src: Pt[], n: number): UnitPt[] {
  const edges = src.map((c, i) => {
    const next = src[(i + 1) % src.length]
    return Math.hypot(next.x - c.x, next.y - c.y)
  })
  const perimeter = edges.reduce((a, b) => a + b, 0) || 1

  const out: UnitPt[] = []
  for (let i = 0; i < n; i++) {
    let dist = (i / n) * perimeter
    let e = 0
    while (dist > edges[e] && e < edges.length - 1) {
      dist -= edges[e]
      e++
    }
    const c = src[e]
    const next = src[(e + 1) % src.length]
    const tt = edges[e] ? dist / edges[e] : 0
    const x = c.x + (next.x - c.x) * tt
    const y = c.y + (next.y - c.y) * tt
    const len = Math.hypot(x, y) || 0.0001
    out.push({ x, y, nx: x / len, ny: y / len })
  }
  return out
}

// Parse + normalize + resample a path string into a unit outline. Returns an
// empty array if the input has no usable path (caller draws nothing).
function unitOutline(input: string, segments: number, frame?: Frame | null): UnitPt[] {
  const d = extractPathD(input)
  if (!d) return []
  const pts = normalize(parsePath(d), frame)
  if (pts.length < 3) return []
  return resampleUnit(pts, segments)
}

// Rotate `to` so its start index best matches `from`, minimizing point-to-point
// distance. Both outlines are resampled to the same length, so a circular shift
// is enough to stop the rings from visibly spinning as one shape morphs into the
// next. Sampled (not exhaustive) to stay cheap — it runs once per shape change.
function alignOutline(from: UnitPt[], to: UnitPt[]): UnitPt[] {
  const n = from.length
  const step = Math.max(1, Math.floor(n / 64))
  let best = 0
  let bestErr = Infinity
  for (let off = 0; off < n; off += step) {
    let err = 0
    for (let k = 0; k < n; k += step) {
      const a = from[k]
      const b = to[(k + off) % n]
      const dx = a.x - b.x
      const dy = a.y - b.y
      err += dx * dx + dy * dy
    }
    if (err < bestErr) {
      bestErr = err
      best = off
    }
  }
  if (best === 0) return to
  const out: UnitPt[] = new Array(n)
  for (let k = 0; k < n; k++) out[k] = to[(k + best) % n]
  return out
}

// Linear-blend two same-length unit outlines, recomputing each blended point's
// normal from its position (direction from center).
function lerpOutline(from: UnitPt[], to: UnitPt[], e: number): UnitPt[] {
  const n = from.length
  const out: UnitPt[] = new Array(n)
  for (let k = 0; k < n; k++) {
    const a = from[k]
    const b = to[k]
    const x = a.x + (b.x - a.x) * e
    const y = a.y + (b.y - a.y) * e
    const len = Math.hypot(x, y) || 0.0001
    out[k] = { x, y, nx: x / len, ny: y / len }
  }
  return out
}

// Largest point-to-point gap between two same-length outlines (unit space).
// Used to decide when an exponential shape-chase has effectively converged.
function maxPointDelta(a: UnitPt[], b: UnitPt[]): number {
  let m = 0
  for (let k = 0; k < a.length; k++) {
    const dx = a[k].x - b[k].x
    const dy = a[k].y - b[k].y
    const d = dx * dx + dy * dy
    if (d > m) m = d
  }
  return Math.sqrt(m)
}

type Props = {
  /** SVG `d` string or full SVG markup. Morphs from the previous shape on change. */
  path?: string
  /** Morph duration in ms when `path` changes. Default 380. */
  morphMs?: number
  /** Mirror the cursor swirl across the vertical center line. Default true. */
  mirror?: boolean
  /** Respond to the pointer. Set false for a purely decorative, ambient field. */
  interactive?: boolean
  /** CSS height for the canvas box. Default `min(80vh, 680px)`. */
  height?: string
  /** Field radius as a fraction of the box's shorter side. Default 0.42. */
  radiusScale?: number
  /** Map with a fixed centre/scale instead of bbox-normalising, preserving the
   *  shape's absolute position (e.g. a radar chart). Default null = fill the box. */
  frame?: Frame | null
  /** Unit-space point the contour rings nest toward (+x right, +y down). Default
   *  centre; a radar chart points it at the dominant discipline's summit. */
  nestCenter?: { x: number; y: number }
  /** Outer contour color. */
  primaryColor?: string
  /** Inner contour + solid frame color. */
  secondaryColor?: string
  className?: string
}

// Ring count and line weights scale with the field's radius so a small field
// doesn't crowd 15 thick rings into a tiny box. Large fields cap at MAX_RINGS.
const MAX_RINGS = 15
const RING_SPACING_PX = 16 // target gap between contour rings
const SEGMENTS = 200

// Tilt spring (see spinRef). Stiffness tuned to settle in roughly the morph
// time; the impulse sizes the peak tilt (~7° from rest). Because impulses add
// to velocity, interrupting a rotation nudges it instead of snapping it.
const SPIN_STIFFNESS = 120
const SPIN_IMPULSE = 3.8
// Shape-chase has converged once no point is further than this from target.
const SHAPE_CONVERGE_EPS = 0.0015

export default function TopographicField({
  path = BADGE_D,
  morphMs = 380,
  mirror = true,
  interactive = true,
  height = 'min(80vh, 680px)',
  radiusScale = 0.42,
  frame = null,
  nestCenter = { x: 0, y: 0 },
  primaryColor = RED,
  secondaryColor = RED_SECONDARY,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Live config read inside the rAF loop without re-running the effect.
  // `displayUnitRef` is the outline currently drawn; during a morph it eases
  // each frame from its current shape toward `targetUnitRef`.
  const displayUnitRef = useRef<UnitPt[]>([])
  // The shape we're chasing. Each frame the displayed outline eases toward it
  // (exponential smoothing), so re-targeting mid-morph is seamless — we always
  // blend from the current shape and never restart a fixed-duration tween.
  const targetUnitRef = useRef<UnitPt[]>([])
  const morphingRef = useRef(false)
  // Tilt is a critically-damped spring (angle + velocity), not a value tied to
  // morph progress: each switch adds an angular impulse that decays smoothly to
  // 0. Additive impulses mean rapid hovering nudges the tilt instead of
  // snapping it to a fresh value mid-rotation.
  const spinRef = useRef(0)
  const spinVelRef = useRef(0)
  // Alternates ±1 each switch so consecutive impulses tilt opposite ways.
  const spinDirRef = useRef(1)
  const morphMsRef = useRef(morphMs)
  const mirrorRef = useRef(mirror)
  const interactiveRef = useRef(interactive)
  const radiusScaleRef = useRef(radiusScale)
  const frameRef = useRef(frame)
  const nestCenterRef = useRef(nestCenter)
  const colorRef = useRef({ primary: primaryColor, secondary: secondaryColor })
  morphMsRef.current = morphMs
  mirrorRef.current = mirror
  interactiveRef.current = interactive
  radiusScaleRef.current = radiusScale
  frameRef.current = frame
  nestCenterRef.current = nestCenter
  colorRef.current = { primary: primaryColor, secondary: secondaryColor }

  // Lets the path effect wake the rAF loop if it's idle (reduced-motion case).
  const kickRef = useRef<(() => void) | null>(null)

  // Parse the path once per change (off the render path, off the rAF loop) and
  // kick off a morph from whatever is currently displayed.
  const needsRebuildRef = useRef(true)
  useEffect(() => {
    const next = unitOutline(path, SEGMENTS, frameRef.current)
    const prev = displayUnitRef.current
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prev.length === next.length && prev.length > 0 && !reduced) {
      // Re-target the chase from the current shape and add a tilt impulse.
      targetUnitRef.current = alignOutline(prev, next)
      morphingRef.current = true
      spinDirRef.current *= -1
      spinVelRef.current += spinDirRef.current * SPIN_IMPULSE
    } else {
      // First paint, reduced motion, or a segment-count mismatch: snap.
      displayUnitRef.current = next
      targetUnitRef.current = next
      morphingRef.current = false
      spinRef.current = 0
      spinVelRef.current = 0
    }
    needsRebuildRef.current = true
    kickRef.current?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, frame?.cx, frame?.cy, frame?.half])

  // A nestCenter change moves the ring summit; repaint when idle.
  useEffect(() => {
    needsRebuildRef.current = true
    kickRef.current?.()
  }, [nestCenter.x, nestCenter.y])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let cx = 0
    let cy = 0
    let R = 0
    let lastNow = 0 // previous frame timestamp, for spring/chase time steps

    // Cached per-resize geometry: outline scaled to R, plus the frame Path2D
    // used for both the clip and the solid top stroke.
    let scaled: UnitPt[] = []
    let framePath: Path2D | null = null

    const pointer = { x: -9999, y: -9999, active: false }
    const smooth = { x: -9999, y: -9999, strength: 0 }

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReduced = reduceQuery.matches

    let rafId = 0
    let visible = false
    const start = performance.now()

    function rebuild() {
      const unit = displayUnitRef.current
      scaled = unit.map((p) => ({ x: p.x * R, y: p.y * R, nx: p.nx, ny: p.ny }))
      if (scaled.length >= 3) {
        const fp = new Path2D()
        scaled.forEach((p, i) => {
          const x = cx + p.x
          const y = cy + p.y
          if (i === 0) fp.moveTo(x, y)
          else fp.lineTo(x, y)
        })
        fp.closePath()
        framePath = fp
      } else {
        framePath = null
      }
      needsRebuildRef.current = false
    }

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      cx = width / 2
      cy = height / 2
      R = Math.min(width, height) * radiusScaleRef.current
      rebuild()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function onMove(e: PointerEvent) {
      if (!canvas || !interactiveRef.current) return
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
      kick() // wake the loop if it's idle (reduced-motion case)
    }
    function onLeave() {
      pointer.active = false
      kick()
    }

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    // Whether anything is still changing: under reduced motion we stop the loop
    // once the cursor influence has fully settled, and restart it on the next
    // pointer event. When motion is allowed, the noise animates continuously.
    function settled() {
      return (
        !morphingRef.current &&
        spinRef.current === 0 &&
        spinVelRef.current === 0 &&
        smooth.strength < 0.002 &&
        !pointer.active &&
        Math.abs(pointer.x - smooth.x) < 0.5 &&
        Math.abs(pointer.y - smooth.y) < 0.5
      )
    }

    function draw(now: number) {
      rafId = 0
      if (!ctx) return

      const dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 0
      lastNow = now

      // Chase the target shape with exponential smoothing, rebuilding the scaled
      // geometry + frame path from the blended outline each frame. Because we
      // always blend from the *current* displayed shape toward the latest
      // target, re-targeting mid-morph is seamless — no fixed-duration tween to
      // restart, so fast hovering glides instead of hitching.
      if (morphingRef.current) {
        const target = targetUnitRef.current
        if (target.length === displayUnitRef.current.length && target.length > 0) {
          // tau ≈ a third of the configured morph time: ~95% there in ~morphMs.
          const tau = Math.max(1, morphMsRef.current) / 3000
          const k = dt > 0 ? 1 - Math.exp(-dt / tau) : 0
          if (k > 0) displayUnitRef.current = lerpOutline(displayUnitRef.current, target, k)
          if (maxPointDelta(displayUnitRef.current, target) < SHAPE_CONVERGE_EPS) {
            displayUnitRef.current = target
            morphingRef.current = false
          }
          needsRebuildRef.current = true
        } else {
          morphingRef.current = false
        }
      }

      // Critically-damped tilt spring toward 0 (no overshoot), fed by impulses
      // on each switch. Continuous even when one switch interrupts another.
      if (dt > 0 && (spinRef.current !== 0 || spinVelRef.current !== 0)) {
        const damping = 2 * Math.sqrt(SPIN_STIFFNESS)
        spinVelRef.current +=
          (-SPIN_STIFFNESS * spinRef.current - damping * spinVelRef.current) * dt
        spinRef.current += spinVelRef.current * dt
        if (Math.abs(spinRef.current) < 1e-4 && Math.abs(spinVelRef.current) < 1e-3) {
          spinRef.current = 0
          spinVelRef.current = 0
        }
      }
      const spinAngle = spinRef.current

      if (needsRebuildRef.current) rebuild()

      const t = prefersReduced ? 0 : (now - start) / 1000

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      if (!framePath || scaled.length < 3) {
        schedule()
        return
      }

      if (smooth.x < -9000) {
        smooth.x = pointer.x
        smooth.y = pointer.y
      }
      smooth.x += (pointer.x - smooth.x) * 0.18
      smooth.y += (pointer.y - smooth.y) * 0.18
      const targetStrength = pointer.active && interactiveRef.current ? 1 : 0
      smooth.strength += (targetStrength - smooth.strength) * 0.08

      const influence = R * 0.7
      const maxAngle = 1.6 * smooth.strength
      const doSwirl = smooth.strength > 0.001
      const mirror = mirrorRef.current
      const mirX = 2 * cx - smooth.x
      const mirY = smooth.y

      const { primary, secondary } = colorRef.current

      // Where the contour rings nest (the topographic summit), in px relative to
      // the field centre. Default {0,0} nests toward the centre; a radar chart
      // points it at the dominant discipline.
      const nc = nestCenterRef.current
      const ncx = (nc?.x || 0) * R
      const ncy = (nc?.y || 0) * R

      // Outer transform: tilt the whole field around its center during a morph.
      ctx.save()
      if (spinAngle !== 0) {
        ctx.translate(cx, cy)
        ctx.rotate(spinAngle)
        ctx.translate(-cx, -cy)
      }

      // Fewer, thinner rings as the field shrinks; capped for large fields.
      const rings = Math.max(5, Math.min(MAX_RINGS, Math.round(R / RING_SPACING_PX)))
      // Extra rings drawn outside the frame (ringT > 1). They're clipped away
      // normally, but fill in when the swirl pulls outer contours inward —
      // otherwise it leaves a gap between the outermost ring and the border.
      const extraRings = Math.max(2, Math.round(rings / 3))

      ctx.save()
      ctx.clip(framePath)
      ctx.lineWidth = Math.max(1, Math.min(2.5, R / 100))
      ctx.lineJoin = 'round'

      for (let i = 1; i <= rings + extraRings; i++) {
        const ringT = i / rings
        const waveAmp = R * 0.04 * (0.4 + ringT)

        ctx.beginPath()
        let firstX = 0
        let firstY = 0
        let prevX = 0
        let prevY = 0

        for (let s = 0; s <= SEGMENTS; s++) {
          const bp = scaled[s % SEGMENTS]
          const nx = bp.nx
          const ny = bp.ny
          const n = fbm(nx * 2.0 + i * 0.18, ny * 2.0 - i * 0.18, t * 0.6)
          // Nest each ring from the full outline (ringT=1) toward the summit
          // (ringT→0), then ripple it along the normal with the noise.
          const px = ncx + (bp.x - ncx) * ringT + nx * n * waveAmp
          const py = ncy + (bp.y - ncy) * ringT + ny * n * waveAmp

          let x = cx + px
          let y = cy + py

          if (doSwirl) {
            // Swirl: rotate the point around the cursor, falloff with distance.
            let dx = x - smooth.x
            let dy = y - smooth.y
            let d = Math.hypot(dx, dy)
            if (d < influence) {
              const f = 1 - d / influence
              const ang = f * f * maxAngle
              const c = Math.cos(ang)
              const sn = Math.sin(ang)
              x = smooth.x + dx * c - dy * sn
              y = smooth.y + dx * sn + dy * c
            }
            if (mirror) {
              dx = x - mirX
              dy = y - mirY
              d = Math.hypot(dx, dy)
              if (d < influence) {
                const f = 1 - d / influence
                const ang = f * f * maxAngle
                const c = Math.cos(ang)
                const sn = Math.sin(ang)
                x = mirX + dx * c - dy * sn
                y = mirY + dx * sn + dy * c
              }
            }
          }

          if (s === 0) {
            firstX = x
            firstY = y
            prevX = x
            prevY = y
            ctx.moveTo(x, y)
          } else {
            const mx = (prevX + x) / 2
            const my = (prevY + y) / 2
            ctx.quadraticCurveTo(prevX, prevY, mx, my)
            prevX = x
            prevY = y
          }
        }
        ctx.quadraticCurveTo(prevX, prevY, firstX, firstY)
        ctx.closePath()

        ctx.strokeStyle = ringT < 0.4 ? secondary : primary
        ctx.globalAlpha = 0.5 + ringT * 0.4
        ctx.stroke()
      }

      ctx.restore()

      // Solid frame on top.
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = secondary
      ctx.globalAlpha = 1
      ctx.lineWidth = Math.max(2, Math.min(5, R / 50))
      ctx.stroke(framePath)

      ctx.restore() // outer tilt transform

      schedule()
    }

    // Schedule the next frame, unless we're offscreen or fully idle.
    function schedule() {
      if (!visible || rafId) return
      if (prefersReduced && settled()) return
      rafId = requestAnimationFrame(draw)
    }
    function kick() {
      if (visible && !rafId) rafId = requestAnimationFrame(draw)
    }
    kickRef.current = kick
    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    // Only animate while the canvas is on screen.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false
        if (visible) kick()
        else stop()
      },
      { rootMargin: '64px' },
    )
    io.observe(canvas)

    function onReduceChange(e: MediaQueryListEvent) {
      prefersReduced = e.matches
      kick()
    }
    reduceQuery.addEventListener('change', onReduceChange)

    return () => {
      stop()
      kickRef.current = null
      ro.disconnect()
      io.disconnect()
      reduceQuery.removeEventListener('change', onReduceChange)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full ${interactive ? 'cursor-crosshair touch-none' : ''} ${className ?? ''}`}
      style={{ height }}
      aria-hidden="true"
    />
  )
}
