import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { ChatbotMascot } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Chatbot Mascot — Design System",
  description:
    "The Samajik Sahayak assistant mark: a brand-coloured disc carrying the mascot, and an optional white ring carrying the bilingual wordmark.",
};

/*
 * Read off `ChatbotMascotProps` in
 * packages/design-system/components/feedback/chatbot-mascot.tsx. The interface
 * extends `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">`, so every
 * standard span attribute — including `aria-label` and `style` — passes through.
 *
 * Corrected 2026-09-02: the previous table omitted `className` and `aria-label`,
 * and did not say that passing an accessible name changes the element's role.
 */
const PROPS: PropDef[] = [
  {
    name: "size",
    type: "number",
    default: "84",
    description:
      "Rendered diameter in pixels. Every inner measurement is a percentage of it, so the mark scales cleanly — the two sizes the design uses are the 84px launcher and the 37px avatar beside a message.",
  },
  {
    name: "ring",
    type: "boolean",
    default: "false",
    description:
      "Show the circular bilingual wordmark on a white ring around the disc. True for the launcher; false for the small avatar, where the wordmark is unreadable and only muddies the mark.",
  },
  {
    name: "spin",
    type: "boolean",
    default: "false",
    description:
      "Turn the wordmark's slow idle rotation on. Ignored when `ring` is false, and inert under prefers-reduced-motion.",
  },
  {
    name: "aria-label",
    type: "string",
    default: "undefined",
    description:
      'Passing one changes the element from decorative to meaningful: the mark drops aria-hidden and takes role="img". Leave it off wherever the mark sits inside a control or beside a message that is already named.',
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the root span.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'Decorative by default: the whole mark is aria-hidden and the inner image carries an empty alt, because in every current use it sits inside a control or beside a message that already carries the name. Passing aria-label switches it to role="img" with that name.',
  },
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    description:
      "Nothing rotates unless a caller asks for it. The seal used to start on pointer-enter and later on the assistant's thinking state; it now turns only for `spin`, so the mark presents nothing that runs on its own for a reader to have to stop.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description: "The rotation is switched off entirely under prefers-reduced-motion.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The disc binds `bg/brand/primary/bolder` rather than a fixed navy, so the mark follows `data-brand` across modes instead of being the one control on the page that ignores it.",
  },
];

export default function ChatbotMascotPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Chatbot Mascot"
      status="Stable"
      summary="The Samajik Sahayak mark. Two parts that stay separate nodes on purpose: a brand-coloured disc carrying the mascot, and an optional white ring carrying the circular bilingual wordmark."
      figma={{ node: "chatbotMascot" }}
      specimen={
        <div className="cdp__specimen-row">
          <ChatbotMascot size={84} ring />
          <ChatbotMascot size={84} ring spin />
          <ChatbotMascot size={37} />
        </div>
      }
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "The assistant's launcher, at 84px with the ring — the one place the seal is legible.",
          "The avatar beside a bot turn in the transcript, at 37px without the ring.",
          "A documentation specimen or a Figma-parity check, which is the honest use of the rotation.",
        ],
        avoid: [
          "Anything that is not the assistant. It is that service's mark, not a generic help icon — use Icon.",
          "A size below about 48px with the ring shown. Turn the ring off instead; it is not decoration that may be kept at any size.",
          "Standing in for the National Emblem or a departmental crest — those are brand assets and live in Org Logo.",
        ],
      }}
      related={[
        {
          label: "Chatbot",
          href: "/design-system/components/feedback/chatbot",
          reason: "the widget this mark belongs to",
        },
        {
          label: "Icon",
          href: "/design-system/components/utilities/icon",
          reason: "for an ordinary interface glyph",
        },
        {
          label: "Org Logo",
          href: "/design-system/components/brand/org-logo",
          reason: "for a departmental or organisation mark",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-two-nodes">
            <h2 id="cdp-two-nodes" className="cdp__h2">
              Why It Is Two Nodes
            </h2>
            <p>
              Separating the ring from the disc is what lets the wordmark rotate while the mascot
              stays level. A flattened asset would have to spin the robot too, which reads as a
              loading spinner rather than as a seal.
            </p>
            <p>
              The artwork itself is exported from Figma and never redrawn. The wordmark is live text
              on a path in the master, flattened to outlines for the web, and the ring&apos;s insets
              are computed from that flattened ink box — so re-export and re-measure together
              whenever the text changes.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-sizes">
            <h2 id="cdp-sizes" className="cdp__h2">
              Two Sizes, One With the Ring
            </h2>
            <ul>
              <li>
                <strong>84px with the ring</strong> — the launcher. The white ring takes the outer
                band and the wordmark rides on it.
              </li>
              <li>
                <strong>37px without it</strong> — beside a message, or in the panel header. At that
                size the wordmark is a grey smudge, and a seal that cannot be read is not a seal.
              </li>
            </ul>
            <p>
              Below roughly 48px, pass <code>ring={"{false}"}</code> rather than scaling the seal
              down.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-colour">
            <h2 id="cdp-colour" className="cdp__h2">
              The Disc Follows the Brand
            </h2>
            <p>
              The artwork is the robot; the disc is the surface it is mounted on, which is ordinary
              brand chrome. It binds <code>bg/brand/primary/bolder</code>, so it changes with{" "}
              <code>data-brand</code>. Leaving it fixed made the launcher the one control on the page
              that ignored the brand switch.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-motion">
            <h2 id="cdp-motion" className="cdp__h2">
              Motion
            </h2>
            <p>
              The seal turns for exactly one reason: a caller passed <code>spin</code>. It never
              starts by itself.
            </p>
            <p>
              It used to start on pointer-enter and stop on leave, and an animation snapping from
              stopped to full speed is inherently abrupt — there is no way to ease into a keyframe
              loop. Hover is carried by lift and shadow instead, which are transitions and therefore
              reverse cleanly.
            </p>
            <p>
              It was then wired to the assistant&apos;s thinking state, which was worse in a quieter
              way: the widget only thinks while it is open, and while it is open the launcher has
              already crossfaded this mark to a close control. The loop ran at full speed behind
              something opaque. The honest use for <code>spin</code> is documentation and specimens —
              including the middle one above.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ChatbotMascot } from "@mosje/design-system";

// The launcher: full size, with the seal.
<ChatbotMascot size={84} ring />

// Beside a bot turn: no ring, and decorative — the message carries the name.
<ChatbotMascot size={37} />`}</CodeBlock>
          <p>
            Where the mark is the only thing identifying a control, give it a name and it becomes an
            image rather than decoration.
          </p>
          <CodeBlock>{`<ChatbotMascot size={84} ring aria-label="Samajik Sahayak, chat assistant" />`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-decorative">
          <h2 id="cdp-decorative" className="cdp__h2">
            Decorative Unless You Name It
          </h2>
          <p>
            With no <code>aria-label</code>, the whole mark is <code>aria-hidden</code> and the
            embedded artwork carries an empty <code>alt</code>. That is the right default for its two
            real uses: inside the launcher button, which has its own accessible name, and beside a
            message that is already attributed to the assistant.
          </p>
          <p>
            Passing an <code>aria-label</code> flips it: the element drops{" "}
            <code>aria-hidden</code> and takes <code>role=&quot;img&quot;</code> with that name. Do
            that only where the mark is genuinely the only identification, or a screen-reader user
            hears the assistant named twice on every turn.
          </p>
        </section>
      }
    />
  );
}
