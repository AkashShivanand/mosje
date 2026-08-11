"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Recharts renders SVG, so these resolve as var() in fill/stroke just like any
// other CSS colour. Series colours come from the DS chart scale rather than raw
// Tailwind hex, so a brand re-skin or theme switch carries the charts with it.
const PALETTE = {
  brand: "var(--sa-color-brand-navy)",
  brandSoft: "var(--sa-chart-seq-600)",
  info: "var(--sa-chart-cat-1)",
  success: "var(--sa-chart-trend-up)",
  warning: "var(--sa-chart-cat-6)",
  amber: "var(--sa-chart-cat-2)",
  axis: "var(--sa-chart-axis)",
  grid: "var(--sa-chart-grid)",
};

const tickStyle = { fill: PALETTE.axis, fontSize: 11 };
const tooltipStyle = {
  borderRadius: 8,
  borderColor: "var(--sa-border-neutral-base)",
  boxShadow: "var(--sa-elevation-modal)",
  fontSize: 12,
};

export function GenderDonut({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={2}
          stroke="var(--sa-chart-regionStroke)"
          strokeWidth={2}
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number, name) => [
            `${v.toLocaleString("en-IN")} (${((v / total) * 100).toFixed(1)}%)`,
            name,
          ]}
          contentStyle={tooltipStyle}
        />
        <Legend
          iconType="circle"
          formatter={(value) => (
            <span className="text-label-2 text-ink-muted">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AgeBars({ data }: { data: { band: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
      >
        <CartesianGrid stroke={PALETTE.grid} horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis
          dataKey="band"
          type="category"
          width={56}
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: PALETTE.grid }} contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill={PALETTE.info} radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TypeBars({ data }: { data: { type: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
      >
        <CartesianGrid stroke={PALETTE.grid} horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis
          dataKey="type"
          type="category"
          width={140}
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: PALETTE.grid }} contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill={PALETTE.amber} radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ActivityLine({
  data,
  series,
}: {
  data: { date: string; identified: number; mobilised: number; rehabilitated: number }[];
  series: "identified" | "mobilised" | "rehabilitated";
}) {
  const color =
    series === "identified"
      ? PALETTE.info
      : series === "mobilised"
      ? PALETTE.success
      : PALETTE.amber;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <defs>
          <linearGradient id={`grad-${series}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={PALETTE.grid} vertical={false} />
        <XAxis
          dataKey="date"
          tick={tickStyle}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
          tickFormatter={(d) => d.slice(5)}
        />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          dataKey={series}
          stroke={color}
          fill={`url(#grad-${series})`}
          strokeWidth={2}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ShelterStateBars({ data }: { data: { state: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ left: -10, right: 10, top: 8, bottom: 40 }}>
        <CartesianGrid stroke={PALETTE.grid} vertical={false} />
        <XAxis
          dataKey="state"
          tick={{ ...tickStyle, fontSize: 10 }}
          angle={-35}
          textAnchor="end"
          interval={0}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: PALETTE.grid }} contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill={PALETTE.warning} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyPerf({
  data,
}: {
  data: { month: string; identified: number; mobilised: number; rehab: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 12 }}>
        <CartesianGrid stroke={PALETTE.grid} vertical={false} />
        <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Line
          dataKey="identified"
          name="Identified"
          stroke={PALETTE.info}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobilised"
          name="Mobilised"
          stroke={PALETTE.brand}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="rehab"
          name="Rehabilitated"
          stroke={PALETTE.success}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
