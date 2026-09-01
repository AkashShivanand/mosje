import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  DoDont,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { SectionTitle } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Section Title — Design System",
  description:
    "The standard heading row for a content section: eyebrow, heading, optional count pill, description, and right-aligned actions.",
};


const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Renders a real `<h2>`, `<h3>` or `<h4>` chosen by `as`, so the section appears in the document outline. The eyebrow is a `<div>` and deliberately not a heading — it would otherwise insert a phantom level above every section on the page.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The heading names the section's subject. The description sits outside the heading, so the accessible name stays the title rather than a paragraph.",
  },
  {
    criterion: "2.4.10 Section Headings",
    level: "AAA",
    description:
      "Using this component for every section is what gives a long page a complete heading structure a screen-reader user can navigate by.",
  },
  {
    criterion: "1.3.1 — heading order",
    level: "A",
    description:
      "The component cannot check that `as` is sequential; it renders the level it is given. A page that skips from `h1` to `h4` is a failure this component will not catch for you.",
    status: "partial",
    evidence: "Heading level is caller-supplied; no runtime or build check.",
  },
];

export default function SectionTitlePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Section Title"
      status="Stable"
      summary="The standard heading row for a content section: eyebrow, heading, optional count pill, description, and right-aligned actions. Use it instead of hand-rolling a heading with its own classes, so section headers stay identical estate-wide."
      figma={{
        absent:
          "The section header is a composition of published text styles rather than a component master in the SAMAVESH library.",
      }}
      specimen={
        <SectionTitle
          eyebrow="Eligibility"
          title="Who Can Apply"
          count={4}
          description="Statutory requirements for applicants under the scheme's income-generating component."
        />
      }
      propsFrom="SectionTitleProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The heading row of any content section inside a page — a list, a table, a card grid, a chart.",
          "A section that carries a count the reader needs before they read the rows.",
          "A section with its own actions, such as a filter or an export.",
        ],
        avoid: [
          "The page's own title — use Page Header, which renders the `<h1>` and the meta line.",
          "A form section — use Form Section or Form Card, which own the card chrome and the fieldset semantics.",
          "A heading you want at a particular size — pick the level the outline needs and let the scale follow.",
        ],
      }}
      related={[
        {
          label: "Page Header",
          href: "/design-system/components/layout/page-header",
          reason: "for the page's own title, not a section inside it",
        },
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "when the section is a group of fields",
        },
        {
          label: "Band",
          href: "/design-system/components/layout/band",
          reason: "the full-bleed section a heading row opens",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-hand-rolled">
            <h2 id="cdp-hand-rolled" className="cdp__h2">
              Use It Rather Than Hand-Rolling One
            </h2>
            <p>
              This is the estate&apos;s recurring layout defect and it has a name in the rules:
              a section shipped with its own <code>h2</code> at 26.3px over a 16px lead, beside
              six sibling sections using this component at 18.6px over 12px descriptions. Nothing
              was wrong with the sizes; they simply were not the same as everything around them.
            </p>
            <Callout type="warning" title="Before styling any heading, look at its neighbours">
              If the sections around yours render a design-system heading and yours does not,
              that is the defect — not their size.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-dodont">
            <h2 id="cdp-dodont" className="cdp__h2">
              Writing the Row
            </h2>
            <DoDont
              cards={[
                {
                  type: "do",
                  label:
                    "An eyebrow that categorises, a Title Case heading, and one sentence of support.",
                  preview: (
                    <SectionTitle
                      as={3}
                      eyebrow="Grants-in-Aid"
                      title="Sanctioned Projects"
                      description="Projects sanctioned to States and Union Territories in the current financial year."
                    />
                  ),
                },
                {
                  type: "dont",
                  label:
                    "A sentence-case heading with a paragraph under it. The description is a header, not the section's introduction.",
                  preview: (
                    <SectionTitle
                      as={3}
                      title="Sanctioned projects"
                      description="This section lists the projects that have been sanctioned. It also explains how the sanction process works, which States are eligible, and what the reader should do if a project is missing from the list."
                    />
                  ),
                },
              ]}
            />
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { SectionTitle } from "@mosje/design-system";

<SectionTitle
  eyebrow="Eligibility"
  title="Who Can Apply"
  description="Statutory requirements under section 4(a)."
/>`}</CodeBlock>
          <p>
            Pair <code>headingId</code> with <code>aria-labelledby</code> so the region the
            heading introduces is named by it. This is the only way a table or a list becomes a
            named landmark.
          </p>
          <CodeBlock>{`<section aria-labelledby="applications-heading">
  <SectionTitle
    headingId="applications-heading"
    title="Applications"
    count={applications.length}
  >
    <Button variant="outlined" size="sm">Export</Button>
  </SectionTitle>
  <DataTable rows={applications} />
</section>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-outline">
          <h2 id="cdp-outline" className="cdp__h2">
            Keeping the Outline Sequential
          </h2>
          <p>
            <code>as</code> takes 2, 3 or 4 and renders exactly that. Choose it by where the
            section sits in the page, not by how large the heading should look: a page whose
            title is the <code>h1</code> opens its sections at <code>h2</code>, and a subsection
            inside one of those is <code>h3</code>. Skipping a level leaves a screen-reader user
            navigating by heading with a gap they cannot account for.
          </p>
          <p>
            The eyebrow is deliberately not a heading. It reads as one visually, but marking it
            up as an <code>h2</code> above an <code>h3</code> title would put two entries in the
            outline for one section and make every category name a peer of every section
            heading.
          </p>
        </section>
      }
    />
  );
}
