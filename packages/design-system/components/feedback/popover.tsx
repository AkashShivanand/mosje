"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { mergeRefs } from "../../utils/merge-refs";
import {
  focusableWithin,
  useAnchoredPosition,
  useDismissOnOutside,
  type AnchorAlign,
  type AnchorSide,
} from "../../foundations/anchor";
import "./popover.css";

export interface PopoverApi {
  /** Close the panel and return focus to the trigger. */
  close: () => void;
}

export interface PopoverProps {
  /**
   * The panel's contents. Pass a function to receive `close`, which is what a
   * panel with its own confirm or cancel button needs.
   */
  content: React.ReactNode | ((api: PopoverApi) => React.ReactNode);
  /**
   * The panel's accessible name, announced when focus enters it. Required:
   * a dialog with no name is announced as "dialog" and tells a screen-reader
   * user nothing about what just opened.
   */
  label: string;
  /** Preferred side. Flips automatically when there is no room. @default "bottom" */
  side?: AnchorSide;
  /**
   * Cross-axis alignment. `start` by default, not `center`: a panel whose left
   * edge lines up with its trigger reads as belonging to it.
   * @default "start"
   */
  align?: AnchorAlign;
  /** Gap between the trigger and the panel, in px. @default 8 */
  sideOffset?: number;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called on every open and close, in both controlled and uncontrolled use. */
  onOpenChange?: (open: boolean) => void;
  /** Prevent opening without unmounting the trigger. */
  disabled?: boolean;
  /**
   * Constrain the panel's width to the trigger's. Use it for a picker that
   * belongs to a field; leave it off for a panel of arbitrary content.
   */
  matchTriggerWidth?: boolean;
  className?: string;
  /**
   * The trigger. Must be a single element that can hold a ref and an
   * `onClick` — a `<button>` or a DS component that forwards its ref. A
   * non-focusable trigger makes the panel unreachable by keyboard.
   */
  children: React.ReactElement;
}

/**
 * MoSJE / SAMAVESH Popover.
 *
 * A dismissible panel anchored to a trigger, holding content a citizen or an
 * officer can interact with — a filter, a field's full guidance, a row's
 * actions, a confirmation.
 *
 * **It is not a Tooltip.** A tooltip describes its trigger, contains no
 * controls, opens on hover and is announced through `aria-describedby`. A
 * popover is a non-modal `dialog`: it takes focus, holds controls, and opens
 * on click. Putting a link or a button inside a tooltip makes it unreachable —
 * hover-opened content cannot be tabbed into. That is the whole reason this
 * component exists.
 *
 * Behaviour, in the terms WCAG states them:
 * - **Keyboard operable** (2.1.1) — opens on click or Enter/Space on the
 *   trigger, moves focus into the panel, and every control inside is reachable.
 * - **No keyboard trap** (2.1.2) — it is non-modal. Tabbing past the last
 *   control leaves the panel and closes it; focus continues into the page.
 * - **Focus visible** (2.4.7) and **focus order** (2.4.3) — Escape closes and
 *   returns focus to the trigger, so a keyboard user is never dropped at the
 *   top of the document.
 * - **Status changes** — `aria-expanded` on the trigger reports the state
 *   without an announcement of its own.
 *
 * Renders through a portal at `position: fixed`, so no ancestor's
 * `overflow: hidden` can clip it, and shares the estate's one placement engine
 * (`foundations/anchor.ts`) with Tooltip, Menu and the pickers.
 */
export function Popover({
  content,
  label,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  matchTriggerWidth = false,
  className,
  children,
}: PopoverProps): React.JSX.Element {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = React.useRef<HTMLElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();

  // Portals need a DOM node, which does not exist during SSR. Gate on a mounted
  // flag so the server and the first client render agree.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  /**
   * Close and put focus back where the user left it. Every close that the USER
   * initiated from the keyboard goes through here; a close caused by clicking
   * elsewhere deliberately does not, because focus already belongs to whatever
   * they clicked.
   */
  const closeAndRestore = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  const coords = useAnchoredPosition({
    open,
    side,
    align,
    offset: sideOffset,
    triggerRef,
    panelRef,
  });

  useDismissOnOutside(
    open,
    React.useMemo(() => [panelRef, triggerRef], []),
    React.useCallback(() => setOpen(false), [setOpen]),
  );

  // Escape closes from anywhere, including from inside a control in the panel.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      closeAndRestore();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeAndRestore]);

  /**
   * Move focus into the panel once it has been placed.
   *
   * Gated on `coords` rather than on `open`: focusing a panel still sitting at
   * 0,0 scrolls the page to the top-left corner before the panel jumps to its
   * real position, which is visible and disorienting.
   */
  React.useEffect(() => {
    if (!open || !coords) return;
    const panel = panelRef.current;
    if (!panel) return;
    if (panel.contains(document.activeElement)) return;
    const [first] = focusableWithin(panel);
    (first ?? panel).focus();
  }, [open, coords]);

  const child = children as React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;

  const trigger = React.cloneElement(child, {
    // MERGE, never assign — the consumer's own ref on the trigger is often
    // load-bearing, and React 19 removed reading `element.ref`.
    ref: mergeRefs(triggerRef, child.props.ref),
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? panelId : undefined,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(e);
      if (disabled || e.defaultPrevented) return;
      setOpen(!open);
    },
  });

  return (
    <>
      {trigger}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label={label}
            // Non-modal by design: the page behind stays operable, which is
            // what a filter panel or a row menu needs. A popover that has to
            // block the page is a Modal, and that component already exists.
            aria-modal={false}
            tabIndex={-1}
            className={cn("ds-popover", `ds-popover--${coords?.side ?? side}`, className)}
            style={{
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              width: matchTriggerWidth
                ? triggerRef.current?.getBoundingClientRect().width
                : undefined,
              // Measured before painted — see foundations/anchor.ts.
              visibility: coords ? "visible" : "hidden",
            }}
            onBlur={(e) => {
              // Tab out of the last control: non-modal means the panel closes
              // and focus carries on into the page, rather than being trapped.
              const next = e.relatedTarget as Node | null;
              if (!next) return;
              if (panelRef.current?.contains(next)) return;
              if (triggerRef.current?.contains(next)) return;
              setOpen(false);
            }}
          >
            {typeof content === "function"
              ? content({ close: closeAndRestore })
              : content}
          </div>,
          document.body,
        )}
    </>
  );
}
