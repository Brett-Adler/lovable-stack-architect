# Plan: Make Inputs the Default Mobile Tab

## What we will change
In `src/pages/Index.tsx`, change the initial state of the `mobileTab` hook from `"recommendation"` to `"inputs"`.

## Why
Currently, when a user first loads the app on mobile (or any narrow viewport), they land on the "Pick" (recommendation) tab. The user wants new visitors to start on the "Inputs" tab so they see the controls first and understand how to tune the comparator before viewing results.

## Technical detail
Line 88 in `src/pages/Index.tsx`:
- **Current:** `const [mobileTab, setMobileTab] = useState<...>("recommendation");`
- **New:** `const [mobileTab, setMobileTab] = useState<...>("inputs");`

This only affects the mobile tab switcher (hidden on `md` and up). Desktop layout is unchanged.