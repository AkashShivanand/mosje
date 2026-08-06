/**
 * DS Audit: Button ✅ existing · Input ✅ existing · FormField ✅ existing ·
 *           Alert ✅ existing · page layout ➕ app-local.
 */

import type { Metadata } from "next";
import { Button } from "@mosje/design-system";
import { requireAdmin } from "@/lib/admin/auth";
import { changeGatePassword, signOut } from "./actions";
import { GatePasswordForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Hub settings — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

/** Auth-gated and per-request: never prerender or cache this. */
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const { error, saved } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Hub settings</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Settings for the deployed prototype.
          </p>
        </div>
        <form action={signOut}>
          <Button type="submit" appearance="outlined" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      <section className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-base font-semibold text-ink">Review password</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The shared password reviewers enter to reach the prototype. Changing it
          signs everyone out.
        </p>

        <GatePasswordForm action={changeGatePassword} error={error} saved={saved === "1"} />
      </section>

      <p className="mt-6 text-xs text-ink-hint">
        If the settings store is unreachable, the gate falls back to the
        SITE_PASSWORD environment variable, so the estate stays reachable.
      </p>
    </main>
  );
}
