# Pulse — Dashboard

A React + Vite + Tailwind CSS single-page site, exported from Figma Make and
converted into a production-ready project.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- TypeScript 5

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Production build

```bash
npm run build
```

Type-checks the project with `tsc --noEmit` and outputs a static production
build to `dist/`. Preview it locally with:

```bash
npm run preview
```

## Project structure

```
index.html              Vite HTML entry
src/main.tsx             React entry point, mounts <App />
src/App.tsx               Root component
src/index.css              Tailwind CSS entry
src/imports/Dashbaord/      Generated dashboard UI (component + SVG paths + image asset)
vite.config.ts            Vite/React/Tailwind config, GitHub Pages base path
.github/workflows/deploy.yml   CI: build + deploy to GitHub Pages
```

No environment variables are required to build or run this project.

## Deployment (GitHub Pages)

Every push to `main` triggers `.github/workflows/deploy.yml`, which:

1. Installs dependencies (`npm ci`).
2. Builds the site (`npm run build`), setting the Vite `base` path to
   `/<repo-name>/` so assets resolve correctly under a GitHub Pages project
   URL (or `/` automatically if this repo is a `<owner>.github.io` user page).
3. Uploads `dist/` as a Pages artifact and deploys it.

### One-time setup in GitHub

In the repository, go to **Settings → Pages** and set **Source** to
**GitHub Actions**. No other configuration is needed — the workflow handles
the rest on the next push to `main`.

### Expected URL

- Project repo (e.g. `my-account/pulse-dashboard`):
  `https://my-account.github.io/pulse-dashboard/`
- User/org page repo (named `my-account.github.io`):
  `https://my-account.github.io/`

## Pushing to your repository

```bash
git init                     # if not already a git repo
git remote add origin <your-repo-url>
git add .
git commit -m "Initial website"
git branch -M main
git push -u origin main
```

GitHub Actions will pick up the push automatically and deploy.
