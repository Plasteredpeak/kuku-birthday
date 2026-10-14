import '@fontsource/gaegu/latin-400.css'
import '@fontsource/gaegu/latin-700.css'
import '@fontsource/atkinson-hyperlegible/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-700.css'
import './style.css'
import { gsap } from 'gsap'
import confetti from 'canvas-confetti'
import kukuCalm from './assets/kuku-calm.png'
import { initAudio, playTheme, sfx, isMuted, setMuted } from './audio.js'
import { createBackground } from './bg.js'

const CAT = Object.fromEntries(
  Object.entries(import.meta.glob('./assets/cats/*.webp', { eager: true, import: 'default' }))
    .map(([p, url]) => [p.split('/').pop().replace('.webp', ''), url]),
)
CAT.calm = kukuCalm

const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p) } catch {} }
const pick = (a) => a[Math.floor(Math.random() * a.length)]

// 15 Oct 2026, 00:00 in Pakistan (UTC+5) = 14 Oct 19:00 UTC
const BIRTHDAY = Date.UTC(2026, 9, 14, 19, 0, 0)
const params = new URLSearchParams(location.search)
const ALI_MODE = params.has('ali')
// ?ali&wait = fake 20-second countdown, to test the reveal
const TARGET = params.has('wait') ? Date.now() + 20000 : ALI_MODE ? 0 : BIRTHDAY
const TOTAL_EGGS = 17

$$('.kuku-src').forEach((img) => (img.src = CAT.angry))
$('#favicon').href = CAT.angry
$('#soundIcon').src = CAT.music
$$('img[data-cat]').forEach((img) => (img.src = CAT[img.dataset.cat]))

/* ---------------- state ---------------- */
const KEY = 'kuku-bday-v1'
let state = { level: 0, eggs: [], pets: 0, guesses: [], candlesOut: false, finale: false, revealed: false, gym: null, introduced: false, wordleFails: 0 }
try {
  if (params.has('reset')) localStorage.removeItem(KEY)
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
  if (saved) state = { ...state, ...saved }
} catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {} }

/* ---------------- audio ---------------- */
const soundBtn = $('#soundBtn')
const renderSound = () => {
  soundBtn.classList.toggle('off', isMuted())
  soundBtn.setAttribute('aria-label', isMuted() ? 'Turn sound on' : 'Turn sound off')
}
renderSound()
// Android only unlocks audio on a finished tap, so listen for the end of the touch
;['pointerup', 'touchend', 'click'].forEach((ev) => addEventListener(ev, () => initAudio(), { passive: true }))
addEventListener('keydown', () => initAudio())
soundBtn.addEventListener('click', () => {
  initAudio()
  setMuted(!isMuted())
  renderSound()
  if (!isMuted()) { mood('music', 2600); say('music on. cave vibes.', 2200) }
  else say('silence. fine.', 1800)
})
// every level has its own theme
const THEME_BY_LEVEL = ['gate', 'wordle', 'cave', 'anime', 'gym', 'cake', 'time', 'letter']
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) playTheme(THEME_BY_LEVEL[+e.target.dataset.level])
}, { threshold: 0.35 })
$$('.level').forEach((l) => io.observe(l))
// soft tap sound on every button
document.addEventListener('click', (e) => { if (e.target.closest('.btn, .clock-gst')) sfx.tap() })

/* ---------------- Kuku + moods ---------------- */
const bubble = $('#bubble')
const kuku = $('#kuku')
const kukuImg = $('#kukuImg')
let bubbleTimer
function say(text, ms = 4500) {
  ms = Math.max(ms, 3500)
  bubble.textContent = text
  bubble.classList.add('show')
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms)
  if (!reduced) gsap.fromTo(kuku, { y: 0 }, { y: -10, duration: 0.12, yoyo: true, repeat: 1 })
}

