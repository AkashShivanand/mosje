/**
 * The PM-AJAY coverage card as a self-contained custom element.
 *
 * ── WHAT "STANDALONE" MEANS HERE, EXACTLY ───────────────────────────────────
 *
 * TWO files, dropped onto the host's own server, with NO runtime call back to
 * this estate. React, the design system, the token contract, the India outlines
 * and the mirrored snapshot are inside the script. Nothing is fetched from a
 * MoSJE origin — not the data, not the CSS, not a font.
 *
 * The second file is the village index, and it is separate for a measured
 * reason: bundled, it took the script from 195 KB gzipped to 278 — 30% of the
 * download, for a lookup most readers never run. It sits beside the script on
 * the host's server and is fetched on the second character typed into the
 * search, which is the same rule the hub itself uses. A page where nobody
 * searches a village never pays for it.
 *
 * The one external request that remains is Google's Material Symbols webfont,
 * which the design system's `icons.css` declares. That is not this estate, so
 * it satisfies the requirement as stated, but it IS a third-party request from
 * a government page and it pulls 5.3 MB for the eight glyphs this card uses.
 * Self-hosting a subset is the right follow-up; see the README beside this file.
 *
 * ── WHY A CUSTOM ELEMENT WITH A SHADOW ROOT ─────────────────────────────────
 *
 * The host is an unknown WordPress theme. Two things have to be true and only a
 * shadow root gives both: the theme's CSS must not reach in and restyle a
 * government chart, and the estate's ~300 KB token contract must not leak out
 * and restyle the theme. `:root` is rewritten to `:host` at build time so the
 * tokens resolve against the element rather than a document we do not own.
 */
import * as React from "react";
import { createRoot } from "react-dom/client";

/*
 * ── THE TOKEN CONTRACT, AND IT HAS TO BE IMPORTED EXPLICITLY ───────────────
 *
 * In the hub these arrive through `globals.css`, which nothing here loads. Left
 * out, every `var(--sa-*)` resolves to nothing: the card still LAID OUT
 * correctly — the map drew, the rows paged — while every colour fell back to
 * transparent and every font to whatever the host page inherits. A widget that
 * is structurally perfect and visually absent is the worst way this can fail,
 * because it looks like a styling opinion rather than a missing file.
 *
 * `icons.css` for the same reason: without it the ligature glyphs render as
 * the literal words "chevron_right" and "search".
 */
import "@mosje/design-system/tokens.css";
import "@mosje/design-system/icons.css";
import "./host.css";

import { PmajayWorksMap } from "@/components/website/PmajayWorksMap";
import { PMAJAY_REACH_SNAPSHOT } from "@/lib/website/pmajay-map-snapshot";
import { primeVillageIndex, setVillageIndexSource } from "@/lib/website/pmajay-villages";
import type { ReachData } from "@/lib/website/pmajay-api";
import { DataModeProvider } from "@/lib/data-mode/context";

/*
 * NO LIVE FEED, AND THE SHAPE SAYS SO RATHER THAN PRETENDING.
 *
 * `live: null` and `reachable: false` are the same values `getPmajayReach()`
 * returns when the department's API does not answer, so the card takes the path
 * it already has for that case: it draws the mirrored snapshot and dates it.
 * Nothing here had to be special-cased into the component.
 */
const DATA: ReachData = {
  live: null,
  reading: {},
  mock: PMAJAY_REACH_SNAPSHOT,
  reachable: false,
};

/*
 * WHERE THE VILLAGE INDEX LIVES, resolved from the script's own URL.
 *
 * `document.currentScript` is only readable while the script is EVALUATING,
 * which is here — read it later and it is null. Captured now so the default
 * works with no configuration: upload both files together and it finds its
 * sibling, wherever WordPress decided to put them.
 *
 * `villages-src` on the element overrides it, for a host that keeps its media
 * in one place and its scripts in another.
 */
const SCRIPT_URL = (document.currentScript as HTMLScriptElement | null)?.src ?? "";

/** Where the single-file build parks the village index. See `build.mjs`. */
const VILLAGES_INLINE_ID = "pmajay-villages-inline";

