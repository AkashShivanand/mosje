import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

import { ChatbotPlayground } from "./chatbot-playground";

export const metadata: Metadata = {
  title: "Chatbot — Design System",
  description:
    "Samajik Sahayak, the estate's shared help assistant: a corner launcher that opens a scripted, non-modal chat panel.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The 84px launcher and the three 32px header controls — Start over, expand and minimise — all clear the 24px minimum. So does the composer input, which did not: it was 20px inside a 42px pill, so half of what looked like a text field focused nothing. It now stretches to the pill's inner height, pinned in e2e/chatbot/composer-target.spec.ts.",
    status: "verified",
    evidence: "e2e/chatbot/composer-target.spec.ts",
  },
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    description:
      "Nothing loops at rest. The seal turns only when a caller passes `spin`, so the widget presents nothing for a pause control to pause. The mascot's 2.5px float runs on the launcher only and collapses under prefers-reduced-motion; it used to run on every mascot the component rendered, so a transcript bobbed once per bot avatar.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "New turns are announced through a live region on the log, so an answer arriving after the typing beat reaches a screen reader without focus moving to it.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "On minimise, focus returns to the launcher rather than to the top of the page — so a keyboard user who opened the assistant mid-page returns to where they were.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "The panel's text, its header controls and the footer note all resolve through the neutral and brand token families, so ink and ground move together across brand modes rather than one being fixed against the other.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description:
      "Under prefers-reduced-motion the suggestion cascade, the typing dots and the seal all stop, and the panel appears without growing — rather than not appearing.",
  },
];

