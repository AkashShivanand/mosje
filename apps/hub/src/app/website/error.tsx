"use client";

import { useEffect } from "react";
import { Button } from "@mosje/design-system";
import { Masthead } from "@/components/website-next/chrome/Masthead";
import { WebsitePageHeader } from "@/components/website-next/layout/PageHeader";
import { DeadEnd } from "@/components/website-next/search/DeadEnd";

/**
 * The website's error boundary (issue X-IA-10). It says the page did not load,
 * offers Try Again, the site search and the five popular links — and nothing
 * else. No status code, digest, message or stack reaches the page: those are
 * for the server log, and the console line below keeps them there.
 *
 * WHY NO FOOTER. An error boundary must be a client component, and the site
 * footer reads the content register on the server (`getContentSyncedDate`);
 * importing it here would ship the whole ingested register to the browser in
 * this chunk. The masthead is a client component and carries the full
 * navigation, so the reader is not stranded. Recorded as a follow-up for the
 * footer's owner: take the synced date as a prop and this page can render it.
 */
export default function WebsiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Website runtime error:", error);
  }, [error]);

  return (
    <>
      <Masthead />
      <main id="content" tabIndex={-1} className="wn-main">
        <WebsitePageHeader
          title="This Page Could Not Be Loaded"
          breadcrumb={[{ label: "Page Could Not Be Loaded" }]}
          description="Something went wrong while this page was loading. Try again, or use the search and links below."
        />
        <DeadEnd
          actions={
            <Button variant="primary" size="md" onClick={reset}>
              Try Again
            </Button>
          }
        />
      </main>
    </>
  );
}
