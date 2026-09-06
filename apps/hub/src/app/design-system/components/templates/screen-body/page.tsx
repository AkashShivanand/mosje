import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";
import { StatesSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Screen Body — Design System",
  description:
    "The state branch every screen template routes through: idle, loading, error, empty, filtered to nothing, and populated.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The loading region carries `role=\"status\"`, `aria-busy` and a label, so the wait is announced once. The skeleton beneath it is `aria-hidden` — forty empty boxes teach a screen-reader user nothing.",
    status: "verified",
    evidence: "Read from the component: the wrapper sets role/aria-busy/aria-label and ScreenSkeleton sets aria-hidden.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Every non-populated state renders an EmptyState with a heading, a description and, where there is one, an action — not a bare paragraph in a void.",
    status: "verified",
    evidence: "All five branches render EmptyState.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "The error state names what failed in one sentence and offers a retry. It never prints a status code, an endpoint or a stack trace on a citizen's page.",
    status: "verified",
    evidence: "The component reads only from the copy object; no error value reaches the DOM.",
  },
];

export default function ScreenBodyPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Screen Body"
      status="Beta"
      summary="The state branch. Every screen template routes its content through this, which is what makes the seven states structural rather than remembered."
      figma={{
        absent:
          "A behavioural primitive with no visual of its own — at `ready` it is a plain wrapper, and every other state renders an EmptyState, which is published.",
      }}
      specimen={<StatesSpecimen />}
      propsFrom="ScreenBodyProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A screen the eighteen templates do not cover: resolve the status once, then hand it here.",
          "A panel inside a screen that loads independently of the page around it.",
        ],
        avoid: [
          "Inside a template that already uses it — you would branch the same request twice.",
          "A chart card: ChartCard owns its own loading, empty, error and retry.",
          "As a way to hide content behind a boolean: this is a state machine, not a conditional.",
        ],
      }}
      related={[
        { label: "Empty State", href: "/design-system/components/feedback/empty-state", reason: "what five of the six branches render" },
        { label: "Skeleton", href: "/design-system/components/feedback/skeleton", reason: "the loading silhouette" },
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "owns these states for a chart" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-six">
            <h2 id="cdp-six" className="cdp__h2">Six Branches, Not Seven</h2>
            <MatrixTable
              caption="The states, and why each is not the next one"
              columns={["State", "What the reader sees", "Why it is separate"]}
              rows={[
                ["Idle", "The prompt to act", "Nothing has been asked yet"],
                ["Loading", "A skeleton in the shape of the result", "Asked; no answer yet"],
                ["Error", "One sentence, and Try again", "The request failed"],
                ["Empty", "The citizen's answer, in the register", "The register holds nothing"],
                ["Filtered", "Names the filter, and how to clear it", "The reader caused it and can undo it"],
                ["Populated", "The screen", "—"],
              ]}
            />
            <p>
              <strong>Partial</strong> is not a branch: a partly answered screen is{" "}
              <code>ready</code> and says so with a provenance chip. <strong>Too much</strong> is
              not a branch either — it is a constraint, and a template that can receive more rows
              than it can hold requires a pager rather than discovering at runtime that it needed
              one.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-hooks">
            <h2 id="cdp-hooks" className="cdp__h2">It Branches the Render, Never the Hooks</h2>
            <p>
              The usual reason the state rule gets broken is that an early return would sit above
              a <code>useMemo</code>. It does not have to: resolve the status, keep deriving
              unconditionally, and branch only the return.
            </p>
            <Callout type="warning" title="Never reach for mock data here">
              <code>?? mockData</code> in a fallback is the defect, not the fix. It is what made a
              key print <code>villages 0</code> above a map drawing 19,768 of them.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`const status = resolveScreenState({
  asked: query.length > 1,   // false ⇒ idle, not empty
  loading: isLoading,
  error,
  count: rows.length,
  filtered: activeFilters > 0,
});

// …every useMemo below runs unconditionally…

return (
  <ScreenBody
    status={status}
    skeleton="table"
    onRetry={refetch}
    onClearFilters={clear}
  >
    <TheThing rows={rows} />
  </ScreenBody>
);`}</CodeBlock>
          <p>
            Override the wording per portal with <code>screenCopy</code>, which merges your two or
            three sentences over the estate&rsquo;s ten rather than making you restate them.
          </p>
          <CodeBlock>{`copy={screenCopy({
  emptyTitle: "No Grants Sanctioned Yet",
  emptyDescription: "Sanctioned grants appear here once the committee has met.",
})}`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-copy">
          <h2 id="cdp-copy" className="cdp__h2">Every String Is a Prop, and That Is Deliberate</h2>
          <p>
            GIGW requires the estate to be bilingual. A sentence baked into a template cannot be
            translated, so all ten live in <code>ScreenStateCopy</code> and none in the markup.
          </p>
          <p>
            The filtered copy says &ldquo;your filters&rdquo; and the empty copy does not, because
            the reader set the filters and did not set the register.
          </p>
        </section>
      }
    />
  );
}
