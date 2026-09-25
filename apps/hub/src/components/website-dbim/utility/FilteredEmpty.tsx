"use client";

import { Button } from "@mosje/design-system";

/**
 * "Filtered to nothing": the reader's own search excluded everything. Worded
 * differently from "No Data Available." (nothing published) and it names the search
 * and offers to clear it, because the reader caused this state and can undo it.
 */
export function DbimFilteredEmpty({ query, noun, onClear }: { query: string; noun: string; onClear: () => void }) {
  return (
    <div className="db-u-filtered" role="status">
      <p className="db-u-filtered__text">
        No {noun} match <q>{query.trim()}</q>.
      </p>
      <Button type="button" appearance="text" className="db-u-btn db-u-btn--primary" onClick={onClear}>
        Clear Search
      </Button>
    </div>
  );
}
