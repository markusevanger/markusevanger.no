'use client'

import { useEffect } from 'react'
import anim from '@/data/wave-anim.json'
import character from '@/data/character.json'
import FigureLoop from '@/components/figure-loop'
import { WAVE_VIEW } from '@/components/wave-guy'
import { markBooted } from '@/lib/boot'

// Just the character animations, no forest. The figures wait for the forest's boot flag, so
// set it here since there is no forest to do it.
export default function FiguresPage() {
  useEffect(markBooted, [])
  return (
    <main className="flex min-h-screen flex-wrap items-center justify-center gap-12 p-12">
      <FigureLoop clip="/anim/floor.json" character={character} size={360} ground />
      <FigureLoop clip={anim} character={character} size={360} bust view={WAVE_VIEW} />
    </main>
  )
}
