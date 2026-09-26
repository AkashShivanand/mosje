"use client";

import * as React from "react";
import { RadioGroup } from "@mosje/design-system";
import {
  WEBSITE_DESIGN_COOKIE,
  WEBSITE_DESIGNS,
  parseWebsiteDesign,
  type WebsiteDesign,
} from "@/lib/website-design/constants";
import "@/components/website/data-mode.css";

const noop = () => () => {};
const serverDesign = (): WebsiteDesign => "new";

function readDesign(): WebsiteDesign {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${WEBSITE_DESIGN_COOKIE}=`));
  return parseWebsiteDesign(hit?.split("=")[1]);
}

/**
 * The demo rail's Website tab: switch the public website between the 2026
 * redesign and the archived classic design, at the same address.
 *
 * The switch reloads the page. The proxy chooses the tree per request
 * (proxy.ts, lib/website-design/constants.ts), so a client-side refresh would
 * keep whichever design the router had already cached.
 */
export function WebsiteDesignPanel() {
  const name = React.useId();
  // The cookie is read, never subscribed to: the only writer is this panel,
  // and writing it reloads the page.
  const design = React.useSyncExternalStore(noop, readDesign, serverDesign);
  const active = WEBSITE_DESIGNS.find((d) => d.value === design) ?? WEBSITE_DESIGNS[0]!;

  const choose = (next: WebsiteDesign) => {
    if (next === design) return;
    // A year, so a reviewer comparing the two is not reset between sessions.
    document.cookie = `${WEBSITE_DESIGN_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

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
          {active.hint}. The page stays at the same address.
        </p>
      </section>
    </div>
  );
}