const baseMood = () => (state.finale ? 'heart' : state.pets >= 15 ? 'calm' : 'angry')
let moodTimer, sleeping = false, reactionUntil = 0
function mood(name, ms = 2400) {
  clearTimeout(moodTimer)
  reactionUntil = ms ? Date.now() + Math.max(ms * 2, 4500) : 0
  sleeping = name === 'sleep' && !ms
  if (kukuImg.dataset.mood !== name) {
    kukuImg.dataset.mood = name
    kukuImg.src = CAT[name]
    if (!reduced) gsap.fromTo(kukuImg, { scale: 0.8, rotate: -8 }, { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(2.5)' })
  }
  kuku.classList.toggle('calm', name === 'calm')
  // reactions linger so she actually sees them
  if (ms) moodTimer = setTimeout(() => mood(baseMood(), 0), Math.max(ms * 2, 4500))
}
mood(baseMood(), 0)

// big centre reaction sticker
function popCat(name, caption, ms = 2600) {
  const wrap = document.createElement('div')
  wrap.className = 'popcat'
  wrap.innerHTML = `<img src="${CAT[name]}" alt=""><p>${caption}</p>`
  document.body.append(wrap)
  const close = () => gsap.to(wrap, { opacity: 0, scale: 0.8, duration: 0.25, onComplete: () => wrap.remove() })
  wrap.addEventListener('click', close)
  if (reduced) { setTimeout(() => wrap.remove(), ms); return }
  gsap.fromTo(wrap, { opacity: 0, scale: 0.4, rotate: -12 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2)' })
  setTimeout(close, ms)
}

const petLines = [
  "don't touch me", 'noob', '...', 'kya masla hai', 'stop', 'khair hai?', 'pagal ho',
  "i'm not a cat. i'm KUKU", 'hmph', "you're doing it wrong", '...continue', 'ok one more',
  'this is harassment', 'fine',
]
let pressTimer, longPressed = false
kuku.addEventListener('pointerdown', () => {
  longPressed = false
  pressTimer = setTimeout(() => {
    longPressed = true
    buzz(60)
    if (!state.revealed) { sfx.hiss(); say('no picking me up until 12.'); return }
    mood('buff', 3000)
    sfx.thud()
    egg('hold', 'Kuku has been picked up', 'put me DOWN. i go to the gym. look at these.')
  }, 650)
})
const cancelPress = () => clearTimeout(pressTimer)
kuku.addEventListener('pointerup', cancelPress)
kuku.addEventListener('pointerleave', cancelPress)
kuku.addEventListener('contextmenu', (e) => e.preventDefault())
kuku.addEventListener('click', () => {
  if (longPressed) return
  if (!state.revealed) return waitingTap()
  if (sleeping) { mood(baseMood(), 0); say('i was SLEEPING.'); sfx.hiss(); return }
  state.pets++
  save()
  buzz(15)
  if (state.pets === 15) {
    sfx.meow(true)
    mood('heart', 2500)
    setTimeout(() => mood('calm', 0), 2500)
    say('...ok fine. happy birthday 😾', 5000)
    burst(0.85, 0.85)
  } else if (state.pets > 15) {
    sfx.meow(true)
    mood(pick(['heart', 'yay', 'flower']), 1800)
    say(pick(['purr. tell no one.', 'ok you can stay', 'happy birthday (quietly)', '😾💗']))
  } else {
    if (state.pets % 3 === 0) sfx.hiss(); else sfx.meow()
    say(`${pick(petLines)}  (${state.pets}/15)`, 3500)
    if (!reduced) gsap.fromTo(kukuImg, { rotate: -10 }, { rotate: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' })
  }
})

/* ---------------- Kuku before 12: patience, then sleep ---------------- */
const WAIT_LINES = [
  "don't get hasty. wait.", 'have some patience.', "it's not 12 yet.", 'asking won\'t make it faster.',
  "you've been asking him for an hour. he told me.", 'Pakistani 12. look at the clock.', 'tap tap tap. no.',
  "patience. you've heard of it?", "i'm getting sleepy from all this waiting…",
]
const SLEEPY_LINES = [
  "it's not time yet. don't wake me up.", 'zzz… still not 12…', 'five more minutes…', "DON'T wake me up.",
  'wake me at 12. YOUR 12.', 'zzz… cinnabon… zzz', 'shhh. sleeping. guarding. both.',
]
let waitTaps = 0, sleepTaps = 0
function waitingTap() {
  buzz(15)
  if (revealShown) {
    sfx.meow(true)
    say(pick(['press the button!', 'the BUTTON. not me. PRESS IT.', "why are you tapping me. it's 12. GO.", 'button. now. please.']))
    return
  }
  if (sleeping) {
    sfx.hiss()
    say(SLEEPY_LINES[sleepTaps++ % SLEEPY_LINES.length])
    if (!reduced) gsap.fromTo(kukuImg, { x: -4 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.2)' })
    return
  }
  sfx.meow()
  if (waitTaps < WAIT_LINES.length) {
    say(WAIT_LINES[waitTaps++])
    mood(waitTaps % 3 === 0 ? 'cry' : 'eyes', 1500)
    if (!reduced) gsap.fromTo(kukuImg, { rotate: -10 }, { rotate: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' })
  } else {
    fallAsleep("ok. i'm going to sleep. wake me at 12. (don't.)")
  }
}
function fallAsleep(line) {
  clearTimeout(moodTimer)
  mood('sleep', 0)
  if (line) say(line, 6000)
}

/* ---------------- eggs ---------------- */
const EGGS = {
  gst: 'Tapped the GST clock',
  ali12: "Picked Ali's 12",
  batman: 'Found Batman (it was Ali)',
  hamza: 'Guessed HAMZA in the Wordle',
  hold: 'Long-pressed Kuku',
  sign: 'Caught a rude cat',
  shake: 'Shook the phone',
  title: 'Poked the title five times',
  born: 'Opened it at 1:30pm, your birth time',
  turn: 'Turned the phone sideways',
  bench: 'Rested at the bench',
  psi: 'Read your own mind five times',
  gojo: 'Found Gojo',
  idle: 'Let Kuku fall asleep',
  bro: 'Let your brother steal three pieces',
  resist: 'Resisted the Cinnabon',
  candles: 'Blew out all 22 candles by hand',
}
const HINTS = {
  gst: 'A clock that does not exist.',
  ali12: 'The wrong answer at the start.',
  batman: "Poke Ali's clock. Or his name.",
  hamza: 'Guess a name in the Wordle.',
  hold: "Don't just tap Kuku. Hold.",
  sign: 'Rude cats keep peeking in from the sides. Tap one.',
  shake: 'Shake things up.',
  title: 'Poke the top-left corner.',
  born: 'Come back at the time you were born.',
  turn: 'Hold your phone the wrong way.',
  bench: 'Sit down somewhere.',
  psi: 'Keep reading your mind.',
  gojo: 'Something blindfolded is hiding in the anime corner.',
  idle: 'Do nothing for a while.',
  bro: 'Let the brother win.',
  resist: 'Say no to cinnamon.',
  candles: 'Skip the mic. Do the candles yourself.',
}
const toast = $('#toast')
let toastTimer
function renderEggCount() { $('#eggCount').textContent = state.eggs.length }
renderEggCount()
function egg(id, title, line) {
  if (line) say(line, 4200)
  if (!state.revealed) return
  if (state.eggs.includes(id)) return
  state.eggs.push(id)
  save()
  renderEggCount()
  sfx.egg()
  const hud = $('#hudEggs')
  hud.classList.remove('bump'); void hud.offsetWidth; hud.classList.add('bump')
  toast.innerHTML = `<b>Easter egg ${state.eggs.length}/${TOTAL_EGGS}</b>${title}`
  toast.hidden = false
  buzz([30, 40, 30])
  if (!reduced) gsap.fromTo(toast, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 })
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.hidden = true), 3200)
}

/* ---------------- confetti ---------------- */
const COLORS = ['#ffcf6b', '#ff8fb6', '#eef1ff', '#6aaa64', '#a9b0d6']
function burst(x = 0.5, y = 0.6, n = 90) {
  if (reduced) return
  sfx.pop()
  confetti({ particleCount: n, spread: 80, origin: { x, y }, colors: COLORS, scalar: 0.9, disableForReducedMotion: true })
}
function bigCelebrate() {
  if (reduced) return
  sfx.pop(); setTimeout(() => sfx.pop(), 250)
  const end = Date.now() + 1600
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS })
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

/* ---------------- peekers: rude cats sliding in from the sides ---------------- */
const peeker = $('#peeker')
const PEEKERS = {
  'sign-short': 'rude. accurate though.',
  'sign-gay': 'kuku did not write that sign.',
  finger: 'KUKU. language. (that was not kuku)',
}
let peekTimer, peekHide, lastPeek = ''
function schedulePeek(min = 12000, max = 26000) {
  clearTimeout(peekTimer)
  peekTimer = setTimeout(showPeek, min + Math.random() * (max - min))
}
function showPeek() {
  if (document.hidden || document.querySelector('.popcat') || !state.revealed) return schedulePeek(4000, 8000)
  let name
  do { name = pick(Object.keys(PEEKERS)) } while (name === lastPeek)
  lastPeek = name
  const left = Math.random() < 0.5
  peeker.dataset.name = name
  peeker.querySelector('img').src = CAT[name]
  peeker.className = `peeker ${left ? 'from-left' : 'from-right'}`
  peeker.style.top = `${18 + Math.random() * 46}vh`
  peeker.hidden = false
  const off = left ? -150 : 150
  gsap.fromTo(peeker, { x: off, rotate: left ? 14 : -14 }, { x: 0, rotate: left ? 4 : -4, duration: 0.5, ease: 'back.out(1.6)' })
  sfx.whoosh()
  clearTimeout(peekHide)
  peekHide = setTimeout(() => hidePeek(off), 4500)
}
function hidePeek(off = -150) {
  gsap.to(peeker, { x: off, duration: 0.35, onComplete: () => { peeker.hidden = true; schedulePeek() } })
}
peeker.addEventListener('click', () => {
  clearTimeout(peekHide)
  sfx.hiss()
  buzz(30)
  mood('cry', 1800)
  const line = PEEKERS[peeker.dataset.name]
  hidePeek(peeker.classList.contains('from-left') ? -150 : 150)
  egg('sign', 'Caught a rude cat', line)
  if (state.eggs.includes('sign')) say(line)
})

/* ---------------- level flow ---------------- */
const levels = $$('.level')
function showUpTo(n) { levels.forEach((l) => (l.hidden = +l.dataset.level > n)) }
function unlock(n) {
  if (n > state.level) { state.level = n; save() }
  showUpTo(state.level)
  const el = levels[n]
  if (!reduced) gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
  requestAnimationFrame(() => el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }))
  const intros = {
    1: ['five letters. you know this one.', 'eyes'],
    2: ["it's dark. like your humour.", 'eyes'],
    3: ['weeb section. i allowed it.', 'music'],
    4: ['gym arc. i am your coach now.', 'buff'],
    5: ['make a wish. not a dumb one.', 'yay'],
    6: ['history lesson.', 'flower'],
    7: ['he wrote this himself. i checked.', 'eyes'],
  }
  if (intros[n]) {
    // don't stomp on a reaction that's still showing; wait for it to finish
    const wait = Math.max(700, reactionUntil - Date.now() + 200)
    setTimeout(() => say(intros[n][0]), 700)
    setTimeout(() => mood(intros[n][1], n === 4 ? 0 : 2600), n === 4 ? 700 : wait)
  }
  if (n !== 4 && kukuImg.dataset.mood === 'buff') mood(baseMood(), 0)
}
$$('[data-next]').forEach((b) => b.addEventListener('click', () => unlock(+b.dataset.next)))

/* ---------------- clocks + gate ---------------- */
const fmt = (tz) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
const fIE = fmt('Europe/Dublin'), fPK = fmt('Asia/Karachi')
const pkParts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: 'numeric', minute: 'numeric', hour12: false })
function tick() {
  const now = new Date()
  $('#clkIE').textContent = fIE.format(now)
  $('#clkPK').textContent = fPK.format(now)
  const r = () => String(Math.floor(Math.random() * 99)).padStart(2, '0')
  $('#clkGSTt').textContent = `${r()}:${r()}`

  // birth time easter egg: 1:30pm PKT
  const [h, m] = pkParts.format(now).split(':').map(Number)
  if (h === 13 && m >= 30 && now.getTime() >= BIRTHDAY - 86400000) {
    egg('born', 'You were born right about now', '1:30pm. you were born now-ish. I remember things. sometimes.')
  }
}
tick()
setInterval(tick, 1000)


