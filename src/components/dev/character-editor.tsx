'use client'

import { useDeferredValue, useEffect, useState } from 'react'
import anim from '@/data/wave-anim.json'
import FigureLoop from '@/components/figure-loop'
import { WAVE_VIEW } from '@/components/wave-guy'
import { markBooted } from '@/lib/boot'
import type { Character } from '@/lib/figure'

type NumKey = { [K in keyof Character]: Character[K] extends number ? K : never }[keyof Character]
type BoolKey = { [K in keyof Character]: Character[K] extends boolean ? K : never }[keyof Character]

const GROUPS: { title: string; note?: string; sliders: [NumKey, string, number, number, number][]; toggles?: [BoolKey, string][] }[] = [
  {
    title: 'Proportions',
    note: 'sizes in shoulder widths',
    sliders: [
      ['headSize', 'head size', 0.2, 1.2, 0.01],
      ['neck', 'neck', 0.2, 1, 0.01],
      ['torsoWidth', 'torso width', 0.3, 1, 0.01],
    ],
  },
  {
    title: 'Bone lengths',
    note: '1 = as filmed',
    sliders: [
      ['shoulderWidth', 'shoulders', 0.5, 1.5, 0.01],
      ['upperArm', 'upper arm', 0.4, 1.5, 0.01],
      ['forearm', 'forearm', 0.4, 1.5, 0.01],
      ['torsoLength', 'torso', 0.4, 1.5, 0.01],
      ['hipWidth', 'hips', 0.5, 1.5, 0.01],
      ['thigh', 'thigh', 0.4, 1.5, 0.01],
      ['shin', 'shin', 0.4, 1.5, 0.01],
      ['foot', 'foot', 0.3, 1.5, 0.01],
    ],
  },
  {
    title: 'Thickness',
    sliders: [
      ['armThickness', 'arms', 0.05, 0.5, 0.01],
      ['legThickness', 'legs', 0.05, 0.6, 0.01],
      ['handSize', 'hands (x arm)', 0.8, 2, 0.01],
    ],
  },
  {
    title: 'Material',
    sliders: [
      ['metalness', 'metalness', 0, 1, 0.01],
      ['roughness', 'roughness', 0, 1, 0.01],
    ],
  },
  {
    title: 'PS2',
    note: 'colour levels 0 = off',
    sliders: [
      ['pixelSize', 'pixel size', 1, 8, 1],
      ['colorLevels', 'colour levels', 0, 32, 1],
    ],
    toggles: [['dither', 'dither'], ['lowPoly', 'low poly'], ['snap', 'vertex wobble']],
  },
]

const WAVE_SECONDS = anim.frames.length / anim.fps
const FLOOR_SECONDS = 89

export default function CharacterEditor({ initial }: { initial: Character }) {
  const [char, setChar] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const [status, setStatus] = useState('')
  const [scrub, setScrub] = useState<{ wave: number | null; floor: number | null }>({ wave: null, floor: null })
  const preview = useDeferredValue(char)   // keep the sliders snappy while the figure rebuilds
  const set = <K extends keyof Character>(k: K, v: Character[K]) => setChar(c => ({ ...c, [k]: v }))
  const dirty = JSON.stringify(char) !== JSON.stringify(saved)

  useEffect(markBooted, [])   // no forest boot sequence here: let the previews start straight away

  const save = async () => {
    setStatus('saving…')
    const res = await fetch('/dev/character/save', { method: 'POST', body: JSON.stringify(char) })
    if (!res.ok) return setStatus(`failed (${res.status})`)
    setSaved(await res.json())
    setStatus('saved to src/data/character.json')
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 font-mono text-xs text-neutral-200">
      <aside className="w-96 shrink-0 space-y-5 overflow-y-auto border-r border-neutral-800 p-4">
        <h1 className="text-sm text-white">Character</h1>
        {GROUPS.map(g => (
          <section key={g.title} className="space-y-2">
            <h2 className="text-neutral-400 uppercase">
              {g.title} {g.note && <span className="normal-case text-neutral-600">· {g.note}</span>}
            </h2>
            {g.sliders.map(([k, label, min, max, step]) => (
              <label key={k} className="grid grid-cols-[7rem_1fr_3.5rem] items-center gap-2">
                <span>{label}</span>
                <input type="range" min={min} max={max} step={step} value={char[k]}
                  onChange={e => set(k, +e.target.value)} />
                <span className="text-right tabular-nums">{char[k]}</span>
              </label>
            ))}
            {g.toggles?.map(([k, label]) => (
              <label key={k} className="flex items-center gap-2">
                <input type="checkbox" checked={char[k]} onChange={e => set(k, e.target.checked)} /> {label}
              </label>
            ))}
            {g.title === 'Material' && (
              <label className="grid grid-cols-[7rem_1fr] items-center gap-2">
                <span>colour</span>
                <input type="color" value={char.color} onChange={e => set('color', e.target.value)} />
              </label>
            )}
          </section>
        ))}
        <div className="flex flex-wrap gap-2 border-t border-neutral-800 pt-4">
          <button onClick={save} disabled={!dirty} className="bg-white px-3 py-1.5 text-black disabled:opacity-40">Save</button>
          <button onClick={() => setChar(saved)} disabled={!dirty} className="border border-neutral-700 px-3 py-1.5 disabled:opacity-40">Revert</button>
          <button
            onClick={() => setChar(c => ({ ...c, shoulderWidth: 1, upperArm: 1, forearm: 1, torsoLength: 1, hipWidth: 1, thigh: 1, shin: 1, foot: 1 }))}
            className="border border-neutral-700 px-3 py-1.5"
          >
            Filmed lengths
          </button>
        </div>
        <p className="text-neutral-500">{status || (dirty ? 'unsaved changes' : 'in sync with file')}</p>
      </aside>

      <main className="flex flex-1 flex-wrap content-start gap-6 bg-[repeating-conic-gradient(#1a1a1a_0_25%,#141414_0_50%)] bg-size-[24px_24px] p-6">
        {([
          ['wave', 'wave (About button)', WAVE_SECONDS],
          ['floor', 'floor (bottom right)', FLOOR_SECONDS],
        ] as const).map(([id, label, seconds]) => (
          <figure key={id} className="space-y-2">
            {id === 'wave'
              ? <FigureLoop clip={anim} character={preview} size={360} bust view={WAVE_VIEW} time={scrub.wave} />
              : <FigureLoop clip="/anim/floor.json" character={preview} size={360} ground time={scrub.floor} />}
            <figcaption className="flex items-center gap-2">
              <span className="w-36">{label}</span>
              <input type="checkbox" checked={scrub[id] === null} title="play"
                onChange={e => setScrub(s => ({ ...s, [id]: e.target.checked ? null : 0 }))} />
              <input type="range" min={0} max={seconds} step={0.05} value={scrub[id] ?? 0} className="flex-1"
                onChange={e => setScrub(s => ({ ...s, [id]: +e.target.value }))} />
            </figcaption>
          </figure>
        ))}
      </main>
    </div>
  )
}
