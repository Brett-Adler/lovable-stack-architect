# Landing page + template launch prep

## Goal

Make the home route a marketing/landing page that explains the tool, shows how to use it as a Lovable template, and routes visitors into the live tool. Keep the existing comparator fully intact at a new path. Set up the foundations needed for a Lovable template launch (CTAs, screenshots-ready layout, trust signals).

## Routing changes

- `/` → new `Landing` page (marketing).
- `/app` → existing comparator (current `Index.tsx`, moved as-is).
- `NotFound` unchanged.
- Update `sitemap.xml` to include both routes.
- Update canonical/OG in `index.html` to describe the landing page; the tool page gets its own `<title>`/meta set via a small head effect (or a lightweight `react-helmet`-free approach using `useEffect`).

## Landing page sections

1. **Hero**
   - H1: "Pick the right backend for your Lovable app"
   - Sub: one-sentence value prop
   - Primary CTA: "Open the tool" → `/app`
   - Secondary CTA: "Use this template" → Lovable remix URL (placeholder constant `LOVABLE_REMIX_URL`, user fills in before launch)
   - Small trust line: "Compares 10 platforms · Last reviewed May 2026"
   - Hero visual: screenshot of the app (placeholder image slot — will be filled in the screenshots pass)

2. **What it does** — 3-up feature grid
   - Side-by-side scoring across 10 platforms
   - Live recommendation as you change inputs
   - Shareable links + Markdown/PDF export

3. **How it works** — 3 numbered steps
   - Describe your project · See the recommendation · Export or share

4. **Platforms covered** — logo/name grid of the 10 architectures (pulled from `ARCHITECTURES`)

5. **Use as a template** — the key section for Lovable launch
   - Short pitch: "Fork this, change `architectures.ts`, and you have a decision tool for any space (CMS, DB, auth, AI models, ...)"
   - 3 bullets pointing at the files to edit (`data/architectures.ts`, `lib/scoring.ts`, `index.html` / `public/`)
   - CTA: "Remix on Lovable"

6. **FAQ** (4–6 Q&As)
   - Where does the data come from? How fresh is it? Can I customize it? Is it free? Does it store my data? How do I deploy my fork?

7. **Footer**
   - Links: Open the tool · GitHub (placeholder) · Lovable · MIT License · "Last reviewed May 2026"

## Implementation details (technical)

- Add `react-router-dom` routes in `src/App.tsx`:
  - `/` → `<Landing />`
  - `/app` → existing `<Index />`
- Create `src/pages/Landing.tsx` using existing semantic tokens only (no raw colors). Use `Button`, `Card`, `Accordion` (for FAQ) from shadcn.
- Create `src/lib/constants.ts` with `LOVABLE_REMIX_URL`, `GITHUB_URL`, `LAST_REVIEWED` (single source of truth, also reused in footer/tool).
- Add a small `<SeoHead>` helper (no new deps) that sets `document.title` and updates `<meta name="description">` / canonical per route.
- Add a single `Header` shared between landing and `/app` (logo + "Open the tool" / "Use this template") so the tool page also surfaces the remix CTA — addresses the earlier "Use this template CTA in header" item.
- Single H1 per page; semantic `<section>` / `<nav>` / `<footer>`.
- Lazy-load the comparator route (`React.lazy`) so the landing page stays fast.
- Sitemap and robots updated for the new `/app` route.

## Out of scope for this pass (queued for next passes)

- Fresh screenshots for the hero and for the Lovable store listing.
- Onboarding hint, example presets, "Why not X?" rationale expansion, dark mode toggle, keyboard shortcut dialog, print stylesheet polish — these come after the landing is in place.

## Files touched

- new: `src/pages/Landing.tsx`, `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, `src/components/SeoHead.tsx`, `src/lib/constants.ts`
- edited: `src/App.tsx` (routes + lazy), `src/pages/Index.tsx` (use shared header, drop duplicated chrome), `index.html` (default meta describes landing), `public/sitemap.xml`, `README.md` (point to `/app`)

## Open question

The "Use this template" / "Remix on Lovable" button needs a real URL. I'll wire it to a `LOVABLE_REMIX_URL` constant set to `"#"` so you can drop the real link in once the template is submitted — sound good, or do you already have the URL?