$('#clkGST').addEventListener('click', () => { mood('cry', 2000); egg('gst', 'Found the GST clock', 'I DONT HAVE GST CLOCK') })
$('#pickAli').addEventListener('click', () => {
  document.body.classList.remove('screen-shake'); void document.body.offsetWidth
  document.body.classList.add('screen-shake')
  buzz(120)
  sfx.thud()
  mood('cry', 2600)
  popCat('samiya-angry', 'you, every time he is late')
  egg('ali12', "Picked Ali's 12", "that's 4 hours late. as usual 😭 try again.")
})
$('#pickYou').addEventListener('click', () => { burst(0.5, 0.7); sfx.win(); mood('yay', 2600); unlock(1) })

// batman: tap Ali's clock three times, or his signature
function batman() {
  sfx.batman()
  buzz([40, 30, 40, 30, 120])
  popCat('batman', "I'm Batman.<br><small>– Ali Hamza, a.k.a. pp</small>", 3200)
  egg('batman', 'Found Batman (it was Ali)', "it's just ali in a cape. ignore him.")
}
let aliTaps = 0, aliTimer
$('#clkIE').closest('.clock').addEventListener('click', () => {
  aliTaps++
  clearTimeout(aliTimer)
  aliTimer = setTimeout(() => (aliTaps = 0), 1200)
  if (aliTaps >= 3) { aliTaps = 0; batman() }
})

/* ---------------- wordle ---------------- */
const ANSWER = 'DUMBO'
const board = $('#board')
const msg = $('#wordleMsg')
let cur = ''
let done = false
for (let r = 0; r < 6; r++) {
  const row = document.createElement('div')
  row.className = 'row'
  for (let c = 0; c < 5; c++) { const t = document.createElement('div'); t.className = 'tile'; row.append(t) }
  board.append(row)
}
const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', '+ZXCVBNM-']
const kb = $('#keyboard')
KEYS.forEach((line) => {
  const row = document.createElement('div')
  row.className = 'krow'
  for (const ch of line) {
    const k = document.createElement('button')
    k.type = 'button'
    k.className = 'key'
    if (ch === '+') { k.textContent = 'enter'; k.dataset.k = 'ENTER'; k.classList.add('wide') }
    else if (ch === '-') { k.textContent = '⌫'; k.dataset.k = 'BACK'; k.classList.add('wide'); k.setAttribute('aria-label', 'Delete') }
    else { k.textContent = ch; k.dataset.k = ch }
    row.append(k)
  }
  kb.append(row)
})
kb.addEventListener('click', (e) => { const k = e.target.closest('.key'); if (k) press(k.dataset.k) })
document.addEventListener('keydown', (e) => {
  if (state.level < 1 || $('#lv-wordle').hidden) return
  if (e.key === 'Enter') press('ENTER')
  else if (e.key === 'Backspace') press('BACK')
  else if (/^[a-z]$/i.test(e.key)) press(e.key.toUpperCase())
})