export default function ChatbotPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Chatbot"
      status="Stable"
      summary="Samajik Sahayak is the one assistant the whole estate shares. It runs a fixed script, says so under the composer, and never claims to see an application it cannot read."
      figma={{ node: "chatbot" }}
      specimen={
        /* data-no-toc: the panel carries its own h2, which belongs to the widget
           rather than to this page's outline. */
        <div data-no-toc>
          <ChatbotPlayground />
        </div>
      }
      propsFrom="ChatbotProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A surface needs a standing way to answer navigational questions — which scheme, which portal, which form.",
          "The answers can be scripted honestly, and every suggestion maps to a page the citizen can actually be sent to.",
          "The page behind must stay usable while the assistant is open.",
        ],
        avoid: [
          "The message is about something that just happened — use a Toast, or an Alert where the condition persists.",
          "A decision must be made before continuing — use a Modal, which stops the page; the assistant deliberately does not.",
          "The task is transactional — checking a payment, amending an application. The assistant hands those off and says so.",
          "A second one would be mounted on the same surface. It is mounted once, and switched on per surface at /admin/portals.",
        ],
      }}
      related={[
        {
          label: "Chatbot Mascot",
          href: "/design-system/components/feedback/chatbot-mascot",
          reason: "the mark the launcher and the bot turns carry",
        },
        {
          label: "Modal",
          href: "/design-system/components/feedback/modal",
          reason: "when the page must be stopped rather than assisted",
        },
        {
          label: "Toast",
          href: "/design-system/components/feedback/toast",
          reason: "for reporting an outcome rather than answering a question",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-figma">
            <h2 id="cdp-figma" className="cdp__h2">
              In the Figma Library
            </h2>
            <p>
              Beyond the documentation frame linked above, the file carries{" "}
              <a href={figmaUrl(FIGMA_NODES.chatbotPrototype)} target="_blank" rel="noreferrer">
                an interactive prototype
              </a>{" "}
              and{" "}
              <a href={figmaUrl(FIGMA_NODES.chatbotMotion)} target="_blank" rel="noreferrer">
                a motion specimen
              </a>
              .
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              Three regions that never trade places: a fixed header, the scrolling log, and a fixed
              footer. The log is the only region allowed to grow.
            </p>
            <ul>
              <li>
                <strong>Header</strong> — the mascot at 40px, the bilingual title block, then Start
                over, expand and minimise as 32px targets. All three control glyphs are Material
                Symbols Rounded; none is a hand-drawn path.
              </li>
              <li>
                <strong>Log</strong> — bot turns carry an avatar, citizen turns do not. Bubbles cap
                at 67% width, and the squared corner points at the edge the speaker came from.
                Suggestions wrap and pack right, on the citizen&apos;s side: each is a sentence they
                are about to say, and pressing it puts those words in their own bubble.
              </li>
              <li>
                <strong>Footer</strong> — a pill composer and the honest note, and nothing else.
                Start over sits in the header with the other two panel controls: hand-rolled in the
                footer it drifted into the estate&apos;s rejection red for an action that is
                housekeeping, and became the loudest thing in a footer whose only filled control is
                disabled at rest.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              States
            </h2>
            <p>
              Figma draws four states because a static file cannot show motion. They are listed in
              the order the component actually runs them.
            </p>
            <ul>
              <li>
                <strong>Closed</strong> — the launcher alone, on the shared corner rail.
              </li>
              <li>
                <strong>Typing</strong> — a beat after opening, the bot starts composing. Nothing has
                been said yet.
              </li>
              <li>
                <strong>Greeting</strong> — the opening line lands, and the suggestions cascade in
                behind it.
              </li>
              <li>
                <strong>Transcript</strong> — turns accumulate. Pass <code>messages</code> to own the
                conversation yourself.
              </li>
            </ul>
            <p>
              <strong>Typing comes before Greeting, not after it.</strong> This page and the Figma set
              both had it the other way round until the opening effect was read line by line: the
              widget turns typing on a beat after opening and only then, <code>typingDelayMs</code>{" "}
              later, replaces it with the greeting — so the dots are what the greeting arrives out
              of.
            </p>
            <p>
              <strong>Left alone, the widget walks these on its own.</strong> It opens, types and
              greets without being told to, and <code>typing</code> is ignored while it does &mdash;
              the prop is read only where a consumer has passed <code>messages</code> and taken the
              transcript over. A controlled consumer therefore owns the typing beat as well as the
              turns.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-placement">
            <h2 id="cdp-placement" className="cdp__h2">
              Placement and Layering
            </h2>
            <p>
              The launcher is not pinned to a hard-coded offset. It sits on the estate&apos;s corner
              rail alongside the demo dock and Important Links, and the panel&apos;s height is
              computed from wherever the rail put it.
            </p>
            <ul>
              <li>
                The launcher reports its size to the rail and reads its own offset back from{" "}
                <code>--sa-corner-rail-bottom</code>.
              </li>
              <li>
                The panel sizes to its content, capped at the smaller of 719px and{" "}
                <code>100dvh</code> minus the rail, the launcher and the gaps — so it can never
                render above the viewport. 719 is a ceiling, not a height: pinned there, the opening
                state was a 531px log holding 96px of greeting, with 435px of white collecting under
                the header.
              </li>
              <li>
                Open, the widget outranks everything on the page including the accessibility widget.
                Closed, it sits with the rest of the corner and below that widget, because a chat
                launcher has no business covering a statutory control.
              </li>
            </ul>
            <p>
              <strong>Never assume the offset; read it.</strong> The panel once opened at{" "}
              <code>y: -117</code> with its header and close control off-screen, because the
              max-height assumed the launcher&apos;s resting offset while the rail had lifted it to
              261px. That only showed up in production.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-motion">
            <h2 id="cdp-motion" className="cdp__h2">
              Motion
            </h2>
            <p>
              Everything that enters or exits uses ease-out, never ease-in, and everything is under
              300ms. Only <code>transform</code>, <code>opacity</code> and <code>filter</code> are
              animated, so nothing triggers layout or paint — expanding used to animate width and
              height, which re-ran layout and re-wrapped every bubble on every frame, at the one
              moment the panel is guaranteed to be full of text.
            </p>
            <ul>
              <li>
                <strong>Enter, 240ms</strong> — the panel grows out of the launcher, so closing
                visibly returns there.
              </li>
              <li>
                <strong>Exit, 160ms</strong> — shorter, because the citizen has already decided.
              </li>
              <li>
                <strong>Hover, 200ms</strong> — its own symmetric curve. The strong ease-out used for
                arrivals reads as a jerk on mouse-leave.
              </li>
              <li>
                <strong>Seal, 10s</strong> — only when explicitly asked for, through the
                mascot&apos;s <code>spin</code> prop.
              </li>
              <li>
                <strong>Float, 5s</strong> — the mascot drifts 2.5px on the launcher. A legless robot
                drawn mid-hover has to hover.
              </li>
            </ul>
            <p>
              Two mechanisms, and which one a thing gets is not a style choice. State changes are{" "}
              <strong>transitions</strong>, because they have to interrupt and retarget when someone
              double-clicks the launcher. Only the genuinely endless parts — the typing wave, the
              float, the seal — are <strong>keyframes</strong>, because there is nothing to retarget
              and they have to be able to run forever.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-prototype">
            <h2 id="cdp-prototype" className="cdp__h2">
              Prototype
            </h2>
            <p>
              The Figma file carries a working flow, wired on instances of the master rather than on
              a redraw of it — so a fix to the component shows up in the prototype without anyone
              re-linking anything.
            </p>
            <ul>
              <li>
                <strong>The master is an interactive component.</strong> Drop an instance into any
                frame, press play, and it walks its own lifecycle with no frame-level wiring.
              </li>
              <li>
                <strong>Five frames</strong> show it in page context — Closed, Thinking, Greeting,
                Asked, Answered — with both the minimise control and the close disc returning to the
                launcher from anywhere.
              </li>
              <li>
                <strong>Anchored bottom-right</strong>, so Smart Animate grows the panel out of the
                launcher and shrinks it back into the same place.
              </li>
              <li>
                <strong>Real timings</strong> — 240ms enter, 160ms exit, and the 900ms typing beat,
                all read from <code>chatbot.css</code> rather than chosen in Figma.
              </li>
            </ul>
            <p>
              The loops live on the masters, not on a slide. Figma refuses keyframes on an instance
              sublayer but accepts them on a main component, so the typing wave is keyframed on{" "}
              <code>State=Typing</code> and the float on the mascot. A track plays inside the host
              frame&apos;s timeline, so reuse the component in a frame whose timeline is a whole
              multiple of its cycle — the documentation frame runs 30s, which is 25 waves, 6 floats
              and 3 turns of the seal.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-honesty">
            <h2 id="cdp-honesty" className="cdp__h2">
              Writing the Script
            </h2>
            <p>
              A suggestion is a promise the script has to keep, so every quick reply must map to a
              page the citizen can actually be sent to.
            </p>
            <p>
              Never write copy that implies the assistant can read an application, a payment or a
              personal record. It cannot, and the footer note says so — which is why the note is not
              removable.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Chatbot } from "@mosje/design-system";

<Chatbot
  greeting="This is an assistant for the Ministry of Social Justice. How can I help you?"
  quickReplies={[
    { id: "scheme", label: "Find a scheme" },
    { id: "status", label: "Check application status" },
  ]}
  onQuickReply={(reply) => ({ text: answerFor(reply.id) })}
/>`}</CodeBlock>
          <p>
            A controlled consumer owns the transcript, and therefore owns the restart too. “Start
            over” appends a labelled rule and greets again; it must not clear what is above it — two
            greetings in a row read as the assistant repeating itself, and a rule between them reads
            as a new start, which is what it is.
          </p>
          <CodeBlock>{`<Chatbot
  messages={messages}
  typing={thinking}
  onEndChat={() =>
    setMessages((prev) => [
      ...prev,
      { id: rule(), from: "system", text: "New conversation" },
      { id: hello(), from: "bot", text: GREETING },
    ])
  }
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-nonmodal">
            <h2 id="cdp-nonmodal" className="cdp__h2">
              A Dialog, but Deliberately Not a Modal One
            </h2>
            <p>
              The page behind the panel stays operable and focus is never trapped. A help widget that
              seizes the page is worse than no help widget: a citizen who opened it by accident, or
              who wants to read the form while asking about it, must not have to dismiss it first.
            </p>
            <p>
              That is the one place this component departs from Modal and Side Sheet, and it is a
              decision rather than an omission.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-live">
            <h2 id="cdp-live" className="cdp__h2">
              The Log Is a Live Region
            </h2>
            <p>
              New turns are announced as they land, so an answer that arrives after the typing beat
              reaches a screen reader without focus moving into the log. The citizen keeps their
              place, whether that place is the panel or the page behind it.
            </p>
            <p>
              On minimise, focus returns to the launcher. Anywhere else — the top of the document, or
              nothing at all — loses a keyboard user the position they opened the assistant from.
            </p>
            <p>
              The typing indicator is the cue that a reply is coming, and it sits in the log where
              the reply will appear. The seal was once specified as that cue and animated behind the
              close control that had already replaced it; the indicator is where a reader is already
              looking.
            </p>
          </section>
        </>
      }
    />
  );
}
