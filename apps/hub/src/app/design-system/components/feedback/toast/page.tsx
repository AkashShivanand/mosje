import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { ToastPlayground } from "./toast-playground";

export const metadata: Metadata = {
  title: "Toast — Design System",
  description:
    "Transient confirmation of something the reader just did. It appears in a corner viewport, announces itself through a live region, and leaves on its own.",
};

/*
 * Read off `toast.tsx` in packages/design-system/components/feedback/. The
 * component is a provider plus a hook, not a single element — `ToastProvider`
 * takes two props and `useToast()` returns one function, so both are documented
 * here.
 *
 * Corrected 2026-09-02: the previous table documented only the two arguments of
 * `toast()` and omitted `ToastProvider` entirely, including `durationMs`.
 */
const PROPS: PropDef[] = [
  {
    name: "ToastProvider · children",
    type: "React.ReactNode",
    required: true,
    description:
      "The subtree that may raise toasts. The provider renders the viewport after the children, so the corner stack sits above the page it belongs to.",
  },
  {
    name: "ToastProvider · durationMs",
    type: "number",
    default: "3000",
    description:
      "How long each toast stays before it is removed. The timer starts when the toast is raised and is not reset by hover or focus, so raise the value for anything longer than a short sentence.",
  },
  {
    name: "useToast() → toast",
    type: "(message: React.ReactNode, variant?: ToastVariant) => void",
    required: true,
    description:
      "Raises a toast. Calling it outside a ToastProvider throws — the hook has no silent fallback, because a confirmation that never appears is worse than a crash in development.",
  },
  {
    name: "toast · message",
    type: "React.ReactNode",
    required: true,
    description: "One sentence. It is announced as written, so it has to say what happened without the colour.",
  },
  {
    name: "toast · variant",
    type: '"success" | "info" | "warning" | "error"',
    default: '"success"',
    description:
      'The semantic style, which also decides the ARIA role: "error" renders role="alert" and interrupts; the other three render role="status" and wait for a pause.',
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      'The viewport is a live region — aria-live="polite" with aria-atomic="false" — so a toast is announced when it is inserted, without focus moving to it and without the reader losing their place.',
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'Each toast carries its own role: role="alert" for an error, which is assertive and interrupts, and role="status" for the other three, which waits. A failure and a confirmation are not the same urgency and are not announced the same way.',
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The icon and the wording carry the meaning. The four tints repeat what the sentence already says rather than being the only place the state is recorded.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      'Every toast carries a real close button with aria-label="Dismiss notification", so it can be removed before its timer expires without a pointer.',
  },
];

export default function ToastPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Toast"
      status="Stable"
      summary="Transient confirmation of something the reader just did. Toasts appear in a fixed corner viewport, are announced through a live region, and remove themselves after a few seconds without shifting the page."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<ToastPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "An action the reader took has succeeded and needs acknowledging, but nothing else changes — “Draft saved”, “Notice copied”.",
          "The confirmation must not move the page, because the reader is still working in the same place.",
          "The message is one sentence and carries no control the reader must reach.",
        ],
        avoid: [
          "The condition persists and the reader must act on it — use an Alert, which stays put and can carry an action.",
          "The message is an invitation rather than a report — use an Action Banner.",
          "A decision is required before continuing — use a Modal.",
          "The message contains a link or a button. A toast removes itself after three seconds; anything essential inside it is unreachable.",
        ],
      }}
      related={[
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "when the condition persists and needs an action",
        },
        {
          label: "Action Banner",
          href: "/design-system/components/feedback/action-banner",
          reason: "when the message invites rather than reports",
        },
        {
          label: "Live Region",
          href: "/design-system/components/utilities/live-region",
          reason: "to announce a change with no visible notification at all",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-three">
            <h2 id="cdp-three" className="cdp__h2">
              Toast, Alert or Action Banner
            </h2>
            <p>
              These three are the most-confused components in the set, and the distinction is not
              about size or colour. It is about how long the message is true for and what the reader
              must do about it.
            </p>
            <ul>
              <li>
                <strong>Toast</strong> — something just happened; nothing needs doing; the message
                stops being useful in seconds.
              </li>
              <li>
                <strong>Alert</strong> — a condition is true now and stays true; the reader must
                read it, and may need to act on it.
              </li>
              <li>
                <strong>Action Banner</strong> — nothing has happened; the reader is being offered a
                route.
              </li>
            </ul>
            <p>
              The test that settles almost every case: if the reader reloaded the page, would the
              message still be right? Yes means Alert. No means Toast.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-writing">
            <h2 id="cdp-writing" className="cdp__h2">
              Writing the Message
            </h2>
            <p>
              One short sentence, stating what happened rather than thanking the reader for doing
              it. “Application saved.” is a toast; “Success!” is a colour with an exclamation mark.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            The system is a provider mounted once around the surface, and a hook used wherever a
            confirmation is raised.
          </p>
          <CodeBlock>{`import { ToastProvider } from "@mosje/design-system";

<ToastProvider durationMs={4000}>
  {children}
</ToastProvider>`}</CodeBlock>
          <CodeBlock>{`import { useToast, Button } from "@mosje/design-system";

export function SaveDraft() {
  const { toast } = useToast();

  return (
    <Button
      variant="primary"
      onClick={async () => {
        await save();
        toast("Draft saved.", "success");
      }}
    >
      Save Draft
    </Button>
  );
}`}</CodeBlock>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-live">
            <h2 id="cdp-live" className="cdp__h2">
              How a Toast Reaches a Screen Reader
            </h2>
            <p>
              The corner viewport is a permanent live region:{" "}
              <code>aria-live=&quot;polite&quot;</code> with{" "}
              <code>aria-atomic=&quot;false&quot;</code>. It is in the page from the moment the
              provider mounts, which is what makes the mechanism work at all — a live region created
              at the same instant as its content is frequently missed, because assistive technology
              has not begun watching it yet.
            </p>
            <p>
              <code>aria-atomic=&quot;false&quot;</code> means only the toast that was just added is
              announced, not the whole stack. Raising a second toast while the first is still on
              screen therefore reads out one sentence, not two.
            </p>
            <p>
              Each toast then carries its own role. An <code>error</code> renders{" "}
              <code>role=&quot;alert&quot;</code>, which is assertive and interrupts whatever is
              being read; the other three render <code>role=&quot;status&quot;</code>, which waits
              for a natural pause. A failed submission and a saved draft are not the same urgency,
              and treating them alike either under-reports the first or nags about the second.
            </p>
            <p>
              Focus never moves to a toast. The reader stays where they were, which is the whole
              reason a toast is preferred to a dialog for a confirmation.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-timing">
            <h2 id="cdp-timing" className="cdp__h2">
              The Timer, and What It Constrains
            </h2>
            <p>
              A toast is removed <code>durationMs</code> after it is raised — three seconds by
              default. The timer does not pause on hover and does not restart on focus, so the
              window is fixed from the moment the message appears.
            </p>
            <p>
              WCAG 2.2.1 (Timing Adjustable) permits a time limit only where the content is
              non-essential. That is the constraint this component is designed around, and it is the
              reason for the rule above: <strong>nothing essential goes in a toast</strong>. No
              links, no buttons, no information the reader will need later. Where a message must
              survive being missed, it is an Alert.
            </p>
            <p>
              The close control is there so a reader who has read the message can clear it early,
              and so a screen-reader user who lands on it by tabbing has a way to remove it. It is
              not a substitute for the timer.
            </p>
          </section>
        </>
      }
    />
  );
}
