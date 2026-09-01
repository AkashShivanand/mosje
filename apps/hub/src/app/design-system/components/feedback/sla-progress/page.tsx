import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { SlaProgressIndicator, slaFractionForRemaining } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "SLA Progress Indicator — Design System",
  description:
    "Tracks time remaining against a Right to Service Act guarantee. Three variants, seven states, and always a concrete number — never a vague “Processing…”.",
};

/*
 * Read off `SlaProgressIndicatorProps` in
 * packages/design-system/components/feedback/sla-progress-indicator.tsx, with
 * `SlaStatus` and `SlaThresholds` from packages/design-system/utils/sla.ts.
 */
const PROPS: PropDef[] = [
  {
    name: "label",
    type: "React.ReactNode",
    required: true,
    description:
      "What the guarantee is for. Always shown or read out, and used as the indicator's accessible name — so it names the case, not the category.",
  },
  {
    name: "total",
    type: "number",
    required: true,
    description: "The whole allowance, in any consistent unit. Must be greater than zero.",
  },
  {
    name: "elapsed",
    type: "number",
    required: true,
    description: "Time consumed so far, in the same unit. It may exceed `total` — that is a breach, and it is rendered as one.",
  },
  {
    name: "unit",
    type: "string",
    default: '"day"',
    description:
      'Singular unit name, pluralised automatically. Right to Service Acts are usually written in working days; count them however the Act requires and pass "working day".',
  },
  {
    name: "variant",
    type: '"linear" | "circular" | "badge"',
    default: '"linear"',
    description:
      "`linear` for a case row or a queue, `circular` for a dashboard tile, `badge` for a table cell where a bar would not fit.",
  },
  {
    name: "paused",
    type: "boolean",
    default: "false",
    description:
      "The clock is stopped, typically awaiting the applicant. It renders neutral and hatched rather than escalating.",
  },
  {
    name: "completed",
    type: "boolean",
    default: "false",
    description:
      "The service has been delivered and `elapsed` is how long it took. The indicator freezes and resolves to met or missed.",
  },
  {
    name: "thresholds",
    type: "{ dueSoonAt?: number; atRiskAt?: number }",
    default: "{ dueSoonAt: 0.75, atRiskAt: 0.9 }",
    description:
      "Fractions of the allowance consumed at which the status escalates. Fractions rather than absolute time, because “five days left” means something different against seven days than against ninety.",
  },
  {
    name: "status",
    type: "SlaStatus",
    default: "derived",
    description:
      "Force a status instead of deriving it. An escape hatch — overriding it to make a queue look healthier makes the indicator lie about a statutory promise.",
  },
  {
    name: "description",
    type: "React.ReactNode",
    default: "undefined",
    description: "A secondary line on the linear variant — why it is paused, or which officer holds it.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    default: "undefined",
    description: "A trailing control on the linear variant, such as a “View” link.",
  },
  {
    name: "id",
    type: "string",
    default: "auto",
    description:
      "Falls back to a generated useId(). The label's id is derived from it, so pass one only when another element must reference the indicator.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the root element.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'Every variant carries role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax and aria-labelledby pointing at the label, so the indicator is named and its value is exposed.',
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "Each state carries words as well as a hue — “5 days left”, “3 days overdue”, “Paused”. The dot and the bar fill reinforce the text and never carry the meaning alone; the paused bar is hatched, so it differs from on-track by texture too.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "aria-valuetext carries the whole sentence — “5 days left. 16 days of 21 days used (76%).” — so a screen-reader user gets the deadline rather than a bare percentage. A breach reports a value of 100 with the overdue amount in the text, because a progressbar's value may not exceed its maximum.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description: "The bar and ring transitions are removed under prefers-reduced-motion.",
  },
  {
    criterion: "GIGW 3.0 — Right to Service",
    level: "GIGW",
    description:
      "It always states a concrete time. UX4G calls out a vague “Processing…” as a Don't, and rightly: an unspecific status is what erodes confidence in a statutory guarantee.",
  },
];

