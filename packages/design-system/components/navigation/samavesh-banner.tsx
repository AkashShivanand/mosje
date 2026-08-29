"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./samavesh-banner.css";

export interface SamaveshBannerPortalItem {
  id?: string;
  name: string;
  shortName: string;
  description?: string;
  href: string;
  logoSrc?: string;
  external?: boolean;
}

export const DEFAULT_SAMAVESH_PORTALS: SamaveshBannerPortalItem[] = [
  {
    id: "scw",
    shortName: "SCW",
    name: "Senior Citizens Welfare",
    href: "/portals/scw",
    logoSrc: "/design-system/org-logos/scw.png",
  },
  {
    id: "smile-tg",
    shortName: "SMILE - Transgender",
    name: "National Portal for Transgender Persons",
    href: "/portals/tg",
    logoSrc: "/design-system/org-logos/smile.png",
  },
  {
    id: "nos",
    shortName: "NOS",
    name: "National Overseas Scholarship",
    href: "/portals/nos",
    logoSrc: "/design-system/org-logos/nos.png",
  },
  {
    id: "nmba",
    shortName: "NMBA",
    name: "Nasha Mukt Bharat Abhiyaan",
    href: "/portals/nmba",
    logoSrc: "/design-system/org-logos/nmba.png",
  },
];

export interface SamaveshBannerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onToggle"> {
  /** Initial open state if uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Controlled open state. */
  isOpen?: boolean;
  /** Callback fired when open/closed state changes. */
  onToggle?: (open: boolean) => void;
  /** Custom list of portals shown in the drawer. Defaults to the canonical 4 portals. */
  portals?: SamaveshBannerPortalItem[];
  /** Title inside the drawer. @default "Choose a portal to visit" */
  drawerTitle?: string;
  /** Href for "View all citizen portals" link. @default "/website/samavesh-citizen-portals" */
  viewAllHref?: string;
  /** Label for view all link. @default "View all citizen portals" */
  viewAllLabel?: string;
  /** Custom logo source for the badge. @default "/design-system/samavesh-logo.svg" */
  logoSrc?: string;
  /** Headline text. @default "SAMAVESH" */
  title?: string;
  /** Subtitle description. @default "Single Access Mechanism for All Verticals of Empowerment & Social Harmony" */
  subline?: string;
  /** Explore button label. @default "Explore" */
  exploreLabel?: string;
}

/**
 * SAMAVESH Banner component — the canonical top banner and portal exploration drawer.
 *
 * Implements Figma node 7116:33784 & 7298:29968 with full keyboard accessibility,
 * tokenized styling, and seamless expand/collapse interactions.
 */
export function SamaveshBanner({
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  portals = DEFAULT_SAMAVESH_PORTALS,
  drawerTitle = "Choose a portal to visit",
  viewAllHref = "/website/samavesh-citizen-portals",
  viewAllLabel = "View all citizen portals",
  logoSrc = "/design-system/samavesh-logo.svg",
  title = "SAMAVESH",
  subline = "Single Access Mechanism for All Verticals of Empowerment & Social Harmony",
  exploreLabel = "Explore",
  className,
  ...rest
}: SamaveshBannerProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalOpen;

  const drawerId = React.useId();
  const titleId = React.useId();

  const handleToggle = React.useCallback(() => {
    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onToggle?.(next);
  }, [open, isControlled, onToggle]);

  // Handle escape key to close drawer when open
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!isControlled) {
          setInternalOpen(false);
        }
        onToggle?.(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isControlled, onToggle]);

  return (
    <section
      className={cn("ds-samavesh-banner", className)}
      aria-label="SAMAVESH Portal Directory"
      {...rest}
    >
      <div className="ds-samavesh-banner__bar">
        <div className="ds-samavesh-banner__container">
          <div className="ds-samavesh-banner__brand">
            <div className="ds-samavesh-banner__badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="SAMAVESH Emblem"
                width={52}
                height={52}
                loading="eager"
              />
            </div>
            <div className="ds-samavesh-banner__text-group">
              <span className="ds-samavesh-banner__title">{title}</span>
              <div className="ds-samavesh-banner__divider" aria-hidden="true" />
              <span className="ds-samavesh-banner__subline">{subline}</span>
            </div>
          </div>

          <div className="ds-samavesh-banner__actions">
            <button
              type="button"
              className="ds-samavesh-banner__explore-btn"
              onClick={handleToggle}
              aria-expanded={open}
              aria-controls={drawerId}
              aria-label={open ? `Collapse ${title} portals` : `${exploreLabel} ${title} portals`}
            >
              <span>{exploreLabel}</span>
              <span className="ds-samavesh-banner__btn-icon" aria-hidden="true">
                <Icon name={open ? "expand_less" : "expand_more"} size={20} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Accordion Drawer */}
      <div
        id={drawerId}
        className={cn(
          "ds-samavesh-banner__drawer",
          open ? "ds-samavesh-banner__drawer--open" : "ds-samavesh-banner__drawer--closed"
        )}
        aria-hidden={!open}
      >
        <div className="ds-samavesh-banner__drawer-inner">
          <h2 id={titleId} className="ds-samavesh-banner__drawer-heading">
            {drawerTitle}
          </h2>

          <div className="ds-samavesh-banner__grid" role="list">
            {portals.map((portal) => (
              <a
                key={portal.id ?? portal.shortName}
                href={portal.href}
                className="ds-samavesh-banner__card"
                role="listitem"
                target={portal.external ? "_blank" : undefined}
                rel={portal.external ? "noreferrer noopener" : undefined}
              >
                <div className="ds-samavesh-banner__card-logo" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portal.logoSrc ?? "/images/National-Emblem-logo.svg"}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                  />
                </div>
                <div className="ds-samavesh-banner__card-content">
                  <span className="ds-samavesh-banner__card-abbr">
                    {portal.shortName}
                  </span>
                  <span className="ds-samavesh-banner__card-name">
                    {portal.name}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {viewAllHref && (
            <div className="ds-samavesh-banner__footer-row">
              <a href={viewAllHref} className="ds-samavesh-banner__view-all">
                <span>{viewAllLabel}</span>
                <Icon name="arrow_forward" size={16} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
