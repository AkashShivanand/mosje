"use client";

import * as React from "react";
import { Icon, IconButton } from "@mosje/design-system";

/**
 * A client component because `Tooltip` is interactive — it opens on hover AND on focus,
 * and a tooltip that only opens on hover is unreachable by keyboard.
 */
export function IconButtonExtras(): React.JSX.Element {
  return (
    <>
      <section className="cdp__section" aria-labelledby="cdp-ib-shape">
        <h2 id="cdp-ib-shape" className="cdp__h2">
          Shape
        </h2>
        <p>
          Square is the default. Most icon buttons sit in a toolbar or a table row beside
          square-cornered siblings, and a round control in that line reads as a different
          kind of thing.
        </p>
        <p>
          <code>shape=&quot;circle&quot;</code> is for a control that floats free of a
          form&rsquo;s rhythm &mdash; a dialog&rsquo;s close, a toast&rsquo;s dismiss, a
          floating action. The radius is <code>--sa-shape-full</code> rather than a large
          number, so it stays a circle at every size and at 200% text.
        </p>
        <p style={{ display: "flex", gap: "var(--sa-stack-12)", alignItems: "center" }}>
          <IconButton aria-label="Close dialog" icon={<Icon name="close" size={20} />} appearance="outlined" />
          <IconButton
            aria-label="Close dialog"
            icon={<Icon name="close" size={20} />}
            appearance="outlined"
            shape="circle"
            data-testid="ib-circle"
          />
        </p>
      </section>

      <section className="cdp__section" aria-labelledby="cdp-ib-tooltip">
        <h2 id="cdp-ib-tooltip" className="cdp__h2">
          Tooltip
        </h2>
        <p>
          Hover these, then Tab to them. The bubble opens on focus as well as on hover.
        </p>
        <p style={{ display: "flex", gap: "var(--sa-stack-12)", alignItems: "center" }}>
          <IconButton
            aria-label="Download the sanction order"
            icon={<Icon name="download" size={20} />}
            tooltip
            data-testid="ib-tooltip"
          />
          <IconButton
            aria-label="Delete application"
            icon={<Icon name="delete" size={20} />}
            variant="danger"
            tooltip="Delete — this cannot be undone"
            tooltipSide="bottom"
          />
        </p>
      </section>
    </>
  );
}
