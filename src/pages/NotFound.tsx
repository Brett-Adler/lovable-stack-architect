import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-background">
      <SeoHead
        title="Page not found — Lovable Stack Architect"
        description="That page doesn't exist. Head back to the Lovable Stack Architect home or open the backend comparator tool."
        path={location.pathname}
      />
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          404
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
          The page <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{location.pathname}</code> doesn't exist. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="gap-2 rounded-full px-6">
            <Link to="/">
              <Home className="h-4 w-4" /> Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 rounded-full border-border bg-card px-6">
            <Link to="/app">
              Open the tool <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
