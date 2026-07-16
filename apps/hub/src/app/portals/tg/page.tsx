import Image from "next/image";
import Link from "next/link";

/**
 * TG portal landing — two entry points mirroring the two live subdomains:
 * the citizen/applicant journey (tg-user-dev) and the officer/admin review
 * console (tg-admin-dev). Kept lightweight; the zone shells live under
 * /(citizen) and /(admin). Corrected-to-design per issue #19.
 */
export default function TgLandingPage() {
  return (
    <main className="min-h-screen bg-surface-muted">
      <header className="border-b border-line bg-navy text-white">
        <div className="container flex items-center gap-4 py-4">
          <Image
            src="/portals/tg/brand/national-emblem-white.svg"
            alt="National Emblem of India"
            width={44}
            height={62}
            className="h-11 w-auto"
          />
          <div className="leading-tight">
            <p className="text-xs text-white/80">Government of India</p>
            <p className="text-sm font-semibold">Ministry of Social Justice &amp; Empowerment</p>
            <p className="text-xs font-semibold text-white/90">
              Department of Social Justice &amp; Empowerment
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Image
              src="/portals/tg/brand/digital-india-white.svg"
              alt="Digital India"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <Image
              src="/portals/tg/brand/samavesh-logo.svg"
              alt="SAMAVESH"
              width={40}
              height={40}
              className="h-9 w-auto"
            />
          </div>
        </div>
      </header>

      <section className="container py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-navy">
          National Portal for Transgender Persons
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold text-ink">
          Apply for and track your Transgender Identity Certificate — and access welfare support.
        </h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          A Single Access Mechanism under SAMAVESH. Citizens apply online; officers review
          applications through a maker → checker → District Magistrate → central-admin workflow.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            href="/portals/tg/citizen/sign-in"
            className="group rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-navy/40 hover:shadow-pop"
          >
            <h2 className="text-xl font-semibold text-navy">For Citizens</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Apply for your certificate, track application status, raise grievances, and explore
              scholarships, skill training, Garima Greh homes, and medical support.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:gap-2">
              Enter citizen portal →
            </span>
          </Link>

          <Link
            href="/portals/tg/admin/login"
            className="group rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-navy/40 hover:shadow-pop"
          >
            <h2 className="text-xl font-semibold text-navy">For Officers</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Examining Officer, District Magistrate, Checker, and Central Admin review consoles —
              application queues, SLA tracking, and approvals.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:gap-2">
              Officer sign in →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
