/**
 * DS Audit: Button ✅ existing · Input ✅ existing · FormField ✅ existing ·
 *           Alert ✅ existing · gate layout ➕ app-local.
 *
 * The layout is deliberately NOT added to @mosje/design-system: this is a
 * deployment access wall for the hosted prototype, not a product surface any
 * portal will reuse. Portal sign-in screens use `PortalLoginShell` instead.
 */

import type { Metadata } from "next";
import { safeNextPath } from "@/lib/site-gate";
import { unlock } from "./actions";
import { GateForm } from "./gate-form";

export const metadata: Metadata = {
  title: "Access — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const target = safeNextPath(next);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-line bg-surface p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- the gate
                must render before any gated route, and next/image's /_next/image
                endpoint is deliberately outside the gate's asset allowlist. */}
            <img
              src="/images/National-Emblem-logo.svg"
              alt="National Emblem of India"
              width={48}
              height={72}
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-ink">MoSJE Digital Estate</h1>
              <p className="mt-1 text-sm text-ink-muted">
                Ministry of Social Justice &amp; Empowerment
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-surface-muted px-4 py-3 text-center">
            <p className="text-sm text-ink-muted">
              This is a <strong className="font-semibold text-ink">work-in-progress
              prototype</strong> shared for review. Enter the access password to
              continue.
            </p>
          </div>

          <GateForm action={unlock} next={target} invalid={error === "1"} />
        </div>

        <p className="mt-6 text-center text-xs text-ink-hint">
          Not for public distribution. Content is illustrative and does not
          represent published government data.
        </p>
      </div>
    </main>
  );
}
