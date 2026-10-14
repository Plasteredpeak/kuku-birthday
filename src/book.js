// The sticker book: every sticker she sees and every Kuku line she hears gets collected here.

export const STICKERS = [
  // Kuku's moods
  { id: 'angry', page: 'kuku', name: 'Kuku', note: 'The original. Angry about everything, mostly you.', hint: 'Free with every birthday.' },
  { id: 'eyes', page: 'kuku', name: 'Sparkle Kuku', note: 'Watching. Always watching.', hint: 'Do something interesting.' },
  { id: 'yay', page: 'kuku', name: 'YAYYY Kuku', note: 'Pure joy. Rare. Like Ali being on time.', hint: 'Win something.' },
  { id: 'cry', page: 'kuku', name: 'Crying Kuku', note: 'Wet. Dramatic. Kuku when you pick the wrong 12.', hint: 'Disappoint her.' },
  { id: 'sleep', page: 'kuku', name: 'Sleepy Kuku', note: 'Guarding your surprise. Also drooling.', hint: 'Make her wait.' },
  { id: 'flower', page: 'kuku', name: 'Flower Kuku', note: "Brought you a flower. Picked it from someone else's garden.", hint: 'Look back on history.' },
  { id: 'music', page: 'kuku', name: 'DJ Kuku', note: 'Headphones on. Ignoring you rhythmically.', hint: 'Mess with the sound.' },
  { id: 'buff', page: 'kuku', name: 'Gym Kuku', note: 'Goes to the gym. Unlike some people (Ali).', hint: 'Pick her up. Or lift.' },
  { id: 'calm', page: 'kuku', name: 'Calm Kuku', note: 'Only exists after 15 pets. Do not tell anyone she has feelings.', hint: 'Pet her. A lot. After 12.' },
  { id: 'heart', page: 'kuku', name: 'Soft Kuku', note: 'Holding a heart. Will deny it.', hint: 'Earn her love.' },
  { id: 'finger', page: 'kuku', name: 'Rude Kuku', note: 'Exactly what it looks like.', hint: 'Tell her to get lost.' },
  { id: 'wrapped', page: 'kuku', name: 'Wrapped Kuku', note: 'Got 6/6 on Wrapped. Suspicious. Did you read the chat export?', hint: 'Know him perfectly. 6 out of 6.' },
  // guest stars
  { id: 'batman', page: 'guests', name: 'Batman (Ali)', note: "I'm Batman. He's not.", hint: 'Ali hides in two places.' },
  { id: 'gojo', page: 'guests', name: 'Gojo', note: 'Throughout heaven and earth, he alone is the pretty one. Kuku disagrees.', hint: 'Blindfolded. Anime corner.' },
  { id: 'samiya-angry', page: 'guests', name: 'Samiya, angry', note: "You, every time he's late. A self-portrait.", hint: 'Pick the wrong 12.' },
  { id: 'sign-short', page: 'guests', name: 'Sign cat: ur short', note: 'Factual.', hint: 'Catch a rude cat.' },
  { id: 'sign-gay', page: 'guests', name: 'Sign cat: UR GAY.', note: 'Kuku did not write this.', hint: 'Catch the other rude cat.' },
]

