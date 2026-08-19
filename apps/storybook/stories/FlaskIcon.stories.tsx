import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FlaskIcon } from "@mosje/design-system";

/**
 * **FlaskIcon** — the round-bottom laboratory flask that marks `DemoDock`,
 * the estate's "this is a demo tool, not the product" glyph.
 *
 * **When NOT to use this.** Almost always. `<Icon>` (Material Symbols
 * Rounded) is the SAMAVESH icon system and is the right answer for every
 * icon in every portal and on every page. This one exists because `DemoDock`
 * needs an icon that can **move its own insides** — raise a liquid level,
 * release bubbles — to show whether the tool is idle, hovered or running.
 * A font glyph is a single indivisible shape and structurally cannot do
 * that. Nothing else in the estate earns a hand-drawn icon on those grounds,
 * and adding a second one would start an icon dialect, which is the thing
 * the Material Symbols rule exists to prevent.
 *
 * **It animates nothing by itself.** The component ships its animations
 * permanently paused and exposes four custom properties for a consumer to
 * drive from its own selectors, because only the consumer knows its own
 * markup:
 *
 * | Property | Values | Effect |
 * |---|---|---|
 * | `--ds-flask-play` | `paused` (default) · `running` | whether bubbles rise |
 * | `--ds-flask-bubbles` | `0` (default) · `1` | opacity of the bubble set |
 * | `--ds-flask-cycle` | a `<time>`, default `2200ms` | one bubble's duration |
 * | `--ds-flask-level` | a `<length>`, default `0px` | how far the liquid is raised |
 *
 * `demo-dock.css` maps `:hover`, `:focus-visible` and `[aria-expanded="true"]`
 * onto those four. That indirection is what lets one file serve both the FAB
 * and the panel's header badge, which sit in different subtrees and respond
 * to different state.
 *
 * **Colour comes from `currentColor`** — the outline directly, the liquid and
 * bubbles through `fill-opacity`. Set `color` on any ancestor and the whole
 * icon re-tones, correctly, in all seven brand modes, with no token of its
 * own and no prop to thread.
 *
 * Decorative and `aria-hidden`. The accessible name always belongs to the
 * control that contains it.
 *
 * Under `prefers-reduced-motion: reduce` nothing moves, but state survives:
 * a raised level stays raised and the bubbles show as a held frame, so
 * "running" still looks different from "idle".
 */
const meta = {
  title: "Demo/FlaskIcon",
  component: FlaskIcon,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 96, step: 2 } },
  },
} satisfies Meta<typeof FlaskIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default size (16px), at rest — still, as it is on an untouched FAB. */
export const Playground: Story = {
  args: { size: 16 },
};

/**
 * The four states side by side, driven exactly the way `demo-dock.css`
 * drives them — by setting the custom properties on an ancestor, never by a
 * prop on the icon.
 *
 * Hover the third tile to see the pointer trigger the FAB uses.
 */
export const States: Story = {
  args: { size: 48 },
  render: ({ size }) => {
    const tile: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--sa-stack-8)",
      padding: "var(--sa-padding-16)",
      borderRadius: "var(--sa-shape-8)",
      background: "var(--sa-bg-neutral-subtler)",
      color: "var(--sa-text-brand-primary-base)",
      minWidth: "128px",
    };
    const caption: React.CSSProperties = {
      fontSize: "var(--sa-type-body-3-size)",
      lineHeight: "var(--sa-type-body-3-lh)",
      color: "var(--sa-text-neutral-subtle)",
      textAlign: "center",
    };

    return (
      <div style={{ display: "flex", gap: "var(--sa-inline-12)", flexWrap: "wrap" }}>
        <div style={tile}>
          <FlaskIcon size={size} />
          <span style={caption}>Idle — nothing moves</span>
        </div>

        <div
          style={
            {
              ...tile,
              "--ds-flask-play": "running",
              "--ds-flask-bubbles": 1,
            } as React.CSSProperties
          }
        >
          <FlaskIcon size={size} />
          <span style={caption}>Interactive — slow bubbles</span>
        </div>

        <div
          style={
            {
              ...tile,
              "--ds-flask-play": "running",
              "--ds-flask-bubbles": 1,
              "--ds-flask-cycle": "1450ms",
              "--ds-flask-level": "-1.6px",
            } as React.CSSProperties
          }
        >
          <FlaskIcon size={size} />
          <span style={caption}>Running — faster, liquid raised</span>
        </div>

        <div style={{ ...tile, color: "var(--sa-text-status-success-base)" }}>
          <FlaskIcon size={size} />
          <span style={caption}>
            Any <code>color</code> — outline and liquid both follow
          </span>
        </div>
      </div>
    );
  },
};

/**
 * The sizes it is actually drawn at in the estate — 16px on the FAB, 17px on
 * the panel's header badge — beside a large specimen showing the geometry.
 * The neck meets the bulb tangentially by construction (the join is computed
 * from the bulb's radius, not eyeballed), which is what keeps the silhouette
 * clean when it is scaled right down.
 */
export const Sizes: Story = {
  args: { size: 16 },
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "var(--sa-inline-20)",
        color: "var(--sa-text-brand-primary-base)",
      }}
    >
      {[16, 17, 24, 40, 80].map((px) => (
        <div
          key={px}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-8)" }}
        >
          <FlaskIcon size={px} />
          <span
            style={{
              fontSize: "var(--sa-type-body-3-size)",
              color: "var(--sa-text-neutral-subtle)",
            }}
          >
            {px}px
          </span>
        </div>
      ))}
    </div>
  ),
};
