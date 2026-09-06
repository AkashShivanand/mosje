import type { Meta, StoryObj } from "@storybook/react";
import { OrgLogo, ORG_LOGOS, type OrgSlug } from "@mosje/design-system";

/**
 * **OrgLogo** — an organisation or scheme mark. The mark and nothing else: it
 * carried a `tile` boolean until 2026-09-06, on by default, which seventeen of
 * twenty-six call sites had to switch off. A ground now comes from the container,
 * via the single `.ds-org-tile` class — see the Tiled story below.
 *
 * **It is the only place a mark's path is written.** Before it existed the same
 * 16 files sat in two byte-identical public directories and `organisation-details.ts`
 * reached into three different roots for them, so a mark replaced in one place
 * stayed stale in the others. `npm run check:org-logos` now fails the build on a
 * mark path written anywhere else — a ratchet, because 99 literals across 49 files
 * are declared debt rather than something to sweep in one change.
 *
 * **Pass a `path` or an `org`, not a file.** `path` is what the registry hands
 * you and is the normal case; `org` is for a slug. `src` exists only for a mark
 * that is not in the registry yet, and every use of it is reported by the gate.
 *
 * **Leave `name` off.** A mark beside the organisation's name in real text is
 * decorative and takes an empty alt [WCAG H67]; passing a name makes a screen
 * reader read the organisation twice. Pass one only where the mark stands alone.
 *
 * **The fallback is the State Emblem, and it is correct rather than a placeholder.**
 * A portal with no bespoke mark is still a Government of India property. Never
 * substitute a grey box, an initial or a generic icon — which is exactly what the
 * `/portals` directory did, drawing a derived two-letter code in a coloured box
 * where the department has an actual crest.
 */
const meta = {
  title: "Brand/OrgLogo",
  component: OrgLogo,
  parameters: { layout: "centered" },
  args: { org: "nmba" as OrgSlug, size: "md" as const },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    org: { control: "select", options: Object.keys(ORG_LOGOS) },
  },
} satisfies Meta<typeof OrgLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 32 / 48 / 56 — inline beside a label, on a card, leading a directory row. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <OrgLogo org="scw" size="sm" />
      <OrgLogo org="scw" size="md" />
      <OrgLogo org="scw" size="lg" />
    </div>
  ),
};

/**
 * By ROUTE — what the estate registry actually gives you. `/portals/tg` and
 * `/portals/smile-admin` both wear the SMILE mark; a route with no entry gets the
 * State Emblem, which is the right answer rather than a broken image.
 */
export const ByRoute: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <OrgLogo path="/portals/pm-ajay" />
      <OrgLogo path="/portals/tg" />
      <OrgLogo path="/portals/smile-admin" />
      <OrgLogo path="/portals/e-anudaan" />
    </div>
  ),
};

/** Every mark the estate ships, in registry order. */
export const Catalogue: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 560 }}>
      {(Object.keys(ORG_LOGOS) as OrgSlug[]).map((slug) => (
        <div key={slug} style={{ display: "grid", gap: 6, justifyItems: "center", width: 96 }}>
          <OrgLogo org={slug} size="lg" />
          <code style={{ font: "500 11px/1.3 ui-monospace, monospace" }}>{slug}</code>
        </div>
      ))}
    </div>
  ),
};

/**
 * The fallback, standing alone — the one case that takes a `name`, because there
 * is no adjacent text for a screen reader to read instead.
 */
export const EmblemFallback: Story = {
  render: () => <OrgLogo size="lg" name="Government of India" />,
};

/**
 * A ground, where one is wanted, is the CONTAINER's.
 *
 * `.ds-org-tile` is the estate's one definition of it — white, hairline rule, 8px
 * radius. Compose it; do not re-derive it in a consumer's own stylesheet, which
 * is what four surfaces did (at three different radii) before any of this.
 */
export const Tiled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <span className="ds-org-tile">
        <OrgLogo path="/portals/scw" size="sm" />
      </span>
      <span className="ds-org-tile">
        <OrgLogo path="/portals/nmba" size="md" />
      </span>
      <span className="ds-org-tile">
        <OrgLogo path="/portals/e-anudaan" size="lg" />
      </span>
      <OrgLogo path="/portals/nmba" size="md" />
    </div>
  ),
};
