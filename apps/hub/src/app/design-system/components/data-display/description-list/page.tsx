import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Badge, DescriptionList } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Description List — Design System",
  description:
    "The label-and-value grid every application-detail screen is made of, rendered as a real <dl> so each value is announced with the field it belongs to.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The component renders <dl> with a <dt>/<dd> pair per item, so the relationship between a field and its value is in the markup rather than in the visual arrangement alone. Read from the rendered DOM on this page.",
    description:
      "Each value is programmatically associated with its own term, not merely placed under it.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "verified",
    evidence:
      "The grid is one column below the 768 breakpoint regardless of `columns`, and values set overflow-wrap: anywhere so a long reference number wraps rather than widening the grid. Measured at 320px in the browser: grid-template-columns resolves to 1fr and scrollWidth equals clientWidth, so there is no horizontal scroll.",
    description:
      "Two columns of label-and-value collapse to one on a phone, and unbroken reference numbers wrap.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "verified",
    evidence:
      "The inline layout's term column is 18ch, and the term's own font size is a rem-based token, so both track the root. Measured in the browser: doubling the root font size from 16px to 32px took the term from 12px to 24px and the column from 124px to 247px, with no clipping and no horizontal scroll.",
    description:
      "The inline layout's leading column is measured in characters, so it grows with the reader's font size.",
  },
];

const RECORD = [
  { term: "Application Number", value: "MOSJE/AVYAY/2026/004821" },
  { term: "Applicant", value: "Sunita Devi" },
  { term: "Date of Birth", value: "12 March 1994" },
  { term: "District", value: "Bankura" },
  { term: "Status", value: <Badge status="warning">Pending Verification</Badge> },
  {
    term: "Grant Sought",
    value: "₹ 4,50,000",
    hint: "As stated in step 5 of the application.",
  },
  { term: "Aadhaar Number", value: null },
  {
    term: "Registered Address",
    value: "House 42, Ward 7, Bankura Municipality, Bankura, West Bengal 722101",
    wide: true,
  },
];

export default function DescriptionListPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Description List"
      status="Stable"
      summary="A set of recorded facts about one thing — the label-and-value grid every application-detail screen is mostly made of. It renders a real <dl>, so each value is announced together with the field it belongs to."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={
        <div
          style={{
            padding: "var(--sa-padding-32)",
            background: "var(--sa-bg-neutral-base)",
            borderRadius: "var(--sa-shape-8)",
            border: "var(--sa-cmp-divider-width) solid var(--sa-border-neutral-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--sa-stack-40)",
          }}
        >
          <DescriptionList items={RECORD} columns={2} />
          <DescriptionList items={RECORD.slice(0, 4)} layout="inline" columns={1} divided />
          <DescriptionList items={RECORD.slice(0, 6)} columns={3} size="sm" />
        </div>
      }
      propsFrom="DescriptionListProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A screen shows what the department has recorded about one application, person, institution or grant.",
          "A wizard's final step reads back what the applicant entered, before they submit it.",
          "A card needs a short strip of facts — status, date, officer — above its longer content.",
        ],
        avoid: [
          "The reader needs to compare the same field across many records — that is a Data Table, which can sort and scan down a column.",
          "The values are editable — that is a form, and a read-back grid beside an editable one is two sources of truth.",
          "There is one fact. A description list of one is a sentence.",
        ],
      }}
      related={[
        {
          label: "Data Table",
          href: "/design-system/components/data-display/data-table",
          reason: "when the reader compares a field across records",
        },
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "for the review step's own read-back items",
        },
        {
          label: "Card",
          href: "/design-system/components/data-display/card",
          reason: "for the surface a record usually sits on",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-empty">
            <h2 id="cdp-empty" className="cdp__h2">
              An Unrecorded Value Is a Designed State
            </h2>
            <p>
              <code>null</code>, <code>undefined</code> and an empty string all render{" "}
              <code>emptyText</code> — &ldquo;Not recorded&rdquo; by default. The reader then knows
              the department has no answer, rather than wondering whether the page failed to load.
            </p>
            <p>
              It is real text and not a dash. A screen reader announces &ldquo;—&rdquo; as nothing
              at all, which makes an unanswered field and a broken one identical to anyone not
              looking at the screen.
            </p>
            <p>
              A field that should not appear at all when it is empty is left out of{" "}
              <code>items</code> by the caller. That is a different decision — it says the field
              does not apply rather than that it is unanswered — and it belongs to the page.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-shape">
            <h2 id="cdp-shape" className="cdp__h2">
              Columns, and When to Go Wide
            </h2>
            <p>
              Two columns is the default and suits a record of short values. The grid steps down to
              one column below the estate&apos;s 768 breakpoint whatever <code>columns</code> says,
              because two columns of label-and-value on a narrow screen puts four words on each
              line.
            </p>
            <p>
              Set <code>wide</code> on any item whose value wraps — an address, a list of documents,
              a reason for return. A long value squeezed into half the width sets a ragged column
              the eye has to work down twice.
            </p>
            <p>
              <code>layout=&quot;inline&quot;</code> puts the term in a fixed leading column and
              reads better for a short single-column list. That column is measured in{" "}
              <code>ch</code>, not pixels, so it grows with the reader&apos;s font size rather than
              clipping the label at 200% zoom.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { DescriptionList, Badge } from "@mosje/design-system";

<DescriptionList
  items={[
    { term: "Application Number", value: application.reference },
    { term: "Applicant", value: application.applicantName },
    { term: "Status", value: <Badge status="warning">Pending Verification</Badge> },
    { term: "Aadhaar Number", value: application.aadhaar },
    { term: "Registered Address", value: application.address, wide: true },
  ]}
/>`}</CodeBlock>
          <p>
            Values are <code>ReactNode</code>, so a badge, a link or a formatted figure goes in
            directly. <code>hint</code> takes one line under the value — a unit, a source, or when
            it was recorded.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-dl">
          <h2 id="cdp-dl" className="cdp__h2">
            Why It Has to Be a <code>&lt;dl&gt;</code>
          </h2>
          <p>
            The same grid built from <code>&lt;div&gt;</code>s reads to a screen reader as an
            undifferentiated run of text — &ldquo;Date of Birth 12 March 1994 District Bankura
            Status Pending&rdquo; — with nothing to say where one fact ends and the next begins. On
            a record of twenty fields that is unusable.
          </p>
          <p>
            The <code>&lt;dt&gt;</code>/<code>&lt;dd&gt;</code> pairing puts the relationship in the
            markup, so each value is announced together with the field it belongs to and the reader
            can move between them. It costs nothing visually and it is the whole reason to reach for
            this component rather than a grid of your own.
          </p>
        </section>
      }
    />
  );
}
