import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PortalsExplorer } from "@/components/portals-explorer";
import { resolvePortals } from "@/lib/registry/resolve";

export const metadata: Metadata = {
  title: "Portals — MoSJE Digital Estate",
  description:
    "Browse every workflow portal across the Ministry of Social Justice & Empowerment — schemes, scholarships, finance corporations and commissions.",
};

export default async function PortalsPage() {
  const portals = await resolvePortals();

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded-lg focus:bg-gov-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary"
      >
        Skip to main content
      </a>

      <SiteHeader current="/portals" />

      <main id="main-content" className="flex-1">
        {/* Header band */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-10">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-ink-muted">
                <li>
                  <Link href="/" className="hover:text-gov-blue hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-ink">
                  Portals
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Workflow Portals
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
              Authenticated portals for managing schemes, scholarships, finance
              corporations, social-defence programmes and statutory commissions
              under the Ministry of Social Justice &amp; Empowerment.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <PortalsExplorer portals={portals} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
