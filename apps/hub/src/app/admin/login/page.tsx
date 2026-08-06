/**
 * DS Audit: Button ✅ existing · Input ✅ existing · FormField ✅ existing ·
 *           Alert ✅ existing · page layout ➕ app-local.
 *
 * Layout is app-local for the same reason the gate's is: a deployment
 * administration surface is not a product screen any portal reuses.
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
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-line bg-surface p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-xl font-bold text-ink">Hub administration</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Settings for the deployed prototype
            </p>
          </div>

          <AdminLoginForm action={submitAdminLogin} invalid={error === "1"} />
        </div>

        <p className="mt-6 text-center text-xs text-ink-hint">
          This is not the review password. Ask the maintainer if you need access.
        </p>
      </div>
    </main>
  );
}
