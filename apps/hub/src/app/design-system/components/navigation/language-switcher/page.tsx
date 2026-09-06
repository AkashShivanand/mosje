import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { LanguagePlayground } from "./language-playground";

export const metadata: Metadata = {
  title: "Language Switcher — Design System",
  description:
    "The languages a page is published in, offered as links — each written in its own language, each carrying its own lang attribute, and the one being read rendered as text rather than a link to itself.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.1.2 Language of Parts",
    level: "AA",
    status: "verified",
    evidence:
      'Read from the rendered DOM on this page: every option carries lang matching its own script — lang="hi" on "हिन्दी", lang="bn" on "বাংলা", lang="ta" on "தமிழ்" — and each link also carries hreflang. Without the attribute a screen reader pronounces the Devanagari with an English voice.',
    description: "Each language's name is marked as being in that language.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the accessibility tree: the group is a navigation landmark named by `label`; the language being read is not a link and carries aria-current="true" with a visually hidden "Current language:" before it. The other options are links with their own accessible names.',
    description: "The group is named, and the current language is announced as current.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Each option is given min-height: var(--sa-target-min) (24px) with 8px of horizontal padding. Measured with getBoundingClientRect on this page: no option is below 24px on either axis.",
    description: "Every option clears the 24×24 minimum.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "The links are underlined at rest, not distinguished by colour alone, and the current language differs from them in weight of treatment (no underline, darker ink) as well as in the hidden text that names it.",
    description: "The link/not-a-link distinction does not depend on colour.",
  },
];

export default function LanguageSwitcherPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Language Switcher"
      status="Stable"
      summary="The languages a page is published in, offered as links. Each is written in its own language and carries its own lang attribute; the one being read is rendered as text, because a link to the page you are already on is a control that does nothing."
      figma={{ node: "languageSwitcher" }}
      specimen={<LanguagePlayground />}
      propsFrom="LanguageSwitcherProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page is published in more than one language. GIGW 3.0 makes a bilingual estate an obligation, so on this estate that is most pages.",
          "Each language's copy has its own address, which can be shared, bookmarked and indexed.",
        ],
        avoid: [
          "There are more than about four languages. Twenty-two scheduled languages is a page of its own, linked from here — a row of twenty-two is not a control anyone can use.",
          "The switch is anything other than language. Text size and contrast belong on the Accessibility Bar.",
          "The other language's page does not exist. A link to a page that has not been translated is worse than no switcher, because the reader loses their place to find out.",
        ],
      }}
      related={[
        {
          label: "Accessibility Bar",
          href: "/design-system/components/utilities/accessibility-bar",
          reason: "where text size and contrast live",
        },
        { label: "Link", href: "/design-system/components/navigation/link", reason: "the underlying link treatment" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-own">
            <h2 id="cdp-own" className="cdp__h2">Each Language Names Itself</h2>
            <p>
              An option reads <span lang="hi">हिन्दी</span>, never &ldquo;Hindi&rdquo;. The person
              this control exists for is the person who cannot read the language the page is
              currently in, and a language list written in that language is unreadable to exactly
              them. The <code>lang</code> attribute follows for the same reason it is written this
              way: without it a screen reader pronounces the Devanagari with an English voice, and
              produces noise rather than a word.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-current">
            <h2 id="cdp-current" className="cdp__h2">The Language Being Read Is Not a Link</h2>
            <p>
              It renders as text, marked <code>aria-current</code>, with a visually hidden
              &ldquo;Current language:&rdquo; before it. A link to the page you are already on is a
              control that does nothing, and it is the one option a reader is most likely to press
              by mistake — they press their own language expecting confirmation and get a page
              reload.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-links">
            <h2 id="cdp-links" className="cdp__h2">Real Links, Not a Select</h2>
            <p>
              The Hindi page has its own address. That is what lets it be shared with someone who
              reads Hindi, bookmarked, indexed by a search engine, and opened in a new tab. A
              control that switches language with script alone takes all four away, and on a
              government page the shareable address is often the point.
            </p>
            <CodeBlock>{`import { LanguageSwitcher } from "@mosje/design-system";

<LanguageSwitcher
  current="en"
  languages={[
    { code: "en", label: "English", href: "/en/schemes/pre-matric-scholarship" },
    { code: "hi", label: "हिन्दी", href: "/hi/schemes/pre-matric-scholarship" },
  ]}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-names">
            <h2 id="cdp-names" className="cdp__h2">The Group&rsquo;s Name Follows the Page</h2>
            <p>
              <code>label</code> and <code>currentLabel</code> are written in the language being
              read, not in the language they point at, because they name the control rather than
              any one option. A Hindi reader is told in Hindi which language they are on.
            </p>
          </section>
        </>
      }
    />
  );
}
