import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Loader2, Share2, Link2, Check } from "lucide-react";
import { CRITERIA, RUBRIC, CATEGORIES, type Architecture } from "@/data/architectures";
import type { Inputs, RankedResult } from "@/lib/scoring";
import { stageFromMau, tradeoffVs } from "@/lib/scoring";
import { toast } from "sonner";
import { LAST_REVIEWED, SITE_URL, AUTHOR_HANDLE } from "@/lib/constants";
import { track } from "@/lib/analytics";
import {
  STAGE_LABEL,
  TEAM_LABEL,
  COMPLIANCE_LABEL,
  WORKLOAD_LABEL,
  BUDGET_LABEL,
  LOCKIN_LABEL,
  STAGE_DESCRIPTION,
  TEAM_DESCRIPTION,
  COMPLIANCE_DESCRIPTION,
  WORKLOAD_DESCRIPTION,
  LOCKIN_DESCRIPTION,
} from "@/lib/inputLabels";

interface Props {
  inputs: Inputs;
  results: RankedResult[];
  excluded?: { arch: Architecture; reason: string }[];
  userExcluded?: { arch: Architecture; reason: string }[];
  shareUrl?: string;
}

// ---------- Inline color palette (so html2canvas doesn't drop CSS-var classes) ----------
const C = {
  text: "#0a0a0a",
  muted: "#6b7280",
  mutedBg: "#f9fafb",
  border: "#e5e7eb",
  primary: "#2563eb",
  primarySoft: "#eff6ff",
  warn: "#92400e",
  warnBg: "#fef3c7",
  warnBorder: "#fcd34d",
  accentBar: "linear-gradient(90deg, #2563eb, #db2777, #f97316)",
};

const PAGE_WIDTH_PX = 820; // A4 portrait @ ~96dpi target render width

function fmtList(xs: string[]): string {
  return xs.length ? xs.join(", ") : "—";
}

function mapLabels<K extends string>(xs: K[], dict: Record<K, string>): string[] {
  return xs.map((k) => dict[k] ?? k);
}

function applyNonTechFilter(results: RankedResult[], inputs: Inputs) {
  const isNonTech =
    inputs.team.length === 0 || (inputs.team.length === 1 && inputs.team[0] === "none");
  if (!isNonTech || results.length === 0) return results;
  const top = results[0];
  const rest = results.slice(1).filter((r) => r.arch.nativeIntegration);
  return [top, ...rest];
}

