import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ChartTooltip,
  Legend,
  categoricalColor,
  divergingColor,
  formatIndian,
  sequentialColor,
  useChartTooltip,
} from "@mosje/design-system";

/**
 * **Legend** — the chart toolkit's key, for charts you compose yourself.
 *
 * Every chart in the catalogue already renders its own legend. You need this
 * one **only** when building a custom visualisation out of the toolkit
 * (`categoricalColor`, `sequentialColor`, `useChartTooltip`), so that it keeps
 * the same swatches, spacing and colour ramp as everything beside it.
 *
 * It is `aria-hidden` on purpose, and that is the thing to understand before
 * using it: the legend is **decoration for sighted users**. The real values
 * reach assistive tech through the screen-reader data table that `ChartFrame`
 * renders. If you compose a chart by hand and use this legend, you owe that
 * table too — otherwise the chart is silent to a screen reader and the legend
 * has quietly become the only key, hidden from the people who need it most.
 *
 * `ChartTooltip`, the floating bubble driven by `useChartTooltip`, is
 * documented here rather than in a story of its own. It positions itself inside
 * the chart canvas and is a polite live region, so hovering *and* keyboard focus
 * both announce — which is why charts call `show` from focus handlers as well
 * as pointer ones.
 *
 * An empty `items` array renders nothing at all rather than an empty box, so a
 * chart with no series does not leave a stray outline behind.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Charts/Legend",
  component: Legend,
  args: {
    orientation: "horizontal",
    items: [
      { label: "Approved", color: categoricalColor(0), value: "68%" },
      { label: "Pending", color: categoricalColor(1), value: "24%" },
      { label: "Returned", color: categoricalColor(2), value: "8%" },
    ],
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    items: { control: "object" },
  },
} satisfies Meta<typeof Legend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Horizontal under a chart, vertical beside one. */
export const Orientations: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32 }}>
      <Legend {...args} orientation="horizontal" />
      <Legend {...args} orientation="vertical" />
    </div>
  ),
};

/** Without trailing values — a plain key. */
export const WithoutValues: Story = {
  args: {
    items: [
      { label: "Pre-Matric", color: categoricalColor(0) },
      { label: "Post-Matric", color: categoricalColor(1) },
      { label: "Hostels", color: categoricalColor(2) },
      { label: "Skill training", color: categoricalColor(3) },
    ],
  },
};

/**
 * The three colour helpers the toolkit exposes. Use `categoricalColor` for
 * unordered groups, `sequentialColor` for a low→high measure, and
 * `divergingColor` only where there is a real centre.
 */
export const ColourRamps: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <p style={{ margin: "0 0 8px", color: "var(--sa-color-text-muted)" }}>
          categoricalColor — unordered groups
        </p>
        <Legend
          items={Array.from({ length: 6 }, (_, i) => ({
            label: `Category ${i + 1}`,
            color: categoricalColor(i),
          }))}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", color: "var(--sa-color-text-muted)" }}>
          sequentialColor — low to high
        </p>
        <Legend
          items={[0, 0.25, 0.5, 0.75, 1].map((t) => ({
            label: `${Math.round(t * 100)}%`,
            color: sequentialColor(t),
          }))}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", color: "var(--sa-color-text-muted)" }}>
          divergingColor — distance from a meaningful centre
        </p>
        <Legend
          items={[-1, -0.5, 0, 0.5, 1].map((t) => ({
            label: t > 0 ? `+${t}` : String(t),
            color: divergingColor(t),
          }))}
        />
      </div>
    </div>
  ),
};

/**
 * `ChartTooltip` driven by `useChartTooltip`. Hover or tab to a bar — focus
 * opens it too, which is why charts wire `show` to both.
 */
export const TooltipInACustomChart: Story = {
  render: function Render() {
    const { canvasRef, tip, show, hide } = useChartTooltip();
    const bars = [
      { label: "Pune", value: 386_240 },
      { label: "Thane", value: 402_310 },
      { label: "Nagpur", value: 298_105 },
      { label: "Nashik", value: 241_880 },
    ];
    const max = Math.max(...bars.map((b) => b.value));

    return (
      <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
        <div
          ref={canvasRef}
          style={{ position: "relative", display: "grid", gap: 8, padding: 8 }}
        >
          {bars.map((bar, i) => (
            <button
              key={bar.label}
              type="button"
              onMouseMove={(e) =>
                show(
                  <>
                    <strong>{bar.label}</strong>
                    <br />
                    {formatIndian(bar.value)} beneficiaries
                  </>,
                  e.clientX,
                  e.clientY,
                )
              }
              onMouseLeave={hide}
              onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                show(
                  <>
                    <strong>{bar.label}</strong>
                    <br />
                    {formatIndian(bar.value)} beneficiaries
                  </>,
                  r.left + r.width / 2,
                  r.top,
                );
              }}
              onBlur={hide}
              style={{
                display: "block",
                width: `${(bar.value / max) * 100}%`,
                height: 28,
                border: 0,
                padding: 0,
                borderRadius: "var(--sa-shape-4)",
                background: categoricalColor(i),
                cursor: "pointer",
              }}
              aria-label={`${bar.label}: ${formatIndian(bar.value)} beneficiaries`}
            />
          ))}
          <ChartTooltip tip={tip} />
        </div>
        <Legend
          items={bars.map((b, i) => ({
            label: b.label,
            color: categoricalColor(i),
            value: formatIndian(b.value),
          }))}
        />
        {/*
          A hand-composed chart owes assistive tech the data table its own
          legend is hidden from.
        */}
        <table className="ds-sr-only">
          <caption>Beneficiaries verified by district</caption>
          <thead>
            <tr>
              <th scope="col">District</th>
              <th scope="col">Beneficiaries</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.label}>
                <td>{b.label}</td>
                <td>{formatIndian(b.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};
