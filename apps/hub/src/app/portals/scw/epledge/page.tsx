import Link from "next/link";
import { UserShell } from "@/components/scw/user-shell";
import { Card } from "@/components/scw/ui";
import { PLEDGE_POINTS } from "@/lib/scw/mock-data";
import { Icon } from "@mosje/design-system";

export default function EpledgePage() {
  return (
    <UserShell>
      <div className="space-y-6">
        {/* Banner */}
        <div
          className="relative flex min-h-[280px] flex-col justify-center overflow-hidden rounded-2xl p-8 text-white sm:p-12"
          style={{
            // Was four raw hex/rgba values that near-duplicated the palette
            // scw.css already defines. Converged on the portal tokens
            // (--scw-navy-deep / --scw-navy / --color-heroto) so a palette
            // change lands here too; the overlay alphas come from color-mix.
            backgroundImage:
              "linear-gradient(110deg, color-mix(in srgb, var(--scw-navy-deep) 95%, transparent) 0%, color-mix(in srgb, var(--scw-navy-deep) 65%, transparent) 45%, color-mix(in srgb, var(--scw-navy-deep) 15%, transparent) 100%), linear-gradient(135deg, var(--scw-navy) 0%, var(--color-heroto) 100%)",
          }}
        >
          <p className="text-label-3 uppercase text-white/80">
            Government of India / Department of Social Justice &amp; Empowerment
          </p>
          <h1 className="mt-4 text-display-5 font-display">
            Ageing with DIGNITY
          </h1>
          <p className="mt-3 text-title-1 text-white/90">Call Toll-Free - 14567</p>
        </div>

        {/* Pledge card */}
        <Card className="-mt-12 mx-auto max-w-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-approve-bg px-3 py-1 text-label-2 text-approve-fg">
              <span className="text-approve">●</span>0 Pledges Taken Today
            </span>
            <div className="inline-flex items-center rounded-full border border-line p-0.5 text-label-2">
              <span className="rounded-full bg-navy px-3 py-1 text-white">English</span>
              <span lang="hi" className="px-3 py-1 text-ink-muted">हिंदी</span>
            </div>
          </div>

          <h2 className="mt-6 text-headline-4 text-ink">Pledge</h2>

          <div className="mt-4 rounded-xl bg-saffron-50 p-6">
            <ul className="list-disc space-y-3 pl-5 text-body-2 italic text-ink">
              {PLEDGE_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/portals/scw/epledge/form"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-label-1 text-white transition-colors hover:bg-navy-800"
            >
              I Take this Pledge
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>

          <p className="mt-5 text-center text-body-2 text-ink-muted">
            Taken the pledge before?{" "}
            <Link href="/portals/scw/epledge/form" className="font-semibold text-navy hover:underline">
              Download your certificate directly.
            </Link>
          </p>
        </Card>
      </div>
    </UserShell>
  );
}
