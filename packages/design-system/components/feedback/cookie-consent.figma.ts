// url=<SAMAVESH>?node-id=57622-778
// source=packages/design-system/components/feedback/cookie-consent.tsx
// component=CookieConsent
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Kind is derived from the CATEGORIES, not passed in. Where every category is
 * `required` there is nothing to consent to and the component renders one
 * acknowledgement; where one is optional it renders a real choice. "Choices" is
 * that choice with its panel open, which is the component's own state.
 *
 * There is no prop to pre-tick an optional category, and there will not be one.
 */
const kind = instance.getEnum("Kind", {
  Notice: "notice",
  Choice: "choice",
  Choices: "choice-open",
});

const categories =
  kind === "notice"
    ? `[
        { id: "essential", label: "Essential cookies", required: true,
          description: "Keep you signed in and remember the language you chose. The site does not work without them." },
      ]`
    : `[
        { id: "essential", label: "Essential cookies", required: true,
          description: "Keep you signed in and remember the language you chose. The site does not work without them." },
        { id: "analytics", label: "Usage measurement",
          description: "Count how many people reach each page, so the Department can see which pages are hard to find." },
      ]`;

export default {
  example: figma.code`
    <CookieConsent
      description="The Department uses cookies to keep this site working and, with your permission, to count how many people use each page."
      policyHref="/website/privacy-policy"
      accepted={accepted}
      onDecide={save}
      categories={${categories}}
    />
  `,
  imports: ['import { CookieConsent } from "@mosje/design-system"'],
  id: "cookie-consent",
  metadata: { nestable: false },
};
