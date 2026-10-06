"use client";

import * as React from "react";
import { Button, DescriptionList, Icon, IconButton, Link, SideSheet, Tooltip } from "@mosje/design-system";
import { useDataMode } from "@/lib/data-mode/context";
import { portalById } from "@/lib/kpi/register";
import type { KpiDefinition, KpiReading } from "@/lib/kpi/types";
import "./data-mode.css";

/** One line of a calculation: what it is, and its value. `op` is how it joins the line above. */
export interface BreakdownRow {
  label: string;
  value: string;
  op?: "+" | "−" | "×" | "÷";
}

/** What kind of thing a figure was read from — the first question a presenter is asked. */
export type SourceKind = "api" | "document" | "page" | "model";

const KIND_LABEL: Record<SourceKind, string> = {
  api: "Live API",
  document: "Document received from the Department",
  page: "Published web page",
  model: "Illustrative — not a departmental figure",
};

/**
 * Where one figure came from, and — where it is worked out from others — how, set out like
 * a price breakup: the inputs line by line, a rule, then the result.
 */
export interface SourceNote {
  /** What the figure is: the panel's heading. */
  title: string;
  /** The figure as the page shows it. */
  value?: string;
  kind: SourceKind;
  /** The system, page or document the figure came from (or, for a model, will come from). */
  source: string;
  /** DD.MM.YYYY, the day it was read or received. */
  asOn?: string;
  /** API endpoints, the published page, the file — whatever the reader can open. */
  links?: { label: string; href: string }[];
  /** The portal's own formula, in the proforma's words. */
  formula?: string;
  /** How often the source updates the figure, in the proforma's words ("Monthly"). */
  updated?: string;
  /** The period the figure covers ("Cumulative since launch"). */
  period?: string;
  /** The working, where the figure is derived. Absent for a figure shown as published. */
  breakdown?: {
    /** The rule in words: "Fund Utilised ÷ Fund Released × 100". */
    method?: string;
    rows: BreakdownRow[];
    result: { label: string; value: string };
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "05.10.2026" → "05 Oct 2026". */
const shownDate = (ddmmyyyy: string) => {
  const [d, m, y] = ddmmyyyy.split(".");
  const month = MONTHS[Number(m) - 1];
  return d && month && y ? `${d} ${month} ${y}` : ddmmyyyy;
};

const OP_NAME: Record<NonNullable<BreakdownRow["op"]>, string> = { "+": "plus", "−": "minus", "×": "multiplied by", "÷": "divided by" };

/** The calculation as a bill: each input on its line, a rule, the result. */
function Bill({ breakdown }: { breakdown: NonNullable<SourceNote["breakdown"]> }) {
  return (
    <>
      {breakdown.method ? <p className="dm-breakup__method">{breakdown.method}</p> : null}
      <dl className="dm-breakup__rows">
        {breakdown.rows.map((r, i) => (
          <div key={i} className="dm-breakup__row dm-breakup__row--line">
            <dt>
              {r.op ? (
                <span className="dm-breakup__op">
                  <span aria-hidden="true">{r.op}</span>
                  <span className="ds-sr-only">{OP_NAME[r.op]}</span>
                </span>
              ) : (
                <span className="dm-breakup__op" aria-hidden="true" />
              )}
              {r.label}
            </dt>
            <dd>{r.value}</dd>
          </div>
        ))}
        <div className="dm-breakup__row dm-breakup__row--total">
          <dt>{breakdown.result.label}</dt>
          <dd>{breakdown.result.value}</dd>
        </div>
      </dl>
    </>
  );
}

/** The hover summary: the figure, where it is from, and the result of any working. */
function Summary({ note, opensSheet }: { note: SourceNote; opensSheet: boolean }) {
  return (
    <div className="dm-breakup">
      <div className="dm-breakup__head">
        <span className="dm-breakup__title">{note.title}</span>
        {note.value ? <span className="dm-breakup__value">{note.value}</span> : null}
      </div>
      <dl className="dm-breakup__rows dm-breakup__rows--meta">
        <div className="dm-breakup__row">
          <dt>Source</dt>
          <dd>{KIND_LABEL[note.kind]}</dd>
        </div>
        <div className="dm-breakup__row">
          <dt>From</dt>
          <dd>{note.source}</dd>
        </div>
        {note.asOn ? (
          <div className="dm-breakup__row">
            <dt>As on</dt>
            <dd>{shownDate(note.asOn)}</dd>
          </div>
        ) : null}
        <div className="dm-breakup__row">
          <dt>Calculation</dt>
          <dd>{note.breakdown ? `${note.breakdown.result.label}: ${note.breakdown.result.value}` : "None — shown as published"}</dd>
        </div>
      </dl>
      {opensSheet ? <p className="dm-breakup__method">Select for the full source and calculation.</p> : null}
    </div>
  );
}

/** The side sheet: every source detail as a table, with links, then the full calculation. */
function SourceSheet({ note, onClose }: { note: SourceNote | null; onClose: () => void }) {
  return (
    <SideSheet
      open={Boolean(note)}
      onClose={onClose}
      title={
        <>
          <span className="dm-sheet__kicker">Source and Calculation</span>
          {note?.title ?? ""}
        </>
      }
      size="md"
      footer={
        <Button appearance="outlined" onClick={onClose}>
          Close
        </Button>
      }
    >
      {note ? (
        <div className="dm-sheet">
          {note.value ? <p className="dm-sheet__value">{note.value}</p> : null}
          <section className="dm-sheet__part" aria-labelledby="dm-sheet-source">
            <h3 id="dm-sheet-source" className="dm-sheet__heading">Source</h3>
            <DescriptionList
              columns={1}
              divided
              items={[
                { term: "Type", value: KIND_LABEL[note.kind] },
                { term: note.kind === "model" ? "To Be Read From" : "Read From", value: note.source },
                ...(note.asOn ? [{ term: note.kind === "document" ? "Received As On" : "Read As On", value: shownDate(note.asOn) }] : []),
                ...(note.links?.length
                  ? [{
                      term: note.kind === "api" || note.kind === "model" ? "API Endpoint" : "Link",
                      value: (
                        <ul className="dm-sheet__links">
                          {note.links.map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} external>
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ),
                    }]
                  : []),
                ...(note.updated ? [{ term: "Updated", value: note.updated }] : []),
                ...(note.period ? [{ term: "Figures For", value: note.period }] : []),
                ...(note.formula ? [{ term: "Formula, as the Portal States It", value: note.formula }] : []),
              ]}
            />
          </section>
          <section className="dm-sheet__part" aria-labelledby="dm-sheet-calc">
            <h3 id="dm-sheet-calc" className="dm-sheet__heading">Calculation</h3>
            {note.breakdown ? (
              <div className="dm-breakup">
                <Bill breakdown={note.breakdown} />
              </div>
            ) : (
              <p className="dm-breakup__method">None. The figure is shown exactly as {note.kind === "model" ? "modelled" : "published"}.</p>
            )}
          </section>
        </div>
      ) : null}
    </SideSheet>
  );
}

const OpenSheet = React.createContext<((n: SourceNote) => void) | null>(null);

/**
 * Wraps a page so any FigureSource inside it can open the full source and calculation in a
 * side sheet. Without it, a FigureSource still shows its hover summary.
 */
export function FigureSourceProvider({ children }: { children: React.ReactNode }) {
  const [note, setNote] = React.useState<SourceNote | null>(null);
  return (
    <OpenSheet.Provider value={setNote}>
      {children}
      <SourceSheet note={note} onClose={() => setNote(null)} />
    </OpenSheet.Provider>
  );
}

/**
 * A figure's source and calculation: an info control beside the figure. Hover or focus
 * shows a short summary — the figure, the kind of source, the result of any working; a
 * select opens the full source (with its API endpoint, page or document) and the whole
 * calculation, line by line like a price breakup, in a side sheet. Drawn only while the
 * demo rail's "Show sources and calculations" is on (`DemoDataSettings.sources`).
 *
 * ONE GATE, HERE — as `ProvenanceChip` holds the marks' gate — so a figure asks for its
 * note unconditionally and cannot forget to hide it. It exists so a derived figure can be
 * shown at all (instruction, 6 Oct 2026): a number worked out from the Department's figures
 * is acceptable when its working is one select away.
 *
 * A BUTTON, so keyboard and touch reach it: focus opens the summary as hover does, Escape
 * closes it (the DS Tooltip's WCAG 1.4.13 contract), and Enter opens the sheet.
 */
export function FigureSource({ note }: { note: SourceNote | undefined }) {
  const { sources } = useDataMode();
  const open = React.useContext(OpenSheet);
  if (!sources || !note) return null;
  return (
    <Tooltip variant="card" side="bottom" content={<Summary note={note} opensSheet={Boolean(open)} />}>
      <IconButton
        className="dm-source-btn"
        appearance="text"
        size="sm"
        shape="circle"
        icon={<Icon name="info" size={18} />}
        aria-label={`Source and calculation: ${note.title}`}
        aria-haspopup={open ? "dialog" : undefined}
        onClick={open ? () => open(note) : undefined}
      />
    </Tooltip>
  );
}

/**
 * Whether source notes are on — for a caller that must decide whether to draw a WRAPPER at
 * all. The gate is still this module's: the answer comes from the same setting.
 */
export const useSourceNotes = () => useDataMode().sources;

const KIND_OF: Record<KpiReading["origin"], SourceKind> = { live: "api", received: "document", snapshot: "page", modelled: "model" };

/**
 * The note for a KPI reading: its kind, its source, how often it is updated and the period it
 * covers, and the portal's own API endpoints where the register lists them — for an
 * illustrative figure, the endpoint it WILL be read from.
 */
export function noteForReading(kpi: KpiDefinition, reading: KpiReading, title: string, value?: string, breakdown?: SourceNote["breakdown"]): SourceNote {
  const kind = KIND_OF[reading.origin];
  const links = kpi.api?.endpoints?.map((href) => ({ label: href.replace(/^https?:\/\//, ""), href }));
  return {
    title,
    value,
    kind,
    source: kind === "model" ? (kpi.source ?? "The programme's portal, once connected") : (reading.source ?? kpi.source ?? "Not stated"),
    asOn: kind === "model" ? undefined : reading.asOn,
    links,
    formula: kpi.formula,
    updated: kpi.frequency,
    period: portalById(kpi.id.split(".")[0] ?? "")?.period,
    breakdown,
  };
}
