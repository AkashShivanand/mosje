import { Icon } from "@mosje/design-system";

// Entry point to the volunteer registration flow in the NMBA portal.
// Plain <a> — cross-app link into the NMBA portal, which the hub mounts natively
// at /portals/nmba (a sibling of this site, not a route within it).
export function NashaMuktiMitr() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-primary-dark px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
      <div className="max-w-2xl">
        <h3 className="text-title-1 text-white">Become a Nasha Mukti Mitr</h3>
        <p className="mt-1.5 text-body-1 text-white/70">
          Volunteer to spread awareness and support drug-demand reduction in your
          community — no prior experience needed.
        </p>
      </div>
      <a
        href="/portals/nmba/register-mitr"
        className="group inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-white px-5 py-2.5 text-label-1 text-primary-dark transition-colors hover:bg-yellow sm:self-auto"
      >
        Register as a volunteer
        <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
