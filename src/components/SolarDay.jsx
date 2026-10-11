import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/*
  An illustration of how solar generation follows the sun over a typical day.
  It is a schematic, not model output: there are no values on the vertical axis
  and the curve is not fitted to any data.
*/

const W = 400
const H = 236
const X0 = 24
const X1 = 376
const BASE = 188
const TOP = 30
const HOUR_MIN = 5
const HOUR_MAX = 19
const SUNRISE = 6
const SUNSET = 18

const xAt = (hr) => X0 + ((hr - HOUR_MIN) / (HOUR_MAX - HOUR_MIN)) * (X1 - X0)
const yAt = (hr) =>
  hr <= SUNRISE || hr >= SUNSET
    ? BASE
    : BASE - Math.pow(Math.sin((Math.PI * (hr - SUNRISE)) / (SUNSET - SUNRISE)), 1.4) * (BASE - TOP)

const CURVE = (() => {
  let d = ''
  for (let hr = HOUR_MIN; hr <= HOUR_MAX + 0.001; hr += 0.1) {
    d += `${d ? 'L' : 'M'}${xAt(hr).toFixed(1)} ${yAt(hr).toFixed(1)}`
  }
  return d
})()

const TICKS = [6, 9, 12, 15, 18]
const fmt = (hr) => {
  const total = Math.round(hr * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default function SolarDay() {
  const frameRef = useRef(null)
  const inView = useInView(frameRef, { once: true, margin: '0px 0px -20% 0px' })
  const reduce = useReducedMotion()
  const [hour, setHour] = useState(13)
  const controls = useRef(null)

  useEffect(() => {
    if (!inView || reduce) return undefined
    controls.current = animate(HOUR_MIN + 0.5, 13, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setHour,
    })
    return () => controls.current?.stop()
  }, [inView, reduce])

  const mx = xAt(hour)
  const my = yAt(hour)

  return (
    <figure className="w-full">
      <div ref={frameRef} className="scrub-frame relative mx-auto w-full max-w-[26rem]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Illustration of solar generation over a typical day: it rises after sunrise, peaks around midday, and falls to zero at sunset. A marker shows the selected hour. This is a schematic, not model output."
          className="block h-auto w-full"
        >
          <defs>
            <linearGradient id="sd-heat" gradientUnits="userSpaceOnUse" x1="0" y1={BASE} x2="0" y2={TOP}>
              <stop offset="0%" style={{ stopColor: 'var(--heat-0)' }} />
              <stop offset="45%" style={{ stopColor: 'var(--heat-1)' }} />
              <stop offset="75%" style={{ stopColor: 'var(--heat-2)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--heat-3)' }} />
            </linearGradient>
            <linearGradient id="sd-fill" gradientUnits="userSpaceOnUse" x1="0" y1={BASE} x2="0" y2={TOP}>
              <stop offset="0%" style={{ stopColor: 'var(--heat-0)', stopOpacity: 0 }} />
              <stop offset="100%" style={{ stopColor: 'var(--heat-2)', stopOpacity: 0.32 }} />
            </linearGradient>
          </defs>

          <path d={`${CURVE}L${X1} ${BASE}L${X0} ${BASE}Z`} fill="url(#sd-fill)" />
          <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="var(--rule)" strokeWidth="1" />
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={xAt(t)} x2={xAt(t)} y1={BASE} y2={BASE + 5} stroke="var(--rule)" strokeWidth="1" />
              <text x={xAt(t)} y={BASE + 20} textAnchor="middle" fontSize="13.5" fill="var(--graphite)">
                {fmt(t)}
              </text>
            </g>
          ))}

          <path d={CURVE} fill="none" stroke="url(#sd-heat)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          <line x1={mx} x2={mx} y1={my} y2={BASE} stroke="var(--graphite)" strokeWidth="1" opacity="0.5" />
          <circle cx={mx} cy={my} r="10" fill="var(--heat-3)" stroke="var(--sheet)" strokeWidth="3" />
          <circle cx={mx} cy={my} r="10" fill="none" stroke="var(--heat-2)" strokeWidth="1.5" />
        </svg>

        <input
          type="range"
          min={HOUR_MIN}
          max={HOUR_MAX}
          step="0.25"
          value={hour}
          onChange={(e) => {
            controls.current?.stop()
            setHour(Number(e.target.value))
          }}
          aria-label="Hour of day"
          aria-valuetext={fmt(hour)}
          className="scrub"
          style={{ left: `${(X0 / W) * 100}%`, width: `${((X1 - X0) / W) * 100}%` }}
        />
      </div>

      <figcaption className="mt-4 text-center">
        <p className="text-[0.8125rem] text-graphite">
          Hour of day <span className="ml-1 font-semibold tabular-nums text-ink">{fmt(hour)}</span>
        </p>
        <p className="mx-auto mt-3 max-w-[38ch] text-[0.8125rem] leading-snug text-graphite">
          Output follows the sun, so the model gets hour of day, seasonality, and solar angle proxies. Illustration of
          a typical day, not model output.
        </p>
      </figcaption>
    </figure>
  )
}
