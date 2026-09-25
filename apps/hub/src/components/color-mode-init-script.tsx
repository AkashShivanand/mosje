"use client";

import * as React from "react";
import { colorModeInitScript } from "@mosje/design-system/color-mode";

const noop = () => () => {};

/**
 * The colour-mode init script, rendered so React never has to CREATE it in the browser.
 *
 * It must be an inline, parser-blocking `<script>` in `<head>`: it sets `data-brand`
 * from the cookie (or the route's default brand) before `<body>` is parsed, so the first
 * paint is already the right palette. Measured 25 Sep 2026: the attribute is set when the
 * parser reaches `<body>` on /website and /portals/scw, cookie or not.
 *
 * Rendered as a plain `<script>` in the root layout, it worked — until React had to build
 * the root layout in the browser rather than hydrate it. That happens when a page throws
 * `notFound()` under a nested layout (/website's catch-all): the server answers with an
 * error shell and the client renders the whole tree, `<head>` included. React creates the
 * element, logs "Encountered a script tag while rendering React component", and never runs
 * it anyway.
 *
 * `next/script` with `strategy="beforeInteractive"` is NOT the fix. In the App Router an
 * inline beforeInteractive script is itself rendered as a React `<script>` that pushes its
 * code onto `self.__next_s`, so the same element warns on the same path; and that code runs
 * from Next's bootstrap after the main chunk loads — after first paint — which would bring
 * back the palette flash this script exists to prevent.
 *
 * So: during server rendering and hydration this renders exactly the executable script it
 * always did (`useSyncExternalStore`'s server snapshot is used for both, so nothing
 * mismatches). Only when React is creating the element in the browser does it render as a
 * `type="text/x-color-mode-init"` data block — React does not warn about data blocks, and
 * a second run would be pointless: by then `RouteColorModeProvider` owns the attribute.
 */
export function ColorModeInitScript() {
  const inBrowserRender = React.useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return (
    <script
      type={inBrowserRender ? "text/x-color-mode-init" : undefined}
      dangerouslySetInnerHTML={{ __html: colorModeInitScript() }}
    />
  );
}
