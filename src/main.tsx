import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// When a new deploy invalidates the chunks of an already-loaded tab, dynamic
// imports throw "Importing a module script failed". Force a one-time reload so
// the user picks up the fresh bundle instead of seeing a blank screen.
if (typeof window !== "undefined") {
  const RELOAD_KEY = "__chunk_reload_at";
  const handleStaleChunk = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err ?? "");
    if (!/Importing a module script failed|Failed to fetch dynamically imported module|Loading chunk \d+ failed/i.test(msg)) {
      return;
    }
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < 10_000) return; // avoid reload loops
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    window.location.reload();
  };
  window.addEventListener("vite:preloadError", (e) => handleStaleChunk((e as unknown as { payload?: unknown }).payload));
  window.addEventListener("error", (e) => handleStaleChunk(e.message));
  window.addEventListener("unhandledrejection", (e) => handleStaleChunk(e.reason));
}

createRoot(document.getElementById("root")!).render(<App />);
