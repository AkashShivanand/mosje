/**
 * Shown while the register reads current statuses from the status store.
 * Shaped like the result so nothing jumps when the data lands.
 */

import { Skeleton } from "@mosje/design-system";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="sa-container flex flex-col gap-6 py-10">
      <span className="sr-only">Loading the website issue register…</span>
      <Skeleton height="2.5rem" width="60%" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {Array.from({ length: 6 }, (_, n) => (
          <Skeleton key={n} height="5rem" />
        ))}
      </div>
      <Skeleton height="8rem" />
      {Array.from({ length: 8 }, (_, n) => (
        <Skeleton key={n} height="3rem" />
      ))}
    </div>
  );
}
