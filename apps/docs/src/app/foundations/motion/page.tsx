import * as React from "react";
import type { Metadata } from "next";
import { TokenTable, Callout } from "@/components/docs-kit/index";

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
  border-radius: var(--ds-radius-sm);
  background: var(--ds-primary);
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
      <p style={{ fontSize: "var(--ds-text-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-space-3)" }}>
        Motion in SAMAVESH is quick, quiet and purposeful. It guides attention
        and softens change — it never shows off. On government services, motion
        must also step aside the moment a user asks it to.
      </p>

      <section aria-labelledby="duration" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="duration">Duration scale</h2>
        <p style={{ marginTop: "var(--ds-space-4)" }}>
          Three durations cover almost everything. Faster is better — long
          animations make an interface feel sluggish.
        </p>
        <ul style={{ marginTop: "var(--ds-space-4)" }}>
          <li><strong>Fast — 150ms:</strong> hovers, small state changes, button presses.</li>
          <li><strong>Base — 250ms:</strong> the default for most enter / exit transitions.</li>
          <li><strong>Slow — 400ms:</strong> larger surfaces such as drawers and full-screen panels.</li>
        </ul>
      </section>

      <section aria-labelledby="easing" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="easing">Easing</h2>
        <p style={{ marginTop: "var(--ds-space-4)" }}>
          Use <strong>ease-out</strong> for things entering the screen — they
          arrive quickly then settle, which feels responsive. Use{" "}
          <strong>ease-in</strong> for things leaving — they accelerate away,
          which reads as a clean exit.
        </p>
      </section>

      <section aria-labelledby="demo" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="demo">Live demo</h2>
        <p style={{ marginTop: "var(--ds-space-4)" }}>
          Hover or focus the panel to see all three durations run side by side.
        </p>
        <div
          className="motion-demo"
          tabIndex={0}
          role="img"
          aria-label="Three boxes animating across the panel at fast, base and slow durations on hover or focus"
          style={{
            marginTop: "var(--ds-space-6)",
            background: "var(--ds-surface-muted)",
            borderRadius: "var(--ds-radius-md)",
            padding: "var(--ds-space-8)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--ds-space-6)",
            outlineOffset: "2px",
          }}
        >
          {([
            ["fast", "Fast · 150ms"],
            ["base", "Base · 250ms"],
            ["slow", "Slow · 400ms"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <div style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)", marginBottom: "var(--ds-space-2)" }}>
                {label}
              </div>
              <div className={`motion-demo__box motion-demo__box--${key}`} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="reduced" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="reduced">Reduced motion</h2>
        <p style={{ marginTop: "var(--ds-space-4)" }}>
          When a user has turned on{" "}
          <strong>&ldquo;Reduce motion&rdquo;</strong> in their operating
          system, every motion token resolves to <code>0ms</code>. Transitions
          still happen — they simply happen instantly, with no movement. This is
          built in: components honour the preference automatically, and the demo
          above already respects it.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
          <TokenTable
            tokens={[
              { token: "--ds-duration-fast", value: "150ms", description: "Hovers, presses, small state changes" },
              { token: "--ds-duration-base", value: "250ms", description: "Default enter / exit transitions" },
              { token: "--ds-duration-slow", value: "400ms", description: "Drawers, panels and large surfaces" },
              { token: "--ds-easing-out", value: "cubic-bezier(0, 0, 0.2, 1)", description: "Enter animations" },
              { token: "--ds-easing-in", value: "cubic-bezier(0.4, 0, 1, 1)", description: "Exit animations" },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="guidance" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="guidance">Guidance</h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
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
