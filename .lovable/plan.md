## Change

In `src/pages/Landing.tsx` (line 162), reduce the base (mobile) font size on the hero `<h1>`:

- Current: `text-5xl font-extrabold ... sm:text-6xl md:text-7xl`
- New: `text-[2.5rem] font-extrabold ... sm:text-6xl md:text-7xl`

This drops the mobile size from 48px to 40px so "your Lovable" and "backend for" wrap more naturally on 320–390px viewports. `sm:` and `md:` sizes are unchanged, so tablet/desktop look identical.