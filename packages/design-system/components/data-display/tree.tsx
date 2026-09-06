"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./tree.css";

export interface TreeNode {
  id: string;
  label: string;
  /** Children make this a branch. An empty array is still a branch — one with nothing in it. */
  children?: TreeNode[];
  /** Present but not selectable. It keeps `aria-disabled`, so it stays reachable. */
  disabled?: boolean;
  /** A count or a code shown after the label — "142 schemes", "SC-04". */
  meta?: string;
}

export interface TreeProps {
  nodes: TreeNode[];
  /** Accessible name for the tree. Required. */
  label: string;
  /** The selected node's id. */
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Controlled expansion. Leave out and the tree manages its own. */
  expandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  defaultExpandedIds?: string[];
  /** @default "Nothing to show." */
  emptyText?: string;
  className?: string;
}

interface Flat {
  node: TreeNode;
  level: number;
  posInSet: number;
  setSize: number;
  parentId: string | null;
  hasChildren: boolean;
  expanded: boolean;
}

function flatten(nodes: TreeNode[], expanded: Set<string>, level = 1, parentId: string | null = null): Flat[] {
  const out: Flat[] = [];
  nodes.forEach((node, index) => {
    const hasChildren = Array.isArray(node.children);
    const isOpen = hasChildren && expanded.has(node.id);
    out.push({
      node,
      level,
      posInSet: index + 1,
      setSize: nodes.length,
      parentId,
      hasChildren,
      expanded: isOpen,
    });
    if (isOpen && node.children) out.push(...flatten(node.children, expanded, level + 1, node.id));
  });
  return out;
}

/**
 * A hierarchy a reader walks — Master Data, Map Ministry & Schemes, Roles &
 * Permissions.
 *
 * Built to the WAI-ARIA tree pattern rather than approximated, because the half
 * of it people skip is the half that matters. Specifically:
 *
 * - **One tab stop, not one per node.** A roving `tabIndex` puts the tree in the
 *   tab sequence once; the arrow keys move inside it. A tree of two hundred
 *   nodes that is two hundred tab stops is a keyboard trap in everything but
 *   name.
 * - **Right expands, then descends. Left collapses, then ascends.** Two keys
 *   doing two things each, in the order a reader expects.
 * - **Type-ahead**, because arrowing to the fortieth district is not navigation.
 * - **`aria-level`, `aria-setsize`, `aria-posinset` on every node**, so a screen
 *   reader can say "level 3, 4 of 17". Without them a tree is announced as a
 *   flat list and the shape — which is the entire point of a tree — is lost.
 *
 * A disabled node keeps `aria-disabled` and stays reachable, never the native
 * attribute: a reader has to be able to learn that a branch exists and is not
 * theirs to open.
 *
 * **Use a tree only for a real hierarchy a reader must see the shape of.** A
 * two-level list is a list with headings, and it is easier to use.
 */