function score(guess) {
  const res = Array(5).fill('miss')
  const pool = ANSWER.split('')
  for (let i = 0; i < 5; i++) if (guess[i] === ANSWER[i]) { res[i] = 'hit'; pool[i] = null }
  for (let i = 0; i < 5; i++) {
    if (res[i] === 'hit') continue
    const j = pool.indexOf(guess[i])
    if (j > -1) { res[i] = 'near'; pool[j] = null }
  }
  return res
}
function paintRow(r, guess, animate) {
  const tiles = board.children[r].children
  const res = score(guess)
  for (let i = 0; i < 5; i++) {
    const t = tiles[i]
    t.textContent = guess[i]
    const apply = () => {
      t.classList.add(res[i])
      if (animate) sfx.tile(res[i], i)
      const key = kb.querySelector(`[data-k="${guess[i]}"]`)
      const rank = { miss: 0, near: 1, hit: 2 }
      const prev = ['hit', 'near', 'miss'].find((c) => key.classList.contains(c))
      if (!prev || rank[res[i]] > rank[prev]) { key.classList.remove('miss', 'near', 'hit'); key.classList.add(res[i]) }
    }
    if (animate) { t.style.animationDelay = `${i * 0.25}s`; t.classList.add('reveal'); setTimeout(apply, i * 250 + 250) }
    else apply()
  }
  return res
}
function renderCurrent() {
  const r = state.guesses.length
  if (r >= 6) return
  const tiles = board.children[r].children
  for (let i = 0; i < 5; i++) { tiles[i].textContent = cur[i] || ''; tiles[i].classList.toggle('filled', !!cur[i]) }
}
const reactions = {
  IDIOT: 'translation: text me when you get home',
  PAGAL: "translation: he laughed and won't admit it",
  KUKUS: 'there is only one kuku',
  HAPPY: 'not yet. keep going.',
  CAKES: 'later. focus.',
  SHORT: 'the sign cat agrees.',
}
function press(k) {
  if (done) return
  if (k === 'BACK') { cur = cur.slice(0, -1); renderCurrent(); sfx.back(); return }
  if (k === 'ENTER') {
    if (cur.length < 5) {
      const row = board.children[state.guesses.length]
      row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake')
      msg.textContent = 'five letters, noob'
      sfx.error()
      buzz(80)
      return
    }
    const g = cur
    state.guesses.push(g)
    save()
    cur = ''
    paintRow(state.guesses.length - 1, g, true)
    setTimeout(() => afterGuess(g), 1500)
    return
  }
  if (cur.length < 5) { cur += k; renderCurrent(); sfx.key(); buzz(8) }
}
function afterGuess(g) {
  msg.textContent = ''
  if (g === 'HAMZA') { mood('eyes', 2500); egg('hamza', 'HAMZA in the Wordle', 'why is HE in your head. on your birthday.') }
  else if (reactions[g]) say(reactions[g])
  if (g === ANSWER) return finishWordle(true, true)
  if (state.guesses.length >= 6) { state.wordleFails++; save(); return finishWordle(false, true) }
  const lines = ['hmm', 'no', 'close-ish', 'try again', 'noob']
  msg.textContent = state.guesses.length >= 3 ? 'hint: what does Ali call you?' : pick(lines)
}
const tries = () => state.guesses.indexOf(ANSWER) + 1
function finishWordle(won, live = false) {
  done = true
  if (won) {
    const n = tries()
    msg.textContent = n <= 2 ? `In ${n}. Wordle in 2, as promised.` : `DUMBO. Obviously. ${n}/6.`
    if (live) {
      say(n <= 2 ? 'ok that was impressive. noob.' : 'it was always going to be DUMBO.')
      mood('yay', 3000); sfx.win(); burst(0.5, 0.5)
    }
  } else {
    const f = state.wordleFails
    const SHAME = [
      ['X/6. Six guesses. Five letters. Zero brain cells.', 'kuku is embarrassed to be seen with you.', '6 guesses.<br>0 brain cells.'],
      ['X/6 again. Twice. TWICE. Hint: what does Ali call you?', 'i am telling ali. he will never let this go.', 'TWICE.'],
      ['X/6. It starts with D. It ends with O. It is you.', 'this is a cry for help. D _ _ _ O.', 'kuku has lost all hope'],
    ]
    const [line, kukuLine, pop] = SHAME[Math.min(f - 1, SHAME.length - 1)] || SHAME[0]
    msg.textContent = line
    $('#retryWordle').hidden = false
    $('#wordleAfter [data-next]').textContent = 'Give up and keep going'
    if (live) { say(kukuLine, 6000); mood('cry', 4000); sfx.lose(); popCat('cry', pop, 2800); buzz([120, 60, 120]) }
  }
  $('#wordleAfter').hidden = false
}
function resetWordle() {
  state.guesses = []; save()
  cur = ''; done = false
  $$('.tile', board).forEach((t) => { t.textContent = ''; t.className = 'tile'; t.style.animationDelay = '' })
  $$('.key', kb).forEach((k) => k.classList.remove('hit', 'near', 'miss'))
  $('#wordleAfter').hidden = true
  $('#retryWordle').hidden = true
  $('#wordleAfter [data-next]').textContent = 'Keep going'
  msg.textContent = state.wordleFails > 1 ? 'Round ' + (state.wordleFails + 1) + '. Kuku is not watching. (she is.)' : "Round 2. Don't embarrass me again."
  mood('eyes', 2000)
  say(pick(['fine. one more chance.', 'again?? ok.', 'deep breaths. five letters.']))
  board.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
}
$('#retryWordle').addEventListener('click', resetWordle)
$('#copyGrid').addEventListener('click', async () => {
  const em = { hit: '🟩', near: '🟨', miss: '⬛' }
  const grid = state.guesses.map((g) => score(g).map((s) => em[s]).join('')).join('\n')
  const n = state.guesses.includes(ANSWER) ? tries() : 'X'
  const text = `Samiya's birthday Wordle ${n}/6\n\n${grid}`
  try { await navigator.clipboard.writeText(text); say('copied. send it to him.') }
  catch { say("couldn't copy. screenshot it instead.") }
})
state.guesses.forEach((g, i) => paintRow(i, g, false))
if (state.guesses.includes(ANSWER) || state.guesses.length >= 6) finishWordle(state.guesses.includes(ANSWER))

/* ---------------- cave ---------------- */
const MEMORIES = [
  { when: 'Every other week', q: '"play hollow knight"', t: 'You said it so many times I lost count. So I played, and you watched. You still say I never do anything with you.' },
  { when: 'Sep 2026', q: '"I come dc if u play silksong hehehhehe"', t: 'Bribery. It worked. Then the next day: "i miss hollow knight". Same, honestly.' },
  { when: 'Aug 2025', q: '"WE CAN WATCH SUZUME"', t: 'Also all caps. Then in April, me: "You couldn\'t even decide what to watch." Both true.' },
  { when: 'Jul 2026', q: '"I tried cheesecake for the first time aj"', t: 'Twenty-one years without cheesecake. I said "I love cheese cake" and I stand by it.' },
  { when: 'Sep 2026', q: '"khana khalo"', t: "Your answer to me being tired, sick, dramatic or all three. It works. Don't tell anyone." },
]
const lanternsEl = $('#lanterns')
const lit = new Set()
MEMORIES.forEach((m, i) => {
  const b = document.createElement('button')
  b.type = 'button'
  b.className = 'lantern'
  b.setAttribute('aria-label', `Lantern ${i + 1}`)
  const chain = 20 + ((i * 37) % 70)
  b.innerHTML = `<span class="chain" style="height:${chain}px"></span>
  <svg viewBox="0 0 52 76" aria-hidden="true">
    <circle class="glow" cx="26" cy="44" r="34" fill="#ffcf6b" opacity=".25" style="filter:blur(10px)"/>
    <path d="M18 8 h16 l4 8 h-24z" fill="#a9b0d6"/>
    <path class="glass" d="M14 16 h24 q6 28 0 50 h-24 q-6 -22 0 -50z" stroke="#a9b0d6" stroke-width="3"/>
    <path d="M12 66 h28 v6 h-28z" fill="#a9b0d6"/>
    <path d="M26 0 v8" stroke="#a9b0d6" stroke-width="3"/>
  </svg>`
  b.addEventListener('click', () => lightLantern(i, b))
  lanternsEl.append(b)
})
function geoBurst(el) {
  if (reduced) return
  sfx.geo()
  const r = el.getBoundingClientRect()
  for (let i = 0; i < 8; i++) {
    const g = document.createElement('span')
    g.className = 'geo'
    g.style.left = `${r.left + r.width / 2}px`
    g.style.top = `${r.top + r.height / 2}px`
    document.body.append(g)
    gsap.to(g, {
      x: (Math.random() - 0.5) * 160, y: -40 - Math.random() * 100, rotation: Math.random() * 360,
      duration: 0.5, ease: 'power2.out',
      onComplete: () => gsap.to(g, { y: '+=180', opacity: 0, duration: 0.6, ease: 'power1.in', onComplete: () => g.remove() }),
    })
  }
}
function lightLantern(i, b) {
  const m = MEMORIES[i]
  $('#memory').innerHTML = `<small>${m.when}</small><q>${m.q}</q>${m.t}`
  sfx.lantern(i)
  if (!lit.has(i)) { lit.add(i); b.classList.add('lit'); geoBurst(b); buzz(20) }
  if (lit.size === MEMORIES.length && $('#benchWrap').hidden) {
    $('#benchWrap').hidden = false
    mood('eyes', 2500)
    say('a bench. sit. you look tired.')
  }
}
$('#restBench').addEventListener('click', () => {
  sfx.bench()
  mood('sleep', 2600)
  egg('bench', 'Rested at the bench', 'progress saved. unlike your sleep schedule.')
  setTimeout(() => unlock(3), 900)
})

