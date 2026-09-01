import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { LiveRegionSpecimen } from "./live-region-specimen";

export const metadata: Metadata = {
  title: "Live Region — Design System",
  description:
    "A visually hidden ARIA live region for announcing a change that moves no focus — “Filter applied, 12 results”, “3 records exported”, “Saved”.",
};

/*
 * Read off `LiveRegionProps` in packages/design-system/components/utilities/live-region.tsx.
 * The companion hook `useLiveRegion()` is documented below the table, because a region with
 * no way to write to it is inert and the two are never used apart.
 */
const PROPS: PropDef[] = [
  {
    name: "politeness",
    type: '"polite" | "assertive"',
    default: '"polite"',
    description:
      "How urgently the announcement interrupts. `polite` waits for a pause in what the reader is already hearing; `assertive` cuts in. Prefer polite — assertive is for a genuine error or a time-critical alert, and a page that interrupts routinely is a page a screen-reader user turns off.",
  },
  {
    name: "ref",
    type: "React.Ref<HTMLDivElement>",
    default: "undefined",
    description:
      "Forwarded to the region. Pass the `ref` from `useLiveRegion()` — the hook writes the message through it rather than through state, so an announcement never re-renders the page that owns it.",
  },
];

const HOOK_PROPS: PropDef[] = [
  {
    name: "useLiveRegion().ref",
    type: "React.RefObject<HTMLDivElement | null>",
    description: "Attach to a `<LiveRegion>`. Without it the hook has nothing to write to and `announce` does nothing.",
  },
  {
    name: "useLiveRegion().announce",
    type: "(message: string) => void",
    description:
      "Announce a sentence. It clears the region first and sets the text on the next frame, because a screen reader ignores a write whose text is byte-identical to what is already there — so announcing the same message twice in a row would otherwise be silent the second time.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The region carries `role=\"status\"`, `aria-live` and `aria-atomic=\"true\"`, so a change that moves no focus is announced in full rather than as the difference between two strings.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The region is visually hidden with `ds-sr-only` — clipped, not `display: none`, because a region removed from the layout is also removed from the accessibility tree and announces nothing.",
  },
  {
    criterion: "2.2.1 Timing Adjustable",
    level: "A",
    description:
      "The message is set once and never cleared on a timer, so a reader who arrives at it late still hears it. Anything that must disappear on its own is a Toast, not a live region.",
  },
  {
    criterion: "GIGW 3.0 — Feedback",
    level: "GIGW",
    description:
      "An action that produces no visible focus change still confirms itself, so a screen-reader user is not left with silence after pressing a control.",
  },
];

export default function LiveRegionPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Live Region"
      status="Stable"
      summary="A visually hidden ARIA live region for announcing a change that moves no focus — a filter applied, an export finished, a draft saved. Without one, a screen-reader user gets silence after an action a sighted reader sees confirmed on screen."
      figma={{
        absent: "Not published in the Figma library, and it never will be: the component draws nothing. Its specification is its behaviour.",
      }}
      specimen={<LiveRegionSpecimen />}
      props={[...PROPS, ...HOOK_PROPS]}
      a11y={A11Y}
      whenToUse={{
        use: [
          "An action changes the page without moving focus — a filter is applied, a table is sorted, a count updates.",
          "An asynchronous task finishes and the only visible sign is a number changing somewhere on the page.",
          "A search field returns results into a region the reader is not currently in.",
        ],
        avoid: [
          "The message needs to be seen as well as heard — use Toast, which is visible and announces itself.",
          "The change moves focus anyway — a modal opening, a step advancing; the newly focused element is already announced, and a region would say it twice.",
          "The message is a form-field error — use Form Field, which ties the message to the input through `aria-describedby` so it is read when the field is reached.",
        ],
      }}
      related={[
        { label: "Toast", href: "/design-system/components/feedback/toast", reason: "when the confirmation must be seen as well as heard" },
        { label: "Alert", href: "/design-system/components/feedback/alert", reason: "for a message that stays on the page rather than passing" },
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "for a validation message tied to one input" },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-invisible">
          <h2 id="cdp-invisible" className="cdp__h2">
            There Is Nothing to Design
          </h2>
          <p>
            The component renders an empty, clipped <code>&lt;div&gt;</code>. It has no size, no
            colour and no position, and it must keep all three &mdash; a region hidden with{" "}
            <code>display: none</code> is removed from the accessibility tree and announces
            nothing, which is the commonest way a live region ships broken.
          </p>
          <p>
            What is designed is the <strong>sentence</strong>. Write it as the answer a reader
            would want if they had asked: <em>&ldquo;Filter applied. 12 results.&rdquo;</em> &mdash;
            the outcome and the number, in the department&rsquo;s register. Not
            &ldquo;Success&rdquo;, which says nothing, and not &ldquo;Loading&hellip;&rdquo;, which
            a reader cannot act on.
          </p>
        </section>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <p>
              Mount <strong>one</strong> region per page, near the root, and drive it with the
              hook. Several regions on one page compete, and a screen reader is free to read them
              in any order.
            </p>
            <CodeBlock>{`import { LiveRegion, useLiveRegion } from "@mosje/design-system";

const live = useLiveRegion();

<LiveRegion ref={live.ref} />

// after the work finishes, not when it starts
live.announce(\`\${rows.length} records exported\`);`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-why-ref">
            <h2 id="cdp-why-ref" className="cdp__h2">
              Why the Message Is Not State
            </h2>
            <p>
              The hook writes <code>textContent</code> through the ref rather than holding the
              message in React state. A page announces most often when a list has just been
              re-rendered, and putting the announcement in state would re-render that list again
              for a string nobody can see.
            </p>
            <p>
              It also clears the region and sets the text on the next frame. A screen reader
              ignores a live-region write whose text is byte-identical to what is already there, so
              a reader tapping &ldquo;Apply filter&rdquo; twice would hear it once. Clearing forces
              a fresh diff.
            </p>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-politeness">
          <h2 id="cdp-politeness" className="cdp__h2">
            Polite, Almost Always
          </h2>
          <ul>
            <li>
              <strong>polite</strong> &mdash; the default, and the right answer for a filter, a
              sort, a save, an export. The reader hears it at the next natural pause.
            </li>
            <li>
              <strong>assertive</strong> &mdash; interrupts whatever is being read. Reserve it for
              a genuine failure or a time limit about to expire. Used for routine confirmations it
              makes the page unusable, because every announcement cuts off the sentence before it.
            </li>
          </ul>
          <p>
            <code>aria-atomic=&quot;true&quot;</code> is set, so the whole sentence is read rather
            than only the part that changed. Without it, replacing &ldquo;12 results&rdquo; with
            &ldquo;13 results&rdquo; can be announced as a bare &ldquo;13&rdquo;.
          </p>
        </section>
      }
    />
  );
}
