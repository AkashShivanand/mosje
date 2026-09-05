/**
 * DS Audit: Button ✅ existing · PasswordInput ✅ existing (added with the gate)
 *           · FormField ✅ existing · Alert ✅ existing · page layout ➕ app-local.
 *
 * Deliberately plainer than /gate. The gate is the threshold and is dressed
 * accordingly; this is back-of-house and should look like a tool, not a door.
 * The shared signal between them is type scale and the emblem lockup — no
 * gradient, no glow here.
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { adminConfigured, isAdminAuthenticated } from "@/lib/admin/auth";
import { submitAdminLogin } from "./actions";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign-in — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

/**
 * Never prerender. When ADMIN_PASSWORD is unset at build time the notFound()
 * below short-circuits before anything reads a cookie, so Next would happily
 * bake this route into a permanent 404. It must be evaluated per request.
 */
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // No configured password means no admin surface at all — 404 rather than a
  // form that can never be satisfied.
  if (!adminConfigured()) notFound();
  if (await isAdminAuthenticated()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-6 py-16">
      <div className="w-full max-w-[26rem]">
        <div className="flex items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- /admin sits
              outside the gate, and next/image's endpoint is not in its allowlist. */}
          <img
            src="/images/National-Emblem-logo.svg"
            alt="National Emblem of India"
            width={24}
            height={39}
            className="estate-emblem h-9 w-auto"
          />
          <span className="flex flex-col border-l border-border pl-3.5">
            <span className="text-title-2 text-ink">MoSJE</span>
            <span className="mt-1.5 text-label-3 uppercase text-ink-muted">
              Hub administration
            </span>
          </span>
        </div>

        <div className="mt-7 rounded-xl border border-border bg-surface p-7 shadow-xs">
          <h1 className="text-headline-3 text-ink">Sign in</h1>
          <p className="mt-1.5 text-body-2 text-ink-muted">
            Settings for the deployed prototype.
          </p>

          <AdminLoginForm action={submitAdminLogin} invalid={error === "1"} />
        </div>

        <p className="mt-6 text-center text-body-3 text-ink-hint">
          This is not the review password. Ask the maintainer if you need access.
        </p>
      </div>
    </main>
  );
}
