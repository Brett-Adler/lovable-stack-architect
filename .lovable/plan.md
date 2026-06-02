## Fix

In `src/pages/Index.tsx`, the Setup panel keeps `grid` classes when inactive, and `grid`/`block` override the `hidden` class. Apply layout classes only when the tab is active; otherwise use `hidden` alone.

### Setup panel wrapper

```tsx
<div
  id="panel-setup"
  role="tabpanel"
  aria-labelledby="tab-setup"
  hidden={tab !== "setup"}
  className={
    tab === "setup"
      ? "grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)] xl:gap-12"
      : "hidden"
  }
>
```

### Recommendation panel wrapper

```tsx
<div
  id="panel-recommendation"
  role="tabpanel"
  aria-labelledby="tab-recommendation"
  hidden={tab !== "recommendation"}
  className={tab === "recommendation" ? undefined : "hidden"}
>
```

### Full comparison matrix section

Drop `block` from the className; rely on `hidden` when `tab !== "setup"`:

```tsx
<section
  aria-labelledby="full-matrix-heading"
  hidden={tab !== "setup"}
  className={cn(
    "mx-auto w-full max-w-[1800px] px-3 pb-6 sm:px-6 2xl:px-10",
    "mt-4 border-t border-border pt-8 sm:mt-8 sm:pt-10",
    tab !== "setup" && "hidden",
  )}
>
```

## Out of scope

No changes to other components or behavior.
