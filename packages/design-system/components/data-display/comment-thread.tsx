"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { EventList, type EventItem } from "./event-list";
import "./comment-thread.css";

export interface ThreadComment {
  id: string;
  /** ISO timestamp. */
  at: string;
  /** Who wrote it. Omit only for a system note. */
  author?: string;
  /** Their role in the department — "District Nodal Officer". */
  authorRole?: string;
  /** The remark itself. Never truncated. */
  body: string;
  /** Marks a remark the reader has not seen. */
  unread?: boolean;
}

export interface CommentThreadProps {
  /** Remarks, oldest first — a thread is read downward, unlike a log. */
  comments: ThreadComment[];
  /** Accessible name for the thread. Required. */
  label: string;
  /** Called with the trimmed text when a remark is submitted. */
  onSubmit?: (text: string) => void;
  /** @default "Add a remark" */
  composerLabel?: string;
  /** @default "Post remark" */
  submitLabel?: string;
  /**
   * Why no further remarks can be added. Present means the composer is replaced
   * by this sentence — a closed thread that simply hides its box leaves the
   * reader wondering whether the page is broken.
   */
  closedReason?: string;
  /**
   * The most characters a remark may hold. The count is shown from 80% onward,
   * not from the first keystroke.
   * @default 1000
   */
  maxLength?: number;
  /** @default "No remarks on this application yet." */
  emptyText?: string;
  className?: string;
}

/**
 * The remarks officers leave on a case — NHAPOA clarifications, NOS scrutiny
 * notes, anything where one officer has to tell another why.
 *
 * It is `EventList` plus a composer, and that is deliberate: a remark and an
 * audit entry are the same object, so they render identically and a reader
 * moving between the two screens is not learning a second layout.
 *
 * Three rules:
 *
 * 1. **Oldest first.** A thread is a conversation and is read downward. An audit
 *    log is newest-first because nobody reads it from the beginning. Getting
 *    this backwards is the most common defect in this pattern.
 * 2. **A remark is never edited in place.** There is no edit control, and there
 *    will not be one: on a departmental record, a remark that can change after
 *    another officer has acted on it is not a record. A correction is a new
 *    remark.
 * 3. **A closed thread SAYS it is closed.** `closedReason` replaces the composer
 *    with the reason. Hiding the box silently is how a reader concludes the page
 *    failed to load.
 */
export function CommentThread({
  comments,
  label,
  onSubmit,
  composerLabel = "Add a remark",
  submitLabel = "Post remark",
  closedReason,
  maxLength = 1000,
  emptyText = "No remarks on this application yet.",
  className,
}: CommentThreadProps): React.JSX.Element {
  const [text, setText] = React.useState("");
  const id = React.useId();
  const trimmed = text.trim();
  const remaining = maxLength - text.length;
  // The counter appears only once it is worth watching. From the first keystroke
  // it is a number nobody needs and everybody reads.
  const showCount = text.length >= maxLength * 0.8;

  const events: EventItem[] = comments.map((comment) => ({
    id: comment.id,
    at: comment.at,
    actor: comment.author,
    actorRole: comment.authorRole,
    action: comment.author ?? "System",
    note: comment.body,
    icon: "chat_bubble",
    unread: comment.unread,
  }));

  function submit(event: React.FormEvent): void {
    event.preventDefault();
    if (!trimmed || !onSubmit) return;
    onSubmit(trimmed);
    setText("");
  }

  return (
    <div className={cn("ds-thread", className)}>
      <EventList events={events} label={label} emptyText={emptyText} />
      {closedReason ? (
        <p className="ds-thread__closed">{closedReason}</p>
      ) : onSubmit ? (
        <form className="ds-thread__composer" onSubmit={submit}>
          <label className="ds-thread__label" htmlFor={`${id}-text`}>
            {composerLabel}
          </label>
          <textarea
            id={`${id}-text`}
            className="ds-thread__input"
            value={text}
            onChange={(event) => setText(event.target.value.slice(0, maxLength))}
            maxLength={maxLength}
            rows={3}
            aria-describedby={showCount ? `${id}-count` : undefined}
          />
          <div className="ds-thread__foot">
            <p id={`${id}-count`} className="ds-thread__count" aria-live="polite">
              {showCount ? `${remaining} characters remaining` : ""}
            </p>
            <Button type="submit" size="sm" disabled={trimmed.length === 0}>
              {submitLabel}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
