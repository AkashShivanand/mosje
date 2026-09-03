import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { TokenTable, Callout } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Motion",
  description:
    "Duration and easing for SAMAVESH — purposeful, fast and respectful of reduced-motion preferences.",
};

// Motion demo styles are scoped under .motion-demo so they cannot leak.
// prefers-reduced-motion collapses every duration to 0ms, matching the
// behaviour real components ship with.
const MOTION_CSS = `
.motion-demo__box {
  width: 40px;
  height: 40px;
  border-radius: var(--sa-shape-6);
  background: var(--sa-bg-brand-primary-bolder);
}
.motion-demo:hover .motion-demo__box--fast,
.motion-demo:focus-within .motion-demo__box--fast { transform: translateX(160px); }
.motion-demo:hover .motion-demo__box--base,
.motion-demo:focus-within .motion-demo__box--base { transform: translateX(160px); }
.motion-demo:hover .motion-demo__box--slow,
.motion-demo:focus-within .motion-demo__box--slow { transform: translateX(160px); }
.motion-demo__box--fast { transition: transform 150ms cubic-bezier(0, 0, 0.2, 1); }
.motion-demo__box--base { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
.motion-demo__box--slow { transition: transform 400ms cubic-bezier(0, 0, 0.2, 1); }
@media (prefers-reduced-motion: reduce) {
  .motion-demo__box--fast,
  .motion-demo__box--base,
  .motion-demo__box--slow { transition-duration: 0ms; }
}
`;

