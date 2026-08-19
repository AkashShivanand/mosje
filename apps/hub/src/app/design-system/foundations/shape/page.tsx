import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { TokenTable, DoDont } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Shape",
  description:
    "The SAMAVESH corner-radius ladder — twelve value-named rungs plus a fully-rounded sentinel, shared by every MoSJE site and portal.",
};

// The ladder is VALUE-NAMED, exactly as spacing is: the rung IS the pixel value, so
// `shape/8` is 8px and there is nothing to look up. `full` is the single named rung —
// a sentinel meaning "fully rounded", not a measurement. S7 in radius-linkage.test.mjs
// asserts it is the ONLY permitted non-numeric rung.
const LADDER: { rung: string; px: number; use: string }[] = [
  { rung: "0", px: 0, use: "Square corners — tables, full-bleed media, anything that should read as flush" },
  { rung: "2", px: 2, use: "The smallest softening, on dense controls where a visible curve would read as noise" },
  { rung: "4", px: 4, use: "Small chips, tags and inline badges" },
  { rung: "6", px: 6, use: "Inputs, selects and other text-entry controls" },
  { rung: "8", px: 8, use: "Buttons and standard controls — the default shape of the system" },
  { rung: "12", px: 12, use: "Cards and panels — a surface holding content rather than a control" },
  { rung: "16", px: 16, use: "Large containers and modal surfaces" },
  { rung: "20", px: 20, use: "Hero and feature surfaces, where the curve is part of the composition" },
  { rung: "24", px: 24, use: "The largest editorial surfaces" },
  { rung: "32", px: 32, use: "Oversized decorative surfaces — rare; check a smaller step first" },
  { rung: "40", px: 40, use: "The largest decorative surface in the system — rare" },
  { rung: "full", px: 999, use: "Pills and circles — avatars, toggles, status dots. Fully rounded at any size" },
];

// Roles live at Tier 3, which is why the Tier-2 rungs need not carry role names.
const ROLES = [
  { token: "--sa-control-radius", resolves: "shape/8", use: "Any interactive control — buttons, inputs, selects. One radius keeps controls a family." },
  { token: "--sa-cmp-button-radius", resolves: "control/radius", use: "A button. It follows control/radius rather than restating a rung." },
  { token: "--sa-cmp-card-radius", resolves: "shape/12", use: "A card surface. Raised from 8px on 18 August 2026 — the token had contradicted its own role." },
];

