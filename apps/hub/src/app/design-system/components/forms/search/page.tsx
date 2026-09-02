import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { SearchPlayground } from "./search-playground";

export const metadata: Metadata = {
  title: "Search — Design System",
  description:
    "A search field with a leading icon, an optional clear control, an optional submit handler and an optional autocomplete listbox, in three sizes.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The field always has a name: `aria-label` where one is passed, otherwise the placeholder, otherwise \"Search\". Suggestion rows are grouped under headings where a group is supplied.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Arrow keys move the highlight, Enter chooses the highlighted row or submits, Escape hides the list without clearing the text. Every control is reachable by Tab.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "Focus is drawn on the field, on the leading submit button and on the clear button separately.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description: "All three sizes clear 24×24, and the clear and submit controls are sized with the field.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "With suggestions the field carries `role=\"combobox\"`, `aria-expanded`, `aria-controls`, `aria-autocomplete` and `aria-activedescendant`. Without them it carries none of these, so a plain filter field never announces itself as a combobox with no options.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "A polite live region announces how many suggestions are available, and is emptied when the list closes so a stale count is never re-announced.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The input carries `dir=\"auto\"` rather than inheriting direction, so an English placeholder inside an Urdu page clips at the tail rather than at the head.",
  },
];

export default function SearchPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Search"
      status="Stable"
      summary="A search field with a leading icon, an optional clear control and an optional submit handler. Passing a suggestion list turns it into a combobox with a listbox, arrow-key navigation and a live count; passing none leaves it a plain field with no combobox semantics at all."
      figma={{ node: "search" }}
      specimen={<SearchPlayground />}
      propsFrom="SearchProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A reader filters a table, a list or a document library in place.",
          "A masthead hands a query to a results page, which is a submit rather than a filter.",
          "A long list needs typing to narrow it, and the owner can supply matching rows.",
        ],
        avoid: [
          "The field collects an answer the department will store — use Input inside a Form Field.",
          "The list is short enough to show in full — use Select, or a Radio group below about six options.",
          "The reader is choosing from a fixed set rather than typing — a combobox is more machinery than the choice needs.",
        ],
      }}
      related={[
        {
          label: "Input",
          href: "/design-system/components/forms/input",
          reason: "when the field collects an answer rather than a query",
        },
        {
          label: "Select",
          href: "/design-system/components/forms/select",
          reason: "when the list is short enough to show in full",
        },
        {
          label: "Chip",
          href: "/design-system/components/forms/chip",
          reason: "for the filters and applied tags around a search",
        },
        {
          label: "Empty State",
          href: "/design-system/components/feedback/empty-state",
          reason: "what a query matching nothing must render",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-sizes">
          <h2 id="cdp-sizes" className="cdp__h2">
            Sizes and Modes
          </h2>
          <ul>
            <li>
              <strong>Small</strong> — a data-table toolbar or a side panel, where the field sits
              among other compact controls.
            </li>
            <li>
              <strong>Medium</strong> — the default, for page content and forms.
            </li>
            <li>
              <strong>Large</strong> — a masthead or a hero, where the field is the page&apos;s primary
              action.
            </li>
          </ul>
          <p>
            The presence of <code>onSubmit</code> is the difference between a filter and a search. A
            filter narrows what is already on the page as the reader types; a search hands the query
            somewhere else and turns the leading icon into a button. Do not supply both behaviours and
            leave the reader to guess which one Enter performs.
          </p>
          <p>
            Suggestions are presentational. This component neither fetches nor debounces, because what
            a suggestion is differs per surface and the field should not know. Fetch on intent, not on
            mount — a reader who clicks the field and changes their mind should download nothing.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>A masthead search, which submits rather than filters.</p>
          <CodeBlock>{`import { Search } from "@mosje/design-system";

const [query, setQuery] = React.useState("");

<Search
  size="lg"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  onClear={() => setQuery("")}
  onSubmit={(value) => router.push(\`/search?q=\${encodeURIComponent(value)}\`)}
  placeholder="Search Schemes, Services and Documents"
/>`}</CodeBlock>
          <p>
            With autocomplete, the owner supplies the rows. Pass <code>undefined</code> — not an empty
            array — while there is nothing to offer, so the field does not announce itself as a
            combobox before it has anything in it.
          </p>
          <CodeBlock>{`<Search
  value={query}
  onChange={onQuery}
  suggestions={query.length >= 2 ? matches : undefined}
  onSuggestionSelect={(row) => router.push(row.id)}
  suggestionsLabel="Matching schemes"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Down and Up</strong> — move through the suggestions, wrapping at both ends.
            </li>
            <li>
              <strong>Enter</strong> — choose the highlighted suggestion, or submit the query where
              none is highlighted.
            </li>
            <li>
              <strong>Escape</strong> — hide the list and keep the text. Clearing here would punish a
              reader who only wanted the suggestions out of the way.
            </li>
            <li>
              <strong>Tab</strong> — field, then the clear button, then out. The list is not a tab
              stop; it is driven by <code>aria-activedescendant</code> from the field.
            </li>
          </ul>
          <p>
            A changed suggestion set clears the highlight. Keeping index 2 across two different lists
            is how Enter ends up opening something the reader never saw.
          </p>
        </section>
      }
    />
  );
}
