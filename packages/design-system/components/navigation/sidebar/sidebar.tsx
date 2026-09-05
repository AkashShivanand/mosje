"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { Icon } from "../../utilities/icon";
import { IconButton } from "../../actions/icon-button";
import { Badge } from "../../feedback/badge";
import { Tooltip } from "../../feedback/tooltip";
import type {
  SidebarNavProps,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavChild,
  SidebarNavLeaf,
} from "./types";
import "./sidebar.css";

// ── Active-state derivation — one expression, used by every level ────────────

const matches = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(href + "/");

/**
 * ONE current page per rail. A prefix match alone is not enough: a portal's
 * root item ("/portals/scw") is a prefix of every route in the portal and lit
 * up on every page. The current page is therefore the LONGEST href that
 * matches the pathname, at whatever level it sits; ancestors of that page are
 * open and highlighted, and nothing else is.
 */
export function resolveCurrent(groups: SidebarNavGroup[], pathname: string): string | null {
  let best: string | null = null;
  const consider = (href: string) => {
    if (matches(pathname, href) && (best === null || href.length > best.length)) best = href;
  };
  for (const g of groups) {
    for (const item of g.items) {
      consider(item.href);
      for (const c of item.children ?? []) {
        consider(c.href);
        for (const l of c.children ?? []) consider(l.href);
      }
    }
  }
  return best;
}

const leafActive = (current: string | null, leaf: SidebarNavLeaf): boolean =>
  current === leaf.href;

const childActive = (current: string | null, child: SidebarNavChild): boolean =>
  current === child.href || (child.children?.some((l) => leafActive(current, l)) ?? false);

const itemActive = (current: string | null, item: SidebarNavItem): boolean =>
  current === item.href || (item.children?.some((c) => childActive(current, c)) ?? false);

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

// ── The drawn path to the current page ───────────────────────────────────────

/**
 * The connector from the list's parent edge to the entry whose row centre is
 * at `y`: trunk at `trunkX`, a shape/6 corner, a 16px arm into the pill —
 * the same geometry `.ds-sidebar__sub::before` draws for every entry.
 */
export function activePathD(trunkX: number, y: number): string {
  const r = 6;
  // The route runs down the trunk and branches into the page with the same
  // elbow every entry draws: the arc leaves the trunk at y - 6 and meets the
  // arm at the row centre. Under it the neutral trunk continues to the next
  // entry, or ends here if this is the last.
  return `M ${trunkX} 0 V ${y - r} Q ${trunkX} ${y} ${trunkX + r} ${y} H ${trunkX + 16}`;
}

/**
 * Draws, in brand, the connector from the list's parent edge down to the
 * current entry's centre and into its pill — over the neutral tree the CSS
 * draws for every entry. Geometry mirrors `.ds-sidebar__sub::before`: trunk
 * 16px left of the pill, 16px arm, shape/6 corner, row centre at 22.
 *
 * The path remounts (`key`) when the current page changes, so the
 * `@starting-style` dash offset re-runs the draw. Measured, not computed from
 * row counts, because an open level-2 group changes the rows above.
 */
function ActivePath({
  listRef,
  trunkX,
  current,
}: {
  listRef: React.RefObject<HTMLUListElement | null>;
  trunkX: number;
  current: string | null;
}) {
  const [d, setD] = React.useState<string | null>(null);
  // A passive effect, deliberately: this component is a CHILD of the list it
  // measures, and React attaches a parent's ref after its children's layout
  // effects have run — a layout effect here saw a null ref and never drew.
  React.useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    const measure = () => {
      const li = ul.querySelector<HTMLElement>(':scope > li[data-active="true"]');
      if (!li) {
        setD(null);
        return;
      }
      setD(activePathD(trunkX, li.offsetTop + 22)); // 22: the centre of a 44px row
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [listRef, trunkX, current]);
  if (!d) return null;
  return (
    <svg className="ds-sidebar__path" aria-hidden focusable="false">
      <path key={`${current}:${d}`} d={d} pathLength={1} />
    </svg>
  );
}

// ── Level 3 ──────────────────────────────────────────────────────────────────

