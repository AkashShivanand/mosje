// url=<SAMAVESH>?node-id=57414-15871
// source=packages/design-system/components/data-display/metric-card.tsx
// component=MetricCard
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Reading` → which of the five readings of one number the tile shows.
 * Not a prop: each reading is a different SET of props on the one component,
 * so the axis chooses which fragment the snippet emits. Exhaustive, 5 of 5.
 */
const reading = instance.getEnum("Reading", {
  Value: "value",
  Change: "change",
  Trend: "trend",
  Target: "target",
  Status: "status",
});

/**
 * Figma `Tone` → `tone`. Neutral is the absence of the prop. The other four are
 * claims — the code's own TSDoc says to set them only against a rule the scheme
 * has stated — so the snippet emits them only where the designer chose them,
 * never as a default. Exhaustive, 5 of 5: Success and Info joined the set on
 * 16 September 2026 and went unmapped for a day, which emits `undefined`.
 */
const tone = instance.getEnum("Tone", {
  Neutral: "",
  Info: "info",
  Success: "success",
  Warning: "warning",
  Danger: "danger",
});

/** Figma `Size` → `size`. Medium is the default and is not emitted. */
const size = instance.getEnum("Size", {
  Medium: "",
  Small: "sm",
});

/**
 * Figma `Show icon` + `Icon` → `icon`. The badge holds a library Icon instance;
 * its template resolves to the `<Icon name="…" />` the code takes. Hidden badge,
 * no prop — the code draws no badge when `icon` is absent.
 */
const showIcon = instance.getBoolean("Show icon");

/**
 * Figma `Selected` → `selected`. The tile the page is currently filtered by. The
 * code announces it as well as tinting it — `aria-pressed` on a button,
 * `aria-current` on a link — so the prop is never decoration.
 */
const selected = instance.getBoolean("Selected");

/**
 * Figma `Opens something` → NEITHER PROP ON ITS OWN, deliberately.
 *
 * The boolean says the tile is a control; it cannot say which kind, because the
 * code's two are exclusive: `href` when it GOES somewhere, `onSelect` when it
 * DOES something here, never both. So the snippet emits the one this estate
 * reaches for most — a tile that filters the list below it — with the other
 * named in the body, rather than guessing silently or dropping the property.
 */
const opens = instance.getBoolean("Opens something");
const iconInstance = instance.getInstanceSwap("Icon");
const iconCode = iconInstance && iconInstance.type === "INSTANCE" ? iconInstance.executeTemplate().example : undefined;

export default {
  example: figma.code`
    <MetricCard
      label="Utilisation of Release"
      value="79.0%"
      ${tone ? figma.code`tone="${tone}"` : ""}
      ${size ? figma.code`size="${size}"` : ""}
      ${showIcon && iconCode ? figma.code`icon={${iconCode}}` : ""}
      ${opens ? figma.code`onSelect={() => { /* filter this page — or drop onSelect and give it href="/…" to go somewhere */ }}` : ""}
      ${selected ? figma.code`selected` : ""}
      ${reading === "change" || reading === "target" || reading === "trend" ? figma.code`changeValue="1.6 pts" changeDirection="down" changeLabel="utilised ÷ released"` : ""}
      ${reading === "trend" ? figma.code`aside={<Sparkline data={series} width={72} height={24} />}` : ""}
      ${reading === "target" ? figma.code`progress={{ value: 79, max: 100, target: 85, targetLabel: "Target 85%" }}` : ""}
      ${reading === "status" ? figma.code`detail="90 of 883 surveyed" status={{ label: "Below target", tone: "danger" }}` : ""}
    />
  `,
  imports: ['import { MetricCard, Sparkline } from "@mosje/design-system"'],
  id: "metric-card",
  metadata: { nestable: true },
};
