import type * as React from "react";
import "./ministry.css";

/**
 * The reference's About Us layout (`.col-lg-4 .stickyBox .visionbox` beside
 * `.col-lg-8 .aboutcontent`): a grey summary box that stays in view while the
 * Department's text scrolls beside it. Reused by the division and organisation
 * detail pages, which the reference draws the same way.
 */
export function DbimDetailLayout({
  summary,
  aside,
  children,
}: {
  summary?: React.ReactNode;
  /** A whole side box, where a page needs more than one line in it (About Us's vision). */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const box = aside ?? (summary ? <div className="db-min-vision"><p>{summary}</p></div> : null);
  return (
    <div className={`db-min-detail${box ? "" : " db-min-detail--single"}`}>
      {box ? (
        <aside className="db-min-detail__aside" aria-label={aside ? "Vision" : "Summary"}>
          {box}
        </aside>
      ) : null}
      <div className="db-min-rich">{children}</div>
    </div>
  );
}
