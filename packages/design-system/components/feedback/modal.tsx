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
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

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
      const f = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
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
