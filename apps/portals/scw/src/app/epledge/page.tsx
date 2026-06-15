import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UserShell } from "@/components/user-shell";
import { Card } from "@/components/ui";
import { PLEDGE_POINTS } from "@/lib/mock-data";

export default function EpledgePage() {
  return (
    <UserShell>
      <div className="space-y-6">
        {/* Banner */}
        <div
          className="relative flex min-h-[280px] flex-col justify-center overflow-hidden rounded-2xl p-8 text-white sm:p-12"
          style={{
            backgroundImage:
              "linear-gradient(110deg, rgba(11,33,71,0.95) 0%, rgba(11,33,71,0.65) 45%, rgba(11,33,71,0.15) 100%), linear-gradient(135deg, #1b3a6b 0%, #2f6b46 100%)",
          }}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-white/80 sm:text-sm">
            Government of India / Department of Social Justice &amp; Empowerment
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Ageing with DIGNITY
          </h2>
          <p className="mt-3 text-lg font-semibold text-white/90">Call Toll-Free - 14567</p>
        </div>

        {/* Pledge card */}
        <Card className="-mt-12 mx-auto max-w-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-approve-bg px-3 py-1 text-xs font-semibold text-approve-fg">
              <span className="text-approve">●</span>0 Pledges Taken Today
            </span>
            <div className="inline-flex items-center rounded-full border border-line p-0.5 text-xs font-semibold">
              <span className="rounded-full bg-navy px-3 py-1 text-white">English</span>
              <span className="px-3 py-1 text-ink-muted">हिंदी</span>
            </div>
          </div>

          <h2 className="mt-6 text-2xl font-bold text-ink">Pledge</h2>

          <div className="mt-4 rounded-xl bg-saffron-50 p-6">
            <ul className="list-disc space-y-3 pl-5 text-sm italic leading-relaxed text-ink">
              {PLEDGE_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/epledge/form"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              I Take this Pledge
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-5 text-center text-sm text-ink-muted">
            Taken the pledge before?{" "}
            <Link href="/epledge/form" className="font-semibold text-navy hover:underline">
              Download your certificate directly.
            </Link>
          </p>
        </Card>
      </div>
    </UserShell>
  );
}