export default function SlaProgressPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="SLA Progress Indicator"
      status="Stable"
      summary="Tracks time remaining against a service guarantee. A Right to Service Act gives a citizen a maximum time for a service and attaches the consequences of missing it to a named officer — so this is not a decorative progress bar. It is the promise, rendered."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <div className="cdp__specimen-stack">
          <SlaProgressIndicator label="Income Certificate" total={21} elapsed={4} />
          <SlaProgressIndicator label="Caste Certificate" total={21} elapsed={17} />
          <SlaProgressIndicator label="Scholarship Verification" total={21} elapsed={20} />
          <SlaProgressIndicator label="Grievance #4471" total={21} elapsed={24} />
          <SlaProgressIndicator label="Pension Sanction" total={21} elapsed={12} completed />
          <SlaProgressIndicator
            label="Disability Certificate"
            total={21}
            elapsed={9}
            paused
            description="Awaiting a medical board date from the applicant"
          />
        </div>
      }
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A statutory time limit applies to a case and an officer or a citizen needs to know how much of it is left.",
          "A queue of cases must be scannable by urgency — the badge variant in a table cell, the linear variant in a case row.",
          "A dashboard tile reports the standing of one guarantee, where the number of units left is the headline.",
        ],
        avoid: [
          "There is no guarantee, only a proportion completed — use Progress, which measures work rather than a promise.",
          "The state is a category rather than a time — use a Badge.",
          "The reader needs the history of what happened to the case — use Approval Timeline.",
          "The remaining time is not known. Leave the figure off the design rather than showing an indicator with nothing behind it.",
        ],
      }}
      related={[
        {
          label: "Progress",
          href: "/design-system/components/data-display/progress",
          reason: "for a proportion of work done rather than a guarantee",
        },
        {
          label: "Badge",
          href: "/design-system/components/feedback/badge",
          reason: "when the state is a category, not a time",
        },
        {
          label: "Approval Timeline",
          href: "/design-system/components/data-display/approval-timeline",
          reason: "for what has already happened to the case",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              Seven States, Derived from One Fraction
            </h2>
            <p>
              Nothing sets a state by hand. It is derived from how much of the allowance has been
              consumed, together with <code>paused</code> and <code>completed</code>, and every one
              of them names a concrete number and unit.
            </p>
            <ul>
              <li>
                <strong>On track</strong> — inside the due-soon threshold.
              </li>
              <li>
                <strong>Due soon</strong> — past 75% consumed by default.
              </li>
              <li>
                <strong>At risk</strong> — past 90% consumed by default.
              </li>
              <li>
                <strong>Breached</strong> — the allowance is exceeded and the service is still not
                delivered.
              </li>
              <li>
                <strong>Met</strong> — delivered within the allowance.
              </li>
              <li>
                <strong>Missed</strong> — delivered late. Kept distinct from breached so a report can
                separate “still failing” from “failed, now closed”.
              </li>
              <li>
                <strong>Paused</strong> — the clock is stopped.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-paused">
            <h2 id="cdp-paused" className="cdp__h2">
              A Paused Clock Renders Neutral, Not Escalating
            </h2>
            <p>
              When the department is waiting on the applicant, nothing is being consumed. Showing an
              officer a reddening bar for time they are not accountable for is both wrong and
              corrosive to trust in the number — and the number is the whole point of a service
              guarantee.
            </p>
            <p>
              The paused bar is hatched rather than merely grey, so it is distinguishable from an
              on-track one without relying on hue.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Three Variants, Chosen by Where They Sit
            </h2>
            <div className="cdp__specimen-row">
              <SlaProgressIndicator label="Income Certificate" total={21} elapsed={13} variant="circular" />
              <SlaProgressIndicator label="Caste Certificate" total={21} elapsed={19} variant="circular" />
              <SlaProgressIndicator label="Grievance #4471" total={30} elapsed={34} variant="circular" />
              <SlaProgressIndicator label="Ration Card" total={15} elapsed={3} variant="circular" />
            </div>
            <p>
              <strong>Circular</strong> for a dashboard tile — the big number is the time left.{" "}
              <strong>Linear</strong> for a case detail or a queue, where the bar earns its space.{" "}
              <strong>Badge</strong> for a table cell, where a bar would not fit.
            </p>
            <div className="cdp__specimen-row">
              <SlaProgressIndicator label="NH/2026/0041" total={30} elapsed={9} variant="badge" />
              <SlaProgressIndicator label="NH/2026/0042" total={30} elapsed={26} variant="badge" />
              <SlaProgressIndicator label="NH/2026/0043" total={30} elapsed={34} variant="badge" />
              <SlaProgressIndicator label="NH/2026/0044" total={30} elapsed={11} variant="badge" completed />
            </div>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-thresholds">
            <h2 id="cdp-thresholds" className="cdp__h2">
              Thresholds Are Fractions
            </h2>
            <p>
              They default to 75% consumed (due soon) and 90% (at risk). Fractions rather than
              absolute days, because “five days left” means something very different against a
              seven-day allowance than against a ninety-day one.
            </p>
            <p>
              Where a rule genuinely is written in absolute terms — the NHAPOA rule is “warn at five
              days remaining of thirty” — convert it. The same case, twenty-four of thirty days used,
              under each rule: the default has already escalated, and the NHAPOA rule has not.
            </p>
            <div className="cdp__specimen-stack">
              <SlaProgressIndicator label="Default — Warn at 75% Consumed" total={30} elapsed={24} />
              <SlaProgressIndicator
                label="NHAPOA — Warn at 5 Days Left"
                total={30}
                elapsed={24}
                thresholds={{ dueSoonAt: slaFractionForRemaining(30, 5) }}
              />
            </div>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-units">
            <h2 id="cdp-units" className="cdp__h2">
              Units
            </h2>
            <p>
              The component is unit-agnostic. Right to Service Acts are usually written in working
              days, which needs a state holiday calendar to compute — an application concern, not a
              presentational one. Count them however the Act requires, then pass the numbers in with
              a matching <code>unit</code>.
            </p>
            <div className="cdp__specimen-stack">
              <SlaProgressIndicator label="Appeal Hearing" total={15} elapsed={10} unit="working day" />
              <SlaProgressIndicator label="Emergency Shelter Placement" total={48} elapsed={41} unit="hour" />
            </div>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-ux4g">
            <h2 id="cdp-ux4g" className="cdp__h2">
              UX4G Parity
            </h2>
            <p>
              This implements UX4G 3.0&apos;s SLA Progress Indicator on the SAMAVESH token contract,
              with its three variants and its rule that the value must always be concrete. SAMAVESH
              adds two states UX4G does not distinguish: <strong>paused</strong>, because government
              workflows routinely stop the clock while awaiting an applicant, and{" "}
              <strong>missed</strong> as separate from <strong>breached</strong>.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { SlaProgressIndicator } from "@mosje/design-system";

<SlaProgressIndicator label="Income Certificate" total={21} elapsed={16} />
<SlaProgressIndicator label="Grievance #4471" total={30} elapsed={34} variant="badge" />`}</CodeBlock>
          <p>
            Where an Act is written in absolute time, convert it to a fraction rather than hard-coding
            a threshold.
          </p>
          <CodeBlock>{`import { SlaProgressIndicator, slaFractionForRemaining } from "@mosje/design-system";

<SlaProgressIndicator
  label="Grievance #4471"
  total={30}
  elapsed={24}
  thresholds={{ dueSoonAt: slaFractionForRemaining(30, 5) }}
/>`}</CodeBlock>
          <p>
            The status arithmetic lives in <code>utils/sla.ts</code> as pure functions —{" "}
            <code>slaStatus</code>, <code>slaSummary</code>, <code>slaValueText</code> — so
            escalation jobs, reports and reminder emails compute the same answer as the indicator
            rather than a second implementation of it.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-valuetext">
            <h2 id="cdp-valuetext" className="cdp__h2">
              What a Screen Reader Hears
            </h2>
            <p>
              A bare percentage is not the promise. <code>aria-valuetext</code> therefore carries the
              full sentence a sighted reader takes off the bar — “5 days left. 16 days of 21 days
              used (76%).” — so both readers get the deadline.
            </p>
            <p>
              A breach reports <code>aria-valuenow=&quot;100&quot;</code>, because a progressbar&apos;s
              value may not exceed its maximum, and the overdue amount is carried in the value text
              instead. The number is not lost; it is moved to where the specification allows it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-label">
            <h2 id="cdp-label" className="cdp__h2">
              Label the Case, Not the Category
            </h2>
            <p>
              The label is the accessible name. “Application” identifies nothing on a queue of four
              hundred, and a screen-reader user moving down that queue hears the same word four
              hundred times. Use the application number, or the number and the service.
            </p>
            <p>
              Do not override <code>status</code> to make a queue look healthier. Every consumer of
              that override — the officer, the citizen, the report — is being told something the
              arithmetic does not support.
            </p>
          </section>
        </>
      }
    />
  );
}
