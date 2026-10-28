# Om Bharadwaj, portfolio

A single-page portfolio built from my résumé. React 18, Vite 6, Tailwind CSS v4 and Framer Motion. It builds to plain static files, so it hosts for free on GitHub Pages.

## What is on the page

- **Hero:** an interactive attention map. A Grad-CAM-style heat field runs across a grid of cells and is painted onto the letters of the name. Move, tap or drag to steer it. Links to GitHub, LinkedIn, Kaggle and LeetCode sit under the intro.
- **About:** education, CGPA 9.05 with a 100-cell unit chart (each cell is 1% of the cohort, the top 5% lit), and skills.
- **Experience:** the Tata Technologies CRM portal drawn as a three-layer stack (React, PHP, MySQL).
- **Projects:** Ocula (diabetic retinopathy), Cutis (skin lesions) and the solar-power model. Each has an interactive picture: a draggable Grad-CAM overlay, a two-stage cascade with a leakage-audit chart, and a solar-output curve you can scrub. The retina, cascade and solar pictures are labelled as illustrations, not real data. The leakage bars use the two figures from the résumé.
- **Community:** GDG On Campus chapter lead and GeeksforGeeks campus ambassador.
- **Contact:** copy-email button, links to GitHub, LinkedIn, Kaggle and LeetCode, and a message form.
- Light and dark themes (remembered), keyboard and screen-reader friendly, and reduced-motion is respected.

## Run it locally

Run these inside the folder that contains `package.json`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # writes dist/
npm run preview    # serves dist/ at http://localhost:4173
```

Needs Node 20 or newer (22 recommended).

## Change the content

- All the words, links, skills, experience and projects live in `src/data/profile.js`.
- Replace `public/Om_Bharadwaj_Resume.pdf` to update the résumé download (keep the file name).
- Colours and type are tokens at the top of `src/index.css`.
- `public/og.png` is the 1200×630 picture shown when the link is shared on LinkedIn, WhatsApp and similar.

## Deploy to GitHub Pages

1. **Create the repository** on GitHub. The name decides the address:
   - `Poseidon994.github.io` gives `https://poseidon994.github.io/`
   - any other name, for example `portfolio`, gives `https://poseidon994.github.io/portfolio/`
2. **Push the code.** Run this inside the folder that contains `package.json`. `package.json` and the `.github` folder must sit at the top of the repository, not inside a subfolder, or the workflow will not run.
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/Poseidon994/<repo-name>.git
   git push -u origin main
   ```
3. **Turn Pages on:** in the repository go to Settings, Pages, Build and deployment, and set Source to **GitHub Actions**.
4. **Wait about a minute.** `.github/workflows/deploy.yml` builds the site and publishes it on every push to `main`. It works out the base path and the public address from the repository name, so there is nothing to configure. Progress is on the Actions tab.

### Custom domain

Add the domain under Settings, Pages. Then add two repository variables (Settings, Secrets and variables, Actions, Variables): `VITE_BASE` = `/` and `VITE_SITE_URL` = `https://yourdomain.com/`.

## Contact form

GitHub Pages has no server, so the form has two modes:

- **Default:** opens the visitor's email app with the message filled in.
- **Formspree (optional):** create a form at [formspree.io](https://formspree.io), then add a repository variable `VITE_FORMSPREE_ENDPOINT` = `https://formspree.io/f/xxxxxxxx`. Messages then arrive in your inbox without the visitor leaving the page. To try it locally, copy `.env.example` to `.env.local` and fill it in.

## Before you share the link

- [ ] "View on GitHub" shows on Ocula and Cutis, linked to their repositories. Solar has no `repo` on purpose, so it has no button. Add a `repo` in `src/data/profile.js` to show one.
- [ ] Solar is not on the latest résumé. It stays on the site because that was the choice. Delete its entry in `src/data/profile.js` to remove it.
- [ ] Check that the résumé PDF is the current one.

## Project layout

```
src/
  data/profile.js       all site content
  components/           Hero, About, Experience, Projects, Community, Contact, Nav, Footer, the project pictures, ...
  hooks/                useHeatField (hero canvas), useTheme, useActiveSection
  lib/random.js         seeded random numbers for the illustrations
  index.css             design tokens and component styles
public/                 résumé PDF, favicon, share image
.github/workflows/      GitHub Pages deploy
```
