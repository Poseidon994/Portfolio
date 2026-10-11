import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SectionTitle from './SectionTitle'
import Tile from './Tile'
import RetinaMap from './RetinaMap'
import SolarDay from './SolarDay'
import { projects } from '../data/profile'

const VISUALS = {
  retinopathy: RetinaMap,
  solar: SolarDay,
}

// The pipeline is a real sequence, so the steps are ordered and joined by a line.
function Pipeline({ steps }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  return (
    <ol ref={ref} aria-label="Pipeline, in order" className={`pipeline ${inView ? 'is-on' : ''}`}>
      {steps.map((step, i) => (
        <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="absolute -bottom-0.5 left-[5px] top-[1.15rem] w-px bg-rule" />
          )}
          <span
            aria-hidden="true"
            className="step-dot relative mt-[0.38rem] h-[11px] w-[11px] flex-none rounded-full"
            style={{ '--i': i }}
          />
          <span className="text-sm leading-snug">{step}</span>
        </li>
      ))}
    </ol>
  )
}

function Project({ project }) {
  const Visual = VISUALS[project.id]

  return (
    <Tile as="article" className="grid md:grid-cols-[1.12fr_1fr]" innerClassName="contents">
      <div className="relative z-[1] p-7 md:p-10">
        <h3 className="h-tile max-w-[16ch]">{project.title}</h3>
        <p className="mt-5 max-w-[50ch] text-[1.0625rem] leading-relaxed text-graphite">{project.summary}</p>

        <ul className="bullets mt-8 space-y-3.5 text-[0.9688rem] leading-relaxed">
          {project.highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>

        <a href={project.repo} target="_blank" rel="noopener" className="text-link mt-8">
          View on GitHub <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>

      <div className="relative z-[1] border-t border-rule bg-film md:border-l md:border-t-0">
        <div className="flex flex-col gap-9 p-7 md:sticky md:top-24 md:p-10">
          <Visual />
          <Pipeline steps={project.pipeline} />
        </div>
      </div>
    </Tile>
  )
}

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-36"
    >
      <SectionTitle id="projects-title" lines={['Two AI systems,', 'shipped as APIs.']} />
      <div className="mt-12 flex flex-col gap-6 md:mt-16">
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
