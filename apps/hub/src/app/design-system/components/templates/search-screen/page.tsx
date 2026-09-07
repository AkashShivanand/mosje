import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { SearchSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Search Screen — Design System",
  description: "A query field, facets and ranked results — with a distinct idle state before the first search.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.6 Identify Purpose",
    level: "AAA",
    description:
      "The query sits in a form with role=\"search\", so assistive technology can jump straight to it.",
    status: "verified",
    evidence: "The query form carries role=\"search\" and wraps the Search control.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The result count is a polite live region, because on a client-side search the results change with no navigation and nothing else signals it.",
    status: "verified",
    evidence: "The count paragraph carries aria-live=\"polite\" and names the query it counted.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      "The field is named for what is being searched, not just \"Search\".",
    status: "verified",
    evidence: "searchLabel is forwarded as the control's aria-label and the docs example names the register.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The facet column is an aside with its own accessible name, so it is skippable.",
    status: "verified",
    evidence: "Rendered as aside[aria-label=\"Narrow these results\"] when facets are passed.",
  },
];

export default function SearchScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Search Screen"
      status="Beta"
      summary={"Many records, ranked by a query the reader typed. Idle renders differently from empty, which is the whole reason this is not a catalogue."}
      figma={{
        absent:
          "Absent. Any layer named \"search\" returns zero hits across all 5,138 nodes of the handoff's E-Anudaan page.",
      }}
      specimen={<SearchSpecimen />}
      propsFrom="SearchScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A register the reader queries by name, number or free text.",
          "Anything where results are ranked by relevance rather than ordered by the department.",
        ],
        avoid: [
          "A set defined by filters over a known register — that is Worklist Screen.",
          "An ordered listing with no ranking — that is Catalogue Screen.",
        ],
      }}
      related={[
        { label: "Search", href: "/design-system/components/forms/search", reason: "the query control" },
        { label: "Catalogue Screen", href: "/design-system/components/templates/catalogue-screen", reason: "when there is no ranking" },
        { label: "Screen Body", href: "/design-system/components/templates/screen-body", reason: "where idle and empty diverge" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-idle">
            <h2 id="cdp-idle" className="cdp__h2">Idle Is Not Empty</h2>
            <p>
              &ldquo;Not asked yet&rdquo; and &ldquo;asked, nothing there&rdquo; are different
              sentences with different remedies. Rendering them the same way is what makes a
              search field look broken before it has been used.
            </p>
            <p>
              <code>asked</code> defaults to whether the query is non-empty, so an untouched field
              shows the prompt rather than &ldquo;No records found&rdquo;. A search that runs a
              default query on arrival passes <code>asked</code> itself.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-rank">
            <h2 id="cdp-rank" className="cdp__h2">The Template Does Not Sort</h2>
            <p>
              Ranking is the caller&rsquo;s claim — it is the thing that distinguishes a search
              from a catalogue — so the results are rendered in the order they arrive. A template
              that reordered them would be overruling the relevance model.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<SearchScreen
  title="Search Applications"
  searchLabel="Search applications by project, reference number or organisation"
  query={q}
  onQueryChange={(next) => router.replace(next ? \`?q=\${next}\` : "?")}
  shownCount={results.length}
  resultCount={total}
  page={page}
  totalPages={pages}
  hrefForPage={(n) => \`?q=\${q}&page=\${n}\`}
  loading={isSearching}
  error={error}
  onRetry={retry}
>
  {results.map((r) => <ResultRow key={r.id} result={r} />)}
</SearchScreen>`}</CodeBlock>
          <p>
            Drive the query from the URL. A result set nobody can send anyone is a result set that
            gets screenshotted instead.
          </p>
        </section>
      }
    />
  );
}
