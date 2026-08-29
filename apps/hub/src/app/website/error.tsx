"use client";

import { useEffect } from "react";
import { Header } from "@/components/website/Header";
import { SamaveshBanner } from "@/components/website/SamaveshBanner";
import { SiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { ErrorView } from "@mosje/design-system";

export default function WebsiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for client monitoring
    console.error("Website runtime error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main id="content" className="flex-1 bg-surface-base">
        <SamaveshBanner />
        <div className="py-12 md:py-16">
          <ErrorView
            kind="500"
            badge="500 · System Error"
            title="Unable to Load This Page"
            description="An unexpected error occurred while rendering this page. Our technical teams have received an automated log. You may try reloading the page or return to the Ministry homepage."
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
        </div>
      </main>
      <SiteFooter />
      <ImportantLinks />
    </>
  );
}
