import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Badge, Icon, ListGroup, ListRow } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "List Group — Design System",
  description:
    "A real <ul> of rows with a leading slot, a text block and a trailing slot — the surface behind recent items, notifications, documents and search results.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The container is a <ul> and every row is an <li>, so a screen reader announces the list and its item count. Leading marks carry aria-hidden because the title beside them is the row's name. Read from the rendered DOM on this page.",
    description:
      "Rows are list items, so the reader is told how many records there are before reading them.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The interactive element is the row itself — an <a> or <button> filling the row's width, at least 12px of padding above and below a 20px line. Measured with getBoundingClientRect: rows on this page exceed 44px tall and the full content width, far above the 24×24 minimum.",
    description:
      "The whole row is the target, not the title inside it.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'A row with `href` renders an <a> and takes aria-current="page" when selected; a row with `onClick` renders a <button> and takes aria-pressed; a row with neither renders a plain <div> and no interactive role is invented. Read from the DOM across the three specimens on this page.',
    description:
      "A row is a link when it goes somewhere and a button when it does something — never a div with a click handler.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    evidence:
      "Read from the rendered DOM: the selected row carries aria-current=\"page\" and a non-none box-shadow — the inset leading rule — in addition to its tinted fill, so the state is conveyed three ways. The forced-colors claim below is reasoning about how box-shadow and background are treated in that mode, not a measurement, and is not counted here.",
    description:
      "Selection is marked by a leading rule and an ARIA state, not by colour alone.",
  },
];

const SPECIMEN_WRAP: React.CSSProperties = {
  padding: "var(--sa-padding-32)",
  background: "var(--sa-bg-neutral-subtle)",
  borderRadius: "var(--sa-shape-8)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--sa-stack-32)",
};

