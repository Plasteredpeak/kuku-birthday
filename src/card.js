// Draws a Spotify-Wrapped-style share card from her actual run, as a PNG she can send to Hamza.

const W = 1080, H = 1350

function loadImg(src) {
  return new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src })
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(' '); let line = '', yy = y
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh } else line = t
  }
  ctx.fillText(line, x, yy)
  return yy
}

// pick a verdict + sticker + colour from how much she found
export function verdictFor(s) {
  const pct = (s.eggs / s.eggTotal + s.book / s.bookTotal) / 2
  if (pct >= 0.98) return { line: 'certified Kuku whisperer', sub: 'found literally everything. suspicious.', cat: 'heart', a: '#ff8fb6', b: '#5b2a6e' }
  if (pct >= 0.65) return { line: 'suspiciously thorough', sub: 'poked almost everything. kuku is impressed (quietly).', cat: 'yay', a: '#ffcf6b', b: '#3a2a6e' }
  if (pct >= 0.35) return { line: 'poked a few things', sub: 'decent. kuku has seen worse. not much worse.', cat: 'eyes', a: '#2de2b0', b: '#12395a' }
  return { line: 'barely touched Kuku', sub: 'there is SO much you missed. go back. now.', cat: 'cry', a: '#5b8cff', b: '#1a2246' }
}

export async function drawCard(s, CAT) {
  await (document.fonts?.load?.('700 60px Gaegu') || Promise.resolve())
  await (document.fonts?.load?.('700 30px "Atkinson Hyperlegible"') || Promise.resolve())
  const v = verdictFor(s)
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')
  const hand = (px) => `700 ${px}px Gaegu, "Comic Sans MS", cursive`
  const body = (px, w = 400) => `${w} ${px}px "Atkinson Hyperlegible", system-ui, sans-serif`

  // background
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, v.b); g.addColorStop(1, '#10162e')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  const rg = ctx.createRadialGradient(W * 0.85, 120, 0, W * 0.85, 120, 700)
  rg.addColorStop(0, v.a + '66'); rg.addColorStop(1, v.a + '00')
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H)
  // confetti dots
  for (let i = 0; i < 34; i++) {
    ctx.fillStyle = ['#ffcf6b', '#ff8fb6', '#eef1ff', '#2de2b0'][i % 4] + '44'
    const x = (i * 197) % W, y = (i * 131) % H
    ctx.save(); ctx.translate(x, y); ctx.rotate(i); ctx.fillRect(-6, -3, 12, 6); ctx.restore()
  }

  // header
  ctx.fillStyle = '#eef1ff'
  ctx.font = body(30, 700); ctx.fillText("Samiya's 22nd", 70, 100)
  ctx.fillStyle = v.a; ctx.font = hand(96); ctx.fillText('Kuku Wrapped', 64, 190)

  // sticker
  const img = await loadImg(CAT[v.cat])
  if (img) {
    const sw = 360, sh = sw * img.naturalHeight / img.naturalWidth
    ctx.save(); ctx.translate(W - 70 - sw / 2, 300); ctx.rotate(0.12)
    ctx.shadowColor = '#0009'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12
    ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh); ctx.restore()
  }

  // verdict
  ctx.fillStyle = '#a9b0d6'; ctx.font = body(28, 700); ctx.fillText('Kuku says you are', 70, 290)
  ctx.fillStyle = '#eef1ff'; ctx.font = hand(76)
  const vy = wrapText(ctx, v.line, 70, 370, 560, 74)
  ctx.fillStyle = '#a9b0d6'; ctx.font = body(28)
  wrapText(ctx, v.sub, 70, vy + 56, 540, 38)

  // stat tiles
  const tiles = [
    ['Easter eggs', `${s.eggs}/${s.eggTotal}`],
    ['Sticker book', `${s.book}/${s.bookTotal}`],
    ['Wrapped quiz', s.wrapped == null ? 'skipped' : `${s.wrapped}/6`],
    ['Wordle', s.wordle],
    ['Kuku pets', s.pets >= 15 ? `${s.pets} (she likes you)` : `${s.pets}`],
    ['Cinnabon', s.gym === 'ate' ? 'ate it (half)' : s.gym === 'resisted' ? 'resisted' : 'never met it'],
  ]
  const tx = 70, ty = 640, tw = (W - 140 - 30) / 2, th = 150
  tiles.forEach(([k, val], i) => {
    const x = tx + (i % 2) * (tw + 30), y = ty + Math.floor(i / 2) * (th + 26)
    roundRect(ctx, x, y, tw, th, 28); ctx.fillStyle = '#ffffff14'; ctx.fill()
    ctx.strokeStyle = i === 0 ? v.a : '#ffffff22'; ctx.lineWidth = 3; ctx.stroke()
    ctx.fillStyle = '#a9b0d6'; ctx.font = body(26, 700); ctx.fillText(k, x + 28, y + 50)
    ctx.fillStyle = i === 0 ? v.a : '#eef1ff'; ctx.font = hand(val.length > 12 ? 44 : 60)
    ctx.fillText(val, x + 26, y + 116)
  })

  // footer
  ctx.fillStyle = '#eef1ff'; ctx.font = hand(40)
  ctx.fillText('happy birthday, noob.', 70, H - 120)
  ctx.fillStyle = '#a9b0d6'; ctx.font = body(24)
  ctx.fillText('15 Oct 2026 · plasteredpeak.github.io/kuku-birthday', 70, H - 70)
  return c
}
