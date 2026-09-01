import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { SideSheetSpecimen } from "./side-sheet-specimen";

export const metadata: Metadata = {
  title: "Side Sheet — Design System",
  description:
    "An edge-anchored panel for long forms and record inspection, keeping the list behind it visible while the task is carried out.",
};

/*
 * Read off `SideSheetProps` in
 * packages/design-system/components/feedback/side-sheet.tsx. `SideSheetProps` is
 * a standalone interface — it does NOT extend HTMLAttributes, so there is no
 * rest spread.
 *
 * Corrected 2026-09-02: the previous table carried four props and omitted
 * `footer`, `size`, `side` and `className`.
 */
const PROPS: PropDef[] = [
  {
    name: "open",
    type: "boolean",
    required: true,
    description: "Whether the panel is mounted. It renders nothing at all when false.",
  },
  {
    name: "onClose",
    type: "() => void",
    required: true,
    description:
      "Called on Escape, on a backdrop press, and on the close button. Pass a stable reference — see the note in the Code tab.",
  },
  {
    name: "title",
    type: "React.ReactNode",
    required: true,
    description:
      "The panel heading. It renders as an h2 with a generated id, and aria-labelledby points at it, so the dialog is named by construction.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "The body, which scrolls independently of the page behind it.",
  },
  {
    name: "footer",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "A sticky action row at the foot of the panel. It stays in place while the body scrolls, so “Save” is reachable from anywhere in a long form.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description:
      "Panel width: sm is 400px, md is 480px, lg is 560px. Each is capped at the viewport width, so the panel becomes full-screen on a phone rather than overflowing it.",
  },
  {
    name: "side",
    type: '"left" | "right"',
    default: '"right"',
    description:
      "Which edge the panel is anchored to. Use `left` for a navigation drawer — that is the convention readers already hold, and navigation is the one case where breaking it costs more than it gains.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the panel, not the backdrop.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'The panel carries role="dialog" with aria-modal="true", and aria-labelledby points at the generated id of the title, so it is always announced by name.',
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    description:
      "Tab and Shift+Tab cycle within the panel while it is open, and Escape leaves it. The confinement is deliberate and always has a key that releases it.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "On open, focus moves to the first focusable control in the panel. On close, the element that was active when it opened is refocused, so the reader returns to the row they were on.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    description:
      "Background scrolling is locked while the panel is open and the previous value is restored on close, so the list behind stays where the reader left it.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'The backdrop is aria-hidden="true" and the close control carries aria-label="Close panel", so the only thing announced is the dialog and its name.',
  },
];

export default function SideSheetPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Side Sheet"
      status="Stable"
      summary="An edge-anchored panel for tasks that need room and context at once — a long form, a record being inspected, a set of filters. The list behind it stays visible, which is the whole reason to choose it over a dialog."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<SideSheetSpecimen />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form has six or more fields, or a textarea the writer needs room for.",
          "The reader benefits from seeing the list or table behind the panel — inspecting one application while the queue stays in view.",
          "A file-upload and preview flow, where the panel holds both the control and the result.",
          "A navigation drawer, anchored to the left edge, on a narrow viewport.",
        ],
        avoid: [
          "The decision is short and irreversible — use a Modal, which is centred and reads as a stop.",
          "The content is a photograph, a certificate or a video — use a Lightbox.",
          "Nothing has to be decided at all — use a Toast for the report, or an Alert for a standing condition.",
          "Another sheet or dialog is already open. These do not stack; the second hides the first with no way back.",
        ],
      }}
      related={[
        {
          label: "Modal",
          href: "/design-system/components/feedback/modal",
          reason: "for short confirmations that should stop the reader",
        },
        {
          label: "Nav Sheet",
          href: "/design-system/components/navigation/nav-sheet",
          reason: "for the mobile navigation drawer specifically",
        },
        {
          label: "Lightbox",
          href: "/design-system/components/feedback/lightbox",
          reason: "for viewing media rather than working on a record",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-vs-modal">
            <h2 id="cdp-vs-modal" className="cdp__h2">
              Side Sheet or Modal
            </h2>
            <p>
              Both are modal dialogs with the same trap, the same Escape and the same focus restore.
              The difference is what they do to the page behind, and therefore what they are for.
            </p>
            <p>
              A <strong>Modal</strong> is centred over a scrim and asks a question the reader must
              answer before continuing. A <strong>Side Sheet</strong> is anchored to an edge and
              leaves the list readable, so a reader can check one row against the panel without
              closing it. Choose by whether the context behind matters, not by how much content
              there is.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <ol>
              <li>
                <strong>Backdrop</strong> — the scrim. Pressing it closes the panel.
              </li>
              <li>
                <strong>Header</strong> — the title and the close control, fixed at the top.
              </li>
              <li>
                <strong>Body</strong> — the content, scrolling independently of the page.
              </li>
              <li>
                <strong>Footer</strong> — optional and sticky, so the actions stay reachable from
                anywhere in a long form.
              </li>
            </ol>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { SideSheet, Button } from "@mosje/design-system";

const [open, setOpen] = React.useState(false);
const close = React.useCallback(() => setOpen(false), []);

<SideSheet
  open={open}
  onClose={close}
  title="Application Details"
  size="lg"
  footer={
    <>
      <Button variant="neutral" onClick={close}>Cancel</Button>
      <Button variant="primary" onClick={save}>Save Changes</Button>
    </>
  }
>
  <ApplicationForm id={selected} />
</SideSheet>`}</CodeBlock>
          <p>
            <strong>Pass a stable <code>onClose</code>.</strong> Unlike Modal, which reads its
            handler through a ref, this component&apos;s focus-trap effect depends on{" "}
            <code>onClose</code> directly — so an inline arrow, which is a new function on every
            parent render, tears the effect down and re-runs it each time the parent re-renders. In
            a panel containing a controlled input that means once per keystroke. Wrap it in{" "}
            <code>useCallback</code>, or hoist it out of the render.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">
              Keyboard
            </h2>
            <ul>
              <li>
                <strong>Escape</strong> — closes the panel from anywhere inside it, whatever has
                focus.
              </li>
              <li>
                <strong>Tab</strong> — moves through the panel&apos;s controls, wrapping from the
                last back to the first rather than escaping to the list behind.
              </li>
              <li>
                <strong>Shift + Tab</strong> — the same in reverse.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-focus">
            <h2 id="cdp-focus" className="cdp__h2">
              Focus Trap and Focus Restore
            </h2>
            <p>
              The panel collects its focusable descendants on every Tab rather than once on open, so
              the trap stays correct in a form whose fields appear and disappear. Focus lands on the
              first of them when the panel opens — the close control, in the default layout.
            </p>
            <p>
              The element that had focus at the moment of opening is captured and refocused when the
              panel unmounts. In the case this component is built for — a queue of applications,
              opened one at a time — that returns the reader to the row they were on rather than to
              the top of the table.
            </p>
            <p>
              The panel is modal: <code>aria-modal=&quot;true&quot;</code> and a hidden backdrop mean
              assistive technology treats the list behind as unavailable while it is open. That is
              deliberate even though the list stays <em>visible</em> — visible context is a reading
              aid, not an invitation to interact with two things at once.
            </p>
          </section>
        </>
      }
    />
  );
}
