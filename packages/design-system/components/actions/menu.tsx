"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { mergeRefs } from "../../utils/merge-refs";
import { Icon } from "../utilities/icon";
import {
  useAnchoredPosition,
  useDismissOnOutside,
  type AnchorAlign,
  type AnchorSide,
} from "../../foundations/anchor";
import "./menu.css";

/** How an item behaves when chosen. */
export type MenuItemKind = "action" | "radio" | "checkbox";

/** What an item means. `danger` is for the one action that cannot be undone. */
export type MenuItemTone = "neutral" | "warning" | "danger";

export interface MenuItem {
  /** Stable identity. Also what `onSelect` receives. */
  id: string;
  /**
   * The item's visible text. Always visible, never icon-only: a row menu is
   * where the estate puts the actions whose icons are not universal, and an
   * unlabelled icon in a menu is the discoverability problem GIGW names.
   */
  label: string;
  /** Material Symbols name, drawn before the label. Decorative — the label carries the meaning. */
  icon?: string;
  /** One line under the label, for an action whose consequence is not obvious from its name. */
  description?: string;
  /** @default "action" */
  kind?: MenuItemKind;
  /** For `radio` and `checkbox` items. Ignored by `action`. */
  checked?: boolean;
  /** @default "neutral" */
  tone?: MenuItemTone;
  /**
   * Present but not choosable. The item stays in the menu and keeps
   * `aria-disabled`, so a screen-reader user still learns the action exists —
   * the native `disabled` attribute would remove it from the tree entirely.
   */
  disabled?: boolean;
}

/** A labelled divider between groups of items. */
export interface MenuSeparator {
  kind: "separator";
  /** Optional group heading rendered above the rule. */
  label?: string;
}

export type MenuEntry = MenuItem | MenuSeparator;

export interface MenuProps {
  /** The items, in the order they are offered. */
  items: MenuEntry[];
  /**
   * The menu's accessible name, announced when focus enters it. Required for
   * the same reason `Popover`'s is: an unnamed menu tells a screen-reader user
   * nothing about what has just opened.
   */
  label: string;
  /** Called with the chosen item's `id`. The menu closes and focus returns to the trigger. */
  onSelect: (id: string) => void;
  /** Preferred side. Flips automatically when there is no room. @default "bottom" */
  side?: AnchorSide;
  /** Cross-axis alignment. @default "end" */
  align?: AnchorAlign;
  /** Gap between the trigger and the menu, in px. @default 4 */
  sideOffset?: number;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Called on every open and close. */
  onOpenChange?: (open: boolean) => void;
  /** Prevent opening without unmounting the trigger. */
  disabled?: boolean;
  className?: string;
  /** The trigger. A `<button>` or a DS component that forwards its ref. */
  children: React.ReactElement;
}

function isSeparator(entry: MenuEntry): entry is MenuSeparator {
  return (entry as MenuSeparator).kind === "separator";
}

function roleFor(item: MenuItem): string {
  if (item.kind === "radio") return "menuitemradio";
  if (item.kind === "checkbox") return "menuitemcheckbox";
  return "menuitem";
}

/**
 * MoSJE / SAMAVESH Menu.
 *
 * The WAI-ARIA menu-button pattern: a trigger carrying `aria-haspopup="menu"`
 * opens a `role="menu"` of labelled items, focus moves onto the first one, and
 * the arrow keys move between them.
 *
 * **A menu is not a Popover and not a Select.** A popover is a dialog holding
 * arbitrary controls; a menu holds a list of *commands*, and that is why it has
 * its own roles and its own keyboard model. A `Select` edits a field's value and
 * submits with the form; a menu performs an action. Choosing the wrong one is
 * how a form ends up with a value a screen reader never announced.
 *
 * The keyboard model is the WAI-ARIA one, in full:
 * - **Down / Up** move between items and wrap.
 * - **Home / End** jump to the first and last.
 * - **Type-ahead** jumps to the next item whose label starts with what was
 *   typed, which is how a menu of twelve actions stays usable without a mouse.
 * - **Enter / Space** choose; **Escape** closes and returns focus to the
 *   trigger; **Tab** closes and lets focus continue into the page.
 *
 * A disabled item stays in the menu with `aria-disabled` and is skipped by the
 * arrow keys. It is never given the native `disabled` attribute, which would
 * drop it out of the accessibility tree — a screen-reader user would then not
 * learn that the action exists at all, which is worse than learning it is
 * unavailable.
 *
 * Portalled and fixed-positioned on the estate's shared placement engine
 * (`foundations/anchor.ts`), so a table's `overflow` cannot clip it and the menu
 * follows its row when the table scrolls.
 */
