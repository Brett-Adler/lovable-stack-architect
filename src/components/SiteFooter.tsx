import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { AUTHOR_HANDLE, AUTHOR_URL, GITHUB_URL, LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";
import { FeedbackDialog } from "@/components/FeedbackDialog";

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
              <a
                href={LOVABLE_REMIX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Use this template
              </a>
            )}
            {GITHUB_URL && (
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                GitHub
              </a>
            )}
            <FeedbackDialog
              trigger={
                <button type="button" className="hover:text-foreground">
                  Feedback / hire me
                </button>
              }
            />
            <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
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
            {AUTHOR_HANDLE}
          </a>
          . Not affiliated with, endorsed by, or representing Lovable. "Lovable" and the Lovable brand belong to Lovable.
        </p>
      </div>
    </footer>
  );
}
