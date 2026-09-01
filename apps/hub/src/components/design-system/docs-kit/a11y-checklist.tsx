import * as React from "react";

/**
 * How far the claim on this row has actually been taken.
 *
 * The first version of this component rendered a green tick and nothing else,
 * on 74 pages, against named WCAG success criteria — a compliance assertion
 * with no mechanism for saying "we have not checked this". On a Government of
 * India property that is the wrong default: an untested criterion silently
 * reads as a met one, and a reader has no way to tell the two apart.
 *
 * So the default is `untested`. A green tick is earned by naming the evidence.
 */
export type A11yStatus = "verified" | "partial" | "untested";

export interface A11yItem {
  /** e.g. "2.4.7 Focus Visible", or "GIGW 3.0 — Forms". */
  criterion: string;
  level: "A" | "AA" | "AAA" | "GIGW";
  description: string;
  /** @default "untested" — a tick is earned, not assumed. */
  status?: A11yStatus;
  /**
   * What proves it: a test id, an audit date, a reviewer. Rendered beside the
   * row so a claim can be followed up rather than taken on trust.
   */
  evidence?: string;
}

const MARK: Record<A11yStatus, { glyph: string; label: string }> = {
  verified: { glyph: "✓", label: "Verified" },
  partial: { glyph: "◑", label: "Partly met" },
  untested: { glyph: "○", label: "Not yet verified" },
};

export function A11yChecklist({ items }: { items: A11yItem[] }): React.JSX.Element {
  return (
    <ul className="a11y-checklist" aria-label="Accessibility requirements">
      {items.map((item, i) => {
        const status = item.status ?? "untested";
        const mark = MARK[status];
        return (
          <li key={i} className={`a11y-checklist__item a11y-checklist__item--${status}`}>
            {/*
             * The glyph is decorative; the status has to reach a screen reader
             * as words, or every row sounds identical.
             */}
            <span className="a11y-checklist__icon" aria-hidden="true">
              {mark.glyph}
            </span>
            <span className="ds-sr-only">{mark.label}: </span>
            <div>
              <div className="a11y-checklist__criterion">
                {item.criterion}{" "}
                {/*
                 * GIGW 3.0 is an Indian government standard, not a WCAG
                 * conformance level. Rendering it as "WCAG GIGW" — which this
                 * component did on every page that used it — misattributes a
                 * national standard to the W3C.
                 */}
                <span className="a11y-checklist__level">
                  {item.level === "GIGW" ? "GIGW 3.0" : `WCAG ${item.level}`}
                </span>
              </div>
              <div className="a11y-checklist__desc">{item.description}</div>
              {item.evidence ? (
                <div className="a11y-checklist__evidence">Evidence: {item.evidence}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
