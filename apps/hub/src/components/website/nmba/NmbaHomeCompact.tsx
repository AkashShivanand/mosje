import Image from "next/image";
import { HELPLINE } from "@/content/website/deaddiction-centres";
import { Icon } from "@mosje/design-system";

/**
 * The two pledge channels, each with the count that belongs to IT.
 *
 * The build showed these two figures as "Total Pledges Taken" and "Youth
 * Pledges Taken". Neither label was right: they are the non-user and
 * recovered-user subtotals, and they sum to 31,80,579 — the running total the
 * design prints in the card header. Relabelling them as a total and a youth
 * count made the larger figure claim to be the whole movement while actually
 * counting one channel of it [WEB-M-02].
 *
 * Counts are integers so the header total is derived, not restated.
 */
const PLEDGE_CHANNELS = [
  {
    key: "non-user",
    count: 2_520_056,
    title: "I\u2019m a non-user",
    blurb:
      "Stay drug-free and help spread awareness where you live, study and work.",
    href: "/portals/nmba/epledge?channel=non-user",
  },
  {
    key: "recovered",
    count: 660_523,
    title: "I\u2019m a recovered user",
    blurb: "Stay on your recovery journey and inspire others to seek help.",
    href: "/portals/nmba/epledge?channel=recovered",
  },
] as const;

/** 25,20,056 — lakh/crore grouping, not the 2,520,056 `toLocaleString` gives by default. */
function formatIndian(value: number): string {
  return value.toLocaleString("en-IN");
}

export function NmbaHomeCompact() {
  return (
    <section className="bg-surface" aria-labelledby="nmba-compact-heading">
      <div className="sa-container py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 id="nmba-compact-heading" className="text-headline-2 text-primary-dark">
              Nasha Mukt Bharat Abhiyaan
            </h2>
            <p className="mt-2 text-body-1 text-ink-muted">
              Join the movement for a drug-free India — take the pledge or volunteer as a Nasha Mukti Mitr.
            </p>
          </div>
          <Image
            src="/website/images/org-logos/nmba.png"
            alt="NMBA Emblem"
            width={56}
            height={56}
            className="h-14 w-14 object-contain self-start md:self-auto"
          />
        </div>

        {/* 68 / 32, not 50 / 50 — the pledge card carries two persona rows and
            the volunteer card one paragraph [WEB-M-04]. */}
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          {/* Take the pledge */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-title-1 text-ink">Take the pledge</h3>
              {/* The running total the design puts here. It was an "All Pledges"
                  link, so the page never showed how many had pledged
                  [WEB-M-03]. Summed from the rows rather than written out, so
                  the headline cannot drift from the two figures under it. */}
              <p className="text-body-2 text-ink-muted">
                <span className="font-bold text-primary-dark">
                  {formatIndian(
                    PLEDGE_CHANNELS.reduce((total, c) => total + c.count, 0),
                  )}
                </span>{" "}
                Indians have already pledged
              </p>
            </div>

            {/* Persona ROWS. The build showed a statistic pair over two buttons,
                which split each persona's count away from the persona it
                belonged to — and mislabelled them in the process [WEB-M-02]. */}
            <div className="mt-5 divide-y divide-gray-150 border-y border-gray-150">
              {PLEDGE_CHANNELS.map((channel) => (
                <div
                  key={channel.key}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="sm:w-[38%] sm:shrink-0">
                    <span className="block text-headline-3 tabular-nums text-primary-dark">
                      {formatIndian(channel.count)}
                    </span>
                    <span className="mt-1 block text-label-3 uppercase text-ink-muted">
                      Pledges
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-title-2 text-ink">
                      {channel.title}
                    </h4>
                    <p className="mt-0.5 text-body-2 text-ink-muted">
                      {channel.blurb}
                    </p>
                  </div>

                  <a
                    href={channel.href}
                    className="flex shrink-0 items-center gap-1 self-start text-label-1 text-primary-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:self-center"
                  >
                    Pledge <Icon name="arrow_forward" size={16} aria-hidden />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Become a Mitr */}
          <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-primary-dark to-primary p-6 text-white shadow-sm md:col-span-4">
            <div>
              <span className="inline-block rounded bg-white/20 px-3 py-1 text-label-3 uppercase text-white">
                Nasha Mukti Mitr
              </span>
              <h3 className="mt-4 text-title-1 text-white">Become a Nasha Mukti Mitr</h3>
              <p className="mt-3 text-body-1 text-white/90">
                Volunteer to spread awareness and support drug-demand reduction in your community — no prior experience needed. Join thousands of dedicated volunteers across the country.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="/portals/nmba/register-mitr"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-label-1 text-primary transition-colors hover:bg-white/90 shadow-xs"
              >
                Register as a volunteer <Icon name="arrow_forward" size={16} />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-body-2 text-ink-muted">
          <Icon name="call" size={16} className="mr-1.5 inline align-[-3px] text-primary" aria-hidden />
          24×7 Drug De-addiction Helpline ·{" "}
          <a href={`tel:${HELPLINE}`} className="font-bold text-primary-dark hover:underline">
            {HELPLINE}
          </a>
        </p>
      </div>
    </section>
  );
}
