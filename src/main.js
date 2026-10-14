import '@fontsource/gaegu/latin-400.css'
import '@fontsource/gaegu/latin-700.css'
import '@fontsource/atkinson-hyperlegible/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-700.css'
import './style.css'
import { gsap } from 'gsap'
import confetti from 'canvas-confetti'
import kukuAngry from './assets/kuku-angry.png'
import kukuCalm from './assets/kuku-calm.png'

const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p) } catch {} }
const pick = (a) => a[Math.floor(Math.random() * a.length)]

// 15 Oct 2026, 00:00 in Pakistan (UTC+5) = 14 Oct 19:00 UTC
const BIRTHDAY = Date.UTC(2026, 9, 14, 19, 0, 0)
const params = new URLSearchParams(location.search)
const ALI_MODE = params.has('ali')

$$('.kuku-src').forEach((img) => (img.src = kukuAngry))
$('#favicon').href = kukuAngry

/* ---------------- state ---------------- */
const KEY = 'kuku-bday-v1'
let state = { level: 0, eggs: [], pets: 0, guesses: [], candlesOut: false }
try {
  if (params.has('reset')) localStorage.removeItem(KEY)
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
  if (saved) state = { ...state, ...saved }
} catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {} }

/* ---------------- Kuku ---------------- */
const bubble = $('#bubble')
const kuku = $('#kuku')
const kukuImg = $('#kukuImg')
let bubbleTimer
function say(text, ms = 3200) {
  bubble.textContent = text
  bubble.classList.add('show')
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms)
  if (!reduced) gsap.fromTo(kuku, { y: 0 }, { y: -10, duration: 0.12, yoyo: true, repeat: 1 })
}

const petLines = [
  "don't touch me", 'noob', '...', 'kya masla hai', 'stop', 'khair hai?', 'pagal ho',
  "i'm not a cat. i'm KUKU", 'hmph', "you're doing it wrong", '...continue', 'ok one more',
  'this is harassment', 'fine',
]
function setCalm(calm) {
  kukuImg.src = calm ? kukuCalm : kukuAngry
  kuku.classList.toggle('calm', calm)
}
if (state.pets >= 15) setCalm(true)

let pressTimer, longPressed = false
kuku.addEventListener('pointerdown', () => {
  longPressed = false
  pressTimer = setTimeout(() => {
    longPressed = true
    buzz(60)
    egg('hold', 'Kuku has been picked up', 'put me DOWN. ...ok 2 more seconds.')
  }, 650)
})
const cancelPress = () => clearTimeout(pressTimer)
kuku.addEventListener('pointerup', cancelPress)
kuku.addEventListener('pointerleave', cancelPress)
kuku.addEventListener('contextmenu', (e) => e.preventDefault())
kuku.addEventListener('click', () => {
  if (longPressed) return
  state.pets++
  save()
  buzz(15)
  if (state.pets === 15) {
    setCalm(true)
    say('...ok fine. happy birthday 😾', 5000)
    burst(0.85, 0.85)
  } else if (state.pets > 15) {
    say(pick(['purr. tell no one.', 'ok you can stay', 'happy birthday (quietly)', '😾💗']))
  } else {
    say(`${pick(petLines)}  (${state.pets}/15)`, 1800)
  }
})

/* ---------------- eggs ---------------- */
const EGGS = {
  gst: 'Tapped the GST clock',
  ali12: "Picked Ali's 12",
  hamza: 'Guessed HAMZA in the Wordle',
  hold: 'Long-pressed Kuku',
  shake: 'Shook the phone',
  title: 'Poked the title five times',
  born: 'Opened it at 1:30pm, your birth time',
  turn: 'Turned the phone sideways',
  bench: 'Rested at the bench',
  psi: 'Read your own mind five times',
  idle: 'Went quiet for a minute',
  bro: 'Let your brother steal three pieces',
}
const HINTS = {
  gst: 'A clock that does not exist.',
  ali12: 'The wrong answer at the start.',
  hamza: 'Guess a name in the Wordle.',
  hold: "Don't just tap Kuku.",
  shake: 'Shake things up.',
  title: 'Poke the top-left corner.',
  born: 'Come back at the time you were born.',
  turn: 'Hold your phone the wrong way.',
  bench: 'Sit down somewhere.',
  psi: 'Keep reading your mind.',
  idle: 'Do nothing for a while.',
  bro: 'Let the brother win.',
}
const toast = $('#toast')
let toastTimer
function renderEggCount() { $('#eggCount').textContent = state.eggs.length }
renderEggCount()
function egg(id, title, line) {
  if (line) say(line, 4200)
  if (state.eggs.includes(id)) return
  state.eggs.push(id)
  save()
  renderEggCount()
  const hud = $('#hudEggs')
  hud.classList.remove('bump'); void hud.offsetWidth; hud.classList.add('bump')
  toast.innerHTML = `<b>Easter egg ${state.eggs.length}/12</b>${title}`
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
  confetti({ particleCount: n, spread: 80, origin: { x, y }, colors: COLORS, scalar: 0.9, disableForReducedMotion: true })
}
function bigCelebrate() {
  if (reduced) return
  const end = Date.now() + 1600
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS })
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

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
    1: 'five letters. you know this one.',
    2: "it's dark. like your humour.",
    3: 'weeb section. i allowed it.',
    4: 'make a wish. not a dumb one.',
    5: 'history lesson.',
    6: 'he wrote this himself. i checked.',
  }
  if (intros[n]) setTimeout(() => say(intros[n]), 700)
}
$$('[data-next]').forEach((b) => b.addEventListener('click', () => unlock(+b.dataset.next)))

