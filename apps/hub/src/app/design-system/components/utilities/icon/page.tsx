import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { Icon } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Icon — Design System",
  description:
    "A Material Symbols Rounded glyph — the estate's only icon system. Decorative by default, announced only when it is given a label.",
};

/*
 * Read off `IconProps` in packages/design-system/components/utilities/icon.tsx.
 * `size` is typed `number` rather than a union, because the glyph's optical-size axis
 * tracks it continuously; the scale below is the set of values the estate uses.
 */
const PROPS: PropDef[] = [
  {
    name: "name",
    type: "string",
    required: true,
    description:
      "The Material Symbols ligature, in snake_case — \"home\", \"arrow_forward\", \"account_circle\". The full catalogue is at fonts.google.com/icons. A name the font does not carry renders as the literal word, which is how a typo is spotted.",
  },
  {
    name: "size",
    type: "number",
    default: "24",
    description:
      "Pixel size. It sets the font size and the `opsz` variation axis together, so the glyph is redrawn for the size rather than scaled to it. The estate's scale is 16 · 20 · 24 · 32 · 40 · 48 · 64.",
  },
  {
    name: "fill",
    type: "boolean",
    default: "false",
    description: "The `FILL` axis. False is the stroke variant, which is the SAMAVESH default; true is the solid one.",
  },
  {
    name: "weight",
    type: "100 | 200 | 300 | 400 | 500 | 600 | 700",
    default: "300",
    description:
      "The `wght` axis. 300 is the MoSJE standard and is correct for interface chrome; 400 is for a standalone decorative glyph that needs to hold its own beside heavier type.",
  },
  {
    name: "aria-label",
    type: "string",
    default: "undefined",
    description:
      "Give it only when the glyph itself carries the meaning and no adjacent text says the same thing. Setting it makes the icon `role=\"img\"` and it is announced. On an icon-only button, the label belongs on the button, not here.",
  },
  {
    name: "aria-hidden",
    type: 'boolean | "true" | "false"',
    default: "true unless aria-label is set",
    description:
      "Rarely needed. The component decides: labelled icons are exposed, unlabelled ones are hidden. Pass `false` explicitly only for the rare glyph that must be in the accessibility tree without a label of its own.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Appended to `material-symbols-rounded`; the font class is never replaced.",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    default: "undefined",
    description:
      "Merged after the glyph's own rules, for placement — display, margin, opacity. Never re-set the font size here; pass `size`, or the optical-size axis stops tracking and the glyph is drawn for the wrong size.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "A Material Symbols glyph is real text, so an unmarked icon is read aloud as the stray word \"arrow back\". The component hides every unlabelled icon from assistive technology by default, and exposes a labelled one as `role=\"img\"`.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "A labelled icon is announced as an image with that name. An icon-only control takes its name from the control, not from the glyph, so the name is announced once rather than twice.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "The glyph is text and is sized in px by this component, so it does not follow the reader's font-size choice. Where an icon must scale with its label, size the icon from the surrounding type in CSS instead of passing a fixed number.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "An icon that conveys meaning must clear 3:1 against its background. The glyph inherits `currentColor`, so this is a property of where it is placed rather than of the component.",
  },
];

