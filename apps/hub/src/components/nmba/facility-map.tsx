"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FacilityType, Facility } from "@/lib/nmba/types";
import { cn } from "@/lib/nmba/utils";

// Leaflet default icon fix for Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

// Categorical series from the DS chart scale — these are injected into inline
// styles on DOM nodes (marker divs + legend swatches), so var() resolves.
const FACILITY_COLORS: Record<FacilityType, string> = {
  /* Slots 1-5, IN ORDER. Only the first nine slots are guaranteed mutually
     distinguishable under a colour-vision deficiency; 10-12 are extension
     colours with no such guarantee. This map used to reach to slot 10 for its
     fifth category, which put ATF and DDAC at dE 1.5 under deuteranopia — one
     colour, on a public facility locator. Take them in order. */
  IRCA: "var(--sa-chart-cat-1)",
  CPLI: "var(--sa-chart-cat-2)",
  ODIC: "var(--sa-chart-cat-3)",
  DDAC: "var(--sa-chart-cat-4)",
  ATF: "var(--sa-chart-cat-5)",
};

const FACILITY_LABELS: Record<FacilityType, string> = {
  IRCA: "Integrated Rehabilitation Centre for Addicts (IRCAs)",
  CPLI: "Community Peer Led Intervention (CPLI)",
  ODIC: "Outreach and Drop-in Centres (ODIC)",
  DDAC: "District De-addiction Centre (DDAC)",
  ATF: "Addiction Treatment Facility (ATF)",
};

/** `divIcon` takes an HTML STRING, so anything interpolated into it must be escaped. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * THE MARKER CARRIES ITS OWN NAME AND ITS OWN TARGET SIZE.
 *
 * Leaflet renders every marker as a `role="button"` div. Passing `aria-label`
 * to react-leaflet's `<Marker>` does NOT reach that div — react-leaflet forwards
 * unknown props into Leaflet's options object, not onto the DOM — so axe
 * reported ten buttons with no accessible name, and a screen reader read ten
 * unnamed buttons. The name has to live inside the icon's own markup.
 *
 * The hit area is 24x24 for WCAG 2.5.8 while the visible dot stays 14px: the
 * outer box is transparent and centres the dot, so nothing changes visually and
 * the target stops being a third of the required size.
 */
function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    html:
      `<div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;position:relative">` +
      `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid var(--sa-chart-regionStroke);box-shadow:0 1px 3px color-mix(in srgb, var(--sa-text-neutral-bolder) 40%, transparent)"></div>` +
      `<span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0">${escapeHtml(label)}</span>` +
      `</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

interface FacilityMapProps {
  facilities: Facility[];
  className?: string;
  mini?: boolean;
  legendCollapsible?: boolean;
}

export function FacilityMap({ facilities, className, mini = false, legendCollapsible = false }: FacilityMapProps) {
  const [legendOpen, setLegendOpen] = React.useState(true);

  return (
    <div className={cn("relative", className)}>
      <MapContainer
        center={[22.5, 80.0]}
        zoom={mini ? 4 : 5}
        className={cn("w-full rounded-xl", mini ? "h-48" : "h-[500px]")}
        aria-label="De-addiction facilities map of India"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((f, i) => (
          <Marker
            key={i}
            position={[f.lat, f.lng]}
            icon={makeIcon(FACILITY_COLORS[f.type], `${f.name} — ${FACILITY_LABELS[f.type]}`)}
          >
            <Popup>
              <div className="max-w-[220px]">
                <p className="font-semibold text-ink">{f.name}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{FACILITY_LABELS[f.type]}</p>
                <p className="mt-1 text-xs text-ink-muted">{f.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[400] rounded-lg border border-line bg-white/95 p-3 shadow-pop backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-ink">Legend</span>
          {legendCollapsible && (
            <button
              onClick={() => setLegendOpen((o) => !o)}
              aria-label={legendOpen ? "Minimize legend" : "Expand legend"}
              className="text-xs text-ink-muted hover:text-ink"
            >
              {legendOpen ? "−" : "+"}
            </button>
          )}
        </div>
        {legendOpen && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {(Object.entries(FACILITY_LABELS) as [FacilityType, string][]).map(([type, label]) => (
              <li key={type} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full border border-white shadow-sm"
                  style={{ background: FACILITY_COLORS[type] }}
                  aria-hidden
                />
                <span className="text-[10px] leading-tight text-ink-muted">{label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
