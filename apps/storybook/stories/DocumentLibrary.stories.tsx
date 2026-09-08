import type { Meta, StoryObj } from "@storybook/react";
import { DocumentLibrary, type DocumentLibraryItem } from "@mosje/design-system";

const meta = {
  title: "Data Display/DocumentLibrary",
  component: DocumentLibrary,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "One shelf for everything a body publishes, filtered by chip.\n\n" +
          "It replaces the pattern of stacking a separate grid per document category. " +
          "On the PM-AJAY page that was four consecutive grids — Downloads (PM-AJAY), " +
          "Downloads (PMAGY), Circulars and Resources — rendering nineteen files through " +
          "the identical card. Those headings are the publisher's filing system, not a " +
          "question a reader arrives with, and one of them split the shelf by scheme era " +
          "without ever saying so. The categories are chips now: the grouping survives, " +
          "the scrolling does not.\n\n" +
          "**Two rules the props enforce.** `meta` is a date or an audience, never the " +
          "file type — a card whose meta reads “PDF” above a button reading “Download PDF” " +
          "has spent its best line restating its own button. And `title` is a title, not a " +
          "file name: “Presentation” tells a reader nothing, so the publisher's own name " +
          "goes in `officialName` and a plain one goes in `title`.\n\n" +
          "**`viewAllSlot`** takes the footer control as an ELEMENT, not a component. " +
          "This is a client component, and React Server Components refuse to pass a " +
          "*function* across the boundary — a server page handing over `next/link` itself " +
          "crashes the route with “Functions cannot be passed directly to Client " +
          "Components”. An element crosses fine, so the page keeps router-aware navigation " +
          "and the design system keeps its distance from any framework. The cards " +
          "themselves are plain anchors on purpose: every one resolves to a file or " +
          "another site, and client-side routing buys a PDF download nothing.",
      },
    },
  },
} satisfies Meta<typeof DocumentLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: DocumentLibraryItem[] = [
  {
    id: "g1",
    group: "Guidelines",
    meta: "The scheme's governing document",
    title: "PM-AJAY operational guidelines",
    officialName: "Guidelines of Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)",
    href: "#",
    actionLabel: "Download PDF",
  },
  {
    id: "c1",
    group: "Circulars",
    meta: "07 Aug 2026",
    title:
      "Tentative Notional Allocation for the States/UTs under the ‘Grants-in-aid for District/State level Projects for Socio-Economic betterment of SCs’ component under Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) for the year 2026-27. -reg",
    href: "#",
    actionLabel: "View document",
    external: true,
  },
  {
    id: "c2",
    group: "Circulars",
    meta: "13 Feb 2026",
    title: "Furnishing of expected expenditure up to 31.03.2026 against Mother Sanctions issued under PM-AJAY",
    href: "#",
    actionLabel: "View document",
    external: true,
  },
  {
    id: "f1",
    group: "Formats",
    meta: "For State and UT implementing agencies",
    title: "Utilization certificate format (GFR 12-C)",
    officialName: "Utilization Certificate",
    href: "#",
    actionLabel: "Download PDF",
  },
  {
    id: "p1",
    group: "Presentations",
    meta: "Presentation · 24 October 2019",
    title: "PMAGY scheme overview",
    officialName: "Presentation",
    href: "#",
    actionLabel: "Download PDF",
  },
  {
    id: "m1",
    group: "Manuals & guides",
    meta: "For district users of the Adarsh Gram MIS",
    title: "Adarsh Gram MIS — district user manual",
    officialName: "District User Manual",
    href: "#",
    actionLabel: "Download PDF",
  },
];

const ORDER = ["Guidelines", "Circulars", "Formats", "Presentations", "Manuals & guides", "Reports"];

export const Default: Story = {
  args: { items: ITEMS, groupOrder: ORDER, viewAllSlot: <a href="#">View all documents</a> },
};

/**
 * The second card carries a real forty-word circular name from the estate. Left
 * unclamped it grew to three times its neighbours' height and tore the row open,
 * so titles clamp to two lines — while staying whole for screen readers and for
 * in-page search, because the full string is still the element's text.
 */
export const LongOfficialTitles: Story = {
  args: {
    items: ITEMS.filter((i) => i.group === "Circulars"),
    groupOrder: ORDER,
    viewAllSlot: <a href="#">View all documents</a>,
  },
};

/**
 * With one real group there is nothing to choose between, so the chip row does
 * not render. Two chips that always agree are chrome pretending to be a control.
 */
export const SingleGroupHidesFilters: Story = {
  args: {
    items: ITEMS.filter((i) => i.group === "Formats"),
    groupOrder: ORDER,
    viewAllSlot: <a href="#">View all documents</a>,
  },
};

/**
 * `layout="rail"` puts the cards on ONE ROW THAT SCROLLS SIDEWAYS, with the next
 * card cut by the container's edge — and the cut is the affordance. Use it where
 * the shelf is one section among many and its height is competing with everything
 * below it: on the NMBA organisation page a four-file shelf in a three-column grid
 * was two rows with two thirds of the second one empty.
 *
 * **`railLabel` is not optional in practice.** The rail is a scrollable region, so
 * WCAG 2.1.1 requires it to be focusable — a region that scrolls and cannot be
 * focused cannot be scrolled by anyone using a keyboard, and axe reports it as
 * `scrollable-region-focusable`. That adds a tab stop, and an unnamed tab stop
 * lands the reader on an unlabelled box. Name it after the shelf.
 *
 * **When NOT to use it.** A rail costs the reader a gesture to reach the later
 * cards, so it is wrong for a shelf that IS the page — a document catalogue — and
 * wrong for a shelf of twenty, where the fifteenth file is unreachable in
 * practice. Reach for it only where a "View all" already publishes the whole list.
 */
export const Rail: Story = {
  args: {
    items: ITEMS.filter((i) => i.group !== "Circulars"),
    groupOrder: ORDER,
    layout: "rail",
    railLabel: "Guidelines and formats",
    viewAllSlot: <a href="#">View all documents</a>,
  },
};

/** Nothing published yet — the band says so rather than rendering an empty grid. */
export const Empty: Story = {
  args: { items: [], viewAllSlot: <a href="#">View all documents</a> },
};

/**
 * `noun` renames what the band counts, so the same component can shelve
 * publications, forms or reports without the count line reading "documents".
 */
export const CustomNoun: Story = {
  args: {
    items: ITEMS.filter((i) => i.group !== "Circulars"),
    groupOrder: ORDER,
    noun: "publications",
    viewAllSlot: <a href="#">View all publications</a>,
  },
};
