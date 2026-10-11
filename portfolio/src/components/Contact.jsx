import { useRef, useState } from 'react'
import { Check, Copy, Github, Linkedin } from 'lucide-react'
import SectionTitle from './SectionTitle'
import Tile from './Tile'
import { profile } from '../data/profile'

// Optional. With a Formspree endpoint (see .env.example) the form posts to it.
// Without one, the form opens the visitor's email app with the message filled in,
// which works on any static host.
const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

const MESSAGES = {
  mailto: `Your email app should open with the message filled in. If nothing opens, write to ${profile.email}.`,
  sent: 'Message sent. I will reply to the email address you entered.',
  error: `The message did not send. Check your connection and try again, or write to ${profile.email}.`,
}

export default function Contact() {
  const formRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | mailto | sent | error

  async function copyEmail() {
    setCopyFailed(false)
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // Older browsers, or a blocked clipboard: fall back to a temporary textarea.
      const area = document.createElement('textarea')
      area.value = profile.email
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      let ok = false
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
      document.body.removeChild(area)
      if (!ok) {
        setCopyFailed(true)
        return
      }
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  async function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (data.get('_gotcha')) return // honeypot: bots fill hidden fields

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio message from ${data.get('name')}`)
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('mailto')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
      if (res.ok) {
        setStatus('sent')
        formRef.current?.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-36"
    >
      <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div>
          <SectionTitle
            id="contact-title"
            lines={['Open to software,', 'applied AI, and', 'backend roles.']}
            className="text-[clamp(2.75rem,6.4vw,5.25rem)]"
          />

          <a
            href={`mailto:${profile.email}`}
            className="h-tile mt-10 inline-block break-all py-2 text-[clamp(1.5rem,4.2vw,2.75rem)] underline decoration-rule decoration-2 underline-offset-[0.25em] transition-colors hover:text-accent hover:decoration-current md:mt-14"
          >
            {profile.email}
          </a>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copyEmail} className="btn btn-line">
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy email'}
            </button>
            <a href={profile.links.github} target="_blank" rel="noopener" className="btn btn-line">
              <Github size={16} aria-hidden="true" /> GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener" className="btn btn-line">
              <Linkedin size={16} aria-hidden="true" /> LinkedIn
            </a>
          </div>
          <p role="status" aria-live="polite" className={copyFailed ? 'mt-3 text-sm text-danger' : 'sr-only'}>
            {copied ? 'Email address copied.' : ''}
            {copyFailed ? 'Copying did not work. Select the address above and copy it.' : ''}
          </p>
        </div>

        <Tile as="div" innerClassName="p-7 md:p-9">
          <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6">
            <h3 className="h-sub">Send a message</h3>

            <div>
              <label htmlFor="name" className="text-sm font-semibold">
                Your name
              </label>
              <input id="name" name="name" required autoComplete="name" className="field mt-1" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Your email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className="field mt-1" />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-semibold">
                Message
              </label>
              <textarea id="message" name="message" required rows={4} className="field mt-1 resize-none" />
            </div>

            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            <button type="submit" disabled={status === 'sending'} className="btn btn-solid self-start disabled:opacity-60">
              {status === 'sending' ? 'Sending message' : 'Send message'}
            </button>

            <p
              role="status"
              aria-live="polite"
              className={`text-sm leading-snug ${status === 'error' ? 'text-danger' : 'text-graphite'}`}
            >
              {MESSAGES[status] ?? ''}
            </p>
          </form>
        </Tile>
      </div>
    </section>
  )
}
