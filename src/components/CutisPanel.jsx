import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { mulberry32 } from '../lib/random'

/*
  Two illustrations for Cutis.

  Cascade: each square stands for 1% of the lesions. The tabular gate clears half of them and the
  CNN ensemble scores the rest. The squares are a schematic of proportions, not model output.
  Drag across the grid, use the arrow keys, or tap a third of it to move between the stages.

  Leakage audit: the two bars use the figures from the audit. Splitting by image gave 97.6% and
  grouping by patient gave 64.0% (nearest-neighbour accuracy).
*/

const TOTAL = 100
const KEPT = 50
// How many of the squares that stay in play get each heat level, hottest first (levels 3, 2, 1).
// The rest of them are level 0.
const HEAT_COUNTS = [4, 9, 15]

// Which squares the gate keeps, and how hot each one ends up, is fixed by a seeded shuffle
// so the picture is the same on every visit.
const CELLS = (() => {
  const rnd = mulberry32(2024)
  const ranked = Array.from({ length: TOTAL }, (_, i) => [rnd(), i]).sort((a, b) => b[0] - a[0])
  const cells = Array.from({ length: TOTAL }, () => ({ kept: false, level: 0 }))
  ranked.forEach(([, i], rank) => {
    if (rank >= KEPT) return
    let level = 0
    if (rank < HEAT_COUNTS[0]) level = 3
    else if (rank < HEAT_COUNTS[0] + HEAT_COUNTS[1]) level = 2
    else if (rank < HEAT_COUNTS[0] + HEAT_COUNTS[1] + HEAT_COUNTS[2]) level = 1
    cells[i] = { kept: true, level }
  })
  return cells
})()

const STAGES = [
  {
    name: 'All lesions.',
    text: 'Each square is 1% of the lesions. Drag across the grid to run the cascade.',
    spoken: 'All lesions',
  },
  {
    name: 'Stage 1, tabular gate.',
    text: 'It clears 50% of the lesions and keeps 98.7% of the malignant ones.',
    spoken: 'Stage 1: the tabular gate clears 50 percent of the lesions',
  },
  {
    name: 'Stage 2, CNN ensemble.',
    text: 'It scores the rest, and a stage-2 LightGBM fuses the scores. Warmer means higher risk.',
    spoken: 'Stage 2: the CNN ensemble scores the remaining lesions',
  },
]

const IMAGE_SPLIT = 97.6
const PATIENT_SPLIT = 64.0
const INFLATION = (IMAGE_SPLIT - PATIENT_SPLIT).toFixed(1)

// Flips to true two frames after it mounts, so CSS transitions have a starting state to run from.
function useReveal(reduce) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (reduce) {
      setOn(true)
      return undefined
    }
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setOn(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [reduce])
  return on
}

function Bar({ label, value, extra }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-semibold tabular-nums">{value.toFixed(1)}%</span>
      </div>
      <div className="leak-track mt-2">
        <span className="leak-fill" style={{ '--w': `${PATIENT_SPLIT}%` }} />
        {extra && <span className="leak-extra" style={{ '--l': `${PATIENT_SPLIT}%`, '--w': `${value - PATIENT_SPLIT}%`, '--d': '0.75s' }} />}
      </div>
    </div>
  )
}

function Leakage({ reduce }) {
  const on = useReveal(reduce)

  return (
    <div
      role="img"
      aria-label={`Bar chart of nearest-neighbour accuracy. Splitting the data by image gave ${IMAGE_SPLIT} percent. Grouping it by patient gave ${PATIENT_SPLIT} percent. The ${INFLATION} point difference is leakage.`}
      className={`leak flex w-full flex-col gap-6 ${on ? 'is-on' : ''}`}
    >
      <p aria-hidden="true" className="text-[0.8125rem] text-graphite">
        Nearest-neighbour accuracy
      </p>
      <div aria-hidden="true" className="flex flex-col gap-6">
        <Bar label="Split by image" value={IMAGE_SPLIT} extra />
        <div>
          <Bar label="Split by patient" value={PATIENT_SPLIT} />
          <div className="mt-1.5 flex justify-between text-xs text-graphite">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      <p aria-hidden="true" className="flex items-center gap-2 text-[0.8125rem] text-graphite">
        <span className="leak-swatch" />
        {INFLATION} points of inflation from the image split
      </p>
    </div>
  )
}

export default function CutisPanel() {
  const reduce = useReducedMotion()
  const figureRef = useRef(null)
  const inView = useInView(figureRef, { once: true, margin: '0px 0px -20% 0px' })
  const [view, setView] = useState('cascade')
  const [stage, setStage] = useState(reduce ? 2 : 0)
  const timers = useRef([])

  // On first sight the cascade runs by itself: the gate, then the ensemble.
  useEffect(() => {
    if (!inView || reduce) return undefined
    timers.current = [window.setTimeout(() => setStage(1), 700), window.setTimeout(() => setStage(2), 2400)]
    return () => timers.current.forEach((id) => window.clearTimeout(id))
  }, [inView, reduce])

  const current = STAGES[stage]

  return (
    <figure ref={figureRef} className="w-full">
      <div className="scrub-frame relative mx-auto w-full max-w-[22rem] rounded-2xl">
        <div className="flex aspect-square flex-col justify-center rounded-2xl border border-rule bg-sheet p-4">
          {view === 'cascade' ? (
            <div
              role="img"
              aria-label={`${current.spoken}. A grid of ${TOTAL} squares, each standing for 1 percent of the lesions. This is an illustration of proportions, not model output.`}
              className="cascade"
            >
              {CELLS.map((cell, i) => {
                let state = 'all'
                if (stage === 1) state = cell.kept ? 'sent' : 'cleared'
                if (stage === 2) state = cell.kept ? `l${cell.level}` : 'cleared'
                return <span key={i} className="cascade-cell" data-s={state} style={{ '--i': i }} />
              })}
            </div>
          ) : (
            <Leakage reduce={reduce} />
          )}
        </div>

        {view === 'cascade' && (
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={stage}
            onChange={(e) => {
              timers.current.forEach((id) => window.clearTimeout(id))
              setStage(Number(e.target.value))
            }}
            aria-label="Cascade stage"
            aria-valuetext={current.spoken}
            className="scrub"
          />
        )}
      </div>

      <figcaption className="mt-5 flex flex-col items-center gap-3 text-center">
        <div className="seg" role="group" aria-label="Illustration">
          <button type="button" aria-pressed={view === 'cascade'} onClick={() => setView('cascade')}>
            Cascade
          </button>
          <button type="button" aria-pressed={view === 'leakage'} onClick={() => setView('leakage')}>
            Leakage audit
          </button>
        </div>

        <div className="min-h-[6rem] max-w-[38ch] text-[0.8125rem] leading-snug text-graphite">
          {view === 'cascade' ? (
            <>
              <p>
                <span className="font-semibold text-ink">{current.name}</span> {current.text}
              </p>
              <p className="mt-2">Illustration of proportions, not model output.</p>
            </>
          ) : (
            <p>
              <span className="font-semibold text-ink">Same test, two kinds of split.</span> Splitting by image
              inflates the score, so the reported numbers use patient-grouped splits.
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  )
}
