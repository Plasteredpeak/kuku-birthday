// Animated full-screen backgrounds for the countdown. Two canvases crossfade between scenes.

const SCENES = [
  { id: 'cave', label: 'the cave', theme: 'cave', bg: ['#0b1029', '#1a2246'] },
  { id: 'stars', label: 'the night sky', theme: 'letter', bg: ['#050817', '#141b45'] },
  { id: 'petals', label: 'petals', theme: 'anime', bg: ['#22112e', '#4a2552'] },
  { id: 'kukus', label: 'kuku clouds', theme: 'wordle', bg: ['#10203f', '#2b3e74'] },
  { id: 'aurora', label: 'aurora', theme: 'gate', bg: ['#04141c', '#0f2f3b'] },
]

const rand = (a, b) => a + Math.random() * (b - a)

function makeScene(id, w, h, imgs) {
  const P = []
  if (id === 'cave') {
    for (let i = 0; i < 70; i++) P.push({ x: rand(0, w), y: rand(0, h), r: rand(1.2, 3.2), vy: rand(-0.35, -0.08), vx: rand(-0.15, 0.15), t: rand(0, 6.28), s: rand(0.01, 0.04) })
  } else if (id === 'stars') {
    for (let i = 0; i < 160; i++) P.push({ x: rand(0, w), y: rand(0, h), r: rand(0.4, 1.8), t: rand(0, 6.28), s: rand(0.01, 0.05) })
  } else if (id === 'petals') {
    for (let i = 0; i < 46; i++) P.push({ x: rand(0, w), y: rand(-h, h), r: rand(5, 11), vy: rand(0.5, 1.4), vx: rand(-0.4, 0.6), a: rand(0, 6.28), va: rand(-0.03, 0.03), t: rand(0, 6.28) })
  } else if (id === 'kukus') {
    for (let i = 0; i < 16; i++) P.push({ x: rand(0, w), y: rand(0, h), sz: rand(46, 110), vx: rand(-0.25, 0.25), vy: rand(-0.3, -0.08), a: rand(-0.4, 0.4), va: rand(-0.004, 0.004), img: imgs[i % imgs.length], al: rand(0.1, 0.24) })
  } else if (id === 'aurora') {
    const cols = ['#2de2b0', '#5b8cff', '#ff8fb6', '#9b6bff']
    for (let i = 0; i < 5; i++) P.push({ x: rand(0, w), y: rand(0, h * 0.7), r: rand(w * 0.45, w * 0.9), c: cols[i % cols.length], t: rand(0, 6.28), s: rand(0.002, 0.006) })
  }
  return { id, P, shoot: null }
}

