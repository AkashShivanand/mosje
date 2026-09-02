import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { AccordionSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Accordion — Design System",
  description:
    "Collapsible disclosure sections for frequently asked questions, eligibility criteria and application guidelines.",
};

/*
 * `AccordionProps` does not exist: the container is a plain forwardRef over
 * React.HTMLAttributes<HTMLDivElement>, so the extractor has no interface to
 * read. `AccordionItemProps` does, and it comes from `propsFrom`. The two rows
 * below are the container, documented by hand for that reason.
 */
const CONTAINER: PropDef[] = [
  {
    name: "Accordion children",
    type: "React.ReactNode",
    required: true,
    description:
      "AccordionItem elements. The container is a plain grouping div — it holds no state, so it does not close one section when another opens.",
  },
  {
    name: "Accordion className",
    type: "string",
    description: "Merged onto the container. Every native div attribute passes through alongside it.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    description:
      "The header is a real <button type=\"button\">, so Tab reaches it and Enter and Space toggle it with no key handling of our own. Nothing is re-implemented.",
    evidence: "accordion.tsx lines 26–33: a native button element carries the toggle.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "partial",
    description:
      "The header reports aria-expanded, so its open state reaches a screen reader. It does not carry aria-controls: the panel is unmounted while closed, and pointing at an element that does not exist is worse than pointing at nothing. This page previously claimed an aria-controls binding; there has never been one.",
    evidence: "accordion.tsx line 30 sets aria-expanded; line 34 unmounts the panel when closed.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "partial",
    description:
      "The panel follows its header in document order, which is how the relationship is conveyed. There is no heading element around the button, so an accordion used as a page's section structure does not appear in a heading list — wrap the title in a heading of the right level where that matters.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    description:
      "The whole header row is the target, not the chevron, so the hit area spans the full width of the section at the padded row height.",
    evidence: "accordion.css sizes .sa-accordion-item__trigger as a full-width padded row.",
  },
  {
    criterion: "GIGW 3.0 — Content Presentation",
    level: "GIGW",
    status: "untested",
    description:
      "Content inside a closed panel is not in the DOM, so it is not found by the browser's own find-in-page and is not read by a screen reader until opened. That is the correct trade for a FAQ and the wrong one for statutory text a citizen must be able to search for.",
  },
];

export default function AccordionPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Accordion"
      status="Stable"
      summary="Collapses long supporting content into headed sections a reader opens one at a time. It is the estate's pattern for frequently asked questions, eligibility criteria and application guidelines."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<AccordionSpecimen />}
      propsFrom="AccordionItemProps"
      props={CONTAINER}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page carries many questions and answers, and a reader arrives looking for one of them.",
          "Supporting detail — eligibility, documents required, the assessment timetable — would push the primary content off the screen if it were all open.",
          "Each section is genuinely independent, so opening one says nothing about the others.",
        ],
        avoid: [
          "The content is the reason the page exists. Hiding what a citizen came for behind a click is a cost, not a saving.",
          "A primary action or a navigation link would sit inside. A control a reader cannot see is a control they will not find.",
          "The sections are steps in one process — use a Stepper, or a Wizard where each step is a form.",
          "There are two short sections. Two headings and their text read faster than two things to press.",
          "The content must be findable by the browser's own search, or printable in full — a closed panel is not in the DOM.",
        ],
      }}
      related={[
        { label: "Tabs", href: "/design-system/components/navigation/tabs", reason: "when the sections are alternatives rather than a list" },
        { label: "Card", href: "/design-system/components/data-display/card", reason: "when every section should stay open" },
        { label: "Vertical Timeline", href: "/design-system/components/data-display/vertical-timeline", reason: "when the sections are an ordered history" },
        { label: "Stepper", href: "/design-system/components/feedback/stepper", reason: "when the sections are steps in one process" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy and State
            </h2>
            <ul>
              <li>
                <strong>The header</strong> is a button carrying the section title and a chevron that
                turns as it opens. The whole row is the target.
              </li>
              <li>
                <strong>The panel</strong> holds the content, and is removed from the page while
                closed rather than hidden.
              </li>
              <li>
                <strong>Each item owns its own open state</strong>, set initially by{" "}
                <code>defaultOpen</code>. The container holds none, so several sections can be open at
                once and opening one never closes another.
              </li>
            </ul>
            <p>
              There is no single-open mode and no <code>allowMultiple</code> prop. A previous version
              of this page documented one; the component has never had it, and the behaviour it
              described — closing a reader&apos;s section because they opened a second — is rarely what
              a citizen comparing two answers wants.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-writing">
            <h2 id="cdp-writing" className="cdp__h2">
              Writing the Headers
            </h2>
            <p>
              A reader scans headers and opens one. That makes the header the component: write it as
              the question a citizen would ask, in Title Case, and long enough to be answerable —
              &ldquo;What Documents Are Required?&rdquo; rather than &ldquo;Documents&rdquo;.
            </p>
            <p>
              Open the first section with <code>defaultOpen</code> where the page has an obvious
              starting point. Where it does not, leave them all closed: an accordion that opens with
              one section already expanded implies that section is the answer.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Accordion, AccordionItem } from "@mosje/design-system";

<Accordion>
  <AccordionItem title="Who is eligible for the PM-AJAY scholarship?" defaultOpen>
    <p>Students belonging to Scheduled Caste communities whose annual family income is below ₹2.5 lakh.</p>
  </AccordionItem>
  <AccordionItem title="What documents are required?">
    <p>Aadhaar card, income certificate, caste certificate and the latest academic marksheet.</p>
  </AccordionItem>
</Accordion>`}</CodeBlock>
          <p>
            Each item holds its own state, so there is nothing to control from outside and no{" "}
            <code>onChange</code> to wire. Where a section must open in response to something else on
            the page — a deep link, a validation error — that is a different component today, not a
            prop on this one.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — moves to each section header in turn, and then into the open
              panel&apos;s own controls.
            </li>
            <li>
              <strong>Enter</strong> or <strong>Space</strong> — opens or closes the focused section.
              Both come from the native button; neither is re-implemented.
            </li>
          </ul>
          <p>
            There is no arrow-key movement between headers. The ARIA authoring practices offer it as
            an option rather than a requirement, and it is not implemented here — so do not describe
            it on a portal page that uses this component.
          </p>
        </section>
      }
    />
  );
}
