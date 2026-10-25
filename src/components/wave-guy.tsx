'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import anim from '@/data/wave-anim.json'
import character from '@/data/character.json'
import { useBooted } from '@/lib/boot'
import { createCharacter, createStage, retarget, sampleClip, toPose } from '@/lib/figure'

// The character as a waving bust, driven by a pose track pulled from a video (MediaPipe, baked
// to src/data/wave-anim.json). Hidden below the frame until the parent link is hovered/focused:
// then he pops up, waves once and holds still, and ducks back down when it's left. Mirrored so
// the waving arm is screen-left.

const FRAMES = anim.frames.length
const DUCK_SPEED = 1.4   // ducking plays a bit faster than it was filmed
const BLEND_TIME = 0.2   // s, crossfade when switching between rising and ducking
export const WAVE_VIEW: [number, number, number, number] = [-0.4, 0.4, -0.5, 0.3]   // image-height units

export default function WaveGuy({ size, className }: { size: number; className?: string }) {
  const hostRef = useRef<HTMLSpanElement>(null)
  const booted = useBooted()   // set up after the forest's boot sequence, so it doesn't stutter

  useEffect(() => {
    if (!booted) return
    const host = hostRef.current!
    const link = host.closest('a') ?? host

    const stage = createStage(host, size, size)
    stage.frame(...WAVE_VIEW)
    const { clip, sw } = retarget(anim, character)
    const figure = createCharacter(stage, character, sw, { bust: true })

    // Clip player. 'rise' plays from just before he reappears to the end and holds there;
    // 'duck' plays down out of frame, then 'hidden' stops rendering. Switching
    // crossfades from wherever he was, so a hover mid-duck doesn't snap.
    let mode: 'hidden' | 'rise' | 'duck' = 'hidden'
    let frame = anim.duck[1], blend = 1
    const from: number[] = [], to: number[] = [], cur: number[] = []
    sampleClip(clip, frame, cur)
    const play = (next: 'rise' | 'duck') => {
      if (mode === next) return
      from.splice(0, from.length, ...cur)
      blend = mode === 'hidden' ? 1 : 0
      mode = next
      frame = next === 'rise' ? anim.rise : anim.duck[0]
    }
    const onEnter = () => play('rise')
    const onLeave = () => { if (mode !== 'hidden') play('duck') }
    link.addEventListener('pointerenter', onEnter)
    link.addEventListener('pointerleave', onLeave)
    link.addEventListener('focusin', onEnter)
    link.addEventListener('focusout', onLeave)

    const pose = {}
    let drawnHidden = false
    const timer = new THREE.Timer()
    stage.renderer.setAnimationLoop(time => {
      timer.update(time)
      const dt = Math.min(timer.getDelta(), 0.05)
      if (mode === 'hidden') {
        if (!drawnHidden) { stage.renderer.clear(); drawnHidden = true }
        return
      }
      drawnHidden = false

      if (mode === 'rise') {
        // play through once, then hold the last (rest) pose until the hover ends
        if (frame >= FRAMES - 1 && blend === 1) return
        frame = Math.min(frame + dt * anim.fps, FRAMES - 1)
      } else {
        frame += dt * anim.fps * DUCK_SPEED
        if (frame >= anim.duck[1]) { frame = anim.duck[1]; mode = 'hidden' }
      }
      blend = Math.min(1, blend + dt / BLEND_TIME)
      sampleClip(clip, frame, to)
      const s = blend * blend * (3 - 2 * blend)
      for (let k = 0; k < to.length; k++) cur[k] = blend < 1 ? from[k] + (to[k] - from[k]) * s : to[k]
      figure.update(toPose(clip, cur, pose))
      stage.render()
    })

    return () => {
      link.removeEventListener('pointerenter', onEnter)
      link.removeEventListener('pointerleave', onLeave)
      link.removeEventListener('focusin', onEnter)
      link.removeEventListener('focusout', onLeave)
      figure.dispose()
      stage.dispose()
    }
  }, [size, booted])

  // the outer span is the slot (its width can animate); the canvas keeps a fixed size inside it
  return (
    <span aria-hidden className={className}>
      <span ref={hostRef} className="block [&>canvas]:block" style={{ width: size, height: size }} />
    </span>
  )
}
