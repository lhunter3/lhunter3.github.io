# lucashunter.ca

Personal site of Lucas Hunter — a single-page, interactive landing page.

## Stack

- [Vite](https://vitejs.dev/) — build tooling & dev server
- [Tailwind CSS v4](https://tailwindcss.com/) — styling (CSS-first config in `src/style.css`)
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling
- Vanilla ES modules for interaction (`src/lib/*`) — no UI framework

## Develop

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Structure

```
index.html          # all page content (semantic, SEO-friendly)
src/
  main.js           # wires up the interaction modules
  style.css         # Tailwind + design tokens + component classes
  lib/              # reveal, smoothScroll, nav, counters, tilt, heroBackground
public/             # static assets copied verbatim (favicons, logos, CNAME, /img)
```

## Deploy

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):
**a push to the `prod` branch** builds the site and publishes `dist/` to GitHub Pages.
The custom domain is preserved by `public/CNAME`.

> [!IMPORTANT]
> One-time setup before the first automated deploy: in the repository
> **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
> (The repo previously deployed from a branch; the workflow replaces that.)
