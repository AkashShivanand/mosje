"use client";

import * as React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  CENTRE_TYPE_META,
  type DeAddictionCentre,
} from "@/content/website/deaddiction-centres";

export const centreKey = (c: DeAddictionCentre) => `${c.name}|${c.lat}|${c.lng}`;

function makeIcon(color: string, active: boolean) {
  const size = active ? 20 : 13;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${active ? 3 : 2}px solid white;box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function userIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:var(--sa-bg-brand-primary-bolder);border:3px solid white;box-shadow:0 0 0 4px rgba(3,115,223,.25)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function esc(s: string) {
  return s.replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m]!);
}

function ClusterLayer({
  centres,
  selectedKey,
  onSelect,
}: {
  centres: DeAddictionCentre[];
  selectedKey: string | null;
  onSelect: (c: DeAddictionCentre) => void;
}) {
  const map = useMap();
  React.useEffect(() => {
    const group = (L as unknown as { markerClusterGroup: (o: object) => L.LayerGroup }).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 46,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });
    centres.forEach((c) => {
      const meta = CENTRE_TYPE_META[c.type];
      const m = L.marker([c.lat, c.lng], { icon: makeIcon(meta.color, selectedKey === centreKey(c)) });
      m.bindPopup(
        `<div style="max-width:230px"><p style="font-weight:600;margin:0;color:#111">${esc(c.name)}</p>` +
          `<p style="margin:2px 0 0;font-size:12px;font-weight:600;color:${meta.color}">${c.type} · ${esc(meta.label)}</p>` +
          `<p style="margin:4px 0 0;font-size:12px;color:#555">${esc(c.address)}</p>` +
          `<p style="margin:3px 0 0;font-size:12px;color:#555">${esc(c.district)}, ${esc(c.state)}</p></div>`,
      );
      m.on("click", () => onSelect(c));
      group.addLayer(m);
    });
    map.addLayer(group);
    if (centres.length) {
      try {
        map.fitBounds((group as unknown as { getBounds: () => L.LatLngBounds }).getBounds(), {
          padding: [36, 36],
          maxZoom: 9,
        });
      } catch {
        /* empty bounds */
      }
    }
    return () => {
      map.removeLayer(group);
    };
  }, [centres, map, onSelect, selectedKey]);
  return null;
}

function FlyToSelected({ selected }: { selected: DeAddictionCentre | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], 12, { duration: 0.6 });
  }, [selected, map]);
  return null;
}

function UserMarker({ loc }: { loc: [number, number] | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (!loc) return;
    const m = L.marker(loc, { icon: userIcon(), zIndexOffset: 1000 }).bindPopup("You are here");
    m.addTo(map);
    map.flyTo(loc, 9, { duration: 0.6 });
    return () => {
      map.removeLayer(m);
    };
  }, [loc, map]);
  return null;
}

interface CentreMapCanvasProps {
  centres: DeAddictionCentre[];
  selected: DeAddictionCentre | null;
  userLoc: [number, number] | null;
  onSelect: (c: DeAddictionCentre) => void;
}

export function CentreMapCanvas({ centres, selected, userLoc, onSelect }: CentreMapCanvasProps) {
  return (
    <MapContainer
      center={[22.5, 80.0]}
      zoom={4}
      minZoom={3}
      /* markercluster needs a FINITE max zoom. Without one, `map.getMaxZoom()`
         returns Infinity, the plugin cannot compute its cluster levels, and it
         adds nothing to the map — a world view with no pins, which is exactly
         what both this section and /website/de-addiction-centres were showing. */
      maxZoom={18}
      scrollWheelZoom={false}
      className="h-full min-h-[380px] w-full"
      aria-label="Map of De-addiction Centres across India"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />
      <ClusterLayer centres={centres} selectedKey={selected ? centreKey(selected) : null} onSelect={onSelect} />
      <FlyToSelected selected={selected} />
      <UserMarker loc={userLoc} />
    </MapContainer>
  );
}
