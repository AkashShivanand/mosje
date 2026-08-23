"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Icon } from "../utilities/icon";
import type { TabDef, TabSize } from "./tabs";

/**
 * The `Tabs / More` overflow trigger and its menu.
 *
 * INTERNAL — deliberately not exported from the package barrel. It is never
 * placed by a consumer; `Tabs` renders it when `overflow` is on and the row
 * cannot show every tab. Exporting it would invite someone to put a second one
 * somewhere it has no tablist to talk to.
 *
 * IT IS A MENU BUTTON, NOT A TAB. `role="button"`, `aria-haspopup="menu"`,
 * `aria-expanded` — never `role="tab"`, which would promise a panel that does
 * not exist and tell a screen-reader user there are more sections than there
 * are. That is also why it is rendered OUTSIDE the `role="tablist"` element:
 * a tablist's owned children are tabs, and a button among them is a lie about
 * the structure. Being outside is what keeps it pinned while the tabs scroll.
 *
 * WHAT IT DOES NOT DO: it does not remove tabs from the tablist. Every tab
 * stays rendered, focusable and arrow-reachable; this menu is a POINTER
 * shortcut. Moving tabs into a menu is the other common model — Polaris does
 * it — and it costs their `role="tab"`, their `aria-controls` and their place
 * in the roving tabindex, a worse trade than the scrolling it would save.
 *
 * IT LISTS EVERY TAB, NOT JUST THE HIDDEN ONES. The first build listed only
 * what was currently out of view, which meant opening the same menu at two
 * scroll positions gave two different lists — surprising, and something no
 * shipped system does. A stable "jump to any section" list is predictable, and
 * the current tab is marked rather than omitted so the menu always reads as a
 * complete picture of the set.
 */
export interface TabsOverflowProps {
  tabs: TabDef[];
  /** Index of the active tab, marked in the menu with `aria-checked`. */
  active: number;
  size: TabSize;
  /** Select a tab and scroll it into view. */
  onSelect: (index: number) => void;
  /** Accessible name for the trigger and the menu. */
  ariaLabel: string;
}

/** The first non-disabled position in `order`, walking from `from` by `dir`. */
function nextEnabled(order: number[], tabs: TabDef[], from: number, dir: 1 | -1): number {
  const n = order.length;
  for (let k = 1; k <= n; k++) {
    const p = (((from + dir * k) % n) + n) % n;
    if (!tabs[order[p]!]?.disabled) return p;
  }
  return from;
}

export function TabsOverflow({ tabs, active, size, onSelect, ariaLabel }: TabsOverflowProps) {
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = React.useId();

  // A portal needs a DOM node, which SSR has not got.
  React.useEffect(() => setMounted(true), []);

  const close = React.useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  /**
   * PORTALLED and `position: fixed`, for the same reason the Tooltip is: the
   * tablist itself sets `overflow-x: auto`, and any card or table above it may
   * set `overflow: hidden`. An in-flow menu would be clipped by the very
   * scroll container whose overflow it exists to resolve.
   */
  React.useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    const place = () => {
      const t = triggerRef.current?.getBoundingClientRect();
      const m = menuRef.current?.getBoundingClientRect();
      if (!t || !m) return;
      const margin = 8;
      // Below by default; flip above when the viewport has no room.
      const below = t.bottom + margin + m.height <= window.innerHeight;
      const top = below ? t.bottom + 4 : Math.max(margin, t.top - m.height - 4);
      // Right-aligned to the trigger — the trigger sits at the end of the row,
      // so a centred menu would hang off the edge.
      const left = Math.min(
        Math.max(margin, t.right - m.width),
        window.innerWidth - m.width - margin,
      );
      setCoords({ top, left });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, tabs.length]);

  // Focus the first enabled item on open — a menu that opens without moving
  // focus leaves a keyboard user stranded behind it.
  React.useEffect(() => {
    if (!open) return;
    // Open ON the current tab where possible — it is where the user's attention
    // already is, and it makes the menu a position indicator as well as a jump.
    const start = tabs[active]?.disabled ? tabs.findIndex((t) => !t.disabled) : active;
    requestAnimationFrame(() => itemRefs.current[start < 0 ? 0 : start]?.focus());
  }, [open, tabs, active]);

  // Escape closes and RETURNS FOCUS; an outside pointer closes and leaves it.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  const order = tabs.map((_, i) => i);

  const onItemKeyDown = (e: React.KeyboardEvent, pos: number) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowDown":
        next = nextEnabled(order, tabs, pos, 1);
        break;
      case "ArrowUp":
        next = nextEnabled(order, tabs, pos, -1);
        break;
      case "Home":
        next = nextEnabled(order, tabs, -1, 1);
        break;
      case "End":
        next = nextEnabled(order, tabs, 0, -1);
        break;
      case "Tab":
        // A menu is not a dialog: Tab leaves it rather than cycling inside.
        close(false);
        return;
      default:
        return;
    }
    e.preventDefault();
    itemRefs.current[next]?.focus();
  };

  const iconSize = size === "l" ? 24 : 20;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        // Icon-only, so the NAME lives here. Without it a screen reader
        // announces the ligature "more horiz".
        aria-label={ariaLabel}
        className={`ds-tabs__more${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Icon name="more_horiz" size={iconSize} className="ds-tabs__more-icon" />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={ariaLabel}
            className="ds-tabs__menu"
            style={{
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              // Measured before it is painted, exactly as the Tooltip does —
              // otherwise it visibly jumps from the corner to its real place.
              visibility: coords ? "visible" : "hidden",
            }}
          >
            {tabs.map((t, index) => {
              const pos = index;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    itemRefs.current[pos] = el;
                  }}
                  type="button"
                  // `menuitemradio`, not `menuitem`: exactly one of these is the
                  // current section, which is precisely what a radio menu item
                  // means. `aria-current` was tried first and is weaker here —
                  // it is a global attribute with patchy menu support, whereas
                  // `aria-checked` on a radio item is the documented pattern and
                  // is announced as "selected" by every screen reader.
                  role="menuitemradio"
                  aria-checked={index === active}
                  tabIndex={-1}
                  aria-disabled={t.disabled || undefined}
                  className={`ds-tabs__menu-item${t.disabled ? " is-disabled" : ""}${
                    index === active ? " is-current" : ""
                  }`}
                  onClick={() => {
                    if (t.disabled) return;
                    onSelect(index);
                    close(false);
                  }}
                  onKeyDown={(e) => onItemKeyDown(e, pos)}
                >
                  {t.icon ? <Icon name={t.icon} size={20} className="ds-tabs__menu-icon" /> : null}
                  <span className="ds-tabs__menu-label">{t.label}</span>
                  {t.badge ? <span className="ds-tabs__badge" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
