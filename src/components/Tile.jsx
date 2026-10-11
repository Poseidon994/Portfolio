import { useRef } from 'react'

const VARIANTS = {
  plain: '',
  solid: 'tile-solid',
  accent: 'tile-accent',
}

// Bento tile. A warm glow follows the pointer across it.
export default function Tile({
  as: Tag = 'div',
  variant = 'plain',
  className = '',
  innerClassName = '',
  children,
  ...rest
}) {
  const ref = useRef(null)

  function onPointerMove(event) {
    if (event.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <Tag ref={ref} onPointerMove={onPointerMove} className={`tile ${VARIANTS[variant]} ${className}`} {...rest}>
      <span className="tile-spot" aria-hidden="true" />
      <div className={`relative z-[1] h-full ${innerClassName}`}>{children}</div>
    </Tag>
  )
}