/* ---------------- anime ---------------- */
const THOUGHTS = [
  'i want chocolate', 'i miss hollow knight', 'i want to eat', 'wanna watch', 'PLAY SILKSONG',
  'aaaaaaa idk', 'should I eat', 'heuehueehue', 'I DONT HAVE GST CLOCK', 'hamza dont',
  'thankuthanku', 'ice cream?', 'meri birthday aj hai', 'istg', 'pagal aurat', 'gojo is so pretty',
]
let psiCount = 0, lastThought = ''
$('#psiBtn').addEventListener('click', () => {
  let t
  do { t = pick(THOUGHTS) } while (t === lastThought)
  lastThought = t
  $('#thought').textContent = `"${t}"`
  psiCount++
  buzz(10)
  sfx.shimmer()
  mood('eyes', 1500)
  if (!reduced) gsap.fromTo('#psiBtn', { rotate: -10 }, { rotate: 0, duration: 0.4, ease: 'elastic.out(1,0.4)' })
  if (psiCount === 5) egg('psi', 'Read your own mind five times', 'psychic diagnosis: mostly food.')
})

let clocheUp = false
$('#liftCloche').addEventListener('click', () => {
  clocheUp = !clocheUp
  gsap.to('#cloche', { y: clocheUp ? -90 : 0, rotate: clocheUp ? -12 : 0, duration: reduced ? 0 : 0.6, ease: 'back.out(1.6)' })
  $('#liftCloche').textContent = clocheUp ? 'Cover it again' : 'Lift the cover'
  $('#butlerLine').textContent = clocheUp
    ? 'Gulab jamun, my lady. Warm, in syrup. If I couldn\'t manage this much, what kind of butler would I be?'
    : 'Yes, my lady.'
  if (clocheUp) { sfx.shimmer(); burst(0.5, 0.55, 40); buzz(20); mood('yay', 2000) }
})

// gojo, hiding behind the brother panel
$('#gojoPeek').addEventListener('click', () => {
  sfx.domain()
  buzz([20, 40, 20, 40, 80])
  popCat('gojo', 'Throughout heaven and earth,<br>you alone are the birthday one.', 3400)
  egg('gojo', 'Found Gojo', "he's cute. i'm cuter. don't answer that.")
})

const choc = $('#choc')
let stolen = 0, eaten = 0
for (let i = 0; i < 12; i++) {
  const p = document.createElement('button')
  p.type = 'button'
  p.setAttribute('aria-label', 'Chocolate piece')
  p.addEventListener('click', () => eatPiece(p))
  choc.append(p)
}
function eatPiece(p) {
  if (p.classList.contains('gone')) return
  p.classList.add('gone'); eaten++; buzz(10); sfx.crunch()
  const left = $$('button:not(.gone)', choc)
  if (left.length && Math.random() < 0.45) {
    const s = pick(left)
    setTimeout(() => {
      s.classList.add('gone'); stolen++
      sfx.whoosh()
      mood('cry', 1500)
      $('#broLine').textContent = pick(['brother stole one 😾', 'BROTHER.', 'he took another', 'gone. he is chewing loudly.'])
      if (stolen === 3) egg('bro', 'Brother stole three pieces', 'you let him win. very big sister of you.')
    }, 250)
  } else {
    $('#broLine').textContent = pick(['mine', 'nom', 'hehe', 'safe'])
  }
  if (!$$('button:not(.gone)', choc).length) {
    setTimeout(() => ($('#broLine').textContent = `You ate ${eaten}. He stole ${stolen}. Classic.`), 300)
  }
}

/* ---------------- cake ---------------- */
const candlesEl = $('#candles')
for (let i = 0; i < 22; i++) {
  const c = document.createElement('div')
  c.className = 'candle'
  c.innerHTML = '<span class="flame"></span>'
  c.addEventListener('click', () => blowOne(c))
  candlesEl.append(c)
}
let micBlew = false
function blowOne(c, byMic = false) {
  if (c.classList.contains('out')) return
  if (byMic) micBlew = true
  c.classList.add('out')
  sfx.blow()
  if (!$$('.candle:not(.out)').length) candlesDone()
}
let micStream, micRaf
function candlesDone() {
  if (state.candlesOut && !$('#cakeAfter').hidden) return
  state.candlesOut = true; save()
  stopMic()
  if (!micBlew) setTimeout(() => egg('candles', 'Blew out all 22 candles by hand', 'by HAND. all 22. dedication.'), 1800)
  $('#cakeMsg').textContent = 'Happy 22nd, Samiya.'
  say('wish made. i hope it was not dumb.')
  mood('yay', 4000)
  sfx.win()
  bigCelebrate(); buzz([60, 40, 60, 40, 120])
  $('#cakeAfter').hidden = false
}
function stopMic() {
  cancelAnimationFrame(micRaf)
  micStream?.getTracks().forEach((t) => t.stop())
  micStream = null
}
$('#blowBtn').addEventListener('click', async () => {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } })
  } catch {
    $('#cakeMsg').textContent = 'No mic. Tap the candles to blow them out instead.'
    return
  }
  $('#cakeMsg').textContent = 'Blow!'
  mood('eyes', 3000)
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const an = ctx.createAnalyser()
  an.fftSize = 512
  ctx.createMediaStreamSource(micStream).connect(an)
  const data = new Uint8Array(an.fftSize)
  let loud = 0
  const loop = () => {
    an.getByteTimeDomainData(data)
    let sum = 0
    for (const v of data) { const d = (v - 128) / 128; sum += d * d }
    const rms = Math.sqrt(sum / data.length)
    if (rms > 0.12) {
      loud++
      if (loud % 3 === 0) {
        const lit = $$('.candle:not(.out)')
        lit.sort(() => Math.random() - 0.5).slice(0, 2).forEach((c) => blowOne(c, true))
      }
    }
    if (micStream) micRaf = requestAnimationFrame(loop)
    else ctx.close()
  }
  loop()
})
$('#tapBlow').addEventListener('click', () => {
  $('#cakeMsg').textContent = 'Fine. Tap each candle. All 22.'
  say('shy mic. shy girl. tap them.')
})

