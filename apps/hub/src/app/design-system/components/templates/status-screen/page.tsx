import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { StatusSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Status Screen — Design System",
  description: "404, 403, 500, maintenance and offline — five different facts about the world, worded differently.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.2 Page Titled",
    level: "A",
    description:
      "Each kind carries its own badge and heading, so the browser tab and the page agree on what happened.",
    status: "partial",
    evidence: "ErrorView supplies the heading per kind; the route's own Metadata title is the caller's and the template cannot set it.",
  },
  {
    criterion: "3.3.3 Error Suggestion",
    level: "AA",
    description:
      "Every kind offers a next action, and the offline kind withdraws the search field rather than offering one that cannot work.",
    status: "verified",
    evidence: "searchUrl is forced to null when kind is offline; primaryAction and wayfindingLinks are forwarded for every kind.",
  },
  {
    criterion: "3.1.5 Reading Level",
    level: "AAA",
    description:
      "No status code, endpoint or stack trace reaches a citizen's page.",
    status: "verified",
    evidence: "errorDetails is not forwarded from StatusScreenProps; the template exposes no path to it.",
  },
];

export default function StatusScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Status Screen"
      status="Beta"
      summary={"No record, because something failed. Five kinds, five different sentences — a single \"Something went wrong\" covers all of them and helps with none."}
      figma={{
        absent:
          "Absent. No error page of any kind is drawn on the handoff page.",
      }}
      specimen={<StatusSpecimen />}
      propsFrom="StatusScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A route with no record to render — wrong address, withdrawn record, forbidden, service down.",
          "A planned maintenance window, or a device with no connection.",
        ],
        avoid: [
          "A feed that failed inside a screen that otherwise works — that is ScreenBody's error branch, which keeps the chrome and the reader's place.",
          "An error boundary. A feed being down is an expected state, not an exception.",
        ],
      }}
      related={[
        { label: "Error View", href: "/design-system/components/feedback/error-view", reason: "what it renders" },
        { label: "Screen Body", href: "/design-system/components/templates/screen-body", reason: "the in-page error branch" },
        { label: "Empty State", href: "/design-system/components/feedback/empty-state", reason: "when there is a page but no data" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-five">
            <h2 id="cdp-five" className="cdp__h2">Five Facts, Five Sentences</h2>
            <p>
              <strong>404</strong> — the address is wrong or the record was withdrawn; look for it
              another way. <strong>403</strong> — the record exists and this role may not see it;
              ask for access. <strong>500</strong> — the department&rsquo;s service failed; try
              again shortly. <strong>Maintenance</strong> — the failure was planned; come back
              after the stated window. <strong>Offline</strong> — the device is not connected, and
              nothing was lost.
            </p>
            <p>
              <code>offline</code> has no ErrorView preset, so it borrows the 500&rsquo;s shape and
              replaces every word of it. Borrowing the look is right — the reader is equally stuck
              — while borrowing the copy would blame the department for the reader&rsquo;s
              connection.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-not-boundary">
            <h2 id="cdp-not-boundary" className="cdp__h2">It Is Not an Error Boundary</h2>
            <Callout type="warning" title="A failed feed keeps its chrome">
              Routing a fetch failure through here throws away the page&rsquo;s navigation and the
              reader&rsquo;s place in it. That case belongs to ScreenBody&rsquo;s error branch,
              inside the screen that read the feed.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`// app/portals/e-anudaan/not-found.tsx
export default function NotFound() {
  return (
    <StatusScreen
      kind="404"
      primaryAction={{ label: "Return to Dashboard", href: "/portals/e-anudaan", icon: "dashboard" }}
      searchUrl={null}
    />
  );
}`}</CodeBlock>
          <p>
            Pass <code>searchUrl={"{null}"}</code> on a portal with no public search, rather than
            offering a field that leads nowhere.
          </p>
        </section>
      }
    />
  );
}
