import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-graphite md:flex-row md:justify-between md:px-10">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>Built with React, Tailwind CSS, and Framer Motion. Hosted on GitHub Pages.</p>
      </div>
    </footer>
  )
}
