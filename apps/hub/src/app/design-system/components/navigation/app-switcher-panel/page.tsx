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

import { AppSwitcherPanelSpecimen } from "./app-switcher-panel-specimen";

export const metadata: Metadata = {
  title: "App Switcher Panel — Design System",
  description:
    "The searchable content of the SAMAVESH app switcher: a current-app indicator, a search box, and the grouped list of estate destinations.",
};


/*
 * `AppEntry` is the estate registry's row shape. It is a data type rather than a
 * props interface, so the extractor cannot see it — and it is what a caller
 * overriding `apps` has to write.
 */
const APP_ENTRY_SHAPE: PropDef[] = [
  { name: "path", type: "string", required: true, description: "Hub-origin path. Code-only — it cannot be overridden from /admin/portals." },
  { name: "group", type: "string", required: true, description: "Top-level grouping — Website, Portals, Resources. Code-only." },
  { name: "category", type: "string", description: "Functional bucket inside the group. Live entries come before planned ones within each." },
  { name: "desc", type: "string", description: "One line describing what the destination is for." },
  { name: "org", type: "string", description: "Organisation key, resolved through the OrgLogo registry for the row's mark." },
  {
    name: "status",
    type: '"live" | "planned"',
    required: true,
    description:
      "Code carries these two only. A built portal left as planned is a finished service nobody can find. “hidden” exists at runtime alone, set at /admin/portals, and the hub's proxy blocks a hidden path for everyone but a signed-in administrator.",
  },
  { name: "newTab", type: "boolean", description: "Opens in a new tab. Code-only." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "Focus moves into the search input on mount, so a reader who opened the panel to find something is already where they need to be.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Every destination is a real anchor, reachable by Tab in reading order. The `/` shortcut returns focus to the search box while the panel is mounted.",
    status: "verified",
  },
  {
    criterion: "2.1.4 Character Key Shortcuts",
    level: "A",
    description:
      "`/` is a single-character shortcut. It is scoped to the panel's own lifetime and is ignored while the search box already has focus, so it cannot capture a typed slash — but it is not user-remappable, which is what this criterion asks for where the shortcut is global.",
    status: "partial",
    evidence: "Scoped to the mounted panel; no remapping offered.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "Each row's accessible name is the destination's full name and its description, never an abbreviation. The organisation's mark carries an empty alt because the name sits beside it in real text [WCAG H67], so a screen reader is not told the organisation twice.",
    status: "verified",
    evidence:
      "Read from the rendered panel: the link's text is the name plus the description, and the OrgLogo image resolves to alt=\"\". The two-letter monogram it replaced was aria-hidden, so nothing announced was lost.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Destinations are grouped under sticky group labels, and the sticky offset is measured from the header's real rendered height rather than assumed — a group label that sticks a few pixels too high hides under the header instead of sitting below it.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "A search that matches nothing needs to say so, and to distinguish “nothing matched” from “nothing loaded”. Verify against the current build before claiming it.",
    status: "untested",
  },
];

