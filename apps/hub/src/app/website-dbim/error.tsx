"use client";

import { Button } from "@mosje/design-system";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import "@/components/website-dbim/layout/page.css";

/**
 * The DBIM design's error boundary. A page that failed to render says so in one
 * sentence and offers the retry — no status code, no stack (data-state-completeness.md
 * §4). The header and footer stay, because they belong to the layout above this.
 */
export default function DbimError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="db-page">
      <div className="db-container db-page__container">
        <DbimEmptyState>
          <p className="db-error__text">This page could not be loaded. Please try again.</p>
          <Button variant="primary" appearance="filled" onClick={reset} className="db-error__retry">
            Try Again
          </Button>
        </DbimEmptyState>
      </div>
    </section>
  );
}
