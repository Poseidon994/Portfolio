import { useRef } from 'react'
import { useInView } from 'framer-motion'
import SectionTitle from './SectionTitle'
import Tile from './Tile'
import CountUp from './CountUp'
import { about, skillGroups } from '../data/profile'

// One cell per student in the 228-student cohort. The top 4% (about 9 students) are lit.
const COHORT = 228
const TOP_4_PERCENT = Math.round(COHORT * 0.04)
const COLUMNS = 19

function CohortChart() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Unit chart with ${COHORT} cells, one per student in the cohort. The top 4 percent are highlighted.`}
      className={`cohort ${inView ? 'is-on' : ''}`}
      style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: COHORT }, (_, i) => (
        <span key={i} className={`cohort-cell ${i < TOP_4_PERCENT ? 'is-lit' : ''}`} style={{ '--i': i }} />
      ))}
    </div>
  )
}

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-36"
    >
      <SectionTitle id="about-title" lines={['Where I study,', "and what I've shipped."]} />

      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-12">
        <Tile className="md:col-span-7" innerClassName="p-7 md:p-9">
          <h3 className="h-tile">{about.heading}</h3>
          <p className="mt-3 text-graphite">{about.school}</p>
          <p className="mt-8 max-w-[44ch] text-[1.0625rem]">{about.degree}</p>
        </Tile>

        <Tile
          variant="solid"
          className="md:col-span-5 md:row-span-2"
          innerClassName="flex flex-col justify-between gap-10 p-7 md:p-9"
        >
          <div>
            <p className="text-solid-mute">CGPA</p>
            <p className="figure mt-3 text-[8rem] sm:text-[10rem]">
              <CountUp to={about.cgpa.value} decimals={2} />
              <span
                className="ml-3 text-4xl font-semibold tracking-normal text-solid-mute sm:text-5xl"
                style={{ fontStretch: '100%' }}
              >
                /{about.cgpa.outOf}
              </span>
            </p>
          </div>
          <div>
            <CohortChart />
            <p className="mt-4 max-w-[34ch] text-solid-mute">{about.cgpa.note}</p>
          </div>
        </Tile>

        <Tile className="md:col-span-7" innerClassName="p-7 md:p-9">
          <p className="max-w-[40ch] text-[1.5rem] leading-[1.25] font-medium tracking-tight">{about.body[0]}</p>
          <p className="mt-6 max-w-[52ch] text-graphite">{about.body[1]}</p>
        </Tile>

        <Tile className="md:col-span-12" innerClassName="p-7 md:p-9">
          <h3 className="h-sub">Skills</h3>
          <dl className="mt-7 grid gap-x-12 gap-y-7 md:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.label} className={group.wide ? 'md:col-span-2' : ''}>
                <dt className="text-sm font-semibold">{group.label}</dt>
                <dd className="mt-2.5">
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Tile>
      </div>
    </section>
  )
}
