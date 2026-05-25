import { useEffect, useRef } from 'react'

const CHARS = '·:;=+*#%@█'

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(a: number, b: number, t: number) { return a + t * (b - a) }

const P = new Uint8Array(512)
;(function initPerm() {
  const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,
    103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,
    62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,
    136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,
    229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,
    25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,
    116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,
    189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,
    155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,
    112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,
    81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,
    204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,
    72,243,141,128,195,78,66,215,61,156,180]
  for (let i = 0; i < 256; i++) { P[i] = p[i]; P[256 + i] = p[i] }
})()

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3
  const u = h < 2 ? x : y
  const v = h < 2 ? y : x
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

function perlin(x: number, y: number): number {
  const xi = Math.floor(x) & 255
  const yi = Math.floor(y) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const u = fade(xf)
  const v = fade(yf)
  const aa = P[P[xi] + yi]
  const ab = P[P[xi] + yi + 1]
  const ba = P[P[xi + 1] + yi]
  const bb = P[P[xi + 1] + yi + 1]
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v,
  )
}

function fbm(x: number, y: number, octaves: number): number {
  let v = 0, amp = 0.5, freq = 1.0
  for (let i = 0; i < octaves; i++) {
    v += perlin(x * freq, y * freq) * amp
    amp *= 0.5
    freq *= 2.0
  }
  return v
}

export function AsciiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: -1, y: -1 })
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 })
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      }
    }
    const onLeave = () => { mouseRef.current = { x: -1, y: -1 } }

    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)

    const fontSize = 14
    const dpr = window.devicePixelRatio || 1

    function updateSize() {
      const rect = canvas!.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height }
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const ro = new ResizeObserver(updateSize)
    ro.observe(canvas)
    updateSize()

    if (reducedMotion) {
      ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", "SF Mono", monospace`
      const charW = ctx.measureText('M').width
      const charH = fontSize * 1.2
      const { w, h } = sizeRef.current
      const cols = Math.floor(w / charW)
      const rows = Math.floor(h / charH)

      ctx.fillStyle = '#a6e3a1'
      for (let row = 0; row < rows; row++) {
        let line = ''
        for (let col = 0; col < cols; col++) {
          const nx = col / cols
          const ny = row / rows
          const n = fbm(nx * 4.0, ny * 3.0, 4)
          let v = n * 0.55 + 0.42
          v = Math.max(0, Math.min(0.999, v))
          const idx = Math.floor(v * CHARS.length)
          line += CHARS[Math.min(idx, CHARS.length - 1)]
        }
        ctx.fillText(line, 0, row * charH + fontSize)
      }

      return () => {
        ro.disconnect()
        parent.removeEventListener('mousemove', onMove)
        parent.removeEventListener('mouseleave', onLeave)
      }
    }

    let time = 0
    let charW = 0

    function render() {
      const { w, h } = sizeRef.current
      if (w <= 0 || h <= 0) { rafRef.current = requestAnimationFrame(render); return }

      ctx!.font = `${fontSize}px "JetBrains Mono", "Fira Code", "SF Mono", monospace`
      if (charW === 0) charW = ctx!.measureText('M').width
      const charH = fontSize * 1.2

      const cols = Math.floor(w / charW)
      const rows = Math.floor(h / charH)
      if (cols <= 0 || rows <= 0) { rafRef.current = requestAnimationFrame(render); return }

      ctx!.clearRect(0, 0, w, h)
      ctx!.fillStyle = '#a6e3a1'

      const sm = smoothMouseRef.current
      const tm = mouseRef.current
      if (tm.x < 0) {
        sm.x += (0.5 - sm.x) * 0.02
        sm.y += (0.5 - sm.y) * 0.02
      } else {
        sm.x += (tm.x - sm.x) * 0.06
        sm.y += (tm.y - sm.y) * 0.06
      }

      for (let row = 0; row < rows; row++) {
        let line = ''
        for (let col = 0; col < cols; col++) {
          const nx = col / cols
          const ny = row / rows

          const n = fbm(nx * 4.0 + time * 0.2, ny * 3.0 + time * 0.15, 4)
          let v = n * 0.55 + 0.42

          const dx = nx - sm.x
          const dy = (ny - sm.y) * 0.5
          const dist = Math.sqrt(dx * dx + dy * dy)
          const bump = Math.exp(-dist * dist * 12.0) * 0.5
          v += bump

          v = Math.max(0, Math.min(0.999, v))
          const idx = Math.floor(v * CHARS.length)
          line += CHARS[Math.min(idx, CHARS.length - 1)]
        }
        ctx!.fillText(line, 0, row * charH + fontSize)
      }

      time += 0.016
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.14,
        pointerEvents: 'none',
      }}
    />
  )
}
