## Goal
Rewrite the README to launch-quality and close the remaining small gaps blocking a Lovable template publish.

## 1. README rewrite (`README.md`)

Replace with a launch-quality version, structured as:

- **Hero blurb + screenshot** — 1–2 sentence pitch, embed `docs/screenshots/hero.png`, MIT + "Built with Lovable" badges.
- **Live demo** — link the published URL and the "Use this template" remix link from `src/lib/constants.ts`.
- **What it does** — 4 bullets: side-by-side scoring, live recommendation with rationale + runner-up trade-off, transparent sourced methodology, share & export.
- **Screenshots** — landing, recommendation card, comparison matrix, methodology, and a mobile shot. Stored under `docs/screenshots/`.
- **Use it as a template (5-minute customization)** — three concrete steps:
  1. Swap options, criteria & rubric in `src/data/architectures.ts`.
  2. Tune defaults and input → weight mapping in `src/lib/scoring.ts`.
  3. Rebrand: `index.html`, `src/lib/constants.ts` (`LOVABLE_REMIX_URL`, `GITHUB_URL`, `SITE_URL`, `LAST_REVIEWED`), assets in `public/`.
- **Methodology & bias disclosure** — short paragraph mirroring `/methodology` so it shows on GitHub too; link to the in-app page.
- **Tech stack** — React 18, Vite 5, TS, Tailwind, shadcn/ui, react-router, Mermaid, lz-string (share URLs), Vitest.
- **Project structure** — annotated tree of `src/pages`, `src/components`, `src/data`, `src/lib`.
- **Routes** — `/`, `/app`, `/methodology`.
- **Local development** — install / dev / build / lint / test.
- **Data freshness** — pulled from `LAST_REVIEWED`; instructions for re-review.
- **Contributing** — one PR to `src/data/architectures.ts` is enough to fix a score or cost band.
- **License** — MIT.

## 2. Pre-launch fixes

- **`src/lib/constants.ts` — `GITHUB_URL`**: still `"#"`. User will provide the repo URL later; in the meantime, hide the GitHub link in `SiteFooter.tsx` and the README "Contributing" section when `GITHUB_URL === "#"` so we don't ship dead links. Easy to flip on later by setting the constant.
- **`src/lib/constants.ts` — `LOVABLE_REMIX_URL`**: currently the editor project URL. Leave as-is for now; flag to the user that it should be swapped for the official Lovable template URL once published. Add a code comment to that effect (already present — verify).
- **`index.html` — OG image**: `og:image` points to `/og-image.png` but only `og-image.svg` exists in `public/`. Generate a 1200×630 PNG at `public/og-image.png` using imagegen (brand-aligned: dark gradient, product name, "Compare 10 backend platforms side by side", small Lovable mark). Keeps current meta tags valid.
- **Template gallery screenshot**: 1600×900 hero composition (landing top + recommendation card) saved to `docs/screenshots/template-cover.png` for the Lovable listing.
- **In-app screenshots**: capture from local preview at desktop (1440×900) and mobile (390×844) viewports — landing hero, `/app` with recommendation + matrix visible, `/methodology`. Save into `docs/screenshots/`.
- **`public/llms.txt`** — re-read and update for the new landing + `/app` + `/methodology` structure if stale.
- **`public/robots.txt`** — verify it allows crawling and references `sitemap.xml`.
- **`public/sitemap.xml`** — already includes `/`, `/app`, `/methodology`. Verify `lastmod` dates are reasonable (add if missing).
- **`index.html`** — double-check the JSON-LD `SoftwareApplication` description still matches current copy after the audit pass (Lovable AI Gateway mention, "native vs self-hosted" framing).

## 3. Order of operations
1. Capture screenshots from the running preview at desktop + mobile viewports → `docs/screenshots/`.
2. Generate `public/og-image.png` (1200×630) via imagegen.
3. Generate `docs/screenshots/template-cover.png` (1600×900) for the Lovable listing.
4. Hide the GitHub link in `SiteFooter.tsx` while `GITHUB_URL === "#"`.
5. Refresh `public/llms.txt` and verify `robots.txt` / `sitemap.xml` / `index.html` JSON-LD.
6. Rewrite `README.md` referencing the new screenshots, real demo URL, and template remix URL.

## 4. Out of scope
- Landing-page visual redesign.
- Adding criteria, presets, or platforms.
- Dark-mode polish.

## Open items (user follow-up, non-blocking)
- Real `GITHUB_URL` once the repo is published — flip the constant and the footer/README link re-appears automatically.
- Real `LOVABLE_REMIX_URL` once the template is submitted to the Lovable gallery.
