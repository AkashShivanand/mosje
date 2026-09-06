// url=<SAMAVESH>?node-id=57608-745
// source=packages/design-system/components/utilities/back-to-top.tsx
// component=BackToTop
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis is whether the words are drawn. It is not a prop that removes them —
 * the label always stays in the accessible name, and hiding it is a matter of
 * the viewport, so the component decides rather than the caller.
 *
 * Everything that makes this component what it is — appearing on scroll, moving
 * focus to the main landmark, reading the corner rail rather than hard-coding an
 * offset — is code, and none of it is drawn.
 */
const label = instance.getEnum("Label", {
  Shown: "shown",
  Hidden: "hidden",
});

export default {
  example: figma.code`
    <BackToTop label="Back to top" />
  `,
  imports: ['import { BackToTop } from "@mosje/design-system"'],
  id: "back-to-top",
  metadata: { nestable: false },
};
