import { Link } from "react-router-dom";
import { GITHUB_URL, LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-background/60">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3 px-3 py-6 text-xs text-muted-foreground sm:px-6 2xl:px-10">
        <p>
          Last reviewed {LAST_REVIEWED} · MIT License
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link to="/app" className="hover:text-foreground">Open the tool</Link>
          <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Use this template
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Built with Lovable
          </a>
        </nav>
      </div>
    </footer>
  );
}
