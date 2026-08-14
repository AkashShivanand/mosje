"use client";

import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { STATE_DISTRIBUTION } from "@/lib/smile-admin/mock-data";

// Choropleth ramp + region roles come from the DS chart tokens
// (--sa-chart-seq-* is the single-hue sequential ramp built for exactly this).
// These are consumed as SVG fill/stroke values, which resolve var() fine.
const COLORS = [
  "var(--sa-chart-seq-50)",
  "var(--sa-chart-seq-100)",
  "var(--sa-chart-seq-200)",
  "var(--sa-chart-seq-300)",
  "var(--sa-chart-seq-400)",
  "var(--sa-chart-seq-600)",
  "var(--sa-chart-seq-700)",
  "var(--sa-chart-seq-800)",
];
const NO_DATA = "var(--sa-chart-regionEmpty)";
const SELECTED = "var(--sa-chart-cat-2)";
const BANDS = [0, 100, 500, 1000, 2000, 4000];

function colorFor(n: number) {
  if (!n) return NO_DATA;
  const idx = BANDS.findIndex((b) => n < b);
  return COLORS[idx === -1 ? COLORS.length - 1 : Math.max(0, idx - 1)];
}

interface StateFeatProps {
  st_nm: string;
  st_code: string;
}
type StateFeature = Feature<Geometry, StateFeatProps>;

export function IndiaMap({ highlightState }: { highlightState?: string }) {
  const [features, setFeatures] = useState<StateFeature[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/portals/smile-admin/india-states.topo.json")
      .then((r) => r.json())
      .then((topo) => {
        if (!alive) return;
        const fc = feature(topo, topo.objects.states) as unknown as FeatureCollection<Geometry, StateFeatProps>;
        setFeatures(fc.features);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const path = useMemo(() => {
    const projection = geoMercator().center([82.5, 22]).scale(950).translate([400, 280]);
    return geoPath(projection);
  }, []);

  const valueByState = useMemo(() => {
    const m = new Map<string, number>();
    STATE_DISTRIBUTION.forEach((s) => m.set(s.state, s.count));
    return m;
  }, []);

  return (
    <div className="relative">
      <svg viewBox="0 0 800 560" className="h-auto w-full">
        <g>
          {features.map((f) => {
            const stName = f.properties.st_nm;
            const value = valueByState.get(stName === "Andaman and Nicobar Islands" ? "Andaman & Nicobar Islands" : stName) ?? 0;
            const isHover = hovered === stName;
            const isHL = highlightState && stName.includes(highlightState);
            const fill = isHL ? SELECTED : colorFor(value);
            const d = path(f) ?? "";
            return (
              <path
                key={stName}
                d={d}
                fill={fill}
                stroke="var(--sa-chart-regionStroke)"
                strokeWidth={isHover ? 1.4 : 0.7}
                onMouseEnter={() => setHovered(stName)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer transition-opacity"
                style={{ opacity: hovered && !isHover ? 0.85 : 1 }}
              >
                <title>{stName}: {value.toLocaleString("en-IN")} beneficiaries</title>
              </path>
            );
          })}
        </g>
      </svg>
      <div className="absolute bottom-md right-md rounded-md border border-stroke-200 bg-white/95 p-sm text-label-3 shadow-md backdrop-blur-sm">
        <div className="mb-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Beneficiaries
        </div>
        <div className="space-y-0.5">
          {[
            ["No data", NO_DATA],
            ["< 100", COLORS[0]],
            ["100 – 499", COLORS[1]],
            ["500 – 999", COLORS[2]],
            ["1,000 – 1,999", COLORS[3]],
            ["2,000 – 3,999", COLORS[4]],
            ["4,000+", COLORS[7]],
            ["Selected", SELECTED],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-xs">
              <span className="inline-block h-2.5 w-3.5 rounded-xxs" style={{ backgroundColor: color as string }} />
              <span className="text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
