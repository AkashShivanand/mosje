import type { Meta, StoryObj } from "@storybook/react";
import { BRAND_GLYPHS, BrandGlyph, brandGlyphTitle } from "@mosje/design-system";

/**
 * **BrandGlyph** — a third-party brand mark (Facebook, X, Instagram, YouTube,
 * WhatsApp), optically normalised against its siblings.
 *
 * This is the one deliberate exception to "there is exactly one icon system".
 * Material Symbols cannot supply a company's logo, and a logo may not be
 * redrawn to match a stroke weight — so brand marks arrive as the vendors'
 * own artwork and are placed, never altered.
 *
 * **What this component adds is the part no vendor supplies: one optical
 * size.** Five companies draw their marks to five containment rules, and
 * dropping them in a row at 24px does not make them a set. Measured on the
 * artwork this estate was shipping: optical heights ran 16.9 → 24, and ink
 * coverage 31.5% → 62.4% — a 2× spread in visual weight. Facebook was the worst
 * case, supplied as its app *badge* (the "f" already inside a filled disc)
 * while the other four were bare: a solid blob beside four open marks is a
 * different kind of object, and no amount of scaling fixes it.
 *
 * **Sizing alone was not enough, and that is the interesting part.** Normalising
 * brought the ink spread to 1.52× and the rail still looked unbalanced, because
 * the objection was never to the measurement — a letterform, a bare X, a hollow
 * camera, a filled slab and a bubble are five different *silhouettes*. Give them
 * one repeating circle and the circle becomes the unit the eye reads. Both rails
 * in the estate do this, which is why `InAChip` below is the story that matters.
 *
 * **The tuning belongs to the containment.** Before the chip, the corrections
 * pulled hard toward equal ink (YouTube to 0.86); inside a chip the frame is
 * constant, so the eye reads extent instead and that correction left YouTube
 * looking undersized. The shipped values are light — YouTube 0.94, Instagram
 * 0.98, the rest 1.0 — and marks fill 47–50% of the chip. The full derivation
 * is in the header of
 * `packages/design-system/components/icon/brand-glyph.tsx`.
 *
 * **Colour is always `currentColor`** — set it on the parent. Brand colours
 * belong to the brands, so they are not tokens and a coloured treatment names
 * its own value at the call site.
 *
 * **Accessibility:** decorative by default, like `Icon`. The accessible name
 * belongs on the link or button that wraps the mark, so an unlabelled glyph is
 * `aria-hidden`. Pass `aria-label` only when the mark stands alone.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/BrandGlyph",
  component: BrandGlyph,
  args: { name: "facebook", size: 24 },
  argTypes: {
    name: { control: "select", options: BRAND_GLYPHS },
    size: {
      control: "select",
      options: [16, 20, 24, 32, 40, 48, 64],
      description: "On the DBIM 3.7 icon scale.",
    },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof BrandGlyph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * The whole set, bare, at the size the footer rail uses — the shape the marks
 * take before a container is put round them. Compare with `InAChip`.
 */
export const TheSet: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {BRAND_GLYPHS.map((name) => (
        <span
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
          }}
        >
          <BrandGlyph name={name} />
        </span>
      ))}
    </div>
  ),
};

/**
 * **How the estate actually draws these marks, and the story to judge tuning by.**
 * One repeating chip, the mark at ~50% of it. Sizing got the set most of the way;
 * the chip is what makes five different silhouettes read as one row.
 */
export const InAChip: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 4, alignItems: "center", background: "#003975", padding: 24 }}>
      {BRAND_GLYPHS.map((name) => (
        <span
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "color-mix(in srgb, #C0DBFF 12%, #003975)",
            color: "#C0DBFF",
          }}
        >
          <BrandGlyph name={name} />
        </span>
      ))}
    </div>
  ),
};

/**
 * The set at 4×, chipped, which is how the tuning was judged. Every mark should
 * *feel* like it occupies the same amount of space, not measure the same.
 */
export const OpticalSizing: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#003975", padding: 24 }}>
      {BRAND_GLYPHS.map((name) => (
        <span
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 160,
            height: 160,
            borderRadius: 999,
            background: "color-mix(in srgb, #C0DBFF 12%, #003975)",
            color: "#C0DBFF",
          }}
        >
          <BrandGlyph name={name} size={96} />
        </span>
      ))}
    </div>
  ),
};

/** Every step of the DBIM 3.7 scale, so a mark can be checked where it is used. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {[16, 20, 24, 32, 40, 48, 64].map((size) => (
        <BrandGlyph key={size} name="whatsapp" size={size} />
      ))}
    </div>
  ),
};

/**
 * The shipping pattern: the link carries the accessible name, the mark is
 * silent. Inspect these with a screen reader and each announces once.
 */
export const InALink: Story = {
  render: () => (
    <nav aria-label="Social media">
      <ul style={{ display: "flex", gap: 4, listStyle: "none", margin: 0, padding: 0 }}>
        {BRAND_GLYPHS.map((name) => (
          <li key={name}>
            <a
              href="https://www.india.gov.in/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "var(--sa-shape-full)",
                color: "inherit",
              }}
            >
              <BrandGlyph name={name} />
              <span className="sr-only">{brandGlyphTitle(name)} (opens in a new window)</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  ),
};
