import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

// Counts up once when scrolled into view. The final value is always in the DOM for
// screen readers; the animated digits are decorative.
export default function CountUp({ to, decimals = 0, duration = 1.8, suffix = '', group = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView) return undefined
    if (reduce) {
      setValue(to)
      return undefined
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setValue,
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])

  const fmt = (n) =>
    group ? Math.round(n).toLocaleString('en-US') : n.toFixed(decimals)

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {fmt(value)}
        {suffix}
      </span>
      <span className="sr-only">
        {fmt(to)}
        {suffix}
      </span>
    </span>
  )
}
