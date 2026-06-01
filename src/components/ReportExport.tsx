import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink, FileDown, Loader2, Share2, Link2, Check, Copy } from "lucide-react";
import { CRITERIA, RUBRIC, type Architecture } from "@/data/architectures";
import type { Inputs, RankedResult } from "@/lib/scoring";
import { stageFromMau } from "@/lib/scoring";
import { toast } from "sonner";
import { LAST_REVIEWED, SITE_URL, AUTHOR_HANDLE } from "@/lib/constants";
import { track } from "@/lib/analytics";

interface Props {
  inputs: Inputs;
  results: RankedResult[];
  excluded?: { arch: Architecture; reason: string }[];
  shareUrl?: string;
}


const STAGE_LABEL: Record<string, string> = {
  prototype: "Prototype",
  mvp: "MVP",
  growth: "Growth",
  scale: "Scale",
};

function fmtList(xs: string[]): string {
  return xs.length ? xs.join(", ") : "—";
}

// ---------- Markdown ----------
function buildMarkdown({ inputs, results, excluded = [] }: Props): string {
  const top = results[0];
  const stage = stageFromMau(inputs.mau);
  const lines: string[] = [];

  lines.push(`# Stack Architect — Architecture Recommendation`);
  lines.push("");
  lines.push(`> Generated ${new Date().toLocaleString()} · Rubric last reviewed ${LAST_REVIEWED}`);
  lines.push(`> Source: ${SITE_URL} · Maintained by [${AUTHOR_HANDLE}](https://lovable.dev/${AUTHOR_HANDLE}) on lovable.dev · Community template, not affiliated with Lovable`);
  lines.push("");

  if (!top) {
    lines.push("_No architecture met your hard requirements. Loosen the compliance filter to see options._");
    return lines.join("\n");
  }

  // Top pick
  lines.push(`## Top pick: ${top.arch.name}`);
  lines.push(`_${top.arch.tagline}_  — score **${Math.round(top.score)}/100**`);
  lines.push("");
  lines.push(top.arch.description);
  lines.push("");
  lines.push(`**Why this fits your inputs**`);
  top.rationale.forEach((r) => lines.push(`- ${r}`));
  lines.push("");
  if (top.topContributors.length) {
    lines.push(`**Top scoring criteria**`);
    top.topContributors.forEach((c) =>
      lines.push(`- ${c.criterion.label}: ${c.rubricScore}/5`),
    );
    lines.push("");
  }
  lines.push(`**Best for**`);
  top.arch.bestFor.forEach((b) => lines.push(`- ${b}`));
  lines.push("");
  lines.push(`**Watch-outs**`);
  top.arch.watchOuts.forEach((b) => lines.push(`- ${b}`));
  lines.push("");
  lines.push(`### Cost & scaling`);
  lines.push(`- Estimated monthly cost at **${STAGE_LABEL[stage]}** stage: ${top.arch.costBands[stage]}`);
  lines.push(`- Full bands — Prototype ${top.arch.costBands.prototype} · MVP ${top.arch.costBands.mvp} · Growth ${top.arch.costBands.growth} · Scale ${top.arch.costBands.scale}`);
  lines.push(`- Scaling ceiling: ${top.arch.scaleCeiling}`);
  lines.push(`- Cost data last reviewed: ${top.arch.lastReviewed}`);
  if (top.arch.sources.length) {
    lines.push(`- Sources: ${top.arch.sources.map((s) => `[${s.label}](${s.url})`).join(", ")}`);
  }
  lines.push("");

  // Runners-up with rationale
  const runners = results.slice(1, 3);
  if (runners.length) {
    lines.push(`## Runners-up`);
    runners.forEach((r, i) => {
      lines.push(`### #${i + 1} — ${r.arch.name} (score ${Math.round(r.score)}/100)`);
      lines.push(`_${r.arch.tagline}_`);
      r.rationale.slice(0, 3).forEach((x) => lines.push(`- ${x}`));
      lines.push("");
    });
  }

  // Ranked list
  lines.push(`## All ranked options`);
  results.forEach((r, i) => {
    lines.push(`${i + 1}. **${r.arch.name}** — ${Math.round(r.score)}/100 — ${r.arch.tagline}`);
  });
  lines.push("");

  // Excluded
  if (excluded.length) {
    lines.push(`## Excluded by hard requirements`);
    excluded.forEach((e) => lines.push(`- **${e.arch.name}** — ${e.reason}`));
    lines.push("");
  }

  // Matrix
  lines.push(`## Comparison matrix`);
  const header = `| Criterion | ${results.map((r) => r.arch.short).join(" | ")} |`;
  const sep = `| --- | ${results.map(() => "---").join(" | ")} |`;
  lines.push(header);
  lines.push(sep);
  CRITERIA.forEach((c) => {
    lines.push(
      `| ${c.label} | ${results.map((r) => `${RUBRIC[r.arch.id][c.id]}/5`).join(" | ")} |`,
    );
  });
  lines.push("");

  // Inputs
  lines.push(`## Project inputs`);
  lines.push(`- Stage: ${fmtList(inputs.stage)}`);
  lines.push(`- Expected MAU: ${inputs.mau.toLocaleString()}`);
  lines.push(`- Team strengths: ${fmtList(inputs.team)}`);
  lines.push(`- Budget: ${fmtList(inputs.budget)}`);
  lines.push(`- Compliance: ${fmtList(inputs.compliance)}`);
  lines.push(`- Workloads: ${fmtList(inputs.workloads)}`);
  lines.push(`- Lock-in tolerance: ${fmtList(inputs.lockInTolerance)}`);
  lines.push(`- Time-to-market priority: ${inputs.ttmPriority}/5`);
  lines.push("");

  lines.push(`---`);
  lines.push(
    `_Cost bands are curated estimates from vendor pricing pages, not live quotes. Verify before committing. Rubric and bands last reviewed ${LAST_REVIEWED}._`,
  );

  return lines.join("\n");
}

