import Link from "next/link";
import { NhapoaHeader } from "@/components/nhapoa/gov-chrome";
import { Icon } from "@mosje/design-system";

const CITIZEN_ACTIONS = [
  {
    href: "/portals/nhapoa/register-grievance",
    icon: "description",
    title: "Register a Grievance",
    desc: "File a complaint under the PoA Act — FIR, relief, or charge-sheet.",
  },
  {
    href: "/portals/nhapoa/register-rescue",
    icon: "support",
    title: "Register a Rescue",
    desc: "Request urgent protection or rescue assistance.",
  },
  {
    href: "/portals/nhapoa/track-status",
    icon: "search",
    title: "Track Status",
    desc: "Check the progress of a filed grievance using its reference number.",
  },
  {
    href: "/portals/nhapoa/help-faqs",
    icon: "help",
    title: "Help & FAQs",
    desc: "Understand the process, your rights, and common questions.",
  },
];

export default function CitizenHome() {
  return (
    <div className="min-h-screen">
      <NhapoaHeader
        actions={
          <Link
            href="/portals/nhapoa/login"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-label-1 font-semibold text-white transition-colors hover:bg-navy-800"
          >
            <Icon name="verified_user" size={16} /> Officer / Admin Login
          </Link>
        }
      />

      {/* Hero */}
      <main id="main">
      <section className="nha-hero text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-label-3 uppercase text-white/70">
            SAMBAL · National Helpline Against Atrocities
          </p>
          <h1 className="mt-3 max-w-3xl text-headline-1">
            Justice and relief under the Prevention of Atrocities Act
          </h1>
          <p className="mt-4 max-w-measure text-body-1 text-white/80">
            Register a grievance, request rescue, and track your case from complaint to relief — a
            single accountable workflow across every authority.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/portals/nhapoa/register-grievance"
              className="inline-flex items-center gap-2 rounded-lg bg-saffron-600 px-5 py-3 text-label-1 font-semibold text-white transition-colors hover:bg-saffron-600/90"
            >
              Register a Grievance <Icon name="arrow_forward" size={16} />
            </Link>
            <Link
              href="/portals/nhapoa/track-status"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-label-1 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Track Status
            </Link>
          </div>
        </div>
      </section>

      {/* Helpline strip */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4 text-body-2">
          <Icon name="call" size={20} className="text-saffron" />
          <span className="font-semibold text-ink">24×7 Helpline:</span>
          <span className="font-bold text-navy">1800-202-1989</span>
          <span className="text-ink-hint">·</span>
          <span className="font-bold text-navy">14566</span>
          <span className="text-ink-hint">·</span>
          <span className="text-ink-muted">Toll-free · confidential · available in regional languages</span>
        </div>
      </div>

      {/* Actions */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-headline-3 text-ink">How can we help?</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CITIZEN_ACTIONS.map(({ href, icon: iconName, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-colors hover:border-navy/30"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/10 text-navy">
                <Icon name={iconName} size={20} />
              </span>
              <h3 className="mt-4 text-title-2 text-ink">{title}</h3>
              <p className="mt-1 flex-1 text-body-2 text-ink-muted">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-label-1 font-semibold text-navy">
                Continue <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      </main>

      <footer className="border-t border-line bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-body-3">
          <span>© 2026 Ministry of Social Justice &amp; Empowerment, Government of India</span>
          <span className="text-white/60">SAMBAL · SAMAVESH</span>
        </div>
      </footer>
    </div>
  );
}
