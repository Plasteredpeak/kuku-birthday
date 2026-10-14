// "Samiya × Ali: Wrapped" — a guess-the-stat quiz built from the real chat export (16 Jun 2024 → 14 Oct 2026).

const CARDS = [
  { type: 'intro', accent: '#ffcf6b' },
  { type: 'stat', accent: '#ff8fb6', value: 7465, label: 'messages',
    text: "That's about 9 a day, for 2 years and 4 months." },
  { type: 'q', accent: '#2de2b0', key: 'texts',
    q: "You've sent 3,943 and 3,522 messages. Which one is you?",
    options: [{ label: 'I sent more', value: 3943, who: 'You' }, { label: 'Ali sent more', value: 3522, who: 'Ali' }],
    answer: 0,
    right: 'Correct. You talk more. It\'s now a scientific fact.',
    wrong: 'Wrong. You talk more. 421 more. Kuku has receipts.',
    extra: 'You also texted first on 127 of the 196 days we talked.' },
  { type: 'q', accent: '#9b6bff', key: 'voice',
    q: 'One of you sent 144 voice notes. The other sent 8. Who\'s who?',
    options: [{ label: '144 is me', value: 144, who: 'You' }, { label: '144 is Ali', value: 8, who: 'Ali' }],
    answer: 0,
    right: 'Yes. He reads. You perform.',
    wrong: 'Ali has sent 8 voice notes in two years. EIGHT.',
    extra: 'You: 144. Ali: 8.' },
  { type: 'q', accent: '#ffd23f', key: 'emoji', big: true,
    q: 'Your most used emojis are 😭 and 😂. Which one is yours?',
    options: [{ label: '😭', value: 122, who: 'You' }, { label: '😂', value: 27, who: 'Ali' }],
    answer: 0,
    right: '122 times. Respect.',
    wrong: 'No. You\'ve used 😭 122 times. He uses 😂 like a normal person.',
    extra: 'You: 😭 × 122. Ali: 😂 × 27.' },
  { type: 'q', accent: '#ff5d6c', key: 'insults',
    q: 'Insults traded. One of you has thrown about 60, the other about 35. Who\'s winning?',
    options: [{ label: 'Me, obviously', value: 35, who: 'You', approx: true }, { label: 'Ali', value: 60, who: 'Ali', approx: true }],
    answer: 1,
    right: 'Ali wins. Which means Ali loses. Check the translation guide later.',
    wrong: "You're good, but he's worse. ~60 to ~35.",
    breakdown: {
      Ali: 'noob 13 · dumbass 12 · stupid 8 · idiot 5 · pagal 4 · nerd 4 · skill issue 4 · dum dum 2 · Dumbo 1',
      You: '🤡 7 · useless 4 · loser 3 · stupid 2 · ugly 2 · +13 words Kuku refuses to print',
    },
    extra: "He's only called you Dumbo once. Last birthday. Now it's the Wordle answer. Promoted." },
  { type: 'q', accent: '#5b8cff', key: 'idk', trick: true,
    q: "Who says 'idk' more?",
    options: [{ label: 'Me', value: 26, who: 'You' }, { label: 'Ali', value: 26, who: 'Ali' }],
    answer: -1,
    right: 'Trick question. 26 each. The one thing you two agree on is not knowing.',
    wrong: 'Trick question. 26 each. The one thing you two agree on is not knowing.',
    extra: '26 = 26.' },
  { type: 'q', accent: '#3fd0e0', key: 'toilet', toilet: true,
    q: 'How many times has Ali announced in chat that he\'s in the toilet?',
    options: [{ label: '3' }, { label: '7' }, { label: '12' }],
    answer: 2,
    right: '12. You know him too well.',
    wrong: '12. TWELVE. The man lives there.',
    quotes: ['"I go toilet now" (twice)', '"I\'m in toilet rn"', '"Toilet mein hun 😛"', '13 Oct: "I\'m in toilet now"'],
    reply: 'You, Nov 2025: "who sits in toilet after work"' },
  { type: 'score', accent: '#ffcf6b' },
]
export const QUESTION_KEYS = CARDS.filter((c) => c.type === 'q').map((c) => c.key)
export const WRAPPED_LINES = {
  idk: 'Trick question. 26 each. The one thing you two agree on is not knowing.',
  perfect: 'suspicious. did you read the chat export',
  sob: 'this is your fault.',
  flush: "he's in there right now probably.",
}