export default function IconPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Icon"
      status="Stable"
      summary="A Material Symbols Rounded glyph — the SAMAVESH icon system, and the only one. It is decorative by default and announced only when it is given a label, because an unmarked glyph is read aloud as the stray word its ligature spells."
      figma={{ node: "iconography" }}
      specimen={
        <div>
          <p>
            <Icon name="home" size={16} /> <Icon name="home" size={20} /> <Icon name="home" size={24} />{" "}
            <Icon name="home" size={32} /> <Icon name="home" size={40} /> <Icon name="home" size={48} />{" "}
            <Icon name="home" size={64} />
          </p>
          <p>
            <Icon name="account_circle" size={32} /> <Icon name="account_circle" size={32} fill />{" "}
            <Icon name="account_circle" size={32} weight={400} /> <Icon name="account_circle" size={32} fill weight={400} />
          </p>
          <p>
            <Icon name="search" size={24} /> <Icon name="download" size={24} /> <Icon name="arrow_forward" size={24} />{" "}
            <Icon name="check_circle" size={24} /> <Icon name="warning" size={24} /> <Icon name="close" size={24} />
          </p>
        </div>
      }
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A control needs a glyph beside its label, or an icon-only button needs its mark.",
          "A status, a category or a direction is shown alongside the words that name it.",
          "A list, a table or a card carries a small repeated mark that helps a reader scan.",
        ],
        avoid: [
          "The mark is an organisation's crest or a scheme's device — use Org Logo, which owns every mark's path and its tile.",
          "The mark is a brand or social logo — those are inline SVGs, not font glyphs.",
          "An emoji would do — it would not: an emoji renders differently on every platform, carries its own colour, and is read aloud by name.",
        ],
      }}
      related={[
        { label: "Org Logo", href: "/design-system/components/brand/org-logo", reason: "for an organisation or scheme mark, which is a brand asset rather than an icon" },
        { label: "Button", href: "/design-system/components/actions/button", reason: "takes a glyph through iconLeft and iconRight, already marked decorative" },
        { label: "Badge", href: "/design-system/components/feedback/badge", reason: "for a status that needs a word beside its mark" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-axes">
            <h2 id="cdp-axes" className="cdp__h2">
              One Font, Four Axes
            </h2>
            <p>
              Material Symbols Rounded is a single variable font, so stroke and fill, and every
              weight between 100 and 700, are the same file. Switching between them at runtime
              costs no additional network request &mdash; which is why the component exposes the
              axes as props rather than shipping a second icon set.
            </p>
            <p>
              The SAMAVESH default is <strong>weight 300, stroke, size 24</strong>. Use it for
              interface chrome. Weight 400 is for a standalone glyph that has to hold its own
              beside heavier type; the filled variant is for a selected or active state, where the
              change from stroke to fill is the signal.
            </p>
            <Callout type="info" title="The scale is seven values, and 16 is not a mistake">
              16 · 20 · 24 · 32 · 40 · 48 · 64, bound as <code>--sa-icon-size-*</code>. DBIM 3.0
              §3.4 publishes four of them &mdash; 24, 32, 48, 64 &mdash; as an asset bank; the three
              smaller steps are the estate&rsquo;s addition, because 16px is the correct size beside
              14px body text and forcing 24px would visibly enlarge the glyph in every dense table,
              button and form row.
            </Callout>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-load">
            <h2 id="cdp-load" className="cdp__h2">
              Load the Font Once
            </h2>
            <p>
              The component renders a ligature and nothing else, so without the font it renders the
              word. Import the stylesheet once per app, in the root layout:
            </p>
            <CodeBlock>{`import "@mosje/design-system/icons.css";`}</CodeBlock>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Icon } from "@mosje/design-system";

// Default — 24px, weight 300, stroke, and already hidden from assistive tech.
<Icon name="home" />

// Filled, at the next size up.
<Icon name="notifications" size={20} fill />

// Icon-only control: the LABEL BELONGS ON THE BUTTON, not on the glyph.
<button aria-label="Search"><Icon name="search" size={20} /></button>

// A standalone meaningful glyph, with no control to carry the name.
<Icon name="verified" aria-label="Verified" />`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-decision">
          <h2 id="cdp-decision" className="cdp__h2">
            Labelled or Hidden — There Is No Third Option
          </h2>
          <p>
            The Iconography documentation has always said every icon is either hidden from
            assistive technology or given a label. As an unenforced convention it was missed at 533
            of 718 call sites across the estate, which is what a convention relying on 533 separate
            acts of memory converges to. So the component decides instead of the caller:
          </p>
          <ul>
            <li>
              <code>aria-label</code> given &mdash; the icon is meaningful. It is exposed as{" "}
              <code>role=&quot;img&quot;</code> and announced.
            </li>
            <li>otherwise &mdash; decorative, and hidden.</li>
          </ul>
          <p>
            The one case that still needs care is the icon-only control. Put the name on the{" "}
            <code>&lt;button&gt;</code>, not on the glyph: labelling both makes a screen reader read
            &ldquo;Search, Search&rdquo;.
          </p>
          <p>
            The full icon inventory, its bespoke marks and the emblems live on the{" "}
            <a href={figmaUrl(FIGMA_NODES.iconography)} target="_blank" rel="noopener noreferrer">
              Iconography page in Figma
            </a>
            .
          </p>
        </section>
      }
    />
  );
}
