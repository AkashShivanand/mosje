import Link from "next/link";
import { Icon } from "@mosje/design-system";

export const metadata = {
  title: "E-Anudaan — choose how to sign in | SAMAVESH · MoSJE",
};

/**
 * Portal landing. E-Anudaan has two audiences with separate sign-in surfaces — mirroring the
 * live deployment, which runs them as two apps on two hosts (eanudaan-admin-dev / -user-dev).
 * Here they are one portal with two login routes, which is what lets DemoDock offer the right
 * credential set for each by longest-prefix match.
 */
const ENTRIES = [
  {
    href: "/portals/e-anudaan/login",
    icon: "account_balance",
    title: "Ministry officer",
    body: "Programme Division and Integrated Finance Division officers — review, concur and sanction grant-in-aid applications.",
    cta: "Officer sign in",
  },
  {
    href: "/portals/e-anudaan/sign-in",
    icon: "corporate_fare",
    title: "NGO / Voluntary organisation",
    body: "Apply for grant-in-aid, track your applications, respond to deficiencies and file utilisation certificates.",
    cta: "NGO sign in",
  },
] as const;

export default function EAnudaanLandingPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-label-3 uppercase text-navy">
        Ministry of Social Justice &amp; Empowerment
      </p>
      <h1 className="mt-2 text-headline-1 text-ink">E-Anudaan</h1>
      <p className="mt-3 max-w-measure text-ink-muted">
        Grant-in-Aid Management Portal — for NGOs applying under SHRESHTA Mode&nbsp;2, AVYAY,
        NAPDDR and SMILE, and for the Ministry officers who examine and sanction those
        applications.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ENTRIES.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="group flex flex-col rounded-xl border border-line bg-surface p-6 shadow-card transition-colors hover:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <Icon name={e.icon} size={32} className="text-navy" />
            <h2 className="mt-4 text-title-1 text-ink">{e.title}</h2>
            <p className="mt-2 flex-1 text-body-2 text-ink-muted">{e.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-label-1 font-semibold text-navy">
              {e.cta}
              <Icon name="arrow_forward" size={16} aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-body-2 text-ink-muted">
        This is a demonstration portal on mock data. No real application is filed and no funds
        move. Use the demo console (bottom-left) for sign-in credentials.
      </p>
    </main>
  );
}
