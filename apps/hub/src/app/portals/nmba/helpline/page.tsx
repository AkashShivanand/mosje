import { PublicShell } from "@/components/nmba/public-shell";
import { Icon } from "@mosje/design-system";

export const metadata = {
  title: "Helpline — Nasha Mukt Bharat Abhiyaan",
};

const HELPLINE_NUMBERS = [
  {
    name: "National Drug De-addiction Helpline",
    number: "14446",
    hours: "24 × 7",
    description: "Free, confidential counselling and referral to de-addiction services anywhere in India.",
    primary: true,
  },
  {
    name: "iCall Psychosocial Helpline",
    number: "9152987821",
    hours: "Mon–Sat, 8 am – 10 pm",
    description: "Mental health and psychosocial support for individuals struggling with substance use.",
    primary: false,
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    hours: "24 × 7",
    description: "Free mental health helpline available in multiple languages across India.",
    primary: false,
  },
];

export default function HelplinePage() {
  return (
    <PublicShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">National Helpline</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Confidential support, counselling, and referral to de-addiction services.
        </p>
      </div>

      {/* Primary helpline */}
      <div className="mb-6 rounded-2xl bg-green-700 px-6 py-6 text-white">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Icon name="call" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Primary Helpline</p>
            <a
              href="tel:14446"
              className="mt-1 block text-4xl font-bold leading-none tracking-tight hover:underline"
            >
              14446
            </a>
            <p className="mt-2 text-sm text-white/80">
              Free · Confidential · Available 24 hours, 7 days a week
            </p>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <Icon name="error" size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-amber-800">
          All calls are free of charge and completely confidential. Trained counsellors can assist in multiple regional languages.
        </p>
      </div>

      {/* All helplines */}
      <section className="mb-8">
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-ink-muted">All Helpline Numbers</h2>
        <div className="space-y-3">
          {HELPLINE_NUMBERS.map((h) => (
            <div key={h.number} className="rounded-xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-ink">{h.name}</div>
                  <a
                    href={`tel:${h.number.replace(/-/g, "")}`}
                    className="mt-1 block text-xl font-bold text-navy hover:underline"
                  >
                    {h.number}
                  </a>
                  <p className="mt-2 text-xs text-ink-muted">{h.description}</p>
                </div>
                <div className="shrink-0 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-ink-muted">
                  {h.hours}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Find a centre */}
      <section>
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-ink-muted">Find a Centre Near You</h2>
        <div className="flex items-center gap-4 rounded-xl border border-line bg-white p-5 shadow-card">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted">
            <Icon name="location_on" size={20} className="text-navy" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">De-addiction Facility Locator</div>
            <p className="text-xs text-ink-muted">Find IRCA, ODIC, and ATF centres in your district.</p>
          </div>
          <a
            href="/portals/nmba/facilities"
            className="ml-auto shrink-0 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Find Facilities
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