// ---------- Markdown ----------
function buildMarkdown({ inputs, results: rawResults, excluded = [], userExcluded = [] }: Props): string {
  const results = applyNonTechFilter(rawResults, inputs);
  const top = results[0];
  const stage = stageFromMau(inputs.mau);
  const lines: string[] = [];

  lines.push(`# Stack Architect — Architecture Recommendation`);
  lines.push("");
  lines.push(`> Generated ${new Date().toLocaleString()} · Rubric last reviewed ${LAST_REVIEWED}`);
  lines.push(
    `> Source: ${SITE_URL} · Maintained by [${AUTHOR_HANDLE}](https://lovable.dev/${AUTHOR_HANDLE}) on lovable.dev · Community template, not affiliated with Lovable`,
  );
  lines.push("");

  if (!top) {
    lines.push(
      "_No architecture met your hard requirements. Loosen the compliance filter to see options._",
    );
    return lines.join("\n");
  }

  const category = CATEGORIES.find((c) => c.id === top.arch.category);

  // Top pick
  lines.push(`## Top pick: ${top.arch.name}`);
  if (category) lines.push(`_Category: ${category.label} — ${category.description}_`);
  lines.push(`_${top.arch.tagline}_  — score **${Math.round(top.score)}/100**`);
  lines.push("");
  lines.push(top.arch.description);
  lines.push("");
  lines.push(`**Why this fits your inputs**`);
  top.rationale.forEach((r) => lines.push(`- ${r}`));
  lines.push("");
  if (top.topContributors.length) {
    lines.push(`**Top scoring criteria**`);
    top.topContributors.forEach((c) => lines.push(`- ${c.criterion.label}: ${c.rubricScore}/5`));
    lines.push("");
  }

  const runner = results[1];
  if (runner) {
    const t = tradeoffVs(top, runner, inputs);
    if (t) {
      lines.push(
        `**Trade-off vs ${runner.arch.short}:** you gain ${t.topWins.label.toLowerCase()} and give up some ${t.runnerWins.label.toLowerCase()}.`,
      );
      lines.push("");
    }
  }

  lines.push(`**Best for**`);
  top.arch.bestFor.forEach((b) => lines.push(`- ${b}`));
  lines.push("");
  lines.push(`**Watch-outs**`);
  top.arch.watchOuts.forEach((b) => lines.push(`- ${b}`));
  lines.push("");
  lines.push(`### Cost & scaling`);
  lines.push(
    `- Estimated monthly cost at **${STAGE_LABEL[stage]}** stage (${inputs.mau.toLocaleString()} MAU): ${top.arch.costBands[stage]}`,
  );
  lines.push(
    `- Full bands — Prototype ${top.arch.costBands.prototype} · MVP ${top.arch.costBands.mvp} · Growth ${top.arch.costBands.growth} · Scale ${top.arch.costBands.scale}`,
  );
  lines.push(`- Scaling ceiling: ${top.arch.scaleCeiling}`);
  lines.push(`- Cost data last reviewed: ${top.arch.lastReviewed}`);
  if (top.arch.sources.length) {
    lines.push(`- Sources: ${top.arch.sources.map((s) => `[${s.label}](${s.url})`).join(", ")}`);
  }
  lines.push("");

  // Runners-up
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

  if (excluded.length) {
    lines.push(`## Excluded by hard requirements`);
    excluded.forEach((e) => lines.push(`- **${e.arch.name}** — ${e.reason}`));
    lines.push("");
  }

  if (userExcluded.length) {
    lines.push(`## Removed by your platform filter`);
    lines.push(
      `_You chose to leave these out of this comparison. Re-enable them in the app's "Platforms to consider" picker to score them._`,
    );
    userExcluded.forEach((e) => lines.push(`- **${e.arch.name}** — ${e.arch.tagline}`));
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

  // Inputs (with labels)
  lines.push(`## Project inputs`);
  lines.push(`- Stage: ${fmtList(mapLabels(inputs.stage, STAGE_LABEL))}`);
  lines.push(`- Expected MAU: ${inputs.mau.toLocaleString()}`);
  lines.push(`- Team strengths: ${fmtList(mapLabels(inputs.team, TEAM_LABEL))}`);
  lines.push(`- Budget: ${fmtList(mapLabels(inputs.budget, BUDGET_LABEL))}`);
  lines.push(`- Compliance: ${fmtList(mapLabels(inputs.compliance, COMPLIANCE_LABEL))}`);
  lines.push(`- Workloads: ${fmtList(mapLabels(inputs.workloads, WORKLOAD_LABEL))}`);
  lines.push(`- Lock-in tolerance: ${fmtList(mapLabels(inputs.lockInTolerance, LOCKIN_LABEL))}`);
  lines.push(`- Time-to-market priority: ${inputs.ttmPriority}/5`);
  lines.push(`- Hybrid stacks: ${inputs.allowSplit ? "Included (split frontend hosting)" : "Not included"}`);
  lines.push("");


  // Methodology
  lines.push(`## Methodology`);
  lines.push(
    `Every criterion starts at a baseline weight of 1.0, then your inputs nudge the weights up or down (e.g. "low budget" pushes cost-at-small-scale higher). Each architecture is scored 0–5 per criterion using a fixed rubric, multiplied by the derived weight, and normalized to a 0–100 score. Strict compliance options (HIPAA, SOC 2, data residency) act as hard filters and remove options below a coverage threshold.`,
  );
  lines.push("");
  lines.push(`### Criteria glossary`);
  CRITERIA.forEach((c) => lines.push(`- **${c.label}** — ${c.hint}`));
  lines.push("");

  lines.push(`---`);
  lines.push(
    `_Cost bands are curated estimates from vendor pricing pages, not live quotes. Verify before committing. Rubric and bands last reviewed ${LAST_REVIEWED}._`,
  );

  return lines.join("\n");
}

// ---------- PDF section renderer ----------
// Each PdfSection is rendered to its own canvas → its own PDF page(s),
// so section breaks always land cleanly.
type SectionKey =
  | "header"
  | "inputs"
  | "platforms"
  | "top-pick"
  | "runners"
  | "ranked"
  | "matrix"
  | "methodology";

function SectionWrapper({
  id,
  children,
}: {
  id: SectionKey;
  children: React.ReactNode;
}) {
  return (
    <div
      data-pdf-section={id}
      style={{
        width: `${PAGE_WIDTH_PX}px`,
        background: "#ffffff",
        color: C.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: "13px",
        lineHeight: 1.55,
        padding: "32px 36px",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px", color: C.text }}>
      {children}
    </h1>
  );
}
/** Section heading with optional numbered step badge to mirror the web app's 3-step flow. */
function H2({ children, step }: { children: React.ReactNode; step?: 1 | 2 | 3 }) {
  return (
    <h2
      style={{
        fontSize: "18px",
        fontWeight: 700,
        margin: "0 0 10px",
        color: C.text,
        borderBottom: `2px solid ${C.border}`,
        paddingBottom: "6px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {step != null && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
            height: "22px",
            borderRadius: "999px",
            background: C.text,
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 800,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {step}
        </span>
      )}
      <span>{children}</span>
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "11px",
        fontWeight: 700,
        margin: "16px 0 6px",
        color: C.muted,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </h3>
  );
}


function BrandBar({ subtitle }: { subtitle: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ height: "4px", borderRadius: "2px", background: C.accentBar }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: "8px",
          fontSize: "11px",
          color: C.muted,
        }}
      >
        <span style={{ fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
          Lovable Stack Architect
        </span>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
      {items.map((x, i) => (
        <li key={i} style={{ marginBottom: "3px" }}>
          {x}
        </li>
      ))}
    </ul>
  );
}

function HeaderSection({ inputs }: { inputs: Inputs }) {
  return (
    <SectionWrapper id="header">
      <BrandBar subtitle={`Generated ${new Date().toLocaleString()}`} />
      <H1>Architecture Recommendation</H1>
      <p style={{ margin: "0 0 4px", color: C.muted, fontSize: "12px" }}>
        A weighted comparison of {11} hosting & backend options for your Lovable app, tuned to the
        inputs below. Rubric last reviewed {LAST_REVIEWED}.
      </p>
      <p style={{ margin: 0, color: C.muted, fontSize: "11px" }}>
        Source: {SITE_URL} · Maintained by @{AUTHOR_HANDLE} on lovable.dev · Community template, not
        affiliated with Lovable.
      </p>

      <div
        style={{
          marginTop: "18px",
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          padding: "12px 14px",
          background: C.mutedBg,
          fontSize: "12px",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "6px", color: C.text }}>Inputs at a glance</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: "4px",
            columnGap: "16px",
          }}
        >
          <div>
            <strong>Stage:</strong> {fmtList(mapLabels(inputs.stage, STAGE_LABEL))}
          </div>
          <div>
            <strong>Expected MAU:</strong> {inputs.mau.toLocaleString()}
          </div>
          <div>
            <strong>Team:</strong> {fmtList(mapLabels(inputs.team, TEAM_LABEL))}
          </div>
          <div>
            <strong>Budget:</strong> {fmtList(mapLabels(inputs.budget, BUDGET_LABEL))}
          </div>
          <div>
            <strong>Compliance:</strong> {fmtList(mapLabels(inputs.compliance, COMPLIANCE_LABEL))}
          </div>
          <div>
            <strong>Workloads:</strong> {fmtList(mapLabels(inputs.workloads, WORKLOAD_LABEL))}
          </div>
          <div>
            <strong>Lock-in tolerance:</strong>{" "}
            {fmtList(mapLabels(inputs.lockInTolerance, LOCKIN_LABEL))}
          </div>
          <div>
            <strong>Time-to-market priority:</strong> {inputs.ttmPriority}/5
          </div>
          <div>
            <strong>Hybrid stacks:</strong>{" "}
            {inputs.allowSplit ? "Included (split frontend hosting)" : "Not included"}
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}

function TopPickSection({
  top,
  runner,
  inputs,
  excluded,
}: {
  top: RankedResult;
  runner?: RankedResult;
  inputs: Inputs;
  excluded: { arch: Architecture; reason: string }[];
}) {
  const stage = stageFromMau(inputs.mau);
  const category = CATEGORIES.find((c) => c.id === top.arch.category);
  const trade = runner ? tradeoffVs(top, runner, inputs) : null;

  return (
    <SectionWrapper id="top-pick">
      <H2 step={3}>Your recommendation</H2>

      {excluded.length > 0 && (
        <div
          style={{
            border: `1px solid ${C.warnBorder}`,
            background: C.warnBg,
            color: C.warn,
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "11px",
            marginBottom: "12px",
          }}
        >
          <strong>{excluded.length}</strong> option{excluded.length === 1 ? "" : "s"} hidden by your
          compliance requirement ({excluded.map((e) => e.arch.short).join(", ")}). Loosen the
          compliance filter in the app to compare them.
        </div>
      )}

      <div
        style={{
          border: `1px solid ${C.primary}`,
          borderRadius: "12px",
          padding: "16px 18px",
          background: C.primarySoft,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: C.primary, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Recommended {category ? `· ${category.label}` : ""}
              {top.arch.composition ? " · Hybrid stack" : ""}
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, marginTop: "2px" }}>
              {top.arch.name}
            </div>
            <div style={{ fontSize: "12px", fontStyle: "italic", color: C.muted, marginTop: "2px" }}>
              {top.arch.tagline}
            </div>

          </div>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "16px",
              fontWeight: 700,
              color: C.primary,
            }}
          >
            {Math.round(top.score)}<span style={{ opacity: 0.6, fontSize: "12px" }}>/100</span>
          </div>
        </div>

        <p style={{ marginTop: "12px", marginBottom: 0 }}>{top.arch.description}</p>
      </div>

      <H3>Why this fits your inputs</H3>
      <Bullets items={top.rationale} />

      {top.topContributors.length > 0 && (
        <>
          <H3>Top scoring criteria</H3>
          <Bullets
            items={top.topContributors.map(
              (c) => `${c.criterion.label} — ${c.rubricScore}/5`,
            )}
          />
        </>
      )}

      {trade && runner && (
        <p
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            border: `1px dashed ${C.border}`,
            borderRadius: "8px",
            fontSize: "12px",
            color: C.muted,
          }}
        >
          <strong style={{ color: C.text }}>Trade-off vs {runner.arch.short}:</strong> you gain{" "}
          <strong style={{ color: C.text }}>{trade.topWins.label.toLowerCase()}</strong> and give up
          some <strong style={{ color: C.text }}>{trade.runnerWins.label.toLowerCase()}</strong>.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
        <div>
          <H3>Best for</H3>
          <Bullets items={top.arch.bestFor} />
        </div>
        <div>
          <H3>Watch-outs</H3>
          <Bullets items={top.arch.watchOuts} />
        </div>
      </div>

      <div
        style={{
          marginTop: "18px",
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          padding: "12px 14px",
          background: C.mutedBg,
        }}
      >
        <H3>Cost &amp; scaling</H3>
        <p style={{ margin: "4px 0" }}>
          <strong>{top.arch.costBands[stage]}</strong> / month estimated at {STAGE_LABEL[stage]}{" "}
          scale ({inputs.mau.toLocaleString()} MAU).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "8px" }}>
          {(["prototype", "mvp", "growth", "scale"] as const).map((s) => {
            const active = s === stage;
            return (
              <div
                key={s}
                style={{
                  border: `1px solid ${active ? C.primary : C.border}`,
                  background: active ? C.primarySoft : "#ffffff",
                  borderRadius: "6px",
                  padding: "6px 8px",
                  fontSize: "10px",
                }}
              >
                <div style={{ fontWeight: 600, textTransform: "capitalize" }}>{STAGE_LABEL[s]}</div>
                <div style={{ fontFamily: "ui-monospace, monospace", color: active ? C.primary : C.text }}>
                  {top.arch.costBands[s]}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: "11px" }}>
          <strong>Ceiling:</strong> {top.arch.scaleCeiling}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "10px", color: C.muted }}>
          Last reviewed {top.arch.lastReviewed}
          {top.arch.sources.length > 0 && (
            <> · Sources: {top.arch.sources.map((s) => s.label).join(", ")}</>
          )}
        </p>
      </div>
    </SectionWrapper>
  );
}

