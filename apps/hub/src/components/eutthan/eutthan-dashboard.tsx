"use client";

import {
  adminDashboardSummary,
  ministryDashboardSummary,
  adminProgressCards,
  ministryProgressCards,
  expenditureLegend,
} from "@/lib/eutthan/portal-data";

export function AdminDashboard() {
  return (
    <div className="page-stack">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 className="page-title">Dashboard</h2>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Active FY: <strong>2025-2026</strong>
        </span>
      </div>

      <div className="summary-grid">
        {adminDashboardSummary.map((m) => (
          <div key={m.label} className="summary-card">
            <span>{m.label}</span>
            <strong>{m.value}</strong>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) min-content",
          gap: "var(--sa-inline-24)",
          alignItems: "start",
        }}
      >
        <div className="panel">
          <div className="panel-head">
            <h3>Progress Overview</h3>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              As on 10 Jun 2026
            </span>
          </div>
          <div className="progress-grid">
            {adminProgressCards.map((c) => (
              <div key={c.label} className="stat-card">
                <span>{c.label}</span>
                <strong style={{ fontSize: 22 }}>{c.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-panel">
          <h3>Expenditure Breakdown</h3>
          <p className="sr-only">
            Expenditure breakdown by department: Food and Public Distribution,
            Rural Development, Fertilisers, School Education and Literacy,
            Agriculture and Farmers Welfare, and Health and Family Welfare.
          </p>
          <div className="chart-row">
            <div className="donut" aria-hidden="true" />
            <ul className="legend">
              {expenditureLegend.map(([label, color]) => (
                <li key={label}>
                  <span
                    style={{
                      display: "block",
                      width: 14,
                      height: 14,
                      borderRadius: "var(--sa-shape-2)",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MinistryDashboard() {
  return (
    <div className="page-stack">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 className="page-title">Dashboard</h2>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Active FY: <strong>2025-2026</strong>
        </span>
      </div>

      <div className="summary-grid">
        {ministryDashboardSummary.map((m) => (
          <div key={m.label} className="summary-card">
            <span>{m.label}</span>
            <strong>{m.value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Progress Overview</h3>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            As on 10 Jun 2026
          </span>
        </div>
        <div className="progress-grid">
          {ministryProgressCards.map((c) => (
            <div key={c.label} className="stat-card">
              <span>{c.label}</span>
              <strong style={{ fontSize: 22 }}>{c.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
