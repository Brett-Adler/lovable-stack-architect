# Plan: Add help popovers to project inputs

Add a small info icon next to each project-input group label that opens a popover explaining what each option means. Focus on groups with jargon; skip the obvious ones.

## Scope

Add help popovers to these groups in `src/components/InputsPanel.tsx`:

- **Stage** — Prototype, MVP, Growth, Scale (one-liner each)
- **Team strengths** — Frontend, Backend, DevOps, Data, Non-technical
- **Lock-in tolerance** — Low / Medium / High (what "portable" means in practice)
- **Compliance** — GDPR, HIPAA, SOC 2, Data residency, None
- **Workloads** — CRUD, Realtime, Files/media, AI inference, Background jobs, Heavy compute/GPU
- **Time-to-market priority** — what the 1–5 scale boosts

Skip (already self-explanatory from existing helper text or label):
- **Expected monthly active users** — already explained
- **Budget** — bands already labeled with $ amounts

## UX

- Reuse the existing shadcn `Popover` primitive (already in project).
- Trigger: a small `HelpCircle` (lucide) icon button, `h-5 w-5`, ghost styling, sitting inline next to the group `Label`.
- `aria-label="What do these options mean?"` on the trigger; popover content uses `role="dialog"`.
- Popover body: a tight `<dl>` (term/definition list) with each option name in `font-medium` and a one-line description in `text-muted-foreground`. Width ~ `w-72`, `text-xs` content.
- Keyboard accessible by default via Radix Popover; closes on Esc / outside click.
- No changes to scoring, inputs state, or layout flow — purely additive presentation.

## Implementation notes (technical)

- Introduce a small local `FieldHelp` component inside `InputsPanel.tsx` that takes `{ title, items: { label, description }[] }` and renders the trigger + popover.
- Wrap each target `<Label>` in a `flex items-center gap-1.5` row with the `FieldHelp` trigger.
- Copy lives in a typed const map at the top of the file so it's easy to edit later.
- No new dependencies; `Popover` and `lucide-react` are already used in the project.
