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
  border-radius: var(--sa-shape-sm);
  background: var(--sa-color-action-primary-default);
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
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-s)" }}>
        Motion in SAMAVESH is quick, quiet and purposeful. It guides attention
        and softens change — it never shows off. On government services, motion
        must also step aside the moment a user asks it to.
      </p>
      <div style={{ marginTop: "var(--sa-stack-m)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.motion)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="duration" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="duration">Duration scale</h2>
        <p style={{ marginTop: "var(--sa-stack-m)" }}>
          Three durations cover almost everything. Faster is better — long
          animations make an interface feel sluggish.
        </p>
        <ul style={{ marginTop: "var(--sa-stack-m)" }}>
          <li><strong>Fast — 150ms:</strong> hovers, small state changes, button presses.</li>
          <li><strong>Base — 250ms:</strong> the default for most enter / exit transitions.</li>
          <li><strong>Slow — 400ms:</strong> larger surfaces such as drawers and full-screen panels.</li>
        </ul>
      </section>

      <section aria-labelledby="easing" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="easing">Easing</h2>
        <p style={{ marginTop: "var(--sa-stack-m)" }}>
          Use <strong>ease-out</strong> for things entering the screen — they
          arrive quickly then settle, which feels responsive. Use{" "}
          <strong>ease-in</strong> for things leaving — they accelerate away,
          which reads as a clean exit.
        </p>
      </section>

      <section aria-labelledby="demo" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="demo">Live demo</h2>
        <p style={{ marginTop: "var(--sa-stack-m)" }}>
          Hover or focus the panel to see all three durations run side by side.
        </p>
        <div
          className="motion-demo"
          tabIndex={0}
          role="img"
          aria-label="Three boxes animating across the panel at fast, base and slow durations on hover or focus"
          style={{
            marginTop: "var(--sa-stack-l)",
            background: "var(--sa-bg-neutral-subtler)",
            borderRadius: "var(--sa-shape-md)",
            padding: "var(--sa-padding-2xl)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--sa-stack-l)",
            outlineOffset: "2px",
          }}
        >
          {([
            ["fast", "Fast · 150ms"],
            ["base", "Base · 250ms"],
            ["slow", "Slow · 400ms"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <div style={{ fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-color-text-muted)", marginBottom: "var(--sa-stack-xs)" }}>
                {label}
              </div>
              <div className={`motion-demo__box motion-demo__box--${key}`} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="reduced" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="reduced">Reduced motion</h2>
        <p style={{ marginTop: "var(--sa-stack-m)" }}>
          When a user has turned on{" "}
          <strong>&ldquo;Reduce motion&rdquo;</strong> in their operating
          system, every motion token resolves to <code>0ms</code>. Transitions
          still happen — they simply happen instantly, with no movement. This is
          built in: components honour the preference automatically, and the demo
          above already respects it.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
          <TokenTable
            tokens={[
              { token: "--sa-motion-exit-duration", value: "150ms", description: "Hovers, presses, small state changes" },
              { token: "--sa-motion-enter-duration", value: "250ms", description: "Default enter / exit transitions" },
              { token: "--sa-motion-emphasis-duration", value: "400ms", description: "Drawers, panels and large surfaces" },
              { token: "--sa-motion-enter-easing", value: "cubic-bezier(0, 0, 0.2, 1)", description: "Enter animations" },
              { token: "--sa-motion-exit-easing", value: "cubic-bezier(0.4, 0, 1, 1)", description: "Exit animations" },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="guidance" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="guidance">Guidance</h2>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
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
