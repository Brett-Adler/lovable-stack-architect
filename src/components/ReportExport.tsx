import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye, Printer, FileDown, FileText, Loader2 } from "lucide-react";
import { CRITERIA, RUBRIC, type Architecture } from "@/data/architectures";
import type { Inputs, RankedResult } from "@/lib/scoring";
import { stageFromMau } from "@/lib/scoring";
import { toast } from "sonner";
import { LAST_REVIEWED, SITE_URL, AUTHOR_HANDLE } from "@/lib/constants";

interface Props {
  inputs: Inputs;
  results: RankedResult[];
  excluded?: { arch: Architecture; reason: string }[];
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
  lines.push(`> Source: ${SITE_URL} · Maintained by ${AUTHOR_HANDLE} · Community template, not affiliated with Lovable`);
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
          Source: {SITE_URL} · Maintained by {AUTHOR_HANDLE} · Community template, not affiliated with Lovable
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
  const [open, setOpen] = useState(false);

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

  const printNow = () => {
    // Defer to after the dialog has rendered the print-root content.
    setTimeout(() => window.print(), 50);
  };

  return (
    <>
      <div className="no-print flex flex-wrap gap-2">
        <Button onClick={downloadMd} variant="outline" size="sm" className="gap-1.5">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Markdown</span>
        </Button>
        <Button onClick={() => setOpen(true)} variant="outline" size="sm" className="gap-1.5">
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Preview / Print</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="no-print max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report preview</DialogTitle>
            <DialogDescription>
              This is what your printed or saved-as-PDF report will look like.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-card p-6">
            <ReportContent {...props} />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            <Button onClick={printNow} className="gap-1.5">
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Always-mounted, screen-hidden, print-visible report. */}
      {typeof document !== "undefined" &&
        createPortal(
          <div id="print-root" aria-hidden="true" className="hidden print:block">
            <div className="p-8">
              <ReportContent {...props} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export { buildMarkdown };