export default function MotionPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <style>{MOTION_CSS}</style>

      <h1>Motion</h1>
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-12)" }}>
        Motion in SAMAVESH is quick, quiet and purposeful. It guides attention
        and softens change — it never shows off. On government services, motion
        must also step aside the moment a user asks it to.
      </p>
      <div style={{ marginTop: "var(--sa-stack-16)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.motion)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="pairs" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="pairs">The five pairs</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          You do not pick a duration. You pick what is happening, and the pair
          brings its own duration and easing together — a duration without its
          easing is half a decision. Bind to the pair, never to the raw step.
        </p>
        <ul style={{ marginTop: "var(--sa-stack-16)" }}>
          <li><strong>enter</strong> — 250ms, <code>out</code>. Something arriving.</li>
          <li><strong>exit</strong> — 150ms, <code>in</code>. Something leaving.</li>
          <li><strong>emphasis</strong> — 400ms, <code>inOut</code>. A deliberate, attention-carrying move. Reserve it; if everything is emphasised, nothing is.</li>
          <li><strong>reveal</strong> — 400ms, <code>outStrong</code>. A surface the reader deliberately opened, such as a drawer or a disclosure panel.</li>
          <li><strong>press</strong> — 150ms, <code>outStrong</code>. Feedback: a press, a hover lift, an icon nudge.</li>
        </ul>
      </section>

      <section aria-labelledby="duration" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="duration">Duration scale</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Three durations cover almost everything. Faster is better — long
          animations make an interface feel sluggish.
        </p>
        <ul style={{ marginTop: "var(--sa-stack-16)" }}>
          <li><strong>Fast — 150ms:</strong> anything leaving, and any direct feedback — a press, a hover lift, an icon nudge. Used by <code>exit</code> and <code>press</code>.</li>
          <li><strong>Base — 250ms:</strong> anything arriving. Used by <code>enter</code>, and by nothing else.</li>
          <li><strong>Slow — 400ms:</strong> a deliberate, attention-carrying move, and a surface the reader opened themselves. Used by <code>emphasis</code> and <code>reveal</code>.</li>
        </ul>
      </section>

      <section aria-labelledby="easing" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="easing">Easing</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Four curves, and each pair takes exactly one of them.
        </p>
        <ul style={{ marginTop: "var(--sa-stack-16)" }}>
          <li>
            <strong>out</strong> — <code>cubic-bezier(0, 0, 0.2, 1)</code>:
            things entering. They arrive quickly, then settle, which feels
            responsive.
          </li>
          <li>
            <strong>in</strong> — <code>cubic-bezier(0.4, 0, 1, 1)</code>:
            things leaving. They accelerate away, which reads as a clean exit.
          </li>
          <li>
            <strong>inOut</strong> — <code>cubic-bezier(0.4, 0, 0.2, 1)</code>:
            a deliberate move the reader is meant to notice. It eases at both
            ends.
          </li>
          <li>
            <strong>outStrong</strong> —{" "}
            <code>cubic-bezier(0.22, 1, 0.36, 1)</code>: a surface the reader
            opened, and direct feedback. Most of the distance is covered in the
            first third, so it settles rather than snaps.
          </li>
        </ul>
      </section>

      <section aria-labelledby="demo" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="demo">Live demo</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Hover or focus the panel to see all three durations run side by side.
        </p>
        <div
          className="motion-demo"
          tabIndex={0}
          role="img"
          aria-label="Three boxes animating across the panel at fast, base and slow durations on hover or focus"
          style={{
            marginTop: "var(--sa-stack-24)",
            background: "var(--sa-bg-neutral-subtler)",
            borderRadius: "var(--sa-shape-8)",
            padding: "var(--sa-padding-32)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--sa-stack-24)",
            outlineOffset: "var(--sa-focus-offset)",
          }}
        >
          {([
            ["fast", "Fast · 150ms"],
            ["base", "Base · 250ms"],
            ["slow", "Slow · 400ms"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <div style={{ fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-muted)", marginBottom: "var(--sa-stack-8)" }}>
                {label}
              </div>
              <div className={`motion-demo__box motion-demo__box--${key}`} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="reduced" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="reduced">Reduced motion</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          When a user has turned on{" "}
          <strong>&ldquo;Reduce motion&rdquo;</strong> in their operating
          system, every motion token resolves to <code>0ms</code>. Transitions
          still happen — they simply happen instantly, with no movement. This is
          built in: components honour the preference automatically, and the demo
          above already respects it.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TokenTable
            tokens={[
              { token: "--sa-motion-enter-duration", value: "250ms", description: "Something arriving. Take it with the enter easing." },
              { token: "--sa-motion-enter-easing", value: "cubic-bezier(0, 0, 0.2, 1)", description: "Something arriving. Decelerates into place." },
              { token: "--sa-motion-exit-duration", value: "150ms", description: "Something leaving. Take it with the exit easing." },
              { token: "--sa-motion-exit-easing", value: "cubic-bezier(0.4, 0, 1, 1)", description: "Something leaving. Accelerates away." },
              { token: "--sa-motion-emphasis-duration", value: "400ms", description: "A deliberate, attention-carrying move. Reserve it." },
              { token: "--sa-motion-emphasis-easing", value: "cubic-bezier(0.4, 0, 0.2, 1)", description: "A deliberate move. Eases at both ends." },
              { token: "--sa-motion-reveal-duration", value: "400ms", description: "A surface the reader opened — a drawer, a disclosure panel." },
              { token: "--sa-motion-reveal-easing", value: "cubic-bezier(0.22, 1, 0.36, 1)", description: "A surface the reader opened. Settles rather than snaps." },
              { token: "--sa-motion-press-duration", value: "150ms", description: "Feedback — a press, a hover lift, an icon nudge." },
              { token: "--sa-motion-press-easing", value: "cubic-bezier(0.22, 1, 0.36, 1)", description: "Feedback. Most of the distance is covered early." },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="guidance" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="guidance">Guidance</h2>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <Callout type="warning" title="Motion is decoration, never information">
            Never animate content that is essential to understanding. Animation
            should only carry decorative or transitional meaning — if a user
            cannot see the motion, they must lose nothing.
          </Callout>
        </div>
      </section>
    </article>
  );
}
