import { useState } from "react";
import { Mail, ExternalLink, MessageSquare, Bug, Briefcase, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AUTHOR_EMAIL, AUTHOR_HANDLE, AUTHOR_URL, AUTHOR_PORTFOLIO_URL } from "@/lib/constants";

type Intent = "issue" | "hire" | "hello";

const INTENTS: { id: Intent; label: string; sub: string; icon: typeof Bug; subject: string }[] = [
  { id: "issue", label: "Something's wrong or missing", sub: "Bad score, broken link, stale data", icon: Bug, subject: "Stack Architect — feedback" },
  { id: "hire", label: "I'd like to hire you", sub: "Lovable, freelance, or full-time", icon: Briefcase, subject: "Stack Architect — opportunity" },
  { id: "hello", label: "Just saying hi", sub: "Or anything else", icon: Hand, subject: "Stack Architect — hello" },
];

interface Props {
  trigger?: React.ReactNode;
  className?: string;
}

export function FeedbackDialog({ trigger, className }: Props) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("issue");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (!AUTHOR_EMAIL) return null;

  const selected = INTENTS.find((i) => i.id === intent)!;

  const buildMailto = () => {
    const subject = selected.subject;
    const lines = [
      message.trim() || "(write your message here)",
      "",
      "—",
      name && `From: ${name}`,
      email && `Reply-to: ${email}`,
      `Sent from: ${typeof window !== "undefined" ? window.location.href : "Stack Architect"}`,
    ].filter(Boolean) as string[];
    const body = lines.join("\n");
    return `mailto:${AUTHOR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className={cn("gap-1.5", className)}>
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get in touch</DialogTitle>
          <DialogDescription>
            Send a note directly to{" "}
            <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-foreground">
              {AUTHOR_HANDLE}
            </a>
            . Opens your email client.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What's this about?</Label>
            <div className="grid gap-2">
              {INTENTS.map((i) => {
                const Icon = i.icon;
                const active = intent === i.id;
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setIntent(i.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-foreground" : "text-muted-foreground")} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{i.label}</div>
                      <div className="text-xs text-muted-foreground">{i.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fb-name" className="text-xs">Name (optional)</Label>
              <Input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fb-email" className="text-xs">Email (optional)</Label>
              <Input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-message" className="text-xs">Message</Label>
            <Textarea
              id="fb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                intent === "issue"
                  ? "What did you see, and what did you expect?"
                  : intent === "hire"
                  ? "A line about the role or project."
                  : "Say anything."
              }
              rows={4}
            />
          </div>

          {AUTHOR_PORTFOLIO_URL && (
            <p className="text-xs text-muted-foreground">
              Or find me on{" "}
              <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-foreground">
                lovable.dev
              </a>
              {" / "}
              <a href={AUTHOR_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-foreground">
                figma
              </a>
              .
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button asChild className="gap-1.5">
            <a href={buildMailto()} onClick={() => setOpen(false)}>
              <Mail className="h-4 w-4" />
              Open in email
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
