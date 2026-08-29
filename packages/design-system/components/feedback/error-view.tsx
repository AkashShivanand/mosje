"use client";

import * as React from "react";
import { Icon } from "../utilities/icon";
import { buttonClasses } from "../actions/button";
import { cn } from "../../utils/cn";
import "./error-view.css";

export type ErrorViewKind = "404" | "500" | "403" | "maintenance";

export interface WayfindingLink {
  title: string;
  description: string;
  href: string;
  icon: string;
  external?: boolean;
}

export interface ErrorViewProps {
  /** Error preset kind. Defaults to "404". */
  kind?: ErrorViewKind;
  /** Custom badge text. Defaults to status label like "404 · Page Not Found". */
  badge?: string;
  /** Hero title. */
  title?: string;
  /** Descriptive body copy. */
  description?: string;
  /** Custom icon name (Material Symbols). */
  icon?: string;
  /** Search destination url template, e.g. "/website/search?q=". Set to null to hide search. */
  searchUrl?: string | null;
  /** Primary action button. */
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
  };
  /** Secondary action button. */
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
  };
  /** Technical diagnostics stack / message for debugging. */
  errorDetails?: string;
  /** Wayfinding recommendation cards. Defaults to MoSJE standard internal destinations. */
  wayfindingLinks?: WayfindingLink[];
  className?: string;
}

const DEFAULT_WAYFINDING: WayfindingLink[] = [
  {
    title: "Schemes & Services",
    description: "Explore 30+ welfare schemes, scholarships, and financial assistance programs.",
    href: "/website/schemes-services",
    icon: "assignment",
  },
  {
    title: "Tenders & Notices",
    description: "View active procurement tenders, notifications, and official circulars.",
    href: "/website/tenders",
    icon: "gavel",
  },
  {
    title: "Directory of Officials",
    description: "Find contact details for ministry officials, divisions, and nodal officers.",
    href: "/website/directory",
    icon: "contacts",
  },
  {
    title: "Digital Portals Hub",
    description: "Access e-Utthaan, SMILE, PM-AJAY, and 20 dedicated workflow portals.",
    href: "/portals",
    icon: "apps",
  },
];

const PRESETS: Record<ErrorViewKind, { badge: string; title: string; desc: string; icon: string }> = {
  "404": {
    badge: "404 · Page Not Found",
    title: "We Couldn’t Find That Page",
    desc: "The page or document you are looking for might have been moved, had its name changed, or is temporarily unavailable during the Ministry’s digital consolidation.",
    icon: "explore_off",
  },
  "500": {
    badge: "500 · Server Error",
    title: "Something Went Wrong",
    desc: "An unexpected system error occurred while processing your request. Our technical teams have been notified. Please try again shortly.",
    icon: "error_outline",
  },
  "403": {
    badge: "403 · Access Restricted",
    title: "Access Restricted",
    desc: "You do not have administrative permission to view this resource. Please log in with an authorized official account.",
    icon: "lock",
  },
  "maintenance": {
    badge: "System Maintenance",
    title: "Scheduled Service Update",
    desc: "This digital service is currently undergoing scheduled maintenance to improve reliability and security. Please check back soon.",
    icon: "build_circle",
  },
};