function RunnersSection({ runners }: { runners: RankedResult[] }) {
  return (
    <SectionWrapper id="runners">
      <H2>Runners-up</H2>
      {runners.map((r, i) => (
        <div
          key={r.arch.id}
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            padding: "12px 14px",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>
              #{i + 1} — {r.arch.name}
            </div>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", color: C.muted }}>
              {Math.round(r.score)}/100
            </div>
          </div>
          <div style={{ fontSize: "11px", fontStyle: "italic", color: C.muted, marginBottom: "6px" }}>
            {r.arch.tagline}
          </div>
          <Bullets items={r.rationale.slice(0, 3)} />
        </div>
      ))}
    </SectionWrapper>
  );
}

function RankedSection({
  results,
  excluded,
  userExcluded,
}: {
  results: RankedResult[];
  excluded: { arch: Architecture; reason: string }[];
  userExcluded: { arch: Architecture; reason: string }[];
}) {
  return (
    <SectionWrapper id="ranked">
      <H2>All ranked options</H2>
      <ol style={{ margin: 0, paddingLeft: "22px" }}>
        {results.map((r) => (
          <li key={r.arch.id} style={{ marginBottom: "4px" }}>
            <strong>{r.arch.name}</strong>{" "}
            <span style={{ fontFamily: "ui-monospace, monospace", color: C.muted }}>
              — {Math.round(r.score)}/100
            </span>{" "}
            <span style={{ color: C.muted }}>— {r.arch.tagline}</span>
          </li>
        ))}
      </ol>

      {excluded.length > 0 && (
        <>
          <H3>Excluded by hard requirements</H3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {excluded.map((e) => (
              <li key={e.arch.id} style={{ marginBottom: "3px" }}>
                <strong>{e.arch.name}</strong> — <span style={{ color: C.muted }}>{e.reason}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {userExcluded.length > 0 && (
        <>
          <H3>Removed by your platform filter</H3>
          <p style={{ margin: "0 0 6px", fontSize: "11px", color: C.muted, fontStyle: "italic" }}>
            You chose to leave these out of this comparison. Re-enable them in the app's "Platforms
            to consider" picker to score them.
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {userExcluded.map((e) => (
              <li key={e.arch.id} style={{ marginBottom: "3px" }}>
                <strong>{e.arch.name}</strong>{" "}
                <span style={{ color: C.muted }}>— {e.arch.tagline}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </SectionWrapper>
  );
}

function MatrixSection({
  results,
  topId,
}: {
  results: RankedResult[];
  topId: string;
}) {
  return (
    <SectionWrapper id="matrix">
      <H2>Comparison matrix</H2>
      <p style={{ margin: "0 0 10px", fontSize: "11px", color: C.muted }}>
        Rubric scores (0–5) per criterion. Top pick column highlighted.
      </p>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "10px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: `1px solid ${C.border}`,
                background: C.mutedBg,
                padding: "6px 6px",
                textAlign: "left",
                width: "160px",
              }}
            >
              Criterion
            </th>
            {results.map((r) => (
              <th
                key={r.arch.id}
                style={{
                  border: `1px solid ${C.border}`,
                  background: r.arch.id === topId ? C.primarySoft : C.mutedBg,
                  color: r.arch.id === topId ? C.primary : C.text,
                  padding: "6px 4px",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {r.arch.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CRITERIA.map((c, idx) => (
            <tr key={c.id} style={{ background: idx % 2 ? C.mutedBg : "#ffffff" }}>
              <td style={{ border: `1px solid ${C.border}`, padding: "5px 6px" }}>{c.label}</td>
              {results.map((r) => {
                const isTop = r.arch.id === topId;
                return (
                  <td
                    key={r.arch.id}
                    style={{
                      border: `1px solid ${C.border}`,
                      padding: "5px 4px",
                      textAlign: "center",
                      fontFamily: "ui-monospace, monospace",
                      background: isTop ? C.primarySoft : undefined,
                      color: isTop ? C.primary : C.text,
                      fontWeight: isTop ? 700 : 400,
                    }}
                  >
                    {RUBRIC[r.arch.id][c.id]}/5
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </SectionWrapper>
  );
}

function InputsAppendixSection({ inputs }: { inputs: Inputs }) {
  const rows: { label: string; chosen: string; description: string }[] = [
    {
      label: "Stage",
      chosen: fmtList(mapLabels(inputs.stage, STAGE_LABEL)),
      description: inputs.stage
        .map((s) => `${STAGE_LABEL[s]}: ${STAGE_DESCRIPTION[s]}`)
        .join(" · "),
    },
    {
      label: "Expected MAU",
      chosen: inputs.mau.toLocaleString(),
      description:
        "Monthly active users — used to pick the cost band and to weight scaling-ceiling and large-scale cost.",
    },
    {
      label: "Team strengths",
      chosen: fmtList(mapLabels(inputs.team, TEAM_LABEL)),
      description: inputs.team.map((t) => `${TEAM_LABEL[t]}: ${TEAM_DESCRIPTION[t]}`).join(" · "),
    },
    {
      label: "Budget",
      chosen: fmtList(mapLabels(inputs.budget, BUDGET_LABEL)),
      description:
        "Monthly all-in spend. Low pushes cost-at-small-scale higher; high relaxes it.",
    },
    {
      label: "Compliance",
      chosen: fmtList(mapLabels(inputs.compliance, COMPLIANCE_LABEL)),
      description: inputs.compliance
        .map((c) => `${COMPLIANCE_LABEL[c]}: ${COMPLIANCE_DESCRIPTION[c]}`)
        .join(" · "),
    },
    {
      label: "Workloads",
      chosen: fmtList(mapLabels(inputs.workloads, WORKLOAD_LABEL)),
      description: inputs.workloads
        .map((w) => `${WORKLOAD_LABEL[w]}: ${WORKLOAD_DESCRIPTION[w]}`)
        .join(" · "),
    },
    {
      label: "Lock-in tolerance",
      chosen: fmtList(mapLabels(inputs.lockInTolerance, LOCKIN_LABEL)),
      description: inputs.lockInTolerance
        .map((l) => `${LOCKIN_LABEL[l]}: ${LOCKIN_DESCRIPTION[l]}`)
        .join(" · "),
    },
    {
      label: "Time-to-market priority",
      chosen: `${inputs.ttmPriority}/5`,
      description: "Higher values boost the weight of the 'Time to launch' criterion.",
    },
  ];

  return (
    <SectionWrapper id="inputs">
      <H2 step={1}>Project inputs</H2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
        <thead>
          <tr style={{ background: C.mutedBg }}>
            <th style={{ border: `1px solid ${C.border}`, padding: "6px 8px", textAlign: "left", width: "150px" }}>
              Input
            </th>
            <th style={{ border: `1px solid ${C.border}`, padding: "6px 8px", textAlign: "left", width: "180px" }}>
              Your selection
            </th>
            <th style={{ border: `1px solid ${C.border}`, padding: "6px 8px", textAlign: "left" }}>
              What it means
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} style={{ background: i % 2 ? C.mutedBg : "#ffffff" }}>
              <td style={{ border: `1px solid ${C.border}`, padding: "6px 8px", fontWeight: 600 }}>
                {r.label}
              </td>
              <td style={{ border: `1px solid ${C.border}`, padding: "6px 8px" }}>{r.chosen}</td>
              <td style={{ border: `1px solid ${C.border}`, padding: "6px 8px", color: C.muted }}>
                {r.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionWrapper>
  );
}

function PlatformsConsideredSection({
  results,
  excluded,
  userExcluded,
}: {
  results: RankedResult[];
  excluded: { arch: Architecture; reason: string }[];
  userExcluded: { arch: Architecture; reason: string }[];
}) {
  return (
    <SectionWrapper id="platforms">
      <H2 step={2}>Platforms considered</H2>
      <p style={{ margin: "0 0 10px", fontSize: "12px", color: C.muted }}>
        These are the platforms scored against your inputs. Anything excluded was either hidden by a
        hard compliance requirement or removed from the comparison by you.
      </p>

      <H3>Compared ({results.length})</H3>
      <ul style={{ margin: 0, paddingLeft: "20px" }}>
        {results.map((r) => (
          <li key={r.arch.id} style={{ marginBottom: "3px" }}>
            <strong>{r.arch.name}</strong>{" "}
            <span style={{ color: C.muted }}>— {r.arch.tagline}</span>
          </li>
        ))}
      </ul>

      {excluded.length > 0 && (
        <>
          <H3>Hidden by compliance ({excluded.length})</H3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {excluded.map((e) => (
              <li key={e.arch.id} style={{ marginBottom: "3px" }}>
                <strong>{e.arch.name}</strong>{" "}
                <span style={{ color: C.muted }}>— {e.reason}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {userExcluded.length > 0 && (
        <>
          <H3>Removed by your filter ({userExcluded.length})</H3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {userExcluded.map((e) => (
              <li key={e.arch.id} style={{ marginBottom: "3px" }}>
                <strong>{e.arch.name}</strong>{" "}
                <span style={{ color: C.muted }}>— {e.arch.tagline}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </SectionWrapper>
  );
}

function MethodologySection({ results }: { results: RankedResult[] }) {
  const allSources = Array.from(
    new Map(
      results.flatMap((r) => r.arch.sources.map((s) => [s.url, { ...s, arch: r.arch.short }])),
    ).values(),
  );

  return (
    <SectionWrapper id="methodology">
      <H2>Methodology &amp; glossary</H2>

      <H3>How scoring works</H3>
      <ol style={{ margin: "4px 0 0", paddingLeft: "22px" }}>
        <li>Every criterion starts at a baseline weight of 1.0 (or 0.5 for narrower ones).</li>
        <li>
          Your inputs nudge weights up or down — e.g. low budget pushes "Cost at small scale" higher,
          choosing "Realtime" workload boosts the realtime weight.
        </li>
        <li>
          Each architecture has a fixed rubric score 0–5 per criterion. Weighted scores are summed
          and normalized to <strong>0–100</strong>.
        </li>
        <li>
          Strict compliance (HIPAA, SOC 2, data residency) acts as a <strong>hard filter</strong> —
          options scoring below 4/5 on Compliance are removed entirely.
        </li>
      </ol>

      <H3>Criteria glossary</H3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px" }}>
        <thead>
          <tr style={{ background: C.mutedBg }}>
            <th style={{ border: `1px solid ${C.border}`, padding: "5px 8px", textAlign: "left", width: "170px" }}>
              Criterion
            </th>
            <th style={{ border: `1px solid ${C.border}`, padding: "5px 8px", textAlign: "left" }}>
              What it measures
            </th>
          </tr>
        </thead>
        <tbody>
          {CRITERIA.map((c, i) => (
            <tr key={c.id} style={{ background: i % 2 ? C.mutedBg : "#ffffff" }}>
              <td style={{ border: `1px solid ${C.border}`, padding: "5px 8px", fontWeight: 600 }}>
                {c.label}
              </td>
              <td style={{ border: `1px solid ${C.border}`, padding: "5px 8px", color: C.muted }}>
                {c.hint}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {allSources.length > 0 && (
        <>
          <H3>Sources</H3>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "10.5px" }}>
            {allSources.map((s) => (
              <li key={s.url} style={{ marginBottom: "3px", color: C.muted }}>
                <strong style={{ color: C.text }}>{s.arch}:</strong> {s.label} — {s.url}
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ marginTop: "16px", fontSize: "10.5px", color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: "8px" }}>
        Cost bands are curated estimates from vendor pricing pages, not live quotes. Always verify
        before committing. Rubric and bands last reviewed {LAST_REVIEWED}. Maintained by @
        {AUTHOR_HANDLE} on lovable.dev — community template, not affiliated with Lovable.
      </p>
    </SectionWrapper>
  );
}

// ---------- Main component ----------
export function ReportExport(props: Props) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const pdfRootRef = useRef<HTMLDivElement | null>(null);
  const shareInputRef = useRef<HTMLInputElement | null>(null);

  const filteredResults = applyNonTechFilter(props.results, props.inputs);
  const top = filteredResults[0];

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
    a.download = `stack-architect-${top?.arch.short.toLowerCase() ?? "report"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!pdfRootRef.current || pdfBusy) return;
    setPdfBusy(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const root = pdfRootRef.current;
      const sections = Array.from(
        root.querySelectorAll<HTMLDivElement>("[data-pdf-section]"),
      );
      if (!sections.length) throw new Error("No sections to render");

      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;

      let firstPage = true;
      for (const section of sections) {
        const canvas = await html2canvas(section, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });
        const imgWFull = contentW;
        const imgHFull = (canvas.height * imgWFull) / canvas.width;
        const imgData = canvas.toDataURL("image/jpeg", 0.92);

        if (imgHFull <= contentH) {
          if (!firstPage) pdf.addPage();
          firstPage = false;
          pdf.addImage(imgData, "JPEG", margin, margin, imgWFull, imgHFull);
        } else {
          // Section taller than one page — slice into multiple pages.
          const sliceCanvasH = Math.floor((canvas.width * contentH) / contentW);
          let y = 0;
          while (y < canvas.height) {
            const sH = Math.min(sliceCanvasH, canvas.height - y);
            const slice = document.createElement("canvas");
            slice.width = canvas.width;
            slice.height = sH;
            const ctx = slice.getContext("2d");
            if (!ctx) break;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, slice.width, slice.height);
            ctx.drawImage(canvas, 0, y, canvas.width, sH, 0, 0, canvas.width, sH);
            const sliceData = slice.toDataURL("image/jpeg", 0.92);
            const sliceImgH = (sH * imgWFull) / canvas.width;
            if (!firstPage) pdf.addPage();
            firstPage = false;
            pdf.addImage(sliceData, "JPEG", margin, margin, imgWFull, sliceImgH);
            y += sH;
          }
        }
      }

      // Page-number footer on every page.
      const pageCount = pdf.getNumberOfPages();
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 140);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(
          `Lovable Stack Architect · ${SITE_URL.replace(/^https?:\/\//, "")}`,
          margin,
          pageH - 10,
        );
        pdf.text(`Page ${i} / ${pageCount}`, pageW - margin, pageH - 10, { align: "right" });
      }

      pdf.save(`stack-architect-${top?.arch.short.toLowerCase() ?? "report"}.pdf`);
      track("Download PDF", { top: top?.arch.id ?? "none", pages: pageCount });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate PDF", {
        description: "Try the Markdown export, or refresh and try again.",
      });
    } finally {
      setPdfBusy(false);
    }
  };

  const copyShareUrl = async () => {
    const url = props.shareUrl ?? window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track("Share link", { top: top?.arch.id ?? "none" });
    } catch {
      shareInputRef.current?.select();
      toast.message("Copy not allowed", { description: "Select the URL and copy manually." });
    }
  };


  const runners = filteredResults.slice(1, 3);
  const excluded = props.excluded ?? [];
  const userExcluded = props.userExcluded ?? [];

  return (
    <>
      <div className="no-print flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
        <div className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
          <Share2 className="h-3.5 w-3.5" />
          <span>Export this recommendation:</span>
        </div>
        {props.shareUrl && (
          <Button
            onClick={copyShareUrl}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            aria-label="Copy share link"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy link"}</span>
          </Button>
        )}
        <Button
          onClick={downloadPdf}
          disabled={pdfBusy}
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          aria-label="Download PDF report"
        >
          {pdfBusy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FileDown className="h-3.5 w-3.5" />
          )}
          <span>{pdfBusy ? "Building…" : "PDF"}</span>
        </Button>
        <Button
          onClick={downloadMd}
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          aria-label="Download Markdown"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Markdown</span>
        </Button>
        <input ref={shareInputRef} type="hidden" readOnly value={props.shareUrl ?? ""} />
      </div>

      {/* Offscreen render source for html2canvas PDF export. Each section becomes
          its own PDF page (or pages) so breaks are clean. */}
      {typeof document !== "undefined" &&
        top &&
        createPortal(
          <div
            aria-hidden="true"
            className="no-print"
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: `${PAGE_WIDTH_PX}px`,
              background: "#ffffff",
              pointerEvents: "none",
            }}
          >
            <div ref={pdfRootRef}>
              <HeaderSection inputs={props.inputs} />
              {/* Step 1 — Project inputs */}
              <InputsAppendixSection inputs={props.inputs} />
              {/* Step 2 — Platforms considered */}
              <PlatformsConsideredSection
                results={filteredResults}
                excluded={excluded}
                userExcluded={userExcluded}
              />
              {/* Step 3 — Recommendation */}
              <TopPickSection
                top={top}
                runner={filteredResults[1]}
                inputs={props.inputs}
                excluded={excluded}
              />
              {runners.length > 0 && <RunnersSection runners={runners} />}
              {/* Appendix — supporting evidence */}
              <RankedSection results={filteredResults} excluded={excluded} userExcluded={userExcluded} />
              <MatrixSection results={filteredResults} topId={top.arch.id} />
              <MethodologySection results={filteredResults} />

            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export { buildMarkdown };
