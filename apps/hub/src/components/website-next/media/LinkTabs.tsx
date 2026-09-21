"use client";

import { Tabs } from "@mosje/design-system";

interface LinkTabsProps {
  idBase: string;
  label: string;
  tabs: { id: string; label: string; href: string; icon?: string }[];
  active: number;
}

/**
 * The DS `Tabs` (the site's one tab style — issue BRD-18: the classic gallery's
 * tabs were black) as LINK tabs: each tab is its own address, so a filtered
 * gallery is shareable and the back button returns to the previous tab.
 *
 * `onChange` does nothing on purpose — the link navigates. The row scrolls
 * inside its own labelled region on a phone rather than clipping (MOB-02),
 * which is the DS tablist's own behaviour with `overflow`.
 */
export function LinkTabs({ idBase, label, tabs, active }: LinkTabsProps) {
  return (
    <Tabs
      idBase={idBase}
      ariaLabel={label}
      tabs={tabs}
      active={active}
      onChange={() => {}}
      indicator="underline"
      track="none"
      overflow
    />
  );
}
