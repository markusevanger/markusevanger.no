// Deterministically derive an organic blob silhouette (an SVG path `d`) from a
// project title, so every project gets a stable, distinct shape for the
// topographic-field preview without any manual assignment. A project's optional
// Sanity `silhouette` field overrides this when set.
//
// The shape is a closed, fully-rounded curve through a ring of anchor points
// (Catmull-Rom → cubic bézier). The title hash seeds the per-anchor radii and
// angular jitter; the project's *featured* status is a strong driver: featured
// projects get more anchors and far more dramatic radius variation, so they read
// as bolder, more elaborate shapes than the calmer small projects.

// FNV-1a, 32-bit — small and well-distributed for short strings.
function hash(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// mulberry32 PRNG — seeded by the title hash so each title yields a fixed
// sequence of parameters.
function mulberry32(a: number): () => number {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

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

export function silhouetteForTitle(title: string, featured = false): string {
  const rng = mulberry32(hash(title || 'untitled'))

  // Featured = more anchors + much stronger radius swing → bolder, busier shape.
  const n = featured ? 8 : 6
  const amp = featured ? 0.32 : 0.15
  const baseR = 64
  const stretch = 1.08 // slight landscape so it isn't a plain circle

  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2 + (rng() - 0.5) * 0.4
    const rad = baseR * (1 - amp + 2 * amp * rng())
    pts.push([100 + Math.cos(ang) * rad * stretch, 100 + Math.sin(ang) * rad])
  }

  return blobPath(pts)
}
