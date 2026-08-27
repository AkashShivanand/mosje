import * as React from "react";

/* ============================================================================
   Shared furniture for the data-visualisation reference pages.

   Every value here is a token. These pages are documentation, which under
   `.claude/rules/documentation-ds-linkage.md` is the STRICTEST case in the
   estate: a literal that merely equals a token is a defect. The only exemption
   is a specimen, and the specimens on these pages are the charts themselves.
   ============================================================================ */

export const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  marginBottom: "var(--sa-stack-8)",
  scrollMarginTop: "var(--sa-section-48)",
};

export const leadStyle: React.CSSProperties = {
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: "var(--sa-type-body-1-lh)",
  color: "var(--sa-text-neutral-subtle)",
  maxWidth: "68ch",
  marginBottom: "var(--sa-stack-24)",
};

/**
 * One specimen: the live component, then what question it answers and what it
 * must not be used for. The "not" half is the part that makes this a benchmark
 * rather than a gallery — a reader picking a chart needs to know what they are
 * ruling out.
 */
export function Specimen({
  name,
  answers,
  notFor,
  span = 1,
  children,
}: {
  name: string;
  answers: string;
  notFor?: string;
  /** 2 makes the specimen take the full width of the two-column grid. */
  span?: 1 | 2;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <section
      style={{
        gridColumn: span === 2 ? "1 / -1" : "auto",
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        background: "var(--sa-bg-neutral-base)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "var(--sa-padding-24)",
          borderBottom: "1px solid var(--sa-border-neutral-subtle)",
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        <div style={{ width: "100%", minWidth: 0 }}>{children}</div>
      </div>
      <div style={{ padding: "var(--sa-padding-16) var(--sa-padding-24)" }}>
        <h3
          style={{
            fontSize: "var(--sa-type-label-1-size)",
            fontWeight: 600,
            margin: "0 0 var(--sa-stack-8) 0",
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontSize: "var(--sa-type-body-3-size)",
            lineHeight: "var(--sa-type-body-3-lh)",
            color: "var(--sa-text-neutral-subtle)",
            margin: 0,
          }}
        >
          {answers}
        </p>
        {notFor && (
          <p
            style={{
              fontSize: "var(--sa-type-body-3-size)",
              lineHeight: "var(--sa-type-body-3-lh)",
              color: "var(--sa-text-neutral-subtle)",
              margin: "var(--sa-stack-8) 0 0 0",
            }}
          >
            <strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Not for:</strong> {notFor}
          </p>
        )}
      </div>
    </section>
  );
}

/** The two-column specimen grid. Collapses to one column under 900px. */
export function SpecimenGrid({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="sa-viz-specimens" style={{ marginBottom: "var(--sa-section-48)" }}>
      {children}
    </div>
  );
}

/** A rule that applies to everything below it — stated once, not per specimen. */
export function Rule({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <p
      style={{
        fontSize: "var(--sa-type-body-2-size)",
        lineHeight: "var(--sa-type-body-2-lh)",
        color: "var(--sa-text-neutral-bolder)",
        borderLeft: "3px solid var(--sa-border-brand-primary-base)",
        paddingLeft: "var(--sa-padding-16)",
        margin: "0 0 var(--sa-stack-24) 0",
        maxWidth: "68ch",
      }}
    >
      {children}
    </p>
  );
}
