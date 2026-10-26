// animation here... stealing my tricks?
const SPRITE = {
  fps: 10,
  frames: 870,
  columns: 30,
  size: 320,
}

const guy = document.querySelector('.guy')

const startTime = performance.now()
let shownFrame = -1


function showFrame(index) {
  const column = index % SPRITE.columns
  const row = Math.floor(index / SPRITE.columns)

  guy.style.backgroundPosition = `${-column * SPRITE.size}px ${-row * SPRITE.size}px`
}


function tick(now) {
  const secondsPlayed = (now - startTime) / 1000
  const frame = Math.floor(secondsPlayed * SPRITE.fps) % SPRITE.frames

  if (frame !== shownFrame) {
    shownFrame = frame
    showFrame(frame)
  }

  requestAnimationFrame(tick)
}


requestAnimationFrame(tick)
