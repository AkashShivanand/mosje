import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Illustration, SCENE_NAMES, illustrationAlt, EmptyState, Button } from "@mosje/design-system";

/**
 * **Illustration** — a drawing from the estate's own visual language. Lifecycle: **New**.
 *
 * One 64 × 48 geometry rendered at three tiers (`spot`, `scene`, `hero`), so a
 * drawing is authored once and is correct at every size. Every stroke resolves
 * through one of four tokenised ink layers, which is what lets an illustration
 * follow `data-brand` instead of keeping the palette it was drawn in.
 *
 * **`alt` is the prop to think about, and the answer is usually to omit it.**
 * Illustrations here are decorative by default. A drawing beside a heading that
 * already reads "No records found" carries no information the heading does not,
 * and labelling it makes a screen reader announce the same thing twice. Pass
 * `alt` only where the drawing says something the surrounding text does not.
 *
 * **When NOT to reach for this.** Prefer `EmptyState` or `CardState` — they
 * place the drawing, the sentence and the action together, which is what a
 * reader actually needs. Use `Illustration` directly only when composing
 * something those two do not cover. And it is not an icon: for a glyph beside a
 * label, use `Icon`.
 *
 * **No scene depicts a person**, and that is a property of the language rather
 * than a gap in the set. The Department serves Scheduled Castes, senior
 * citizens, persons with disabilities and transgender persons; any depicted
 * person has a gender, an age and an apparent community, and tells every
 * citizen who is not that person that the page is not for them. Where a drawing
 * needs a human presence it shows the evidence of one — a seat, a form, a place
 * in a queue.
 */
const meta = {
  title: "Brand/Illustration",
  component: Illustration,
  args: {
    name: "empty",
    tier: "scene",
  },
  argTypes: {
    name: { control: "select", options: SCENE_NAMES },
    tier: { control: "inline-radio", options: ["spot", "scene", "hero"] },
    alt: { control: "text" },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof Illustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * The whole set. Chosen from what this estate's workflows contain — an
 * application is drafted, a document is outstanding, a place is sanctioned and
 * not yet taken, a feed stops answering. There is deliberately no success
 * celebration and no team photo; this is a department, not a product launch.
 */
export const AllScenes: Story = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "var(--sa-inline-16)",
        listStyle: "none",
        margin: 0,
        padding: 0,
        maxWidth: 960,
      }}
    >
      {SCENE_NAMES.map((name) => (
        <li
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--sa-stack-8)",
            padding: "var(--sa-padding-20)",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-12)",
            background: "var(--sa-bg-neutral-base)",
          }}
        >
          <Illustration name={name} />
          <code style={{ fontSize: "var(--sa-type-body-3-size)" }}>{name}</code>
        </li>
      ))}
    </ul>
  ),
};

/**
 * The same drawing at all three tiers. The authored geometry does not change —
 * only the rendered box — so strokes, corners and gaps scale together.
 */
export const Tiers: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--sa-inline-32)" }}>
      <Illustration name="places-sanctioned" tier="spot" />
      <Illustration name="places-sanctioned" tier="scene" />
      <Illustration name="places-sanctioned" tier="hero" />
    </div>
  ),
};

/**
 * The pairing that should be reached for first: the drawing inside an
 * `EmptyState`, where it sits with the sentence and the action rather than
 * standing on its own. The drawing stays decorative — the heading is the
 * accessible answer.
 */
export const InsideAnEmptyState: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <EmptyState
        icon={<Illustration name="no-results" />}
        title="No Districts Match This Filter"
        description="No district in Bihar is recorded under the selected category. Clear the category to see all 38."
        action={<Button appearance="outlined">Clear the category</Button>}
      />
    </div>
  ),
};

/**
 * The rare labelled case — a drawing carrying something the text does not. The
 * wording comes from `illustrationAlt`, so one drawing is described the same way
 * wherever it appears rather than being re-invented at each call site.
 */
export const Labelled: Story = {
  args: {
    name: "documents-required",
    alt: illustrationAlt("documents-required"),
  },
};
