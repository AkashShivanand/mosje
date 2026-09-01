import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { NavSheetSpecimen } from "./nav-sheet-specimen";

export const metadata: Metadata = {
  title: "Nav Sheet — Design System",
  description:
    "The mobile navigation overlay: a 344px sheet with its own brand lockup, the masthead's search, the primary navigation, and the accessibility controls the bar sheds on a phone.",
};


/*
 * `NavItem` and `HeaderSearchConfig` are the two data shapes this component's
 * required props carry. The extractor reads exported `*Props` interfaces, so
 * neither is generated — and both are what a caller actually writes.
 */
const SHAPES: PropDef[] = [
  { name: "NavItem · label", type: "string", required: true, description: "The entry's visible text. A short noun phrase in Title Case." },
  { name: "NavItem · href", type: "string", required: true, description: "Destination." },
  { name: "NavItem · active", type: "boolean", description: "Marks the current page, which renders the active treatment." },
  { name: "NavItem · external", type: "boolean", description: "Opens in a new tab, and adds rel=\"noreferrer\"." },
  {
    name: "NavItem · disabled",
    type: "boolean",
    description:
      "The disabled treatment — muted colour, no href, aria-disabled. Use it for a destination that exists in the information architecture but is not reachable yet; drop the entry entirely if it never will be.",
  },
  {
    name: "NavItem · children",
    type: "NavLink[]",
    description: "A simple single-column sub-list. The row opens as the Expanded state.",
  },
  {
    name: "NavItem · columns",
    type: "NavColumn[]",
    description:
      "A titled multi-column mega-menu, each column carrying either rich org rows (items) or plain links. The row opens as the Mega state. If both children and columns are given, columns wins.",
  },
  { name: "HeaderSearchConfig · placeholder", type: "string", description: "Hint at scope — “Search schemes, services, documents” — rather than a bare “Search”." },
  { name: "HeaderSearchConfig · onSearch", type: "(query: string) => void", description: "The query was submitted — Enter, or the leading icon." },
  {
    name: "HeaderSearchConfig · onQueryChange",
    type: "(query: string) => void",
    description:
      "Called on every keystroke so the owner can fetch autocomplete rows. DEBOUNCE ON THE OWNER'S SIDE — the masthead must not decide how often a consumer's index may be hit.",
  },
  { name: "HeaderSearchConfig · suggestions", type: "SearchSuggestion[]", description: "Autocomplete rows for the current query. Omit for no autocomplete." },
  { name: "HeaderSearchConfig · onSuggestionSelect", type: "(suggestion: SearchSuggestion) => void", description: "A suggestion was chosen, by click or by Enter on the highlighted row." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "It is a modal and it now says so: `aria-modal=\"true\"`. It used to declare `aria-modal={false}` while covering the viewport behind a click-swallowing scrim — telling a screen-reader user the page behind was still theirs to browse while, for everyone else, it was not.",
    status: "verified",
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    description:
      "Focus is trapped inside the sheet and released when it closes. Before that, Tab walked out into a page the reader could neither see nor click.",
    status: "verified",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "Focus is restored to whatever opened the sheet when it closes — the half the component's own docstring used to promise with no code behind it.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Escape closes. Every row is a real control: a link where it navigates, a button with `aria-expanded` where it discloses a sub-list.",
    status: "verified",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A mega-menu keeps its columns in the sheet — headings, emblems and full organisation names — stacked vertically. Flattening them to a list of abbreviations threw away every column heading and every full name, on the one surface where an unfamiliar abbreviation is hardest to place.",
    status: "verified",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "Rows hug their content, so a label that wraps at 200% zoom grows the row rather than clipping. The sheet itself scrolls; the body behind it is locked while it is open.",
  },
  {
    criterion: "GIGW 3.0 — Accessibility controls",
    level: "GIGW",
    description:
      "The accessibility bar sheds text size, accessibility options and language below the tablet anchor. Until this section existed, nothing picked them up — so a phone user had no route to any of the three.",
    status: "verified",
  },
];