/* ---------------- letter ---------------- */
const WORDS = {
  noob: "you did better than me and I'm coping",
  idiot: 'text me when you get home',
  pagal: "I laughed out loud and I'm not admitting it",
}
$$('.letter .w').forEach((w) => w.addEventListener('click', () => {
  if (w.dataset.w === 'gym') { mood('buff', 2600); sfx.thud(); say('the gym works. look at me.'); return }
  mood('eyes', 2000)
  say(`"${w.textContent}" = ${WORDS[w.dataset.w]}`, 4000)
}))
$('#sign').addEventListener('click', batman)

$('#getLost').addEventListener('click', () => {
  document.body.classList.remove('screen-shake'); void document.body.offsetWidth
  document.body.classList.add('screen-shake')
  buzz([100, 50, 100])
  sfx.whoosh()
  mood('finger', 0)
  say('fine. bye.', 1200)
  if (!reduced) gsap.to(kuku, { x: innerWidth, duration: 0.5, ease: 'power2.in' })
  setTimeout(() => {
    state.finale = true; save()
    $('#finale').hidden = false
    $('#getLost').parentElement.hidden = true
    renderFinale()
    bigCelebrate()
    catRain(20)
    $('#finale').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    mood('heart', 0)
    if (!reduced) gsap.fromTo(kuku, { x: innerWidth }, { x: 0, duration: 0.6, ease: 'back.out(1.4)' })
    sfx.meow(true)
    say("...i came back. you didn't go either. good.", 5000)
  }, 1300)
})
function renderFinale() {
  const n = state.eggs.length
  $('#eggReport').textContent = n === TOTAL_EGGS
    ? `All ${TOTAL_EGGS} easter eggs. Noob. (See translation guide.)`
    : `You found ${n} of ${TOTAL_EGGS} easter eggs. The rest are still hiding.`
  $('#eggList').innerHTML = Object.keys(EGGS).map((id) => {
    const found = state.eggs.includes(id)
    return `<li class="${found ? 'found' : ''}">${found ? EGGS[id] : `Hint: ${HINTS[id]}`}</li>`
  }).join('')
}
$('#replay').addEventListener('click', () => {
  state = { level: 0, eggs: state.eggs, pets: state.pets, guesses: [], candlesOut: false, finale: false }
  save()
  location.href = location.pathname + (ALI_MODE ? '?ali' : '')
})

/* ---------------- global easter eggs ---------------- */
const RAIN_CATS = ['angry', 'calm', 'heart', 'yay', 'flower', 'eyes', 'music', 'sleep', 'cry', 'buff', 'finger']
function catRain(n = 26) {
  if (reduced) return
  const rain = $('#rain')
  for (let i = 0; i < n; i++) {
    const img = document.createElement('img')
    img.src = CAT[pick(RAIN_CATS)]
    img.style.left = `${Math.random() * 90}vw`
    img.style.width = `${44 + Math.random() * 50}px`
    rain.append(img)
    gsap.to(img, {
      y: innerHeight + 160, rotation: (Math.random() - 0.5) * 540,
      duration: 1.6 + Math.random() * 1.4, delay: Math.random() * 0.8, ease: 'power1.in',
      onComplete: () => img.remove(),
    })
  }
}

let lastShake = 0
window.addEventListener('devicemotion', (e) => {
  const a = e.accelerationIncludingGravity || e.acceleration
  if (!a) return
  const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2)
  if (mag > 28 && Date.now() - lastShake > 2500) {
    lastShake = Date.now()
    catRain()
    sfx.meow(); setTimeout(() => sfx.meow(true), 200)
    buzz(60)
    mood('cry', 2000)
    egg('shake', 'Shook the phone', 'it is raining kukus. happy now?')
  }
})

let titleTaps = 0, titleTimer
$('#hudTitle').addEventListener('click', () => {
  titleTaps++
  sfx.tap()
  clearTimeout(titleTimer)
  titleTimer = setTimeout(() => (titleTaps = 0), 1500)
  if (titleTaps >= 5) { titleTaps = 0; mood('eyes', 2000); egg('title', 'Poked the title five times', "stop poking things. you're 22.") }
})

const land = matchMedia('(orientation: landscape) and (max-height: 500px)')
const onLand = () => { if (land.matches) egg('turn', 'Turned the phone sideways', 'phone seedha karo.') }
land.addEventListener?.('change', onLand)
onLand()

let idleTimer
const resetIdle = () => {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    if (!state.revealed) { if (!revealShown) fallAsleep('zzz… wake me at 12…'); return }
    mood('sleep', 0)
    egg('idle', 'Let Kuku fall asleep', 'zzz... khana khalo... zzz')
  }, 45000)
}
;['pointerdown', 'keydown', 'scroll'].forEach((ev) => addEventListener(ev, resetIdle, { passive: true }))
resetIdle()

