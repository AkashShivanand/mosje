import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReportsExplorer } from "@/components/reports-explorer";

export const metadata: Metadata = {
  title: "Reports — MoSJE Digital Estate",
  description:
    "Design QC, accessibility and audit reports for MoSJE digital properties.",
};

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary"
      >
        Skip to main content
      </a>

      <SiteHeader current="/reports" />

      <main id="main-content" className="flex-1">
        {/* Header band */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-10">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-ink-muted">
                <li>
                  <Link href="/" className="hover:text-primary hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-ink">
                  Reports
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              QC &amp; Audit Reports
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
              Design quality control, accessibility and audit reports for the
              MoSJE digital estate.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <ReportsExplorer />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
