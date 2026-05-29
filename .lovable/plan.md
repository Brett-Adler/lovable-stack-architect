# Implement the "Modern high-density bento" direction

Refresh the marketing surface of the template to match Lovable's brand: cream background, Inter type, tri-gradient accents (blue → magenta → orange), bento composition, ink-black CTAs. No content/copy changes, no flow changes, no app-tool changes beyond inheriting the new tokens.

## Token layer — `src/index.css`

Replace the light-mode token block (`:root`) with the Lovable cream palette. All values HSL.

| Token | New value | Note |
|---|---|---|
| `--background` | `40 25% 94%` | Cream `#F5F2EC` |
| `--foreground` | `0 0% 6%` | Ink `#0F0F0F` |
| `--card` | `0 0% 100%` | Pure white tiles |
| `--card-foreground` | `0 0% 6%` | |
| `--popover` / `-fg` | `0 0% 100%` / `0 0% 6%` | |
| `--primary` | `0 0% 6%` | Ink — solid CTAs become black |
| `--primary-foreground` | `0 0% 100%` | |
| `--primary-glow` | `309 78% 60%` | Magenta `#E94BD2` (used as second stop in legacy gradients) |
| `--secondary` | `40 20% 96%` | |
| `--secondary-foreground` | `0 0% 6%` | |
| `--muted` | `40 18% 92%` | |
| `--muted-foreground` | `0 0% 29%` | `#4A4A4A` — passes AA on cream and white |
| `--accent` | `309 78% 60%` | Magenta |
| `--accent-foreground` | `0 0% 100%` | |
| `--border` | `35 18% 86%` | Warm hairline |
| `--input` | `35 18% 86%` | |
| `--ring` | `0 0% 6%` | Strong ink focus ring |
| `--radius` | `1rem` | Slightly more pillowy tiles |

Gradients/shadows:

- `--gradient-primary: linear-gradient(135deg, #4F8AFB 0%, #E94BD2 50%, #FF6A3D 100%);`
- `--gradient-subtle: linear-gradient(180deg, hsl(40 28% 95%), hsl(35 22% 92%));`
- `--gradient-glow: radial-gradient(60% 60% at 50% 0%, rgba(79,138,251,0.18), rgba(233,75,210,0.16) 40%, rgba(255,106,61,0.14) 70%, transparent 80%);`
- `--shadow-card: 0 1px 2px rgba(15,15,15,0.04), 0 8px 30px rgba(15,15,15,0.04);`
- `--shadow-elegant: 0 20px 60px -20px rgba(15,15,15,0.18);`

Dark mode (`.dark`) — keep functional but retint: background `0 0% 6%`, card `0 0% 9%`, foreground white, border `0 0% 16%`, muted-foreground `0 0% 70%`. Gradients unchanged.

Utilities — add `.bg-gradient-glow { background: var(--gradient-glow); }`, keep existing `.bg-gradient-primary`, `.bg-gradient-subtle`, `.text-gradient`, `.shadow-card`, `.shadow-elegant`.

Set base `body { font-family: Inter, … }`.

## Tailwind — `tailwind.config.ts`

- Add `fontFamily.sans = ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"]`.
- Add `colors.brand = { blue: "#4F8AFB", magenta: "#E94BD2", orange: "#FF6A3D", ink: "#0F0F0F", cream: "#F5F2EC" }` for the rare hex use sites that want a literal brand value.
- Extend `borderRadius` with `"2xl": "1.25rem", "3xl": "1.75rem"` for tile shapes.

## `index.html`

- Preconnect to Google Fonts and load Inter 400–800.
- Update `theme-color` and `msapplication-TileColor` to `#F5F2EC`.

## Header — `src/components/SiteHeader.tsx`

- Swap sticky bg to `bg-background/80 backdrop-blur` (cream).
- Primary "Open the tool" button keeps default ink styling. Outline button keeps default.
- No structural change; tighten padding only.

## Landing — `src/pages/Landing.tsx`

Rewrite layout to the bento direction. Keep every section, keep all `FEATURES`/`STEPS`/`PRESETS`/`TEMPLATE_BULLETS`/`FAQ`/`ARCHITECTURES` data wiring.