export function Tree({
  nodes,
  label,
  selectedId,
  onSelect,
  expandedIds,
  onExpandedChange,
  defaultExpandedIds,
  emptyText = "Nothing to show.",
  className,
}: TreeProps): React.JSX.Element {
  const [ownExpanded, setOwnExpanded] = React.useState<string[]>(defaultExpandedIds ?? []);
  const expanded = React.useMemo(
    () => new Set(expandedIds ?? ownExpanded),
    [expandedIds, ownExpanded],
  );
  const flat = React.useMemo(() => flatten(nodes, expanded), [nodes, expanded]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const typed = React.useRef({ buffer: "", at: 0 });
  const ref = React.useRef<HTMLUListElement | null>(null);

  const active = activeId && flat.some((row) => row.node.id === activeId) ? activeId : flat[0]?.node.id ?? null;

  function setExpanded(next: Set<string>): void {
    const ids = [...next];
    if (expandedIds === undefined) setOwnExpanded(ids);
    onExpandedChange?.(ids);
  }

  function focusNode(id: string): void {
    setActiveId(id);
    // The DOM node for a row that has just appeared is not there until after the
    // render, so the move is deferred rather than attempted inline.
    requestAnimationFrame(() => {
      ref.current?.querySelector<HTMLElement>(`[data-tree-id="${CSS.escape(id)}"]`)?.focus();
    });
  }

  function toggle(row: Flat, open: boolean): void {
    const next = new Set(expanded);
    if (open) next.add(row.node.id);
    else next.delete(row.node.id);
    setExpanded(next);
  }

  function onKeyDown(event: React.KeyboardEvent, row: Flat, index: number): void {
    const move = (to: number): void => {
      const target = flat[to];
      if (!target) return;
      event.preventDefault();
      focusNode(target.node.id);
    };

    switch (event.key) {
      case "ArrowDown":
        move(index + 1);
        return;
      case "ArrowUp":
        move(index - 1);
        return;
      case "Home":
        move(0);
        return;
      case "End":
        move(flat.length - 1);
        return;
      case "ArrowRight":
        event.preventDefault();
        if (row.hasChildren && !row.expanded) toggle(row, true);
        else if (row.expanded) move(index + 1);
        return;
      case "ArrowLeft":
        event.preventDefault();
        if (row.hasChildren && row.expanded) {
          toggle(row, false);
        } else if (row.parentId) {
          focusNode(row.parentId);
        }
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!row.node.disabled) onSelect?.(row.node.id);
        return;
      case "*": {
        // Expand every sibling of the focused node — the pattern's own shortcut.
        event.preventDefault();
        const next = new Set(expanded);
        for (const sibling of flat) {
          if (sibling.parentId === row.parentId && sibling.hasChildren) next.add(sibling.node.id);
        }
        setExpanded(next);
        return;
      }
      default:
        break;
    }

    if (event.key.length === 1 && /\S/.test(event.key)) {
      const now = Date.now();
      // A pause clears the buffer, so "ba" finds Bankura and a later "n" starts
      // afresh rather than searching for "ban".
      typed.current.buffer = now - typed.current.at > 700 ? event.key : typed.current.buffer + event.key;
      typed.current.at = now;
      const needle = typed.current.buffer.toLowerCase();
      const order = [...flat.slice(index + 1), ...flat.slice(0, index + 1)];
      const hit = order.find((candidate) => candidate.node.label.toLowerCase().startsWith(needle));
      if (hit) {
        event.preventDefault();
        focusNode(hit.node.id);
      }
    }
  }

  if (flat.length === 0) {
    return <p className={cn("ds-tree__empty", className)}>{emptyText}</p>;
  }

  return (
    <ul ref={ref} className={cn("ds-tree", className)} role="tree" aria-label={label}>
      {flat.map((row, index) => {
        const { node } = row;
        const isSelected = selectedId === node.id;
        return (
          <li
            key={node.id}
            role="treeitem"
            data-tree-id={node.id}
            className={cn("ds-tree__item", isSelected && "is-selected", node.disabled && "is-disabled")}
            style={{ paddingInlineStart: `calc(var(--sa-padding-12) * ${row.level})` }}
            tabIndex={row.node.id === active ? 0 : -1}
            aria-level={row.level}
            aria-setsize={row.setSize}
            aria-posinset={row.posInSet}
            aria-expanded={row.hasChildren ? row.expanded : undefined}
            aria-selected={isSelected}
            aria-disabled={node.disabled || undefined}
            onKeyDown={(event) => onKeyDown(event, row, index)}
            onFocus={() => setActiveId(node.id)}
            onClick={(event) => {
              event.stopPropagation();
              if (row.hasChildren) toggle(row, !row.expanded);
              if (!node.disabled) onSelect?.(node.id);
              focusNode(node.id);
            }}
          >
            <span className="ds-tree__twist" aria-hidden="true">
              {row.hasChildren ? <Icon name={row.expanded ? "expand_more" : "chevron_right"} size={20} /> : null}
            </span>
            <span className="ds-tree__label">{node.label}</span>
            {node.meta ? <span className="ds-tree__meta">{node.meta}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}
