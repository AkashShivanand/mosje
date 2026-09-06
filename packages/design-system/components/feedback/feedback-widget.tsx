"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./feedback-widget.css";

export type FeedbackVerdict = "useful" | "not-useful";

export interface FeedbackSubmission {
  verdict: FeedbackVerdict;
  /** What the reader typed, or "" if they sent the verdict alone. */
  comment: string;
}

export interface FeedbackWidgetProps {
  /**
   * The question. Keep it about THIS page — a citizen can answer "did this page
   * tell you what you came for" and cannot answer "how are we doing".
   * @default "Was this page useful?"
   */
  question?: string;
  /**
   * Called when the reader sends. Returning a promise keeps the button in its
   * sending state until it settles.
   */
  onSubmit: (submission: FeedbackSubmission) => void | Promise<void>;
  /**
   * Shown after sending. Say what happens next, or say that nothing does —
   * "We read every response" is a promise; "This is not a way to contact the
   * department" is the truth a citizen needs before they type a grievance here.
   */
  thanks?: React.ReactNode;
  /**
   * Where a citizen should go if they wanted help rather than to leave a
   * comment. **Always supply it.** A feedback box is where grievances land when
   * the page offers nowhere else, and an unanswered grievance is worse than no
   * box at all.
   */
  helpHref?: string;
  /** @default "Report a problem or contact the department" */
  helpLabel?: string;
  className?: string;
}

/**
 * MoSJE / SAMAVESH Feedback widget.
 *
 * "Was this page useful?" — the page-level feedback control GIGW expects on a
 * government page, in three states: the question, the comment, and the
 * acknowledgement.
 *
 * **The comment box only appears after a verdict.** Asking for a verdict and a
 * paragraph at once gets neither: most readers will answer a two-button question
 * in passing and will not open a text field. Taking the click first means the
 * useful signal is captured even when nobody types.
 *
 * **It is deliberately not a contact form.** A feedback box on a page with no
 * visible way to reach the department becomes where grievances are filed, and a
 * grievance filed into an analytics endpoint is never answered. `helpHref`
 * exists so the reader who needed help is sent somewhere that will answer them;
 * supply it.
 *
 * The acknowledgement replaces the control rather than sitting beside it, and it
 * is announced — a reader who cannot see the layout change is otherwise left
 * wondering whether the button worked.
 */
export function FeedbackWidget({
  question = "Was this page useful?",
  onSubmit,
  thanks = "Thank you. Your response has been recorded.",
  helpHref,
  helpLabel = "Report a problem or contact the department",
  className,
}: FeedbackWidgetProps): React.JSX.Element {
  const [verdict, setVerdict] = React.useState<FeedbackVerdict | null>(null);
  const [comment, setComment] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const baseId = React.useId();
  const commentId = `${baseId}-comment`;
  const commentRef = React.useRef<HTMLTextAreaElement>(null);

  // Move focus to the comment box once it appears, so a keyboard reader is not
  // left to discover that answering revealed a new field further down.
  React.useEffect(() => {
    if (verdict && !sent) commentRef.current?.focus();
  }, [verdict, sent]);

  const send = async () => {
    if (!verdict || sending) return;
    setSending(true);
    try {
      await onSubmit({ verdict, comment: comment.trim() });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className={cn("ds-feedback", "ds-feedback--done", className)}>
        <p className="ds-feedback__thanks" role="status">
          {thanks}
        </p>
        {helpHref ? (
          <a className="ds-feedback__help" href={helpHref}>
            {helpLabel}
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("ds-feedback", className)}>
      <fieldset className="ds-feedback__ask">
        <legend className="ds-feedback__question">{question}</legend>
        <div className="ds-feedback__verdicts">
          <button
            type="button"
            className={cn(
              "ds-feedback__verdict",
              verdict === "useful" && "ds-feedback__verdict--chosen",
            )}
            aria-pressed={verdict === "useful"}
            onClick={() => setVerdict("useful")}
          >
            Yes
          </button>
          <button
            type="button"
            className={cn(
              "ds-feedback__verdict",
              verdict === "not-useful" && "ds-feedback__verdict--chosen",
            )}
            aria-pressed={verdict === "not-useful"}
            onClick={() => setVerdict("not-useful")}
          >
            No
          </button>
        </div>
      </fieldset>

      {verdict ? (
        <div className="ds-feedback__more">
          <label className="ds-feedback__label" htmlFor={commentId}>
            {verdict === "useful"
              ? "What did you come here to do? (optional)"
              : "What were you looking for? (optional)"}
          </label>
          <p className="ds-feedback__note" id={`${commentId}-note`}>
            Do not include personal information such as your Aadhaar number, bank
            details or telephone number.
          </p>
          <textarea
            ref={commentRef}
            id={commentId}
            className="ds-feedback__textarea"
            rows={3}
            maxLength={1200}
            aria-describedby={`${commentId}-note`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="ds-feedback__actions">
            <button
              type="button"
              className="ds-feedback__send"
              disabled={sending}
              onClick={send}
            >
              {sending ? "Sending…" : "Send"}
            </button>
            {helpHref ? (
              <a className="ds-feedback__help" href={helpHref}>
                {helpLabel}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
