# Template setup checklist

Everything you need to rebrand this template after remixing. Work top-to-bottom; should take 15–30 minutes.

## 1. Author & site identity

**`src/lib/constants.ts`**

- `AUTHOR_HANDLE` — shown in header subtitle, footer, hero, FAQ, About tile.
- `AUTHOR_URL` — linked from every author reference.
- `AUTHOR_EMAIL` — used by the in-app Feedback dialog (`mailto:`). Set to `null` to hide the feedback button.
- `AUTHOR_PORTFOLIO_URL` — optional extra link shown inside the feedback dialog (Figma, portfolio, etc.). `null` hides it.
- `AUTHOR_URL` — linked from every author reference.
- `SITE_URL` — used by `SeoHead` for canonical and OG URLs.
- `LAST_REVIEWED` — bump when you re-review the rubric.
- `LOVABLE_REMIX_URL` — `null` hides every "Use this template / Remix" CTA. Set to your project's public Remix URL to enable.
- `GITHUB_URL` — `null` hides the footer GitHub link. Set to your repo URL to enable.
- `IS_OFFICIAL` — keep `false` unless you actually represent the platform you're comparing.
- `PLAUSIBLE_DOMAIN` — optional. Set to your Plausible domain to enable privacy-friendly analytics (loads `plausible.io/js/script.js`). Leave `null` to disable.

## 2. HTML head

**`index.html`** — replace every occurrence of:

- `<title>` and `<meta name="description">`
- `<meta name="application-name">`, `<meta name="apple-mobile-web-app-title">`
- `<link rel="canonical">`
- All `og:*` tags (title, description, url, image, site_name, image:alt)
- All `twitter:*` tags
- Both `application/ld+json` blocks (`WebSite` and `SoftwareApplication` name/url/description)

## 3. Public assets (`public/`)

- `logo.svg`, `logo-mark.svg` — your wordmark and icon mark.
- `favicon.ico`, `favicon-16.png` → `favicon-512.png` — generate from your mark.
- `apple-touch-icon.png` (180×180)
- `android-chrome-192.png`, `android-chrome-512.png`, `maskable-512.png`
- `mstile-150.png`, `mstile-310.png`
- `og-image.png` (1200×630) and `og-image.svg`
- `site.webmanifest` — name, short_name, description, background_color, theme_color
- `browserconfig.xml` — TileColor
- `sitemap.xml` — replace the domain in every `<loc>`
- `robots.txt` — update the `Sitemap:` directive
- `llms.txt` — name, description, author attribution

## 4. Copy

- **`src/pages/Landing.tsx`** — `FAQ` array, hero copy, "About the builder" tile, feature copy.
- **`src/pages/Methodology.tsx`** — `BIASES` array, intro copy.
- **`src/components/SiteHeader.tsx`** — wordmark text and subtitle.
- **`src/components/SiteFooter.tsx`** — disclosure line if you're remixing for a different domain.
- **`README.md`** — replace this whole file with your own.

## 5. Theme (optional)

- `src/index.css` — CSS custom properties (`--primary`, `--background`, gradient stops, etc.)
- `tailwind.config.ts` — brand color tokens (`brand-blue`, `brand-magenta`, `brand-orange`)

## 6. Sanity check before sharing

- `npm run build` — clean build with no warnings.
- `npm test` — passes.
- Click every nav link and CTA in the preview; no 404s.
- View source on `/` and confirm head tags match your brand, not the template's.
- Test OG preview at <https://www.opengraph.xyz/> with your deployed URL.
