'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useBooted } from '@/lib/boot'
import { createCharacter, createStage, retarget, sampleClip, toPose, type Character, type Clip, type Stage } from '@/lib/figure'

type Props = {
  clip: Clip | string   // the clip, or a URL to fetch it from
  character: Character
  size: number
  ground?: boolean      // plant the lowest leg joint on the floor every frame
  bust?: boolean        // close-up clip without hips
  view?: [minX: number, maxX: number, minY: number, maxY: number]   // default: fit the whole clip
  time?: number | null  // seconds; set to hold that moment instead of playing
  className?: string
}

// A character playing a clip on a loop. Starts after the forest's boot sequence (WebGL setup
// and clip processing would stutter it), then fades in.
export default function FigureLoop({ clip: src, character, size, ground, bust, view, time = null, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Stage>(null)
  const timeRef = useRef(time)
  const booted = useBooted()
  const [fetched, setFetched] = useState<{ url: string; clip: Clip } | null>(null)
  const clip = typeof src !== 'string' ? src : fetched?.url === src ? fetched.clip : null

  useEffect(() => { timeRef.current = time }, [time])

  useEffect(() => {
    if (typeof src !== 'string') return
    let cancelled = false
    fetch(src).then(r => r.json()).then((c: Clip) => { if (!cancelled) setFetched({ url: src, clip: c }) })
    return () => { cancelled = true }
  }, [src])

  useEffect(() => {
    if (!booted) return
    const stage = createStage(hostRef.current!, size, size)
    stageRef.current = stage
    return () => { stage.dispose(); stageRef.current = null }
  }, [size, booted])

  // (re)build the character whenever it or the clip changes; the stage stays
  const viewKey = view?.join()
  useEffect(() => {
    const stage = stageRef.current
    if (!clip || !stage) return
    const { clip: played, sw } = retarget(clip, character, { ground })
    const figure = createCharacter(stage, character, sw, { bust })

    if (view) stage.frame(...view)
    else {
      const xs: number[] = [], ys: number[] = []
      for (const f of played.frames) for (let i = 0; i < f.length; i += 3) { xs.push(f[i]); ys.push(f[i + 1]) }
      const pad = figure.headR * 1.2
      stage.frame(Math.min(...xs) - pad, Math.max(...xs) + pad, Math.min(...ys) - character.legThickness * sw, Math.max(...ys) + pad)
    }

    const flat: number[] = [], pose = {}
    const timer = new THREE.Timer()
    stage.renderer.setAnimationLoop(t => {
      timer.update(t)
      const at = timeRef.current ?? timer.getElapsed()
      sampleClip(played, at * played.fps, flat)
      figure.update(toPose(played, flat, pose))
      stage.render()
    })
    hostRef.current!.style.opacity = '1'

    return () => {
      stage.renderer.setAnimationLoop(null)
      figure.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- view is compared by value via viewKey
  }, [clip, character, ground, bust, viewKey, size, booted])

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`opacity-0 transition-opacity duration-700 [&>canvas]:block ${className ?? ''}`}
      style={{ width: size, height: size }}
    />
  )
}