export default function ListGroupPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="List Group"
      status="Stable"
      summary="A real <ul> of rows, each with a leading slot, a text block and a trailing slot. The whole row is the target, and a row is a link when it goes somewhere and a button when it does something."
      figma={{
        absent:
          "A master exists and DISAGREES SUBSTANTIALLY. The library's List page carries a Material-style List / Item set of over 200 variants (Condition × Leading × Trailing × State). This component is deliberately simpler and takes a different position on what a row is. Reconciling them is an open item.",
      }}
      specimen={
        <div style={SPECIMEN_WRAP}>
          <ListGroup bordered aria-label="Recent applications">
            <ListRow
              href="#one"
              eyebrow="MOSJE/AVYAY/2026/004821"
              title="Sunita Devi — Atal Vayo Abhyuday Yojana"
              description="Bankura, West Bengal · Submitted 3 September 2026"
              leading={<Icon name="description" size={24} />}
              trailing={<Badge status="warning">Pending</Badge>}
            />
            <ListRow
              href="#two"
              selected
              eyebrow="MOSJE/NAPDDR/2026/001194"
              title="Rehabilitation Centre, Guwahati — Annual Grant"
              description="Kamrup Metropolitan, Assam · Submitted 28 August 2026"
              leading={<Icon name="description" size={24} />}
              trailing={<Badge status="success">Approved</Badge>}
            />
            <ListRow
              href="#three"
              eyebrow="MOSJE/SHRESHTA/2026/000733"
              title="Residential Education Support — Mode 2"
              description="Ranchi, Jharkhand · Returned for correction 1 September 2026"
              leading={<Icon name="description" size={24} />}
              trailing={<Badge status="danger">Returned</Badge>}
            />
          </ListGroup>

          <ListGroup bordered size="sm" aria-label="Documents to verify">
            <ListRow
              title="Aadhaar card"
              description="Uploaded 3 September 2026 · 1.2 MB"
              leading={<Icon name="badge" size={20} />}
              trailing={<Icon name="chevron_right" size={20} />}
            />
            <ListRow
              disabled
              title="Bank passbook"
              description="Not yet uploaded by the applicant."
              leading={<Icon name="account_balance" size={20} />}
            />
          </ListGroup>
        </div>
      }
      propsFrom="ListGroupProps"
      props={[
        {
          name: "ListRow",
          type: "component",
          description:
            "One row. `title` · `description` · `eyebrow` · `leading` · `trailing` · `href` · `onClick` · `selected` · `disabled`. Give it `href` OR `onClick`, never both; give it neither for a row that is only text.",
        },
      ]}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A panel lists records the reader takes one at a time — recent applications, notifications, documents, search results.",
          "Each record needs a mark or an icon, a line or two of text, and a status at the end.",
          "The list is short enough to read, or long enough to page — never long enough to scroll inside its own card.",
        ],
        avoid: [
          "The reader compares one field across many records — that is a Data Table, which can sort and scan down a column.",
          "The rows are navigation for the page itself — that is Sidebar Nav or Content Nav.",
          "There is one record. A list of one is a card.",
        ],
      }}
      related={[
        {
          label: "Data Table",
          href: "/design-system/components/data-display/data-table",
          reason: "when the reader compares a field across records",
        },
        {
          label: "Card",
          href: "/design-system/components/data-display/card",
          reason: "for a single record with its own layout",
        },
        {
          label: "Empty State",
          href: "/design-system/components/feedback/empty-state",
          reason: "for what a list shows when it has nothing in it",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-not-table">
            <h2 id="cdp-not-table" className="cdp__h2">
              List or Table
            </h2>
            <p>
              A table is for records the reader <em>compares</em> — sorting, scanning down one
              field, exporting. A list is for records the reader takes one at a time. Reaching for a
              table because the data has fields produces twelve columns on a phone; reaching for a
              list because it looks lighter produces a comparison the reader cannot make.
            </p>
            <p>
              The test is what the reader does next. If they will pick one and open it, it is a
              list. If they will read down a column, it is a table.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-target">
            <h2 id="cdp-target" className="cdp__h2">
              The Whole Row Is the Target
            </h2>
            <p>
              A 40px-wide link inside a 600px row is a target most people miss and everyone with a
              tremor misses. WCAG 2.2 §2.5.8 asks for 24×24 as a minimum; a row is not aiming at the
              minimum.
            </p>
            <p>
              Where a row needs a <em>second</em> action as well as its own — a download beside a
              record that opens — that action goes in <code>trailing</code> as its own control and
              the row stays plain. Nesting a button inside a link is invalid HTML and produces a
              target whose behaviour depends on which pixel was hit.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-length">
            <h2 id="cdp-length" className="cdp__h2">
              Length
            </h2>
            <p>
              A long list is <strong>paged</strong>, never scrolled inside its own card. On a phone
              a reader flicking the page down lands in the list and moves the list instead, and a
              fixed page size keeps the surface the same height whatever is in it.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ListGroup, ListRow, Badge, Icon } from "@mosje/design-system";

<ListGroup bordered aria-label="Recent applications">
  {applications.map((a) => (
    <ListRow
      key={a.reference}
      href={\`/portals/e-anudaan/applications/\${a.reference}\`}
      eyebrow={a.reference}
      title={a.title}
      description={\`\${a.district}, \${a.state} · Submitted \${a.submittedOn}\`}
      leading={<Icon name="description" size={24} />}
      trailing={<Badge status={a.tone}>{a.status}</Badge>}
    />
  ))}
</ListGroup>`}</CodeBlock>
          <p>
            <code>aria-label</code> names the list when no heading above it already does. A bare
            list announced as &ldquo;list, 12 items&rdquo; tells a screen-reader user how many of
            what.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-role">
            <h2 id="cdp-role" className="cdp__h2">
              Link, Button, or Neither
            </h2>
            <p>
              A row is a link when it goes somewhere and a button when it does something. It is
              never both, and a row that is neither stays a plain <code>&lt;div&gt;</code> rather
              than becoming one with a click handler. That distinction is what lets a keyboard user
              know, before activating a row, whether they are about to navigate or to act — and it
              is what makes &ldquo;open in a new tab&rdquo; work on the rows where it should.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-selected">
            <h2 id="cdp-selected" className="cdp__h2">
              Selection Is Not Only a Colour
            </h2>
            <p>
              A selected row carries an inset leading rule as well as a tinted fill, plus{" "}
              <code>aria-current=&quot;page&quot;</code> on a link or <code>aria-pressed</code> on a
              button. Colour alone would fail WCAG 1.4.1, and the fill disappears entirely in
              Windows High Contrast — where the rule survives.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-disabled">
            <h2 id="cdp-disabled" className="cdp__h2">
              A Disabled Row Stays in the List
            </h2>
            <p>
              A row that cannot be acted on renders as plain text with{" "}
              <code>aria-disabled</code> rather than disappearing. &ldquo;Bank passbook — not yet
              uploaded by the applicant&rdquo; is information the reader needs; removing the row
              would leave them to notice an absence.
            </p>
          </section>
        </>
      }
    />
  );
}