export function ErrorView({
  kind = "404",
  badge,
  title,
  description,
  icon,
  searchUrl = "/website/search?q=",
  primaryAction,
  secondaryAction,
  errorDetails,
  wayfindingLinks = DEFAULT_WAYFINDING,
  className,
}: ErrorViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const preset = PRESETS[kind] ?? PRESETS["404"];

  const resolvedBadge = badge ?? preset.badge;
  const resolvedTitle = title ?? preset.title;
  const resolvedDesc = description ?? preset.desc;
  const resolvedIcon = icon ?? preset.icon;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !searchUrl) return;
    if (typeof window !== "undefined") {
      window.location.href = `${searchUrl}${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const resolvedPrimary = primaryAction ?? {
    label: kind === "500" ? "Try Again" : "Return to Homepage",
    href: kind === "500" ? undefined : "/website",
    icon: kind === "500" ? "refresh" : "home",
  };

  const resolvedSecondary = secondaryAction ?? {
    label: "Go Back",
    onClick: () => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
      } else if (typeof window !== "undefined") {
        window.location.href = "/website";
      }
    },
    icon: "arrow_back",
  };

  return (
    <section className={cn("ds-error-view", className)} aria-labelledby="error-view-title">
      {/* 1. Status Indicator & Halo */}
      <div className="ds-error-view__hero">
        <div className="ds-error-view__halo" aria-hidden="true" />
        <div className="ds-error-view__icon-box">
          <Icon name={resolvedIcon} size={32} />
        </div>
        <span className="ds-error-view__badge">{resolvedBadge}</span>
      </div>

      {/* 2. Headline & Copy */}
      <h1 id="error-view-title" className="ds-error-view__title">
        {resolvedTitle}
      </h1>
      <p className="ds-error-view__desc">{resolvedDesc}</p>

      {/* 3. Integrated Search Bar */}
      {searchUrl != null && (
        <form onSubmit={handleSearch} className="ds-error-view__search-form" role="search">
          <div className="ds-error-view__search-box">
            <Icon name="search" size={20} className="text-neutral-subtle shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, tenders, circulars, or directory..."
              className="ds-error-view__search-input"
              aria-label="Search MoSJE Portal"
            />
            <button
              type="submit"
              className={buttonClasses("primary", "filled", "sm", "shrink-0 rounded-full px-4")}
            >
              Search
            </button>
          </div>
        </form>
      )}

      {/* 4. Action Buttons Row */}
      <div className="ds-error-view__actions">
        {resolvedPrimary.href ? (
          <a
            href={resolvedPrimary.href}
            className={buttonClasses("primary", "filled", "md", "flex items-center gap-2 font-medium shadow-sm active:scale-[0.98]")}
          >
            {resolvedPrimary.icon && <Icon name={resolvedPrimary.icon} size={20} />}
            <span>{resolvedPrimary.label}</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={resolvedPrimary.onClick}
            className={buttonClasses("primary", "filled", "md", "flex items-center gap-2 font-medium shadow-sm active:scale-[0.98]")}
          >
            {resolvedPrimary.icon && <Icon name={resolvedPrimary.icon} size={20} />}
            <span>{resolvedPrimary.label}</span>
          </button>
        )}

        {resolvedSecondary.href ? (
          <a
            href={resolvedSecondary.href}
            className={buttonClasses("neutral", "outlined", "md", "flex items-center gap-2 active:scale-[0.98]")}
          >
            {resolvedSecondary.icon && <Icon name={resolvedSecondary.icon} size={20} />}
            <span>{resolvedSecondary.label}</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={resolvedSecondary.onClick}
            className={buttonClasses("neutral", "outlined", "md", "flex items-center gap-2 active:scale-[0.98]")}
          >
            {resolvedSecondary.icon && <Icon name={resolvedSecondary.icon} size={20} />}
            <span>{resolvedSecondary.label}</span>
          </button>
        )}

        <a
          href="/website/contact-us"
          className={buttonClasses("neutral", "text", "md", "flex items-center gap-2 text-ink-subtle hover:text-ink")}
        >
          <Icon name="help_outline" size={20} />
          <span>Helpdesk</span>
        </a>
      </div>

      {/* 5. Wayfinding Destination Cards */}
      {wayfindingLinks.length > 0 && (
        <div className="ds-error-view__wayfinding">
          <p className="ds-error-view__wayfinding-title">Popular Destinations</p>
          <ul className="ds-error-view__grid">
            {wayfindingLinks.map((item) => {
              const isExternal = item.external || item.href.startsWith("http");
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="ds-error-view__card"
                  >
                    <div className="ds-error-view__card-icon">
                      <Icon name={item.icon} size={24} />
                    </div>
                    <div className="ds-error-view__card-heading">
                      <span>{item.title}</span>
                      <Icon
                        name={isExternal ? "open_in_new" : "arrow_forward"}
                        size={16}
                        className="text-neutral-subtle"
                      />
                    </div>
                    <p className="ds-error-view__card-desc">{item.description}</p>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 6. Technical Diagnostics Details (if provided) */}
      {errorDetails && (
        <details className="ds-error-view__details">
          <summary className="ds-error-view__details-summary">Technical Diagnostics &amp; Error Details</summary>
          <pre className="ds-error-view__details-content">{errorDetails}</pre>
        </details>
      )}
    </section>
  );
}