// lines are matched exactly against what Kuku says
export const QUOTES = [
  { id: 'q-hi', text: "hi. i'm Kuku.", hint: 'The very first thing.' },
  { id: 'q-me', text: 'Kuku is ME. the angry cat. not you.', hint: 'Introductions.' },
  { id: 'q-hasty', text: "don't get hasty. wait.", hint: 'Poke her before 12.' },
  { id: 'q-hour', text: "you've been asking him for an hour. he told me.", hint: 'Keep poking her before 12.' },
  { id: 'q-sleep', text: "ok. i'm going to sleep. wake me at 12. (don't.)", hint: 'Poke her until she gives up.' },
  { id: 'q-wake', text: "it's not time yet. don't wake me up.", hint: 'Wake her up. Early.' },
  { id: 'q-press', text: 'PRESS IT.', match: (t) => t.includes('PRESS IT.'), hint: 'Be there at 00:00.' },
  { id: 'q-noob', text: "happy birthday noob. it's 12. YOUR 12.", hint: 'Open the surprise.' },
  { id: 'q-gst', text: 'I DONT HAVE GST CLOCK', hint: 'A clock that does not exist.' },
  { id: 'q-late', text: "that's 4 hours late. as usual 😭 try again.", hint: 'The wrong 12.' },
  { id: 'q-cape', text: "it's just ali in a cape. ignore him.", hint: 'Find Batman.' },
  { id: 'q-hamza', text: 'why is HE in your head. on your birthday.', hint: 'A certain name in the Wordle.' },
  { id: 'q-embarrassed', text: 'kuku is embarrassed to be seen with you.', hint: 'Fail the Wordle.' },
  { id: 'q-impressive', text: 'ok that was impressive. noob.', hint: 'Wordle in 2.' },
  { id: 'q-bench', text: 'progress saved. unlike your sleep schedule.', hint: 'Sit down in the cave.' },
  { id: 'q-psychic', text: 'psychic diagnosis: mostly food.', hint: 'Read your mind. A lot.' },
  { id: 'q-gojo', text: "he's cute. i'm cuter. don't answer that.", hint: 'Find him.' },
  { id: 'q-sister', text: 'you let him win. very big sister of you.', hint: 'The chocolate bar.' },
  { id: 'q-bicep', text: 'bicep showcase easy.', hint: '22 reps.' },
  { id: 'q-meetha', text: 'everyday you crave meetha. it is ok. it is your birthday.', hint: 'Give in.' },
  { id: 'q-shook', text: 'resisted. ali is shook.', hint: "Don't give in." },
  { id: 'q-hand', text: 'by HAND. all 22. dedication.', hint: 'No mic needed.' },
  { id: 'q-wish', text: 'wish made. i hope it was not dumb.', hint: 'Candles.' },
  { id: 'q-gym', text: 'put me DOWN. i go to the gym. look at these.', hint: 'Pick her up.' },
  { id: 'q-rude', text: 'rude. accurate though.', hint: 'Catch the short one.' },
  { id: 'q-language', text: 'KUKU. language. (that was not kuku)', hint: 'Catch the rudest one.' },
  { id: 'q-rain', text: 'it is raining kukus. happy now?', hint: 'Shake.' },
  { id: 'q-poke', text: "stop poking things. you're 22.", hint: 'The top-left corner.' },
  { id: 'q-fine', text: '...ok fine. happy birthday 😾', hint: '15 pets. After 12.' },
  { id: 'q-khana', text: 'zzz... khana khalo... zzz', hint: 'Do nothing.' },
  { id: 'q-born', text: '1:30pm. you were born now-ish. I remember things. sometimes.', hint: 'Come back at the right time.' },
  { id: 'q-back', text: "...i came back. you didn't go either. good.", hint: 'Get lost.' },
  { id: 'q-idk', text: 'Trick question. 26 each. The one thing you two agree on is not knowing.', hint: 'Wrapped. A question with no wrong answer.' },
  { id: 'q-perfect', text: 'suspicious. did you read the chat export', hint: 'Wrapped. Get everything right.' },
  { id: 'q-sob', text: 'this is your fault.', hint: 'Wrapped. Hold the crying.' },
  { id: 'q-flush', text: "he's in there right now probably.", hint: 'Wrapped. Twelve is the magic number.' },
]

export const TOTAL = STICKERS.length + QUOTES.length

const PAGES = [
  { id: 'kuku', title: 'Kuku', sub: 'Every Kuku mood. Collect them by making her feel things.' },
  { id: 'guests', title: 'Guest stars', sub: 'Uninvited, mostly.' },
  { id: 'quotes', title: 'Things Kuku said', sub: 'Hear a line once and it sticks here forever.' },
  { id: 'eggs', title: 'Easter eggs', sub: '' },
  { id: 'last', title: 'Last page', sub: '' },
]

