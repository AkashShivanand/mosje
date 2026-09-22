"use client";

import { useEffect } from "react";
import { ErrorView } from "@mosje/design-system";

/**
 * E-Utthan's error boundary is the design system's ErrorView, as every other boundary
 * in the estate is. Until 2026-09-22 it was a hand-built heading and a raw
 * "Try again" button — the one boundary that did not match the rest.
 */
export default function EutthanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("E-Utthan error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center p-6">
      <ErrorView
        kind="500"
        badge="500 · Portal Error"
        title="Something Went Wrong"
        description="This E-Utthan page could not be loaded. Try again, or return to the dashboard."
        searchUrl={null}
        primaryAction={{ label: "Try Again", onClick: reset, icon: "refresh" }}
        secondaryAction={{ label: "Back to Dashboard", href: "/portals/eutthan-admin/dashboard", icon: "arrow_back" }}
        errorDetails={error.digest ? `Error Digest: ${error.digest}\nMessage: ${error.message}` : error.message || "Unknown error"}
      />
    </main>
  );
}
