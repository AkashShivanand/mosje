// url=<SAMAVESH>?node-id=57837-796
// source=packages/design-system/components/feedback/action-banner.tsx
// component=ActionBanner
//
// ─────────────────────────────────────────────────────────────────────────────
// Authored 2026-09-07, the day the master was built. The component had shipped
// in code since the footer stopped carrying its own CTA and had no Figma
// counterpart at all — a search of 2,494 published components found neither
// variant — so this template and the master arrived together.
// ─────────────────────────────────────────────────────────────────────────────
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * `Variant` → `variant`. Exhaustive: both values mapped.
 *
 * It selects which of the two SHAPES you get — the full-width strip that ends a
 * section, or the column that stands in a grid of parallel offers — and that is
 * a decision the page makes and keeps.
 */
const variant = instance.getEnum("Variant", {
  Banner: "banner",
  Card: "card",
});

/**
 * `Breakpoint` HAS NO PROP, and must not grow one.
 *
 * Desktop and Mobile are two drawings of one component. In code the difference
 * is entirely CSS — below 640 the banner's row becomes a stack and its button
 * goes full width — so the browser picks, not the consumer. A `breakpoint` prop
 * would let a page pin the mobile stack onto a desktop screen.
 *
 * The CARD does not change at all between the two: it has no media query, and
 * its two variants are the same layout at two cell widths. The axis exists so
 * the matrix is complete, which is recorded on the master's Component record.
 */

/**
 * `title` and `description` are LAYERS, not component properties.
 *
 * The set exposes only the two variant axes, so these are read by layer name.
 * Both are `React.ReactNode` in code rather than `string`, which is why the
 * emitted snippet quotes them as plain text — a caller who needs markup passes
 * a fragment, and that is not something a drawing can express.
 *
 * `description` is optional in code, so it is emitted only when the layer has
 * text. An empty string would render an empty <p> and take the gap with it.
 */
const titleNode = instance.findText("title");
const title = titleNode && titleNode.type === "TEXT" ? titleNode.textContent : "";

const descriptionNode = instance.findText("description");
const description =
  descriptionNode && descriptionNode.type === "TEXT" ? descriptionNode.textContent : "";

/**
 * The action is resolved from the nested Button INSTANCE, never hardcoded.
 *
 * `action` is a slot typed `React.ReactNode`, so it holds whatever control the
 * page gives it. The master draws a `Button` instance, and Button carries its
 * own Code Connect template, so whatever a designer swaps or relabels comes
 * through here with its real variant, size and text.
 *
 * WORTH KNOWING: the website does NOT pass a `Button`. It passes a routed
 * `next/link` wearing `buttonClasses(...)`, because the control navigates. Both
 * are correct — the slot does not care — and this template emits what the
 * DRAWING contains rather than guessing at the consumer's routing.
 *
 * ONE control. The slot will hold two, but a panel with two equal buttons has
 * no call to action; it has a decision.
 */
const button = instance.findInstance("Button");
const actionCode =
  button && button.type === "INSTANCE" ? button.executeTemplate().example : undefined;

/**
 * `as` is deliberately not emitted. The title renders as a real heading so the
 * CTA appears in the document outline, and the right level depends on what
 * surrounds it on the page — an h3 inside a section that already has an h2.
 * A drawing cannot know the page's outline, and defaulting it here would put a
 * wrong level into every snippet.
 */

export default {
  example: figma.code`
    <ActionBanner
      variant="${variant}"
      title="${title}"
      ${description ? figma.code`description="${description}"` : ""}
      ${actionCode ? figma.code`action={${actionCode}}` : ""}
    />
  `,
  imports: ['import { ActionBanner } from "@mosje/design-system"'],
  id: "action-banner",
  // Nestable: the card variant's whole purpose is to sit in a grid cell, and
  // the banner sits inside a Band. Unlike Ticker, this is not page chrome.
  metadata: { nestable: true },
};
