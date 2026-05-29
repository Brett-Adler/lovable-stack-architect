## Goal

Close the remaining gaps so the project is share-ready as a community Lovable template. Remix/GitHub URLs are intentionally pending and out of scope.

## Issues found

### 1. Leftover "Lovable-authored" copy (contradicts the new positioning)

Three places still claim the tool is Lovable-authored — directly contradicts the header/footer/FAQ disclosures:

- **`README.md` line 43**: "This tool is Lovable-authored and lives on a Lovable-hosted site, so it has a perspective. We try to be transparent…" → rewrite as community-template, first-person ("I").
- **`src/pages/Methodology.tsx` lines 43–44** (`BIASES[0]`): title `"Lovable-authored"` and body "This tool is built by a Lovable user… reflects Lovable's perspective… still our judgement." → retitle to "Built by a Lovable fan" and rewrite to match the unaffiliated framing.
- **`src/lib/scoring.ts` line 52** (inline comment): "(the tool is Lovable-authored)" → "(the tool is built by a Lovable fan)".

### 2. `NotFound.tsx` is a dead end

The 404 page has no `SiteHeader` / `SiteFooter`, so users who hit a bad URL lose all nav and the unaffiliated disclosure. Wrap it in the same shell as the other pages and link to `/` and `/app`.

### 3. README template-customization section is stale

Step 3 ("Rebrand") still lists `LOVABLE_REMIX_URL` and `GITHUB_URL` as plain strings; they are now `string | null`. Also doesn't mention `AUTHOR_HANDLE` / `AUTHOR_URL` / `IS_OFFICIAL`. Anyone remixing will accidentally ship "@brettadler" attribution and "not affiliated with Lovable" copy aimed at the original author.

- Update step 3 to list every constant in `src/lib/constants.ts`, what each does, and which ones a remixer MUST change before sharing (author handle/URL, last reviewed, site URL).
- Add a one-line note: "Set `LOVABLE_REMIX_URL` and `GITHUB_URL` to enable the Remix and GitHub CTAs — they stay hidden while `null`."

### 4. llms.txt missing the disclosure

Add one line near the top: "Independent, community-built template by @brettadler — not affiliated with, endorsed by, or representing Lovable."

### 5. SEO / sitemap baked-in domain

`sitemap.xml`, `robots.txt` (Sitemap directive), `index.html` canonical/og:url, and `SITE_URL` all hard-code `https://lovable-stack-architect.lovable.app`. That's correct for the current deploy but wrong the moment anyone remixes.

- Add a `TEMPLATE-SETUP.md` (short, ~30 lines) that lists every spot a remixer must rebrand: `constants.ts`, `index.html` (title, description, OG/Twitter, JSON-LD, canonical), `public/sitemap.xml`, `public/robots.txt`, `public/site.webmanifest`, `public/llms.txt`, `public/logo.svg` + `logo-mark.svg`, favicons, `og-image.png`. Link to it from the top of README.

### 6. Manifest icons referenced but should be verified

`site.webmanifest` lists `/android-chrome-192.png`, `/android-chrome-512.png`, `/maskable-512.png` — all confirmed present. No action.

### 7. README screenshots likely stale

`docs/screenshots/landing-hero.png` and friends were captured before the header copy changed to "Community template · not affiliated with Lovable" and before CTAs were hidden. Flag only — re-capture is nice-to-have, not blocking.

### 8. Placeholder test file

`src/test/example.test.ts` — confirm it isn't an empty/placeholder test that fails or looks unprofessional to remixers. If it's just a smoke test, leave it; if it's a stub, either flesh out one real test of `rank()` or delete.

## Out of scope

- Setting the actual `LOVABLE_REMIX_URL` / `GITHUB_URL` (user is providing later).
- Re-capturing screenshots.
- Changes to scoring logic, rubric, presets, or `/app` UI.
- Regenerating `og-image.png` unless the current one implies official Lovable branding (will check during implementation; if it does, regenerate; if not, leave).

## Order of work

1. Fix the three "Lovable-authored" strings.
2. Wrap `NotFound` with header/footer.
3. Update llms.txt with the disclosure line.
4. Rewrite README step 3 + add `TEMPLATE-SETUP.md`.
5. Spot-check `og-image.png` and `example.test.ts`; act only if broken.