### Hero
- Single `<section>` with `relative` and an absolutely-positioned `bg-gradient-glow` blob behind the headline.
- Centered chip: pill with a pinging tri-gradient dot + "Free Lovable template · Last reviewed {LAST_REVIEWED}".
- `h1`: `text-5xl md:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95]`. Last clause "your Lovable app" wrapped in `.text-gradient` so the brand gradient highlights one phrase.
- Lede unchanged (with the existing "openly published" link to /methodology).
- CTA pair: primary = gradient-bordered pill wrapping an ink-black inner button ("Open the tool" + arrow). Secondary = "Use this template" as a cream/outline pill.

### Bento features (replaces today's 3-column grid)
- `grid grid-cols-12 gap-5`.
- Tile 1 (`col-span-12 md:col-span-8`, white, `rounded-3xl shadow-card`): icon tile tinted `bg-brand-blue/10 text-brand-blue`, then h3 + body for `FEATURES[0]` (Side-by-side scoring).
- Tile 2 (`col-span-12 md:col-span-4`, white): icon tile `bg-brand-magenta/10 text-brand-magenta`, then `FEATURES[1]`.
- Tile 3 (`col-span-12 md:col-span-4`, white): icon tile `bg-brand-orange/10 text-brand-orange`, then `FEATURES[2]`.
- Tile 4 — the **dark "What's Lovable Cloud?" tile** (`col-span-12 md:col-span-8`): `bg-foreground text-background` (ink/cream inverted), with an absolutely positioned tri-gradient blur in the top-right corner. Pulls the existing copy from today's "What's Lovable Cloud?" section, plus the existing two-paragraph body. Add a small inline "Learn more →" link to `/methodology`.

This bento subsumes today's standalone "What's Lovable Cloud?" `<section>` — delete that section to avoid duplication.

### Preset scenarios
- Keep `mb-8 text-center` header.
- Cards stay white `rounded-3xl` with `shadow-card`, but the inner pill changes: a tiny gradient dot before the title, and the arrow chevron becomes a gradient text fragment on hover.

### How it works
- Keep 3-column grid. Numbered circle becomes a gradient-filled disc (`bg-gradient-primary text-white`) instead of solid ink.

### Platforms covered
- Convert to a mini-bento: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3`, each tile `rounded-2xl border bg-card shadow-card p-4 text-center` (essentially today, plus the bolder shadow).

### Use as a template (CTA panel)
- Outer: `rounded-[2rem] p-[1.5px] bg-gradient-primary shadow-elegant`. Inner: `bg-card rounded-[calc(2rem-1.5px)] p-8 sm:p-12`.
- Primary button "Remix on Lovable" and outline button "Try it first" — unchanged copy and routing.
- TEMPLATE_BULLETS chips: `rounded-xl border bg-muted/40` (unchanged).

### FAQ
- Wrap in a single white tile `rounded-3xl border bg-card shadow-card p-6 sm:p-10` and keep the shadcn Accordion. Headings tightened.

## Methodology — `src/pages/Methodology.tsx`

- Hero: identical pattern to Landing. Chip = "Methodology · Last reviewed {LAST_REVIEWED}" with the tri-gradient dot. h1 = "How the recommendation is built", with the word "built" wrapped in `.text-gradient`.
- Numbered section badges: gradient-filled disc (`bg-gradient-primary text-white`) instead of solid primary.
- Section cards keep `rounded-2xl border bg-card shadow-card`. No content changes.
- Final "Make it your own" CTA panel switches to the same gradient-bordered + white-inner pattern as the Landing CTA, for consistency.

## App (`src/pages/Index.tsx`) and inner components

- No layout/structural changes. Inherit new tokens automatically (cream bg, ink CTAs, Inter type).
- One small touch: the page wrapper switches from `bg-gradient-subtle` to `bg-background` so the app surface is solid cream and the comparator tiles read cleanly. The comparator itself is untouched.

## Verification

- Open `/`, `/methodology`, `/app` — confirm cream background, Inter type, gradient hero word, bento composition on `/`, ink CTAs everywhere.
- Tab through CTAs — focus ring is now ink, visible on cream and white.
- Confirm muted text (`#4A4A4A`) on cream ≈ 8:1 and on white ≈ 9:1 (well above AA).
- Sanity-check the dark "What's Lovable Cloud?" tile: white text on `#0F0F0F` ≈ 20:1.
- Re-check `/methodology` table still has source links accessible.

## Files touched

- `index.html`
- `src/index.css`
- `tailwind.config.ts`
- `src/components/SiteHeader.tsx`
- `src/pages/Landing.tsx`
- `src/pages/Methodology.tsx`
- `src/pages/Index.tsx` (one-line wrapper bg swap)
