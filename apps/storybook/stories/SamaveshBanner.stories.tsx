import type { Meta, StoryObj } from "@storybook/react";
import { SamaveshBanner, DEFAULT_SAMAVESH_PORTALS } from "@mosje/design-system";

/**
 * **SamaveshBanner** — the canonical top banner and portal exploration drawer for SAMAVESH.
 *
 * Implements Figma node `7116:33784` & `7298:29968`.
 *
 * Features:
 * - **Identity Header Bar**: India Saffron (`--sa-color-brand-saffron`) ground with the official circular SAMAVESH emblem badge, headline, and subline. The text on this band is INK, not white — see the contrast note below.
 * - **Interactive Accordion Drawer**: Clicking "Explore" expands a curated portal discovery panel with accessible ARIA states and keyboard control (Escape to close).
 * - **Responsive Portal Cards**: Clean responsive grid showing prominent citizen portals (SCW, SMILE - Transgender, NOS, NMBA) with direct links.
 * - **Token-driven**: every colour, size and space resolves through a semantic token.
 *
 * ### Contrast — the one place this diverges from the Figma reference
 *
 * The reference puts WHITE text on India Saffron. That measures **2.91:1**, which
 * fails WCAG 2.2 AA for the subline (needs 4.5:1) and fails it for the title too
 * (large text still needs 3:1). The band colour is unchanged and the ink moved
 * instead: `--sa-color-text-default` on the same saffron is **5.56:1**.
 *
 * | Pair | Ratio | Needs |
 * |---|---|---|
 * | Band title + subline — ink on saffron | 5.56:1 | 4.5:1 |
 * | Explore button — white on India Green | 6.72:1 | 4.5:1 |
 * | Drawer heading — deep green on peach | 12.9:1 | 4.5:1 |
 * | Card border — saffronDark on peach | 6.02:1 | 3:1 |
 *
 * Figma still carries the white-on-saffron version and needs the same change.
 *
 * ### The filter, and `allLabel`
 *
 * Category chips render only when the portals on show span MORE than one
 * category — one chip beside "All" is two controls with a single outcome. The
 * unfiltered chip reads "All" by default; `allLabel` changes that word, which is
 * what a Hindi rendering of the banner needs and nothing else does.
 *
 * ### Controlled vs uncontrolled
 *
 * The drawer manages its own state from `defaultOpen`, which is what every story
 * below uses and what a page should use. Reach for the controlled pair —
 * `isOpen` plus `onToggle` — only when something OUTSIDE the banner has to open
 * or close it (a "browse portals" link elsewhere on the page, or an analytics
 * hook that needs the toggle event). Passing `isOpen` without `onToggle` freezes
 * the drawer: the button still reports `aria-expanded`, but nothing can change
 * it. `onToggle` alone is fine, and is the right way to observe without taking
 * ownership.
 */
const meta = {
  title: "Navigation/SamaveshBanner",
  component: SamaveshBanner,
  parameters: { layout: "fullscreen" },
  args: {
    title: "SAMAVESH",
    subline: "Single Access Mechanism for All Verticals of Empowerment & Social Harmony",
    exploreLabel: "Explore",
    drawerTitle: "Choose a portal to visit",
    /*
     * The component's OWN defaults, restated here only so the Storybook controls
     * show something. They were `/website/samavesh-citizen-portals` and "View all
     * citizen portals" — the retired route and the retired label — so every story
     * demonstrated a link that no longer exists, under a caption that no longer
     * describes it. If these two lines drift from the component again, the stories
     * are lying and nothing will say so.
     */
    viewAllHref: "/portals",
    viewAllLabel: "Find your portal",
    viewAllPrompt: "Are you an officer or administrator?",
    logoSrc: "/design-system/samavesh-logo-156.png",
    portals: DEFAULT_SAMAVESH_PORTALS,
    /*
     * `sticky` DEFAULTS TO TRUE on the real thing, and every story here turns it
     * off. On a page the band is masthead chrome: it pins directly under
     * `SiteHeader`, reads that header's live `--sa-header-stuck` offset so it
     * stays flush as the masthead condenses, and shrinks with it. None of that
     * has anything to hold on to in a Storybook canvas, where there is no
     * masthead — a pinned band would simply park itself at y=0 over the story,
     * and `AllTones` would stack three of them at the same offset. Set
     * `sticky={false}` for any inline specimen, exactly as SiteHeader's own
     * documentation previews do.
     */
    sticky: false,
  },
} satisfies Meta<typeof SamaveshBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default collapsed state with Explore CTA. */
export const Default: Story = {
  args: {
    defaultOpen: false,
  },
};

/**
 * Nothing to list.
 *
 * It CAN happen, which is why `emptyLabel` exists: the portal list is DERIVED
 * from the estate registry, so a registry with nothing marked live — a fresh
 * environment, a failed read, a category filter matching nothing — leaves it
 * empty. Rendering the heading above an empty list reads as a broken page.
 * The footer link stays, because it is the route that still works.
 */
export const Empty: Story = {
  args: { defaultOpen: true, portals: [] },
};

