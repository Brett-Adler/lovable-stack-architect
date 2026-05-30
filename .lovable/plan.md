# Make /methodology look + feel + read like /

Bring the Methodology page in line with the Landing page's visual language and voice, without losing any of the substance (rubric explanation, 12 criteria, cost-band sources table, biases, "make it your own" CTA).

## Visual changes

1. **Hero** — match Landing's hero treatment exactly:
   - Swap the small `bg-gradient-glow` blob for the full-width `bg-gradient-aurora` (the blue→white→pink→orange wash used on `/`).
   - Pill chip gets the animated ping dot (the same `bg-brand-magenta` ping + `bg-gradient-primary` core used on Landing), keeping the existing "Methodology · Last reviewed May 2026" label.
   - Heading bumps from `text-4xl sm:text-5xl md:text-6xl` to `text-5xl sm:text-6xl md:text-7xl` with `leading-[0.95] tracking-[-0.04em]` to match.
   - Subtitle expands to two short sentences in the Landing voice (see Copy below), `text-base sm:text-lg`.
   - Add a "Built with Lovable" pill below the subtitle (same component as Landing).
   - Replace the bare "Back home" text link with two pill CTAs at the bottom of the hero: primary gradient‑bordered black pill "Open the tool" → `/app`, outline pill "Back home" → `/`. Mirrors the Landing CTA row.

2. **Section rhythm** — drop the numbered circle "01/02/03/04/05" section heads (those don't appear anywhere on Landing). Replace with Landing's section-head pattern:
   - Centered small pill chip ("The rubric", "Criteria", "Cost-band sources", "Known biases", "Fork it") with the gradient dot.
   - Big `text-3xl sm:text-4xl` heading with one gradient word per Landing convention ("How the score is **computed**", "The 12 **criteria**", "Cost-band **sources**", "Known **biases**", "Make it **your own**").
   - One-line subtitle below.

3. **Cards** — bump every `rounded-2xl` → `rounded-3xl`, keep the `shadow-card` + hover `-translate-y-0.5 hover:shadow-elegant` lift used in Landing bento tiles. Criteria grid keeps 3 columns but each card adopts the Landing tile icon treatment (colored 10% tint icon square instead of the mono numbered badge).

4. **Biases section** — convert from a 2-up neutral grid into a 2-up bento. The "Built by a Lovable fan" tile becomes the dark `bg-foreground text-background` tile (same treatment as Landing's "What's Lovable Cloud?" tile) with the magenta corner-glow, so the most important caveat reads with the same weight as the Lovable Cloud feature tile on `/`. Other biases stay as soft cream cards.

5. **"Make it your own" CTA** — keep the gradient-bordered card pattern but align spacing, CTA pill style, and the inner code-file mini-cards (`rounded-2xl`, mono labels, body copy) with Landing's bento and footer-CTA conventions.

## Copy changes (light, in Landing's voice)

- Hero subtitle → "The rubric, the weights, the sources, and where the tool is opinionated — all in one place. Same voice as the home page: a Lovable fan being honest about how this thing was built."
- Section subtitles trimmed to one short sentence each, matching the casual fan-built tone of `/` (no jargon-y filler like "Each of the 10 architectures is scored 1–5 on each of the 12 criteria…" — moved into the body of the rubric card instead).
- Bias tile "Built by a Lovable fan" body kept verbatim (already on-voice).

## Out of scope

- No changes to the 12 criteria list, cost-band table data, bias content, or rubric explanation.
- No changes to `SiteHeader` / `SiteFooter`.
- No new routes, no logo change, no design-system token changes.
- Landing page is not touched.

## Files

- `src/pages/Methodology.tsx` — the only file that changes.
