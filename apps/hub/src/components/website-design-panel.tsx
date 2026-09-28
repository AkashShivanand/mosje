"use client";

import * as React from "react";
import { RadioGroup } from "@mosje/design-system";
import { WEBSITE_DESIGNS, type WebsiteDesign } from "@/lib/website-design/constants";
import { readWebsiteDesign, switchWebsiteDesign } from "@/lib/website-design/switch";
import "@/components/website/data-mode.css";

const noop = () => () => {};
const serverDesign = (): WebsiteDesign => "new";

/**
 * The demo rail's Website tab: switch the public website between the 2026
 * redesign and the archived classic design, at the same address.
 *
 * The switch reloads the page. The proxy chooses the tree per request
 * (proxy.ts, lib/website-design/constants.ts), so a client-side refresh would
 * keep whichever design the router had already cached. The reload comes back to
 * the same SECTION, matched by heading (lib/website-design/switch.ts), and
 * ⌘⌥1/2/3 do the same from anywhere without opening the dock (demo-capture.tsx).
 */
export function WebsiteDesignPanel() {
  const name = React.useId();
  // The cookie is read, never subscribed to: the only writer is this panel,
  // and writing it reloads the page.
  const design = React.useSyncExternalStore(noop, readWebsiteDesign, serverDesign);
  const active = WEBSITE_DESIGNS.find((d) => d.value === design) ?? WEBSITE_DESIGNS[0]!;

  const choose = (next: WebsiteDesign) => switchWebsiteDesign(next);

  return (
    <div className="dm-panel">
      <section className="dm-panel__group">
        <RadioGroup
          className="dm-panel__opts"
          legend="Website design"
          name={name}
          size="sm"
          options={WEBSITE_DESIGNS.map((d) => ({ value: d.value, label: d.label }))}
          value={design}
          onChange={(v) => choose(v as WebsiteDesign)}
        />
        <p key={active.value} className="dm-panel__explain">
          {active.hint}. The page reopens at the same section.
        </p>
        <p className="dm-panel__hint">
          <kbd className="dm-panel__kbd">⌘⌥1</kbd> <kbd className="dm-panel__kbd">⌘⌥2</kbd>{" "}
          <kbd className="dm-panel__kbd">⌘⌥3</kbd> switch design from anywhere on the page;{" "}
          <kbd className="dm-panel__kbd">⌘⌥0</kbd> returns to the previous one.
        </p>
      </section>
    </div>
  );
}
