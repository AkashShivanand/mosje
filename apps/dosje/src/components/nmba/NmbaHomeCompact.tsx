import Link from "next/link";
import { ArrowRight, HeartHandshake, MapPin, Users, Phone } from "lucide-react";
import { PLEDGE_STATS, TOTAL_CENTRES, HELPLINE } from "@/content/deaddiction-centres";

// Compact homepage entry points for the Nasha Mukt Bharat Abhiyaan.
// The full experiences live on inner pages / the NMBA portal — these tiles just
// route there. Cross-app links use a plain <a> (bypass the `/website` basePath);
// the internal locator link uses next/link.
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
            Join the national movement for a drug-free India.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {/* Pledge — two channels */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <span className="mt-3 text-[16px] font-semibold text-ink">Take the pledge</span>
            <span className="mt-0.5 flex-1 text-[13px] text-ink-muted">{pledgedLakh} lakh+ Indians have pledged</span>
            <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-semibold text-gov-blue">
              <a href="/portals/nmba/epledge?channel=non-user" className="inline-flex items-center gap-1 hover:text-gov-blue-dark">
                Non-user <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href="/portals/nmba/epledge?channel=recovered" className="inline-flex items-center gap-1 hover:text-gov-blue-dark">
                Recovered <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </span>
          </div>

          {/* Find a centre — inner page */}
          <Link href="/de-addiction-centres" className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gov-blue/40 hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="mt-3 text-[16px] font-semibold text-ink">Find a centre near you</span>
            <span className="mt-0.5 flex-1 text-[13px] text-ink-muted">{TOTAL_CENTRES} de-addiction centres nationwide</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gov-blue">
              Locate a centre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Become a Mitr — portal */}
          <a href="/portals/nmba/register-mitr" className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gov-blue/40 hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <Users className="h-5 w-5" />
            </span>
            <span className="mt-3 text-[16px] font-semibold text-ink">Become a Nasha Mukti Mitr</span>
            <span className="mt-0.5 flex-1 text-[13px] text-ink-muted">Volunteer for a drug-free India</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gov-blue">
              Register <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        <p className="mt-5 text-center text-[13px] text-ink-muted">
          <Phone className="mr-1.5 inline h-3.5 w-3.5 align-[-2px] text-gov-blue" aria-hidden />
          24×7 Drug De-addiction Helpline ·{" "}
          <a href={`tel:${HELPLINE}`} className="font-bold text-gov-blue-dark hover:underline">{HELPLINE}</a>
        </p>
      </div>
    </section>
  );
}
