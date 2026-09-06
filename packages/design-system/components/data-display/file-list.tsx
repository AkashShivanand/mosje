"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./file-list.css";

/** Where an attachment has got to. `scanning` is a real state on this estate. */
export type FileState = "uploading" | "scanning" | "ready" | "failed";

export interface FileItem {
  id: string;
  /** The name as the citizen gave it. Never rewritten — they recognise their own file. */
  name: string;
  /** Bytes. Formatted for display; omit where the size is not known. */
  size?: number;
  /** What kind of document this is — "Income certificate". */
  kind?: string;
  /** @default "ready" */
  state?: FileState;
  /** Percent complete, for `uploading`. Omit for an indeterminate upload. */
  progress?: number;
  /** Why it failed, in words the citizen can act on. Shown only when `failed`. */
  error?: string;
  /** Where the file can be opened. Omit and no link is drawn. */
  href?: string;
}

export interface FileListProps {
  files: FileItem[];
  /**
   * Names the list — "Documents attached to this application". Required: a bare
   * list of filenames tells a screen-reader user how many of what.
   */
  label: string;
  /** Offered on every row when given. Omit for a read-only list. */
  onRemove?: (id: string) => void;
  /** Offered on failed rows when given. */
  onRetry?: (id: string) => void;
  className?: string;
}

/** Bytes as a citizen would read them. */
function readableSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATE_WORD: Record<FileState, string> = {
  uploading: "Uploading",
  scanning: "Checking for viruses",
  ready: "Attached",
  failed: "Failed",
};

/**
 * MoSJE / SAMAVESH File list.
 *
 * The attachments on an application — what has been uploaded, what state each
 * one is in, and what can be done about it.
 *
 * **It is a list of states, not a list of names.** An attachment on this estate
 * is uploading, then being scanned, then attached — or it failed. A row that
 * shows only a filename tells the citizen nothing about whether the department
 * has actually received it, which is the only question they have.
 *
 * **`scanning` is a real state and not a nicety.** Departmental uploads are
 * virus-scanned before they count as received; a file that appears "attached"
 * and is rejected an hour later is worse than one that says it is being checked.
 *
 * **The filename is never rewritten.** A citizen recognises their own file by
 * the name they gave it, and a sanitised or truncated name makes them wonder
 * whether they uploaded the right thing. Long names wrap; they are not clipped.
 *
 * **A failure says what to do.** "The file is larger than 5 MB" is actionable;
 * "Upload failed" sends the citizen back to a counter.
 */
export function FileList({
  files,
  label,
  onRemove,
  onRetry,
  className,
}: FileListProps): React.JSX.Element {
  return (
    <ul className={cn("ds-files", className)} aria-label={label}>
      {files.map((file) => {
        const state = file.state ?? "ready";
        const meta = [file.kind, file.size !== undefined ? readableSize(file.size) : null]
          .filter(Boolean)
          .join(" · ");
        return (
          <li key={file.id} className={cn("ds-files__item", `ds-files__item--${state}`)}>
            <span className="ds-files__body">
              <span className="ds-files__name">{file.name}</span>
              {meta ? <span className="ds-files__meta">{meta}</span> : null}
              {/* The state is a WORD, always — never a colour or an icon alone,
                  and it is inside the row so it is read with the filename. */}
              <span className="ds-files__state">
                {STATE_WORD[state]}
                {state === "uploading" && file.progress !== undefined
                  ? ` — ${Math.round(file.progress)}%`
                  : null}
              </span>
              {state === "failed" && file.error ? (
                <span className="ds-files__error">{file.error}</span>
              ) : null}
            </span>

            {state === "uploading" ? (
              <progress
                className="ds-files__progress"
                max={100}
                value={file.progress}
                aria-label={`Uploading ${file.name}`}
              />
            ) : null}

            <span className="ds-files__actions">
              {file.href && state === "ready" ? (
                <a className="ds-files__link" href={file.href}>
                  {/* Named for the FILE, not "View" — a screen-reader user
                      moving by link hears twelve identical "View"s otherwise. */}
                  <span aria-hidden>View</span>
                  <span className="ds-files__sr">View {file.name}</span>
                </a>
              ) : null}
              {onRetry && state === "failed" ? (
                <button type="button" className="ds-files__button" onClick={() => onRetry(file.id)}>
                  <span aria-hidden>Try again</span>
                  <span className="ds-files__sr">Try uploading {file.name} again</span>
                </button>
              ) : null}
              {onRemove ? (
                <button
                  type="button"
                  className="ds-files__button ds-files__button--danger"
                  onClick={() => onRemove(file.id)}
                >
                  <span aria-hidden>Remove</span>
                  <span className="ds-files__sr">Remove {file.name}</span>
                </button>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
