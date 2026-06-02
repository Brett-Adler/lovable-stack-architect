import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", match: (p: string) => p === "/" },
  { to: "/methodology", label: "Methodology", match: (p: string) => p.startsWith("/methodology") },
  { to: "/app", label: "Comparator", match: (p: string) => p.startsWith("/app") },
  
];

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-12 max-w-[1800px] items-center justify-between gap-2 px-3 sm:h-14 sm:gap-3 sm:px-6 2xl:px-10">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2">
          <img
            src="/logo-mark.svg"
            alt="Lovable Stack Architect"
            width={32}
            height={32}
            className="h-7 w-7 shrink-0 rounded-lg sm:h-8 sm:w-8"
          />
          <span className="hidden truncate text-sm font-semibold leading-tight text-foreground sm:inline sm:text-base">
            Lovable Stack Architect
          </span>
        </Link>

        <nav aria-label="Primary" className="min-w-0">
          <ul className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 text-sm shadow-sm backdrop-blur">
            {NAV_ITEMS.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.to} className="min-w-0">
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-sm",
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

        <div className="flex shrink-0 items-center gap-2">
          {children}
        </div>
      </div>
    </header>
  );
}
