/**
 * DS Audit: Select ✅ existing · Button ✅ existing · Input ✅ existing ·
 *           FormField ✅ existing · Alert ✅ existing · Badge ✅ existing ·
 *           Icon ✅ existing · page layout ➕ app-local (matches /admin's
 *           back-of-house register). No new DS components.
 *
 * The estate registry editor. `DEFAULT_APPS` stays the only place entries are
 * born; this page writes a sparse patch over it, so anything left alone here
 * keeps following the code.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  DEFAULT_APPS,
  applyRegistryOverrides,
  effectiveStatus,
  type AppEntry,
} from "@mosje/design-system/registry";
import { Button } from "@mosje/design-system";
import { requireAdmin } from "@/lib/admin/auth";
import { settingsConfigured } from "@/lib/settings/store";
import { readRegistryConfig } from "@/lib/registry/config";
import { resetRegistry, saveRegistry } from "./actions";
import { RegistryForm, type RegistryRow } from "./registry-form";

export const metadata: Metadata = {
  title: "Estate registry — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

/** Auth-gated and must show what was actually saved: never cache this. */
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  store:
    "The settings store rejected the write, so nothing was saved. The estate is still running on its previous configuration.",
  payload: "That submission could not be read, so nothing was saved.",
  size: "That configuration is too large to store, so nothing was saved.",
  invalid: "That configuration failed validation, so nothing was saved.",
};

export default async function AdminPortalsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const { error, saved } = await searchParams;

  // Read uncached: this page must show what is stored, not what a cached
  // render decided a few minutes ago.
  const config = await readRegistryConfig();
  const byPath = new Map(DEFAULT_APPS.map((entry) => [entry.path, entry]));

  // includeHidden, because the whole point of the page is to offer unhiding
  // what is hidden.
  const ordered = applyRegistryOverrides(DEFAULT_APPS, config, {
    includeHidden: true,
  });

  const rows: RegistryRow[] = ordered.map((merged: AppEntry) => {
    const code = byPath.get(merged.path)!;
    const override = config?.entries[merged.path] ?? {};
    return {
      path: merged.path,
      group: code.group,
      status: effectiveStatus(code, config),
      code: {
        name: code.name,
        desc: code.desc ?? "",
        org: code.org ?? "",
        abbr: code.abbr ?? "",
        category: code.category ?? "",
        status: code.status ?? "live",
      },
      override: {
        name: override.name ?? "",
        desc: override.desc ?? "",
        org: override.org ?? "",
        abbr: override.abbr ?? "",
        category: override.category ?? "",
      },
    };
  });

  const overrideCount = Object.keys(config?.entries ?? {}).length;

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-6">
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
          <Button href="/admin" appearance="outlined" size="sm">
            Settings
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/admin" className="hover:text-gov-blue hover:underline">
                Settings
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink">
              Estate registry
            </li>
          </ol>
        </nav>

        <h1 className="text-2xl font-bold tracking-tight text-ink">Estate registry</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">
          What the estate advertises and links to. Changes apply to the deployed
          prototype at once — there is no separate publish step. Hiding an entry
          also stops its URL working for everyone except you.
        </p>

        <RegistryForm
          rows={rows}
          saveAction={saveRegistry}
          resetAction={resetRegistry}
          storeConfigured={settingsConfigured()}
          overrideCount={overrideCount}
          savedMessage={
            saved === "reset"
              ? "Every override was cleared. The estate now follows the code defaults."
              : saved === "1"
                ? "Saved. The estate is showing this configuration now."
                : undefined
          }
          errorMessage={error ? (ERRORS[error] ?? ERRORS.invalid) : undefined}
        />
      </main>
    </div>
  );
}
