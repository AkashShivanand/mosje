"use client";

/* PM-AJAY Dashboard — SVG chart primitives.
   Accessible: charts carry role="img" + aria-label; data charts ship an sr-only table. */

import { useId, type CSSProperties, type ReactNode } from "react";

export const C = {
  navy: "#003366",
  blue: "var(--pm-accent)",
  blue2: "#3f83c6",
  green: "#198754",
  amber: "#BB772B",
  red: "#EC5042",
  track: "#E5E7EB",
  grid: "#EEF1F5",
  ink: "#1F2937",
  muted: "#5B6573",
};

export const fmt = (n: number) => n.toLocaleString("en-IN");

/* visually-hidden data table — the accessible equivalent of a chart */
function SrData({
  caption,
  cols,
  rows,
}: {
  caption: string;
  cols: string[];
  rows: string[][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {cols.map((c, i) => (
            <th key={i}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- Sparkline (decorative; KPI value carries the meaning) ---- */
export function Sparkline({
  data,
  color = C.blue,
  w = 88,
  h = 30,
  fill = true,
  domainMin,
  domainMax,
}: {
  data: number[] | null;
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
  domainMin?: number;
  domainMax?: number;
}) {
  const id = "sp" + useId().replace(/:/g, "");
  if (!data || data.length < 2) return null;
  const pad = 2,
    min = domainMin != null ? domainMin : Math.min(...data),
    max = domainMax != null ? domainMax : Math.max(...data),
    rng = max - min || 1;
  const pts = data.map<[number, number]>((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    h - pad - ((v - min) / rng) * (h - pad * 2),
  ]);
  const line = pts
    .map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1))
    .join(" ");
  const area =
    `M${pts[0][0].toFixed(1)} ${h} ` +
    pts.map((p) => "L" + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") +
    ` L${pts[pts.length - 1][0].toFixed(1)} ${h} Z`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flex: "none" }}
    >
      {fill && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.16" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- Donut (with optional target marker) ---- */
export function Donut({
  pct,
  size = 150,
  sw = 14,
  color = C.green,
  track = C.track,
  center,
  sub,
  target,
  label,
}: {
  pct: number;
  size?: number;
  sw?: number;
  color?: string;
  track?: string;
  center?: ReactNode;
  sub?: string;
  target?: number;
  label?: string;
}) {
  const r = (size - sw) / 2,
    c = 2 * Math.PI * r,
    off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  let tick: ReactNode = null;
  if (target != null) {
    const a = ((-90 + (360 * target) / 100) * Math.PI) / 180,
      cx = size / 2,
      cy = size / 2;
    // round to fixed precision so SSR and client agree (avoids hydration mismatch)
    const f = (n: number) => Number(n.toFixed(3));
    tick = (
      <line
        x1={f(cx + (r - sw / 2 - 1) * Math.cos(a))}
        y1={f(cy + (r - sw / 2 - 1) * Math.sin(a))}
        x2={f(cx + (r + sw / 2 + 1) * Math.cos(a))}
        y2={f(cy + (r + sw / 2 + 1) * Math.sin(a))}
        stroke={C.navy}
        strokeWidth="2.5"
      />
    );
  }
  return (
    <div
      style={{ position: "relative", width: size, height: size, flex: "none" }}
      role="img"
      aria-label={`${label || sub || "Value"}: ${
        center != null ? center : pct + "%"
      }${target != null ? `, target ${target}%` : ""}`}
    >
      <svg width={size} height={size} aria-hidden="true" focusable="false">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={sw} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
        {tick}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ font: "600 26px/1 var(--font-sans)", color: C.ink, letterSpacing: "-.5px" }}>
          {center != null ? center : pct + "%"}
        </div>
        {sub && (
          <div
            style={{
              font: "500 11px/1.2 var(--font-sans)",
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              marginTop: 5,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

interface HBarItem {
  label: string;
  value: number;
  color?: string;
  display?: string;
}

/* ---- Horizontal ranked bars ---- */
export function HBars({
  data,
  max,
  color = C.blue,
  caption,
}: {
  data: HBarItem[];
  max?: number;
  color?: string;
  caption?: string;
}) {
  const mx = max || Math.max(...data.map((d) => d.value));
  return (
    <div
      role="img"
      aria-label={
        caption ||
        "Bar chart: " +
          data.map((d) => `${d.label} ${d.display != null ? d.display : d.value}`).join(", ")
      }
    >
      <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{ display: "grid", gridTemplateColumns: "150px 1fr 64px", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                font: "500 13px/1.2 var(--font-sans)",
                color: C.ink,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {d.label}
            </div>
            <div style={{ height: 9, background: C.grid, borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: (d.value / mx) * 100 + "%",
                  height: "100%",
                  background: d.color || color,
                  borderRadius: 999,
                  transition: "width .6s ease",
                }}
              />
            </div>
            <div style={{ font: "600 13px/1 var(--font-sans)", color: C.ink, textAlign: "right" }}>
              {d.display != null ? d.display : d.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Series {
  name: string;
  color: string;
  data: number[];
  fill?: boolean;
}

/* ---- Vertical bars (1–2 series) with value labels ---- */
export function VBars({
  labels,
  series,
  height = 200,
  unit,
  caption,
}: {
  labels: string[];
  series: Series[];
  height?: number;
  unit?: string;
  caption?: string;
}) {
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all) * 1.12;
  const ticks = 4;
  const single = series.length === 1;
  const cap =
    caption ||
    `Bar chart${unit ? " (" + unit + ")" : ""}: ` +
      labels.map((l, i) => `${l} — ` + series.map((s) => `${s.name} ${s.data[i]}`).join(", ")).join("; ");
  return (
    <div role="img" aria-label={cap}>
      <div aria-hidden="true" style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height,
            font: "400 11px/1 var(--font-sans)",
            color: C.muted,
            textAlign: "right",
            paddingBottom: 20,
            minWidth: 26,
          }}
        >
          {Array.from({ length: ticks + 1 }).map((_, i) => (
            <div key={i}>{Math.round(max - (max / ticks) * i)}</div>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: "0 0 20px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {Array.from({ length: ticks + 1 }).map((_, i) => (
              <div key={i} style={{ borderTop: `1px solid ${C.grid}`, height: 0 }} />
            ))}
          </div>
          <div
            style={{
              position: "relative",
              height,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              gap: 4,
              paddingBottom: 20,
            }}
          >
            {labels.map((lab, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                  position: "relative",
                }}
              >
                <div
                  style={{ display: "flex", gap: 4, alignItems: "flex-end", height: "100%", width: "100%", justifyContent: "center" }}
                >
                  {series.map((s, j) => (
                    <div
                      key={j}
                      style={{
                        position: "relative",
                        width: single ? 22 : 11,
                        height: Math.max(2, (s.data[i] / max) * (height - 20)) + "px",
                        background: s.color,
                        borderRadius: "3px 3px 0 0",
                        transition: "height .6s ease",
                      }}
                    >
                      {single && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            marginBottom: 3,
                            font: "600 10px/1 var(--font-sans)",
                            color: C.muted,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.data[i]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", bottom: 0, font: "400 10px/1 var(--font-sans)", color: C.muted }}>
                  {lab}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SrData
        caption={cap}
        cols={["Category", ...series.map((s) => s.name)]}
        rows={labels.map((l, i) => [l, ...series.map((s) => String(s.data[i]))])}
      />
    </div>
  );
}

/* ---- Line / area chart ---- */
export function LineArea({
  labels,
  series,
  height = 210,
  caption,
}: {
  labels: string[];
  series: Series[];
  height?: number;
  caption?: string;
}) {
  const w = 640,
    h = height,
    padL = 8,
    padR = 8,
    padT = 10,
    padB = 22;
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all) * 1.12;
  const min = 0;
  const X = (i: number) => padL + (i / (labels.length - 1)) * (w - padL - padR);
  const Y = (v: number) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
  const cap = caption || "Line chart: " + series.map((s) => s.name).join(", ");
  return (
    <div role="img" aria-label={cap}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        style={{ display: "block", overflow: "visible" }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={padL}
            x2={w - padR}
            y1={padT + t * (h - padT - padB)}
            y2={padT + t * (h - padT - padB)}
            stroke={C.grid}
            strokeWidth="1"
          />
        ))}
        {series.map((s, si) => {
          const line = s.data.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
          const id = "la" + si;
          return (
            <g key={si}>
              {s.fill !== false && (
                <>
                  <defs>
                    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={s.color} stopOpacity="0.14" />
                      <stop offset="1" stopColor={s.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={line + ` L${X(s.data.length - 1)} ${h - padB} L${X(0)} ${h - padB} Z`} fill={`url(#${id})`} />
                </>
              )}
              <path d={line} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        {labels.map((lab, i) => (
          <text key={i} x={X(i)} y={h - 6} fontSize="10" fill={C.muted} textAnchor="middle" fontFamily="var(--font-sans)">
            {lab}
          </text>
        ))}
      </svg>
      <SrData
        caption={cap}
        cols={["Period", ...series.map((s) => s.name)]}
        rows={labels.map((l, i) => [l, ...series.map((s) => String(s.data[i]))])}
      />
    </div>
  );
}

interface Stage {
  label: string;
  pct: number;
  value: string;
  color: string;
}

/* ---- Funnel / pipeline ---- */
export function Funnel({ stages, caption }: { stages: Stage[]; caption?: string }) {
  const max = Math.max(...stages.map((s) => s.pct));
  const cap = caption || "Pipeline: " + stages.map((s) => `${s.label} ${s.value} (${s.pct}%)`).join(", ");
  return (
    <div role="img" aria-label={cap}>
      <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr 96px", alignItems: "center", gap: 14 }}>
            <div style={{ font: "500 13px/1.2 var(--font-sans)", color: C.ink }}>{s.label}</div>
            <div style={{ height: 30, background: C.grid, borderRadius: 7, overflow: "hidden" }}>
              <div
                style={{
                  width: (s.pct / max) * 100 + "%",
                  height: "100%",
                  background: s.color,
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 12,
                  color: "#fff",
                  font: "600 12px/1 var(--font-sans)",
                  transition: "width .6s ease",
                }}
              >
                {s.pct}%
              </div>
            </div>
            <div style={{ font: "600 13px/1 var(--font-sans)", color: C.ink, textAlign: "right" }}>{s.value}</div>
          </div>
        ))}
      </div>
      <SrData caption={cap} cols={["Stage", "Value", "Share"]} rows={stages.map((s) => [s.label, s.value, s.pct + "%"])} />
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" } as CSSProperties} aria-hidden="true">
      {items.map((it, i) => (
        <div
          key={i}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "400 12px/1 var(--font-sans)", color: C.muted }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 3, background: it.color, flex: "none" }} />
          {it.label}
        </div>
      ))}
    </div>
  );
}
