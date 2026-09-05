import * as React from "react";
import { cn } from "../../utils/cn";
import type { DataProvenance } from "../data-display/charts/types";
import "./dashboard.css";

const STATUS_LABEL: Record<NonNullable<DataProvenance["status"]>, string> = {
  final: "Final",
  provisional: "Provisional",
  revised: "Revised",
};

/** "05 Sep 2026" — never `MM/DD`, per the data-visualisation contract. */
export function formatAsOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export interface ProvenanceLineProps {
  provenance: DataProvenance;
  className?: string;
}

/**
 * MoSJE / SAMAVESH ProvenanceLine — one muted line naming the source, the
 * as-of date and, where the figure is not final, its status.
 *
 * It is the one piece of self-description a card is allowed
 * (`ui-restraint-and-copy.md` §1, "Provenance"), and it exists as a component so
 * that a metric tile and the chart beside it describe the same feed in the same
 * words. Everything else about the pipeline belongs in the audit doc.
 */
export function ProvenanceLine({ provenance, className }: ProvenanceLineProps) {
  const { source, asOf, status, note } = provenance;
  const sep = (
    <span className="ds-provenance__sep" aria-hidden="true">
      ·
    </span>
  );
  return (
    <p className={cn("ds-provenance", className)}>
      <span className="ds-provenance__source">Source: {source}</span>
      {sep}
      <span>
        As of <time dateTime={asOf}>{formatAsOf(asOf)}</time>
      </span>
      {status && status !== "final" && (
        <>
          {sep}
          <span className={cn("ds-provenance__status", `ds-provenance__status--${status}`)}>
            {STATUS_LABEL[status]}
          </span>
        </>
      )}
      {note && (
        <>
          {sep}
          <span>{note}</span>
        </>
      )}
    </p>
  );
}