/* ---------------- clocks + gate ---------------- */
const fmt = (tz) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
const fIE = fmt('Europe/Dublin'), fPK = fmt('Asia/Karachi')
const pkParts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: 'numeric', minute: 'numeric', hour12: false })
let gateOpened = false
function tick() {
  const now = new Date()
  $('#clkIE').textContent = fIE.format(now)
  $('#clkPK').textContent = fPK.format(now)
  const r = () => String(Math.floor(Math.random() * 99)).padStart(2, '0')
  $('#clkGSTt').textContent = `${r()}:${r()}`

  const open = ALI_MODE || now.getTime() >= BIRTHDAY
  if (!open) {
    $('#gateWait').hidden = false
    $('#gateOpen').hidden = true
    const s = Math.max(0, Math.floor((BIRTHDAY - now.getTime()) / 1000))
    const hh = String(Math.floor(s / 3600)).padStart(2, '0')
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    $('#countdown').textContent = `${hh}:${mm}:${ss}`
  } else if (!gateOpened) {
    gateOpened = true
    const wasWaiting = !$('#gateWait').hidden
    $('#gateWait').hidden = true
    $('#gateOpen').hidden = false
    if (wasWaiting) { bigCelebrate(); buzz([80, 60, 80]); say("it's 12. YOUR 12. happy birthday noob.", 5000) }
  }

  // birth time easter egg: 1:30pm PKT
  const [h, m] = pkParts.format(now).split(':').map(Number)
  if (h === 13 && m >= 30 && m < 60 && now.getTime() >= BIRTHDAY - 86400000) {
    egg('born', 'You were born right about now', '1:30pm. you were born now-ish. I remember things. sometimes.')
  }
}
tick()
setInterval(tick, 1000)

if (!ALI_MODE && Date.now() < BIRTHDAY) setTimeout(() => say('not yet, noob. come back at 12.'), 900)
else setTimeout(() => say(state.level > 0 ? 'oh. you came back.' : 'hi. i am kuku. i am angry. scroll.'), 900)

