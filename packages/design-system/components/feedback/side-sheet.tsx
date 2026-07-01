"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./side-sheet.css";

export type SideSheetSize = "sm" | "md" | "lg";

export interface SideSheetProps {
  /** Whether the sheet is open. */
  open: boolean;
  /** Called on Escape, backdrop click, or the close button. */
  onClose: () => void;
  /** Accessible title (rendered as heading, wired to aria-labelledby). */
  title: React.ReactNode;
  /** Body content. */
  children: React.ReactNode;
  /** Optional sticky footer (action buttons). */
  footer?: React.ReactNode;
  /** Width preset. @default "md" */
  size?: SideSheetSize;
  className?: string;
}

const IcClose = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * MoSJE / SAMAVESH SideSheet — right-anchored panel for multi-field forms,
 * file-upload flows, and any task where the user benefits from seeing the
 * list context behind the panel.
 *
 * Use a Modal for ≤5-field forms and confirmations. Use SideSheet for:
 * - Forms with 6+ fields or textareas
 * - File upload + preview flows
 * - Any form that benefits from list context staying visible
 */
export function SideSheet({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
}: SideSheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
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
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="ds-sheet__backdrop" onMouseDown={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn("ds-sheet", `ds-sheet--${size}`, className)}
      >
        <div className="ds-sheet__header">
          <h2 id={titleId} className="ds-sheet__title">{title}</h2>
          <button type="button" className="ds-sheet__close" aria-label="Close panel" onClick={onClose}>
            <IcClose />
          </button>
        </div>
        <div className="ds-sheet__body">{children}</div>
        {footer && <div className="ds-sheet__footer">{footer}</div>}
      </div>
    </>
  );
}
