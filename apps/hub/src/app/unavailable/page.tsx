/**
 * DS Audit: Button ✅ existing · Icon ✅ existing · page layout ➕ app-local
 *           (mirrors /gate's threshold register, which this page is a sibling
 *           of — both are walls the visitor meets instead of the thing they
 *           asked for).
 *
 * Rendered by the proxy as a 503 rewrite when an admin has switched an entry
 * off. It is deliberately not a 404: the portal exists, it is simply not on
 * show right now, and a visitor with a stale link deserves that distinction
 * rather than a dead end.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Not currently available — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

/** Reads a cookie to decide the admin note, so it can never be prerendered. */
export const dynamic = "force-dynamic";

export default async function UnavailablePage({
  searchParams,
}: {
  searchParams: Promise<{ entry?: string }>;
}) {
  const { entry } = await searchParams;
  const isAdmin = await isAdminAuthenticated();
  const name = entry?.trim();

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-xs">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-ink-muted"
          aria-hidden="true"
        >
          <Icon name="visibility_off" />
        </span>

        <h1 className="mt-6 text-headline-1 text-ink">
          {name ? `${name} is not currently available` : "Not currently available"}
        </h1>

        <p className="mt-3 text-body-2 text-ink-muted">
          This part of the estate has been switched off for now. It has not been
          removed — the link will start working again when it is switched back
          on.
        </p>

        {isAdmin && (
          <p className="mt-4 rounded-lg border border-dashed border-border bg-surface-muted px-4 py-3 text-body-3 text-ink-muted">
            You are signed in as an administrator, so you can still open this
            destination directly. This page is what everyone else sees. Change
            it under{" "}
            <Link
              href="/admin/portals"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Estate registry
            </Link>
            .
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/portals"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-1 font-semibold text-on-primary transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Browse the portals
            <Icon name="arrow_forward" size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-label-1 font-semibold text-ink transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Back to the estate
          </Link>
        </div>
      </div>
    </main>
  );
}