export default function ShapePage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Shape</h1>
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-12)" }}>
        Every corner in the system comes from one ladder of twelve rungs. The rung is named
        for its pixel value, so <code>shape/8</code> is eight pixels — there is nothing to
        look up and nothing to remember.
      </p>
      <div style={{ marginTop: "var(--sa-stack-16)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.shape)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="how-it-works" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="how-it-works">How shape works</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          A radius token is a group and a number. <code>shape/8</code> is 8px, permanently,
          and a new step can be added between any two without renaming anything above it.
          This is the same convention the spacing ladder uses, on purpose — one rule across
          both means there is no second thing to learn.
        </p>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          What a rung is <em>for</em>{" "}is not carried by its name. It is carried by the
          token&apos;s description, and by the component tokens that resolve to it —
          <code> --sa-cmp-button-radius</code>, <code>--sa-cmp-card-radius</code>,
          <code> --sa-control-radius</code>. Roles live at Tier 3, which is exactly why the
          rungs themselves do not need role names.
        </p>
      </section>

      <section aria-labelledby="ladder" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="ladder">The ladder</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Each swatch is drawn with its own token, so this page shows the ladder as it is
          rather than a picture of it. When a rung moves, these move with it.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)", display: "flex", flexDirection: "column", gap: "var(--sa-stack-12)" }}>
          {LADDER.map(({ rung, px }) => (
            <div key={rung} style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-16)" }}>
              <div style={{ width: "140px", flexShrink: 0 }}>
                <code className="token-table__name">{`shape/${rung}`}</code>
              </div>
              <div
                style={{
                  height: "var(--sa-padding-48)",
                  width: "var(--sa-padding-80)",
                  minWidth: "var(--sa-padding-80)",
                  background: "var(--sa-bg-brand-primary-subtler)",
                  border: "1px solid var(--sa-border-brand-primary-base)",
                  borderRadius: `var(--sa-shape-${rung})`,
                }}
                aria-hidden="true"
              />
              <div
                style={{
                  height: "var(--sa-padding-48)",
                  flex: 1,
                  background: "var(--sa-bg-brand-primary-bolder)",
                  borderRadius: `var(--sa-shape-${rung})`,
                }}
                aria-hidden="true"
              />
              <div style={{ width: "56px", flexShrink: 0, textAlign: "right", color: "var(--sa-color-text-muted)", fontSize: "var(--sa-type-body-2-size)" }}>
                {px}px
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          The rungs above 24 are decorative and rarely correct in product UI. If you find
          yourself reaching for <code>shape/32</code> or <code>shape/40</code> on a control
          or a card, the surface is probably the wrong size rather than the wrong shape.
        </p>
      </section>

      <section aria-labelledby="choosing" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="choosing">Choosing a rung</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Pick by what the surface <em>is</em>, not by how round it looks. Two surfaces of
          the same kind should never disagree, and choosing by category is the reliable way
          to guarantee that. When two rungs both seem plausible, pick the smaller one — an
          over-rounded control reads as decorative and an over-rounded card reads as a toast.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TokenTable
            tokens={[
              { token: "Controls", value: "shape/6 · shape/8", description: "Text-entry controls take 6. Everything else you press takes 8 — or better, control/radius." },
              { token: "Surfaces", value: "shape/12 · shape/16", description: "A card or panel takes 12; a large container or modal takes 16. The difference is whether it sits IN the page or ON TOP of it." },
              { token: "Small marks", value: "shape/2 · shape/4", description: "Chips, tags and inline badges take 4. Use 2 only where a visible curve would read as noise." },
              { token: "Flush", value: "shape/0", description: "Bind it, do not leave the corner unset — an unbound zero cannot be told apart from an oversight." },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="roles" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="roles">Prefer a role token</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          If a component token exists for what you are drawing, bind that instead of a rung.
          A button that binds <code>--sa-cmp-button-radius</code> follows the system when
          controls are reshaped; one that binds <code>--sa-shape-8</code> does not.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TokenTable
            tokens={ROLES.map(({ token, resolves, use }) => ({ token, value: resolves, description: use }))}
          />
        </div>
      </section>

      <section aria-labelledby="full" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="full">Pills and circles</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          <code>--sa-shape-full</code> resolves to 999px. That is a <strong>sentinel</strong>,
          not a measurement: any value exceeding half the shorter side renders fully rounded,
          and 999 is that for every surface in the estate. There is no <code>shape/999</code> —
          naming the sentinel by its number would assert a precision it does not have.
        </p>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          <code>border-radius: 50%</code> is <strong>not a synonym</strong>. On a square box the
          two are identical; on any other box 50% gives an <em>ellipse</em> where
          <code> shape/full</code> gives a stadium. A 50% pill on a wide button is a bug, not a
          variant.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TokenTable
            tokens={LADDER.map(({ rung, px, use }) => ({
              token: `--sa-shape-${rung}`,
              value: `${px}px`,
              description: use,
            }))}
          />
        </div>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Never reach for <code>--sa-ref-radius-*</code>. That is Tier 1, hidden from
          publishing, and refused in application code by the token contract tests.
        </p>
      </section>

      <section aria-labelledby="guidance" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="guidance">Do &amp; Don&apos;t</h2>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <DoDont
            cards={[
              {
                type: "do",
                label:
                  "Bind the rung — or better, the component token. A literal that happens to equal a token is not the same as a binding.",
                preview: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-16)", padding: "var(--sa-stack-16)" }}>
                    <div style={{ height: "32px", background: "var(--sa-color-action-primary-tonal)", borderRadius: "var(--sa-cmp-button-radius)" }} />
                    <code style={{ fontSize: "var(--sa-type-body-2-size)" }}>border-radius: var(--sa-cmp-button-radius)</code>
                  </div>
                ),
              },
              {
                type: "dont",
                label:
                  "Don't type the number. 8px looks bound in any inspector that only shows the value, which is why this drifts unnoticed for a long time before anybody measures it.",
                preview: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-16)", padding: "var(--sa-stack-16)" }}>
                    {/* ds-exempt-start(specimen): the raw 9px IS the demonstration — the "don't"
                        half of a do/don't pair showing an off-ladder, unbound radius. Binding it
                        would delete the thing being shown. */}
                    <div style={{ height: "32px", background: "var(--sa-bg-neutral-subtler)", borderRadius: "9px" }} />
                    {/* ds-exempt-end */}
                    <code style={{ fontSize: "var(--sa-type-body-2-size)" }}>border-radius: 9px</code>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </article>
  );
}
