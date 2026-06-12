import type { Meta, StoryObj } from "@storybook/react";

/**
 * **Typography** foundation — Noto Sans type roles from the token scale. Multi-script ready
 * (Latin + Devanagari): the same roles render Hindi correctly with script-appropriate leading.
 */
const meta: Meta = { title: "Foundations/Typography" };
export default meta;
type Story = StoryObj;

const ROLES: { name: string; size: string; leading: string; weight: number }[] = [
  { name: "Display", size: "--ds-text-display", leading: "--ds-leading-display", weight: 500 },
  { name: "Title 1", size: "--ds-text-title-1", leading: "--ds-leading-title-1", weight: 500 },
  { name: "Headline", size: "--ds-text-headline", leading: "--ds-leading-headline", weight: 600 },
  { name: "Body 1", size: "--ds-text-body-1", leading: "--ds-leading-body-1", weight: 400 },
  { name: "Body 2", size: "--ds-text-body-2", leading: "--ds-leading-body-2", weight: 400 },
];

export const Scale: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {ROLES.map((r) => (
        <div key={r.name} style={{ borderBottom: "1px solid var(--ds-border)", paddingBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--ds-ink-muted)", marginBottom: 4 }}>
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
