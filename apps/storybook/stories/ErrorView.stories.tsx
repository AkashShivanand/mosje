import type { Meta, StoryObj } from "@storybook/react";
import { ErrorView } from "@mosje/design-system";

/**
 * **ErrorView** — the full-page dead end. A citizen has asked for something the
 * estate cannot give them, and this is the page that says so and then gets them
 * moving again.
 *
 * It is deliberately not an `Alert` or an `EmptyState`. Those two sit *inside* a
 * working page and report on one region of it — a failed panel, a filter that
 * matched nothing — while the rest of the page still works. `ErrorView` is what
 * renders when there is no working page left: a `not-found.tsx` or an
 * `error.tsx` boundary, where the whole route failed.
 *
 * **The wayfinding cards are the point, not decoration.** A government 404 that
 * only apologises leaves the citizen to guess whether the scheme they wanted was
 * renamed, moved, or never existed. Thirteen legacy websites were consolidated
 * into this estate, so a dead URL here is usually a *moved* page rather than a
 * missing one, and the four default cards name the four places it most likely
 * moved to. Override `wayfindingLinks` where a surface has better answers than
 * the estate-wide defaults.
 *
 * `kind` picks a preset (`"404"`, `"500"`, `"403"`, `"maintenance"`), which sets
 * the badge, icon, headline and body. Every one of those is individually
 * overridable, so the preset is a starting point rather than a straitjacket.
 */
const meta = {
  title: "Components/Feedback/ErrorView",
  component: ErrorView,
  parameters: { layout: "fullscreen" },
  args: { kind: "404" },
  argTypes: {
    kind: { control: "inline-radio", options: ["404", "500", "403", "maintenance"] },
    badge: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    icon: { control: "text" },
    searchUrl: { control: "text" },
    errorDetails: { control: "text" },
  },
} satisfies Meta<typeof ErrorView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default. Every preset value in place, nothing overridden. */
export const Playground: Story = {};

/**
 * **The four presets.** They differ by more than wording: what the reader can
 * usefully *do* changes with the reason.
 *
 * `404` offers search, because the page probably moved and the citizen can find
 * it. `500` does not — searching cannot fix a server that failed, and offering
 * it implies the fault is theirs to route around. `403` states the restriction
 * plainly rather than hinting the content might appear on a retry. `maintenance`
 * is the only one that is not a fault at all, and reads as a scheduled event.
 */
export const Presets: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "3rem" }}>
      <ErrorView kind="404" />
      <ErrorView kind="500" searchUrl={null} />
      <ErrorView kind="403" searchUrl={null} />
      <ErrorView kind="maintenance" searchUrl={null} />
    </div>
  ),
};

/**
 * **How the website's own 404 is configured** — the preset, plus a search box
 * pointed at the site search and a single primary action home.
 *
 * The description names consolidation as a likely cause, because on this estate
 * it usually is, and a citizen who knows *why* a link died is far more likely to
 * try the search than one who is only told the page is gone.
 */
export const WebsiteNotFound: Story = {
  args: {
    kind: "404",
    badge: "404 · Page Not Found",
    title: "We Couldn't Find That Page",
    description:
      "The page or document you are looking for might have been removed, had its name changed, or is temporarily unavailable during the Ministry's digital consolidation.",
    searchUrl: "/website/search?q=",
    primaryAction: { label: "Return to Homepage", href: "/website", icon: "home" },
  },
};

/**
 * **A portal failure, with two actions and diagnostics.**
 *
 * `primaryAction` takes `onClick` as well as `href`, which is what lets an
 * `error.tsx` boundary wire "Try Again" straight to Next's `reset()` — a retry
 * that re-renders in place, rather than a link that reloads and loses state.
 *
 * `errorDetails` renders inside a collapsed `<details>`. **It is in the HTML
 * whether or not the reader opens it, and in every environment** — so pass it
 * only where the audience is staff, and never pass a raw stack on a
 * citizen-facing surface.
 */
export const PortalErrorWithDiagnostics: Story = {
  args: {
    kind: "500",
    badge: "500 · Portal Error",
    title: "Portal Session Error",
    description:
      "An unexpected error occurred while loading this portal workflow. Your transaction data has been preserved where possible.",
    searchUrl: null,
    primaryAction: { label: "Try Again", icon: "refresh" },
    secondaryAction: { label: "Back to Portals", href: "/portals", icon: "arrow_back" },
    errorDetails: "Error Digest: 3f9a21c8b\nMessage: Failed to resolve scheme registry for portal 'pm-ajay'",
  },
};

/**
 * **Replacing the wayfinding cards.** The estate-wide defaults point at schemes,
 * tenders, the officials directory and the portals hub. A surface with a
 * narrower audience should say something more useful: a citizen who hit a dead
 * end inside a scholarship journey is better served by scholarship destinations
 * than by a link to procurement tenders.
 */
export const CustomWayfinding: Story = {
  args: {
    kind: "404",
    searchUrl: null,
    wayfindingLinks: [
      {
        title: "National Overseas Scholarship",
        description: "Eligibility, award value and the current application window.",
        href: "/website/schemes-services/national-overseas-scholarship",
        icon: "school",
      },
      {
        title: "Pre-Matric Scholarship",
        description: "For children of families engaged in hazardous occupations.",
        href: "/website/schemes-services",
        icon: "menu_book",
      },
      {
        title: "Check an application",
        description: "Track a scholarship application you have already submitted.",
        href: "/portals",
        icon: "fact_check",
      },
    ],
  },
};

/**
 * **Without search.** `searchUrl={null}` removes the field entirely rather than
 * rendering a disabled one. A search box that cannot help is worse than no box:
 * it costs the reader an attempt before they learn it was never going to work.
 */
export const WithoutSearch: Story = {
  args: { kind: "403", searchUrl: null },
};
