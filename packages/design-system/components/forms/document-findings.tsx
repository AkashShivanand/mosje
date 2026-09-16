import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./forms.css";
import "./document-findings.css";

export interface DocumentFinding {
  /** The field the check read — "Organisation Name". */
  label: string;
  /** What the file says. */
  found: React.ReactNode;
  /** What the application says, where it says anything about this field. */
  expected?: React.ReactNode;
  /** `true` matches, `false` differs, `undefined` has nothing to compare with. */
  matches?: boolean;
}

export interface DocumentFindingsProps {
  /** The check's one-sentence verdict. */
  summary?: React.ReactNode;
  /** The fields read from the file, each compared with the application where it can be. */
  fields?: readonly DocumentFinding[];
  /** Every reason, in the check's order. The row already shows the first. */
  reasons?: readonly React.ReactNode[];
  /**
   * The check's confidence against its threshold. **For officers only**: an applicant is given
   * the consequence ("Check the details") and never the number, which changes nothing they can do.
   */
  confidence?: { value: number; threshold: number };
  /** The phrase before an expected value. @default "Your application says" */
  expectedLabel?: string;
  /** What is shown when the check read nothing. @default "No details could be read from this file." */
  emptyText?: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH DocumentFindings — "What we found": the automatic check's summary, the fields
 * it read, each compared with the application's own answer, and all its reasons.
 *
 * The comparison is the point. The live portal prints "Organisation Name: HARIJAN SEVAK SANGH"
 * and leaves the reader to notice it is not their organisation; this panel says so, in words and
 * with an icon, against the answer the applicant gave.
 */
export function DocumentFindings({
  summary,
  fields = [],
  reasons = [],
  confidence,
  expectedLabel = "Your application says",
  emptyText = "No details could be read from this file.",
  className,
}: DocumentFindingsProps) {
  const nothing = summary == null && fields.length === 0 && reasons.length === 0;
  return (
    <div className={cn("ds-docfind", className)}>
      {nothing ? (
        <p className="ds-docfind__empty">{emptyText}</p>
      ) : (
        <>
          {summary != null && <p className="ds-docfind__summary">{summary}</p>}
          {confidence && (
            <p className="ds-docfind__confidence">
              Confidence {confidence.value}%{" "}
              <span className="ds-docfind__muted">
                ({confidence.value >= confidence.threshold ? "at or above" : "below"} the {confidence.threshold}% needed to pass without review)
              </span>
            </p>
          )}
          {fields.length > 0 && (
            <dl className="ds-docfind__fields">
              {fields.map((f) => (
                <div key={f.label} className="ds-docfind__field">
                  <dt className="ds-docfind__term">{f.label}</dt>
                  <dd className="ds-docfind__value">
                    <span className="ds-docfind__found">{f.found}</span>
                    {f.matches === true && (
                      <span className="ds-docfind__compare ds-docfind__compare--match">
                        <Icon name="check" size={16} aria-hidden />
                        Matches your application
                      </span>
                    )}
                    {f.matches === false && (
                      <span className="ds-docfind__compare ds-docfind__compare--differs">
                        <Icon name="close" size={16} aria-hidden />
                        <span>
                          Does not match. {expectedLabel}: <strong>{f.expected}</strong>
                        </span>
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {reasons.length > 0 && (
            <ul className="ds-docfind__reasons">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
