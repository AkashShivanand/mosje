import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { UX4GAccessibilityWidget } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "UX4G Accessibility Widget — Design System",
  description:
    "The official Government of India (MeitY / UX4G) accessibility widget — contrast, text sizing, spacing, link highlighting, dark mode, reading guides and disability profiles. The single accessibility mechanism for the estate.",
};

/*
 * Read off `UX4GAccessibilityWidgetProps` in
 * packages/design-system/components/utilities/ux4g-accessibility-widget.tsx.
 * The component renders nothing and returns `null`; it injects the official script.
 */
const PROPS: PropDef[] = [
  {
    name: "src",
    type: "string",
    default: "the pinned v3.28 CDN build",
    description:
      "Override the widget script URL, to pin a version or to self-host. The script resolves its own stylesheet relative to its `src`, so a self-hosted copy must keep the JavaScript and the CSS side by side.",
  },
  {
    name: "analytics",
    type: "boolean",
    default: "false",
    description:
      "Allow the widget to send its usage telemetry to UX4G's audit360 endpoint. Off by default: the payload carries the full URL of every page view, and on an authenticated portal a URL can contain application and beneficiary identifiers. Turn it on only for a public, non-authenticated property, and confirm it against the estate's privacy position first.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "The widget offers text sizing up to 200% without loss of content or function. The Accessibility Bar's own A−/A/A+ stepper is the estate's primary text-size control; this is the second half of the same guarantee for readers who open the widget instead.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "Contrast, high-contrast, monochrome and dark modes are the widget's, not the design system's. They apply a `.dark-mode` class to the document element, which is distinct from the design system's own `data-theme` / `data-brand` token theming.",
  },
  {
    criterion: "1.4.12 Text Spacing",
    level: "AA",
    description: "Line height, letter spacing and word spacing are adjustable from the panel and applied to the whole document.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The panel opens with Ctrl+F2 on Windows and Linux, as the widget publishes. On macOS that combination is reserved by the operating system, so the component binds ⌘⌥A and relabels the trigger to match — a shortcut advertised on the button and then not working is worse than none, and worse still on an accessibility control.",
  },
  {
    criterion: "GIGW 3.0 — Accessibility features",
    level: "GIGW",
    description:
      "This is the accessibility mechanism GIGW and IS 17802 expect on a Government of India property. It is mounted once in the hub's root layout and covers every zone.",
  },
];

