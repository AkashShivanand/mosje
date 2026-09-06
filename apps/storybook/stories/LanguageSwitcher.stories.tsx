// ds-exempt-start(hindi-source): every Devanagari string here is either fixture data
// handed to LanguageSwitcher — which writes lang={code} on each option itself — or
// prose about that behaviour. The attribute belongs in the component, not the story.
import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSwitcher } from "@mosje/design-system";

/**
 * The languages a page is published in, offered as links.
 *
 * **Use it** wherever a page exists in more than one language — GIGW 3.0 makes a
 * bilingual estate an obligation, so on this estate that is most pages.
 *
 * **Do not use it** to switch anything other than language. It is not a general
 * settings control, and it is not a place to put a font-size or contrast option —
 * those belong on the `AccessibilityBar`.
 *
 * Two things carry most of its value. Each option is written in its OWN language
 * and carries its own `lang`, so a screen reader pronounces "हिन्दी" with a Hindi
 * voice rather than an English one (WCAG 3.1.2 Language of Parts). And the
 * language being read is NOT a link: a link to the page you are already on is a
 * control that does nothing, and it is the option a reader is most likely to
 * press by mistake.
 *
 * `label` and `currentLabel` are written in the CURRENT language, because they
 * name the control rather than any one option. `href` is a real address, so the
 * Hindi page can be shared, bookmarked, indexed and opened in a new tab.
 *
 * More than about four languages is not a switcher — twenty-two scheduled
 * languages is a page of its own, linked from here.
 */
const meta = {
  title: "Navigation/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: { layout: "centered" },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

const BILINGUAL = [
  { code: "en", label: "English", href: "/en/schemes/pre-matric-scholarship" },
  { code: "hi", label: "हिन्दी", href: "/hi/schemes/pre-matric-scholarship" },
];

export const Playground: Story = {
  args: { languages: BILINGUAL, current: "en" },
};

/** The Hindi copy being read. English becomes the link; Hindi becomes plain text. */
export const ReadingHindi: Story = {
  args: { languages: BILINGUAL, current: "hi" },
};

/**
 * Four languages is the practical ceiling for a row. Each label is written in
 * its own script, which is the only form a reader who cannot read the current
 * page can search.
 */
export const FourLanguages: Story = {
  args: {
    current: "en",
    languages: [
      { code: "en", label: "English", href: "/en/schemes" },
      { code: "hi", label: "हिन्दी", href: "/hi/schemes" },
      { code: "bn", label: "বাংলা", href: "/bn/schemes" },
      { code: "ta", label: "தமிழ்", href: "/ta/schemes" },
    ],
  },
};

/**
 * The group's name and the hidden "current language" note are written in the
 * language being read, so a Hindi reader is told in Hindi which one they are on.
 */
export const NamedInHindi: Story = {
  args: {
    languages: BILINGUAL,
    current: "hi",
    label: "भाषा",
    currentLabel: "वर्तमान भाषा",
  },
};
// ds-exempt-end
