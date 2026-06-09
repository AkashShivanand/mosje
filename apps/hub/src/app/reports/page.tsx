import type { Metadata } from "next";
import Link from "next/link";
import { FileBarChart } from "lucide-react";

export const metadata: Metadata = {
  title: "QC & Audit Reports — MoSJE Digital Estate",
  description:
    "Quality assurance and audit reports for the MoSJE digital estate.",
};

export default function ReportsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gov-blue-tonal text-gov-blue">
        <FileBarChart className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="mb-3 text-3xl font-bold text-ink">QC &amp; Audit Reports</h1>
      <p className="mb-8 max-w-md text-ink-muted">
        This portal will surface quality assurance audits, design QC reports,
        and accessibility compliance findings for all MoSJE digital properties.
      </p>
      <span className="rounded-full bg-border px-4 py-2 text-sm font-semibold text-ink-muted">
        Coming soon
      </span>
      <Link
        href="/"
        className="mt-8 text-sm text-gov-blue hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gov-blue"
      >
        ← Back to home
      </Link>
    </main>
  );
}