export function createBook({ CAT, state, save, sfx, gsap, reduced, eggs, onComplete }) {
  state.stickers ||= []
  state.quotes ||= []
  state.bookSeen ||= 0
  const $ = (s, el = document) => el.querySelector(s)
  const book = $('#book'), pageEl = $('#bookPage'), btn = $('#bookBtn'), chip = $('#bookChip')
  let page = 0, open = false, chipTimer

  const count = () => state.stickers.length + state.quotes.length
  const complete = () => count() >= TOTAL

  function badge() {
    const fresh = count() - state.bookSeen
    btn.dataset.new = fresh > 0 ? String(Math.min(fresh, 99)) : ''
  }
  function toastChip(text) {
    chip.textContent = text
    chip.hidden = false
    if (!reduced) gsap.fromTo(chip, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 })
    clearTimeout(chipTimer)
    chipTimer = setTimeout(() => gsap.to(chip, { opacity: 0, duration: 0.3, onComplete: () => (chip.hidden = true) }), 2600)
    if (!reduced) gsap.fromTo(btn, { rotate: -14, scale: 1.2 }, { rotate: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.4)' })
  }
  function gained() {
    save(); badge()
    sfx.shimmer?.()
    if (open) render()
    if (complete() && !state.bookDone) { state.bookDone = true; save(); onComplete?.() }
  }
  function seen(id) {
    if (!STICKERS.some((s) => s.id === id) || state.stickers.includes(id)) return
    state.stickers.push(id)
    toastChip(`+ sticker: ${STICKERS.find((s) => s.id === id).name}`)
    gained()
  }
  function heard(text) {
    const q = QUOTES.find((q) => (q.match ? q.match(text) : q.text === text))
    if (!q || state.quotes.includes(q.id)) return
    state.quotes.push(q.id)
    toastChip('+ quote for the book')
    gained()
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  function stickerGrid(pid) {
    return `<div class="sb-grid">${STICKERS.filter((s) => s.page === pid).map((s, i) => {
      const got = state.stickers.includes(s.id)
      const tilt = ((i * 37) % 11) - 5
      return `<button class="sb-slot ${got ? 'got' : ''}" type="button" data-sticker="${s.id}" style="--tilt:${tilt}deg">
        <img src="${CAT[s.id]}" alt="${got ? esc(s.name) : 'Undiscovered sticker'}" />
        <span class="sb-name">${got ? esc(s.name) : '???'}</span>
      </button>`
    }).join('')}</div>`
  }
  function quotesList() {
    return `<ul class="sb-quotes">${QUOTES.map((q) => {
      const got = state.quotes.includes(q.id)
      if (got) return `<li class="got"><span class="sb-bubble">${esc(q.text)}</span></li>`
      const bars = q.text.split(' ').map((w) => `<i style="width:${Math.min(w.length, 9) * 0.55}em"></i>`).join('')
      return `<li><span class="sb-bubble sb-redacted" aria-label="Undiscovered line">${bars}</span><small>${esc(q.hint)}</small></li>`
    }).join('')}</ul>`
  }
  function eggList() {
    return `<ul class="sb-eggs">${Object.entries(eggs.EGGS).map(([id, label]) => {
      const got = state.eggs.includes(id)
      return `<li class="${got ? 'got' : ''}">${got ? esc(label) : `??? <small>${esc(eggs.HINTS[id])}</small>`}</li>`
    }).join('')}</ul>`
  }
  function lastPage() {
    if (!complete()) {
      return `<div class="sb-locked"><div class="sb-lock" aria-hidden="true"></div>
        <p>This page is stuck shut.</p><p class="sb-small">Collect every sticker and every line to open it. ${count()} of ${TOTAL} so far.</p></div>`
    }
    return `<div class="sb-last">
      <img src="${CAT.heart}" alt="" />
      <p class="sb-last-big">You collected everything.</p>
      <p>Every sticker, every line, every grumpy thing Kuku said. That's a lot of tapping on a cat for one birthday.</p>
      <p>Noob. (See the translation guide, line one.)</p>
      <p class="sb-sign">– Ali</p>
    </div>`
  }

  function render(dir = 0) {
    const p = PAGES[page]
    $('#bookTitle').textContent = p.id === 'last' && !complete() ? 'Last page' : p.title
    $('#bookSub').textContent = p.id === 'eggs' ? `The ${Object.keys(eggs.EGGS).length} hidden things.` : p.sub
    $('#bookCount').textContent = `${count()} of ${TOTAL} collected`
    $('#bookBar').style.width = `${(count() / TOTAL) * 100}%`
    $('#bookPageNo').textContent = `${page + 1} / ${PAGES.length}`
    book.querySelectorAll('.sb-tab').forEach((t, i) => t.classList.toggle('on', i === page))
    pageEl.innerHTML =
      p.id === 'kuku' || p.id === 'guests' ? stickerGrid(p.id)
        : p.id === 'quotes' ? quotesList()
        : p.id === 'eggs' ? eggList()
        : lastPage()
    pageEl.scrollTop = 0
    if (dir && !reduced) gsap.fromTo(pageEl, { rotateY: dir * 70, opacity: 0, transformOrigin: dir > 0 ? '0% 50%' : '100% 50%' }, { rotateY: 0, opacity: 1, duration: 0.45, ease: 'power2.out' })
  }
  function go(n) {
    const next = (n + PAGES.length) % PAGES.length
    if (next === page) return
    const dir = n > page ? 1 : -1
    page = next
    sfx.whoosh?.()
    render(dir)
  }
  function show() {
    open = true
    state.bookSeen = count(); save(); badge()
    book.hidden = false
    render()
    sfx.pop?.()
    if (!reduced) gsap.fromTo('.book-paper', { y: 60, rotate: -3, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' })
  }
  function hide() {
    open = false
    const done = () => (book.hidden = true)
    if (reduced) return done()
    gsap.to('.book-paper', { y: 60, opacity: 0, duration: 0.25, onComplete: done })
  }

  // detail view
  pageEl.addEventListener('click', (e) => {
    const slot = e.target.closest('.sb-slot')
    if (!slot) return
    const s = STICKERS.find((x) => x.id === slot.dataset.sticker)
    if (!state.stickers.includes(s.id)) {
      if (!reduced) gsap.fromTo(slot, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.2)' })
      const n = slot.querySelector('.sb-name')
      n.textContent = s.hint
      setTimeout(() => (n.textContent = '???'), 2600)
      return
    }
    const d = $('#bookDetail')
    d.innerHTML = `<img src="${CAT[s.id]}" alt="" /><p class="sb-d-name">${esc(s.name)}</p><p>${esc(s.note)}</p><p class="sb-small">tap to close</p>`
    d.hidden = false
    sfx.meow?.(true)
    if (!reduced) gsap.fromTo(d.querySelector('img'), { scale: 0.5, rotate: -15 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' })
  })
  $('#bookDetail').addEventListener('click', () => ($('#bookDetail').hidden = true))
  btn.addEventListener('click', () => (open ? hide() : show()))
  $('#bookClose').addEventListener('click', hide)
  $('#bookPrev').addEventListener('click', () => go(page - 1))
  $('#bookNext').addEventListener('click', () => go(page + 1))
  book.querySelectorAll('.sb-tab').forEach((t, i) => t.addEventListener('click', () => go(i)))
  book.addEventListener('click', (e) => { if (e.target === book) hide() })
  // swipe to turn pages
  let sx = null, sy = null
  pageEl.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }, { passive: true })
  pageEl.addEventListener('touchend', (e) => {
    if (sx == null) return
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(page + (dx < 0 ? 1 : -1))
    sx = null
  })
  badge()
  return { seen, heard, show, hide, count, complete, render }
}