// ---------- Report content (used in preview dialog + print root) ----------
function ReportContent({ inputs, results, excluded = [] }: Props) {
  const top = results[0];
  const stage = stageFromMau(inputs.mau);

  if (!top) {
    return (
      <div className="font-sans text-sm text-foreground">
        No architecture met your hard requirements. Loosen the compliance filter to see options.
      </div>
    );
  }

  return (
    <article className="font-sans text-[13px] leading-relaxed text-foreground">
      <header className="mb-6 border-b border-border pb-4">
        <h1 className="text-2xl font-bold">Stack Architect — Architecture Recommendation</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Generated {new Date().toLocaleString()} · Rubric last reviewed {LAST_REVIEWED}
        </p>
        <p className="text-xs text-muted-foreground">
          Source: {SITE_URL} · Maintained by <a href={`https://lovable.dev/${AUTHOR_HANDLE}`} target="_blank" rel="noopener noreferrer" className="underline">{AUTHOR_HANDLE} on lovable.dev</a> · Community template, not affiliated with Lovable
        </p>
      </header>

      <section className="mb-6">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold">Top pick: {top.arch.name}</h2>
          <span className="font-mono text-sm">{Math.round(top.score)}/100</span>
        </div>
        <p className="italic text-muted-foreground">{top.arch.tagline}</p>
        <p className="mt-2">{top.arch.description}</p>

        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Why this fits your inputs
        </h3>
        <ul className="mt-1 list-disc pl-5">
          {top.rationale.map((r, i) => <li key={i}>{r}</li>)}
        </ul>

        {top.topContributors.length > 0 && (
          <>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Top scoring criteria
            </h3>
            <ul className="mt-1 list-disc pl-5">
              {top.topContributors.map((c) => (
                <li key={c.criterion.id}>
                  {c.criterion.label} — <span className="font-mono">{c.rubricScore}/5</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Best for</h3>
            <ul className="mt-1 list-disc pl-5">
              {top.arch.bestFor.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Watch-outs</h3>
            <ul className="mt-1 list-disc pl-5">
              {top.arch.watchOuts.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cost & scaling</h3>
          <p className="mt-1">
            <strong>{top.arch.costBands[stage]}</strong> / month estimated at {STAGE_LABEL[stage]} scale.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Prototype {top.arch.costBands.prototype} · MVP {top.arch.costBands.mvp} ·{" "}
            Growth {top.arch.costBands.growth} · Scale {top.arch.costBands.scale}
          </p>
          <p className="mt-1 text-xs"><strong>Ceiling:</strong> {top.arch.scaleCeiling}</p>
          <p className="mt-1 text-xs text-muted-foreground">Last reviewed {top.arch.lastReviewed}</p>
          {top.arch.sources.length > 0 && (
            <p className="mt-1 text-xs">
              Sources:{" "}
              {top.arch.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ", "}
                  <a href={s.url} className="text-primary underline">{s.label}</a>
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      {results.slice(1, 3).length > 0 && (
        <section className="mb-6 print-break-before">
          <h2 className="text-lg font-bold">Runners-up</h2>
          {results.slice(1, 3).map((r, i) => (
            <div key={r.arch.id} className="mt-3 rounded-lg border border-border p-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold">#{i + 1} — {r.arch.name}</h3>
                <span className="font-mono text-xs">{Math.round(r.score)}/100</span>
              </div>
              <p className="text-xs italic text-muted-foreground">{r.arch.tagline}</p>
              <ul className="mt-1 list-disc pl-5 text-xs">
                {r.rationale.slice(0, 3).map((x, j) => <li key={j}>{x}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-bold">All ranked options</h2>
        <ol className="mt-2 list-decimal pl-5">
          {results.map((r) => (
            <li key={r.arch.id}>
              <strong>{r.arch.name}</strong> — {Math.round(r.score)}/100 — <span className="text-muted-foreground">{r.arch.tagline}</span>
            </li>
          ))}
        </ol>
      </section>

      {excluded.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold">Excluded by hard requirements</h2>
          <ul className="mt-2 list-disc pl-5">
            {excluded.map((e) => (
              <li key={e.arch.id}>
                <strong>{e.arch.name}</strong> — {e.reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6 print-break-before">
        <h2 className="text-lg font-bold">Comparison matrix</h2>
        <table className="mt-2 w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-border bg-muted/30 px-2 py-1 text-left">Criterion</th>
              {results.map((r) => (
                <th key={r.arch.id} className="border border-border bg-muted/30 px-2 py-1 text-center">{r.arch.short}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.id}>
                <td className="border border-border px-2 py-1">{c.label}</td>
                {results.map((r) => (
                  <td key={r.arch.id} className="border border-border px-2 py-1 text-center font-mono">
                    {RUBRIC[r.arch.id][c.id]}/5
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-bold">Project inputs</h2>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <li><strong>Stage:</strong> {fmtList(inputs.stage)}</li>
          <li><strong>Expected MAU:</strong> {inputs.mau.toLocaleString()}</li>
          <li><strong>Team strengths:</strong> {fmtList(inputs.team)}</li>
          <li><strong>Budget:</strong> {fmtList(inputs.budget)}</li>
          <li><strong>Compliance:</strong> {fmtList(inputs.compliance)}</li>
          <li><strong>Workloads:</strong> {fmtList(inputs.workloads)}</li>
          <li><strong>Lock-in tolerance:</strong> {fmtList(inputs.lockInTolerance)}</li>
          <li><strong>Time-to-market priority:</strong> {inputs.ttmPriority}/5</li>
        </ul>
      </section>

      <footer className="mt-8 border-t border-border pt-3 text-[11px] text-muted-foreground">
        Cost bands are curated estimates from vendor pricing pages, not live quotes. Verify before committing.
        Rubric and bands last reviewed {LAST_REVIEWED}.
      </footer>
    </article>
  );
}


export function ReportExport(props: Props) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pdfSourceRef = useRef<HTMLDivElement | null>(null);
  const shareInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const downloadMd = () => {
    const md = buildMarkdown(props);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stack-architect-${props.results[0]?.arch.short.toLowerCase() ?? "report"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!pdfSourceRef.current || pdfBusy) return;
    setPdfBusy(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const node = pdfSourceRef.current;
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(
        `stack-architect-${props.results[0]?.arch.short.toLowerCase() ?? "report"}.pdf`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate PDF", {
        description: "Try opening the full report and using your browser's Save as PDF.",
      });
    } finally {
      setPdfBusy(false);
    }
  };

  const openFullReport = () => {
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("Pop-up blocked", { description: "Allow pop-ups to open the full report." });
      return;
    }
    const body = renderToStaticMarkup(<ReportContent {...props} />);
    win.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Stack Architect — Full report</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #f5f3ee; color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif; }
  .page { max-width: 860px; margin: 32px auto; padding: 40px; background: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  h1, h2, h3, h4 { color: #0a0a0a; }
  a { color: #6d28d9; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d4d4d8; padding: 6px 8px; font-size: 12px; }
  th { background: #f4f4f5; text-align: left; }
  ul, ol { padding-left: 20px; }
  .text-muted-foreground { color: #6b7280; }
  .italic { font-style: italic; }
  .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .border, .border-border { border-color: #e5e7eb; }
  .bg-muted\\/30 { background: #f9fafb; }
  .rounded-lg { border-radius: 8px; }
  @media print {
    body { background: #ffffff; }
    .page { box-shadow: none; margin: 0; padding: 0; max-width: none; border-radius: 0; }
    .print-break-before { page-break-before: always; }
  }
</style>
</head>
<body>
  <div class="page">${body}</div>
</body>
</html>`);
    win.document.close();
  };

  const copyShareUrl = async () => {
    const url = props.shareUrl ?? window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track("Share link", { top: props.results[0]?.arch.id ?? "none" });
    } catch {
      shareInputRef.current?.select();
      toast.message("Copy not allowed", { description: "Select the URL and copy manually." });
    }
  };

  const actions: {
    id: string;
    label: string;
    description: string;
    icon: typeof Download;
    onClick: () => void;
    busy?: boolean;
    hidden?: boolean;
  }[] = [
    {
      id: "share",
      label: "Copy share link",
      description: "A URL that encodes your exact scenario.",
      icon: Link2,
      hidden: !props.shareUrl,
      onClick: () => {
        setHubOpen(false);
        setShareOpen(true);
      },
    },
    {
      id: "pdf",
      label: "Download PDF",
      description: "Full multi-page report, saved to your device.",
      icon: FileDown,
      busy: pdfBusy,
      onClick: () => {
        downloadPdf();
      },
    },
    {
      id: "markdown",
      label: "Download Markdown",
      description: "Editable .md for docs, PRs, or notes.",
      icon: Download,
      onClick: () => {
        downloadMd();
        setHubOpen(false);
      },
    },
    {
      id: "preview",
      label: "View full report",
      description: "Open the complete report in a new tab.",
      icon: ExternalLink,
      onClick: () => {
        setHubOpen(false);
        openFullReport();
      },
    },
  ];

  return (
    <>
      <div className="no-print">
        <Button
          onClick={() => setHubOpen(true)}
          variant="outline"
          size="sm"
          aria-label="Export & share"
          className="h-9 w-9 p-0 gap-0 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Export &amp; share</span>
        </Button>
      </div>

      <Dialog open={hubOpen} onOpenChange={setHubOpen}>
        <DialogContent className="no-print max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Export &amp; share</DialogTitle>
            <DialogDescription>
              Take this recommendation with you, or send it to a teammate.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {actions
              .filter((a) => !a.hidden)
              .map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={a.onClick}
                    disabled={a.busy}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      {a.busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">{a.label}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {a.description}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="no-print max-w-lg">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone with this link sees your exact scenario.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input
              ref={shareInputRef}
              readOnly
              value={props.shareUrl ?? ""}
              onFocus={(e) => e.currentTarget.select()}
              className="font-mono text-xs"
            />
            <Button onClick={copyShareUrl} className="gap-1.5 shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Always-mounted, screen-hidden, print-visible report. */}
      {typeof document !== "undefined" &&
        createPortal(
          <div id="print-root" aria-hidden="true" className="hidden print:block">
            <div style={{ width: "100%", padding: "0", color: "#0a0a0a" }}>
              <ReportContent {...props} />
            </div>
          </div>,
          document.body,
        )}

      {/* Offscreen render source for html2canvas PDF export. White bg, fixed width. */}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            aria-hidden="true"
            className="no-print"
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: "800px",
              background: "#ffffff",
              color: "#0a0a0a",
              pointerEvents: "none",
            }}
          >
            <div ref={pdfSourceRef} style={{ padding: "32px", background: "#ffffff" }}>
              <ReportContent {...props} />
            </div>
          </div>,
          document.body,
        )}

    </>
  );
}


export { buildMarkdown };