export default function UX4GAccessibilityWidgetPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="UX4G Accessibility Widget"
      status="Stable"
      summary="The official Government of India (MeitY / UX4G) accessibility widget, and the single canonical accessibility mechanism for the whole estate. It renders nothing itself — it injects the official script, which draws its own floating control and panel."
      figma={{ node: "accessibility" }}
      specimen={
        <div>
          {/* The mount is idempotent — the hub's root layout already carries one, and a
              second render loads no second script. Rendering it here makes the specimen
              honest: the control the reader can see is this component's output. */}
          <UX4GAccessibilityWidget />
          <p>
            The widget is running on this page. Its control is the floating button at the edge of
            the viewport, and it opens with <kbd>Ctrl</kbd> + <kbd>F2</kbd> on Windows and Linux or{" "}
            <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>A</kbd> on macOS. Where an Accessibility Bar is
            present the floating button is hidden and the bar&rsquo;s accessibility control opens
            the same panel &mdash; one door, not two.
          </p>
        </div>
      }
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A new application root is created outside the hub and needs the estate's accessibility mechanism.",
          "A property must offer contrast, spacing and dark-mode controls to meet GIGW and IS 17802.",
        ],
        avoid: [
          "You are adding a page or a portal inside the hub — the root layout already mounts it, and a second mount is inert rather than helpful.",
          "You need a text-size control in the masthead — use Accessibility Bar, which owns that control and drives the estate-wide font scale.",
          "You want to restyle the panel — the skin is reached through the widget's own CSS variable in ux4g-accessibility-widget.css, never by overriding its markup.",
        ],
      }}
      related={[
        { label: "Accessibility Bar", href: "/design-system/components/utilities/accessibility-bar", reason: "the masthead bar whose accessibility control opens this panel" },
        { label: "Site Header", href: "/design-system/components/section-templates/site-header", reason: "where the bar sits on a public page" },
        { label: "Live Region", href: "/design-system/components/utilities/live-region", reason: "for announcing a change this widget has nothing to do with" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-ownership">
            <h2 id="cdp-ownership" className="cdp__h2">
              What Is Ours and What Is Not
            </h2>
            <p>
              The panel, its controls and every behaviour inside it are UX4G&rsquo;s. The estate
              owns two things only: <strong>where the entry point is</strong>, and{" "}
              <strong>what colour the skin is</strong>. The accent and the trigger and panel type
              are reskinned to the SAMAVESH brand through the widget&rsquo;s own{" "}
              <code>--color-dark-blue-1</code> variable, which keeps every bit of the official
              functionality while matching the look documented in Figma.
            </p>
            <p>
              Text size is the one property both surfaces offer, and it is resolved in the
              bar&rsquo;s favour: where an Accessibility Bar is on the page, the widget&rsquo;s
              floating button is hidden and the bar&rsquo;s control opens the panel. Contrast,
              spacing, dark mode and the reading guides remain the widget&rsquo;s alone.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-mount">
            <h2 id="cdp-mount" className="cdp__h2">
              Mounted Once, Near the End of the Root Layout
            </h2>
            <p>
              The component is a page-level singleton. It injects the script once per document,
              guards itself against re-hydration, and deliberately does not remove the script on
              unmount &mdash; the widget should persist across client-side route changes rather
              than be torn down and rebuilt on every navigation.
            </p>
            <Callout type="info" title="Telemetry is off, and that is this estate's choice, not the upstream default">
              v3.28 beacons the full URL, pathname, referrer, user agent, language, screen
              resolution and a session id on load, then tracks panel opens and feature toggles.
              This estate&rsquo;s portals are authenticated workflow applications whose URLs carry
              application and beneficiary identifiers, so <code>analytics</code> defaults to{" "}
              <strong>false</strong> and the component suppresses even the initial load beacon.
            </Callout>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import { UX4GAccessibilityWidget } from "@mosje/design-system";

// Once, near the end of the root layout — beside the other page-level singletons.
<UX4GAccessibilityWidget />

// Pinned to a self-hosted copy. Keep the stylesheet beside the script.
<UX4GAccessibilityWidget src="/vendor/ux4g/accessibility-widget.js" />`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-init">
            <h2 id="cdp-init" className="cdp__h2">
              Two Things the Component Does That the Script Cannot
            </h2>
            <p>
              <strong>It replays <code>DOMContentLoaded</code>.</strong> The CDN script wires almost
              every control &mdash; text size, line height, spacing, contrast, dark mode, the close
              button &mdash; inside a <code>DOMContentLoaded</code> handler. The script is injected
              well after that event has already fired, so those handlers would never attach and the
              controls would silently do nothing. A synthetic event is dispatched once the script
              loads, so the widget finishes its own initialisation exactly as it would in a static{" "}
              <code>&lt;script defer&gt;</code> embed.
            </p>
            <p>
              <strong>It fixes the macOS shortcut.</strong> The widget hardcodes{" "}
              <code>Ctrl+F2</code> into the trigger&rsquo;s markup and binds that combination. On a
              Mac it is a reserved system shortcut and F2 is a media key, so it never reaches the
              page. The component binds <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>A</kbd> and rewrites the
              label. The binding is a bridge, not a reimplementation: it dispatches the synthetic{" "}
              <code>Ctrl+F2</code> the widget already listens for, so open, close and focus
              behaviour stay the vendor&rsquo;s.
            </p>
          </section>
        </>
      }
    />
  );
}
