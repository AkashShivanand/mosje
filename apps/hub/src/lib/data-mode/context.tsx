"use client";

import * as React from "react";
import type { CardStateKind } from "@mosje/design-system";
import {
  DATA_MODES,
  DEFAULT_DATA_MODE,
  PREVIEW_STATES,
  type DataMode,
  type PreviewScope,
  type PreviewState,
} from "./types";

/**
 * Which data mode the viewer has chosen, and how it survives a reload.
 *
 * DELIBERATELY CLIENT-SIDE, and that is the load-bearing decision. Resolving the
 * mode on the server would mean reading a cookie during render, which opts the
 * whole `[...slug]` route out of static generation — 178 organisation pages made
 * dynamic so that three of them can carry a demo toggle. Instead the server
 * sends BOTH the live reading and the snapshot, and the merge runs in the
 * browser. Static rendering survives, the toggle is instant with no round trip,
 * and the merge stays one pure function rather than a fallback expression
 * scattered through the components.
 *
 * The cost is the same one `ColorModeProvider` already accepts: the first paint
 * uses the default and reconciles with the cookie on mount. This follows that
 * pattern rather than inventing a second one.
 */

export interface DemoDataSettings {
  mode: DataMode;
  /**
   * Whether provenance marks are drawn. DEFAULT FALSE, and that is a product
   * decision rather than an oversight.
   *
   * The marks exist so an illustrative figure cannot be mistaken for a
   * departmental one. But this prototype's job is to show stakeholders what the
   * finished service looks like, and a row of badges is not part of the
   * finished service — it is scaffolding, and scaffolding in every screenshot
   * makes the thing look unfinished when it is not.
   *
   * The resolution is that the marks are one click away, in the SAME panel that
   * chose the data mode. Whoever is driving the demo can answer "is that
   * number real?" instantly. What is given up is the guarantee that a
   * screenshot taken WITHOUT the presenter's knowledge carries its own
   * disclosure — a real trade, made deliberately, and the reason the Data tab
   * says so in as many words.
   */
  marks: boolean;
  preview: PreviewState;
  previewScope: PreviewScope;
}

interface DataModeContextValue extends DemoDataSettings {
  setMode: (mode: DataMode) => void;
  setMarks: (on: boolean) => void;
  setPreview: (p: PreviewState) => void;
  setPreviewScope: (s: PreviewScope) => void;
  modes: readonly DataMode[];
}

const DEFAULTS: DemoDataSettings = {
  mode: DEFAULT_DATA_MODE,
  marks: false,
  preview: "normal",
  previewScope: "all",
};

const DataModeContext = React.createContext<DataModeContextValue | null>(null);

export const DATA_MODE_COOKIE = "sa-demo-data";
/** A year. It is a demo preference, not a session. */
const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * All four settings in ONE cookie, pipe-delimited: `mode|marks|preview|scope`.
 *
 * One cookie rather than four because they are read together on every render
 * and are meaningless apart, and pipe-delimited rather than JSON because a
 * malformed value must degrade to the defaults silently — a demo control is
 * never worth an exception on a government page.
 */
function serialise(s: DemoDataSettings): string {
  return [s.mode, s.marks ? "1" : "0", s.preview, s.previewScope].join("|");
}

function parse(raw: string | null | undefined): DemoDataSettings {
  if (!raw) return DEFAULTS;
  const [mode, marks, preview, scope] = raw.split("|");
  return {
    mode: DATA_MODES.includes(mode as DataMode) ? (mode as DataMode) : DEFAULTS.mode,
    marks: marks === "1",
    preview: PREVIEW_STATES.includes(preview as PreviewState)
      ? (preview as PreviewState)
      : DEFAULTS.preview,
    previewScope: scope === "one" ? "one" : "all",
  };
}

function readCookie(): string {
  if (typeof document === "undefined") return "";
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${DATA_MODE_COOKIE}=`));
  return hit ? decodeURIComponent(hit.slice(DATA_MODE_COOKIE.length + 1)) : "";
}

/**
 * The store the cookie is read through.
 *
 * `useSyncExternalStore` rather than an effect, and that is not a style choice:
 * setting state inside an effect to reconcile with a client-only value triggers
 * a second render pass on every mount, which is what React's
 * `set-state-in-effect` rule exists to stop. This gives React a server snapshot
 * (the default) and a client snapshot (the cookie), and it resolves the
 * difference during hydration on its own.
 */
const CHANGED = "sa-data-mode-changed";

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function DataModeProvider({ children }: { children: React.ReactNode }) {
  const raw = React.useSyncExternalStore(subscribe, readCookie, () => "");
  const settings = React.useMemo(() => parse(raw), [raw]);

  const write = React.useCallback((next: DemoDataSettings) => {
    document.cookie = `${DATA_MODE_COOKIE}=${encodeURIComponent(serialise(next))};path=/;max-age=${MAX_AGE};samesite=lax`;
    window.dispatchEvent(new Event(CHANGED));
  }, []);

  const value = React.useMemo<DataModeContextValue>(
    () => ({
      ...settings,
      setMode: (mode) => write({ ...settings, mode }),
      setMarks: (marks) => write({ ...settings, marks }),
      setPreview: (preview) => write({ ...settings, preview }),
      setPreviewScope: (previewScope) => write({ ...settings, previewScope }),
      modes: DATA_MODES,
    }),
    [settings, write],
  );
  return <DataModeContext.Provider value={value}>{children}</DataModeContext.Provider>;
}

/**
 * The demo data settings. Falls back to the defaults outside a provider rather
 * than throwing: a dashboard rendered in Storybook or a test has no demo rail,
 * and refusing to render there would be worse than showing the real behaviour.
 */
export function useDataMode(): DataModeContextValue {
  const ctx = React.useContext(DataModeContext);
  return (
    ctx ?? {
      ...DEFAULTS,
      setMode: () => {},
      setMarks: () => {},
      setPreview: () => {},
      setPreviewScope: () => {},
      modes: DATA_MODES,
    }
  );
}

/**
 * The state one card should render, given its position in the grid.
 *
 * "One card" means the FIRST card, and that is deliberate rather than lazy:
 * which card fails matters far less to a walkthrough than showing that one CAN
 * fail while the rest of the page stays trustworthy, and a card picker would be
 * a registry to keep in step with every dashboard for no gain. The panel says
 * so in as many words.
 */
export function cardStateFor(
  settings: Pick<DemoDataSettings, "preview" | "previewScope">,
  index: number,
): { loading?: boolean; state?: CardStateKind } {
  if (settings.preview === "normal") return {};
  if (settings.previewScope === "one" && index !== 0) return {};
  if (settings.preview === "loading") return { loading: true };
  return { state: settings.preview };
}