/** Pre-expanded state showing the portal discovery drawer. */
export const Expanded: Story = {
  args: {
    defaultOpen: true,
  },
};

/**
 * **The filter row, which you will NOT see on the live site yet.**
 *
 * The chips render only when the portals on show span more than one category —
 * one chip beside "All" is two controls with a single outcome. Every portal live
 * today is a scheme portal, so the real banner renders no filter at all. This
 * story passes a mixed set so the control can be seen and reviewed; it appears
 * on the site by itself the day a commission or corporation goes live.
 */
export const WithCategoryFilter: Story = {
  args: {
    defaultOpen: true,
    portals: [
      {
        id: "scw",
        shortName: "SCW",
        name: "Senior Citizens Welfare",
        href: "/portals/scw",
        category: "Scheme Portals",
      },
      {
        id: "nmba",
        shortName: "NMBA",
        name: "Nasha Mukt Bharat Abhiyaan",
        href: "/portals/nmba",
        category: "Scheme Portals",
      },
      {
        id: "ncsc",
        shortName: "NCSC",
        name: "National Commission for Scheduled Castes",
        href: "/portals/ncsc",
        category: "Commission",
      },
      {
        id: "nsfdc",
        shortName: "NSFDC",
        name: "National Scheduled Castes Finance & Development Corporation",
        href: "/portals/nsfdc",
        category: "Corporations",
      },
    ],
  },
};

/**
 * One category, so no filter — the state the live site is actually in.
 * Deliberately kept beside the story above: the pair is what makes the rule
 * legible, and a reviewer seeing only the filtered version would report the
 * missing chips on the real site as a defect.
 */
export const SingleCategoryNoFilter: Story = {
  args: {
    defaultOpen: true,
    portals: DEFAULT_SAMAVESH_PORTALS,
  },
};

/* ────────────────────────────────────────────────────────────────────────────
   BAND TONES
   The three are shipped together because the question has no single answer.
   Full evidence: the header of samavesh-banner.css, the component's docs page,
   and entry 8 in docs/guidelines/README.md.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * **`tone="light"` — the default, and it FAILS WCAG 2 on purpose.**
 *
 * White on India Saffron: **2.91:1**, below both the 4.5:1 body and 3:1 large
 * thresholds. It ships as the default because it matches the Figma reference and
 * because it is the best PERCEPTUAL option on this ground — APCA scores it Lc
 * 59.8, ahead of near-black (48.9) and the brand green (43.9).
 *
 * Why the two disagree: WCAG 2 measures luminance only, and the
 * Helmholtz–Kohlrausch effect makes saturated colours read far brighter than
 * their luminance. This is a named field problem — "the orange button problem".
 * User testing agrees with APCA: 61% of ~20 colour-blind participants preferred
 * white, 71% among protanopia — though the monochrome participant preferred
 * black, which is exactly why alternatives ship.
 *
 * **This is a recorded non-conformance, not a conformance argument.** APCA was
 * removed from WCAG 3 in 2023 and WCAG 2.1/2.2 AA is still the enforceable
 * standard that GIGW binds this estate to. If an audit challenges it, switch to
 * `tone="tint"` — one word, no redesign.
 */
export const ToneLight: Story = { args: { defaultOpen: false, tone: "light" } };

/**
 * **`tone="dark"` — the compliant choice on the saffron band.**
 *
 * Near-black `--sa-text-neutral-bolder` on the same unchanged saffron: **6.50:1**
 * (passes WCAG 2 at both sizes) and APCA Lc 48.9 (clears the headline floor, not
 * the body one).
 *
 * Note what this is NOT: the deep brand green. Green measures 4.85:1 and Lc 43.9
 * — it passes WCAG but sits *below* APCA's 45 floor, making it the worst of the
 * credible dark inks despite looking the most on-brand. Do not substitute it.
 */
export const ToneDark: Story = { args: { defaultOpen: false, tone: "dark" } };

/**
 * **`tone="tint"` — the only tone that clears both standards for body text.**
 *
 * Near-black on pale saffron, with India Saffron kept as a top rule and a ring
 * around the badge: **17.29:1** and APCA **Lc 99.1**.
 *
 * The saffron is not weakened — it stops being asked to carry text and becomes
 * the accent instead, which is the only configuration where the 14px subline is
 * comfortably readable. Recommended where compliance is being audited.
 */
export const ToneTint: Story = { args: { defaultOpen: false, tone: "tint" } };

/** All three together, for comparison. */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["light", "dark", "tint"] as const).map((t) => (
        <div key={t}>
          <p style={{ font: "600 13px/1.4 system-ui", margin: "0 0 6px" }}>
            tone=&quot;{t}&quot;
            {t === "light" && " — default · 2.91:1 fails WCAG 2 · APCA 59.8"}
            {t === "dark" && " — 6.50:1 passes WCAG 2 · APCA 48.9"}
            {t === "tint" && " — 17.29:1 · APCA 99.1 · passes both"}
          </p>
          <SamaveshBanner tone={t} sticky={false} />
        </div>
      ))}
    </div>
  ),
};
