import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { RecordSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Record Screen — Design System",
  description: "One record, read-only: a summary strip of headline facts, then tabbed detail.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The facts strip is label/value pairs; the detail tab renders a DescriptionList, which is a real `<dl>`. Neither is a table pretending to be prose.",
    status: "verified",
    evidence: "DescriptionList renders a <dl>; the facts strip is a flex row of label/value spans with no tabular semantics claimed.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "One `<h1>`, from PageHeader. The record's status is a Badge in the actions slot, not a second heading.",
    status: "verified",
    evidence: "PageHeader renders h1 by default and the status is passed as a node beside the actions.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The panel is `TabPanel`, which composes its id and `aria-labelledby` from the same `idBase` and tab id that Tabs uses for `aria-controls`, so the two halves of the relationship cannot drift.",
    status: "verified",
    evidence: "An earlier version built the panel id from the tab INDEX while Tabs keys aria-controls by the tab ID — aria-controls pointed at …-panel-details against a panel of …-panel-0. Replaced with TabPanel and one hoisted idBase.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description: "Tab navigation is Tabs' own roving tabindex; arrow keys move between tabs and Tab enters the panel.",
    status: "verified",
    evidence: "Inherited from Tabs.",
  },
];

export default function RecordScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Record Screen"
      status="Beta"
      summary="One record, read-only. A summary strip carries the four or five facts a reader came for; everything else sits behind tabs that can be linked to."
      figma={{
        absent:
          "The handoff draws a review summary (e-anudaan-step7-review-submit, 51 label/value pairs) but no committed-record view. This is the estate's own composition.",
      }}
      specimen={<RecordSpecimen />}
      propsFrom="RecordScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An application, beneficiary, institution or grant, once it is committed.",
          "Any detail view reached from a Worklist Screen row.",
        ],
        avoid: [
          "A record still being entered — use Wizard Screen, or Review Screen for its last step.",
          "A record this reader will change the state of — use Decision Screen.",
          "Editing fields in place — that is Form Screen.",
        ],
      }}
      related={[
        { label: "Description List", href: "/design-system/components/data-display/description-list", reason: "what the detail tab renders" },
        { label: "Worklist Screen", href: "/design-system/components/templates/worklist-screen", reason: "where readers arrive from" },
        { label: "Tabs", href: "/design-system/components/navigation/tabs", reason: "the section switch" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-empty-tab">
            <h2 id="cdp-empty-tab" className="cdp__h2">Keep a Tab That Has Nothing in It</h2>
            <p>
              A record with no documents keeps its Documents tab and shows that tab&rsquo;s empty
              state. Removing it moves every tab to its right and breaks a link somebody sent.
            </p>
            <Callout type="warning" title="A value the register does not publish is omitted">
              Do not pass a fact whose value is &ldquo;Not yet reported&rdquo;. The
              live-data-fallback rule bans it, and a row that says nothing costs the reader a line
              and teaches them the screen is padded.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-facts">
            <h2 id="cdp-facts" className="cdp__h2">Four to Six Facts, Then a Description List</h2>
            <p>
              The strip is for what the reader came to check — the amount, the year, the state,
              the beneficiary count. Past six it stops being a strip and becomes a table nobody
              scans; put the rest in the Details tab, where{" "}
              <code>DescriptionList</code> lays them out in columns.
            </p>
            <p>
              The handoff&rsquo;s review screen carries <strong>51 label/value pairs</strong> in
              ten groups. That is a Review Screen, not a facts strip.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<RecordScreen
  breadcrumb={[{ label: "My Applications", href: base }, { label: id }]}
  eyebrow="SHRESHTA MODE 2"
  title={record.project}
  meta={\`Application \${id} · submitted \${submitted}\`}
  status={<Badge status="info">In Review</Badge>}
  actions={canDownload ? <Button appearance="outlined">Download Summary</Button> : undefined}
  facts={[
    { label: "Grant Requested", value: money(record.requested) },
    { label: "Financial Year", value: record.fy },
  ]}
  tabs={TABS}
  activeTab={searchParams.get("tab") ?? "details"}
  onTabChange={(id) => router.replace(\`?tab=\${id}\`)}
  loading={isLoading}
  error={error}
  onRetry={refetch}
/>`}</CodeBlock>
          <p>
            Drive <code>activeTab</code> from the URL. A tab that cannot be linked to is a tab
            nobody can send anyone to, and the estate has 265 pages that already prove people
            will otherwise reach for <code>useState</code>.
          </p>
          <p>
            Each tab&rsquo;s <code>render</code> is a function, not a node, so a tab nobody opens
            costs nothing — a record with a thousand-row history should not pay for it on arrival.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-perm">
          <h2 id="cdp-perm" className="cdp__h2">Omit What This Reader May Not Do</h2>
          <p>
            Pass <code>actions</code> conditionally rather than rendering a disabled button. A
            dead control announces as present but unavailable and explains nothing; its absence at
            least matches what the reader can actually do.
          </p>
        </section>
      }
    />
  );
}
