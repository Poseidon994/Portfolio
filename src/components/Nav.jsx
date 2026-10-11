import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { FileText, Menu, Moon, Sun, X } from 'lucide-react'
import { profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'community', label: 'Community' },
  { id: 'contact', label: 'Contact' },
]

const OBSERVED = ['top', ...SECTIONS.map((s) => s.id)]

export default function Nav({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const active = useActiveSection(OBSERVED)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  // While the menu is open: Escape closes it (and hands focus back to the button),
  // and so does a press anywhere outside the header.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const onPointerDown = (e) => {
      if (!headerRef.current?.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <motion.div aria-hidden="true" className="h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />
      <nav
        aria-label="Primary"
        className={`border-b border-rule backdrop-blur-lg transition-colors ${
          open ? 'bg-film' : 'bg-film/90 supports-[backdrop-filter]:bg-film/85'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 md:px-10">
          <a href="#top" className="wordmark -my-3 py-3 text-2xl leading-none" onClick={() => setOpen(false)}>
            {profile.name}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'true' : undefined}
                  className="relative rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-graphite transition-colors hover:text-ink aria-[current=true]:text-ink"
                >
                  {s.label}
                  {active === s.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noopener"
              className="btn btn-line hidden !py-2.5 sm:inline-flex"
            >
              <FileText size={16} aria-hidden="true" /> Resume
            </a>
            <button
              type="button"
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* The panel overlays the page (absolute, opacity and transform only). Animating its height
            re-flowed the header on every frame and cancelled the smooth scroll to the chosen section. */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full max-h-[calc(100svh-4.25rem)] overflow-y-auto border-b border-rule bg-film shadow-xl md:hidden"
            >
              <ul className="mx-auto flex max-w-6xl flex-col px-6 py-3">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="wordmark block py-3 text-3xl"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
                <li className="pb-3 pt-2">
                  <a href={profile.links.resume} target="_blank" rel="noopener" className="btn btn-line w-full">
                    <FileText size={16} aria-hidden="true" /> Resume
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
