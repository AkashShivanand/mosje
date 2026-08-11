/**
 * DS Audit: Button ✅ existing · PasswordInput ✅ existing · FormField ✅
 *           existing · Alert ✅ existing · page layout ➕ app-local.
 *
 * Back-of-house register: a slim utility bar, a labelled settings section, and
 * no decoration. The two-column split (what the setting is on the left, the
 * control on the right) is the standard settings shape and scales as more
 * settings arrive.
 */

import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-6">
          <div className="flex flex-1 items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- /admin sits
                outside the gate, and next/image's endpoint is not in its allowlist. */}
            <img
              src="/images/National-Emblem-logo.svg"
              alt=""
              width={22}
              height={36}
              className="estate-emblem h-8 w-auto"
            />
            <span className="flex flex-col border-l border-border pl-3.5 leading-none">
              <span className="text-[15px] font-bold tracking-tight text-ink">MoSJE</span>
              <span className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Hub administration
              </span>
            </span>
          </div>

          <form action={signOut}>
            <Button type="submit" appearance="outlined" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          Changes apply to the deployed prototype at once — there is no separate
          publish step.
        </p>

        <section
          aria-labelledby="review-password-heading"
          className="mt-10 grid gap-6 border-t border-border pt-10 md:grid-cols-[15rem_1fr]"
        >
          <div>
            <h2
              id="review-password-heading"
              className="text-base font-semibold tracking-tight text-ink"
            >
              Review password
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              The shared password reviewers enter to reach the prototype.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-hint">
              Changing it signs everyone out, including you on other devices.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-xs">
            <GatePasswordForm
              action={changeGatePassword}
              error={error}
              saved={saved === "1"}
            />
          </div>
        </section>

        <section
          aria-labelledby="registry-heading"
          className="mt-10 grid gap-6 border-t border-border pt-10 md:grid-cols-[15rem_1fr]"
        >
          <div>
            <h2
              id="registry-heading"
              className="text-base font-semibold tracking-tight text-ink"
            >
              Estate registry
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              Which portals and destinations the estate shows, in what order,
              under what name.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-hint">
              Hiding an entry also blocks its URL for everyone but you.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-xs">
            <p className="text-sm leading-relaxed text-ink-muted">
              Set each entry to live, planned or hidden, reorder it within its
              category, and override the name or description the estate shows.
            </p>
            <div className="mt-4">
              <Button href="/admin/portals" appearance="outlined">
                Open estate registry
              </Button>
            </div>
          </div>
        </section>

        <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-ink-hint">
          If the settings store is unreachable the gate falls back to the
          SITE_PASSWORD environment variable, so the estate stays reachable even
          when this page cannot save.{" "}
          <Link
            href="/"
            className="font-semibold text-gov-blue underline-offset-2 hover:underline"
          >
            Back to the estate
          </Link>
        </p>
      </main>
    </div>
  );
}
