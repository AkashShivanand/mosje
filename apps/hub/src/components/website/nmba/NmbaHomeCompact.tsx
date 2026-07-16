import Link from "next/link";
import { ArrowRight, HeartHandshake, Users, MapPin, Phone } from "lucide-react";
import { PLEDGE_STATS, TOTAL_CENTRES, HELPLINE } from "@/content/website/deaddiction-centres";

// Compact homepage entry points for the Nasha Mukt Bharat Abhiyaan.
// Pledge + "become a Mitr" read as one paired "get involved" block (twin cards);
// "find a centre" is a separate slim entry to the full locator page.
// Cross-app links use a plain <a> (bypass the `/website` basePath); the internal
// locator link uses next/link.
const pledgedLakh = ((PLEDGE_STATS.ePledgesRaw + PLEDGE_STATS.recoveredPledgesRaw) / 100000).toFixed(1);

export function NmbaHomeCompact() {
  return (
    <section className="bg-[#f9fafb]" aria-labelledby="nmba-compact-heading">
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-12">
        <div className="text-center">
          <h2 id="nmba-compact-heading" className="text-[26px] font-semibold leading-tight text-gov-blue-dark">
            Nasha Mukt Bharat Abhiyaan
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-[15px] text-ink-muted">
            Join the movement for a drug-free India — take the pledge or volunteer as a Nasha Mukti Mitr.
          </p>
        </div>

        {/* Get-involved pair: pledge + volunteer */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {/* Take the pledge */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-ink">Take the pledge</h3>
            <p className="mt-1 flex-1 text-[13px] text-ink-muted">
              <span className="font-semibold text-gov-blue-dark">{pledgedLakh} lakh+</span> Indians have already
              pledged. Choose the one that applies to you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href="/portals/nmba/epledge?channel=non-user"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gov-blue px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-gov-blue-dark"
              >
                I&rsquo;m a non-user <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/portals/nmba/epledge?channel=recovered"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gov-blue/40 px-4 py-2 text-[14px] font-semibold text-gov-blue transition-colors hover:bg-gov-blue/5"
              >
                I&rsquo;m a recovered user <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Become a Mitr */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-ink">Become a Nasha Mukti Mitr</h3>
            <p className="mt-1 flex-1 text-[13px] text-ink-muted">
              Volunteer to spread awareness and support drug-demand reduction in your community — no prior
              experience needed.
            </p>
            <div className="mt-4">
              <a
                href="/portals/nmba/register-mitr"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gov-blue-dark px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Register as a volunteer <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Find a centre — separate slim entry to the full locator page */}
        <Link
          href="/de-addiction-centres"
          className="group mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:border-gov-blue/40 hover:shadow-md"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-ink">Find a de-addiction centre near you</span>
            <span className="block text-[13px] text-ink-muted">
              {TOTAL_CENTRES} Nasha Mukti Kendras nationwide · no login required
            </span>
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-gov-blue">
            Locate a centre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <p className="mt-5 text-center text-[13px] text-ink-muted">
          <Phone className="mr-1.5 inline h-3.5 w-3.5 align-[-2px] text-gov-blue" aria-hidden />
          24×7 Drug De-addiction Helpline ·{" "}
          <a href={`tel:${HELPLINE}`} className="font-bold text-gov-blue-dark hover:underline">
            {HELPLINE}
          </a>
        </p>
      </div>
    </section>
  );
}
