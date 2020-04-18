import './Tone.js'

const playingNotes = new Set()
let transposition = 0

// prepare synth
const polySynth = new Tone.PolySynth(16, Tone.Synth).toMaster()
const pressNote = (note) => (e) => {
  e.preventDefault()
  playingNotes.add(note)
  document.querySelector(`[data-note="${note}"]`).classList.add('pressed')
  polySynth.triggerAttack([note])
}
const releaseNote = (note) => (e) => {
  e.preventDefault()
  playingNotes.delete(note)
  document.querySelector(`[data-note="${note}"]`).classList.remove('pressed')
  polySynth.triggerRelease([note], "+1i")
}
const releaseAll = (notes) => {
  polySynth.triggerRelease(notes)
  playingNotes.clear()
  keys.forEach(key => { key.classList.remove('pressed') })
}

// create keys
const keyboard = document.querySelector('.keyboard')
const keys = []
const allNotes = []
allNotes.push("A0","A#0","B0")
;[1,2,3,4,5,6,7].forEach(octave => {
  "CDEFGAB".split('').forEach(letter => {
    allNotes.push(`${letter}${octave}`, `${letter}#${octave}`)
  })
})
allNotes.push('C8')
allNotes.forEach(note => {
  const key = document.createElement('button')
  key.dataset.note = note
  keyboard.appendChild(key)
  keys.push(key)
})

// init transpose buttons
const goDown = () => {
  if (transposition > -3) {
    transposition--
  }
  keyboard.style.left = `${-transposition*21}rem`
  releaseAll(allNotes)
}
const goUp = () => {
  if (transposition < +3) {
    transposition++
  }
  keyboard.style.left = `${-transposition*21}rem`
  releaseAll(allNotes)
}
const goMid = () => {
  transposition = 0
  keyboard.style.left = `${-transposition*21}rem`
  releaseAll(allNotes)
}
document.querySelector('.go-up').onclick = goUp
document.querySelector('.go-down').onclick = goDown
document.querySelector('.go-mid').onclick = goMid
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight') {
    goUp()
  }
  if (e.code === 'ArrowLeft') {
    goDown()
  }
  if (e.code === 'Space') {
    goMid()
  }
})


// init gui keys
keys.forEach(key => {
  const note = key.dataset.note
  key.innerText = note
  key.addEventListener('mousedown', pressNote(note))
  key.addEventListener('mouseup', releaseNote(note))
  key.addEventListener('mouseenter', (e) => {
    if (e.buttons === 1) {
      pressNote(note)(e)
    }
  })
  key.addEventListener('mouseleave', (e) => {
    if (e.buttons === 1) {
      releaseNote(note)(e)
    }
  })
  key.onselect = e => {
    e.preventDefault()
    return false
  }
})
keyboard.addEventListener('mouseover', () => {
  releaseAll(allNotes)
})

// init keyboard keys
const keyMap = (n) => ({
  'KeyA': `C${n+4}`,
    'KeyW': `C#${n+4}`,
  'KeyS': `D${n+4}`,
    'KeyE': `D#${n+4}`,
  'KeyD': `E${n+4}`,
  'KeyF': `F${n+4}`,
    'KeyT': `F#${n+4}`,
  'KeyG': `G${n+4}`,
    'KeyY': `G#${n+4}`,
  'KeyH': `A${n+4}`,
    'KeyU': `A#${n+4}`,
  'KeyJ': `B${n+4}`,

  'KeyK': `C${n+5}`,
    'KeyO': `C#${n+5}`,
  'KeyL': `D${n+5}`,
    'KeyP': `D#${n+5}`,
  'Semicolon': `E${n+5}`,
  'Quote': `F${n+5}`,
  // 'Backslash': `G${n+5}`,
})
window.addEventListener('keydown', e => {
  const note = keyMap(transposition)[e.code]
  if (note && !playingNotes.has(note)) {
    pressNote(note)(e)
  }
})
window.addEventListener('keyup', e => {
  const note = keyMap(transposition)[e.code]
  if (note && playingNotes.has(note)) {
    releaseNote(note)(e)
  }
})
