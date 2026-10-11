import SectionTitle from './SectionTitle'
import Tile from './Tile'
import { experience } from '../data/profile'

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-36"
    >
      <SectionTitle id="experience-title" lines={['One CRM portal,', 'three layers.']} />

      <Tile className="mt-12 md:mt-16" innerClassName="p-7 md:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
          <div>
            <h3 className="h-tile">{experience.role}</h3>
            <p className="mt-2 text-lg text-graphite">
              {experience.company}, {experience.place.toLowerCase()}
            </p>
          </div>
          <p className="text-graphite">{experience.period}</p>
        </div>

        <p className="mt-7 max-w-[62ch] text-[1.0625rem] leading-relaxed">{experience.summary}</p>

        {/* The stack as a diagram: a request travels down the layers, the response comes back up. */}
        <div className="relative mt-10 md:mt-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-44 md:block">
            <span className="track" />
            <span className="packet packet-down" />
            <span className="packet packet-up" />
          </div>

          <ol className="flex flex-col gap-8">
            {experience.layers.map((layer) => (
              <li key={layer.id} className="group grid items-stretch gap-x-12 gap-y-3 md:grid-cols-[11rem_1fr]">
                <div className="relative z-[1] flex min-h-20 min-w-40 flex-col justify-center justify-self-start rounded-2xl border border-rule bg-film px-5 py-4 transition-colors group-hover:border-accent md:items-center md:justify-self-stretch md:text-center">
                  <span className="h-sub">{layer.tech}</span>
                  <span className="text-sm text-graphite">{layer.layer}</span>
                </div>
                <p className="self-center text-[1.0625rem] leading-relaxed text-graphite transition-colors group-hover:text-ink">
                  {layer.point}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Tile>
    </section>
  )
}
