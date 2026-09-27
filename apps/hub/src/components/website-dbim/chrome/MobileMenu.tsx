"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Icon, IconButton, SideSheet } from "@mosje/design-system";

import { DBIM_MENU, dbimHref, dbimMenuFor } from "@/lib/website-dbim/nav";
import { useDbimPath } from "./MainNav";

/**
 * The menu below 992px: the reference's hamburger beside the search box, opening a
 * right-hand off-canvas that fills a phone. Each of the five sections expands in
 * place to its second-level links; the section holding the current page starts open.
 * There is no Home row — the reference has none; the emblem is the way home.
 *
 * The panel is the design system's `SideSheet` (focus trap, Escape, scroll lock,
 * focus returned to the hamburger), restyled edge-to-edge in chrome.css. Its title
 * is kept for the dialog's accessible name and hidden visually, as the reference
 * draws no title.
 */
export function DbimMobileMenu() {
  const [open, setOpen] = React.useState(false);
  const path = useDbimPath();
  const current = dbimMenuFor(path)?.path;
  const [expanded, setExpanded] = React.useState<string | undefined>(current);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <>
      <IconButton
        variant="neutral"
        appearance="text"
        className="db-hamburger"
        aria-label="Menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setExpanded(current);
          setOpen(true);
        }}
        icon={<Icon name="menu" size={24} />}
      />
      <SideSheet open={open} onClose={close} title="Menu" size="sm" className="db-mnav">
        <nav aria-label="Main">
          <ul className="db-mnav__list">
            {DBIM_MENU.map((menu) => {
              const isOpen = expanded === menu.path;
              const id = `db-mnav-${menu.path.slice(1)}`;
              return (
                <li key={menu.path} className="db-mnav__section">
                  <Button
                    type="button"
                    variant="neutral"
                    appearance="text"
                    className="db-mnav__toggle"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setExpanded(isOpen ? undefined : menu.path)}
                  >
                    <span>{menu.label}</span>
                    <Icon name={isOpen ? "expand_less" : "expand_more"} size={24} />
                  </Button>
                  <ul id={id} className="db-mnav__links" hidden={!isOpen}>
                    {menu.children.map((child) => (
                      <li key={child.path}>
                        <Link
                          href={dbimHref(child.path)}
                          aria-current={child.path === path ? "page" : undefined}
                          onClick={close}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      </SideSheet>
    </>
  );
}
