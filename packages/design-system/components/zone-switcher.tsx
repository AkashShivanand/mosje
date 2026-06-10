"use client";

import * as React from "react";
import { cn } from "../cn";
import "./zone-switcher.css";

export interface Zone {
  /** Display name. */
  name: string;
  /** Hub-origin path (e.g. "/website", "/portals/pm-ajay", "/storybook/"). */
  path: string;
  /** Short descriptor. */
  desc?: string;
  /** Group heading this zone appears under. */
  group: string;
}

export interface ZoneSwitcherProps {
  /** Override the default estate registry. */
  zones?: Zone[];
  /** Accessible label / FAB text. @default "Switch app" */
  label?: string;
  className?: string;
}

/** Default MoSJE estate registry — hub-origin paths (work from inside any zone). */
export const DEFAULT_ZONES: Zone[] = [
  { name: "Estate Hub", path: "/", desc: "All apps & portals", group: "Home" },
  { name: "DoSJE Website", path: "/website", desc: "Unified informational site", group: "Website" },
  { name: "PM-AJAY", path: "/portals/pm-ajay", desc: "MIS dashboard", group: "Portals" },
  { name: "SMILE Beggary", path: "/portals/smile-admin", desc: "Rehabilitation admin", group: "Portals" },
  { name: "E-Utthan Admin", path: "/portals/eutthan-admin", desc: "Scheme management", group: "Portals" },
  { name: "Storybook", path: "/storybook/", desc: "Component explorer", group: "Design System" },
  { name: "Design System", path: "/design-system", desc: "SAMAVESH docs (soon)", group: "Design System" },
];

/**
 * SAMAVESH ZoneSwitcher — a universal cross-zone launcher.
 *
 * Render once in each app's root layout (not the hub). It floats bottom-left and
 * lets users jump to any zone from anywhere. Links are plain anchors to hub-origin
 * paths, so they navigate correctly even from inside a basePath-ed app.
 */
export function ZoneSwitcher({
  zones = DEFAULT_ZONES,
  label = "Switch app",
  className,
}: ZoneSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [path, setPath] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();

  // Read the current location only on the client (avoids SSR mismatch).
  React.useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  // Close on outside click + Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Longest-prefix match marks the active zone.
  const activePath = React.useMemo(() => {
    if (!path) return null;
    let best: string | null = null;
    for (const z of zones) {
      const p = z.path === "/" ? "/" : z.path.replace(/\/$/, "");
      const matches = p === "/" ? path === "/" : path === p || path.startsWith(p + "/");
      if (matches && (best === null || p.length > best.length)) best = p;
    }
    return best;
  }, [path, zones]);

  // Preserve registry order within each group.
  const groups = React.useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, Zone[]>();
    for (const z of zones) {
      if (!map.has(z.group)) {
        map.set(z.group, []);
        order.push(z.group);
      }
      map.get(z.group)!.push(z);
    }
    return order.map((g) => ({ group: g, items: map.get(g)! }));
  }, [zones]);

  return (
    <div ref={rootRef} className={cn("ds-zswitch", className)}>
      {open && (
        <div className="ds-zswitch__panel" id={panelId} role="menu" aria-label="Estate zones">
          {groups.map(({ group, items }) => (
            <div key={group} role="group" aria-label={group}>
              <div className="ds-zswitch__group-label">{group}</div>
              {items.map((z) => {
                const p = z.path === "/" ? "/" : z.path.replace(/\/$/, "");
                const current = activePath === p;
                return (
                  <a
                    key={z.path}
                    href={z.path}
                    role="menuitem"
                    className="ds-zswitch__item"
                    aria-current={current ? "true" : undefined}
                  >
                    <span className="ds-zswitch__dot" aria-hidden="true" />
                    <span className="ds-zswitch__text">
                      <span className="ds-zswitch__name">{z.name}</span>
                      {z.desc && <span className="ds-zswitch__desc">{z.desc}</span>}
                    </span>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="ds-zswitch__fab"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="ds-zswitch__fab-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </button>
    </div>
  );
}
