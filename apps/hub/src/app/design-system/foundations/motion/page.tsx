import * as React from "react";
import type { Metadata } from "next";

import "./motion.css";
import { Callout, DoDont, FoundationDocPage, FoundationTokenTable } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS, REDUCED_MOTION_COLLAPSES } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Motion",
  description:
    "Motion by intent for SAMAVESH — twelve named pairs of duration and easing, a value-named ladder beneath them, and reduced motion handled once at the token layer.",
};

/*
 * DS Audit: FoundationDocPage ✅ · FoundationTokenTable ✅ · Callout ✅ · DoDont ✅
 * Every number on this page is read from foundations-data.generated.ts. The specimens in
 * motion.css bind the intent pairs; nothing here types a millisecond.
 */

const rows = FOUNDATIONS.motion.tokens;
const sys = rows.filter((r) => r.tier === "sys");
const ref = rows.filter((r) => r.tier === "ref");
const durations = ref.filter((r) => r.path.startsWith("motion/duration/"));
const easings = ref.filter((r) => r.path.startsWith("motion/easing/"));
const intents = [...new Set(sys.map((r) => r.path.split("/")[1] ?? ""))].filter((k) => k && k !== "loading" && k !== "stagger");
const pairFor = (intent: string) => ({
  duration: sys.find((r) => r.path === `motion/${intent}/duration`),
  easing: sys.find((r) => r.path === `motion/${intent}/easing`),
});
const easingName = (value: string | null): string => easings.find((e) => e.value === value)?.path.split("/")[2] ?? "—";
const maxMs = Math.max(...durations.map((d) => Number((d.value ?? "0").replace("ms", ""))));

function Curve({ row }: { row: (typeof easings)[number] }): React.JSX.Element {
  const m = /cubic-bezier\(([^)]+)\)/.exec(row.value ?? "");
  const pts = (m?.[1] ? m[1].split(",").map((n) => Number(n.trim())) : [0, 0, 1, 1]) as [number, number, number, number];
  const [x1, y1, x2, y2] = pts;
  return (
    <div className="mo-curve">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <line x1="0" y1="100" x2="100" y2="0" />
        <path d={`M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`} />
      </svg>
      <span className="mo-curve__name">{row.path.split("/")[2]}</span>
      <span className="mo-curve__value">{row.value}</span>
    </div>
  );
}

