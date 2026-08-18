// url=https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH?node-id=55065-33766
// source=packages/design-system/components/navigation/accessibility-bar.tsx
// component=AccessibilityBar
//
// Code Connect template for the SAMAVESH AccessibilityBar — the government top
// utility bar (UX4G / GIGW). This file IS the instruction the Figma MCP server
// hands an agent that opens the component in Dev Mode, so it carries the usage
// rules as well as the snippet. See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — all 9 Figma properties are accounted for:
//   Device            -> device      (auto | mobile | tablet | desktop | desktop-xl)
//   Layout            -> layout      (narrow | wide | fluid)
//   Skip to content   -> showSkip
//   Font size         -> fontSize
//   Accessibility     -> accessibility
//   Language          -> language    (boolean in Figma; {label} | false in code)
//   Government label  -> govLink.label
//   Language label    -> language.label
//   Skip label        -> skipLabel   (NEWLY MAPPED, 2026-08-18)
//
// `Skip label` used to be listed here as "deliberately omitted, there is no code
// prop to map it to". That was accurate and it was also the wrong resting place:
// the reason there was no prop is that the component hardcoded the English string,
// which on a bilingual estate is a defect rather than a design. The prop exists
// now, so the property is mapped and the omission note is gone. All 9 Figma
// properties are mapped; none are omitted.
//
// TONE IS NOT A PROPERTY. Blue vs Navy is resolved by the `data-color-mode` brand
// axis (Figma's Palette collection modes), not by a variant — which is why the
// master has no Tone axis. Do not add a `tone` prop to generated code.
import figma from "figma";

const instance = figma.selectedInstance;

const skip = instance.getBoolean("Skip to content");
const fontSize = instance.getBoolean("Font size");
const accessibility = instance.getBoolean("Accessibility");
const language = instance.getBoolean("Language");

const govLabel = instance.getString("Government label");
const langLabel = instance.getString("Language label");
const skipLabel = instance.getString("Skip label");

const layout = instance.getEnum("Layout", {
  Narrow: "narrow",
  Wide: "wide",
  Fluid: "fluid",
});

// `auto` has no Figma variant on purpose: it is the web-native default that
// resolves the same breakpoints in CSS. An explicit device pins one variant.
const device = instance.getEnum("Device", {
  Mobile: "mobile",
  Tablet: "tablet",
  Desktop: "desktop",
  "Desktop XL": "desktop-xl",
});

export default {
  example: figma.code`<AccessibilityBar
  govLink={{ label: "${govLabel}" }}
  showSkip={${skip}}
  skipLabel="${skipLabel}"
  fontSize={${fontSize}}
  accessibility={${accessibility}}
  language={${language ? figma.code`{ label: "${langLabel}" }` : "false"}}
  layout="${layout}"
  device="${device}"
/>`,
  imports: ['import { AccessibilityBar } from "@mosje/design-system"'],
  id: "accessibility-bar",
  metadata: { nestable: true },
};
