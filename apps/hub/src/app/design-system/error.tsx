"use client";

import { useEffect } from "react";

/**
 * The documentation's own error boundary.
 *
 * Without one, a render failure on any of the 122 design-system pages escapes to
 * the application-level boundary — which replaces the whole screen, so the
 * reader loses the sidebar, the search and the trail that would let them get to
 * a page that works. A segment boundary keeps the chrome and replaces only the
 * article, which is the difference between "this page is broken" and "the design
 * system is down".
 *
 * It says what failed and offers the retry, and it prints no digest, no stack
 * and no message — `.claude/rules/data-state-completeness.md` §4. The details go
 * to the console, where the person who can act on them is looking.
 */
export default function DesignSystemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Design system page error:", error);
  }, [error]);

  return (
    <article className="docs-article cdp" role="alert">
      <header className="cdp__header">
        <div className="cdp__titlerow">
          <h1 className="cdp__title">This Page Could Not Be Shown</h1>
        </div>
        <p className="cdp__summary">
          Something went wrong while rendering this documentation page. The rest of the design
          system is unaffected — the navigation beside this message still works.
        </p>
        <div className="cdp__meta">
          <button type="button" className="cdp__figma" onClick={reset}>
            Try again
          </button>
        </div>
      </header>
    </article>
  );
}
