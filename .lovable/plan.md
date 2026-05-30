# Restyle inspired by Lovable.dev

Refresh the visual system — colors, type, cards, borders, spacing, hero background — to feel like the current Lovable.dev marketing site, without touching any copy or claiming affiliation. All existing text stays exactly as-is.

## Visual direction (from the reference shots)

- **Background**: soft warm off-white `#F7F4EE` (matches today, just slightly warmer/cleaner). Hero gets a large, soft radial aurora: blue at top fading through white into pink → orange at the bottom (the signature Lovable gradient blur).
- **Foreground / ink**: near-black `#0A0A0A` for headings and body, no slate-blue tint.
- **Accent gradient**: pink `#FF4D8D` → orange `#FF7A45` → blue `#4D7CFF` (already in our logo). Used for hero glow, card aurora corners, and the primary CTA.
- **Type**: heavier, tighter display headings. Switch sans stack to load **Geist** (closest free analog to Lovable's wordmark/headings) with Inter as fallback for body. Headings get `font-weight: 800`, `letter-spacing: -0.02em`, larger hero size.
- **Cards**: bigger radius (`1.25rem` / `rounded-2xl`), very soft borders (`#EDE7DD`), no heavy shadow — just a faint `0 1px 2px rgba(0,0,0,0.04)`. Cards sit on the cream bg with a subtle inner cream tone.
- **Buttons**: pill-shaped primary in solid near-black with white text (matches "Open Lovable"); secondary as outlined pill on cream.
- **Borders**: lighter, warmer (`#EDE7DD` instead of current cool slate border).
- **Spacing**: more generous vertical rhythm in hero and section headers (py increased ~20–30%).

## Files to change

1. **`src/index.css`** — update CSS variables:
   - `--background` → warmer cream
   - `--foreground` → near-black
   - `--border` / `--input` → warm light tan
   - `--card` → pure white with cream tint
   - `--radius` → `1.25rem`
   - `--gradient-primary` → pink→orange→blue
   - Add `--gradient-aurora` radial used for hero/section glows
   - Add `--shadow-soft` (very subtle)
   - Update body font stack to Geist, Inter fallback

2. **`tailwind.config.ts`** — update `brand` palette hexes to new pink/orange/blue, add `rounded-2xl`/`3xl` already present, extend `fontFamily.sans` with Geist first.

3. **`index.html`** — add Geist font `<link>` from Google Fonts (Geist Sans 400/500/600/700/800).

4. **`src/pages/Landing.tsx`** — swap hero background to the new aurora gradient (radial blob behind hero); bump heading size/weight; convert primary CTA to pill black button; no copy changes.

5. **`src/components/SiteHeader.tsx`** — pill-shaped nav already exists; tweak the active state to black pill (already black) and the "Use this template" button to pill outline; logo rounded-xl. No copy changes.

6. **`src/components/SiteFooter.tsx`** — lighten border, warmer divider. No copy changes.

7. **Cards across the app** (`RecommendationCard`, `ComparisonMatrix` card wrappers, `CostEstimate`, `InputsPanel`, FAQ items if any) — pick up the new `--radius` and `--border` automatically through shadcn `Card`; verify a couple of components and remove any hard-coded `rounded-lg`/`border-slate-*` overrides that block the refresh.

## Out of scope

- No copy/text changes anywhere.
- No logo change (keeps the stacked-heart we just made — it already uses the Lovable gradient).
- No new components, no routing changes, no dark-mode rework (dark stays functional; tuning is light-mode focused).
- No imagery/illustration swaps.

## Technical notes

- All colors stay defined as CSS variables in HSL inside `index.css`; components keep using semantic tokens (`bg-background`, `border-border`, etc.). New hex values get converted to HSL for the tokens.
- Geist loaded via Google Fonts `<link rel="preconnect">` + stylesheet in `index.html`; Tailwind `fontFamily.sans` lists `Geist` first so existing `font-sans` classes pick it up with no per-component edits.
- Aurora hero background is a pure CSS radial-gradient div positioned `absolute inset-0 -z-10` inside the hero — no images, no JS.
