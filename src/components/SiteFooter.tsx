import { Link } from "react-router-dom";
import { AUTHOR_HANDLE, AUTHOR_URL, GITHUB_URL, LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-background/60">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-3 py-6 text-xs text-muted-foreground sm:px-6 2xl:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>Last reviewed {LAST_REVIEWED} · MIT License</p>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/app" className="hover:text-foreground">Open the tool</Link>
            <Link to="/methodology" className="hover:text-foreground">Methodology</Link>
            {LOVABLE_REMIX_URL && (
              <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                Use this template
              </a>
            )}
            {GITHUB_URL && (
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                GitHub
              </a>
            )}
            <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Built with Lovable
            </a>
          </nav>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground/80">
          An independent, community-built template by{" "}
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            {AUTHOR_HANDLE} on lovable.dev
          </a>
          {" "}— open to joining the{" "}
          <span className="inline-flex items-center gap-1 align-baseline">
            <img src="/logo-mark.svg" alt="" className="inline-block h-3 w-3 rounded-sm" />
            <span className="font-medium text-foreground/80">Lovable</span>
          </span>
          {" "}team. Not affiliated with, endorsed by, or representing Lovable.
          "Lovable" and the Lovable brand belong to Lovable.
        </p>
      </div>
    </footer>
  );
}
