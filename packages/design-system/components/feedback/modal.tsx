"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./modal.css";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called on Escape, backdrop click, or the close button. */
  onClose: () => void;
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
  className,
}: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

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

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

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
      const f = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isReachable);

      // A dialog with nothing to focus still must not leak. Hold the key and
      // put focus on the panel itself.
      if (f.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      e.preventDefault();

      const active = document.activeElement as HTMLElement | null;
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
      pressedOutside = !!panel && !panel.contains(e.target as Node);
    };
    const onUp = (e: MouseEvent) => {
      if (pressedOutside && panel && !panel.contains(e.target as Node)) onCloseRef.current();
      pressedOutside = false;
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  // The backdrop is `presentation` and holds no handler — see the effect above.
  return (
    <div className="ds-modal__backdrop" role="presentation">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        /* Programmatically focusable, never in the tab order: it is where focus
           goes when a dialog has no controls of its own, so the trap has
           somewhere to hold it. */
        tabIndex={-1}
        aria-labelledby={titleId}
        className={cn("ds-modal", `ds-modal--${size}`, className)}
      >
        <div className="ds-modal__header">
          <h2 id={titleId} className="ds-modal__title">{title}</h2>
          {!hideClose && (
            <button type="button" className="ds-modal__close" aria-label="Close dialog" onClick={onClose}>
              <IcClose />
            </button>
          )}
        </div>
        <div className="ds-modal__body">{children}</div>
        {footer && <div className="ds-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
