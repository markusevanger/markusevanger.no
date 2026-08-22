// Derives a project's topographic-field preview as a radar chart over the
// discipline anchors pinned in site settings. radarForProject scores a project's
// technologies onto those axes; radarPath turns the scores into a smooth blob;
// radarNest returns the summit the contour rings lean toward.

const f = (v: number) => Math.round(v * 10) / 10

// Closed Catmull-Rom spline through `pts`, emitted as cubic béziers — smooth and
// rounded at every anchor.
function blobPath(pts: Array<[number, number]>): string {
  const n = pts.length
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + 'Z'
}

// --- Radar axes ------------------------------------------------------------

// Eight anchor positions around the field: four corners + four edge midpoints.
export type AnchorPos = 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l'
// A point/direction in the field's own SVG space: +x right, +y *down*,
// components roughly in [-1, 1]. Used for the contour-ring summit (`radarNest`).
export type Lean = { x: number; y: number }

// Position → unit direction (SVG y-down) of that radar axis.
const S = Math.SQRT1_2
const POS_DIR: Record<AnchorPos, [number, number]> = {
  tl: [-S, -S],
  t: [0, -1],
  tr: [S, -S],
  r: [1, 0],
  br: [S, S],
  b: [0, 1],
  bl: [-S, S],
  l: [-1, 0],
}

// Human-readable label per anchor position.
export const POS_LABEL: Record<AnchorPos, string> = {
  tl: 'top-left', t: 'top', tr: 'top-right', r: 'right',
  br: 'bottom-right', b: 'bottom', bl: 'bottom-left', l: 'left',
}

// Angle of a position (0 = right, increasing clockwise in SVG y-down space),
// normalised to [0, 2π) — used to order axes around the polygon.
function angleOf(p: AnchorPos): number {
  const [x, y] = POS_DIR[p]
  const a = Math.atan2(y, x)
  return a < 0 ? a + Math.PI * 2 : a
}

// An anchor pins one skill (and, through it, that skill's whole category) to a
// position. Shape mirrors the `silhouetteAnchors` projection in queries.ts.
export type SilhouetteAnchor = {
  // One of the eight AnchorPos values. Named `corner` to match the Sanity field.
  corner: AnchorPos
  skillId: string | null
  category: string | null
  // Optional, only used for the position labels.
  skillName?: string | null
}
// A project technology with the category it belongs to (resolved in the query).
// `name`/`url`/`icon` mirror the skill doc so the same tags can render as CV
// pills; `category` drives the radar scoring.
export type ProjectTech = {
  _id: string
  name?: string | null
  url?: string | null
  icon?: string | null
  category: string | null
}

type Tally = { weight: Record<AnchorPos, number> }

// Tally each technology's vote across the configured anchors. A tech that *is*
// an anchor skill votes wholly for that position; otherwise its vote splits
// evenly across the anchors sharing its category. Unmatched techs abstain.
function tally(
  technologies: ProjectTech[] | null | undefined,
  anchors: SilhouetteAnchor[] | null | undefined,
): Tally | null {
  if (!anchors?.length) return null
  // Ignore anchors with a missing/invalid position so a half-filled config can't
  // poison the tally.
  const valid = anchors.filter((a) => a.corner in POS_DIR)
  if (!valid.length) return null

  const weight: Record<AnchorPos, number> = {
    tl: 0, t: 0, tr: 0, r: 0, br: 0, b: 0, bl: 0, l: 0,
  }
  for (const tech of technologies ?? []) {
    const own = valid.find((a) => a.skillId && a.skillId === tech._id)
    if (own) {
      weight[own.corner] += 1
      continue
    }
    const mates = tech.category
      ? valid.filter((a) => a.category && a.category === tech.category)
      : []
    if (!mates.length) continue
    const share = 1 / mates.length
    for (const m of mates) weight[m.corner] += share
  }

  return { weight }
}

// One radar axis: a configured anchor position, the project's strength along it
// in [0, 1] (1 = the project's dominant discipline), and the skill's name.
export type RadarAxis = { pos: AnchorPos; value: number; skillName?: string | null }

