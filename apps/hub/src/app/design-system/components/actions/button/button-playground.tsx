"use client";

import { Playground, type ControlDef } from "@/components/design-system/playground/index";

/*
 * THE CONTROLS ARE THE COMPONENT'S OWN AXES, NOT A FOURTH VOCABULARY.
 *
 * This playground used to offer `primary · secondary · ghost · danger` and translate
 * them into real props behind the reader's back. Three things were wrong with that.
 * It taught a vocabulary the component does not have — the same four words that were
 * deleted from the Figma page in 2026-08 for "describing a component that does not
 * exist". It made `success` and `neutral` unreachable, so the reference specimen for
 * the estate's most-used atom could not produce half of it — including `neutral`,
 * whose whole reason for existing is that its absence once put a routine chat reset
 * in the estate's rejection red. And it hand-rolled `disabled` + `aria-busy` for the
 * loading state, which is the component's own job and had already drifted from it.
 *
 * Every control below is one prop. What you set is what the snippet says.
 */
const controls: ControlDef[] = [
  { name: "variant", label: "variant", type: "select", options: ["primary", "success", "danger", "neutral"], defaultValue: "primary" },
  { name: "appearance", label: "appearance", type: "select", options: ["filled", "outlined", "text"], defaultValue: "filled" },
  { name: "tone", label: "tone", type: "select", options: ["default", "inverse"], defaultValue: "default" },
  { name: "size", label: "size", type: "select", options: ["sm", "md", "lg"], defaultValue: "md" },
  { name: "iconLeft", label: "iconLeft", type: "boolean", defaultValue: false },
  { name: "iconRight", label: "iconRight", type: "boolean", defaultValue: false },
  { name: "loading", label: "loading", type: "boolean", defaultValue: false },
  { name: "disabled", label: "disabled", type: "boolean", defaultValue: false },
  { name: "label", label: "label", type: "text", defaultValue: "Submit application" },
];

/** The toolbar's language toggle drives the label, so the Hindi register is demonstrable. */
const HI: Record<string, string> = {
  "Submit application": "आवेदन जमा करें",
  "Submitting…": "जमा किया जा रहा है…",
};

const initialCode = `<Button variant="primary" appearance="filled" size="md">Submit application</Button>`;

function buildCode(v: Record<string, string | boolean>, lang: "en" | "hi" = "en"): string {
  const loading = v["loading"] === true;

  // KEEP THE LABEL MEANINGFUL WHILE BUSY — the component deliberately does not swap it,
  // because a control that loses its name mid-action is unusable with a screen reader.
  const base = loading ? "Submitting…" : String(v["label"]);
  const label = lang === "hi" ? (HI[base] ?? base) : base;

  const attrs = [
    `variant="${v["variant"]}"`,
    `appearance="${v["appearance"]}"`,
    v["tone"] === "inverse" ? `tone="inverse"` : "",
    `size="${v["size"]}"`,
    // A Hindi label is a Hindi run: the generated code marks it so the Devanagari face and
    // the screen-reader voice both switch with it.
    lang === "hi" ? `lang="hi"` : "",
    // The Icon is the library's Material Symbols glyph, at the 16px every button in
    // the estate uses. It is a font icon, not a drawing — one variable font, no asset.
    v["iconLeft"] ? `iconLeft={<Icon name="add" size={16} />}` : "",
    v["iconRight"] ? `iconRight={<Icon name="arrow_forward" size={16} />}` : "",
    loading ? "loading" : "",
    // `loading` already implies disabled inside the component, so emitting both would
    // teach a redundancy. Only a genuinely forbidden control gets `disabled`.
    v["disabled"] && !loading ? "disabled" : "",
  ].filter(Boolean);

  const button = `<Button ${attrs.join(" ")}>${label}</Button>`;

  // An inverse button is white-on-brand. On the playground's light stage it would be a
  // white shape on a white ground — so the stage changes with the tone, and the snippet
  // shows the surface the tone is FOR rather than pretending it works anywhere.
  if (v["tone"] !== "inverse") return button;
  return `(
  <div style={{
    background: "var(--sa-bg-brand-primary-bolder)",
    padding: "var(--sa-padding-24)",
    borderRadius: "var(--sa-shape-8)",
  }}>
    ${button}
  </div>
)`;
}

export function ButtonPlayground() {
  return <Playground code={initialCode} controls={controls} buildCode={buildCode} />;
}
