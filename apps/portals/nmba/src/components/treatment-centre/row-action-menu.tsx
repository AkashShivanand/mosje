"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import type { RowActionTone } from "./row-actions";

/**
 * Accessible "More actions" menu for dense table rows.
 *
 * Implements the WAI-ARIA menu-button pattern: a labelled trigger
 * (`aria-haspopup="menu"` + `aria-expanded`) opens a `role="menu"` of labelled
 * `role="menuitem"` buttons. Unlike icon-only row actions, every option here
 * carries VISIBLE text — closing the cognitive/discoverability gap GIGW flags
 * for non-universal icons (Upload / Training / Volunteers).
 *
 * The menu is portalled to <body> and fixed-positioned so it is never clipped
 * by the table's `overflow` scroll container (design.md overlay rule). Closes
 * on Escape, outside click, scroll/resize, or selection; focus returns to the
 * trigger.
 */

const ITEM_TONES: Record<RowActionTone, string> = {
  neutral: "text-ink hover:bg-navy/10",
  warning: "text-await-fg hover:bg-await-bg",
  danger: "text-danger-fg hover:bg-danger-bg",
};

export interface RowActionMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  tone?: RowActionTone;
}

export function RowActionMenu({ label, items }: { label: string; items: RowActionMenuItem[] }) {
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<{ top: number; right: number } | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const place = React.useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    // Flip above the trigger when there isn't room for the menu below it.
    const estHeight = items.length * 40 + 8;
    const roomBelow = window.innerHeight - r.bottom;
    const top = roomBelow >= estHeight + 8 ? r.bottom + 4 : Math.max(8, r.top - estHeight - 4);
    setCoords({ top, right: Math.max(8, window.innerWidth - r.right) });
  }, [items.length]);

  const openMenu = () => {
    place();
    setOpen(true);
  };
  const closeMenu = React.useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Focus the first item once the menu is mounted.
  React.useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  // Dismiss on outside interaction / viewport changes.
  React.useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
        closeMenu(false);
      }
    };
    const onScrollResize = () => closeMenu(false);
    document.addEventListener("pointerdown", onDocPointer, true);
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer, true);
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [open, closeMenu]);

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const nodes = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const idx = nodes.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      nodes[(idx + 1) % nodes.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      nodes[(idx - 1 + nodes.length) % nodes.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      nodes[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      nodes[nodes.length - 1]?.focus();
    } else if (e.key === "Tab") {
      closeMenu(false);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition active:scale-95 hover:bg-navy/10 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden />
      </button>

      {open && coords && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={label}
              onKeyDown={onMenuKeyDown}
              style={{ position: "fixed", top: coords.top, right: coords.right, zIndex: 60 }}
              className="min-w-52 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg"
            >
              {items.map(({ icon: Icon, label: itemLabel, onClick, tone = "neutral" }) => (
                <button
                  key={itemLabel}
                  type="button"
                  role="menuitem"
                  onClick={() => { closeMenu(false); onClick(); }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:bg-navy/10 ${ITEM_TONES[tone]}`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {itemLabel}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
