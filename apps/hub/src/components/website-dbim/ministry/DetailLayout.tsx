import type * as React from "react";
import "./ministry.css";

/**
 * The reference's About Us layout (`.col-lg-4 .stickyBox .visionbox` beside
 * `.col-lg-8 .aboutcontent`): a grey summary box that stays in view while the
 * Department's text scrolls beside it. Reused by the division and organisation
 * detail pages, which the reference draws the same way.
 */
export function DbimDetailLayout({ summary, children }: { summary?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={`db-min-detail${summary ? "" : " db-min-detail--single"}`}>
      {summary ? (
        <aside className="db-min-detail__aside" aria-label="Summary">
          <div className="db-min-vision">
            <p>{summary}</p>
          </div>
        </aside>
      ) : null}
      <div className="db-min-rich">{children}</div>
    </div>
  );
}
