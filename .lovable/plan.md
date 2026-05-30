## Goal

Make it visually clear that `@brettadler` is a Lovable profile (lovable.dev URL) wherever the handle appears, so visitors trust the link before they click.

## Changes

### 1. `src/components/SiteFooter.tsx` (line ~36)
Change displayed link text from `{AUTHOR_HANDLE}` to `{AUTHOR_HANDLE} on lovable.dev` so the trust signal is visible without hovering. `href` already points to `AUTHOR_URL`.

### 2. `src/pages/Landing.tsx`
- **Hero byline (~line 121):** same change — show `@brettadler on lovable.dev` as the link text.
- **Built-by line (~line 475–487):** same change.
- **FAQ "Is this an official Lovable product?" answer (line 61):** the answer is currently a plain string rendered inside `AccordionContent`. Convert this single FAQ item so its `a` field can be either a string or a JSX node, and render the @brettadler mention as an inline link to `AUTHOR_URL` with visible "on lovable.dev" suffix. Minimal type change: `a: string | React.ReactNode` and render directly inside `AccordionContent`.

### 3. `src/components/ReportExport.tsx` (Markdown + PDF footer, lines 46 & 166)
Append the profile URL alongside the handle so exported reports also carry the trust signal: `Maintained by @brettadler (https://lovable.dev/@brettadler)` in Markdown, and a real `<a>` in the PDF/HTML footer.

### 4. `public/llms.txt` (line 5)
Append the URL after the handle: `by @brettadler (https://lovable.dev/@brettadler)`.

## Out of scope

- `AUTHOR_URL` constant — already correct.
- No new components, no styling overhauls; reuse existing dotted-underline link styles.
