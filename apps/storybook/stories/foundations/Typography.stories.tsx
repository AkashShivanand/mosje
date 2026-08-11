import type { Meta, StoryObj } from "@storybook/react";

/**
 * **Typography** foundation — Noto Sans type roles from the token scale. Multi-script ready
 * (Latin + Devanagari): the same roles render Hindi correctly with script-appropriate leading.
 */
const meta: Meta = { title: "Foundations/Typography" };
export default meta;
type Story = StoryObj;

const ROLES: { name: string; size: string; leading: string; weight: number }[] = [
  { name: "Display", size: "--sa-type-display-1-size", leading: "--sa-type-display-1-lh", weight: 500 },
  { name: "Title 1", size: "--sa-type-headline-2-size", leading: "--sa-type-headline-2-lh", weight: 500 },
  { name: "Headline", size: "--sa-type-headline-1-size", leading: "--sa-type-headline-1-lh", weight: 600 },
  { name: "Body 1", size: "--sa-type-body-1-size", leading: "--sa-type-body-1-lh", weight: 400 },
  { name: "Body 2", size: "--sa-type-body-2-size", leading: "--sa-type-body-2-lh", weight: 400 },
];

export const Scale: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {ROLES.map((r) => (
        <div key={r.name} style={{ borderBottom: "1px solid var(--sa-border-neutral-subtle)", paddingBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--sa-color-text-muted)", marginBottom: 4 }}>
            {r.name} · <code>{r.size}</code>
          </div>
          <div style={{ fontSize: `var(${r.size})`, lineHeight: `var(${r.leading})`, fontWeight: r.weight }}>
            Social Justice &amp; Empowerment · सामाजिक न्याय और अधिकारिता
          </div>
        </div>
      ))}
    </div>
  ),
};
