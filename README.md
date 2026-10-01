# AppLighters

Marketing site for **AppLighters**, an app-enhancement studio. The positioning is simple: _we light up the app you already have_ — adding AI, optimizing data, cutting cloud costs, hardening security, and scaling it for whatever comes next.

The site is a fast, animated, single-brand marketing experience: a signature hero, seven data-driven service pages, a portfolio of shipped work, and a contact flow — all server-rendered for SEO and statically generated at build time.

> **Live:** [www.applighters.com](https://www.applighters.com)

## Tech stack

- **Framework:** Next.js 14 (Pages Router) · React 18
- **UI & styling:** Material UI v6 + Emotion, with server-side style injection via a custom `_document.js` for flicker-free, SEO-friendly pages
- **Animation:** bespoke HTML5 Canvas + `requestAnimationFrame` scenes (no animation library), all `prefers-reduced-motion` aware
- **Contact:** EmailJS (client-side form submission, no backend)
- **Tooling:** ESLint (`next lint`), Sass for keyframes, `next-videos`, `next-useragent`
- **Hosting:** Netlify (Git-based CI with deploy previews)

## Features

- **Data-driven services** — a single source of truth (`src/data/services.js`) generates the nav dropdown, homepage grid, footer links, and every `/services/[slug]` page. Add a service object and the whole site picks it up.
- **Custom motion layer** — a cursor-tracking hero "eye" (`HeroAura`), a unique animated background per service (neural net, data mandala, cost bars, DevOps infinity loop, cloud auto-scaling, security radar, UI design-sweep), a robot-crew rocket service-bay centerpiece, and a physics-based, drag-and-throw app carousel.
- **Statically generated** — service pages are prerendered via `getStaticPaths` / `getStaticProps`.
- **Accessible & responsive** — fluid layout, keyboard-navigable, and a single static frame for every animation under reduced-motion.

## Project structure

```
pages/
  index.js              # Homepage: hero, services grid, outcomes, steps, clients
  Portfolio.js          # "Our work" — shipped web & mobile apps
  services/[slug].js    # Dynamic, statically-generated service pages
  _app.js, _document.js # App shell + Emotion SSR setup
src/
  components/           # UI + canvas animation components (HeroAura, *HeroBg, AppsTicker, …)
  data/                 # services.js (source of truth), aiApps.js, showcaseApps.js
  lib/                  # layout + scroll helpers
styles/                 # theme.js, Emotion cache, _bgAnim.scss (keyframes)
public/                 # images, icons, favicons
next.config.js          # redirects from legacy routes, svgr/next-videos setup
netlify.toml            # build + cache config
```

## Getting started

**Prerequisites:** Node.js 18+ and npm.

```bash
# install dependencies
npm install

# start the dev server at http://localhost:3000
npm run dev
```

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server (`http://localhost:3000`) |
| `npm run build` | Production build (static generation) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint via `next lint` |

## Architecture notes

- **Adding or editing a service** — edit `src/data/services.js`. Each entry holds `{ slug, name, navLabel, icon, accent, tagline, overview, included[], outcomes[] }`. For a bespoke hero animation, register a component in the `HERO_BACKGROUNDS` map in `pages/services/[slug].js`; otherwise it falls back to the shared `AuroraBg`.
- **Animation pattern** — canvas scenes share one approach: time-based motion (`dt`), an `IntersectionObserver` that pauses the `requestAnimationFrame` loop off-screen, a capped device-pixel-ratio, and a single static frame under `prefers-reduced-motion`.
- **Styling order** — SCSS keyframes load globally in `_app.js`; Emotion's cache is configured so MUI `sx` styles win. `_document.js` injects critical styles during SSR to avoid a flash of unstyled content.
- **Legacy routes** — old URLs (e.g. `/AiDevPage`) are redirected to their new homes in `next.config.js`.

## Contact form

The footer contact form is powered by **EmailJS** (client-side). The service/template/public-key IDs are configured in `src/components/Layout.js`.

## Deployment

Deployed on **Netlify**. Pushes build via `npm run build` (see `netlify.toml`), and pull requests get automatic deploy previews.

---

© AppLighters. All rights reserved.
