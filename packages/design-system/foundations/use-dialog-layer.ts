/**
 * The dialog layer WITH its stylesheet — the entry every dialog imports.
 *
 * The attribute does nothing without `dialog-layer.css`, so the two travel together:
 * a page whose only dialog is an app's own `aria-modal` panel still gets the rule the
 * moment it calls the hook. `dialog-layer.ts` stays free of the CSS import so its unit
 * test runs under `node --test`.
 *
 * WRAPPERS, NOT RE-EXPORTS — and this is load-bearing. The package declares only
 * `**\/*.css` as having side effects, so a module that merely re-exports is skipped
 * by the bundler: the import resolves straight through to `dialog-layer.ts` and this
 * file's CSS import is dropped with it. That is exactly what happened on the first
 * attempt (28 Sep 2026) — the attribute was set and no rule was on the page. A
 * function defined HERE has to be kept, and keeping the module keeps its stylesheet.
 */
import "./dialog-layer.css";
import { DIALOG_OPEN_ATTR as ATTR, openDialogLayer as open, useDialogLayer as use, type DialogLayerRoot } from "./dialog-layer";

export type { DialogLayerRoot };

/** Set on `<html>` while any page-blocking dialog is open. */
export const DIALOG_OPEN_ATTR = ATTR;

/** Mark the page as owned by a dialog; returns the release. See `dialog-layer.ts`. */
export function openDialogLayer(root?: DialogLayerRoot): () => void {
  return open(root);
}

/** `openDialogLayer` for as long as `active` is true — the form a dialog component uses. */
export function useDialogLayer(active: boolean): void {
  use(active);
}
