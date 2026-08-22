// Pull a `d` string out of pasted SVG markup, or accept a bare path string.
export function extractPathD(input: string): string | null {
  const m = input.match(/\bd\s*=\s*"([^"]+)"/) || input.match(/\bd\s*=\s*'([^']+)'/)
  if (m) return m[1]
  if (/[MmZzLlHhVvCcSsQqTtAa]/.test(input) && /\d/.test(input)) return input.trim()
  return null
}
