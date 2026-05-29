## Goal

Hide every "Use this template" / Remix CTA and every GitHub link until real URLs are provided, so nothing in the UI points to a placeholder or the author's private editor URL.

## Approach

Make both URLs nullable in `src/lib/constants.ts`, then gate every consumer behind a truthy check. Nothing renders if the URL is empty.

### 1. `src/lib/constants.ts`

```ts
// Set these when ready to publish as a template.
export const LOVABLE_REMIX_URL: string | null = null;
export const GITHUB_URL: string | null = null;
```

(Keep the rest of the file unchanged.)

### 2. `src/components/SiteHeader.tsx`

Wrap the "Use this template / Remix" outline button (line ~72) in `{LOVABLE_REMIX_URL && (...)}`. When null, the button disappears; the "Open the tool" primary CTA stays.

### 3. `src/components/SiteFooter.tsx`

- Wrap the "Use this template" link (line 13) in `{LOVABLE_REMIX_URL && ...}`.
- The GitHub link is already gated on `GITHUB_URL !== "#"` — change to `{GITHUB_URL && ...}`.

### 4. `src/pages/Landing.tsx`

Three CTA spots use `LOVABLE_REMIX_URL` (hero, "Use as a template" section, final CTA). Each becomes conditional:

- Hero (line ~127): hide the secondary "Use this template" button entirely; "Open the tool" remains the single primary CTA.
- "Use as a template" section (line ~313, "Remix on Lovable" button): hide the button, but keep the section's copy (it explains the template angle). Add a small muted line: "Remix link coming soon." so the section doesn't look broken.
- Final CTA (line ~424): hide the Remix button; keep "Open the tool".

### 5. `src/pages/Methodology.tsx`

"Remix on Lovable" button at line ~297 — hide when `LOVABLE_REMIX_URL` is null; "Open the tool" stays.

### 6. Type cleanup

Since the constants are now `string | null`, every consumer already uses `&&` truthy gating, so TypeScript narrows correctly inside the conditional. No `!` assertions needed.

## Out of scope

- No copy rewrites or layout changes beyond removing/hiding the CTAs.
- No changes to README, llms.txt, or the broader template-readiness items from the previous plan — those remain open and we'll come back to them once the real URLs land.

## What the user provides later

- Real public Remix URL → set `LOVABLE_REMIX_URL`.
- Real GitHub repo URL (if open-sourcing) → set `GITHUB_URL`.

Setting either constant to a non-empty string re-enables every gated CTA automatically.
