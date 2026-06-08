import type { Meta, StoryObj } from "@storybook/react";

/**
 * **Color** foundation — the semantic token contract. App code consumes these semantic
 * tokens only (never raw hex or Tier-1 primitives). Toggle the Theme toolbar (light / dark /
 * high-contrast) to see the same tokens re-resolve.
 */
const meta: Meta = { title: "Foundations/Color" };
export default meta;
type Story = StoryObj;

const SWATCHES: { name: string; var: string }[] = [
  { name: "action.primary", var: "--sa-color-action-primary-default" },
  { name: "action.primary.hover", var: "--sa-color-action-primary-hover" },
  { name: "action.primary.tonal", var: "--sa-color-action-primary-tonal" },
  { name: "text.default", var: "--sa-color-text-default" },
  { name: "text.muted", var: "--sa-color-text-muted" },
  { name: "bg.surface", var: "--sa-color-bg-surface" },
  { name: "bg.muted", var: "--sa-color-bg-muted" },
  { name: "border.subtle", var: "--sa-color-border-subtle" },
  { name: "border.strong", var: "--sa-color-border-strong" },
  { name: "status.success", var: "--sa-color-status-success" },
  { name: "status.warning", var: "--sa-color-status-warning" },
  { name: "status.danger", var: "--sa-color-status-danger" },
  { name: "status.info", var: "--sa-color-status-info" },
  { name: "brand.saffron", var: "--sa-color-brand-saffron" },
  { name: "brand.navy", var: "--sa-color-brand-navy" },
];

export const Semantic: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
      {SWATCHES.map((s) => (
        <div key={s.var} style={{ border: "1px solid var(--ds-border-strong)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ height: 72, background: `var(${s.var})` }} />
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
            <code style={{ fontSize: 12, color: "var(--ds-ink-muted)" }}>{s.var}</code>
          </div>
        </div>
      ))}
    </div>
  ),
};
