# Lovable Stack Architect

A side-by-side comparator that helps founders, PMs, designers and developers pick the best backend stack for a Lovable-built app.

Compare 10 popular hosting and backend platforms across cost, scaling, lock-in, time-to-market, AI capabilities, and more:

- **Managed Backend** — Lovable Cloud, Supabase
- **Frontend Host** — Vercel, Netlify
- **Hyperscaler** — AWS, Google Cloud, Azure
- **Application PaaS** — Heroku, Render, Fly.io

Built with React, Vite, TypeScript, Tailwind, shadcn/ui and Mermaid.

## Use this template

This project is designed to be forked and customized. The whole app is data-driven — you can rebrand it and re-aim it at any decision space (CMS picker, database picker, auth picker, etc.) without touching the UI.

### Customize the platforms

Edit [`src/data/architectures.ts`](src/data/architectures.ts):

- `ARCHITECTURES` — add, remove, or edit the options being compared. Each entry has a name, tagline, description, best-for / watch-out bullets, and curated monthly cost bands per stage.
- `CRITERIA` — the dimensions used to score each option (time-to-launch, cost, scaling ceiling, lock-in, etc.).
- `RUBRIC` — the 1–5 score for each (architecture × criterion) pair. This is the heart of the recommendation.

### Tune the scoring

Edit [`src/lib/scoring.ts`](src/lib/scoring.ts):

- `DEFAULT_INPUTS` — the starting values shown on first load.
- Criterion weighting and input → weight mapping — controls how much each user input shifts the ranking.

### Rebrand

- `index.html` — title, description, OG/Twitter tags, theme color.
- `public/` — replace `logo.svg`, `logo-mark.svg`, favicons, `apple-touch-icon.png`, `og-image.png`, and `site.webmanifest`.
- `package.json` — `name`.

### Local development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # eslint
npm test         # vitest
```

## Data freshness

Cost bands and rubric scores were last reviewed **May 2026**. Pricing and platform capabilities move quickly — verify against current vendor pricing before making real decisions, and bump the date when you re-review.

## License

MIT