/* ---------------- gym ---------------- */
const GYM_LINES = {
  1: 'one. ok.',
  5: 'five. kuku is impressed. (she is not)',
  9: '"What\'s the point of gym" – Ali, 23 Sep. keep going.',
  11: 'halfway. something smells like cinnamon…',
  15: 'form is questionable. continue.',
  19: 'bicep showcase loading…',
  21: 'one more. the Cinnabon is watching.',
}
let reps = 0
const gymCat = $('#gymCat')
function renderReps() {
  $('#reps').textContent = reps
  $('#repBar').style.width = `${(reps / 22) * 100}%`
}
$('#curlBtn').addEventListener('click', () => {
  if (reps >= 22) return
  reps++
  renderReps()
  sfx.rep(reps)
  buzz(12)
  if (!reduced) {
    gsap.fromTo(gymCat, { scaleY: 0.82, scaleX: 1.12, rotate: reps % 2 ? -4 : 4 }, { scaleY: 1, scaleX: 1, rotate: 0, duration: 0.35, ease: 'elastic.out(1,0.4)' })
  }
  if (GYM_LINES[reps]) $('#gymLine').textContent = GYM_LINES[reps]
  if (reps === 22) gymDone()
})
function gymDone() {
  $('#curlBtn').disabled = true
  $('#curlBtn').textContent = '22 reps. Done.'
  $('#gymLine').textContent = '22 reps for 22 years. Strongest Dumbo alive.'
  sfx.win(); burst(0.5, 0.55); mood('buff', 0)
  say('bicep showcase easy.', 3500)
  setTimeout(() => {
    $('#bun').hidden = false
    if (!reduced) gsap.fromTo('#bun', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' })
    $('#bun').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
    sfx.shimmer()
    mood('eyes', 0)
    say('a cinnabon. on the way home from gym. classic.')
  }, 1300)
}
function bunChoice(ate) {
  state.gym = ate ? 'ate' : 'resisted'; save()
  $$('#bun .choice .btn').forEach((b) => (b.disabled = true))
  if (ate) {
    $('#bunResult').textContent = 'You ate half. "I didnt eat it pura." Respect.'
    mood('yay', 3000); sfx.crunch(); setTimeout(() => sfx.crunch(), 180)
    say('everyday you crave meetha. it is ok. it is your birthday.')
  } else {
    $('#bunResult').textContent = 'Character development. Kuku ate it instead.'
    mood('buff', 3000); sfx.win()
    egg('resist', 'Resisted the Cinnabon', 'resisted. ali is shook.')
  }
  $('#gymAfter').hidden = false
}
$('#eatBun').addEventListener('click', () => bunChoice(true))
$('#resistBun').addEventListener('click', () => bunChoice(false))
if (state.gym) {
  reps = 22; renderReps()
  $('#curlBtn').disabled = true; $('#curlBtn').textContent = '22 reps. Done.'
  $('#bun').hidden = false
  $$('#bun .choice .btn').forEach((b) => (b.disabled = true))
  $('#bunResult').textContent = state.gym === 'ate' ? 'You ate half. "I didnt eat it pura." Respect.' : 'Character development. Kuku ate it instead.'
  $('#gymAfter').hidden = false
}

/* ---------------- intro loader ---------------- */
const LOADER_LINES = [
  'waking up Kuku (the cat, not you)…', 'Kuku woke up angry', 'teaching cats to hold signs', 'hiding 15 easter eggs',
  'calibrating sarcasm', 'setting the clock to Pakistani 12', 'removing Ali\'s excuses',
  'tuning the music box', 'buying a Cinnabon', 'almost there, noob',
]
function runLoader() {
  return new Promise((resolve) => {
    const names = ['heart', 'yay', 'batman', 'music', 'flower', 'gojo', 'eyes', 'buff', 'sleep', 'cry', 'sign-short', 'finger', 'samiya-angry', 'sign-gay', 'calm']
    const orbit = $('#orbit')
    const items = names.map((n, i) => {
      const img = new Image()
      img.alt = ''
      img.dataset.i = i
      orbit.append(img)
      return { img, n, a: (i / names.length) * Math.PI * 2, shown: false }
    })
    let loaded = 0
    const total = items.length + 1
    const t0 = performance.now()
    const bump = () => { loaded++ }
    items.forEach((it) => {
      it.img.onload = it.img.onerror = () => {
        bump()
        it.shown = true
        if (!reduced) gsap.fromTo(it.img, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', delay: Math.random() * 0.4 })
        else it.img.style.opacity = 1
      }
      it.img.src = CAT[it.n]
    })
    ;(document.fonts?.ready || Promise.resolve()).then(bump)

    // carousel orbit with fake depth
    let spin = 0, raf
    const R = Math.min(150, innerWidth * 0.38)
    const loop = () => {
      spin += 0.008
      for (const it of items) {
        const ang = it.a + spin
        const x = Math.cos(ang) * R
        const y = Math.sin(ang) * R * 0.42
        const depth = (Math.sin(ang) + 1) / 2
        it.img.style.transform = `translate(${x}px, ${y}px) scale(${0.6 + depth * 0.55})`
        it.img.style.zIndex = depth > 0.5 ? 3 : 1
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    let li = 0
    const lineTimer = setInterval(() => { li = (li + 1) % LOADER_LINES.length; $('#loaderLine').textContent = LOADER_LINES[li] }, 650)
    let shownPct = 0
    const pctTimer = setInterval(() => {
      const elapsed = performance.now() - t0
      const real = loaded / total
      const timeCap = Math.min(1, elapsed / 3400)
      const target = Math.min(real, timeCap) * 100
      shownPct += (target - shownPct) * 0.25
      if (target >= 100 && shownPct > 99) shownPct = 100
      $('#loaderBar').style.width = `${shownPct}%`
      $('#loaderPct').textContent = `${Math.round(shownPct)}%`
      if (shownPct >= 100) {
        clearInterval(pctTimer); clearInterval(lineTimer)
        $('#loaderLine').textContent = 'ready.'
        const finish = () => {
          cancelAnimationFrame(raf)
          $('.loader-bar').style.visibility = 'hidden'
          $('#loaderPct').style.visibility = 'hidden'
          $('#loaderGo').hidden = false
          $('#loaderLine').textContent = state.revealed ? 'welcome back.' : 'something is waiting for you.'
          resolve()
        }
        if (reduced) return finish()
        // everything collapses into Kuku
        gsap.to(items.map((i) => i.img), { x: 0, y: 0, scale: 0, opacity: 0, duration: 0.6, ease: 'back.in(1.6)', stagger: 0.025 })
        gsap.fromTo('.loader-kuku', { scale: 1 }, { scale: 1.25, duration: 0.18, yoyo: true, repeat: 1, delay: 0.7, onComplete: finish })
      }
    }, 60)
  })
}

/* ---------------- countdown stage ---------------- */
const TEASES = [
  'Kuku is guarding your surprise. Kuku is not happy about it.',
  "No, you can't open it early. Asking every five minutes won't help.",
  "He's actually on time this year. Suspicious.",
  'Pakistani 12. Not Irish 12. Not GST 12.',
  'Tap Kuku if you are bored. She will hate it.',
  'The headphones cat at the top mutes the music.',
  'Tap the scene name at the bottom to change the view.',
  "It's not a selfie. Don't worry.",
]
let bg, stageTimer, teaseTimer, revealShown = false
const pad2 = (n) => String(n).padStart(2, '0')
function setDigit(id, val) {
  const el = $(id)
  if (el.textContent !== val) {
    el.textContent = val
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick')
  }
}
function openStage() {
  document.body.classList.remove('is-loading')
  document.body.classList.add('is-waiting')
  $('#stage').hidden = false
  bg = createBackground([$('#bgA'), $('#bgB')], ['angry', 'heart', 'yay', 'flower', 'music', 'eyes', 'calm', 'sleep'].map((n) => CAT[n]), {
    onScene: (s) => { $('#sceneName').textContent = s.label; playTheme(s.theme) },
  })
  bg.start()
  $('#sceneBtn').addEventListener('click', () => { sfx.shimmer(); bg.next() })
  let ti = 0
  const tease = $('#tease')
  tease.textContent = TEASES[0]
  teaseTimer = setInterval(() => {
    if (revealShown) return
    ti = (ti + 1) % TEASES.length
    tease.style.opacity = 0
    setTimeout(() => { tease.textContent = TEASES[ti]; tease.style.opacity = 1 }, 400)
  }, 6500)
  const ready = Date.now() >= TARGET
  if (!ready) setTimeout(() => say('not yet, noob. wait with me.'), 700)
  const update = () => {
    const s = Math.max(0, Math.ceil((TARGET - Date.now()) / 1000))
    setDigit('#cdH', pad2(Math.floor(s / 3600)))
    setDigit('#cdM', pad2(Math.floor((s % 3600) / 60)))
    setDigit('#cdS', pad2(s % 60))
    if (s <= 0 && !revealShown) showRevealButton()
  }
  update()
  stageTimer = setInterval(update, 250)
}
function showRevealButton() {
  revealShown = true
  $('#stageKicker').textContent = "It's 12. Your 12."
  $('#tease').textContent = 'Go on then.'
  $('#tease').style.opacity = 1
  $('#revealBtn').hidden = false
  if (!reduced) gsap.fromTo('#revealBtn', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' })
  burst(0.5, 0.45, 70)
  sfx.win()
  buzz([80, 60, 80])
  const wasAsleep = sleeping
  mood('yay', 0)
  say(wasAsleep ? "I'M AWAKE. it's 12. press it. PRESS IT." : 'it is time. press it. PRESS IT.', 6000)
}
$('#revealBtn').addEventListener('click', () => {
  clearInterval(stageTimer); clearInterval(teaseTimer)
  sfx.domain()
  buzz([40, 30, 200])
  const finish = () => {
    bg?.stop()
    $('#stage').hidden = true
    state.revealed = true; save()
    enterSite(true)
  }
  if (reduced) return finish()
  gsap.timeline()
    .to('.stage-inner', { scale: 1.15, opacity: 0, duration: 0.45, ease: 'power2.in' })
    .to('#flash', { opacity: 1, duration: 0.18 }, '-=0.1')
    .add(finish)
    .to('#flash', { opacity: 0, duration: 0.9, ease: 'power2.out' })
})

/* ---------------- Kuku introduces herself (separate screen, once) ---------------- */
function runIntro() {
  return new Promise((resolve) => {
    const ready = Date.now() >= TARGET || state.revealed
    const LINES = [
      ['angry', "hi. i'm Kuku."],
      ['eyes', 'Kuku is ME. the angry cat. not you.'],
      ['flower', "you're Samiya. the birthday one."],
      ['angry', "i'm the mascot of this website. being angry is my whole personality."],
      ['buff', "i'll be in the corner the whole time. tap me and i'll react. badly."],
      ready ? ['yay', "and it's already 12. so. let's go."] : ['sleep', 'right now my job is guarding your surprise until 12. Pakistani 12. come wait with me.'],
    ]
    const intro = $('#intro'), cat = $('#introCat'), text = $('#introText'), dots = $('#introDots')
    dots.innerHTML = LINES.map(() => '<i></i>').join('')
    intro.hidden = false
    let i = -1, typing
    const show = (n) => {
      i = n
      const [moodName, line] = LINES[i]
      cat.src = CAT[moodName]
      if (!reduced) gsap.fromTo(cat, { scale: 0.7, rotate: -10 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.2)' })
      $$('i', dots).forEach((d, k) => d.classList.toggle('on', k <= i))
      clearInterval(typing)
      if (reduced) text.textContent = line
      else {
        let c = 0
        text.textContent = ''
        typing = setInterval(() => { text.textContent = line.slice(0, ++c); if (c >= line.length) clearInterval(typing) }, 24)
      }
      sfx.meow(moodName === 'yay' || moodName === 'flower')
      buzz(10)
      if (i === LINES.length - 1) {
        $('#introHint').hidden = true
        $('#introDone').hidden = false
        $('#introDone').textContent = ready ? "ok Kuku. let's go" : 'ok Kuku. show me the timer'
      }
    }
    intro.addEventListener('click', (e) => {
      if (e.target.closest('#introDone')) return
      if (i < LINES.length - 1) show(i + 1)
    })
    $('#introDone').addEventListener('click', () => {
      clearInterval(typing)
      state.introduced = true; save()
      const done = () => { intro.remove(); resolve() }
      if (reduced) return done()
      gsap.to(intro, { opacity: 0, duration: 0.4, onComplete: done })
    })
    show(0)
  })
}

/* ---------------- entering the site ---------------- */
function enterSite(firstTime = false) {
  document.body.classList.remove('is-loading', 'is-waiting')
  showUpTo(state.level)
  scrollTo(0, 0)
  playTheme('gate')
  if (firstTime) {
    bigCelebrate()
    catRain(16)
    mood('yay', 4000)
    say("happy birthday noob. it's 12. YOUR 12.", 5000)
  } else {
    say(state.level > 0 ? 'oh. you came back.' : 'hi again. still angry. scroll.')
  }
  schedulePeek(9000, 16000)
}

/* ---------------- boot ---------------- */
showUpTo(state.level)
if (params.has('all')) { state.level = 7; state.revealed = true; showUpTo(7) }
if (state.finale) { $('#finale').hidden = false; $('#getLost').parentElement.hidden = true; renderFinale() }
runLoader()
// the open button runs away a few times before it lets her in
const DODGE_LINES = ['nope.', 'too slow.', 'almost. no.', 'ok ok. last one. probably.']
let dodges = 0, ignoreClick = false
const goBtn = $('#loaderGo')
gsap.set(goBtn, { xPercent: -50 })
goBtn.addEventListener('pointerdown', (e) => {
  ignoreClick = false
  if (reduced || dodges >= DODGE_LINES.length) return
  e.preventDefault()
  ignoreClick = true // the tap that made it jump must not open it
  const r = goBtn.getBoundingClientRect()
  const maxX = innerWidth / 2 - r.width / 2 - 16
  const homeTop = r.top - (gsap.getProperty(goBtn, 'y') || 0)
  let x, y
  do {
    x = (Math.random() * 2 - 1) * maxX
    y = 90 + Math.random() * (innerHeight - 200) - homeTop
    // new spot must be well away from her finger
    var cx = innerWidth / 2 + x, cy = homeTop + y + r.height / 2
  } while (Math.hypot(cx - e.clientX, cy - e.clientY) < 170)
  gsap.to(goBtn, { x, y, rotate: (Math.random() - 0.5) * 24, duration: 0.28, ease: 'back.out(2)' })
  $('#loaderLine').textContent = DODGE_LINES[dodges]
  if (!reduced) gsap.fromTo('.loader-kuku', { rotate: -12 }, { rotate: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' })
  buzz(25)
  dodges++
  if (dodges === DODGE_LINES.length) goBtn.textContent = 'Fine. Open it'
})
goBtn.addEventListener('click', () => {
  if (ignoreClick) { ignoreClick = false; return }
  if (!reduced && dodges < DODGE_LINES.length) return
  initAudio()
  sfx.meow()
  const go = async () => {
    $('#loader').remove()
    if (!state.introduced) {
      document.body.classList.remove('is-loading')
      document.body.classList.add('is-intro')
      await runIntro()
      document.body.classList.remove('is-intro')
    }
    if (state.revealed) enterSite(false)
    else openStage()
  }
  if (reduced) return go()
  gsap.to('#loader', { opacity: 0, scale: 1.08, duration: 0.5, ease: 'power2.in', onComplete: go })
})
