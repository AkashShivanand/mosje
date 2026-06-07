import { AccessBar } from "@/components/shell/access-bar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface-muted">
      <AccessBar />
      <main
        id="main-content"
        className="mx-auto grid min-h-[calc(100dvh-32px)] max-w-[1600px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]"
      >
        {/* Left: brand panel */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-primary-800 text-white lg:flex lg:flex-col lg:justify-between">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 600 600"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0H0V40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          {/* Soft glows */}
          <div
            aria-hidden
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary opacity-20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-info opacity-15 blur-3xl"
          />

          <div className="relative p-3xl">
            <div className="flex items-center gap-md">
              <div className="grid h-12 w-12 place-items-center rounded-md bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                <span className="text-label-3 font-bold tracking-[0.18em]">MoSJE</span>
              </div>
              <div className="leading-tight">
                <div className="text-label-3 font-medium uppercase tracking-[0.14em] text-white/70">
                  Government of India
                </div>
                <div className="text-body-2 font-semibold text-white">
                  Ministry of Social Justice &amp; Empowerment
                </div>
              </div>
            </div>
          </div>

          <div className="relative px-3xl pb-3xl">
            <div className="mb-md inline-flex items-center gap-xs rounded-full border border-white/15 bg-white/5 px-md py-1 text-label-3 font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary-400" />
              National programme · active
            </div>
            <h1 className="text-headline-1 font-bold leading-tight">
              समावेश
              <span className="mt-1 block text-headline-3 font-semibold tracking-[0.14em] text-white/85">
                SAMAVESH
              </span>
            </h1>
            <p className="mt-md max-w-md text-body-1 leading-relaxed text-white/85">
              Single Access Mechanism for All Verticals of Empowerment &amp; Social Harmony.
              SMILE — Support for Marginalised Individuals for Livelihood &amp; Enterprise.
            </p>
            <div className="mt-xl grid max-w-md grid-cols-3 gap-md">
              {[
                { k: "States / UTs", v: "36" },
                { k: "Beneficiaries", v: "19,810" },
                { k: "Shelter homes", v: "312" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-md border border-white/15 bg-white/[0.06] p-md backdrop-blur-sm"
                >
                  <div className="text-num-xl font-bold tabular-nums leading-none">{s.v}</div>
                  <div className="mt-xs text-label-3 font-medium uppercase tracking-[0.08em] text-white/70">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-md px-3xl pb-lg text-label-3 text-white/70">
            <span className="inline-flex items-center gap-xs">256-bit TLS</span>
            <span className="h-3 w-px bg-white/20" />
            <span>GIGW 3.0 compliant</span>
            <span className="h-3 w-px bg-white/20" />
            <span>STQC audited</span>
          </div>
        </aside>

        {/* Right: form */}
        <section className="flex items-center justify-center bg-white p-lg lg:p-3xl">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </main>
    </div>
  );
}