function draw(ctx, sc, w, h, scene) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, scene.bg[0]); g.addColorStop(1, scene.bg[1])
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  const P = sc.P
  if (sc.id === 'cave') {
    // silhouettes of stalactites
    ctx.fillStyle = '#070b1d'
    ctx.beginPath(); ctx.moveTo(0, 0)
    for (let x = 0; x <= w; x += w / 9) ctx.lineTo(x + w / 18, 40 + ((x * 7) % 90)), ctx.lineTo(x + w / 9, 0)
    ctx.fill()
    ctx.globalCompositeOperation = 'lighter'
    for (const p of P) {
      p.t += p.s; p.x += p.vx + Math.sin(p.t) * 0.2; p.y += p.vy
      if (p.y < -10) { p.y = h + 10; p.x = rand(0, w) }
      const a = 0.45 + Math.sin(p.t * 3) * 0.35
      const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
      rg.addColorStop(0, `rgba(255,214,120,${a})`); rg.addColorStop(1, 'rgba(255,214,120,0)')
      ctx.fillStyle = rg
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, 6.29); ctx.fill()
    }
  } else if (sc.id === 'stars') {
    for (const p of P) {
      p.t += p.s
      ctx.globalAlpha = 0.35 + Math.sin(p.t) * 0.35 + 0.3
      ctx.fillStyle = '#eef1ff'
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.29); ctx.fill()
    }
    ctx.globalAlpha = 1
    if (!sc.shoot && Math.random() < 0.012) sc.shoot = { x: rand(w * 0.2, w), y: rand(0, h * 0.4), l: 0 }
    if (sc.shoot) {
      const s = sc.shoot
      s.l += 1
      const x2 = s.x - s.l * 9, y2 = s.y + s.l * 4.5
      const lg = ctx.createLinearGradient(x2, y2, x2 + 70, y2 - 35)
      lg.addColorStop(0, 'rgba(255,255,255,.95)'); lg.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.strokeStyle = lg; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 + 70, y2 - 35); ctx.stroke()
      if (s.l > 45) sc.shoot = null
    }
  } else if (sc.id === 'petals') {
    for (const p of P) {
      p.t += 0.02; p.a += p.va; p.y += p.vy; p.x += p.vx + Math.sin(p.t) * 0.6
      if (p.y > h + 20) { p.y = -20; p.x = rand(0, w) }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a)
      ctx.fillStyle = 'rgba(255,170,200,.85)'
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.29); ctx.fill()
      ctx.fillStyle = 'rgba(255,220,232,.7)'
      ctx.beginPath(); ctx.ellipse(-p.r * 0.2, -p.r * 0.1, p.r * 0.45, p.r * 0.2, 0, 0, 6.29); ctx.fill()
      ctx.restore()
    }
  } else if (sc.id === 'kukus') {
    for (const p of P) {
      p.x += p.vx; p.y += p.vy; p.a += p.va
      if (p.y < -p.sz) { p.y = h + p.sz; p.x = rand(0, w) }
      if (!p.img.complete || !p.img.naturalWidth) continue
      ctx.save(); ctx.globalAlpha = p.al; ctx.translate(p.x, p.y); ctx.rotate(p.a)
      const ar = p.img.naturalHeight / p.img.naturalWidth
      ctx.drawImage(p.img, -p.sz / 2, (-p.sz * ar) / 2, p.sz, p.sz * ar)
      ctx.restore()
    }
  } else if (sc.id === 'aurora') {
    ctx.globalCompositeOperation = 'lighter'
    for (const p of P) {
      p.t += p.s
      const x = p.x + Math.sin(p.t) * w * 0.25, y = p.y + Math.cos(p.t * 0.8) * h * 0.08
      const rg = ctx.createRadialGradient(x, y, 0, x, y, p.r)
      rg.addColorStop(0, p.c + '55'); rg.addColorStop(1, p.c + '00')
      ctx.fillStyle = rg
      ctx.fillRect(0, 0, w, h)
    }
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'rgba(255,255,255,.7)'
    for (let i = 0; i < 40; i++) { const x = (i * 97) % w, y = (i * 53) % (h * 0.6); ctx.fillRect(x, y, 1.2, 1.2) }
  }
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
}

export function createBackground(canvases, imgSrcs, { onScene, interval = 25000 } = {}) {
  const imgs = imgSrcs.map((s) => { const i = new Image(); i.src = s; return i })
  const layers = canvases.map((c) => ({ c, ctx: c.getContext('2d'), sc: null, scene: null }))
  let w = 0, h = 0, dpr = 1, front = 0, idx = 0, raf, timer, running = false
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1)
    w = innerWidth; h = innerHeight
    for (const l of layers) {
      l.c.width = w * dpr; l.c.height = h * dpr
      l.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (l.scene) l.sc = makeScene(l.scene.id, w, h, imgs)
    }
  }
  function setScene(i) {
    idx = (i + SCENES.length) % SCENES.length
    const back = 1 - front
    const L = layers[back]
    L.scene = SCENES[idx]
    L.sc = makeScene(L.scene.id, w, h, imgs)
    L.c.style.opacity = '1'
    layers[front].c.style.opacity = '0'
    front = back
    onScene?.(SCENES[idx])
  }
  function loop() {
    for (const l of layers) {
      if (l.sc && (l === layers[front] || l.c.style.opacity !== '0' || true)) draw(l.ctx, l.sc, w, h, l.scene)
    }
    if (running) raf = requestAnimationFrame(loop)
  }
  return {
    start() {
      if (running) return
      running = true
      resize()
      addEventListener('resize', resize)
      setScene(0)
      loop()
      timer = setInterval(() => setScene(idx + 1), interval)
    },
    next() { clearInterval(timer); setScene(idx + 1); timer = setInterval(() => setScene(idx + 1), interval) },
    stop() { running = false; cancelAnimationFrame(raf); clearInterval(timer); removeEventListener('resize', resize) },
    scenes: SCENES,
  }
}
