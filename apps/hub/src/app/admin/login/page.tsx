/**
 * DS Audit: Button ✅ existing · PasswordInput ✅ existing (added with the gate)
 *           · FormField ✅ existing · Alert ✅ existing · BrandLockup ✅ existing
 *           (was a hand-rolled emblem + text pair) · page layout ➕ app-local.
 *
 * Deliberately plainer than /gate. The gate is the threshold and is dressed
 * accordingly; this is back-of-house and should look like a tool, not a door.
 * The shared signal between them is type scale and the emblem lockup — no
 * gradient, no glow here.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { BrandLockup } from "@mosje/design-system";
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
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  // No configured password means no admin surface at all — 404 rather than a
  // form that can never be satisfied.
  if (!adminConfigured()) notFound();
  const { error, next } = await searchParams;
  // Coming from the issue register: sign in again even if the admin cookie is
  // live, because the register's editor cookie may predate this build.
  if (!next && (await isAdminAuthenticated())) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-canvas px-6 py-16">
      <div className="w-full max-w-[26rem]">
        {/* The same compact lockup /admin carries in its masthead, so signing in and
            the settings page read as one place. */}
        <BrandLockup
          compact
          linkAs={Link}
          href="/admin"
          emblemSrc="/images/National-Emblem-logo.svg"
          lines={{ ministry: "MoSJE", department: "Hub administration" }}
        />

        <div className="mt-7 rounded-xl border border-border bg-surface p-7 shadow-xs">
          <h1 className="text-headline-3 text-ink">Sign in</h1>
          <p className="mt-1.5 text-body-2 text-ink-muted">
            Settings for the deployed prototype.
          </p>

          <AdminLoginForm action={submitAdminLogin} invalid={error === "1"} next={next} />
        </div>

        <p className="mt-6 text-center text-body-3 text-ink-hint">
          This is not the review password. Ask the maintainer if you need access.
        </p>
      </div>
    </main>
  );
}
