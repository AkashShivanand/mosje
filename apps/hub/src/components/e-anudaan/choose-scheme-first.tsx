"use client";

/**
 * What an application route answers when it has no scheme — `/apply-grant/step-1` with no scheme
 * in the path, or a scheme code the portal has no form for.
 *
 * DS Audit: Alert ✅ existing · Button ✅ · PageHeader ✅ — nothing new.
 *
 * The live portal says "Please choose a scheme first." and the clone does too. The three copies
 * this replaces had no page heading (a screen with no h1 announces nothing to a screen reader),
 * wrapped a button inside a link, and still pointed back to "Select Grant Scheme" after the menu
 * item was renamed (screen crawl, 13 Sep 2026).
 */

import { useRouter } from "next/navigation";
import { Alert, Button, PageHeader } from "@mosje/design-system";

export function ChooseSchemeFirst() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="Apply for Grant" />
      <Alert status="warning" title="Please choose a scheme first.">
        <Button appearance="outlined" size="sm" onClick={() => router.push("/portals/e-anudaan/apply-grant")}>
          Choose a Scheme
        </Button>
      </Alert>
    </div>
  );
}
