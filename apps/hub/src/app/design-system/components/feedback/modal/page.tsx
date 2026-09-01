import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { ModalPlayground } from "./modal-playground";

export const metadata: Metadata = {
  title: "Modal — Design System",
  description:
    "The shared accessible dialog: a backdrop, a focus trap, Escape to close and focus returned to the control that opened it.",
};

/*
 * Read off `ModalProps` in packages/design-system/components/feedback/modal.tsx.
 * `ModalProps` is a standalone interface — it does NOT extend HTMLAttributes, so
 * there is no rest spread and no arbitrary div attribute passthrough.
 */
const PROPS: PropDef[] = [
  {
    name: "open",
    type: "boolean",
    required: true,
    description:
      "Whether the dialog is mounted. It renders nothing at all when false, so there is no hidden panel left in the page.",
  },
  {
    name: "onClose",
    type: "() => void",
    required: true,
    description:
      "Called on Escape, on a backdrop press, and on the close button. The component holds no open state of its own.",
  },
  {
    name: "title",
    type: "React.ReactNode",
    required: true,
    description:
      "The dialog heading. It renders as an h2 with a generated id, and the panel's aria-labelledby points at it — so the dialog is named by construction and cannot ship unnamed.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "The body. It scrolls within the panel when it is longer than the viewport allows.",
  },
  {
    name: "footer",
    type: "React.ReactNode",
    default: "undefined",
    description: "The action row. Omit it for a dialog the reader only reads.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description:
      "Maximum width: sm is 24rem, md is 28rem, lg is 40rem. The height always follows the content.",
  },
  {
    name: "hideClose",
    type: "boolean",
    default: "false",
    description:
      "Hide the close (×) control. Escape and the backdrop still close the dialog, so this removes one of three exits, not the only one.",
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
      'The panel carries role="dialog" and aria-modal="true", and aria-labelledby points at the generated id of the title heading, so the dialog is always announced by name.',
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    description:
      "Tab and Shift+Tab cycle within the panel while it is open, and Escape leaves it. Focus is confined deliberately and there is always a key that releases it.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "On open, focus moves to the first focusable control inside the panel. On close, the effect cleanup returns focus to the element that was active when the dialog opened, so a keyboard user does not land back at the top of the page.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    description:
      "Background scrolling is locked while the dialog is open and the previous overflow is restored on close, so the page behind cannot be moved out from under the dialog.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      'The close control is a real button carrying aria-label="Close dialog", named independently of the × glyph.',
  },
];

