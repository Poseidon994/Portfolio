import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { useHeatField } from '../hooks/useHeatField'

const EASE = [0.22, 1, 0.36, 1]

// One line of the name. The solid text is the real glyphs; the overlay repeats the
// same text and is painted with heat around the attention point (see useHeatField).
function NameLine({ text, index, reduce, heatRefs, className = '' }) {
  return (
    <div aria-hidden="true" className={`name-line ${className}`}>
      <span className="line-mask">
        <motion.span
          className="relative block"
          initial={reduce ? false : { y: '108%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.05, delay: 0.15 + index * 0.14, ease: EASE }}
        >
          <span className="name-solid block">{text}</span>
          <span
            ref={(el) => {
              heatRefs.current[index] = el
            }}
            className="glyph-heat block"
          >
            {text}
          </span>
        </motion.span>
      </span>
    </div>
  )
}

const SOCIALS = [
  { Icon: Github, label: 'GitHub', href: profile.links.github },
  { Icon: Linkedin, label: 'LinkedIn', href: profile.links.linkedin },
  { Icon: Mail, label: 'Email', href: `mailto:${profile.email}` },
]

export default function Hero() {
  const reduce = useReducedMotion()
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const nameRef = useRef(null)
  const calmRef = useRef(null)
  const legendRef = useRef(null)
  const heatRefs = useRef([])
  const calmRefs = useRef([calmRef, legendRef]).current

  useHeatField({ heroRef, canvasRef, nameRef, calmRefs, heatRefs, reduce })

  // Parallax: the field lags the page, the name drifts slightly, the copy stays put.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15])
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <section id="top" ref={heroRef} className="relative isolate overflow-hidden">
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: fieldY, opacity: fieldOpacity }}
        className="pointer-events-none absolute inset-x-0 -top-48 bottom-0 -z-10 will-change-transform"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </motion.div>

      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pb-12 pt-28 md:px-10">
        <motion.div ref={nameRef} style={reduce ? undefined : { y: nameY }} className="name-wrap">
          <h1 className="sr-only">{profile.name}</h1>

          <div className="grid md:grid-cols-[auto_1fr] md:items-end md:gap-x-10">
            <NameLine text="Om" index={0} reduce={reduce} heatRefs={heatRefs} className="md:col-start-1 md:row-start-1" />
            <NameLine text="Bharadwaj" index={1} reduce={reduce} heatRefs={heatRefs} className="md:col-span-2 md:row-start-2" />

            <motion.div
              ref={calmRef}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
              className="mt-8 max-w-xl md:col-start-2 md:row-start-1 md:mt-0 md:pb-4"
            >
              <p className="wordmark text-[1.65rem] leading-[1.1] sm:text-3xl">{profile.role}</p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-graphite">{profile.intro}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#projects" className="btn btn-solid">
                  View projects
                </a>
                <a href={profile.links.resume} target="_blank" rel="noopener" className="btn btn-line">
                  <FileText size={16} aria-hidden="true" /> Resume
                </a>
                <ul className="flex items-center gap-2">
                  {SOCIALS.map(({ Icon, label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        aria-label={label}
                        className="icon-btn"
                        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
                      >
                        <Icon size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div
          ref={legendRef}
          className="mt-14 flex w-fit flex-wrap items-center gap-x-6 gap-y-3 text-[0.8125rem] text-graphite md:mt-16"
        >
          <p>Grad-CAM-style attention map. Move, tap, or drag to steer it.</p>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span>Low</span>
            <span
              className="h-2 w-32 rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--heat-0), var(--heat-1), var(--heat-2), var(--heat-3))' }}
            />
            <span>High</span>
          </div>
        </div>
      </div>
    </section>
  )
}
