import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import { LOVABLE_REMIX_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", match: (p: string) => p === "/" },
  { to: "/methodology", label: "Methodology", match: (p: string) => p.startsWith("/methodology") },
  { to: "/app", label: "Comparator", match: (p: string) => p.startsWith("/app") },
];

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  const { pathname } = useLocation();
  const onApp = pathname.startsWith("/app");

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4 2xl:px-10">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src="/logo-mark.svg"
            alt="Lovable Stack Architect"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg"
          />
          <div className="min-w-0">
            <span className="block truncate text-base font-semibold leading-tight text-foreground sm:text-lg">
              Lovable Stack Architect
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Community template · not affiliated with Lovable
            </span>
          </div>
        </Link>

        <nav aria-label="Primary" className="order-3 w-full md:order-none md:w-auto">
          <ul className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 text-sm shadow-sm backdrop-blur">
            {NAV_ITEMS.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {children}
          {!onApp && (
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/app">
                <Sparkles className="h-4 w-4" /> Open the tool
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">Use this template</span>
              <span className="sm:hidden">Remix</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