export function Menu({
  items,
  label,
  onSelect,
  side = "bottom",
  align = "end",
  sideOffset = 4,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  className,
  children,
}: MenuProps): React.JSX.Element {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = React.useRef<HTMLElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuId = React.useId();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

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
    panelRef: menuRef,
  });

  useDismissOnOutside(
    open,
    React.useMemo(() => [menuRef, triggerRef], []),
    React.useCallback(() => setOpen(false), [setOpen]),
  );

  /** The enabled items, which are the only ones the arrow keys visit. */
  const focusable = React.useCallback(
    () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          '[role^="menuitem"]:not([aria-disabled="true"])',
        ) ?? [],
      ),
    [],
  );

  // Focus the first item once the menu has been placed — focusing it while it
  // still sits at 0,0 scrolls the page to the corner before it jumps.
  React.useEffect(() => {
    if (!open || !coords) return;
    if (menuRef.current?.contains(document.activeElement)) return;
    focusable()[0]?.focus();
  }, [open, coords, focusable]);

  /** Type-ahead buffer. Cleared after a pause, as every desktop menu does. */
  const typed = React.useRef("");
  const typedTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  React.useEffect(() => () => clearTimeout(typedTimer.current), []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const nodes = focusable();
    if (nodes.length === 0) return;
    const index = nodes.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        nodes[(index + 1) % nodes.length]?.focus();
        return;
      case "ArrowUp":
        e.preventDefault();
        nodes[(index - 1 + nodes.length) % nodes.length]?.focus();
        return;
      case "Home":
        e.preventDefault();
        nodes[0]?.focus();
        return;
      case "End":
        e.preventDefault();
        nodes[nodes.length - 1]?.focus();
        return;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        closeAndRestore();
        return;
      case "Tab":
        // Non-modal: Tab leaves rather than cycling. Focus carries on into the
        // page from the trigger, which is where the reader logically is.
        setOpen(false);
        return;
      default:
        break;
    }

    // Type-ahead. Single printable characters only, so shortcuts are untouched.
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
    typed.current += e.key.toLowerCase();
    clearTimeout(typedTimer.current);
    typedTimer.current = setTimeout(() => {
      typed.current = "";
    }, 600);
    const match = nodes.find((node) =>
      (node.dataset.label ?? "").startsWith(typed.current),
    );
    if (match) {
      e.preventDefault();
      match.focus();
    }
  };

  const choose = (item: MenuItem) => {
    if (item.disabled) return;
    closeAndRestore();
    onSelect(item.id);
  };

  const child = children as React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;

  const trigger = React.cloneElement(child, {
    ref: mergeRefs(triggerRef, child.props.ref),
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(e);
      if (disabled || e.defaultPrevented) return;
      setOpen(!open);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      child.props.onKeyDown?.(e);
      // Down-arrow on a closed menu button opens it, as the pattern requires.
      if (e.key === "ArrowDown" && !open && !disabled) {
        e.preventDefault();
        setOpen(true);
      }
    },
  });

  return (
    <>
      {trigger}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            // Programmatically focusable, never a tab stop. The pattern puts
            // focus on the ITEMS, but a container with an interactive role has
            // to be able to receive focus — otherwise a re-render that removes
            // the focused item drops focus to <body> and the reader loses
            // their place entirely.
            tabIndex={-1}
            className={cn("ds-menu", className)}
            style={{
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              visibility: coords ? "visible" : "hidden",
            }}
            onKeyDown={onKeyDown}
          >
            {items.map((entry, i) =>
              isSeparator(entry) ? (
                <div key={`sep-${i}`} className="ds-menu__group" role="none">
                  {entry.label ? (
                    <span className="ds-menu__groupLabel">{entry.label}</span>
                  ) : null}
                  <span className="ds-menu__rule" />
                </div>
              ) : (
                <button
                  key={entry.id}
                  type="button"
                  role={roleFor(entry)}
                  // Roving tabindex: one stop for the whole menu, and the arrow
                  // keys move within it.
                  tabIndex={-1}
                  data-label={entry.label.toLowerCase()}
                  aria-disabled={entry.disabled || undefined}
                  aria-checked={
                    entry.kind === "radio" || entry.kind === "checkbox"
                      ? Boolean(entry.checked)
                      : undefined
                  }
                  className={cn(
                    "ds-menu__item",
                    `ds-menu__item--${entry.tone ?? "neutral"}`,
                  )}
                  onClick={() => choose(entry)}
                >
                  {entry.icon ? (
                    <Icon name={entry.icon} size={20} aria-hidden className="ds-menu__icon" />
                  ) : null}
                  <span className="ds-menu__text">
                    <span className="ds-menu__label">{entry.label}</span>
                    {entry.description ? (
                      <span className="ds-menu__description">{entry.description}</span>
                    ) : null}
                  </span>
                  {entry.kind === "radio" || entry.kind === "checkbox" ? (
                    <Icon
                      name="check"
                      size={20}
                      aria-hidden
                      className={cn(
                        "ds-menu__check",
                        entry.checked && "ds-menu__check--on",
                      )}
                    />
                  ) : null}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
