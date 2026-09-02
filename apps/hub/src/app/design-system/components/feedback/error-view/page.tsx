import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { ErrorViewPlayground } from "./error-view-playground";

export const metadata: Metadata = {
  title: "Error View — Design System",
  description:
    "The full-page state for 404, 500, 403 and maintenance: what happened, a way back, a search, and the destinations most citizens were looking for.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The view is a section labelled by its own title, and the title is the page's h1 — so the error is the document's heading rather than a styled paragraph.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      'The search input carries aria-label="Search MoSJE Portal" and sits in a form with role="search", so it is reachable by landmark and named without depending on its placeholder.',
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "Each wayfinding card is one link carrying a title and a sentence, so what it leads to is announced with it. External destinations open in a new tab and carry the open-in-new mark.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Every control is a real button, link or input — including the diagnostics disclosure, which is a native details element and therefore operable and announced as expanded or collapsed without any ARIA of its own.",
  },
];

export default function ErrorViewPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Error View"
      status="Stable"
      summary="The full-page state for a request that could not be served — not found, server error, access restricted, or scheduled maintenance. It says what happened, offers a way back, and never leaves the citizen at a dead end."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<ErrorViewPlayground />}
      propsFrom="ErrorViewProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A route could not be served at all — the page is the error, and there is nothing else on it.",
          "A service is down or under maintenance and the whole surface is affected.",
          "The citizen has arrived from a stale link and needs both an explanation and somewhere to go.",
        ],
        avoid: [
          "One region of a working page failed — use an Alert above that region, so the rest of the page stays usable.",
          "The request succeeded and returned nothing — use an Empty State; “no results” is not an error.",
          "The failure is a field the citizen can correct — put the message under that field through Form Field.",
        ],
      }}
      related={[
        {
          label: "Empty State",
          href: "/design-system/components/feedback/empty-state",
          reason: "when the request succeeded but returned nothing",
        },
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "when one region failed and the page still works",
        },
        {
          label: "Search",
          href: "/design-system/components/forms/search",
          reason: "the field this view embeds for recovery",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-recovery">
            <h2 id="cdp-recovery" className="cdp__h2">
              Three Ways Back, in Order
            </h2>
            <p>
              An error page is a dead end unless it offers somewhere to go, so this one offers three
              layers and they are ordered by how much the citizen already knows about what they
              wanted.
            </p>
            <ol>
              <li>
                <strong>Direct recovery</strong> — the primary and secondary controls: return to the
                homepage or try again, and go back.
              </li>
              <li>
                <strong>Search</strong> — for a citizen who knows what they were looking for and
                only lost the address.
              </li>
              <li>
                <strong>Wayfinding</strong> — four destination cards, for a citizen who does not.
              </li>
            </ol>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-presets">
            <h2 id="cdp-presets" className="cdp__h2">
              The Four Presets
            </h2>
            <ul>
              <li>
                <strong>404</strong> — the default. The page moved, was renamed, or is unavailable
                during the consolidation of the department&apos;s sites.
              </li>
              <li>
                <strong>500</strong> — a system error. Its primary action is “Try Again” as a button
                rather than a link, because retrying is not a navigation.
              </li>
              <li>
                <strong>403</strong> — the resource exists and this account may not see it.
              </li>
              <li>
                <strong>maintenance</strong> — a planned outage, stated as planned.
              </li>
            </ul>
            <p>
              Each preset carries copy the department can stand behind. Override a field where a
              portal needs to be more specific; do not override it to be more apologetic.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-diagnostics">
            <h2 id="cdp-diagnostics" className="cdp__h2">
              Diagnostics Are Not for Citizens
            </h2>
            <p>
              <code>errorDetails</code> renders a stack trace inside a collapsed disclosure. Nothing
              a citizen can do follows from reading one, and printing an endpoint or a status code
              on a public page is an estate telling people about its own plumbing.
            </p>
            <p>
              Pass it in development and on internal, authenticated tooling. On a public route,
              leave it out and send the detail to the log.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ErrorView } from "@mosje/design-system";

export default function NotFound() {
  return <ErrorView kind="404" />;
}`}</CodeBlock>
          <p>
            A portal with no public search and its own destinations overrides both, and everything
            else stays on the preset.
          </p>
          <CodeBlock>{`<ErrorView
  kind="403"
  searchUrl={null}
  wayfindingLinks={[
    { title: "Officer Sign In", description: "Sign in with an authorised departmental account.", href: "/portals/smile-admin/login", icon: "login" },
    { title: "Helpdesk", description: "Report an access problem to the nodal officer.", href: "/website/contact-us", icon: "support_agent" },
  ]}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-heading">
            <h2 id="cdp-heading" className="cdp__h2">
              It Owns the Page&apos;s h1
            </h2>
            <p>
              The title renders as an <code>h1</code>, and the section is labelled by it. That is
              right for a full-page error, which is the whole content of the route — but it means
              the view must not be dropped inside a page that already has an <code>h1</code>, or the
              document ends up with two.
            </p>
            <p>
              For the same reason, render one Error View per page. The section&apos;s labelling id is
              a fixed string rather than a generated one, so a second instance on the same document
              would duplicate it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-search">
            <h2 id="cdp-search" className="cdp__h2">
              The Search and the Controls
            </h2>
            <p>
              The search is a real <code>form</code> with <code>role=&quot;search&quot;</code>, so a
              screen-reader user can reach it by landmark from anywhere on the page. The input is
              named by <code>aria-label</code> rather than by its placeholder, which disappears the
              moment anything is typed.
            </p>
            <p>
              The primary and secondary actions render as a link when they carry an{" "}
              <code>href</code> and as a button when they carry an <code>onClick</code>. That is
              deliberate: a navigation should be a link so it can be opened in a new tab, and a
              retry should be a button because it is not a destination.
            </p>
          </section>
        </>
      }
    />
  );
}
