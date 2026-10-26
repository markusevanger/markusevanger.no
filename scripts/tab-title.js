// tab title animation
const TITLE = {
  awake: 'oh hello!',
  asleep: 'do not disturb',
  snore: 'zzzzZZZZzzzz',
  letterTime: 150,
  snoreHold: 1000,
  timeBetweenSnores: 30000,
}

let titleTimer


function snore(letters = 1) {
  document.title = TITLE.snore.slice(0, letters)

  const isFullSnore = letters === TITLE.snore.length

  if (isFullSnore) {
    titleTimer = setTimeout(rest, TITLE.snoreHold)
    return
  }

  titleTimer = setTimeout(() => snore(letters + 1), TITLE.letterTime)
}


function rest() {
  document.title = TITLE.asleep

  titleTimer = setTimeout(snore, TITLE.timeBetweenSnores)
}


function updateTitle() {
  clearTimeout(titleTimer)

  if (document.hidden) {
    snore()
    return
  }

  document.title = TITLE.awake
}


document.addEventListener('visibilitychange', updateTitle)
updateTitle()