/** Injected by the build after the CSS is collected. See `build.mjs`. */
declare const __PMAJAY_CSS__: string;

class PmajayCoverageMap extends HTMLElement {
  private root?: ReturnType<typeof createRoot>;

  connectedCallback() {
    if (this.shadowRoot) return;

    /*
     * ── THREE WAYS THE VILLAGE INDEX ARRIVES, IN ORDER ────────────────────────
     *
     * 1. INLINE, from a `<script type="application/json">` in the same paste.
     *    This is the single-file build, where there is no second file to fetch
     *    because there was no second file to upload.
     * 2. An explicit `villages-src`, for a host that keeps its media in one
     *    place and its scripts in another.
     * 3. A sibling of the script's own URL — the two-file install, and the
     *    reason `document.currentScript` is captured at evaluation time.
     *
     * Inline wins because its presence is unambiguous: somebody put the data on
     * the page. A fetch that would only duplicate it is not worth the request.
     */
    const inline = document.getElementById(VILLAGES_INLINE_ID);
    const src = this.getAttribute("villages-src");
    if (inline?.textContent) {
      try {
        primeVillageIndex(JSON.parse(inline.textContent));
      } catch {
        // A truncated paste is the likely cause, and it must not take the card
        // down with it — the search falls back to its own error state, which is
        // designed, while the map and the ranked list are unaffected.
      }
    } else if (src) setVillageIndexSource(src);
    else if (SCRIPT_URL) {
      setVillageIndexSource(new URL("pmajay-villages.json", SCRIPT_URL).href);
    }

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = __PMAJAY_CSS__;
    shadow.appendChild(style);

    /*
     * The font-face has to live in the OUTER document.
     *
     * `@font-face` declared inside a shadow root is ignored — the font registry
     * is per-document, not per-tree. Icons rendered as ligature text without it
     * come out as the literal word "chevron_right", which is the single most
     * visible way this bundle can fail. Added once, however many cards a page
     * carries.
     */
    if (!document.getElementById("pmajay-embed-fontface")) {
      const face = document.createElement("style");
      face.id = "pmajay-embed-fontface";
      face.textContent = FONT_FACE;
      document.head.appendChild(face);
    }

    const mount = document.createElement("div");
    mount.className = "pmajay-standalone";
    shadow.appendChild(mount);

    this.root = createRoot(mount);
    this.root.render(
      <React.StrictMode>
        {/*
          The provider is here because `ProvenanceChip` and the merge read it.
          It is cookie-backed and defaults to marks OFF, which is right for a
          published page: the provenance marks are demo tooling, and a card
          drawing mirrored figures says so in its own banner instead.
        */}
        <DataModeProvider>
          <PmajayWorksMap data={DATA} />
        </DataModeProvider>
      </React.StrictMode>,
    );
  }

  disconnectedCallback() {
    // React roots hold listeners and a ResizeObserver; a page that removes the
    // element (a tab switch, a builder preview) must not leak them.
    this.root?.unmount();
    this.root = undefined;
  }
}

/*
 * ── THE ONE STYLE THIS EMBED PUTS IN THE HOST DOCUMENT, AND ITS ONLY ONE ───
 *
 * A font family, under a private name. `@font-face` cannot be declared inside a
 * shadow root — the registry is per-document — so this is unavoidable, and the
 * private name is what makes it harmless: it carries no selector, matches no
 * element, and defines a family no other stylesheet on the page references. The
 * build renames it in the shadow CSS to match. See `build.mjs`.
 */
const FONT_FACE = `@font-face{font-family:"PMAJAY Symbols";font-style:normal;font-weight:100 700;font-display:block;src:url("https://fonts.gstatic.com/s/materialsymbolsrounded/v358/sykg-zNym6YjUruM-QrEh7-nyTnjDwKNJ_190FjzaqkNCeE.woff2") format("woff2")}`;

if (!customElements.get("pmajay-coverage-map")) {
  customElements.define("pmajay-coverage-map", PmajayCoverageMap);
}