// Score a project onto the configured anchor axes. Values are normalised so the
// strongest discipline reaches the rim (1); a project with no matching tech
// leaves every axis at 0.
export function radarForProject(
  technologies: ProjectTech[] | null | undefined,
  anchors: SilhouetteAnchor[] | null | undefined,
): RadarAxis[] {
  const valid = (anchors ?? []).filter((a) => a.corner in POS_DIR)
  if (!valid.length) return []

  // One axis per unique position, keeping a representative skill name.
  const names = new Map<AnchorPos, string | null | undefined>()
  for (const a of valid) if (!names.has(a.corner)) names.set(a.corner, a.skillName)

  const t = tally(technologies, anchors)
  let max = 0
  if (t) for (const p of names.keys()) max = Math.max(max, t.weight[p])

  return Array.from(names.keys())
    .map((pos) => ({
      pos,
      value: t && max > 0 ? t.weight[pos] / max : 0,
      skillName: names.get(pos),
    }))
    .sort((a, b) => angleOf(a.pos) - angleOf(b.pos))
}

// Radar geometry lives in a fixed 200×200 box centred at (100, 100). Pass
// TopographicField `frame={RADAR_FRAME}` so it maps this box absolutely instead
// of re-centring on the bounding box (which would erase the direction).
export const RADAR_FRAME = { cx: 100, cy: 100, half: 100 }

// Even an untouched axis keeps this fraction of the rim, so the blob stays a
// rounded body that merely bulges toward its disciplines rather than spiking.
const FLOOR = 0.5
// Max axis radius inside the 200-box, leaving a little margin to the edge.
const BASE_R = 90
// How far (as a fraction of the field radius) the contour summit slides toward
// the dominant discipline.
const PEAK_FRAC = 0.55

// A neutral near-circle for projects with no scored discipline.
function neutralPath(): string {
  const n = 12
  const r = BASE_R * 0.6
  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2
    pts.push([100 + Math.cos(ang) * r, 100 + Math.sin(ang) * r])
  }
  return blobPath(pts)
}

// Smooth radar blob (an SVG path `d`) in the RADAR_FRAME box: each axis vertex
// sits at floor..rim by its value, with a midpoint inserted between each pair of
// spokes (averaged radius along the bisector) so the closed spline has support
// between axes and rounds off instead of overshooting into needles or loops.
export function radarPath(axes: RadarAxis[]): string {
  if (axes.length < 3 || axes.every((a) => a.value <= 1e-6)) return neutralPath()
  const dirs = axes.map((a) => POS_DIR[a.pos])
  const radial = axes.map((a) => (FLOOR + (1 - FLOOR) * a.value) * BASE_R)
  const pts: Array<[number, number]> = []
  for (let i = 0; i < axes.length; i++) {
    const [dx, dy] = dirs[i]
    const r = radial[i]
    pts.push([100 + dx * r, 100 + dy * r])
    const j = (i + 1) % axes.length
    let mx = dx + dirs[j][0]
    let my = dy + dirs[j][1]
    const ml = Math.hypot(mx, my) || 1
    mx /= ml
    my /= ml
    const mr = (r + radial[j]) / 2
    pts.push([100 + mx * mr, 100 + my * mr])
  }
  return blobPath(pts)
}

// The value-weighted direction the contour rings should nest toward, scaled into
// field-radius units — i.e. where the topographic "summit" sits. A focused
// project pulls the summit out toward its discipline; a balanced one keeps it
// near centre.
export function radarNest(axes: RadarAxis[]): Lean {
  let x = 0
  let y = 0
  let sum = 0
  for (const a of axes) {
    const [dx, dy] = POS_DIR[a.pos]
    x += dx * a.value
    y += dy * a.value
    sum += a.value
  }
  if (sum <= 1e-6) return { x: 0, y: 0 }
  return { x: (x / sum) * PEAK_FRAC, y: (y / sum) * PEAK_FRAC }
}

