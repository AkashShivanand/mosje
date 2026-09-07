import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { CatalogueSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Catalogue Screen — Design System",
  description: "A browsable listing of documents or cards, filtered and paged.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "The whole title is the link, and the kind and size sit beside it rather than inside a second link called \"Download\".",
    status: "verified",
    evidence: "Each row renders one Link wrapping the title; kind is a sibling span, not a link.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The items are a real list, so a screen reader announces how many there are before the reader starts through them.",
    status: "verified",
    evidence: "Rendered as ul/li with list styling reset in the template's own stylesheet.",
  },
  {
    criterion: "3.2.5 Change on Request",
    level: "AAA",
    description:
      "An external link and a download are marked, so nothing opens or saves unannounced.",
    status: "partial",
    evidence: "The icon and Link's `external` handling mark both. Whether the caller sets those flags correctly is the caller's; the template cannot infer it from the href.",
  },
];

export default function CatalogueScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Catalogue Screen"
      status="Beta"
      summary={"Many records the reader browses rather than acts on. It pages, always — Pagination appears in exactly one of the estate's 265 portal pages."}
      figma={{
        absent:
          "Absent. Pagination, Breadcrumb and Search return zero hits across all 5,138 nodes of the handoff's E-Anudaan page, and no list or catalogue screen is drawn anywhere on it.",
      }}
      specimen={<CatalogueSpecimen />}
      propsFrom="CatalogueScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Scheme guidelines, circulars, forms, annual reports.",
          "Any set the reader opens or downloads rather than acts on.",
        ],
        avoid: [
          "Rows the reader does something to — that is Worklist Screen.",
          "A ranked result set from a query — that is Search Screen.",
          "Media with a lightbox — that is Gallery Screen.",
        ],
      }}
      related={[
        { label: "Worklist Screen", href: "/design-system/components/templates/worklist-screen", reason: "when the reader acts on rows" },
        { label: "Search Screen", href: "/design-system/components/templates/search-screen", reason: "when there is a ranking" },
        { label: "Pagination", href: "/design-system/components/navigation/pagination", reason: "the pager it always renders" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-kind">
            <h2 id="cdp-kind" className="cdp__h2">State the Kind, Taken From the Destination</h2>
            <p>
              &ldquo;PDF · 2.4 MB&rdquo;, not a guess from the title. A link labelled
              &ldquo;Guidelines&rdquo; that opens a 40 MB scan on a rural connection is the case
              this field exists to prevent, and the department publishes the type and the size.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-page">
            <h2 id="cdp-page" className="cdp__h2">Page It — Never Scroll It Inside a Card</h2>
            <p>
              A scheme&rsquo;s circulars run to hundreds. On a phone a reader flicking the page
              down inside a scroll region moves the list instead of the page, which is why the
              data-state rule bans it outright.
            </p>
            <Callout type="info" title="Prefer hrefForPage over onPageChange">
              A page number belongs in the URL: links are shareable, survive the back button, work
              before hydration and are followed by a crawler.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<CatalogueScreen
  eyebrow="E-ANUDAAN"
  title="Scheme Guidelines & Circulars"
  noun="document"
  items={page.items}
  registerTotal={page.total}
  page={page.number}
  totalPages={page.count}
  hrefForPage={(n) => \`?page=\${n}\`}
  activeFilterCount={countActive(filters)}
  onClearFilters={clear}
  loading={isLoading}
  error={error}
  onRetry={refetch}
/>`}</CodeBlock>
          <p>
            <code>activeFilterCount</code> takes the <em>real</em> predicate. A default-valued
            select is not a filter, and counting it turns every empty register into &ldquo;try
            clearing your filters&rdquo; — advice the reader cannot act on.
          </p>
        </section>
      }
    />
  );
}
