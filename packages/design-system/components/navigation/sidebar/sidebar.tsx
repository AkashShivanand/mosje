"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { Icon } from "../../utilities/icon";
import { IconButton } from "../../actions/icon-button";
import { Badge } from "../../feedback/badge";
import { Tooltip } from "../../feedback/tooltip";
import type {
  SidebarNavProps,
  SidebarNavItem,
  SidebarNavChild,
  SidebarNavLeaf,
} from "./types";
import "./sidebar.css";

// ── Active-state derivation — one expression, used by every level ────────────

const isCurrent = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(href + "/");

const leafActive = (pathname: string, leaf: SidebarNavLeaf): boolean =>
  isCurrent(pathname, leaf.href);

const childActive = (pathname: string, child: SidebarNavChild): boolean =>
  isCurrent(pathname, child.href) ||
  (child.children?.some((l) => leafActive(pathname, l)) ?? false);

const itemActive = (pathname: string, item: SidebarNavItem): boolean =>
  isCurrent(pathname, item.href) ||
  (item.children?.some((c) => childActive(pathname, c)) ?? false);

/**
 * Opens a group when something inside it BECOMES current — on the transition,
 * not on every render — so the reader can still fold a group whose child is
 * the current page.
 */
function useDisclosure(activeNow: boolean): [boolean, () => void] {
  const [open, setOpen] = React.useState(activeNow);
  const [prev, setPrev] = React.useState(activeNow);
  if (prev !== activeNow) {
    setPrev(activeNow);
    if (activeNow) setOpen(true);
  }
  return [open, () => setOpen((o) => !o)];
}

// ── A page row: a real link, or — disabled — a named, non-operable span ──────

type RowLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  disabled?: boolean;
};

/**
 * A disabled page is still listed, so a reader learns it exists, but it is not
 * a link: an anchor without an href is neither navigable nor focusable, and
 * jsx-a11y rightly refuses it. The span keeps the row's name and styling.
 */
const RowLink = React.forwardRef<HTMLElement, RowLinkProps>(function RowLink(
  { href, disabled, children, ...rest },
  ref,
) {
  if (disabled) {
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        role="link"
        aria-disabled="true"
        {...(rest as React.ComponentPropsWithoutRef<"span">)}
      >
        {children}
      </span>
    );
  }
  return (
    <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...rest}>
      {children}
    </a>
  );
});

// ── Level 3 ──────────────────────────────────────────────────────────────────

function LeafRow({
  leaf,
  pathname,
  level,
}: {
  leaf: SidebarNavLeaf;
  pathname: string;
  level: 2 | 3;
}) {
  const active = leafActive(pathname, leaf);
  return (
    <li className={cn("ds-sidebar__sub", `ds-sidebar__sub--l${level}`)}>
      <RowLink
        href={leaf.href}
        disabled={leaf.disabled}
        aria-current={active ? "page" : undefined}
        className={cn(
          "ds-sidebar__sub-row",
          active && "is-active",
          leaf.disabled && "is-disabled",
        )}
      >
        <span className="ds-sidebar__sub-label">{leaf.label}</span>
      </RowLink>
    </li>
  );
}

// ── Level 2 — a leaf, or a group of level-3 leaves ───────────────────────────

