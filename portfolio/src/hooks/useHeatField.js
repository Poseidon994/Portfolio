import { useEffect } from 'react'

/*
  Draws the hero's attention map and paints heat onto the glyphs of the name.

  - Canvas: a grid of cells. Each cell grows and warms as the attention point
    (pointer, or an autonomous gaze) gets closer, plus a few slow ambient maxima,
    the way a Grad-CAM map has several local peaks.
  - Glyphs: each name line has a transparent overlay whose gradient is centred on
    the same attention point (set through --lx / --ly).
  - One rAF loop drives both, and it only runs while the hero is on screen.
*/

const STOPS = [0, 0.34, 0.67, 1]

function hexToRgb(value) {
  const hex = value.trim().replace('#', '')
  const full = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function readPalette() {
  const cs = getComputedStyle(document.documentElement)
  const get = (name) => hexToRgb(cs.getPropertyValue(name))
  return {
    heat: [get('--heat-0'), get('--heat-1'), get('--heat-2'), get('--heat-3')],
    rule: get('--rule'),
  }
}

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

function heatAt(heat, t) {
  if (t <= STOPS[1]) return mix(heat[0], heat[1], t / STOPS[1])
  if (t <= STOPS[2]) return mix(heat[1], heat[2], (t - STOPS[1]) / (STOPS[2] - STOPS[1]))
  return mix(heat[2], heat[3], (t - STOPS[2]) / (1 - STOPS[2]))
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

function ambientBlobs(t, w, h) {
  const blobs = []
  for (let i = 0; i < 3; i += 1) {
    blobs.push({
      x: w * (0.5 + 0.42 * Math.sin(t * (0.00018 + i * 0.00007) + i * 2.1)),
      y: h * (0.5 + 0.36 * Math.cos(t * (0.00013 + i * 0.00006) + i * 1.3)),
      s: 110 + i * 26,
      wt: 0.24,
    })
  }
  return blobs
}

const SWEEP_MS = 2600

export function useHeatField({ heroRef, canvasRef, nameRef, calmRefs, heatRefs, reduce }) {
  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    const nameEl = nameRef.current
    if (!hero || !canvas || !nameEl) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let palette = readPalette()
    let w = 0
    let h = 0
    let cell = 40
    let sigma = 150
    let raf = 0
    let visible = true
    let prev = performance.now()
    const startedAt = prev
    const att = { x: null, y: null }
    const ptr = { x: 0, y: 0, inside: false, last: -1e9, type: 'mouse' }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const small = w < 640
      cell = small ? 28 : 40
      sigma = small ? 105 : 150
    }

    const textRange = document.createRange()

    const draw = (ax, ay, t, calms, quiets) => {
      ctx.clearRect(0, 0, w, h)
      const cols = Math.ceil(w / cell) + 1
      const rows = Math.ceil(h / cell) + 1
      const twoSigma2 = 2 * sigma * sigma
      const reach2 = 10.2 * sigma * sigma
      const blobs = ambientBlobs(t, w, h)
      const maxSize = cell - 6

      for (let r = 0; r < rows; r += 1) {
        const cy = r * cell + cell / 2
        for (let c = 0; c < cols; c += 1) {
          const cx = c * cell + cell / 2
          let intensity = 0

          const dx = cx - ax
          const dy = cy - ay
          const d2 = dx * dx + dy * dy
          if (d2 < reach2) intensity += Math.exp(-d2 / twoSigma2)

          for (let b = 0; b < blobs.length; b += 1) {
            const bx = cx - blobs[b].x
            const by = cy - blobs[b].y
            intensity += blobs[b].wt * Math.exp(-(bx * bx + by * by) / (2 * blobs[b].s * blobs[b].s))
          }

          // Calm the field behind text (intro, legend) so it stays readable.
          for (let k = 0; k < calms.length; k += 1) {
            const z = calms[k]
            const ddx = Math.max(z.l - cx, 0, cx - z.r)
            const ddy = Math.max(z.t - cy, 0, cy - z.b)
            intensity *= smooth(-10, 130, Math.hypot(ddx, ddy))
          }

          // Keep the cells behind and between the letters of the name quiet: the glyphs carry the
          // heat themselves, and loud cells in the counters make the name hard to read.
          for (let k = 0; k < quiets.length; k += 1) {
            const z = quiets[k]
            const ddx = Math.max(z.l - cx, 0, cx - z.r)
            const ddy = Math.max(z.t - cy, 0, cy - z.b)
            intensity *= 0.2 + 0.8 * smooth(0, 44, Math.hypot(ddx, ddy))
          }

          intensity = Math.min(1, intensity)

          const size = 5 + (maxSize - 5) * Math.pow(intensity, 0.75)
          const warm = smooth(0, 0.16, intensity)
          const rgb = mix(palette.rule, heatAt(palette.heat, Math.pow(intensity, 0.85)), warm)
          const alpha = 0.5 + 0.5 * smooth(0, 0.35, intensity)
          ctx.fillStyle = `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${alpha})`

          const x = cx - size / 2
          const y = cy - size / 2
          if (size > 8 && ctx.roundRect) {
            ctx.beginPath()
            ctx.roundRect(x, y, size, size, Math.min(6, size * 0.2))
            ctx.fill()
          } else {
            ctx.fillRect(x, y, size, size)
          }
        }
      }
    }

    const frame = (now) => {
      raf = 0
      if (!visible || document.hidden) return

      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const t = reduce ? 0 : now - startedAt

      // Reads first, writes after, so the frame never forces a layout.
      const cr = canvas.getBoundingClientRect()
      const nr = nameEl.getBoundingClientRect()
      const heatEls = heatRefs.current.filter(Boolean)
      const heatRects = heatEls.map((el) => el.getBoundingClientRect())
      // The overlay boxes span the whole container; the text inside is narrower, so measure the text.
      const quiets = heatEls.map((el, i) => {
        textRange.selectNodeContents(el)
        const tr = textRange.getBoundingClientRect()
        return {
          l: tr.left - cr.left,
          r: tr.right - cr.left,
          t: heatRects[i].top - cr.top,
          b: heatRects[i].bottom - cr.top,
        }
      })
      const calms = []
      calmRefs.forEach((ref) => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        calms.push({ l: r.left - cr.left - 20, t: r.top - cr.top - 14, r: r.right - cr.left + 20, b: r.bottom - cr.top + 14 })
      })

      const pointerActive = ptr.inside && (ptr.type !== 'touch' || now - ptr.last < 2600)
      let tx
      let ty
      if (pointerActive) {
        tx = ptr.x
        ty = ptr.y
      } else if (reduce) {
        tx = nr.left + nr.width * 0.72
        ty = nr.top + nr.height * 0.7
      } else if (t < SWEEP_MS) {
        const p = easeInOut(t / SWEEP_MS)
        tx = nr.left + nr.width * (-0.06 + 1.12 * p)
        ty = nr.top + nr.height * 0.72
      } else {
        tx = nr.left + nr.width * (0.5 + 0.42 * Math.sin(t * 0.00045 + 0.6))
        ty = nr.top + nr.height * (0.5 + 0.36 * Math.sin(t * 0.00071 + 2.0))
      }

      if (att.x === null) {
        att.x = tx
        att.y = ty
      }
      const k = reduce ? 1 : 1 - Math.exp(-dt * 9)
      att.x += (tx - att.x) * k
      att.y += (ty - att.y) * k

      heatEls.forEach((el, i) => {
        el.style.setProperty('--lx', `${att.x - heatRects[i].left}px`)
        el.style.setProperty('--ly', `${att.y - heatRects[i].top}px`)
      })
      draw(att.x - cr.left, att.y - cr.top, t, calms, quiets)

      // The idle gaze animates continuously; with reduced motion we only redraw on events.
      if (!reduce) schedule()
    }

    function schedule() {
      if (!raf && visible) raf = requestAnimationFrame(frame)
    }

    const onPointer = (e) => {
      ptr.x = e.clientX
      ptr.y = e.clientY
      ptr.inside = true
      ptr.last = performance.now()
      ptr.type = e.pointerType
      schedule()
    }
    const onLeave = (e) => {
      if (e.pointerType !== 'touch') ptr.inside = false
      schedule()
    }

    resize()
    hero.addEventListener('pointermove', onPointer, { passive: true })
    hero.addEventListener('pointerdown', onPointer, { passive: true })
    hero.addEventListener('pointerleave', onLeave, { passive: true })

    const ro = new ResizeObserver(() => {
      resize()
      schedule()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        prev = performance.now()
        schedule()
      }
    })
    io.observe(hero)

    const mo = new MutationObserver(() => {
      palette = readPalette()
      schedule()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const onVisibility = () => !document.hidden && schedule()
    document.addEventListener('visibilitychange', onVisibility)

    // Fonts change the name's size; redraw once they have loaded.
    document.fonts?.ready.then(schedule)
    schedule()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      hero.removeEventListener('pointermove', onPointer)
      hero.removeEventListener('pointerdown', onPointer)
      hero.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
    }
  }, [heroRef, canvasRef, nameRef, calmRefs, heatRefs, reduce])
}
