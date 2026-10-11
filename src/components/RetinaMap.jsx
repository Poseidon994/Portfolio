import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/*
  An illustration of a retinal image and its Grad-CAM attention overlay.
  It is drawn in code (monochrome, like a green-channel fundus photo) and is NOT a real scan.
  Drag across it, use the arrow keys, or press the buttons to wipe the overlay in and out.
*/

function mulberry32(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DISC = { x: 118, y: 196 }

function buildVessels(seed) {
  const rnd = mulberry32(seed)
  const out = []

  const branch = (x, y, heading, len, width, depth, bias) => {
    if (depth > 4 || width < 0.4) return
    const mid = heading + bias * 0.5 + (rnd() - 0.5) * 0.5
    const end = heading + bias + (rnd() - 0.5) * 0.35
    const cx = x + Math.cos(mid) * len * 0.55
    const cy = y + Math.sin(mid) * len * 0.55
    const ex = x + Math.cos(end) * len
    const ey = y + Math.sin(end) * len
    out.push({
      d: `M${x.toFixed(1)} ${y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      w: width,
    })
    const tangent = Math.atan2(ey - cy, ex - cx)
    const spread = 0.38 + rnd() * 0.3
    branch(ex, ey, tangent + spread, len * 0.72, width * 0.66, depth + 1, bias * 0.8)
    branch(ex, ey, tangent - spread, len * 0.72, width * 0.66, depth + 1, bias * 0.8)
    if (depth < 2) branch(ex, ey, tangent + (rnd() - 0.5) * 0.2, len * 0.85, width * 0.82, depth + 1, bias)
  }

  // Two arcades curve around the macula (right), two run to the nasal side (left).
  branch(DISC.x, DISC.y, -0.55, 104, 5.4, 0, 0.26)
  branch(DISC.x, DISC.y, 0.55, 104, 5.4, 0, -0.26)
  branch(DISC.x, DISC.y, -2.35, 70, 4.2, 0, -0.22)
  branch(DISC.x, DISC.y, 2.35, 70, 4.2, 0, 0.22)
  return out
}

const VESSELS = buildVessels(11)

// Lesions the model would attend to, clustered around the macula.
const EXUDATES = [
  [292, 186, 3.2], [300, 192, 2.4], [286, 196, 2], [296, 203, 3.6], [306, 198, 2.2],
  [289, 208, 2.6], [300, 214, 2], [312, 208, 3], [246, 236, 2.6], [254, 240, 3.2],
  [250, 248, 2], [262, 244, 2.4],
]
const HEMORRHAGES = [[258, 176, 7], [318, 232, 6], [236, 206, 5], [272, 252, 8]]
const MICROANEURYSMS = [
  [274, 190], [282, 214], [266, 200], [308, 186], [316, 218], [296, 226], [244, 222],
  [262, 232], [326, 202], [280, 176], [252, 190], [304, 244], [234, 188], [290, 258],
]

// Where the attention lands: [cx, cy, radius, strength]
const HEAT = [[296, 200, 82, 1], [254, 242, 62, 0.8], [258, 178, 50, 0.6], [320, 232, 46, 0.55]]

const R = 188
const CX = 200
const CY = 200

export default function RetinaMap() {
  const frameRef = useRef(null)
  const inView = useInView(frameRef, { once: true, margin: '0px 0px -20% 0px' })
  const reduce = useReducedMotion()
  // `split` is where the handle sits (0 to 100). The overlay shows to the right of it.
  const [split, setSplit] = useState(reduce ? 38 : 100)
  const controls = useRef(null)
  const splitRef = useRef(split)
  splitRef.current = split

  const glide = (target, duration = 0.9) => {
    controls.current?.stop()
    if (reduce) {
      setSplit(target)
      return
    }
    controls.current = animate(splitRef.current, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setSplit,
    })
  }

  useEffect(() => {
    if (inView && !reduce) glide(38, 1.8)
    return () => controls.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const vessels = useMemo(
    () => VESSELS.map((v, i) => <path key={i} d={v.d} strokeWidth={v.w} />),
    [],
  )

  const edgeX = (split / 100) * 400
  const handleX = Math.min(Math.max(edgeX, 24), 376)
  const dx = handleX - CX
  const chord = Math.sqrt(Math.max(R * R - dx * dx, 0))

  return (
    <figure className="w-full">
      <div ref={frameRef} className="scrub-frame relative mx-auto aspect-square w-full max-w-[22rem] rounded-full">
        <svg
          viewBox="0 0 400 400"
          role="img"
          aria-label="Illustration of a retinal image. A heat overlay marks the lesions near the macula where a Grad-CAM map would concentrate. This is an illustration, not a real scan."
          className="h-full w-full"
        >
          <defs>
            <clipPath id="rm-fundus">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
            <clipPath id="rm-reveal">
              <rect x={edgeX} y="0" width={400 - edgeX} height="400" />
            </clipPath>
            <radialGradient id="rm-bg" cx="46%" cy="50%" r="62%">
              <stop offset="0%" stopColor="#8d9a92" />
              <stop offset="55%" stopColor="#5b6862" />
              <stop offset="100%" stopColor="#1a221f" />
            </radialGradient>
            <radialGradient id="rm-disc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f1f5ef" />
              <stop offset="70%" stopColor="#c3cdc5" />
              <stop offset="100%" stopColor="#8f9b93" />
            </radialGradient>
            <radialGradient id="rm-heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: 'var(--heat-3)', stopOpacity: 0.95 }} />
              <stop offset="32%" style={{ stopColor: 'var(--heat-2)', stopOpacity: 0.85 }} />
              <stop offset="64%" style={{ stopColor: 'var(--heat-1)', stopOpacity: 0.55 }} />
              <stop offset="100%" style={{ stopColor: 'var(--heat-0)', stopOpacity: 0 }} />
            </radialGradient>
            <filter id="rm-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="rm-grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
              <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 0.9 -0.35" />
            </filter>
          </defs>

          <g clipPath="url(#rm-fundus)">
            <rect width="400" height="400" fill="url(#rm-bg)" />

            <ellipse cx="268" cy="206" rx="34" ry="30" fill="#0e1412" opacity="0.28" />

            <g fill="none" stroke="#0f1614" strokeLinecap="round" opacity="0.85">
              {vessels}
            </g>

            <circle cx={DISC.x} cy={DISC.y} r="25" fill="url(#rm-disc)" />
            <circle cx={DISC.x} cy={DISC.y} r="11" fill="#f6f9f4" opacity="0.7" />

            <g fill="#0b110f" opacity="0.8">
              {HEMORRHAGES.map(([x, y, r]) => (
                <circle key={`h${x}${y}`} cx={x} cy={y} r={r} />
              ))}
            </g>
            <g fill="#0b110f" opacity="0.9">
              {MICROANEURYSMS.map(([x, y]) => (
                <circle key={`m${x}${y}`} cx={x} cy={y} r="1.6" />
              ))}
            </g>
            <g fill="#f5f8ee" opacity="0.92">
              {EXUDATES.map(([x, y, r]) => (
                <circle key={`e${x}${y}`} cx={x} cy={y} r={r} />
              ))}
            </g>

            <rect width="400" height="400" filter="url(#rm-grain)" opacity="0.22" />

            <g clipPath="url(#rm-reveal)">
              <g filter="url(#rm-soft)">
                {HEAT.map(([x, y, r, k]) => (
                  <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="url(#rm-heat)" opacity={k} />
                ))}
              </g>
            </g>
          </g>

          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--rule)" strokeWidth="2" />

          {chord > 0 && (
            <g>
              <line x1={handleX} x2={handleX} y1={CY - chord} y2={CY + chord} stroke="#fff" strokeWidth="2" opacity="0.9" />
              <circle cx={handleX} cy={CY} r="13" fill="var(--film)" stroke="var(--ink)" strokeWidth="2" />
              <path
                d={`M${handleX - 4.5} ${CY - 4.5}L${handleX - 8} ${CY}L${handleX - 4.5} ${CY + 4.5}M${handleX + 4.5} ${CY - 4.5}L${handleX + 8} ${CY}L${handleX + 4.5} ${CY + 4.5}`}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round(split)}
          onChange={(e) => {
            controls.current?.stop()
            setSplit(Number(e.target.value))
          }}
          aria-label="Move the Grad-CAM attention overlay"
          aria-valuetext={`The overlay covers ${100 - Math.round(split)} percent of the image`}
          className="scrub"
        />
      </div>

      <figcaption className="mt-5 flex flex-col items-center gap-3 text-center">
        <div className="seg" role="group" aria-label="Overlay">
          <button type="button" aria-pressed={split >= 99} onClick={() => glide(100)}>
            Scan only
          </button>
          <button type="button" aria-pressed={split <= 1} onClick={() => glide(0)}>
            With attention map
          </button>
        </div>
        <p className="max-w-[34ch] text-[0.8125rem] leading-snug text-graphite">
          Illustration, not a real scan. Drag across the image to move the overlay.
        </p>
      </figcaption>
    </figure>
  )
}