function ChildEntry({
  child,
  pathname,
}: {
  child: SidebarNavChild;
  pathname: string;
}) {
  const id = React.useId();
  const active = childActive(pathname, child);
  const [open, toggle] = useDisclosure(active);
  if (!child.children?.length) {
    return <LeafRow leaf={child} pathname={pathname} level={2} />;
  }
  return (
    <li className="ds-sidebar__sub ds-sidebar__sub--l2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-disabled={child.disabled || undefined}
        disabled={child.disabled}
        className={cn(
          "ds-sidebar__sub-row ds-sidebar__sub-row--group",
          active && "is-active",
          child.disabled && "is-disabled",
        )}
        onClick={toggle}
      >
        <span className="ds-sidebar__sub-label">{child.label}</span>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          size={20}
          className="ds-sidebar__chevron"
          aria-hidden
        />
      </button>
      {open && (
        <ul id={id} className="ds-sidebar__list ds-sidebar__list--l3">
          {child.children.map((leaf) => (
            <LeafRow key={leaf.href} leaf={leaf} pathname={pathname} level={3} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── Collapsed-rail flyout for a group ────────────────────────────────────────

function Flyout({
  item,
  pathname,
  anchor,
  id,
  onClose,
}: {
  item: SidebarNavItem;
  pathname: string;
  anchor: HTMLElement | null;
  id: string;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  React.useLayoutEffect(() => {
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    setPos({ top: r.top, left: r.right });
  }, [anchor]);

  // Focus only once the panel is positioned: until `pos` lands it is
  // visibility:hidden, and a hidden element refuses focus.
  React.useEffect(() => {
    if (pos) ref.current?.querySelector<HTMLElement>("a:not([aria-disabled])")?.focus();
  }, [pos]);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchor?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        anchor?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [anchor, onClose]);

  return (
    <div
      ref={ref}
      id={id}
      role="group"
      aria-label={item.label}
      className="ds-sidebar__flyout"
      style={pos ? { top: pos.top, left: pos.left } : { visibility: "hidden" }}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && (ref.current?.contains(next) || anchor?.contains(next))) return;
        onClose();
      }}
    >
      <div className="ds-sidebar__flyout-title">{item.label}</div>
      <ul className="ds-sidebar__list">
        {(item.children ?? []).map((c) => {
          const active = childActive(pathname, c);
          return (
            <li key={c.href} className="ds-sidebar__sub ds-sidebar__sub--flyout">
              <RowLink
                href={c.href}
                disabled={c.disabled}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "ds-sidebar__sub-row",
                  active && "is-active",
                  c.disabled && "is-disabled",
                )}
                onClick={onClose}
              >
                <span className="ds-sidebar__sub-label">{c.label}</span>
              </RowLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Level 1 ──────────────────────────────────────────────────────────────────

function MainItem({
  item,
  pathname,
  collapsed,
  flyoutOpen,
  onFlyoutToggle,
  onFlyoutClose,
}: {
  item: SidebarNavItem;
  pathname: string;
  collapsed: boolean;
  flyoutOpen: boolean;
  onFlyoutToggle: () => void;
  onFlyoutClose: () => void;
}) {
  const id = React.useId();
  const hasChildren = Boolean(item.children?.length);
  const selfActive = isCurrent(pathname, item.href);
  const active = itemActive(pathname, item);
  const [open, toggle] = useDisclosure(active);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const rowClass = cn(
    "ds-sidebar__row",
    active && "is-active",
    item.disabled && "is-disabled",
  );
  const badgeText = item.badge != null ? `${item.badge} pending` : null;
  const name = badgeText ? `${item.label}, ${badgeText}` : item.label;

  const icon = <Icon name={item.icon} size={24} className="ds-sidebar__icon" aria-hidden />;
  const dot = item.badge != null && <span className="ds-sidebar__dot" aria-hidden />;

  if (collapsed && !hasChildren) {
    return (
      <li>
        <Tooltip content={item.label} side="right" duplicatesTriggerName>
          <RowLink
            href={item.href}
            disabled={item.disabled}
            aria-label={name}
            aria-current={selfActive ? "page" : undefined}
            className={rowClass}
          >
            {icon}
            {dot}
          </RowLink>
        </Tooltip>
      </li>
    );
  }

  if (collapsed) {
    return (
      <li>
        <Tooltip content={item.label} side="right" duplicatesTriggerName disabled={flyoutOpen}>
          <button
            ref={anchorRef}
            type="button"
            aria-label={name}
            aria-haspopup="true"
            aria-expanded={flyoutOpen}
            aria-controls={flyoutOpen ? id : undefined}
            aria-disabled={item.disabled || undefined}
            disabled={item.disabled}
            className={cn(rowClass, flyoutOpen && "is-open")}
            onClick={onFlyoutToggle}
          >
            {icon}
            {dot}
          </button>
        </Tooltip>
        {flyoutOpen && (
          <Flyout
            item={item}
            pathname={pathname}
            anchor={anchorRef.current}
            id={id}
            onClose={onFlyoutClose}
          />
        )}
      </li>
    );
  }

  // The library Badge, solid primary — the same fill the Figma master's nested
  // Badge binds — rather than a local pill that would drift from it.
  const badge = item.badge != null && (
    <Badge
      status="primary"
      emphasis="solid"
      size="sm"
      className="ds-sidebar__badge"
      aria-label={badgeText ?? undefined}
    >
      {item.badge}
    </Badge>
  );

  if (!hasChildren) {
    return (
      <li>
        <RowLink
          href={item.href}
          disabled={item.disabled}
          aria-current={selfActive ? "page" : undefined}
          className={rowClass}
        >
          {icon}
          <span className="ds-sidebar__label">{item.label}</span>
          {badge}
        </RowLink>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-disabled={item.disabled || undefined}
        disabled={item.disabled}
        className={rowClass}
        onClick={toggle}
      >
        {icon}
        <span className="ds-sidebar__label">{item.label}</span>
        {badge}
        <Icon
          name={open ? "expand_less" : "expand_more"}
          size={20}
          className="ds-sidebar__chevron"
          aria-hidden
        />
      </button>
      {open && (
        <ul id={id} className="ds-sidebar__list ds-sidebar__list--l2">
          {item.children!.map((c) => (
            <ChildEntry key={c.href} child={c} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── Public: SidebarNav ───────────────────────────────────────────────────────

/**
 * SidebarNav — the portal app-shell left navigation.
 *
 * Figma source: SAMAVESH DS › Sidebar › `Sidebar` (4286:428), with
 * `Sidebar/Item · Level 1` (4286:285), `Sidebar/Item · Level 2` (4286:361),
 * `Sidebar/Item · Level 3`, `Sidebar/GroupLabel`, `Sidebar/CollapseControl`
 * and `Sidebar/Flyout`.
 *
 * - Expanded (`layout/sidebar/width`, 300) and collapsed
 *   (`layout/sidebar/collapsedWidth`, 88) modes.
 * - Three levels: a level-1 item with an icon; level-2 entries under a group;
 *   level-3 leaves under a level-2 group. Nothing nests further.
 * - `pathname` is the only source of the current state, at every level.
 * - In the collapsed rail a group opens a flyout listing its level-2 pages;
 *   a leaf shows its label as a tooltip; a badge count becomes a dot.
 * - Group labels are the accessible name of their `role="group"`, in both modes.
 *
 * @example
 * ```tsx
 * <SidebarNav
 *   groups={navGroups}
 *   pathname={usePathname()}
 *   collapsed={collapsed}
 *   onCollapsedChange={setCollapsed}
 *   showCollapseControl
 *   footer={<StatusFooter />}
 * />
 * ```
 */
export function SidebarNav({
  groups,
  pathname,
  collapsed = false,
  onCollapsedChange,
  showCollapseControl = false,
  footer,
  label = "Portal navigation",
  className,
  id,
}: SidebarNavProps): React.JSX.Element {
  const [openFlyout, setOpenFlyout] = React.useState<string | null>(null);
  const closeFlyout = React.useCallback(() => setOpenFlyout(null), []);
  // A flyout belongs to the collapsed rail; expanding closes it.
  React.useEffect(() => {
    if (!collapsed) setOpenFlyout(null);
  }, [collapsed]);
  const baseId = React.useId();

  return (
    <aside
      id={id}
      className={cn("ds-sidebar", collapsed ? "is-collapsed" : "is-expanded", className)}
    >
      <nav className="ds-sidebar__nav" aria-label={label}>
        {groups.map((group, gi) => {
          const labelId = group.label ? `${baseId}-g${gi}` : undefined;
          return (
            <div
              key={gi}
              className="ds-sidebar__group"
              role={group.label ? "group" : undefined}
              aria-labelledby={labelId}
            >
              {group.label && (
                <div
                  id={labelId}
                  className={cn("ds-sidebar__group-label", collapsed && "ds-sr-only")}
                >
                  {group.label}
                </div>
              )}
              <ul className="ds-sidebar__list">
                {group.items.map((item) => (
                  <MainItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                    flyoutOpen={openFlyout === item.href}
                    onFlyoutToggle={() =>
                      setOpenFlyout((cur) => (cur === item.href ? null : item.href))
                    }
                    onFlyoutClose={closeFlyout}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {footer && <div className="ds-sidebar__footer">{footer}</div>}

      {showCollapseControl && onCollapsedChange && (
        <div className="ds-sidebar__control">
          <IconButton
            icon={<Icon name={collapsed ? "left_panel_open" : "left_panel_close"} size={24} />}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={!collapsed}
            aria-controls={id}
            variant="neutral"
            appearance="text"
            size="md"
            tooltip
            tooltipSide="right"
            onClick={() => onCollapsedChange(!collapsed)}
          />
        </div>
      )}
    </aside>
  );
}