export default function MotionPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Motion"
      status="Stable"
      since="0.49.0"
      summary="Motion in SAMAVESH is quick, quiet and purposeful. It guides attention and softens change on a government service, and it steps aside the moment a reader asks it to. You never pick a duration: you name what is happening, and the pair brings its duration and easing together."
      figma={{ node: "motion" }}
      glance={[
        { value: intents.length + 1, label: "intents", note: "eleven pairs plus loading" },
        { value: durations.length, label: "duration steps", note: `${durations[0]?.value} to ${maxMs}ms, value-named` },
        { value: easings.length, label: "easing curves", note: "named by behaviour, Material 3 vocabulary" },
        { value: REDUCED_MOTION_COLLAPSES.length, label: "collapse under reduced motion", note: "emitted once, in tokens.css" },
        { value: `${FOUNDATIONS.motion.stats.figma}/${FOUNDATIONS.motion.stats.total}`, label: "in Figma", note: "native Timing and Easing variables" },
        { value: "0.01ms", label: "reduced-motion floor", note: "transitionend still fires" },
      ]}
      sections={[
        {
          id: "intents",
          keyword: "INTENTS",
          title: "Twelve Intents, and You Never Pick a Duration",
          description:
            "Each intent is a pair. Binding a bare duration loses the easing that belongs to it, which is how components came to pair an exit duration with an enter easing seven times before there was a name for a hover. Hover or focus a card to run it.",
          content: (
            <>
              <div className="mo-intents">
                {intents.map((intent) => {
                  const p = pairFor(intent);
                  return (
                    <div key={intent} className={`mo-card mo-card--${intent}`} tabIndex={0}>
                      <span className="mo-card__name">motion/{intent}</span>
                      <span className="mo-card__pair">
                        {p.duration?.value} · {easingName(p.easing?.value ?? null)}
                      </span>
                      <div className="mo-card__stage" aria-hidden="true">
                        <div className="mo-card__dot" />
                      </div>
                      <p className="mo-card__pair">{p.duration?.description.split(" — the duration half")[0]}</p>
                    </div>
                  );
                })}
                <div className="mo-card mo-card--loading" tabIndex={0}>
                  <span className="mo-card__name">motion/loading</span>
                  <span className="mo-card__pair">
                    {sys.find((r) => r.path === "motion/loading/spin")?.value} · linear
                  </span>
                  <div className="mo-card__stage" aria-hidden="true">
                    <div className="mo-card__dot" />
                  </div>
                  <p className="mo-card__pair">Indeterminate progress. Exempt from reduced motion: a spinner that stops reads as a frozen page.</p>
                </div>
              </div>
              <Callout type="tip" title="Enter is slower than exit, on purpose">
                Something arriving decelerates into place and may take its time; something leaving accelerates away because the
                reader has already finished with it. The same asymmetry holds for expand and collapse.
              </Callout>
            </>
          ),
        },
        {
          id: "ladder",
          keyword: "LADDER",
          title: "Ten Durations and Five Curves, and the Name Is the Value",
          description:
            "The Tier-1 ladder beneath the intents. Durations are value-named like spacing and radius, so a rung's name can be checked against what it renders; easings are named by behaviour so a designer and a developer say the same word. App code never binds these directly.",
          content: (
            <>
              <div className="mo-ladder" aria-label="Duration ladder">
                {durations.map((d) => {
                  const ms = Number((d.value ?? "0").replace("ms", ""));
                  return (
                    <div key={d.path} className="mo-ladder__row">
                      <span>{d.value}</span>
                      <div className="mo-ladder__bar" style={{ width: `${Math.max(1, (ms / maxMs) * 100)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="mo-curves" aria-label="Easing curves">
                {easings.map((e) => (
                  <Curve key={e.path} row={e} />
                ))}
              </div>
              <FoundationTokenTable rows={ref} caption="Tier 1 — the private ladder. Bind an intent, never a rung." />
            </>
          ),
        },
        {
          id: "reduced-motion",
          keyword: "PREFERENCE",
          title: "Reduced Motion Is Handled Once, at the Token Layer",
          description:
            "When a reader turns on Reduce Motion in their operating system, tokens.css collapses every intent's duration to 0.01ms inside one media query. A component that binds a pair honours the preference without writing its own query — 45 components used to, each slightly differently.",
          content: (
            <>
              <ul>
                {REDUCED_MOTION_COLLAPSES.map((v) => (
                  <li key={v}>
                    <code>{v}</code>
                  </li>
                ))}
              </ul>
              <Callout type="info" title="Two families are exempt, and that is the point">
                <code>motion/instant</code> is already zero. <code>motion/loading</code> keeps running — a spinner that stops is a
                page that looks frozen — so components slow it instead of stopping it. 0.01ms rather than 0 so code waiting on
                <code>transitionend</code> still hears the event.
              </Callout>
            </>
          ),
        },
        {
          id: "choreography",
          keyword: "CHOREOGRAPHY",
          title: "One Thing Moves at a Time, and a List Arrives in Steps of {step}".replace(
            "{step}",
            sys.find((r) => r.path === "motion/stagger/step")?.value ?? "",
          ),
          description:
            "Motion on a government service is transitional, never informational. Nothing a citizen needs to understand may depend on having seen it move. Within that rule, four principles keep the estate's motion reading as one system.",
          content: (
            <>
              <div className="mo-stagger" tabIndex={0} aria-label="Eight bars cascading in, each delayed by one stagger step">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="mo-stagger__bar" />
                ))}
              </div>
              <ol>
                <li>
                  <strong>Asymmetry.</strong> Enter slower than exit; expand slower than collapse. The reader watches things arrive and
                  ignores things leave.
                </li>
                <li>
                  <strong>One mover.</strong> When a panel opens, the panel moves and its contents fade — never both translating.
                </li>
                <li>
                  <strong>Cascade, capped.</strong> A list staggers by <code>motion/stagger/step</code> per item and stops after{" "}
                  <code>motion/stagger/max</code> items, so a long list never keeps the reader waiting on its tail.
                </li>
                <li>
                  <strong>Feedback inside the short band.</strong> Hover and press respond within {pairFor("hover").duration?.value}. Past about a fifth of a second a press stops
                  confirming the interface heard you and starts looking like a delay.
                </li>
              </ol>
              <DoDont
                cards={[
                  { type: "do", preview: <code>transition: opacity var(--sa-motion-enter-duration) var(--sa-motion-enter-easing)</code>, label: "Bind the pair for what is happening." },
                  { type: "dont", preview: <code>transition: opacity 150ms ease</code>, label: /* ds-exempt(specimen): the "don't" half of the pair — the literal duration is what is being refused */ "A literal duration cannot follow the ladder, the brand, or the reader's reduced-motion preference." },
                  { type: "dont", preview: <code>var(--sa-motion-exit-duration) var(--sa-motion-enter-easing)</code>, label: "Half of one pair and half of another is not an intent. If you want a fast decelerate, that is hover." },
                ]}
              />
            </>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Tier 2 is what you bind: motion/<intent>/duration and motion/<intent>/easing, always together. Tier 1 is the value-named ladder beneath — visible so the alias chain can be checked, hidden from Figma publishing, and banned in app code. In Figma every duration is a native Timing variable and every curve a native Easing variable, so a Figma Motion preset binds the token itself."
      a11y={[
        {
          criterion: "2.3.3 Animation from Interactions",
          level: "AAA",
          description: "Motion triggered by interaction can be disabled unless essential.",
          status: "verified",
          evidence: "tokens.css emits @media (prefers-reduced-motion: reduce) collapsing every intent; pinned by visual-contract.test.mjs (2026-09-04).",
        },
        {
          criterion: "2.2.2 Pause, Stop, Hide",
          level: "A",
          description: "Moving content that lasts more than five seconds can be paused.",
          status: "partial",
          evidence: "Only indeterminate spinners run longer than five seconds and they are exempt by design; the ticker component carries its own pause control. No token-level mechanism for other looping content.",
        },
        {
          criterion: "2.3.1 Three Flashes or Below Threshold",
          level: "A",
          description: "Nothing flashes more than three times a second.",
          status: "verified",
          evidence: `The shortest looping token is motion/loading/pulse at ${sys.find((r) => r.path === "motion/loading/pulse")?.value} per half-cycle; nothing in the system can reach 3Hz.`,
        },
        {
          criterion: "GIGW 3.0 — Animation",
          level: "GIGW",
          description: "Animation must not be the only way information is conveyed.",
          status: "verified",
          evidence: "Motion is transitional by rule; every state a transition reveals is also rendered statically (2026-09-04 review of the intent list).",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 — motion",
          says: "No published duration or easing scale.",
          does: "Ten value-named durations and five behaviour-named curves, adopting Material 3's short / medium / long bands and vocabulary.",
          why: "Where UX4G is silent the estate adds; nothing UX4G specifies is removed.",
        },
      ]}
      related={[
        { label: "Interaction States", href: "/design-system/foundations/states", reason: "which intent each state binds — hover, press, focus" },
        { label: "Elevation", href: "/design-system/foundations/elevation", reason: "a surface that lifts on hover animates its shadow with the hover pair" },
        { label: "Layering", href: "/design-system/foundations/layering", reason: "what enters and exits usually also changes layer" },
      ]}
    />
  );
}
