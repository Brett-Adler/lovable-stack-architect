// Single source of truth for template-launch links and freshness date.
// Set LOVABLE_REMIX_URL / GITHUB_URL to real URLs when ready — every CTA stays hidden until then.
// TODO(post-publish): paste the public Remix link from Lovable's Share panel, then republish.
// All "Use this template" / "Remix" CTAs light up automatically once this is set.
export const LOVABLE_REMIX_URL: string | null = null;
export const GITHUB_URL: string | null = "https://github.com/Brett-Adler/lovable-stack-architect";
export const LAST_REVIEWED = "May 2026";
export const SITE_URL = "https://lovable-stack-architect.lovable.app";
export const AUTHOR_HANDLE = "@brettadler";
export const AUTHOR_URL = "https://lovable.dev/@brettadler";
// Email used by the in-app feedback dialog (mailto:). Set to null to hide the feedback button.
export const AUTHOR_EMAIL: string | null = "brett.adler@hey.com";
// Optional: external link shown in the feedback dialog (Figma, portfolio, etc.).
export const AUTHOR_PORTFOLIO_URL: string | null = "https://www.figma.com/@brettadler";
export const IS_OFFICIAL = false;
// Optional privacy-friendly analytics. Set to your Plausible domain
// (e.g. "lovable-stack-architect.lovable.app") to enable. Leave null to disable.
export const PLAUSIBLE_DOMAIN: string | null = null;
