import * as React from "react";
import type { Metadata } from "next";
import { ChatbotPlayground } from "./chatbot-playground";
import { Playground } from "@/components/design-system/playground";
import {
  PropsTable,
  DoDont,
  A11yChecklist,
  Callout,
} from "@/components/design-system/docs-kit";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Chatbot - SAMAVESH Design System",
  description:
    "Samajik Sahayak, the estate's shared help assistant: a corner launcher that opens a scripted, non-modal chat panel.",
};

export default function ChatbotPage(): React.JSX.Element {
  const sectionStyle: React.CSSProperties = {
    marginTop: "var(--sa-stack-48)",
    paddingTop: "var(--sa-stack-48)",
    borderTop: "1px solid var(--sa-border-neutral-subtle)",
  };
  const h2Style: React.CSSProperties = {
    fontSize: "var(--sa-type-headline-2-size)",
    fontWeight: 600,
    margin: "0 0 var(--sa-stack-24) 0",
    color: "var(--sa-text-neutral-bolder)",
  };
  const proseStyle: React.CSSProperties = {
    color: "var(--sa-text-neutral-base)",
    fontSize: "var(--sa-type-body-1-size)",
    lineHeight: 1.6,
  };
  const leadStyle: React.CSSProperties = {
    ...proseStyle,
    fontSize: "var(--sa-type-headline-3-size)",
    color: "var(--sa-text-neutral-subtle)",
    marginBottom: "var(--sa-stack-24)",
  };
  const listStyle: React.CSSProperties = {
    ...proseStyle,
    paddingLeft: "var(--sa-padding-20)",
    marginTop: "var(--sa-stack-16)",
  };

  return (
    <main
      className="ds-prose"
      style={{ maxWidth: "800px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}
    >
      {/* ============ HEADER ============ */}
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>
          Chatbot
        </h1>
        <p className="ds-lead" style={leadStyle}>
          Samajik Sahayak (सामाजिक सहायक) is the one assistant the whole estate shares. It runs a
          fixed script, says so under the composer, and never claims to see an application it
          cannot read.
        </p>
        <p style={proseStyle}>
          Figma:{" "}
          <a href={figmaUrl(FIGMA_NODES.chatbot)} target="_blank" rel="noreferrer">
            Chatbot — Documentation
          </a>
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Press a suggestion to walk the scripted conversation. The panel is rendered{" "}
          <code>placement=&quot;inline&quot;</code> here; in production it is{" "}
          <code>fixed</code> to the corner rail.
        </p>
        {/* data-no-toc: the panel carries its own <h2>, which belongs to the
            widget rather than to this page's outline. */}
        <div data-no-toc style={{ marginTop: "var(--sa-stack-24)" }}>
          <ChatbotPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          One assistant, mounted once per surface, switched on per surface from{" "}
          <code>/admin/portals</code>. It answers navigational questions — which scheme, which
          portal, which form — and hands off anything transactional.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <DoDont
            cards={[
              {
                type: "do",
                label:
                  "Give quick replies that map to a page you can actually send someone to. A suggestion is a promise the script has to keep.",
                preview: null,
              },
              {
                type: "dont",
                label:
                  "Don't write copy that implies it can read an application, a payment or a personal record. It cannot, and the footer note says so.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. ANATOMY ============ */}
      <section style={sectionStyle}>
        <h2 id="anatomy" style={h2Style}>2. Anatomy</h2>
        <p style={proseStyle}>
          Three regions that never trade places: a fixed header, the scrolling log, and a fixed
          footer. The log is the only region allowed to grow.
        </p>
        <ul style={listStyle}>
          <li><strong>Header:</strong> the mascot at 40px, the bilingual title block, then expand and minimise as 32px targets.</li>
          <li><strong>Log:</strong> bot turns carry an avatar, user turns do not. Bubbles cap at 67% width, and the squared corner points at the edge the speaker came from.</li>
          <li><strong>Footer:</strong> a pill composer, the honest note, and End chat as a text link in error ink.</li>
        </ul>
        <Playground
          code={`<Chatbot
  greeting="This is an assistant for the Ministry of Social Justice. How can I help you?"
  quickReplies={[
    { id: "scheme", label: "Find a scheme" },
    { id: "status", label: "Check application status" },
  ]}
  onQuickReply={(reply) => ({ text: answerFor(reply.id) })}
/>`}
        />
      </section>

      {/* ============ 3. STATES ============ */}
      <section style={sectionStyle}>
        <h2 id="states" style={h2Style}>3. States</h2>
        <p style={proseStyle}>
          Figma draws four states because a static file cannot show motion. Only the first is a
          prop.
        </p>
        <ul style={listStyle}>
          <li><strong>Closed</strong> (<code>defaultOpen={"{false}"}</code>) — the launcher alone, on the shared corner rail.</li>
          <li><strong>Greeting</strong> — the opening line types out, then suggestions cascade in behind it.</li>
          <li><strong>Typing</strong> — the indicator the bot is composing, replaced by the message it was composing.</li>
          <li><strong>Transcript</strong> — turns accumulate. Pass <code>messages</code> to own the conversation yourself.</li>
        </ul>
        <Callout type="warning" title="Typing and Transcript are not props">
          They are states <code>Chatbot</code> walks through on its own. Adding props to pin the
          widget into one would invent an API for something the component deliberately owns, and
          would let a consumer freeze it in a state it is supposed to pass through.
        </Callout>
      </section>

      {/* ============ 4. PLACEMENT ============ */}
      <section style={sectionStyle}>
        <h2 id="placement" style={h2Style}>4. Placement and layering</h2>
        <p style={proseStyle}>
          The launcher is not pinned to a hard-coded offset. It sits on the estate&apos;s corner
          rail alongside the demo dock and Important Links, and the panel&apos;s height is
          computed from wherever the rail put it.
        </p>
        <ul style={listStyle}>
          <li>The launcher reports its size to the rail and reads its own offset back from <code>--sa-corner-rail-bottom</code>.</li>
          <li>The panel caps at <code>100dvh − rail − launcher − gaps</code>, so it can never render above the viewport.</li>
          <li>Open, the widget takes <code>z-index: 2147483001</code> and outranks everything on the page, including the accessibility widget. Closed, it sits at <code>1010</code> with the rest of the corner.</li>
        </ul>
        <Callout type="danger" title="This one only showed up in production">
          The panel opened at <code>y: -117</code> with its header and close control off-screen,
          because the max-height assumed the launcher&apos;s resting offset while the rail had
          lifted it to 261px. Never assume the offset; read it.
        </Callout>
      </section>

      {/* ============ 5. MOTION ============ */}
      <section style={sectionStyle}>
        <h2 id="motion" style={h2Style}>5. Motion</h2>
        <p style={proseStyle}>
          Everything that enters or exits uses ease-out, never ease-in, and everything is under
          300ms. Only <code>transform</code>, <code>opacity</code> and <code>filter</code> are
          animated, so nothing here triggers layout or paint.
        </p>
        <ul style={listStyle}>
          <li><strong>Enter, 240ms</strong> — the panel grows out of the launcher, so closing visibly returns there.</li>
          <li><strong>Exit, 160ms</strong> — shorter, because the user has already decided.</li>
          <li><strong>Hover, 200ms</strong> — its own symmetric curve. The strong ease-out used for arrivals reads as a jerk on mouse-leave.</li>
          <li><strong>Seal, 10s</strong> — rotates only while the assistant is thinking, never at rest.</li>
        </ul>
      </section>

      {/* ============ 6. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>6. Accessibility (A11y)</h2>
        <Callout type="info" title="A dialog, but deliberately not a modal one">
          The page behind the panel stays operable and focus is never trapped. A help widget that
          seizes the page is worse than no help widget.
        </Callout>
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <A11yChecklist
            items={[
              { criterion: "Target sizes", level: "AA", description: "The 84px launcher and 32px header controls both clear the 24px minimum (2.5.8). End chat keeps a 24px box inside a smaller visual footprint." },
              { criterion: "Nothing loops at rest", level: "A", description: "The seal turns only while the assistant is thinking and stops on its own, so there is nothing for a Pause/Stop/Hide control to pause (2.2.2)." },
              { criterion: "Contrast on every surface", level: "AA", description: "End chat uses the system error ink at 9.10:1 rather than the lighter red the reference used." },
              { criterion: "Live region on the log", level: "A", description: "New turns are announced. On minimise, focus returns to the launcher rather than the top of the page (4.1.2)." },
              { criterion: "Reduced motion honoured", level: "AA", description: "The cascade, the typing dots and the seal all stop. The panel appears without growing, rather than not appearing." },
            ]}
          />
        </div>
      </section>

      {/* ============ 7. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>7. API Reference</h2>
        <PropsTable
          props={[
            { name: "open", type: "boolean", description: "Controlled open state. Omit to let the widget own it." },
            { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
            { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the widget opens or closes." },
            { name: "title", type: "string", default: '"Chat with us"', description: "Panel header. An invitation, not the assistant's name." },
            { name: "subtitle", type: "string", description: "Devanagari name under the title. Pass \"\" to suppress it." },
            { name: "greeting", type: "string", description: "The bot's opening line, typed out on first open." },
            { name: "quickReplies", type: "readonly ChatbotQuickReply[]", description: "Suggestions offered under the greeting." },
            { name: "onQuickReply", type: "(reply) => ChatbotReply | Promise<...> | void", description: "Return a reply and the widget shows the user's message, types for a beat, then answers." },
            { name: "messages", type: "readonly ChatbotMessage[]", description: "Controlled transcript. Provide it and the widget runs no scripted sequence of its own." },
            { name: "typing", type: "boolean", description: "Show the typing indicator. Only meaningful alongside messages." },
            { name: "composer", type: "boolean", default: "true", description: "Show the free-text composer. On by default to match the affordance citizens arriving from dosje.gov.in expect." },
            { name: "composerPlaceholder", type: "string", default: '"Type something…"', description: "Placeholder for the composer input." },
            { name: "onSubmit", type: "(text: string) => ChatbotReply | Promise<...> | void", description: "Handle a typed question. Without a handler an unrecognised question gets an honest fallback rather than silence." },
            { name: "note", type: "string", description: "The honest statement of what this assistant is not. Never remove it." },
            { name: "endChatLabel", type: "string", default: '"End chat"', description: "Label for the footer end-chat action." },
            { name: "onEndChat", type: "() => void", description: "Called after the transcript is cleared." },
            { name: "launcherLabel", type: "string", default: '"Chat with us"', description: "Accessible name of the launcher." },
            { name: "typingDelayMs", type: "number", default: "900", description: "How long the typing indicator runs before a bot message lands." },
            { name: "placement", type: '"fixed" | "inline"', default: '"fixed"', description: "fixed pins it to the corner rail; inline drops the positioning so a docs page or story can place it." },
          ]}
        />
      </section>
    </main>
  );
}