const fmt = (n) => n.toLocaleString('en-US')

export function createWrapped({ gsap, state, save, sfx, buzz, say, mood, egg, reduced, book, unlock, burst, playTheme }) {
  const $ = (s, el = document) => el.querySelector(s)
  state.wrapped ||= { card: 0, answers: {} }
  const W = state.wrapped
  const root = $('#wrappedCard'), bars = $('#wrappedBars')
  bars.innerHTML = CARDS.map(() => '<i><b></b></i>').join('')

  const isRight = (c, pick) => c.trick || pick === c.answer
  const score = () => CARDS.filter((c) => c.type === 'q' && W.answers[c.key] != null && isRight(c, W.answers[c.key])).length
  const total = QUESTION_KEYS.length

  // tap a bar to jump back to any card she's already seen (so eggs are never missable)
  bars.addEventListener('click', (e) => {
    const i = [...bars.children].indexOf(e.target.closest('i'))
    if (i >= 0 && i <= (W.max || 0) && i !== W.card) go(i)
  })
  function renderBars() {
    W.max = Math.max(W.max || 0, W.card)
    ;[...bars.children].forEach((b, i) => {
      b.classList.toggle('done', i < W.card)
      b.classList.toggle('on', i === W.card)
      b.classList.toggle('seen', i <= W.max)
    })
  }
  function countUp(el, to, { approx = false, dur = 1.1 } = {}) {
    const o = { v: 0 }
    const pre = approx ? '~' : ''
    if (reduced) { el.textContent = pre + fmt(to); return }
    gsap.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => (el.textContent = pre + fmt(Math.round(o.v))) })
  }

  function cardHTML(c, i) {
    const n = `<p class="wr-kicker">Wrapped · ${i} of ${CARDS.length - 1}</p>`
    if (c.type === 'intro') {
      return `<p class="wr-kicker">Samiya × Ali</p>
        <h3 class="wr-title">Wrapped</h3>
        <p class="wr-text">Two years of chat. Kuku counted everything. Kuku is tired.</p>
        <p class="wr-text wr-strong">Guess right or be judged.</p>
        <p class="wr-text wr-hint">Tip: tap the bars at the top to go back to any card.</p>
        <button class="btn btn-main wr-next" type="button">Start</button>`
    }
    if (c.type === 'stat') {
      return `${n}<p class="wr-big" data-count="${c.value}">0</p><p class="wr-label">${c.label}</p>
        <p class="wr-text">${c.text}</p>
        <button class="btn btn-main wr-next" type="button">Next</button>`
    }
    if (c.type === 'q') {
      const opts = c.options.map((o, k) => `<button class="wr-opt ${c.big ? 'wr-opt-big' : ''}" type="button" data-k="${k}">
          <span class="wr-opt-label">${o.label}</span>
          ${o.value != null ? `<span class="wr-opt-reveal"><span class="wr-who">${o.who}</span><b class="wr-num">0</b><span class="wr-bar"><span></span></span></span>` : ''}
          <span class="wr-mark" aria-hidden="true"></span>
        </button>`).join('')
      return `${n}<p class="wr-q">${c.q}</p>
        <div class="wr-opts ${c.options.length === 3 ? 'wr-three' : ''}">${opts}</div>
        <div class="wr-after" hidden>
          <p class="wr-react"></p>
          ${c.breakdown ? `<div class="wr-break"><p><b>Ali</b> ${c.breakdown.Ali}</p><p><b>You</b> ${c.breakdown.You}</p></div>` : ''}
          ${c.quotes ? `<ul class="wr-quotes">${c.quotes.map((q) => `<li>${q}</li>`).join('')}</ul><p class="wr-reply">${c.reply}</p>` : ''}
          <p class="wr-extra">${c.extra || ''}</p>
          <button class="btn btn-main wr-next" type="button">Next</button>
        </div>
        ${c.toilet ? '<button class="wr-toilet" type="button" aria-label="A toilet">🚽</button><div class="wr-wave" aria-hidden="true"></div>' : ''}`
    }
    // score
    const s = score()
    const line = s === total ? WRAPPED_LINES.perfect : s >= 4 ? 'not bad. for a noob.' : 'two years and you know nothing. idk, 26 times.'
    return `<p class="wr-kicker">Your Wrapped</p>
      <p class="wr-big wr-score"><span data-count="${s}">0</span><small>/${total}</small></p>
      <p class="wr-text wr-strong">"${line}" – Kuku</p>
      <ul class="wr-summary">
        <li><b>7,465</b> messages</li>
        <li><b>3,943</b> you vs <b>3,522</b> Ali</li>
        <li><b>144</b> vs <b>8</b> voice notes</li>
        <li>😭 <b>122</b></li>
        <li><b>~60</b> vs <b>~35</b> insults</li>
        <li>idk <b>26 = 26</b></li>
        <li>🚽 <b>12</b></li>
      </ul>
      <div class="wr-actions">
        <button class="btn btn-ghost" id="wrCopy" type="button">Copy my Wrapped</button>
        <button class="btn btn-ghost" id="wrAgain" type="button">${s < total ? 'Play again' : 'Play again (for fun)'}</button>
        <button class="btn btn-main" id="wrLetter" type="button">Open the letter</button>
      </div>`
  }

  // reveal a question card (animate = first time, otherwise instant restore)
  function reveal(c, pick, animate) {
    const ok = isRight(c, pick)
    const max = Math.max(...c.options.map((o) => o.value || 0)) || 1
    root.querySelectorAll('.wr-opt').forEach((btn, k) => {
      btn.setAttribute('aria-disabled', 'true')
      btn.classList.add('revealed')
      if (k === pick) btn.classList.add('picked', ok ? 'right' : 'wrong')
      if (c.answer === k || c.trick) btn.classList.add('answer')
      const o = c.options[k]
      if (o.value != null) {
        const num = btn.querySelector('.wr-num'), bar = btn.querySelector('.wr-bar span')
        if (animate) {
          countUp(num, o.value, { approx: o.approx, dur: c.trick ? 1.6 : 1.1 })
          if (!reduced) gsap.fromTo(bar, { width: '0%' }, { width: `${(o.value / max) * 100}%`, duration: c.trick ? 1.6 : 1.1, ease: 'power2.out' })
          else bar.style.width = `${(o.value / max) * 100}%`
        } else {
          num.textContent = (o.approx ? '~' : '') + fmt(o.value)
          bar.style.width = `${(o.value / max) * 100}%`
        }
      }
      btn.querySelector('.wr-mark').textContent = k === pick ? (ok ? '✓' : '✗') : ''
    })
    const after = root.querySelector('.wr-after')
    after.hidden = false
    after.querySelector('.wr-react').textContent = ok ? c.right : c.wrong
    if (animate) {
      if (!reduced) gsap.fromTo(after, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.5 })
      buzz(ok ? [30, 40, 30] : [120])
      if (ok) sfx.win(); else sfx.lose()
      mood(c.trick ? 'eyes' : ok ? 'yay' : 'cry', 2500)
      // the full line is on the card; Kuku just adds a short aside so the Next button stays clear
      book?.heard(ok ? c.right : c.wrong)
      const pick = (a) => a[Math.floor(Math.random() * a.length)]
      say(c.trick ? 'trick question. hehe.' : ok ? pick(['correct. smartie.', 'ok. you win this one.', 'kuku is mildly impressed.']) : pick(['wrong. 😾', 'noob.', 'two years. TWO.', 'kuku is disappointed.']), 3500)
    }
  }

  function wireCard(c, animate) {
    // on an already-answered card the Next button skips ahead to where she was
    root.querySelectorAll('.wr-next').forEach((b) => b.addEventListener('click', () => go(W.card + 1)))
    if (c.type === 'stat') root.querySelectorAll('[data-count]').forEach((el) => countUp(el, +el.dataset.count, { dur: animate ? 1.6 : 0.01 }))
    if (c.type === 'q') {
      root.querySelectorAll('.wr-opt').forEach((btn) => btn.addEventListener('click', () => {
        if (W.answers[c.key] != null) return
        W.answers[c.key] = +btn.dataset.k
        save()
        reveal(c, +btn.dataset.k, true)
      }))
      if (W.answers[c.key] != null) reveal(c, W.answers[c.key], false)
      if (c.key === 'emoji') wireSob()
      if (c.toilet) wireToilet()
    }
    if (c.type === 'score') {
      const s = score()
      root.querySelectorAll('[data-count]').forEach((el) => countUp(el, +el.dataset.count, { dur: animate ? 1.2 : 0.01 }))
      if (animate) {
        setTimeout(() => {
          if (s === total) { mood('yay', 4000); burst(0.5, 0.5); sfx.win(); book?.heard(WRAPPED_LINES.perfect); say('SIX. OUT OF SIX.', 4000); book?.seen('wrapped') }
          else if (s >= 4) { mood('yay', 3000); say('not bad.', 3500) }
          else { mood('cry', 3000); say('kuku is ashamed.', 3500) }
        }, 900)
      } else if (s === total) book?.seen('wrapped')
      W.done = true; save()
      $('#wrCopy').addEventListener('click', async () => {
        const text = `Samiya × Ali: Wrapped — ${s}/${total}\n7,465 messages · I sent 3,943 (Ali 3,522)\n144 voice notes vs his 8 · 😭 × 122\nidk 26 = 26 · Ali in the toilet: 12 times 🚽`
        try { await navigator.clipboard.writeText(text); say('copied. send it to him.') } catch { say("couldn't copy. screenshot it instead.") }
      })
      $('#wrAgain')?.addEventListener('click', () => { W.answers = {}; W.done = false; W.max = 0; save(); say('again. focus this time.'); go(1) })
      $('#wrLetter').addEventListener('click', () => unlock(8))
    }
  }

  // easter egg: hold the 😭 to make it rain 😭
  function wireSob() {
    const btn = root.querySelector('.wr-opt[data-k="0"]')
    let t
    const start = () => {
      if (W.answers.emoji == null) return
      t = setTimeout(() => { sobRain(); egg('sob', 'Made it rain 😭', WRAPPED_LINES.sob) }, 600)
    }
    const stop = () => clearTimeout(t)
    btn.addEventListener('pointerdown', start)
    btn.addEventListener('pointerup', stop)
    btn.addEventListener('pointerleave', stop)
    btn.addEventListener('contextmenu', (e) => e.preventDefault())
  }
  function sobRain() {
    buzz([30, 30, 30, 30, 60])
    sfx.lose()
    if (reduced) return
    const rain = $('#rain')
    for (let i = 0; i < 34; i++) {
      const s = document.createElement('span')
      s.className = 'sob-drop'
      s.textContent = '😭'
      s.style.left = `${Math.random() * 92}vw`
      s.style.fontSize = `${24 + Math.random() * 30}px`
      rain.append(s)
      gsap.to(s, { y: innerHeight + 120, rotation: (Math.random() - 0.5) * 360, duration: 1.4 + Math.random() * 1.2, delay: Math.random() * 0.9, ease: 'power1.in', onComplete: () => s.remove() })
    }
  }
  // easter egg: tap the toilet 12 times to flush
  function wireToilet() {
    const t = root.querySelector('.wr-toilet'), wave = root.querySelector('.wr-wave')
    let n = 0
    t.addEventListener('click', () => {
      n++
      buzz(10)
      sfx.tap()
      if (!reduced) gsap.fromTo(t, { scale: 0.85 }, { scale: 1, duration: 0.25 })
      if (n === 12) {
        sfx.whoosh(); setTimeout(() => sfx.whoosh(), 250)
        buzz([60, 40, 160])
        if (!reduced) {
          gsap.timeline()
            .to(t, { rotation: 720, scale: 0, duration: 1.1, ease: 'power2.in' })
            .set(t, { rotation: 0 })
            .to(t, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, '+=0.6')
          gsap.fromTo(wave, { xPercent: -110, opacity: 0.85 }, { xPercent: 110, opacity: 0.85, duration: 1.2, ease: 'power1.inOut', onComplete: () => gsap.set(wave, { opacity: 0 }) })
        }
        egg('flush', 'Flushed 12 times', WRAPPED_LINES.flush)
        n = 0
      }
    })
  }

  function render(animate) {
    const c = CARDS[W.card]
    root.style.setProperty('--wr-accent', c.accent)
    root.dataset.type = c.type
    root.innerHTML = cardHTML(c, W.card)
    renderBars()
    wireCard(c, animate)
  }
  function go(n) {
    n = Math.max(0, Math.min(CARDS.length - 1, n))
    W.card = n; save()
    sfx.whoosh()
    if (reduced) return render(true)
    gsap.to(root, { x: -40, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
      render(true)
      gsap.fromTo(root, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
      $('#lv-wrapped').scrollIntoView({ behavior: 'smooth', block: 'start' })
    } })
  }
  render(false)
  return { score: () => score(), total, done: () => !!W.done }
}