function LeafRow({
  leaf,
  current,
  level,
}: {
  leaf: SidebarNavLeaf;
  current: string | null;
  level: 2 | 3;
}) {
  const active = leafActive(current, leaf);
  return (
    <li className={cn("ds-sidebar__sub", `ds-sidebar__sub--l${level}`)} data-active={active || undefined}>
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
  current,
}: {
  child: SidebarNavChild;
  current: string | null;
}) {
  const id = React.useId();
  const active = childActive(current, child);
  const selfCurrent = current === child.href;
  const [open, toggle] = useDisclosure(active);
  const listRef = React.useRef<HTMLUListElement>(null);
  if (!child.children?.length) {
    return <LeafRow leaf={child} current={current} level={2} />;
  }
  return (
    <li className="ds-sidebar__sub ds-sidebar__sub--l2" data-active={active || undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-disabled={child.disabled || undefined}
        disabled={child.disabled}
        className={cn(
          "ds-sidebar__sub-row ds-sidebar__sub-row--group",
          selfCurrent && "is-active",
          active && !selfCurrent && "is-ancestor",
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
        <ul id={id} ref={listRef} className="ds-sidebar__list ds-sidebar__list--l3">
          <ActivePath listRef={listRef} trunkX={8} current={current} />
          {child.children.map((leaf) => (
            <LeafRow key={leaf.href} leaf={leaf} current={current} level={3} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── Collapsed-rail flyout for a group ────────────────────────────────────────

function Flyout({
  item,
  current,
  anchor,
  id,
  onClose,
}: {
  item: SidebarNavItem;
  current: string | null;
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
          const active = childActive(current, c);
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
  current,
  collapsed,
  flyoutOpen,
  onFlyoutToggle,
  onFlyoutClose,
}: {
  item: SidebarNavItem;
  current: string | null;
  collapsed: boolean;
  flyoutOpen: boolean;
  onFlyoutToggle: () => void;
  onFlyoutClose: () => void;
}) {
  const id = React.useId();
  const hasChildren = Boolean(item.children?.length);
  const selfActive = current === item.href;
  const active = itemActive(current, item);
  const [open, toggle] = useDisclosure(active);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  // The level-1 item that holds the current page is tinted, as the page is: the
  // rail reads "you are in Applications, at Under Review". Inside the group the
  // tint appears once more, on the page; a level-2 group on the way takes the
  // ink without the tint, and the drawn connector carries the route between.
  const rowClass = cn(
    "ds-sidebar__row",
    active && "is-active",
    item.disabled && "is-disabled",
  );
  const badgeText = item.badge != null ? `${item.badge} pending` : null;
  const name = badgeText ? `${item.label}, ${badgeText}` : item.label;

  // The current page's icon is the FILLED glyph — Material's own selected-state
  // convention, and the one signal that survives at every rail width.
  const icon = (
    <Icon name={item.icon} size={24} fill={active} className="ds-sidebar__icon" aria-hidden />
  );
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
            current={current}
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
        <ul id={id} ref={listRef} className="ds-sidebar__list ds-sidebar__list--l2">
          <ActivePath listRef={listRef} trunkX={24} current={current} />
          {item.children!.map((c) => (
            <ChildEntry key={c.href} child={c} current={current} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── Group size: five is the design limit, seven the ceiling ──────────────────

/** Groups already reported, so a re-render does not repeat the warning. */
const warned = new Set<string>();

/**
 * A group past seven children is two groups, or a list that belongs on the
 * section's own page. Material caps a rail at seven; every group in the portal
 * handoff has five or fewer. The rail still renders it — a role's data must
 * never break navigation — but a one-time warning says where the real fix is.
 */
export function warnOversizedGroups(groups: SidebarNavGroup[]): string[] {
  const offenders: string[] = [];
  for (const g of groups) {
    for (const item of g.items) {
      if ((item.children?.length ?? 0) > 7) offenders.push(item.label);
      for (const c of item.children ?? []) if ((c.children?.length ?? 0) > 7) offenders.push(c.label);
    }
  }
  // Same shape as selection-control.tsx: the once-flag is the guard, not
  // NODE_ENV — the package has no Node types, and a warning that fires once per
  // label is cheap wherever it runs.
  for (const label of offenders) {
    if (warned.has(label)) continue;
    warned.add(label);
    console.warn(
      `SidebarNav: "${label}" has more than seven children. Five is the design limit and seven the ceiling — split the group or move the list onto the section's own page.`,
    );
  }
  return offenders;
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
 *   level-3 leaves under a level-2 group. Nothing nests further. Connectors are
 *   neutral; the path to the current page is drawn in brand on navigation.
 * - `pathname` is the only source of the current state, at every level: the
 *   longest matching href is the one current page (tinted), so a portal's root
 *   item does not light up on every route. The level-1 item holding it is
 *   tinted too; a level-2 group on the way takes the bolder ink without tint.
 * - In the collapsed rail a group opens a flyout listing its level-2 pages;
 *   a leaf shows its label as a tooltip; a badge count becomes a dot.
 * - Group labels are the accessible name of their `role="group"`, in both modes.
 * - `identity` names the portal at the head of the rail — the masthead carries
 *   the Ministry and the estate, this is the one place the portal is named. The
 *   rail's own collapse control is optional and lives in that row (or a 48px
 *   top row without an identity); the masthead's toggle is the default control.
 * - Five children per group is the design limit and seven the ceiling; past
 *   seven, development warns and the rail still renders.
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
  identity,
  footer,
  label,
  className,
  id,
}: SidebarNavProps): React.JSX.Element {
  const navLabel = label ?? (identity ? `${identity.name} navigation` : "Portal navigation");
  // The rail's own collapse control: inside the identity row when there is one,
  // otherwise a 48px row at the top. Only with a handler — a control that does
  // nothing is worse than none.
  const control =
    showCollapseControl && onCollapsedChange ? (
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
    ) : null;
  warnOversizedGroups(groups);
  const current = resolveCurrent(groups, pathname);
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
      {identity ? (
        <div className={cn("ds-sidebar__identity", collapsed && "is-collapsed")}>
          {collapsed ? (
            <Tooltip content={identity.name} side="right" duplicatesTriggerName>
              <a href={identity.href} className="ds-sidebar__identity-link" aria-label={`${identity.name} home`}>
                <span className="ds-sidebar__identity-mark">{identity.mark}</span>
              </a>
            </Tooltip>
          ) : (
            <a href={identity.href} className="ds-sidebar__identity-link" aria-label={`${identity.name} home`}>
              <span className="ds-sidebar__identity-mark">{identity.mark}</span>
              <span className="ds-sidebar__identity-text">
                <span className="ds-sidebar__identity-name">{identity.name}</span>
                {identity.expansion && (
                  <span className="ds-sidebar__identity-expansion">{identity.expansion}</span>
                )}
              </span>
            </a>
          )}
          {control}
        </div>
      ) : (
        control && <div className="ds-sidebar__control">{control}</div>
      )}

      <nav className="ds-sidebar__nav" aria-label={navLabel}>
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
                    current={current}
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

    </aside>
  );
}
