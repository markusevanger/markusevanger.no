import { useSyncExternalStore } from 'react'

// The forest's boot sequence (grid cells switching on) is the first thing that runs. Anything
// else heavy (figure canvases: WebGL contexts, shader compiles, clip processing) waits until
// it has finished, so it doesn't stutter. forest-scene calls markBooted() when done.

const EVENT = 'site:booted'
const isBooted = () => document.documentElement.hasAttribute('data-booted')

export function markBooted() {
  if (isBooted()) return
  document.documentElement.dataset.booted = ''
  dispatchEvent(new Event(EVENT))
}

const subscribe = (cb: () => void) => {
  addEventListener(EVENT, cb)
  return () => removeEventListener(EVENT, cb)
}

export const useBooted = () => useSyncExternalStore(subscribe, isBooted, () => false)
