import * as React from "react";
import type { Metadata } from "next";
import { PropsTable, Callout } from "@/components/design-system/docs-kit";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "ChatbotMascot - SAMAVESH Design System",
  description:
    "The Samajik Sahayak assistant mark: a navy disc carrying the mascot, and an optional seal ring bearing the bilingual wordmark.",
};

export default function ChatbotMascotPage(): React.JSX.Element {
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
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>
          ChatbotMascot
        </h1>
        <p
          className="ds-lead"
          style={{
            ...proseStyle,
            fontSize: "var(--sa-type-headline-3-size)",
            color: "var(--sa-text-neutral-subtle)",
          }}
        >
          The Samajik Sahayak mark. Two parts that stay separate nodes on purpose: a navy disc
          carrying the mascot, and an optional white ring carrying the circular bilingual
          wordmark.
        </p>
        <p style={proseStyle}>
          Figma:{" "}
          <a href={figmaUrl(FIGMA_NODES.chatbotMascot)} target="_blank" rel="noreferrer">
            Chatbot Mascot
          </a>
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 id="why-two-parts" style={h2Style}>1. Why it is two nodes</h2>
        <p style={proseStyle}>
          Separating the ring from the disc is what lets the wordmark rotate while the mascot
          stays level. A flattened asset would have to spin the robot too, which reads as a
          loading spinner rather than a seal.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 id="sizes" style={h2Style}>2. Sizes and the ring</h2>
        <ul style={listStyle}>
          <li><strong>84px with the ring</strong> — the launcher. The white ring takes the outer 12px, so the figure gets 66.67% of the diameter. The wordmark itself is live text on a path in Figma, flattened to outlines for the web — re-export it from the master whenever that text changes, and recompute the ring insets with it.</li>
          <li><strong>40px without it</strong> — beside a message or in the panel header. At that size the wordmark is unreadable and only muddies the mark, so the figure grows to 71.43%.</li>
        </ul>
        <Callout type="warning" title="Don't shrink the ringed variant">
          Below roughly 48px, pass <code>ring={"{false}"}</code> rather than scaling the seal
          down. The ring is not decoration you may keep at any size.
        </Callout>
      </section>

      <section style={sectionStyle}>
        <h2 id="colour" style={h2Style}>3. The disc follows the brand</h2>
        <p style={proseStyle}>
          The disc follows the brand: it binds <code>bg/brand/primary/bolder</code>, so it is
          <code>#005EB9</code> in <code>blue</code> and <code>#003366</code> in <code>navy</code>.
          The artwork is the <em>robot</em>; the disc is the surface it is mounted on, which is
          ordinary brand chrome. Leaving it fixed made the launcher the one control on the page
          that ignored <code>data-brand</code>.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 id="motion" style={h2Style}>4. Motion</h2>
        <p style={proseStyle}>
          The seal turns for exactly one reason: a caller passed <code>spin</code>. It never
          starts by itself. It used to start on pointer-enter and stop on leave, and an animation
          snapping from stopped to full speed is inherently abrupt — there is no CSS way to ease
          into a keyframe loop. Hover is carried entirely by lift and shadow, which are
          transitions, and transitions reverse cleanly by construction.
        </p>
        <p style={proseStyle}>
          It was then wired to the chatbot&apos;s thinking state, which was worse in a quieter
          way: the widget only thinks while it is open, and while it is open the launcher has
          already crossfaded this mark to a close ×. The loop ran at full speed behind something
          opaque. <code>spin</code> is now the only trigger, and the honest use for it is
          documentation and specimens — including the one below.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>5. API Reference</h2>
        <PropsTable
          props={[
            { name: "size", type: "number", default: "84", description: "Rendered diameter in px. Every inner measurement is a percentage of this, so it scales cleanly." },
            { name: "ring", type: "boolean", default: "false", description: "Show the circular bilingual wordmark on a white ring. True for the launcher, false for the small avatar." },
            { name: "spin", type: "boolean", default: "false", description: "Turn the wordmark's idle rotation on. Ignored when ring is false, and inert under prefers-reduced-motion." },
          ]}
        />
      </section>
    </article>
  );
}
