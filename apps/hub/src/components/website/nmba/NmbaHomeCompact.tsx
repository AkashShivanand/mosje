import Image from "next/image";
import Link from "next/link";
import { HELPLINE } from "@/content/website/deaddiction-centres";
import { Icon } from "@mosje/design-system";

export function NmbaHomeCompact() {
  return (
    <section className="bg-surface" aria-labelledby="nmba-compact-heading">
      <div className="sa-container py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 id="nmba-compact-heading" className="text-[28px] sm:text-[32px] font-semibold leading-tight text-primary-dark">
              Nasha Mukt Bharat Abhiyaan
            </h2>
            <p className="mt-2 text-[15px] sm:text-[16px] text-ink-muted">
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

        {/* Get-involved pair: pledge + volunteer */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Take the pledge */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold text-ink">Take the pledge</h3>
                <Link
                  href="/portals/nmba/epledge"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  All Pledges <Icon name="arrow_forward" size={14} />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-y border-gray-150 py-4">
                <div>
                  <dd className="text-[28px] sm:text-[32px] font-bold text-primary-dark leading-none">
                    25,20,056
                  </dd>
                  <dt className="mt-1 text-[12px] font-medium text-ink-muted uppercase tracking-wide">
                    Total Pledges Taken
                  </dt>
                </div>
                <div>
                  <dd className="text-[28px] sm:text-[32px] font-bold text-primary-dark leading-none">
                    6,60,523
                  </dd>
                  <dt className="mt-1 text-[12px] font-medium text-ink-muted uppercase tracking-wide">
                    Youth Pledges Taken
                  </dt>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/portals/nmba/epledge?channel=non-user"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                I&rsquo;m a non-user <Icon name="arrow_forward" size={16} />
              </a>
              <a
                href="/portals/nmba/epledge?channel=recovered"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 px-5 py-2.5 text-[14px] font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                I&rsquo;m a recovered user <Icon name="arrow_forward" size={16} />
              </a>
            </div>
          </div>

          {/* Become a Mitr */}
          <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-primary-dark to-primary p-6 text-white shadow-sm">
            <div>
              <span className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Nasha Mukti Mitr
              </span>
              <h3 className="mt-4 text-[22px] font-bold text-white">Become a Nasha Mukti Mitr</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/90">
                Volunteer to spread awareness and support drug-demand reduction in your community — no prior experience needed. Join thousands of dedicated volunteers across the country.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="/portals/nmba/register-mitr"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold text-primary transition-colors hover:bg-white/90 shadow-xs"
              >
                Register as a volunteer <Icon name="arrow_forward" size={16} />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[14px] text-ink-muted">
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
