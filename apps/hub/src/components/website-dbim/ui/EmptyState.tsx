import type * as React from "react";
import "./ui.css";

/**
 * The reference's centred "No Data Available." — its own wording, for a list the
 * Department has published nothing into. A search that matched nothing is a
 * different state: pass children that name the search and how to clear it.
 */
export function DbimEmptyState({ children }: { children?: React.ReactNode }) {
  return (
    <div className="db-no-data" role="status">
      {children ?? "No Data Available."}
    </div>
  );
}
