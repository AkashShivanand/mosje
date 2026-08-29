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
    <article
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
          {" · "}
          <a href={figmaUrl(FIGMA_NODES.chatbotPrototype)} target="_blank" rel="noreferrer">
            Interactive prototype
          </a>
          {" · "}
          <a href={figmaUrl(FIGMA_NODES.chatbotMotion)} target="_blank" rel="noreferrer">
            Motion specimen
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
          <li><strong>Header:</strong> the mascot at 40px, the bilingual title block, then expand (<code>open_in_full</code>) and minimise (<code>close</code>) as 32px targets. All four marks are Material Symbols Rounded glyphs at 20 / 24 / 16 — none is a hand-drawn path.</li>
          <li><strong>Log:</strong> bot turns carry an avatar, user turns do not. Bubbles cap at 67% width, and the squared corner points at the edge the speaker came from. Suggestions wrap and pack <em>right</em>, on the user&apos;s side — each one is a sentence they are about to say, and pressing it puts those words in a user bubble.</li>
          <li><strong>Footer:</strong> a pill composer, the honest note, and <strong>Start over</strong> sharing the note&apos;s row, hard right. It is the design system&apos;s <code>Button</code> at <code>variant=&quot;neutral&quot; appearance=&quot;text&quot;</code> — no border, full ink, no signal colour. Hand-rolled it drifted into the estate&apos;s <em>rejection</em> red for an action that is housekeeping, and became the loudest thing in a footer whose only filled control is disabled at rest.</li>
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
          Figma draws four states because a static file cannot show motion. They are listed in the
          order the component actually runs them. Only the first is a prop.
        </p>
        <ul style={listStyle}>
          <li><strong>Closed</strong> (<code>defaultOpen={"{false}"}</code>) — the launcher alone, on the shared corner rail.</li>
          <li><strong>Typing</strong> — a beat after opening, the bot starts composing. Nothing has been said yet.</li>
          <li><strong>Greeting</strong> — the opening line lands, and the suggestions cascade in 320ms behind it.</li>
          <li><strong>Transcript</strong> — turns accumulate. Pass <code>messages</code> to own the conversation yourself.</li>
        </ul>
        <Callout type="warning" title="Typing comes before Greeting, not after it">
          This page and the Figma set both had it the other way round until the opening effect was
          read line by line. <code>Chatbot</code> turns typing on a beat after opening and only
          then, <code>typingDelayMs</code> later, replaces it with the greeting — so the dots are
          what the greeting arrives <em>out of</em>. The Figma frame draws Typing with an empty log
          for exactly that reason.
        </Callout>
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
          <li>The panel <strong>sizes to its content</strong>, capped at the smaller of 719px and <code>100dvh − rail − launcher − gaps</code>, so it can never render above the viewport. 719 is a ceiling, not a height: pinned there, the opening state was a 531px log holding 96px of greeting — 435px of white collecting under the header, about 45&nbsp;% of the panel.</li>
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
          animated, so nothing here triggers layout or paint — expanding used to animate{" "}
          <code>width</code> and <code>height</code>, which re-ran layout and re-wrapped every
          bubble on every frame, at the one moment the panel is guaranteed to be full of text.
          The box now changes in one step, and in one step both ways: because those two
          properties lived only in the expanded rule, expanding animated while restoring
          snapped.
        </p>
        <ul style={listStyle}>
          <li><strong>Enter, 240ms</strong> — the panel grows out of the launcher, so closing visibly returns there.</li>
          <li><strong>Exit, 160ms</strong> — shorter, because the user has already decided.</li>
          <li><strong>Hover, 200ms</strong> — its own symmetric curve. The strong ease-out used for arrivals reads as a jerk on mouse-leave.</li>
          <li><strong>Seal, 10s</strong> — runs only when it is explicitly asked for, via the mascot&apos;s <code>spin</code> prop. It is no longer wired to the thinking state; see below.</li>
          <li><strong>Float, 5s</strong> — the mascot drifts 2.5px, constantly and everywhere. A legless robot drawn mid-hover has to hover.</li>
        </ul>
        <p style={proseStyle}>
          Two mechanisms, and which one a thing gets is not a style choice. State changes are
          <strong> transitions</strong>, because they have to interrupt and retarget when someone
          double-clicks the launcher. Only the genuinely endless parts — the typing wave, the float,
          the seal — are <strong>keyframes</strong>, because there is nothing to retarget and they
          have to be able to run forever.
        </p>
        <Callout type="info" title="The seal used to turn where nobody could see it">
          It rotated on <code>[data-thinking]</code> — but the widget only ever thinks while it is
          open, and while it is open the launcher has already crossfaded the mark to a close ×. The
          one loop specified as the thinking cue was animating behind the thing that replaced it.
          Moving it to the 40px avatar was rejected on legibility: the wordmark is already small at
          84px and at 40px it is a grey smudge, and a seal you cannot read is not a seal. The
          trigger is gone; the cue that actually reads is the typing indicator, which sits in the
          log where the reply is coming from.
        </Callout>
      </section>

      {/* ============ 6. PROTOTYPE ============ */}
      <section style={sectionStyle}>
        <h2 id="prototype" style={h2Style}>6. Prototype</h2>
        <p style={proseStyle}>
          The Figma file carries a working flow, wired on instances of the master rather than on a
          redraw of it — so a fix to the component shows up in the prototype without anyone
          re-linking anything.
        </p>
        <ul style={listStyle}>
          <li><strong>The master is an interactive component.</strong> Drop one instance into any frame, press play, and it walks its own lifecycle — no frame-level wiring at all.</li>
          <li><strong>Five frames</strong> show it in page context — Closed → Thinking → Greeting → Asked → Answered, with both the minimise control and the close disc returning to the launcher from anywhere.</li>
          <li><strong>Anchored bottom-right</strong>, so Smart Animate grows the panel out of the launcher and shrinks it back into the same place.</li>
          <li><strong>Real timings</strong> — 240ms enter, 160ms exit, and the 900ms <code>typingDelayMs</code> beat, all read from <code>chatbot.css</code> rather than chosen in Figma.</li>
        </ul>
        <Callout type="info" title="Two mechanisms, on purpose">
          The interactive component answers &quot;how does this widget behave?&quot; anywhere it is
          used. The five frames answer &quot;what does it look like on a page, growing out of the
          corner?&quot; — which an instance switching variants in place cannot show. Keep both.
        </Callout>
        <Callout type="info" title="The loops live on the masters, not on a slide">
          Figma refuses keyframes on an <em>instance</em> sublayer, but a <em>main</em> component
          accepts them — so the typing wave is keyframed on <code>State=Typing</code> and the float
          on <code>Chatbot Mascot</code>, and an instance dropped in any frame carries its own
          motion. They used to sit on a standalone specimen frame, which gave all three loops that
          frame&apos;s single 10s duration: the 1200ms wave pulsed once and then held still for 9.3
          seconds. A track plays inside the <strong>host</strong> frame&apos;s timeline, so reuse
          the component in a frame whose timeline is a whole multiple of its cycle — the
          documentation frame runs 30s, which is 25 waves, 6 floats and 3 turns of the seal.
          Hover and press are not prototyped at all: representing them would mean duplicating every
          frame, and they are already fully specified above.
        </Callout>
      </section>

      {/* ============ 7. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>7. Accessibility (A11y)</h2>
        <Callout type="info" title="A dialog, but deliberately not a modal one">
          The page behind the panel stays operable and focus is never trapped. A help widget that
          seizes the page is worse than no help widget.
        </Callout>
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <A11yChecklist
            items={[
              { criterion: "Target sizes", level: "AA", description: "The 84px launcher, the 32px header controls and the 32px Start over button all clear the 24px minimum (2.5.8). So does the composer input, which did not: it was 20px inside a 42px pill, so half of what looked like a text field focused nothing at all. It now stretches to the pill's inner height. Pinned in e2e/chatbot/composer-target.spec.ts." },
              { criterion: "Nothing loops at rest", level: "A", description: "The seal no longer turns by itself at all — only a caller passing spin starts it — so the widget presents nothing for a Pause/Stop/Hide control to pause (2.2.2). The mascot's 2.5px float is the one continuous movement, it runs on the LAUNCHER ONLY, and it collapses under prefers-reduced-motion. It used to run on every mascot the component renders, so a transcript bobbed once per bot avatar." },
              { criterion: "Contrast on every surface", level: "AA", description: "Start over paints text/neutral/base at 16.18:1 — darker and heavier than the 12px note beside it, so the one control in the footer is not the same colour as the disclaimer." },
              { criterion: "Live region on the log", level: "A", description: "New turns are announced. On minimise, focus returns to the launcher rather than the top of the page (4.1.2)." },
              { criterion: "Reduced motion honoured", level: "AA", description: "The cascade, the typing dots and the seal all stop. The panel appears without growing, rather than not appearing." },
            ]}
          />
        </div>
      </section>

      {/* ============ 8. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>8. API Reference</h2>
        <PropsTable
          props={[
            { name: "open", type: "boolean", description: "Controlled open state. Omit to let the widget own it." },
            { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
            { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the widget opens or closes." },
            { name: "title", type: "string", default: '"Samajik Sahayak"', description: "Panel header. The assistant's own name — the seal on the launcher has it written round the ring, so the title says the same thing." },
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
            { name: "endChatLabel", type: "string", default: '"Start over"', description: "Label for the footer reset action. It clears the transcript and greets again — it does NOT close the panel, which is the header\u2019s job." },
            { name: "onEndChat", type: "() => void", description: "Called after the transcript is cleared. A controlled consumer must clear its own transcript here, and re-seed its greeting — the panel stays open, so nothing else will." },
            { name: "launcherLabel", type: "string", default: '"Samajik Sahayak, chat assistant"', description: "Accessible name of the launcher." },
            { name: "typingDelayMs", type: "number", default: "900", description: "How long the typing indicator runs before a bot message lands." },
            { name: "placement", type: '"fixed" | "inline"', default: '"fixed"', description: "fixed pins it to the corner rail; inline drops the positioning so a docs page or story can place it." },
          ]}
        />
      </section>
    </article>
  );
}
