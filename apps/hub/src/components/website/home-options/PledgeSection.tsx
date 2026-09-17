import Image from "next/image";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PLEDGE_POINTS } from "@/lib/scw/mock-data";

/**
 * "Take a Pledge" — Senior Citizens Welfare and Nasha Mukt Bharat Abhiyaan, side by side.
 *
 * A · `cards` two equal cards, each with its mark, the pledge's opening line and its action
 * B · `band`  one brand band, two actions — lighter, for a page that already runs long
 *
 * The NMBA count is the published running total (same figures as NmbaHomeCompact).
 * SCW publishes no pledge count, so none is shown — a metric neither source publishes
 * is left off the design (live-data-fallback.md).
 */

const NMBA_TOTAL = (2_520_056 + 660_523).toLocaleString("en-IN");

const PLEDGES = [
  {
    key: "scw",
    title: "Pledge for Senior Citizens",
    scheme: "Senior Citizens Welfare",
    mark: "/website/images/org-logos/scw.png",
    line: PLEDGE_POINTS[0] ?? "",
    href: "/portals/scw/epledge",
    stat: null as string | null,
  },
  {
    key: "nmba",
    title: "Pledge for a Drug-Free India",
    scheme: "Nasha Mukt Bharat Abhiyaan",
    mark: "/website/images/org-logos/nmba.png",
    line: "I pledge to stay away from drugs and to help build a drug-free India where I live, study and work.",
    href: "/portals/nmba/epledge",
    stat: `${NMBA_TOTAL} pledges taken`,
  },
];

/** Option A — twin cards. */
export function PledgeCards() {
  return (
    <section className="bg-primary-50" aria-labelledby="pledge-heading">
      <div className="sa-container py-12 md:py-16">
        <SectionTitle
          headingId="pledge-heading"
          title="Take a Pledge"
          description="Join citizens across India in commitments made under the Department's national campaigns."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {PLEDGES.map((p) => (
            <article key={p.key} className="flex flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Image src={p.mark} alt="" width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
                <div>
                  <p className="text-label-3 uppercase text-ink-muted">{p.scheme}</p>
                  <h3 className="mt-0.5 text-title-1 text-ink">{p.title}</h3>
                </div>
              </div>
              <blockquote className="mt-5 flex-1 border-l-4 border-primary pl-4 text-body-1 italic text-ink">
                {p.line}
              </blockquote>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                {p.stat ? <span className="text-body-2 text-ink-muted">{p.stat}</span> : <span />}
                <a
                  href={p.href}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-dark px-5 py-2.5 text-label-1 text-white transition-colors hover:bg-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Take the Pledge <Icon name="arrow_forward" size={16} aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Option B — one band, two actions. */
export function PledgeBand() {
  return (
    <section className="bg-surface" aria-labelledby="pledge-heading">
      <div className="sa-container py-10">
        <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-primary-900 to-primary-dark p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl">
            <h2 id="pledge-heading" className="text-headline-3 text-white">
              Take a Pledge
            </h2>
            <p className="mt-2 text-body-1 text-white/90">
              Stand with India&apos;s senior citizens, and for a drug-free India.
            </p>
          </div>
          <ul className="flex flex-col gap-3 sm:flex-row">
            {PLEDGES.map((p) => (
              <li key={p.key}>
                <a
                  href={p.href}
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-primary-dark transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Image src={p.mark} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
                  <span className="flex flex-col">
                    <span className="text-label-1">{p.title}</span>
                    <span className="text-body-3 text-ink-muted">{p.stat ?? p.scheme}</span>
                  </span>
                  <Icon name="arrow_forward" size={16} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
