import Link from "next/link";
import { TgHeader } from "@/components/tg/gov-chrome";

/**
 * TG portal landing — two entry points mirroring the two live subdomains:
 * the citizen/applicant journey (tg-user-dev) and the officer/admin review
 * console (tg-admin-dev). Kept lightweight; the zone shells live under
 * /(citizen) and /(admin). Corrected-to-design per issue #19.
 */
export default function TgLandingPage() {
  return (
    <main className="min-h-screen bg-surface-muted">
      <TgHeader />

      <section className="container py-12">
        <p className="text-label-3 uppercase text-navy">
          National Portal for Transgender Persons
        </p>
        <h1 className="mt-2 max-w-2xl text-headline-1 text-ink">
          Apply for and track your Transgender Identity Certificate — and access welfare support.
        </h1>
        <p className="mt-3 max-w-measure text-ink-muted">
          A Single Access Mechanism under SAMAVESH. Citizens apply online; officers review
          applications through a maker → checker → District Magistrate → central-admin workflow.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            href="/portals/tg/citizen/sign-in"
            className="group rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-navy/40 hover:shadow-pop"
          >
            <h2 className="text-title-1 text-navy">For Citizens</h2>
            <p className="mt-2 text-body-2 text-ink-muted">
              Apply for your certificate, track application status, raise grievances, and explore
              scholarships, skill training, Garima Greh homes, and medical support.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-label-1 font-semibold text-navy group-hover:gap-2">
              Enter citizen portal →
            </span>
          </Link>

          <Link
            href="/portals/tg/admin/login"
            className="group rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-navy/40 hover:shadow-pop"
          >
            <h2 className="text-title-1 text-navy">For Officers</h2>
            <p className="mt-2 text-body-2 text-ink-muted">
              Examining Officer, District Magistrate, Checker, and Central Admin review consoles —
              application queues, SLA tracking, and approvals.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-label-1 font-semibold text-navy group-hover:gap-2">
              Officer sign in →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
