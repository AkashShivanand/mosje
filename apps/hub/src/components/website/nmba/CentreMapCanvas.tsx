"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CENTRE_TYPE_META,
  type DeAddictionCentre,
} from "@/content/website/deaddiction-centres";

function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:15px;height:15px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.45)"></div>`,
    iconSize: [15, 15],
    iconAnchor: [7, 7],
  });
}

// Recenters/zooms the map when the filtered set changes.
function FitToCentres({ centres }: { centres: DeAddictionCentre[] }) {
  const map = useMap();
  React.useEffect(() => {
    const first = centres[0];
    if (!first) return;
    if (centres.length === 1) {
      map.setView([first.lat, first.lng], 9, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(centres.map((c) => [c.lat, c.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
  }, [centres, map]);
  return null;
}

interface CentreMapCanvasProps {
  centres: DeAddictionCentre[];
}

export function CentreMapCanvas({ centres }: CentreMapCanvasProps) {
  return (
    <MapContainer
      center={[22.5, 80.0]}
      zoom={4}
      scrollWheelZoom={false}
      className="h-[420px] w-full md:h-[520px]"
      aria-label="Map of De-addiction Centres across India"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToCentres centres={centres} />
      {centres.map((c, i) => (
        <Marker
          key={`${c.name}-${i}`}
          position={[c.lat, c.lng]}
          icon={makeIcon(CENTRE_TYPE_META[c.type].color)}
        >
          <Popup>
            <div className="max-w-[230px]">
              <p className="font-semibold text-ink">{c.name}</p>
              <p
                className="mt-0.5 text-xs font-medium"
                style={{ color: CENTRE_TYPE_META[c.type].color }}
              >
                {c.type} · {CENTRE_TYPE_META[c.type].label}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{c.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
