import { useState, type ReactNode } from "react";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * Small "Expand" button that opens a near-full-screen dialog containing
 * a larger rendition of the card's content. The trigger is rendered inline;
 * `children` is the content shown in the expanded dialog.
 */
export function FullscreenCardDialog({
  title,
  ariaLabel,
  children,
  maxWidthClass = "max-w-[1100px]",
}: {
  title: string;
  ariaLabel: string;
  children: ReactNode;
  maxWidthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className={`max-h-[92vh] w-[95vw] overflow-y-auto ${maxWidthClass}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
