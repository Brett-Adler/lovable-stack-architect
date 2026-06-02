## Plan: Relocate "Use this template" CTA

### Problem
The "Use this template" button in the header adds visual clutter and competes with primary navigation on smaller screens.

### Changes
1. **Remove from `SiteHeader.tsx`**
   - Delete the `<Button>` CTA (lines 59–67).
   - Remove unused imports: `Button`, `ExternalLink`, `LOVABLE_REMIX_URL`.

2. **Promote in `SiteFooter.tsx`**
   - Replace the plain text "Use this template" link with a pill-style button (rounded, border, subtle background) that includes an icon.
   - Add `ExternalLink` import.

### Result
- Cleaner header with more breathing room.
- Template CTA still discoverable at the bottom of every page, styled more prominently than before.