# Pre-launch checklist — make it template-ready and Lovable-friendly

Here's what's still missing or worth tightening before this is something you'd be proud to put in front of someone at Lovable. Grouped by priority.

## P0 — Must do before sharing

1. **Add the feedback / "get in touch" surface** (you asked for this earlier, then skipped the questions, so it never landed). Proposal: one `<FeedbackButton />` component mounted in `SiteFooter` + a floating button on `/app`, opening a small dialog with:
   - Three quick intents (radio): "Found something wrong / missing", "Want to hire me (Lovable or elsewhere)", "Just saying hi"
   - Optional name + email, message textarea
   - Submit = `mailto:` with prefilled subject/body (no backend, keeps the template zero-config). Plus visible direct links to your Lovable profile and Figma.
   - Why mailto and not a form: keeps the template forkable with zero setup; anyone remixing inherits a working contact path by changing one constant.
   - Add `AUTHOR_EMAIL` to `src/lib/constants.ts`.

2. **Set `LOVABLE_REMIX_URL`** in `src/lib/constants.ts`. It's still `null`, so every "Use this template / Remix" CTA in the header, hero, and footer is hidden. Until this is set, the landing page literally has no template-launch button — which is the whole point of the project.
   - Publish the project, then paste the Remix URL here.

3. **Replace `docs/screenshots/*.png`** with current screenshots. The landing/methodology pages have been redesigned multiple times since those were captured (bento, brand logos, new methodology table, portrait inputs panel fix). README and the SEO image references look stale.
   - Re-shoot: `landing-hero.png`, `app-viewport.png`, `methodology.png`, `mobile-landing.png`.

4. **Sanity check `og-image.png`**. If it predates the rebrand and the new logo set, regenerate it so LinkedIn/Twitter previews match the current site. Test at opengraph.xyz against the published URL.

## P1 — Strongly recommended for "Lovable would receive this well"

5. **Tone down the affiliation disclaimer redundancy.** It currently appears in: hero subhead, hero italic line, FAQ #1, footer (twice), llms.txt, README, TEMPLATE-SETUP. That's a lot. Keep the strong disclosure in the footer + FAQ + README; trim the hero italic line to one short sentence ("A fan project — not affiliated with Lovable."). Over-disclaiming reads as anxious; one clean line reads as respectful.

6. **Make the "open to joining Lovable" line less buried.** Right now it's a footer aside in tiny text. Either:
   - (a) Promote it to the "About the builder" tile on the landing page as an explicit line ("Open to roles at Lovable — [contact]"), OR
   - (b) Drop it from the footer entirely and put it in the feedback dialog under the "Want to hire me" intent.
   - (b) is more dignified; (a) is more direct. Pick one — having it in the footer only is the worst of both.

7. **Re-review the rubric for Lovable Cloud bias.** Since the audience includes Lovable themselves, the Methodology page's "known biases" section should explicitly acknowledge:
   - You're a Lovable fan (already there ✓)
   - Confirm DX-with-Lovable scores were sanity-checked against the other 9 platforms (not just Lovable Cloud = 5)
   - The native-integration flag isn't double-counted into scoring (verify in `scoring.ts`)

8. **Spot-check cost bands against current vendor pricing** for at least Vercel, Netlify, Render, Fly (these change quarterly). Bump `lastReviewed` per platform in `architectures.ts` where you've verified, and update `LAST_REVIEWED` in `constants.ts`.

9. **Run `npm run build`, `npm run lint`, `npm test`** and fix anything red. The TEMPLATE-SETUP "sanity check" section already lists this — it's worth actually doing it.

## P2 — Polish

10. **`TEMPLATE-SETUP.md` — add the missing constant.** It documents `AUTHOR_HANDLE`, `AUTHOR_URL`, etc. but if we add `AUTHOR_EMAIL` in P0, document it too.

11. **`README.md` "Live demo" link** — already points to the published URL ✓. Double-check it actually loads after publish.

12. **`PLAUSIBLE_DOMAIN`** is `null` in constants. If you want analytics on the demo (useful to know if Lovable folks actually click through), set it. Optional.

13. **`sitemap.xml` / `robots.txt`** — verify they reference the final published domain and that `/` `/app` `/methodology` are all listed.

## Out of scope for this pass

- New features in the comparator itself (scoring, criteria, presets) — the surface area is good.
- Visual redesign — the bento + brand-logo work just landed and looks consistent.
- Backend / auth — intentionally a static client-side app; don't add Lovable Cloud just to have it.

## Suggested order of execution

P0 (1 → 2 → 3 → 4) in one build pass, then P1 (5, 6, 7) as a second pass before publish, then P2 cleanups. The feedback dialog + setting the remix URL are the only items that meaningfully change "is this shareable yet" — everything else is polish.
