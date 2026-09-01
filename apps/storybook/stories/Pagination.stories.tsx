import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "@mosje/design-system";

/**
 * **Pagination** — page navigation for a result set.
 *
 * **Prefer the link form.** Pass `hrefFor` and every page number renders as a real
 * `<a>`. That is what makes page 3 shareable, bookmarkable and reachable with the
 * back button, and it works before hydration and for a crawler. Reach for
 * `onPageChange` only when the pages belong to client-side state that has no URL
 * of its own — and when they *could* have one, they should.
 *
 * `DataTable` already paginates its own state and does not use this. Use this for
 * anything whose result set comes out of the URL: search results, a filtered
 * document listing, a directory.
 *
 * `siblings` (default 2) sets how many numbers sit either side of the current
 * page; first and last are always shown, so the ends of a long set stay one click
 * away. `label` names the surrounding `<nav>` — make it specific when a page has
 * more than one pager. `totalPages` below 2 renders nothing, so a single-page
 * result set needs no guard at the call site.
 *
 * **Accessibility.** The current page carries `aria-current="page"` and is not a
 * link — there is nowhere to go. Numbers are labelled "Page 4" rather than
 * announced as a bare digit. Previous and Next are *removed* at the ends rather
 * than disabled, because a disabled control still in the tab order is worse than
 * one that is not there. Targets are 40px, clearing WCAG 2.2 AA §2.5.8 (24×24).
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  args: {
    page: 4,
    totalPages: 12,
    siblings: 2,
    label: "Search results",
  },
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    siblings: { control: { type: "number", min: 0, max: 4 } },
    label: { control: "text" },
    className: { control: false },
    hrefFor: { control: false },
    onPageChange: { control: false },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default and preferred shape — real links, page number in the URL. */
export const Playground: Story = {
  args: {
    hrefFor: (n: number) => `?page=${n}`,
  },
};

/** Few enough pages that every number is shown and no ellipsis appears. */
export const ShortSet: Story = {
  args: { page: 2, totalPages: 5, hrefFor: (n: number) => `?page=${n}` },
};

/** Both ellipses, with first and last still one click away. */
export const LongSet: Story = {
  args: { page: 48, totalPages: 96, hrefFor: (n: number) => `?page=${n}` },
};

/** No Previous at the first page, no Next at the last — removed, not disabled. */
export const AtTheEnds: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <Pagination {...args} page={1} hrefFor={(n) => `?page=${n}`} />
      <Pagination {...args} page={12} hrefFor={(n) => `?page=${n}`} />
    </div>
  ),
};

/**
 * The button form, for client-side state with no URL. Note what it costs: this
 * pager's position cannot be shared or restored, which is why it is the exception.
 */
export const ClientState: Story = {
  render: function Render(args) {
    const [page, setPage] = React.useState(3);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0, color: "var(--sa-text-neutral-subtle)" }}>
          Showing beneficiaries {(page - 1) * 20 + 1}–{page * 20} of 240
        </p>
        <Pagination {...args} page={page} totalPages={12} onPageChange={setPage} />
      </div>
    );
  },
};

/**
 * **`size="sm"` — a pager inside a card, not at the foot of a page.**
 *
 * `md` is sized for a page-level pager with the full width to sit in. Put the
 * same control in a narrow panel and it wraps: PM-AJAY's coverage rail is
 * 19rem, and `md` with word-labelled steps asked for 267px of it.
 *
 * `sm` is 32px — still past the 24x24 minimum target (WCAG 2.2 SC 2.5.8) — and
 * drops the step labels to icons at EVERY width, not only below 480px. A card
 * pager sits directly beside the list it pages, so a chevron has a visible
 * referent that a pager at the foot of a long document does not. The words stay
 * in the accessibility tree, so a screen reader still hears "Previous", never
 * "chevron left".
 */
export const InsideACard: Story = {
  render: function Render() {
    const [page, setPage] = React.useState(2);
    const states = [
      "Andhra Pradesh",
      "Bihar",
      "Chhattisgarh",
      "Gujarat",
      "Haryana",
      "Karnataka",
      "Madhya Pradesh",
    ];
    return (
      <div
        style={{
          width: 304,
          display: "flex",
          flexDirection: "column",
          gap: "var(--sa-stack-12)",
          padding: "var(--sa-padding-16)",
          border: "1px solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-12)",
          background: "var(--sa-bg-neutral-base)",
        }}
      >
        <p style={{ margin: 0, color: "var(--sa-text-neutral-subtle)" }}>
          States and UTs reached &mdash; page {page} of 6
        </p>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {states.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ol>
        <Pagination
          page={page}
          totalPages={6}
          onPageChange={setPage}
          size="sm"
          siblings={0}
          label="States"
        />
      </div>
    );
  },
};