$('#clkGST').addEventListener('click', () => egg('gst', 'Found the GST clock', 'I DONT HAVE GST CLOCK'))
$('#pickAli').addEventListener('click', () => {
  document.body.classList.remove('screen-shake'); void document.body.offsetWidth
  document.body.classList.add('screen-shake')
  buzz(120)
  egg('ali12', "Picked Ali's 12", "that's 4 hours late. as usual 😭 try again.")
})
$('#pickYou').addEventListener('click', () => { burst(0.5, 0.7); unlock(1) })

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
  SAMIYA: 'six letters, birthday girl',
  KUKUS: 'there is only one kuku',
  HAPPY: 'not yet. keep going.',
  CAKES: 'later. focus.',
}
function press(k) {
  if (done) return
  if (k === 'BACK') { cur = cur.slice(0, -1); renderCurrent(); return }
  if (k === 'ENTER') {
    if (cur.length < 5) {
      const row = board.children[state.guesses.length]
      row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake')
      msg.textContent = 'five letters, noob'
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
  if (cur.length < 5) { cur += k; renderCurrent(); buzz(8) }
}
function afterGuess(g) {
  msg.textContent = ''
  if (g === 'HAMZA') egg('hamza', 'HAMZA in the Wordle', 'why is HE in your head. on your birthday.')
  else if (reactions[g]) say(reactions[g])
  if (g === ANSWER) return finishWordle(true)
  if (state.guesses.length >= 6) return finishWordle(false)
  const lines = ['hmm', 'no', 'close-ish', 'think about what Ali calls you', 'try again', 'noob']
  msg.textContent = state.guesses.length >= 3 ? 'hint: what does Ali call you?' : pick(lines)
}
const tries = () => state.guesses.indexOf(ANSWER) + 1
function finishWordle(won) {
  done = true
  if (won) {
    const n = tries()
    msg.textContent = n <= 2 ? `In ${n}. Wordle in 2, as promised.` : `DUMBO. Obviously. ${n}/6.`
    say(n <= 2 ? 'ok that was impressive. noob.' : 'it was always going to be DUMBO.')
    burst(0.5, 0.5)
  } else {
    msg.textContent = "It was DUMBO. It's always DUMBO."
    say('X/6. translation: he still thinks you are smart.')
  }
  $('#wordleAfter').hidden = false
}
$('#copyGrid').addEventListener('click', async () => {
  const em = { hit: '🟩', near: '🟨', miss: '⬛' }
  const grid = state.guesses.map((g) => score(g).map((s) => em[s]).join('')).join('\n')
  const n = state.guesses.includes(ANSWER) ? tries() : 'X'
  const text = `Samiya's birthday Wordle ${n}/6\n\n${grid}`
  try { await navigator.clipboard.writeText(text); say('copied. send it to him.') }
  catch { say("couldn't copy. screenshot it instead.") }
})
// restore
state.guesses.forEach((g, i) => paintRow(i, g, false))
if (state.guesses.includes(ANSWER) || state.guesses.length >= 6) finishWordle(state.guesses.includes(ANSWER))

/* ---------------- cave ---------------- */
const MEMORIES = [
  { when: 'Sep 2025', q: '"PLAY SILKSONG"', t: 'You, in all caps. So I played, and you watched. You still say I never do anything with you.' },
  { when: 'Every month since', q: '"when will you play hollow knight"', t: "And then last month: \"i miss hollow knight\". Same, honestly." },
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
  if (!lit.has(i)) { lit.add(i); b.classList.add('lit'); geoBurst(b); buzz(20) }
  if (lit.size === MEMORIES.length && $('#benchWrap').hidden) {
    $('#benchWrap').hidden = false
    say('a bench. sit. you look tired.')
  }
}
$('#restBench').addEventListener('click', () => {
  egg('bench', 'Rested at the bench', 'progress saved. unlike your sleep schedule.')
  unlock(3)
})

/* ---------------- anime ---------------- */
const THOUGHTS = [
  'i want chocolate', 'i miss hollow knight', 'i want to eat', 'wanna watch', 'PLAY SILKSONG',
  'aaaaaaa idk', 'should I eat', 'heuehueehue', 'I DONT HAVE GST CLOCK', 'hamza dont',
  'thankuthanku', 'ice cream?', 'meri birthday aj hai', 'istg', 'pagal aurat',
]
let psiCount = 0, lastThought = ''
$('#psiBtn').addEventListener('click', () => {
  let t
  do { t = pick(THOUGHTS) } while (t === lastThought)
  lastThought = t
  $('#thought').textContent = `"${t}"`
  psiCount++
  buzz(10)
  if (!reduced) gsap.fromTo('#psiBtn', { rotate: -10 }, { rotate: 0, duration: 0.4, ease: 'elastic.out(1,0.4)' })
  if (psiCount === 5) egg('psi', 'Read your own mind five times', 'psychic diagnosis: mostly food.')
})

let clocheUp = false
$('#liftCloche').addEventListener('click', () => {
  clocheUp = !clocheUp
  gsap.to('#cloche', { y: clocheUp ? -90 : 0, rotate: clocheUp ? -12 : 0, duration: reduced ? 0 : 0.6, ease: 'back.out(1.6)' })
  $('#liftCloche').textContent = clocheUp ? 'Cover it again' : 'Lift the cover'
  $('#butlerLine').textContent = clocheUp
    ? 'Cheesecake, my lady. If I couldn\'t manage this much, what kind of butler would I be?'
    : 'Yes, my lady.'
  if (clocheUp) { burst(0.5, 0.55, 40); buzz(20) }
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
  p.classList.add('gone'); eaten++; buzz(10)
  const left = $$('button:not(.gone)', choc)
  if (left.length && Math.random() < 0.45) {
    const s = pick(left)
    setTimeout(() => {
      s.classList.add('gone'); stolen++
      $('#broLine').textContent = pick(['brother stole one 😾', 'BROTHER.', 'he took another'])
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
function blowOne(c) {
  if (c.classList.contains('out')) return
  c.classList.add('out')
  if (!$$('.candle:not(.out)').length) candlesDone()
}
let micStream, micRaf
function candlesDone() {
  if (state.candlesOut && !$('#cakeAfter').hidden) return
  state.candlesOut = true; save()
  stopMic()
  $('#cakeMsg').textContent = 'Happy 22nd, Samiya.'
  say('wish made. i hope it was not dumb.')
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
    $('#cakeMsg').textContent = "No mic. Tap the candles to blow them out instead."
    return
  }
  $('#cakeMsg').textContent = 'Blow!'
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
        lit.sort(() => Math.random() - 0.5).slice(0, 2).forEach(blowOne)
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
  noob: 'you did better than me and I\'m coping',
  idiot: 'text me when you get home',
  pagal: "I laughed out loud and I'm not admitting it",
}
$$('.letter .w').forEach((w) => w.addEventListener('click', () => say(`"${w.textContent}" = ${WORDS[w.dataset.w]}`, 4000)))

$('#getLost').addEventListener('click', () => {
  document.body.classList.remove('screen-shake'); void document.body.offsetWidth
  document.body.classList.add('screen-shake')
  buzz([100, 50, 100])
  setTimeout(() => {
    $('#finale').hidden = false
    $('#getLost').parentElement.hidden = true
    renderFinale()
    bigCelebrate()
    catRain(18)
    $('#finale').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    setCalm(true)
    say("you didn't go. good.", 5000)
  }, 500)
})
function renderFinale() {
  const n = state.eggs.length
  $('#eggReport').textContent = n === 12
    ? 'All 12 easter eggs. Noob. (See translation guide.)'
    : `You found ${n} of 12 easter eggs. The rest are still hiding.`
  $('#eggList').innerHTML = Object.keys(EGGS).map((id) => {
    const found = state.eggs.includes(id)
    return `<li class="${found ? 'found' : ''}">${found ? EGGS[id] : `Hint: ${HINTS[id]}`}</li>`
  }).join('')
}
$('#replay').addEventListener('click', () => {
  const keepEggs = state.eggs
  state = { level: 0, eggs: keepEggs, pets: state.pets, guesses: [], candlesOut: false }
  save()
  location.href = location.pathname + (ALI_MODE ? '?ali' : '')
})

/* ---------------- global easter eggs ---------------- */
function catRain(n = 26) {
  if (reduced) return
  const rain = $('#rain')
  for (let i = 0; i < n; i++) {
    const img = document.createElement('img')
    img.src = Math.random() < 0.5 ? kukuAngry : kukuCalm
    img.style.left = `${Math.random() * 92}vw`
    img.style.width = `${40 + Math.random() * 50}px`
    rain.append(img)
    gsap.to(img, {
      y: innerHeight + 160, rotation: (Math.random() - 0.5) * 540,
      duration: 1.6 + Math.random() * 1.4, delay: Math.random() * 0.8, ease: 'power1.in',
      onComplete: () => img.remove(),
    })
  }
}

// shake
let lastShake = 0
window.addEventListener('devicemotion', (e) => {
  const a = e.accelerationIncludingGravity || e.acceleration
  if (!a) return
  const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2)
  if (mag > 28 && Date.now() - lastShake > 2500) {
    lastShake = Date.now()
    catRain()
    buzz(60)
    egg('shake', 'Shook the phone', 'it is raining kukus. happy now?')
  }
})

// title x5
let titleTaps = 0, titleTimer
$('#hudTitle').addEventListener('click', () => {
  titleTaps++
  clearTimeout(titleTimer)
  titleTimer = setTimeout(() => (titleTaps = 0), 1500)
  if (titleTaps >= 5) { titleTaps = 0; egg('title', 'Poked the title five times', "stop poking things. you're 22.") }
})

// landscape
const land = matchMedia('(orientation: landscape) and (max-height: 500px)')
const onLand = () => { if (land.matches) egg('turn', 'Turned the phone sideways', 'phone seedha karo.') }
land.addEventListener?.('change', onLand)
onLand()

// idle
let idleTimer
const resetIdle = () => {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => egg('idle', 'Went quiet for a minute', 'khana khalo.'), 60000)
}
;['pointerdown', 'keydown', 'scroll'].forEach((ev) => addEventListener(ev, resetIdle, { passive: true }))
resetIdle()

/* ---------------- boot ---------------- */
showUpTo(state.level)
if (params.has('all')) { state.level = 6; showUpTo(6) }
