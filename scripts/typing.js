// typing animation
const TYPING = {
  startDelay: 1000,
  minDelay: 50,
  maxDelay: 450,
  pauseAfter: { right: 700 },
  caretHold: 600,
}

const line = document.querySelector('.brb')
const words = [...line.querySelectorAll('span[aria-hidden]')]

const caret = document.createElement('span')
caret.className = 'caret'
caret.setAttribute('aria-hidden', 'true')

line.classList.add('typing')
line.prepend(caret)


function randomDelay() {
  return TYPING.minDelay + Math.random() * (TYPING.maxDelay - TYPING.minDelay)
}


function showWord(index) {
  const word = words[index]

  word.classList.add('on')
  word.after(caret)

  const isLastWord = index === words.length - 1

  if (isLastWord) {
    setTimeout(() => caret.remove(), TYPING.caretHold)
    return
  }

  const pause = TYPING.pauseAfter[word.textContent] ?? 0

  setTimeout(() => showWord(index + 1), randomDelay() + pause)
}


setTimeout(() => showWord(0), TYPING.startDelay + randomDelay())
