import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { SettingsSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Settings Screen — Design System",
  description: "An administered configuration surface: a section index beside inline-editable rows.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "The index is a nav with its own heading, and each section is focusable, so a skip lands on the section rather than merely scrolling it into view.",
    status: "verified",
    evidence: "The index is nav[aria-labelledby]; each section carries tabIndex={-1} and scroll-margin-top.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Every section is labelled by its own heading, and the index is a real list of links to those headings.",
    status: "verified",
    evidence: "Each section renders aria-labelledby pointing at its own h2; the index renders ul/li/Link with matching hash targets.",
  },
  {
    criterion: "3.3.4 Error Prevention",
    level: "AA",
    description:
      "A value that cannot be edited says why, rather than simply not offering the control.",
    status: "verified",
    evidence: "readOnlyReason is forwarded to InlineEdit, which renders the reason in place of the trigger.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "Each edit trigger names its field, so a page of seventeen settings does not offer seventeen identical buttons.",
    status: "verified",
    evidence: "Inherited from InlineEdit, whose trigger label is built from the row's label.",
  },
];

export default function SettingsScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Settings Screen"
      status="Beta"
      summary={"Configuration the reader administers. An index of real anchor links beside sections of inline-editable rows, and every save is confirmed."}
      figma={{
        absent:
          "Absent. Settings and profile are among the archetypes the handoff does not draw at all.",
      }}
      specimen={<SettingsSpecimen />}
      propsFrom="SettingsScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Organisation profile, bank details, notification preferences, master data.",
          "Anything a reader administers one value at a time.",
        ],
        avoid: [
          "A form submitted as one unit — that is Form Screen.",
          "A record read but not changed — that is Record Screen.",
        ],
      }}
      related={[
        { label: "Inline Edit", href: "/design-system/components/forms/inline-edit", reason: "the editable row" },
        { label: "Form Screen", href: "/design-system/components/templates/form-screen", reason: "when it submits as one unit" },
        { label: "Record Screen", href: "/design-system/components/templates/record-screen", reason: "the read-only view" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-confirmed">
            <h2 id="cdp-confirmed" className="cdp__h2">Confirmed Saves, and No Option to Change That</h2>
            <p>
              The catalogue recorded this template as &ldquo;blocked on the optimistic-save
              decision&rdquo;. It is not blocked: on a departmental register the decision is
              already made. An officer who watched a value change has no reason to look again, and
              a failed write leaves the register holding the old one.
            </p>
            <p>
              <code>InlineEdit</code> states that position and enforces it, so this template
              inherits rather than re-argues it.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-index">
            <h2 id="cdp-index" className="cdp__h2">Anchors, Not Scroll-Spy</h2>
            <p>
              A settings page runs to a dozen sections and a reader looking for &ldquo;Bank
              details&rdquo; should find it by name in one place. Anchor links survive with
              JavaScript off, are shareable, and are what a keyboard user expects from a list of
              headings.
            </p>
            <Callout type="info" title="Not everything is a single value">
              A list of toggles or a table of delegates goes in a section&rsquo;s{" "}
              <code>children</code>. Forcing it through InlineEdit is the God-component failure the
              architecture rule warns about.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<SettingsScreen
  title="Organisation Settings"
  sections={[
    {
      id: "identity",
      title: "Organisation Identity",
      rows: [
        {
          id: "name",
          label: "Registered name",
          value: org.name,
          readOnlyReason: "Set from NGO-Darpan. Correct it there and it will update here.",
          onSave: noop,
        },
        { id: "contact", label: "Contact person", value: org.contact, onSave: saveContact },
      ],
    },
    { id: "delegates", title: "Delegated Users", children: <DelegateTable /> },
  ]}
/>`}</CodeBlock>
          <p>
            <code>onSave</code> may return a promise; the row stays busy until it settles and a
            rejection leaves the reader&rsquo;s text where they can try again.
          </p>
        </section>
      }
    />
  );
}
