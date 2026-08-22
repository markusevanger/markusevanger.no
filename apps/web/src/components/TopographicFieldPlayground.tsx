'use client'

import { useState } from 'react'
import TopographicField, { BADGE_D } from '@/components/TopographicField'
import { extractPathD } from '@/lib/pathUtils'

// Dev-only harness for the production <TopographicField>: paste arbitrary SVGs
// and toggle mirror to preview before wiring a path into the page builder.
export default function TopographicFieldPlayground() {
  const [path, setPath] = useState<string>(BADGE_D)
  const [mirror, setMirror] = useState(true)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteValue, setPasteValue] = useState('')
  const [pasteError, setPasteError] = useState<string | null>(null)

  function applyPaste() {
    const d = extractPathD(pasteValue)
    if (!d) {
      setPasteError('Could not find an SVG path in that input.')
      return
    }
    setPath(d)
    setPasteError(null)
    setPasteOpen(false)
  }

  return (
    <div className="relative w-full">
      <TopographicField path={path} mirror={mirror} />

      {pasteOpen && (
        <div className="absolute inset-x-0 top-4 mx-auto flex w-[min(92%,540px)] flex-col gap-2 rounded-xl border border-markus-red/30 bg-white/95 p-3 shadow-lg backdrop-blur">
          <label className="text-sm font-medium text-markus-red-secondary">
            Paste SVG markup or a path&nbsp;
            <code className="rounded bg-gray-100 px-1">d</code> attribute
          </label>
          <textarea
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            rows={4}
            placeholder='<svg ...><path d="M36 0.5H140 ... Z" /></svg>'
            className="w-full resize-y rounded-md border border-gray-300 p-2 font-mono text-xs outline-none focus:border-markus-red"
          />
          {pasteError && <p className="text-xs text-markus-red">{pasteError}</p>}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setPasteOpen(false)}
              className="rounded-full px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={applyPaste}
              className="rounded-full bg-markus-red px-3 py-1 text-sm text-white hover:bg-markus-red-secondary"
            >
              Use shape
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-2">
        <div className="pointer-events-auto flex gap-1 rounded-full border border-markus-red/30 bg-white/80 p-1 backdrop-blur">
          <button
            onClick={() => setPath(BADGE_D)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              path === BADGE_D
                ? 'bg-markus-red text-white'
                : 'text-markus-red-secondary hover:bg-markus-red/10'
            }`}
          >
            Badge
          </button>
          <button
            onClick={() => setPasteOpen((o) => !o)}
            className="rounded-full px-3 py-1 text-sm text-markus-red-secondary hover:bg-markus-red/10"
            title="Paste your own SVG"
          >
            + SVG
          </button>
        </div>

        <button
          onClick={() => setMirror((m) => !m)}
          className={`pointer-events-auto rounded-full border border-markus-red/30 px-3 py-1.5 text-sm transition-colors ${
            mirror
              ? 'bg-markus-red text-white'
              : 'bg-white/80 text-markus-red-secondary backdrop-blur hover:bg-markus-red/10'
          }`}
        >
          Mirror {mirror ? 'on' : 'off'}
        </button>
      </div>
    </div>
  )
}
