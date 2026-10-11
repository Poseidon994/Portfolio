import SectionTitle from './SectionTitle'
import Tile from './Tile'
import CountUp from './CountUp'
import { leadership } from '../data/profile'

export default function Community() {
  const { gdg, gfg } = leadership

  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-36"
    >
      <SectionTitle id="community-title" lines={['Leading a developer', 'community on campus.']} />

      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-12">
        <Tile
          variant="accent"
          className="md:col-span-7 md:row-span-2"
          innerClassName="flex h-full flex-col justify-between gap-14 p-7 md:p-10"
        >
          <div>
            <h3 className="h-tile max-w-[18ch]">{gdg.title}</h3>
            <p className="mt-2 opacity-80">{gdg.org}</p>
          </div>
          <div>
            <p className="figure text-[7rem] sm:text-[9.5rem]">
              <CountUp to={gdg.reach} group suffix="+" />
            </p>
            <p className="mt-3 text-[1.0625rem] leading-relaxed">students served by the chapter.</p>
            <p className="mt-6 max-w-[46ch] opacity-85">{gdg.body}</p>
          </div>
        </Tile>

        <Tile className="md:col-span-5" innerClassName="p-7 md:p-9">
          <h3 className="h-sub">What the chapter runs</h3>
          <ul className="mt-5 divide-y divide-rule">
            {gdg.events.map((event) => (
              <li key={event} className="py-3 text-[1.0625rem] first:pt-0 last:pb-0">
                {event}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile className="md:col-span-5" innerClassName="flex h-full flex-col gap-6 p-7 md:p-9">
          <div>
            <h3 className="h-sub">{gfg.title}</h3>
            <p className="mt-1 text-graphite">{gfg.org}</p>
          </div>
          <p className="text-[1.0625rem] leading-relaxed text-graphite">{gfg.body}</p>
        </Tile>
      </div>
    </section>
  )
}
