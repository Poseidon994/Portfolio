import { useCallback, useState } from 'react'

const KEY = 'ob-theme'

function readInitial() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// The initial class is set by an inline script in index.html (no flash).
// Toggling uses the View Transitions API for a circular reveal from the button,
// and falls back to an instant switch where it is unsupported or motion is reduced.
export function useTheme() {
  const [theme, setTheme] = useState(readInitial)

  const toggle = useCallback((event) => {
    const root = document.documentElement
    const next = root.classList.contains('dark') ? 'light' : 'dark'

    const apply = () => {
      root.classList.toggle('dark', next === 'dark')
      setTheme(next)
    }

    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* storage can be blocked; the toggle still works for this visit */
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
      apply()
      return
    }

    const rect = event?.currentTarget?.getBoundingClientRect?.()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : 0
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(apply)
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }, [])

  return { theme, toggle }
}
