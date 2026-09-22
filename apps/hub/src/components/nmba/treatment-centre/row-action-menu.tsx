"use client";

import * as React from "react";
import type { RowActionTone } from "./row-actions";
import { Icon, IconButton, Menu, type MenuItem } from "@mosje/design-system";

/**
 * "More actions" menu for dense table rows.
 *
 * Every option carries VISIBLE text — closing the discoverability gap GIGW flags
 * for non-universal icons (Upload / Training / Volunteers) — behind one icon
 * trigger.
 *
 * Until 2026-09-22 this file hand-built the WAI-ARIA menu-button pattern: its own
 * portal, fixed positioning, flip logic, focus management and arrow-key model, all
 * duplicating the design system's `Menu`. It is now that Menu with an IconButton
 * trigger; the positioning, dismissal and keyboard model are the estate's own.
 * The item API is unchanged, so no caller moved.
 */

export interface RowActionMenuItem {
  /** Material Symbols name for the DS <Icon>. */
  icon: string;
  label: string;
  onClick: () => void;
  tone?: RowActionTone;
}

export function RowActionMenu({ label, items }: { label: string; items: RowActionMenuItem[] }) {
  const entries: MenuItem[] = items.map((item, i) => ({
    id: String(i),
    label: item.label,
    icon: item.icon,
    tone: item.tone ?? "neutral",
  }));
  return (
    <Menu label={label} items={entries} align="end" onSelect={(id) => items[Number(id)]?.onClick()}>
      <IconButton
        icon={<Icon name="more_horiz" size={16} />}
        aria-label={label}
        tooltip
        variant="neutral"
        appearance="text"
        size="sm"
      />
    </Menu>
  );
}
