// Lightweight analytics wrapper. No-op unless PLAUSIBLE_DOMAIN is set in constants.ts.
// Loads Plausible's script once and exposes a tiny `track()` for custom events.
import { PLAUSIBLE_DOMAIN } from "./constants";

declare global {
  interface Window {
    plausible?: (
      event: string,
      opts?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

let injected = false;

export function initAnalytics() {
  if (injected || typeof window === "undefined" || !PLAUSIBLE_DOMAIN) return;
  injected = true;
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = PLAUSIBLE_DOMAIN;
  s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}

export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || !PLAUSIBLE_DOMAIN) return;
  window.plausible?.(event, props ? { props } : undefined);
}
