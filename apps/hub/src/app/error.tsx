"use client";

import { useEffect } from "react";
import { ErrorView } from "@mosje/design-system";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-surface-base">
      <ErrorView
        kind="500"
        badge="500 · System Error"
        title="Application Error"
        description="An unexpected error occurred in the MoSJE digital platform. Please try again or return to the main website."
        searchUrl="/website/search?q="
        primaryAction={{
          label: "Try Again",
          onClick: reset,
          icon: "refresh",
        }}
        secondaryAction={{
          label: "Return to Homepage",
          href: "/website",
          icon: "home",
        }}
        errorDetails={
          error.digest
            ? `Error Digest: ${error.digest}\nMessage: ${error.message}`
            : error.message || "Unknown error"
        }
      />
    </main>
  );
}
