"use client";

import { useEffect } from "react";
import { ErrorView } from "@mosje/design-system";

export default function PortalsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portal error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-surface-base">
      <ErrorView
        kind="500"
        badge="500 · Portal Error"
        title="Portal Session Error"
        description="An unexpected error occurred while loading this portal workflow. Your transaction data has been preserved where possible."
        searchUrl={null}
        primaryAction={{
          label: "Try Again",
          onClick: reset,
          icon: "refresh",
        }}
        secondaryAction={{
          label: "Back to Portals",
          href: "/portals",
          icon: "arrow_back",
        }}
        errorDetails={
          error.digest
            ? `Error Digest: ${error.digest}\nMessage: ${error.message}`
            : error.message || "Unknown portal error"
        }
      />
    </main>
  );
}
