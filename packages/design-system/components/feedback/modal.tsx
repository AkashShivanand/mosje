"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import "./modal.css";

/**
 * Set on `<html>` for as long as ANY dialog is open. The floating rails read it
 * and stand down — see the `[data-sa-dialog-open]` rule in `modal.css`.
 *
 * The UX4G accessibility panel is deliberately NOT covered by that rule: it is
 * third-party markup at 999999, statutory, and not ours to push behind a scrim.
 */
const DIALOG_OPEN_ATTR = "data-sa-dialog-open";
let OPEN_DIALOGS = 0;

export type ModalSize = "sm" | "md" | "lg";

/** The wording of the question a `dirty` dialog asks before it closes. Every part has a default. */
export interface ModalDiscardPrompt {
  /** @default "Discard Your Changes?" */
  title?: string;
  /** @default "What you have entered in this form will be lost." */
  body?: string;
  /** The safe choice, and where focus lands. @default "Keep Editing" */
  keepLabel?: string;
  /** @default "Discard" */
  discardLabel?: string;
}

export interface ModalProps {
  /** Whether the dialog is open. */
  open: boolean;
  /**
   * Called on Escape, backdrop click, or the close button — after the reader confirms, when the
   * dialog is `dirty`.
   */
  onClose: () => void;
  /**
   * The dialog holds input the reader would lose by closing it. While true, Escape, a press
   * outside the panel and the close button ask "Discard Your Changes?" (Keep Editing / Discard)
   * instead of closing. Footer buttons are the consumer's own and are not intercepted — a
   * Cancel button is an explicit choice. @default false
   */
  dirty?: boolean;
  /** Wording of the discard question asked when `dirty`. */
  discardPrompt?: ModalDiscardPrompt;
  /**
   * Printing the page while this dialog is open prints the dialog alone — its title and body,
   * without the page behind it, the close button or the footer. For a report or a receipt a
   * reader may need on paper. The consumer supplies the Print action. @default false
   */
  printable?: boolean;
  /** Accessible title (rendered as the dialog heading and wired to aria-labelledby). */
  title: React.ReactNode;
  /** Body content. */
  children: React.ReactNode;
  /** Optional footer (action buttons). */
  footer?: React.ReactNode;
  /** Max-width preset. @default "md" */
  size?: ModalSize;
  /** Hide the default close (×) button. @default false */
  hideClose?: boolean;
  className?: string;
}

const IcClose = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The selector matches things that CANNOT actually take focus: a control inside
 * a `hidden` branch, one in a collapsed accordion, one inside an `inert`
 * subtree. Tabbing to one of those does nothing, so the trap would appear to
 * swallow the key.
 *
 * `getClientRects()` rather than `offsetParent`, which is null for anything
 * `position: fixed` and would drop a pinned control from the list.
 */
/**
 * The UX4G accessibility widget's own surfaces: the full-screen offer it shows on the FIRST Tab of
 * a page ("Press Enter to open accessibility option, or press Tab again to continue") and its
 * menu. Known by id because it is third-party markup — the same exception the corner rail makes
 * for `#uw-widget-custom-trigger`. Statutory, above every scrim, and never ours to override.
 */
const UX4G_WIDGET = "#accessibility-overlay, #uw-main";