export default function AppSwitcherPanelPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="App Switcher Panel"
      status="Stable"
      summary="The searchable content of the SAMAVESH app switcher: the current-app indicator, the search box, and the grouped list of estate destinations. It is pure content — a shell owns the floating chrome and the open state."
      figma={{
        absent:
          "The cross-zone switcher is demo and wayfinding tooling; it has no published master in the SAMAVESH library.",
      }}
      specimen={<AppSwitcherPanelSpecimen />}
      propsFrom="AppSwitcherPanelProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Inside a shell that needs the estate's destination list — the demo dock's Apps tab is the estate's only one.",
          "Anywhere a reader must move between zones rather than within one.",
        ],
        avoid: [
          "Navigation inside a portal — that is Sidebar Nav.",
          "A public wayfinding surface — the portals directory at /portals is the citizen-facing equivalent, and it renders portal cards.",
          "Adding a second floating switcher: the demo dock is mounted once, by the hub's root layout, and no portal adds its own.",
        ],
      }}
      related={[
        {
          label: "Portal Card",
          href: "/design-system/components/navigation/portal-card",
          reason: "the citizen-facing way to present the same destinations",
        },
        {
          label: "Sidebar Nav",
          href: "/design-system/components/section-templates/sidebar",
          reason: "navigation within a portal rather than between them",
        },
        {
          label: "Search",
          href: "/design-system/components/forms/search",
          reason: "the field pattern the panel's own search follows",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-content-only">
            <h2 id="cdp-content-only" className="cdp__h2">
              Content, Not Chrome
            </h2>
            <p>
              The panel has no fixed positioning, no open or close state, and no colour-mode
              handling. A shell supplies all three. On this estate that shell is the demo dock,
              which is mounted exactly once by the hub&apos;s root layout and reads the path
              itself — a portal adds no switcher of its own.
            </p>
            <Callout type="info" title="Where a floating shell may sit">
              There are two rails and a new widget does not invent a third: the bottom-right
              corner, which stacks the citizen&apos;s own controls upward by permanence, and the
              right wall, which carries navigators and tooling. Anything fixed declares itself with{" "}
              <code>data-sa-corner-occupant</code> or <code>data-sa-wall-occupant</code> so the
              rails measure around it.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-registry">
            <h2 id="cdp-registry" className="cdp__h2">
              The Registry Is the Source, and It Has Two Layers
            </h2>
            <MatrixTable
              caption="Where an entry's fields come from"
              columns={["Layer", "Lives in", "Can change"]}
              rows={[
                ["Code", "DEFAULT_APPS in app-switcher-utils.ts", "path, group, newTab, and every field's default"],
                ["Runtime", "The portal_registry row, edited at /admin/portals", "A sparse patch — status, label, order"],
              ]}
            />
            <p>
              A path absent from the stored patch renders exactly as code defines it, so a new
              portal appears with its code status and needs no administrator visit. Editing a
              field at <code>/admin</code> pins it to the patch, and a later code change to the
              same field then stops taking effect — so permanent corrections belong in{" "}
              <code>DEFAULT_APPS</code>, and <code>/admin</code> is for demo curation.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-groups">
            <h2 id="cdp-groups" className="cdp__h2">
              Grouping and Order
            </h2>
            <p>
              Entries are grouped by functional category and both the panel and the portals
              directory preserve registry order without sorting. Within each category, live
              entries come before planned ones — a built portal left marked planned is a finished
              service nobody can find.
            </p>
            <p>
              <strong>The panel lists what ships.</strong> An entry the registry marks planned is
              not rendered at all — not as a greyed row and not badged &ldquo;soon&rdquo;. The
              test is <code>isLiveEntry</code>, shared with the portals gateway and the SAMAVESH
              banner drawer, so the three surfaces that read this registry cannot disagree about
              which portals exist.
            </p>
            <p>
              A hidden entry is a runtime state, not a code value: the hub&apos;s proxy rewrites a
              hidden path to the unavailable page for everyone except a signed-in administrator,
              so hiding a portal here also blocks its login page.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-entry">
            <h2 id="cdp-entry" className="cdp__h2">
              AppEntry
            </h2>
            <PropsTable props={APP_ENTRY_SHAPE} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { AppSwitcherPanel } from "@mosje/design-system";

<AppSwitcherPanel
  pathname={usePathname()}
  onNavigate={closePanel}
/>`}</CodeBlock>
          <p>
            Where the surrounding shell already names the current app, suppress the
            panel&apos;s own indicator rather than showing it twice.
          </p>
          <CodeBlock>{`<AppSwitcherPanel
  pathname={pathname}
  showCurrentApp={false}
  onNavigate={() => setOpen(false)}
/>`}</CodeBlock>
          <p>
            <code>onNavigate</code> is a function, so a page that exports <code>metadata</code>{" "}
            cannot render this directly — put the instance in a client component, as this
            page&apos;s specimen does.
          </p>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <MatrixTable
            caption="Keys the panel handles"
            columns={["Key", "Action"]}
            rows={[
              ["Tab / Shift+Tab", "Move through the search box and the destination list in reading order"],
              ["/", "Return focus to the search box, while the panel is mounted and the box is not already focused"],
              ["Enter", "Follow the focused destination"],
              ["Escape", "Handled by the shell that owns the panel, not by the panel itself"],
            ]}
          />
          <p>
            Escape is deliberately not this component&apos;s business. The panel has no open state
            to close, and a component that dismissed a dialog it does not own would fight the
            shell for the same key.
          </p>
        </section>
      }
    />
  );
}
