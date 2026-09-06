// url=<SAMAVESH>?node-id=57596-752
// source=packages/design-system/components/navigation/language-switcher.tsx
// component=LanguageSwitcher
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis says which language is being READ, which in code is `current` — the
 * BCP-47 tag, not an index. The languages themselves are the caller's, because
 * the set of languages a page is published in is a property of the page.
 */
const reading = instance.getEnum("Reading", {
  English: "en",
  "हिन्दी": "hi",
});

export default {
  example: figma.code`
    <LanguageSwitcher
      current="${reading}"
      languages={[
        { code: "en", label: "English", href: "/en/schemes/pre-matric-scholarship" },
        { code: "hi", label: "हिन्दी", href: "/hi/schemes/pre-matric-scholarship" },
      ]}
    />
  `,
  imports: ['import { LanguageSwitcher } from "@mosje/design-system"'],
  id: "language-switcher",
  metadata: { nestable: true },
};
