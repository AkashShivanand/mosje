"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { SideSheet } from "../feedback/side-sheet";
import { navLinkRoutes } from "../navigation/header/nav-link-tag";
import "./forms.css";
import "./document-history-sheet.css";

export interface DocumentHistoryEntry {
  id: string;
  fileName: string;
  /** "812 KB". */
  size?: string;
  /** "16 Sep 2026, 11:42". */
  date: string;
  /** The current file, drawn first and marked "Current". */
  current?: boolean;
  /** What the check (or the officer) said about this version — "Looks right", "Doesn't match". */
  status?: React.ReactNode;
  /** Why it stopped being current — "Replaced after the Ministry's query". */
  note?: React.ReactNode;
  /** Where the version opens. */
  href?: string;
  /** Open the version in place, when there is no address for it. */
  onView?: () => void;
}

export interface DocumentHistorySheetProps {
  open: boolean;
  onClose: () => void;
  /** The document's name. */
  title: React.ReactNode;
  /** Current first, then earlier versions newest first. */
  entries: readonly DocumentHistoryEntry[];
  /** The app's router link (`next/link`) for entries with a same-site `href`. */
  linkAs?: React.ElementType;
  /** @default "No file has been uploaded for this document yet." */
  emptyText?: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH DocumentHistorySheet — every version of one document, in a side sheet.
 *
 * A replaced file is never lost (review call, 11 Sep 2026: "a log of the file"). The applicant,
 * the deficiency flow and the officer read the same log, so "what did they send before" has one
 * answer everywhere.
 */
export function DocumentHistorySheet({
  open,
  onClose,
  title,
  entries,
  linkAs,
  emptyText = "No file has been uploaded for this document yet.",
  className,
}: DocumentHistorySheetProps) {
  const count = entries.length;
  return (
    <SideSheet open={open} onClose={onClose} title={title} size="md" className={className}>
      <div className={cn("ds-dochist")}>
        {count === 0 ? (
          <p className="ds-dochist__empty">{emptyText}</p>
        ) : (
          <>
            <p className="ds-dochist__count">
              {count === 1 ? "1 version on record." : `${count} versions on record. Earlier files are kept when a document is replaced.`}
            </p>
            <ol className="ds-dochist__list">
              {entries.map((e) => {
                const Tag: React.ElementType | null = !e.href ? null : navLinkRoutes({ href: e.href }, linkAs) ? linkAs! : "a";
                return (
                  <li key={e.id} className="ds-dochist__item" data-current={e.current || undefined}>
                    <span className="ds-dochist__when">{e.current ? "Current" : "Earlier"}</span>
                    <div className="ds-dochist__body">
                      <p className="ds-dochist__file">{e.fileName}</p>
                      <p className="ds-dochist__meta">{[e.date, e.size].filter(Boolean).join(" · ")}</p>
                      {e.status != null && <p className="ds-dochist__status">{e.status}</p>}
                      {e.note != null && <p className="ds-dochist__meta">{e.note}</p>}
                    </div>
                    <div className="ds-dochist__action">
                      {Tag ? (
                        <Tag className="ds-dochist__link" href={e.href}>
                          View<span className="ds-sr-only"> {e.fileName}</span>
                        </Tag>
                      ) : e.onView ? (
                        <Button appearance="text" size="sm" onClick={e.onView} aria-label={`View ${e.fileName}`}>
                          View
                        </Button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </SideSheet>
  );
}