function isReachable(el: HTMLElement): boolean {
  if (el.closest("[inert]")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;
  return el.getClientRects().length > 0;
}

/**
 * MoSJE / SAMAVESH Modal — the shared accessible dialog.
 *
 * Bakes in everything every portal was re-implementing by hand: a backdrop,
 * `role="dialog"` + `aria-modal` + `aria-labelledby` on the panel, a focus
 * trap, Escape-to-close, and focus restoration to the opener. Token-driven CSS.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  hideClose = false,
  dirty = false,
  discardPrompt,
  printable = false,
  className,
}: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const confirmRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const confirmTitleId = React.useId();
  const confirmBodyId = React.useId();

  /*
   * ── THE DISCARD GUARD (usability audit UX-06, 14 Sep 2026) ─────────────────────────────────
   *
   * Escape and a press outside closed every dialog at once, and a dialog is where this estate
   * keeps its forms: five typed bank-account fields and an inspector's findings were each lost
   * to one stray key. A `dirty` dialog now asks first.
   *
   * The question is drawn INSIDE this component, on a layer over the panel, not as a second
   * `<Modal>`. Two Modals would be two document keydown listeners and two focus traps racing
   * for the same Escape — the outer one would close while the inner one opened.
   *
   * While the question is up the panel is `inert`, the trap cycles the question's two buttons,
   * Escape means Keep Editing, and a press on the scrim does nothing: a reader who is being
   * asked whether to throw work away should not have it thrown away by a second stray click.
   */
  const [confirming, setConfirming] = React.useState(false);
  const confirmingRef = React.useRef(false);
  const dirtyRef = React.useRef(dirty);
  /** Where focus was when the question was asked, so Keep Editing puts the reader back there. */
  const resumeRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    dirtyRef.current = dirty;
  });

  /**
   * Held in a ref so the focus-trap effect below can depend on `open` alone.
   * Callers almost always pass an inline arrow (`onClose={() => setOpen(false)}`),
   * which is a new function identity on every parent render. With `onClose` in
   * the dependency array the effect tore down and re-ran on every keystroke in
   * any controlled input inside the dialog: the cleanup refocused the opener
   * and the re-init refocused the panel's first control, so typing was
   * impossible and a stray Enter could fire the close button.
   */
  const onCloseRef = React.useRef(onClose);
  /**
   * Synced in an effect, not written during render. A ref write during render is
   * not allowed — under StrictMode's double render and under concurrent
   * rendering a render can be started and thrown away, and this one would have
   * left `onCloseRef.current` pointing at a callback from a render that never
   * committed. No dependency array, so it re-syncs after every commit; the ref
   * is only ever READ from the key handler below, which fires long after.
   */
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  const requestClose = React.useCallback(() => {
    if (confirmingRef.current) return;
    if (!dirtyRef.current) {
      onCloseRef.current();
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    resumeRef.current = active && panelRef.current?.contains(active) ? active : null;
    confirmingRef.current = true;
    setConfirming(true);
  }, []);

  const keepEditing = React.useCallback(() => {
    confirmingRef.current = false;
    setConfirming(false);
  }, []);

  const discard = React.useCallback(() => {
    confirmingRef.current = false;
    setConfirming(false);
    resumeRef.current = null;
    onCloseRef.current();
  }, []);

  // A dialog closed from outside (its `open` turned false) does not come back still asking.
  React.useEffect(() => {
    if (!open && confirmingRef.current) keepEditing();
  }, [open, keepEditing]);

  /*
   * Focus for the question: on to Keep Editing when it opens — the choice that loses nothing —
   * and back to the control the reader left when it closes, or the panel's first control if that
   * one has gone. `inert` is set through the DOM property so the prop needs no React version.
   */
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    panel.inert = confirming;
    if (confirming) {
      confirmRef.current?.querySelector<HTMLElement>("button")?.focus();
      return;
    }
    const resume = resumeRef.current;
    resumeRef.current = null;
    if (resume) {
      if (panel.contains(resume) && isReachable(resume)) resume.focus();
      else Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isReachable)[0]?.focus();
    }
  }, [confirming, open]);

  React.useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    /*
     * The same reachability filter the trap uses, for the same reason: the
     * selector matches controls that cannot take focus, and `querySelector`
     * would have handed the first of those to `.focus()` — a no-op that leaves
     * focus on whatever opened the dialog, outside it. The panel is the
     * fallback, so focus is always inside on the first frame.
     */
    const opening = Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
      isReachable,
    );
    (opening[0] ?? panel)?.focus();

    // Lock background scroll while the dialog is open so pointer/switch users
    // can't interact with the page behind the modal (WCAG 2.4.3, GIGW).
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /*
     * TELL THE PAGE A DIALOG OWNS IT, so the floating rails can step back.
     *
     * The wall rail and the corner stack sit at 1000 and 1010 — above every
     * product layer on purpose, because a launcher only has to beat page
     * chrome. That is right until a dialog opens, and then it is exactly wrong:
     * Important Links and the chat launcher went on floating at full strength
     * over a dimmed page, so the scrim covered everything except the two things
     * most obviously on top of it.
     *
     * Raising the dialog past them instead was the other option and it is worse.
     * The ladder deliberately puts `toast` (700) ABOVE `modal` — "a save
     * confirmation must be readable even while a dialog is open" — so a dialog
     * that climbed over the rails would climb over toasts on the way, and buy
     * one fix with a second defect.
     *
     * A COUNTER, not a boolean: a dialog opened from inside another must not
     * hand the page back when the inner one closes.
     */
    OPEN_DIALOGS += 1;
    document.documentElement.setAttribute(DIALOG_OPEN_ATTR, "");

    /*
     * THE LAST CONTROL FOCUSED INSIDE, so a Tab can be computed from where the reader actually
     * was. The UX4G accessibility widget listens for Tab ahead of this handler and moves focus to
     * its own skip link ("open-the-accessibility-menu") before we see the key, so
     * `document.activeElement` read here was OUTSIDE the panel — and the "focus is outside, go to
     * the first control" branch below sent every Tab from a date field to the close button
     * (usability audit UX-09, Schedule Inspection, 14 Sep 2026). Measured by logging focusin:
     * input → skip link → Close dialog.
     */
    let lastInside: HTMLElement | null = null;
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      const layer = confirmingRef.current ? confirmRef.current : panel;
      if (t && layer?.contains(t)) lastInside = t;
    };

    const onKey = (e: KeyboardEvent) => {
      const current = document.activeElement as HTMLElement | null;
      /*
       * THE WIDGET'S TURN. Its document listener runs before this one: on a page's first Tab it
       * shows its offer and focuses its button; on the second it hides the offer. While its
       * offer or menu is visible and holds focus, the key is the widget's — Escape closes the
       * offer, not the dialog, and Tab is its to handle. Once it hides its button, the next
       * branch below resumes from the control the reader left.
       */
      const inWidget = !!current && !panel?.contains(current) && !!current.closest(UX4G_WIDGET);
      // Escape is checked without reachability: the widget has already hidden its button by now.
      if (current && inWidget && (e.key === "Escape" || isReachable(current))) return;

      if (e.key === "Escape") {
        /* A control inside that used Escape for itself — the Date Picker's calendar closing —
           has already answered it. Closing the dialog as well took the whole form with it. */
        if (e.defaultPrevented) return;
        if (confirmingRef.current) keepEditing();
        else requestClose();
        return;
      }
      /* While the discard question is up it is the dialog: the trap cycles its buttons. */
      const scope = confirmingRef.current ? confirmRef.current : panel;
      if (e.key !== "Tab" || !scope) return;

      /*
       * ── EVERY TAB IS INTERCEPTED, NOT ONLY THE ONES AT THE EDGES ─────────
       *
       * This used to call `preventDefault()` only when focus sat on the first
       * or last control, and let the browser handle everything between them.
       * That is correct exactly as long as the browser's sequential focus order
       * inside the panel matches this list's document order — and on this
       * estate it does not.
       *
       * Every public page loads the UX4G accessibility widget, which injects
       * NINETEEN elements carrying a POSITIVE `tabindex` (1 through 11).
       * Positive tabindex is visited BEFORE every `tabindex=0` element in the
       * sequential order, so the browser's "next" from any control in any
       * dialog was one of the widget's buttons, sitting behind the scrim. A
       * keyboard or switch user tabbing inside a dialog left it on the first
       * press, with nothing to tell them they had.
       *
       * Measured on the NMBA organisation page, 10 September 2026: Tab from a
       * dialog's first control landed on `.ux4g-accessibility-skip-link`.
       *
       * So the order inside the dialog is this list's order and no other, and
       * the browser is never asked. That also fixes the reverse case for free —
       * `first`/`last` were the only two positions the old handler could
       * recognise, so a dialog whose focus had already been stolen could not
       * recover.
       *
       * ── THE ONE THING THIS WOULD BREAK ──────────────────────────────────
       *
       * A dialog containing a popup that RENDERS ITSELF ELSEWHERE in the DOM —
       * `Menu`, `Popover`, `TimePicker` all portal — would have that popup's
       * controls outside `panel`, and unreachable by Tab. Audited on 10
       * September across all ~40 `<Modal>` call sites: none nests one, and
       * `Menu`'s items carry `tabIndex={-1}` because they are arrow-key
       * navigated, so they were never in this list anyway. If a dialog ever
       * does nest a portalled popup with Tab-reachable content, this is the
       * code that has to learn about it.
       */
      const f = Array.from(scope.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isReachable);

      // A dialog with nothing to focus still must not leak. Hold the key and
      // put focus on the panel itself.
      if (f.length === 0) {
        e.preventDefault();
        scope.focus();
        return;
      }

      e.preventDefault();

      // Focus taken outside by someone else's Tab handler: count from where the reader was.
      const active = current && scope.contains(current) ? current : lastInside && scope.contains(lastInside) ? lastInside : current;
      const at = active ? f.indexOf(active) : -1;

      /*
       * `at === -1` means focus is not on one of the dialog's own controls —
       * it is on the panel (where the effect puts it when there is nothing to
       * focus), or something outside has taken it. Either way the next press
       * should land INSIDE, at the end nearest the direction of travel.
       */
      if (at === -1) {
        (e.shiftKey ? f[f.length - 1] : f[0])?.focus();
        return;
      }

      const next = e.shiftKey ? (at - 1 + f.length) % f.length : (at + 1) % f.length;
      f[next]?.focus();
    };
    /*
      CLOSE-ON-OUTSIDE LIVES HERE, NOT ON THE BACKDROP.
      It used to be `onMouseDown={onClose}` on the backdrop div, which had two
      problems. The small one is that a non-interactive element holding a mouse
      handler is a real accessibility smell — it advertises itself to assistive
      technology as operable while offering no keyboard path.

      The larger one is a bug: `mousedown` fires wherever the press LANDS, so
      selecting text inside the dialog and releasing past its edge closed the
      modal mid-drag and threw the selection away. Requiring the press to both
      start AND end outside the panel fixes that, and it is only expressible
      from a document listener.

      Escape and the close button remain the keyboard ways out.
    */
    let pressedOutside = false;
    const onDown = (e: MouseEvent) => {
      // The demo tools are not part of the page a dialog sits on: filling the open form from the
      // dock must not read as dismissing it (which asked to discard the answers being filled).
      if ((e.target as Element | null)?.closest?.("[data-sa-demo-tools]")) {
        pressedOutside = false;
        return;
      }
      pressedOutside = !!panel && !panel.contains(e.target as Node);
    };
    const onUp = (e: MouseEvent) => {
      if (pressedOutside && panel && !panel.contains(e.target as Node)) requestClose();
      pressedOutside = false;
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.body.style.overflow = prevOverflow;
      OPEN_DIALOGS = Math.max(0, OPEN_DIALOGS - 1);
      if (OPEN_DIALOGS === 0) document.documentElement.removeAttribute(DIALOG_OPEN_ATTR);
      opener?.focus?.();
    };
  }, [open, requestClose, keepEditing]);

  if (!open) return null;

  const prompt = {
    title: discardPrompt?.title ?? "Discard Your Changes?",
    body: discardPrompt?.body ?? "What you have entered in this form will be lost.",
    keepLabel: discardPrompt?.keepLabel ?? "Keep Editing",
    discardLabel: discardPrompt?.discardLabel ?? "Discard",
  };

  // The backdrop is `presentation` and holds no handler — see the effect above.
  return (
    <div className={cn("ds-modal__backdrop", printable && "ds-modal__backdrop--printable")} role="presentation">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        /* Programmatically focusable, never in the tab order: it is where focus
           goes when a dialog has no controls of its own, so the trap has
           somewhere to hold it. */
        tabIndex={-1}
        aria-labelledby={titleId}
        className={cn("ds-modal", `ds-modal--${size}`, printable && "ds-modal--printable", className)}
      >
        <div className="ds-modal__header">
          <h2 id={titleId} className="ds-modal__title">{title}</h2>
          {!hideClose && (
            <button type="button" className="ds-modal__close" aria-label="Close dialog" onClick={requestClose}>
              <IcClose />
            </button>
          )}
        </div>
        <div className="ds-modal__body">{children}</div>
        {footer && <div className="ds-modal__footer">{footer}</div>}
      </div>
      {confirming && (
        <div className="ds-modal__discard-layer">
          <div
            ref={confirmRef}
            role="alertdialog"
            aria-modal="true"
            tabIndex={-1}
            aria-labelledby={confirmTitleId}
            aria-describedby={confirmBodyId}
            className="ds-modal ds-modal--sm ds-modal__discard"
          >
            <div className="ds-modal__header">
              <h2 id={confirmTitleId} className="ds-modal__title">{prompt.title}</h2>
            </div>
            <div className="ds-modal__body">
              <p id={confirmBodyId} className="ds-modal__discard-body">{prompt.body}</p>
            </div>
            <div className="ds-modal__footer">
              <Button appearance="outlined" onClick={keepEditing}>{prompt.keepLabel}</Button>
              <Button variant="danger" onClick={discard}>{prompt.discardLabel}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
