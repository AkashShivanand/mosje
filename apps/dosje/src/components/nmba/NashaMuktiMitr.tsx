import { ArrowRight, HandHeart } from "lucide-react";

// Entry point to the volunteer registration flow in the NMBA portal.
// Plain <a> — cross-app link that must bypass this site's `/website` basePath.
export function NashaMuktiMitr() {
  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-gov-blue-dark to-gov-blue">
      <div className="flex flex-col items-start gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
            <HandHeart className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-[22px] font-semibold leading-tight text-white">
              Become a Nasha Mukti Mitr
            </h3>
            <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-white/80">
              Volunteer to spread awareness and support drug-demand reduction in your
              community. Join thousands working towards a drug-free India.
            </p>
          </div>
        </div>
        <a
          href="/portals/nmba/register-mitr"
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[15px] font-semibold text-gov-blue-dark shadow-sm transition hover:bg-white/90"
        >
          Register now
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
