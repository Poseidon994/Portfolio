import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages settings. The deploy workflow (.github/workflows/deploy.yml) sets both for you:
//   VITE_BASE      "/" for a <username>.github.io repo, "/<repo-name>/" for any other repo name
//   VITE_SITE_URL  the full public address, used for the link-preview image and the canonical URL
// Locally both are unset: the base falls back to "/" and the absolute-URL tags are left out.
const site = process.env.VITE_SITE_URL ? process.env.VITE_SITE_URL.replace(/\/*$/, '/') : ''

function siteMeta() {
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      if (site) {
        return html.replaceAll('__SITE_URL__', site).replace(/[ \t]*<!-- site-url:(start|end) -->\r?\n?/g, '')
      }
      return html.replace(/[ \t]*<!-- site-url:start -->[\s\S]*?<!-- site-url:end -->\r?\n?/g, '')
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), siteMeta()],
})
