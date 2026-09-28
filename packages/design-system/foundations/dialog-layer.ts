import * as React from "react";

/**
 * THE DIALOG LAYER — how a page-blocking dialog tells the floating rails to step back.
 *
 * Set on `<html>` for as long as ANY `aria-modal` dialog is open. `dialog-layer.css`
 * reads it and drops every element marked `data-sa-wall-occupant` or
 * `data-sa-corner-occupant` to `--sa-z-base`, under the dialog's scrim; the demo dock
 * follows the same attribute from its own stylesheet. The UX4G accessibility panel is
 * deliberately NOT covered: third-party, statutory, and never ours to push behind a
 * scrim. The decision and its reasons: `.claude/rules/floating-element-placement.md`
 * § "While a dialog is open".
 *
 * Every page-blocking dialog calls this — Modal, Lightbox, SideSheet, NavSheet, and any
 * app dialog that is `aria-modal="true"`. Until 28 Sep 2026 only Modal did, with a
 * private copy of this counter, so the chat launcher and the demo dock went on floating
 * over the Lightbox, the side sheet and the mobile navigation sheet. One helper is how
 * a dialog added tomorrow cannot forget.
 *
 * NOT for a non-modal surface — Popover, DatePicker, a Menu. Those leave the page usable,
 * and pushing the rails down under them would hide the launcher for no reason.
 */
export const DIALOG_OPEN_ATTR = "data-sa-dialog-open";

/** The two calls the counter needs — `document.documentElement` in the browser. */
export interface DialogLayerRoot {
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

/*
 * A COUNTER, not a boolean: a dialog opened from inside another must not hand the page
 * back when the inner one closes. Module-level, so it is shared by every dialog on the
 * page whichever component drew it.
 */
let openDialogs = 0;

/**
 * Mark the page as owned by a dialog. Returns the release; calling it twice is safe, so
 * an effect cleanup that React runs twice in development cannot unbalance the count.
 */
export function openDialogLayer(root?: DialogLayerRoot): () => void {
  const target = root ?? (typeof document === "undefined" ? null : document.documentElement);
  if (!target) return () => {};
  openDialogs += 1;
  target.setAttribute(DIALOG_OPEN_ATTR, "");
  let released = false;
  return () => {
    if (released) return;
    released = true;
    openDialogs = Math.max(0, openDialogs - 1);
    if (openDialogs === 0) target.removeAttribute(DIALOG_OPEN_ATTR);
  };
}

/** `openDialogLayer` for as long as `active` is true — the form a dialog component uses. */
export function useDialogLayer(active: boolean): void {
  React.useEffect(() => (active ? openDialogLayer() : undefined), [active]);
}