export default function ModalPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Modal"
      status="Stable"
      summary="The estate's shared dialog. It bakes in what every portal was otherwise re-implementing: a backdrop, a focus trap, Escape to close, a background scroll lock, and focus returned to whatever opened it."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<ModalPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A decision must be made before the reader continues — confirming a submission, or a deletion that cannot be undone.",
          "A short, self-contained sub-task interrupts the main one: naming something, picking one option from a short list.",
          "A form of about five fields or fewer, where nothing on the page behind needs to stay readable.",
        ],
        avoid: [
          "The form has six or more fields, or the reader needs the list behind it — use a Side Sheet, which leaves the context visible.",
          "The message only reports what happened — use a Toast, or an Alert where the condition persists.",
          "The content is a photograph, a document or a gallery — use a Lightbox.",
          "Another dialog is already open. Modals do not stack; a second one hides the first and there is no way back to it.",
        ],
      }}
      related={[
        {
          label: "Side Sheet",
          href: "/design-system/components/feedback/side-sheet",
          reason: "for longer forms that need the list context kept",
        },
        {
          label: "Lightbox",
          href: "/design-system/components/feedback/lightbox",
          reason: "for viewing images and video full screen",
        },
        {
          label: "Toast",
          href: "/design-system/components/feedback/toast",
          reason: "when nothing has to be decided, only reported",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <ol>
              <li>
                <strong>Backdrop</strong> — the scrim over the page. Pressing it closes the dialog.
              </li>
              <li>
                <strong>Header</strong> — the title and the close control. The title is wired to{" "}
                <code>aria-labelledby</code> automatically.
              </li>
              <li>
                <strong>Body</strong> — the content, which scrolls when it is taller than the space
                available.
              </li>
              <li>
                <strong>Footer</strong> — optional, holding the actions.
              </li>
            </ol>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-sizes">
            <h2 id="cdp-sizes" className="cdp__h2">
              Sizes
            </h2>
            <ul>
              <li>
                <strong>sm — 24rem.</strong> Confirmations and single-field prompts.
              </li>
              <li>
                <strong>md — 28rem.</strong> The default: a short form or a settings sub-task.
              </li>
              <li>
                <strong>lg — 40rem.</strong> Where the content genuinely needs the width, such as a
                small table.
              </li>
            </ul>
            <p>
              Height is never set. The panel grows with its content and the body scrolls once it
              runs out of room, so a dialog is never taller than the viewport.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-restraint">
            <h2 id="cdp-restraint" className="cdp__h2">
              Use It Sparingly
            </h2>
            <p>
              A modal halts what the reader was doing and demands an answer before giving it back.
              That is the right trade for an irreversible action and the wrong one for almost
              everything else. Where a dialog is being reached for because the layout has nowhere
              else to put something, the layout is the problem.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Modal, Button } from "@mosje/design-system";

const [open, setOpen] = React.useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Application Submission"
  size="sm"
  footer={
    <>
      <Button variant="neutral" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={submit}>Confirm</Button>
    </>
  }
>
  <p>You will not be able to edit this application after it is submitted.</p>
</Modal>`}</CodeBlock>
          <p>
            <code>onClose</code> is almost always an inline arrow, which is a new function on every
            parent render. The focus-trap effect deliberately depends on <code>open</code> alone and
            reads the latest handler through a ref — without that, typing in a controlled input
            inside the dialog tore the effect down on every keystroke, refocusing the first control
            each time and making the form impossible to fill in.
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
                <strong>Escape</strong> — closes the dialog from anywhere inside it, whatever has
                focus. It calls <code>onClose</code>, so the consumer still decides what closing
                means.
              </li>
              <li>
                <strong>Tab</strong> — moves through the panel&apos;s controls. From the last one it
                wraps to the first rather than escaping to the page behind.
              </li>
              <li>
                <strong>Shift + Tab</strong> — the same in reverse: from the first control it wraps
                to the last.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-focus">
            <h2 id="cdp-focus" className="cdp__h2">
              Focus Trap, Escape and Focus Restore
            </h2>
            <p>
              These three are the reason this component exists, and all three are handled by the
              component rather than by its consumer.
            </p>
            <p>
              <strong>The trap</strong> is a keydown listener on the document. It collects the
              panel&apos;s focusable descendants on every Tab — links, enabled buttons, enabled
              inputs, selects, textareas and anything with a non-negative{" "}
              <code>tabindex</code> — and wraps at both ends. Collecting them per keystroke rather
              than once on open is what makes the trap correct in a dialog whose contents change,
              such as one with a conditionally rendered field.
            </p>
            <p>
              <strong>Escape</strong> is handled by the same listener, checked before the Tab
              branch, so it works from a text input where a form would otherwise swallow it.
            </p>
            <p>
              <strong>Focus restore</strong> is the effect&apos;s cleanup. The element that was
              active at the moment of opening is captured, and refocused when the dialog unmounts —
              so the reader returns to the button they pressed rather than to the top of the
              document.
            </p>
            <p>
              One consequence worth knowing: focus lands on the first focusable control in the
              panel, which is the close button whenever it is shown. A dialog rendered with{" "}
              <code>hideClose</code> and no focusable content has nothing to receive focus, so give
              such a dialog at least one control.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-scroll">
            <h2 id="cdp-scroll" className="cdp__h2">
              Background Scroll
            </h2>
            <p>
              <code>document.body</code> has its overflow hidden for as long as the dialog is open,
              and its previous value is put back on close rather than being reset to a default. This
              stops a pointer or switch user reaching the page behind the scrim while a dialog is
              claiming to be modal.
            </p>
          </section>
        </>
      }
    />
  );
}
