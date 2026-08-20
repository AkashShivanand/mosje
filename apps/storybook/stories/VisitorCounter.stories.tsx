import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { VisitorCounter } from "@mosje/design-system";

/**
 * **VisitorCounter** — the "Total Visits" figure a government footer carries.
 *
 * **This is MOCK DATA and it must stay obviously so until a real feed exists.**
 * There is no analytics backend on this estate. Rather than print an invented
 * constant, the figure is DERIVED: `baseline` counted at `since`, extrapolated at
 * `perDay`, ticking while the page is open. It behaves like a real counter and is
 * reproducible from its inputs — but it is not a measurement. **Do not quote it,
 * and do not present it as one.** Swap the props for a real source before the
 * site carries a number anyone might rely on.
 *
 * **When NOT to reach for it:** anywhere the number has consequences — a
 * dashboard, a report, an RTI response. It exists to fill a footer slot that
 * DBIM's illustrative footer shows, not to report traffic.
 *
 * The first paint is blank on purpose. The value depends on the clock, so server
 * and client would disagree and React would report a hydration mismatch; the
 * component renders a placeholder until mounted, then fills in.
 *
 * It is deliberately **not** a live region. A figure that re-announces every
 * twelve seconds talks over the page; `aria-label` names it once and the digits
 * are `tabular-nums` so they do not jitter. Ticking stops under
 * `prefers-reduced-motion`. Set `tickSeconds={0}` to freeze it after first paint.
 *
 * Colour is inherited: inside `SiteFooter` it picks up `--ds-footer-ink*`;
 * anywhere else it falls back to `currentColor`. Lifecycle: **Stable**.
 */
const meta = {
  title: "Data display/VisitorCounter",
  component: VisitorCounter,
  args: {
    label: "Total Visits",
    baseline: 247_112,
    since: "2026-08-20T00:00:00Z",
    perDay: 1_940,
    tickSeconds: 12,
  },
  argTypes: {
    label: { control: "text" },
    baseline: { control: { type: "number" } },
    since: { control: "text" },
    perDay: { control: { type: "number" } },
    tickSeconds: { control: { type: "number" } },
  },
} satisfies Meta<typeof VisitorCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * How it looks where it actually lives — light ink on the footer's dark ground.
 */
export const OnFooterGround: Story = {
  render: (args) => (
    <div
      style={{
        background: "var(--sa-bg-brand-primary-boldest)",
        padding: "var(--sa-padding-24)",
        // The footer sets these; reproduced here so the specimen is honest about
        // what the component inherits rather than inventing its own palette.
        ["--ds-footer-ink" as string]: "var(--sa-on-bg-brand-primary-boldest)",
        ["--ds-footer-ink-muted" as string]: "var(--sa-color-primaryScale-100)",
      }}
    >
      <VisitorCounter {...args} />
    </div>
  ),
};

/**
 * `tickSeconds={0}` freezes the figure after the first paint. Use it wherever a
 * moving number would distract — a print stylesheet, a screenshot, a demo.
 */
export const Frozen: Story = {
  args: { tickSeconds: 0 },
};
