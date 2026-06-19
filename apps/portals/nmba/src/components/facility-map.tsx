"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FacilityType, Facility } from "@/lib/types";
import { cn } from "@/lib/utils";

// Leaflet default icon fix for Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

const FACILITY_COLORS: Record<FacilityType, string> = {
  IRCA: "#2563eb",
  CPLI: "#16a34a",
  ODIC: "#d97706",
  DDAC: "#9333ea",
  ATF: "#dc2626",
};

const FACILITY_LABELS: Record<FacilityType, string> = {
  IRCA: "Integrated Rehabilitation Centre for Addicts (IRCAs)",
  CPLI: "Community Peer Led Intervention (CPLI)",
  ODIC: "Outreach and Drop-in Centres (ODIC)",
  DDAC: "District De-addiction Centre (DDAC)",
  ATF: "Addiction Treatment Facility (ATF)",
};

function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
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
            icon={makeIcon(FACILITY_COLORS[f.type])}
            aria-label={`${f.name} — ${FACILITY_LABELS[f.type]}`}
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