export default function NavSheetPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Nav Sheet"
      status="Stable"
      summary="The mobile navigation overlay: a 344px sheet with its own brand lockup, the masthead's search, divider-separated rows for the primary navigation, and the accessibility controls the bar sheds on a phone."
      figma={{ node: "navSheet" }}
      specimen={<NavSheetSpecimen />}
      propsFrom="NavSheetProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The masthead's navigation below the desktop anchor, where the inline nav row cannot fit.",
          "A desktop masthead whose nav has outgrown its room — SiteHeader measures itself and hands the nav to the sheet rather than letting entries overlap.",
        ],
        avoid: [
          "A portal's sidebar on a phone — that is App Shell's drawer, which carries Sidebar Nav rather than the masthead's nav.",
          "A general-purpose panel — use Side Sheet, which has no brand lockup and no navigation semantics.",
          "Rendering it alongside the inline nav row: they are the same navigation, and two copies means two things to keep in step.",
        ],
      }}
      related={[
        {
          label: "Navbar (Header)",
          href: "/design-system/components/section-templates/site-header",
          reason: "the masthead that owns the sheet and its query",
        },
        {
          label: "Side Sheet",
          href: "/design-system/components/feedback/side-sheet",
          reason: "for a panel that is not navigation",
        },
        {
          label: "Accessibility Bar",
          href: "/design-system/components/utilities/accessibility-bar",
          reason: "the controls this sheet picks up below the tablet anchor",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              Three States, Not Three Variants
            </h2>
            <MatrixTable
              caption="What an expanded row shows"
              columns={["State", "The row carries", "The sheet shows"]}
              rows={[
                ["Default", "Nothing open", "The list of primary entries"],
                ["Expanded", "children", "A simple sub-list under the row"],
                ["Mega", "columns", "The full mega-menu — headings, emblems and organisation names, stacked"],
              ]}
            />
            <p>
              These are states of one component, not variants a consumer picks. Which one a row
              shows is decided by whether the <code>NavItem</code> carries <code>children</code> or{" "}
              <code>columns</code>, exactly as in the inline nav row.
            </p>
            <Callout type="warning" title="A mega-menu keeps its columns here">
              An earlier build flattened them to a bare list of abbreviations. That discarded every
              column heading, every emblem and every full organisation name on the one surface
              where an unfamiliar abbreviation like NCSC is hardest to place.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-side">
            <h2 id="cdp-side" className="cdp__h2">
              It Slides from the Right
            </h2>
            <p>
              It matches the trigger that opens it. A control on the right that produces a panel on
              the left breaks the relationship between the two, and on a phone it puts the
              reader&apos;s thumb nowhere near the close button.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-one-field">
            <h2 id="cdp-one-field" className="cdp__h2">
              One Search Field, Not Two
            </h2>
            <p>
              <code>search</code> takes the same <code>HeaderSearchConfig</code> the masthead does,
              and <code>searchValue</code> is owned by the masthead rather than held here. Both are
              deliberate: the sheet used to declare a narrowed <code>&#123;placeholder,
              onSearch&#125;</code>, so autocomplete worked on a desktop and silently did not on a
              phone, and it used to hold its own query, so whatever the reader had typed vanished
              the moment they opened the menu.
            </p>
            <Callout type="info" title="A downgraded copy of a component is a fork with extra steps">
              The shared type is what makes that particular drift a type error rather than
              something noticed in six months.
            </Callout>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shapes">
            <h2 id="cdp-shapes" className="cdp__h2">
              NavItem and HeaderSearchConfig
            </h2>
            <PropsTable props={SHAPES} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            In practice the masthead renders this for you. Reach for it directly only where a
            surface needs the sheet without the rest of the header.
          </p>
          <CodeBlock>{`"use client";
import { NavSheet } from "@mosje/design-system";

const [open, setOpen] = React.useState(false);
const [query, setQuery] = React.useState("");

<NavSheet
  id="site-nav-sheet"          // the trigger's aria-controls points here
  open={open}
  onClose={() => setOpen(false)}
  nav={NAV}
  emblemSrc={emblem}
  brandLines={BRAND}
  homeHref="/website"
  search={{
    placeholder: "Search schemes and services",
    onSearch: runSearch,
    onQueryChange: fetchSuggestions,
    suggestions,
    onSuggestionSelect: go,
  }}
  searchValue={query}
  onSearchValueChange={setQuery}
  actions={<a className={buttonClasses("primary", "filled", "md")} href="/login">Login</a>}
/>`}</CodeBlock>
          <p>
            The accessibility section is on by default. Turn it off only where the surface is not a
            public government page and carries no accessibility bar to inherit from.
          </p>
          <CodeBlock>{`<NavSheet {...props} accessibilityControls={false} />`}</CodeBlock>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-modal">
          <h2 id="cdp-modal" className="cdp__h2">
            Modal Behaviour
          </h2>
          <MatrixTable
            caption="What the sheet does while it is open"
            columns={["Concern", "Behaviour"]}
            rows={[
              ["Escape", "Closes the sheet"],
              ["Scrim click", "Closes the sheet"],
              ["Tab", "Cycles inside the sheet — focus is trapped"],
              ["Body scroll", "Locked while the sheet is open"],
              ["On close", "Focus returns to whatever opened it"],
              ["Screen reader", 'aria-modal="true" — the page behind is not browsable'],
            ]}
          />
          <p>
            Pass <code>id</code> and point the trigger&apos;s <code>aria-controls</code> at it. A
            disclosure button that names no element tells a screen-reader user there is something
            to expand and gives them no way to find it.
          </p>
        </section>
      }
    />
  );
}
