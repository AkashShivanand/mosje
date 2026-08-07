import type { Metadata } from "next";
import * as React from "react";
import { SlaProgressIndicator, slaFractionForRemaining } from "@mosje/design-system";
import { PropsTable, Callout, A11yChecklist, DoDont } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "SLA Progress Indicator",
  description:
    "Tracks time remaining against a Right to Service Act guarantee. Three variants, five states, always a concrete number — never a vague 'Processing…'.",
};

const SECTION: React.CSSProperties = { marginTop: "var(--ds-section-s)" };
const ROW: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--ds-inline-l)",
  alignItems: "flex-start",
  padding: "var(--ds-padding-l)",
  border: "1px solid var(--ds-border)",
  borderRadius: "var(--ds-radius-lg)",
  background: "var(--ds-surface)",
};
const STACK: React.CSSProperties = {
  display: "grid",
  gap: "var(--ds-stack-m)",
  maxWidth: "30rem",
  padding: "var(--ds-padding-l)",
  border: "1px solid var(--ds-border)",
  borderRadius: "var(--ds-radius-lg)",
  background: "var(--ds-surface)",
};

export default function SlaProgressPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <header style={{ marginBottom: "var(--ds-section-xs)" }}>
        <h1>SLA Progress Indicator</h1>
        <p style={{ color: "var(--ds-ink-muted)", marginTop: "var(--ds-stack-s)", maxWidth: "62ch" }}>
          Tracks time remaining against a service guarantee. A Right to Service Act gives a citizen
          a maximum time for a service and attaches the consequences of missing it to a named
          officer — so this is not a decorative progress bar. It is the promise, rendered.
        </p>
      </header>

      <section style={SECTION}>
        <h2>States</h2>
        <p>
          Five states, derived from how much of the allowance has been consumed. Every one names a
          concrete number and unit — including breach and pause.
        </p>
        <div style={STACK}>
          <SlaProgressIndicator label="Income certificate" total={21} elapsed={4} />
          <SlaProgressIndicator label="Caste certificate" total={21} elapsed={17} />
          <SlaProgressIndicator label="Scholarship verification" total={21} elapsed={20} />
          <SlaProgressIndicator label="Grievance #4471" total={21} elapsed={24} />
          <SlaProgressIndicator label="Pension sanction" total={21} elapsed={12} completed />
          <SlaProgressIndicator
            label="Disability certificate"
            total={21}
            elapsed={9}
            paused
            description="Awaiting medical board date from the applicant"
          />
        </div>
      </section>

      <Callout type="warning">
        <strong>A paused clock renders neutral, not escalating.</strong> When the department is
        waiting on the applicant, nothing is being consumed. Showing an officer a reddening bar for
        time they are not accountable for is both wrong and corrosive to trust in the number — and
        the number is the whole point of a service guarantee. The paused bar is hatched rather than
        merely grey, so it is distinguishable from an on-track one without relying on hue.
      </Callout>

      <section style={SECTION}>
        <h2>Variants</h2>
        <p>
          Three, matching UX4G 3.0. Pick by where it sits, not by preference.
        </p>
        <div style={ROW}>
          <SlaProgressIndicator label="Income certificate" total={21} elapsed={13} variant="circular" />
          <SlaProgressIndicator label="Caste certificate" total={21} elapsed={19} variant="circular" />
          <SlaProgressIndicator label="Grievance #4471" total={30} elapsed={34} variant="circular" />
          <SlaProgressIndicator label="Ration card" total={15} elapsed={3} variant="circular" />
        </div>
        <p style={{ marginTop: "var(--ds-stack-m)" }}>
          <strong>Circular</strong> for a dashboard tile — the big number is the time left.{" "}
          <strong>Linear</strong> for a case detail or a queue, where the bar earns its space.{" "}
          <strong>Badge</strong> for a table cell, where a bar would not fit:
        </p>
        <div style={{ ...ROW, gap: "var(--ds-inline-s)" }}>
          <SlaProgressIndicator label="NH/2026/0041" total={30} elapsed={9} variant="badge" />
          <SlaProgressIndicator label="NH/2026/0042" total={30} elapsed={26} variant="badge" />
          <SlaProgressIndicator label="NH/2026/0043" total={30} elapsed={34} variant="badge" />
          <SlaProgressIndicator label="NH/2026/0044" total={30} elapsed={11} variant="badge" completed />
        </div>
      </section>

      <section style={SECTION}>
        <h2>Thresholds</h2>
        <p>
          Thresholds are <strong>fractions of the allowance consumed</strong>, defaulting to 75%
          (due&nbsp;soon) and 90% (at&nbsp;risk). Fractions rather than absolute days, because
          &ldquo;5 days left&rdquo; means something very different against a 7-day allowance than
          against a 90-day one.
        </p>
        <p>
          Where a rule genuinely is written in absolute terms — NHAPOA&rsquo;s is &ldquo;warn at 5
          days remaining of 30&rdquo; — convert it:
        </p>
        <pre>
          <code>{`<SlaProgressIndicator
  label="Grievance #4471"
  total={30}
  elapsed={24}
  thresholds={{ dueSoonAt: slaFractionForRemaining(30, 5) }}
/>`}</code>
        </pre>
        <p>
          The same case, 24 of 30 days used, under each rule. The default warns at 75% consumed,
          so it has already escalated; NHAPOA&rsquo;s rule does not warn until 5 days remain, so it
          is still on track. Same data, different promise:
        </p>
        <div style={STACK}>
          <SlaProgressIndicator
            label="Default — warn at 75% consumed"
            total={30}
            elapsed={24}
          />
          <SlaProgressIndicator
            label="NHAPOA — warn at 5 days left"
            total={30}
            elapsed={24}
            thresholds={{ dueSoonAt: slaFractionForRemaining(30, 5) }}
          />
        </div>
      </section>

      <section style={SECTION}>
        <h2>Units</h2>
        <p>
          The component is unit-agnostic. RTS Acts are usually written in <strong>working days</strong>,
          which needs a state holiday calendar to compute — that is an application concern, not a
          presentational one. Count the days however your Act requires, then pass the numbers in
          with a matching <code>unit</code>.
        </p>
        <div style={STACK}>
          <SlaProgressIndicator label="Appeal hearing" total={15} elapsed={10} unit="working day" />
          <SlaProgressIndicator label="Emergency shelter placement" total={48} elapsed={41} unit="hour" />
        </div>
      </section>

      <section style={SECTION}>
        <h2>Do &amp; Don&rsquo;t</h2>
        <DoDont
          cards={[
            {
              type: "do",
              preview: <SlaProgressIndicator label="Income certificate" total={21} elapsed={16} />,
              label:
                "State a concrete number and unit. A citizen can act on “5 days left”; the officer holding it can be held to it.",
            },
            {
              type: "dont",
              preview: (
                <SlaProgressIndicator
                  label="Income certificate"
                  total={21}
                  elapsed={16}
                  status="on-track"
                />
              ),
              label:
                "Don’t override the derived status to make a queue look healthier. This case is 76% consumed but forced to on-track — the indicator is now lying about a statutory promise.",
            },
            {
              type: "do",
              preview: (
                <SlaProgressIndicator
                  label="Disability certificate"
                  total={21}
                  elapsed={9}
                  paused
                  description="Awaiting medical board date from the applicant"
                />
              ),
              label:
                "Pause the clock when the delay sits with the applicant, and say why. The officer is not accountable for that time.",
            },
            {
              type: "dont",
              preview: <SlaProgressIndicator label="Application" total={21} elapsed={9} />,
              label:
                "Don’t label it generically. “Application” identifies nothing on a queue of four hundred — use the application number.",
            },
          ]}
        />
      </section>

      <section style={SECTION}>
        <h2>Props</h2>
        <PropsTable
          props={[
            { name: "label", type: "React.ReactNode", required: true, description: "What the guarantee is for. Shown, and used as the accessible name." },
            { name: "total", type: "number", required: true, description: "Total time the SLA allows, in any consistent unit." },
            { name: "elapsed", type: "number", required: true, description: "Time consumed so far. May exceed total — that is a breach." },
            { name: "unit", type: "string", default: '"day"', description: "Singular unit name; pluralised automatically. Use \"working day\" where the Act does." },
            { name: "variant", type: '"linear" | "circular" | "badge"', default: '"linear"', description: "Linear for rows and queues, circular for dashboard tiles, badge for table cells." },
            { name: "paused", type: "boolean", default: "false", description: "Clock stopped, typically awaiting the applicant. Renders neutral and hatched." },
            { name: "completed", type: "boolean", default: "false", description: "Delivered; elapsed is how long it took. Resolves to met or missed." },
            { name: "thresholds", type: "{ dueSoonAt?: number; atRiskAt?: number }", default: "{ 0.75, 0.9 }", description: "Fractions of the allowance consumed at which the status escalates." },
            { name: "status", type: "SlaStatus", description: "Force a status instead of deriving it. Escape hatch — prefer the derived value." },
            { name: "description", type: "React.ReactNode", description: "Secondary line on the linear variant, e.g. why it is paused." },
            { name: "action", type: "React.ReactNode", description: "Trailing control on the linear variant, e.g. a View link." },
          ]}
        />
      </section>

      <section style={SECTION}>
        <h2>Accessibility</h2>
        <A11yChecklist
          items={[
            { criterion: "1.4.1 Use of Colour", level: "A", description: "Every state carries text as well as a hue — '3 days overdue', 'Paused'. The badge dot and the bar fill reinforce the text; they never carry the meaning alone. The paused bar is hatched so it differs from on-track by texture as well as colour." },
            { criterion: "4.1.2 Name, Role, Value", level: "A", description: "role=\"progressbar\" with aria-valuenow, valuemin, valuemax and an aria-labelledby pointing at the label." },
            { criterion: "1.4.1 / screen-reader parity", level: "A", description: "aria-valuetext carries the full sentence — '5 days left. 16 days of 21 days used (76%).' — so a non-sighted user gets the deadline, not a bare percentage. A breach reports valuenow=100 with the overdue amount in the text, because a progressbar's value may not exceed its max." },
            { criterion: "2.3.3 Animation from Interactions", level: "AAA", description: "The bar and ring transitions are removed under prefers-reduced-motion." },
            { criterion: "Right to Service Act", level: "GIGW", description: "Always states a concrete time. UX4G calls out a vague 'Processing…' as a Don't — an unspecific status is what erodes confidence in a statutory guarantee." },
          ]}
        />
      </section>

      <section style={SECTION}>
        <h2>UX4G parity</h2>
        <p>
          Implements UX4G 3.0&rsquo;s <em>SLA Progress Indicator</em> (Feedback) as a React
          component on the SAMAVESH token contract, with UX4G&rsquo;s three variants and its rule
          that the value must always be concrete. SAMAVESH adds two states UX4G does not
          distinguish — <strong>paused</strong>, because Indian government workflows routinely stop
          the clock while awaiting an applicant, and <strong>missed</strong> as separate from{" "}
          <strong>breached</strong>, so a report can tell &ldquo;still failing&rdquo; from
          &ldquo;failed, now closed&rdquo;.
        </p>
      </section>
    </article>
  );
}
