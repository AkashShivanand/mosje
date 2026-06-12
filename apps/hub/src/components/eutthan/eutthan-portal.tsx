"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  RefreshCw,
  Download,
  FileText,
  Upload,
  LogOut,
  Bell,
  Check,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  ToggleRight,
  Database,
  LayoutList,
} from "lucide-react";
import {
  type Role,
  type NavItem,
  adminNavItems,
  ministryNavItems,
  adminDashboardSummary,
  ministryDashboardSummary,
  adminProgressCards,
  ministryProgressCards,
  expenditureLegend,
  tableScreens,
  formDefs,
} from "@/lib/eutthan/portal-data";

const BASE = "/portals/eutthan-admin";

// DEMO ONLY — remove before production / replace with NIC SSO
// TODO(pre-prod): replace with NIC employee SSO; never commit real credentials
const DEMO_CREDENTIALS = [
  { role: "admin" as const, label: "Admin", username: "9990000011", demoPin: "admin@2026" },
  { role: "ministry" as const, label: "Ministry", username: "shivendra123", demoPin: "shivendra123" },
] as const;

function normalizePath(p: string): string {
  return p.startsWith(BASE) ? p.slice(BASE.length) || "/" : p;
}

function portalLink(p: string): string {
  return `${BASE}${p}`;
}

// ── Login ─────────────────────────────────────────────────────────────────────

function LoginPage({
  onLogin,
}: {
  onLogin: (u: string, p: string) => string | null;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = onLogin(username.trim(), password);
    if (err) setError(err);
  }

  return (
    <div className="login-split">
      {/* Left — blue panel */}
      <div className="login-left">
        <div className="login-left-content">
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            aria-hidden="true"
            style={{ marginBottom: 24 }}
          >
            <circle
              cx="36"
              cy="36"
              r="33"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />
            <circle
              cx="36"
              cy="36"
              r="21"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
            <circle cx="36" cy="22" r="5" fill="rgba(255,255,255,0.75)" />
            <path d="M36 27L24 48H48L36 27Z" fill="rgba(255,255,255,0.5)" />
          </svg>
          <div className="login-portal-name">eUtthan</div>
          <div className="login-ministry-name">
            Ministry of Social Justice
            <br />
            &amp; Empowerment
          </div>
          <div className="login-tagline">
            DAPSC Allocation &amp; Progress Tracking Portal
          </div>
          <div className="login-gov-tag">Government of India</div>
        </div>
      </div>

      {/* Right — form */}
      <div className="login-right">
        <form className="login-form-inner" onSubmit={submit} noValidate>
          <h1 className="login-form-title">Log In</h1>
          <p className="login-form-subtitle">
            Enter your credentials to access the portal
          </p>

          {error && (
            <div className="login-error-box" role="alert">
              {error}
            </div>
          )}

          <div className="field" style={{ marginTop: 24 }}>
            <label htmlFor="eu-username">Username / ID</label>
            <input
              id="eu-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label htmlFor="eu-password">Password</label>
            <input
              id="eu-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            style={{ marginTop: 28, width: "100%" }}
          >
            Log In
          </button>
        </form>

        {/* Demo credentials — DEMO ONLY, remove before production */}
        <div className="demo-creds-panel">
          <div className="demo-creds-header">Demo Credentials</div>
          <div className="demo-creds-rows">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                className="demo-creds-row"
                onClick={() => {
                  setUsername(cred.username);
                  setPassword(cred.demoPin);
                  setError(null);
                }}
                aria-label={"Use " + cred.label + " demo account: " + cred.username}
              >
                <span className="demo-role-tag">{cred.label}</span>
                <span className="demo-username">{cred.username}</span>
                <span className="demo-pin">{cred.demoPin}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Top Bar ───────────────────────────────────────────────────────────────────

function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="top-bar">
      <div className="top-left">
        <div className="flag">
          <span />
        </div>
        <span className="goi-link">Government of India</span>
        <span className="divider" />
        <span className="goi-link">
          Ministry of Social Justice &amp; Empowerment
        </span>
      </div>
      <div className="top-actions">
        <button type="button" aria-label="Notifications">
          <Bell size={15} />
        </button>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Logout"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// ── Masthead ──────────────────────────────────────────────────────────────────

function Masthead({ name, roleLabel }: { name: string; roleLabel: string }) {
  return (
    <div className="masthead">
      <div className="brand-block">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="30" cy="30" r="28" fill="#f3f4f6" stroke="#e5e7eb" />
          <circle cx="30" cy="18" r="5" fill="var(--primary)" />
          <path
            d="M30 23L18 45H42L30 23Z"
            fill="var(--primary)"
            opacity="0.65"
          />
        </svg>
        <div>
          <div className="brand-meta">
            <span>eUtthan Portal</span>
            <span className="beta">BETA</span>
          </div>
          <h1>DAPSC Allocation &amp; Progress Tracker</h1>
        </div>
      </div>
      <div className="profile">
        <div>
          <strong>{name}</strong>
          <small>{roleLabel}</small>
        </div>
        <div className="avatar">{name.charAt(0).toUpperCase()}</div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ navItems, path }: { navItems: NavItem[]; path: string }) {
  const [reportsOpen, setReportsOpen] = useState(() =>
    path.startsWith("/reports")
  );

  return (
    <nav className="sidebar" aria-label="Main navigation">
      {navItems.map((item) => {
        if (item.children) {
          const anyActive = item.children.some((c) => c.href === path);
          const open = reportsOpen || anyActive;
          return (
            <div key={item.href}>
              <button
                type="button"
                className={`nav-item${anyActive ? " active" : ""}`}
                style={{
                  width: "100%",
                  border: 0,
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
                onClick={() => setReportsOpen((o) => !o)}
                aria-expanded={open}
              >
                <item.icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
                {open ? (
                  <ChevronDown size={16} className="nav-caret" aria-hidden="true" />
                ) : (
                  <ChevronRight size={16} className="nav-caret" aria-hidden="true" />
                )}
              </button>
              {open && (
                <div className="subnav">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={portalLink(child.href)}
                      className={path === child.href ? "active" : ""}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        const isMapItem = item.href === "/map-ministry";
        const isActive = isMapItem
          ? path === "/map-ministry" || path === "/map-schema"
          : path === item.href || path.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={portalLink(item.href)}
            className={`nav-item${isActive ? " active" : ""}`}
          >
            <item.icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard() {
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
          gap: 24,
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
                      borderRadius: 2,
                      background: color as string,
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

// ── Ministry Dashboard ────────────────────────────────────────────────────────

function MinistryDashboard() {
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

// ── Cell Renderer ─────────────────────────────────────────────────────────────

function CellContent({
  col,
  val,
  basePath,
}: {
  col: string;
  val: string;
  basePath: string;
}) {
  if (col === "Current Financial Year") {
    return val === "checked" ? (
      <span className="checkbox checked" aria-label="Current year">
        <Check size={10} />
      </span>
    ) : (
      <span className="checkbox" aria-label="Not current year" />
    );
  }

  if (val === "menu") {
    return (
      <div className="row-actions">
        <button
          type="button"
          className="text-action"
          style={{ background: "rgba(0,51,102,0.08)" }}
          aria-label="More options"
        >
          •••
        </button>
      </div>
    );
  }

  if (val === "role-actions") {
    return (
      <div className="row-actions">
        <button
          type="button"
          className="text-action"
          style={{ background: "rgba(39,104,42,0.1)" }}
          aria-label="Toggle role"
        >
          <ToggleRight size={18} style={{ color: "var(--success)" }} />
        </button>
        <button
          type="button"
          className="text-action"
          style={{
            background: "rgba(0,51,102,0.08)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
          aria-label="Edit role"
        >
          <Edit size={14} /> Edit
        </button>
        <button
          type="button"
          className="text-action danger-action"
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          aria-label="Delete role"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    );
  }

  if (val === "Unmap") {
    return (
      <button
        type="button"
        className="text-action text-action--danger"
        style={{ background: "rgba(214,69,57,0.08)" }}
      >
        Unmap
      </button>
    );
  }

  if (val === "View") {
    return (
      <button
        type="button"
        className="text-action"
        style={{
          background: "rgba(0,51,102,0.08)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Eye size={14} /> View
      </button>
    );
  }

  if (val === "Edit Delete") {
    return (
      <div className="row-actions">
        <Link
          href={portalLink(`${basePath}/edit`)}
          className="text-action"
          style={{
            background: "rgba(0,51,102,0.08)",
            minHeight: 36,
            padding: "6px 12px",
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Edit size={14} /> Edit
        </Link>
        <button
          type="button"
          className="text-action danger-action"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    );
  }

  if (val === "Edit") {
    return (
      <div className="row-actions">
        <Link
          href={portalLink(`${basePath}/edit`)}
          className="text-action"
          style={{
            background: "rgba(0,51,102,0.08)",
            minHeight: 36,
            padding: "6px 12px",
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Edit size={14} /> Edit
        </Link>
      </div>
    );
  }

  if (col === "Status" && (val === "success" || val === "failed")) {
    return (
      <span className={`badge ${val === "success" ? "success" : "danger"}`}>
        {val}
      </span>
    );
  }

  if (col === "Type" && val === "Mapped") {
    return <span className="badge success">{val}</span>;
  }

  return <>{val || "—"}</>;
}

// ── Shared Pagination ─────────────────────────────────────────────────────────

function Pagination({ total }: { total: number }) {
  return (
    <div className="pagination">
      <div className="page-size">
        <span>Rows per page:</span>
        <button type="button">
          10 <ChevronDown size={12} />
        </button>
      </div>
      <div className="pages">
        <button type="button">&lsaquo;</button>
        <button type="button" className="current">
          1
        </button>
        {total > 10 && <button type="button">2</button>}
        {total > 20 && <button type="button">3</button>}
        <button type="button">&rsaquo;</button>
      </div>
      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
        {total} total
      </span>
    </div>
  );
}

// ── Map Page ──────────────────────────────────────────────────────────────────

function MapPage({ path }: { path: string }) {
  const isSchemas = path === "/map-schema";
  const screen = tableScreens[path] ?? tableScreens["/map-ministry"]!;

  return (
    <div className="page-stack">
      <h2 className="page-title">Map Ministry/Schemes</h2>

      <div className="map-tabs">
        <Link
          href={portalLink("/map-ministry")}
          className={`map-tab${!isSchemas ? " active" : ""}`}
        >
          Ministry
        </Link>
        <Link
          href={portalLink("/map-schema")}
          className={`map-tab${isSchemas ? " active" : ""}`}
        >
          Schemes
        </Link>
      </div>

      <div className="data-card">
        <div className="toolbar">
          <div className="search-field">
            <Search size={16} aria-hidden="true" />
            <input placeholder={screen.searchPlaceholder} />
          </div>
          {screen.filters?.map((f) => (
            <button key={f} type="button" className="filter-button">
              {f} <ChevronDown size={14} />
            </button>
          ))}
        </div>
        <div className="table-wrap table-wrap--wide">
          <table>
            <thead>
              <tr>
                {screen.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screen.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      <CellContent
                        col={screen.columns[j] ?? ""}
                        val={cell}
                        basePath={path}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={screen.totalItems} />
      </div>
    </div>
  );
}

// ── Statement 10A ─────────────────────────────────────────────────────────────

function Statement10APage() {
  const screen = tableScreens["/reports/statement-10a"]!;
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <div>
          <h2 className="page-title">{screen.title}</h2>
          {screen.subtitle && (
            <p
              style={{
                margin: "4px 0 0",
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              {screen.subtitle}
            </p>
          )}
        </div>
        <div className="export-buttons">
          <button type="button" className="icon-button">
            <Download size={14} /> Export CSV
          </button>
          <button type="button" className="icon-button">
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="panel" style={{ padding: "16px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
              }}
            >
              Financial Year
            </label>
            <button type="button" className="filter-button">
              2025-2026 <ChevronDown size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
              }}
            >
              Ministry/Department
            </label>
            <button type="button" className="filter-button">
              -- All Ministries -- <ChevronDown size={14} />
            </button>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => setLoaded(true)}
          >
            View
          </button>
        </div>
      </div>

      {loaded ? (
        <div className="data-card">
          <div className="table-wrap table-wrap--wide">
            <table>
              <thead>
                <tr>
                  {screen.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {screen.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={screen.totalItems} />
        </div>
      ) : (
        <div
          className="panel"
          style={{
            padding: 48,
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <LayoutList
            size={40}
            style={{
              opacity: 0.35,
              display: "block",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ margin: 0 }}>
            Select a Financial Year and click <strong>View</strong> to load
            data.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Financial Summary ─────────────────────────────────────────────────────────

function FinancialSummaryPage() {
  const screen = tableScreens["/reports/financial-summary"]!;

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="filter-button">
            {screen.filters?.[0]} <ChevronDown size={14} />
          </button>
          <div className="export-buttons">
            <button type="button" className="icon-button">
              <Download size={14} /> Export CSV
            </button>
            <button type="button" className="icon-button">
              <FileText size={14} /> Export PDF
            </button>
          </div>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar">
          <div className="search-field">
            <Search size={16} aria-hidden="true" />
            <input placeholder="Search for ministry..." />
          </div>
        </div>
        <div className="table-wrap table-wrap--wide">
          <table>
            <thead>
              <tr>
                {screen.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screen.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={screen.totalItems} />
      </div>
    </div>
  );
}

// ── PFMS Ingestion Logs ───────────────────────────────────────────────────────

function PfmsLogsPage() {
  const screen = tableScreens["/pfms-logs"]!;

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="secondary-button">
            <RefreshCw size={14} /> Refresh
          </button>
          <button type="button" className="primary-button">
            <Database size={14} /> Trigger PFMS Refresh
          </button>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          {screen.filters?.map((f) => (
            <button key={f} type="button" className="filter-button">
              {f} <ChevronDown size={14} />
            </button>
          ))}
          <input
            type="date"
            className="filter-button"
            style={{ padding: "8px 12px" }}
            aria-label="From date"
          />
          <input
            type="date"
            className="filter-button"
            style={{ padding: "8px 12px" }}
            aria-label="To date"
          />
        </div>
        <div className="table-wrap table-wrap--wide">
          <table style={{ minWidth: 1500 }}>
            <thead>
              <tr>
                {screen.columns.map((c) => (
                  <th key={c} style={{ whiteSpace: "nowrap" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screen.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        whiteSpace:
                          j === 0 || j === 1 || j === 9 || j === 10
                            ? "nowrap"
                            : undefined,
                      }}
                    >
                      <CellContent
                        col={screen.columns[j] ?? ""}
                        val={cell}
                        basePath="/pfms-logs"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={screen.totalItems} />
      </div>
    </div>
  );
}

// ── Physical Progress ─────────────────────────────────────────────────────────

function PhysicalProgressPage() {
  const screen = tableScreens["/ministry/physical-progress-data"]!;

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="icon-button">
            <Download size={14} /> Download Sample Template
          </button>
          <button type="button" className="icon-button">
            <Upload size={14} /> Import Achievements Data
          </button>
          <Link
            href={portalLink("/ministry/physical-progress-data/add")}
            className="primary-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <Plus size={16} /> Add Progress +
          </Link>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          <div className="search-field">
            <Search size={16} aria-hidden="true" />
            <input placeholder={screen.searchPlaceholder} />
          </div>
          {screen.filters?.map((f) => (
            <button key={f} type="button" className="filter-button">
              {f} <ChevronDown size={14} />
            </button>
          ))}
        </div>
        <div className="table-wrap table-wrap--wide">
          <table>
            <thead>
              <tr>
                {screen.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={screen.columns.length}
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    padding: 48,
                  }}
                >
                  No records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination total={0} />
      </div>
    </div>
  );
}

// ── Generic Table Page ────────────────────────────────────────────────────────

function TablePage({ path }: { path: string }) {
  const screen = tableScreens[path];
  if (!screen) {
    return (
      <div className="page-stack">
        <h2 className="page-title">Page Not Found</h2>
        <p style={{ color: "var(--text-muted)" }}>
          No screen configured for <code>{path}</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        {screen.addLabel && screen.addLabel !== "Export" && (
          <Link
            href={portalLink(`${path}/add`)}
            className="primary-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <Plus size={16} /> {screen.addLabel}
          </Link>
        )}
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          <div className="search-field">
            <Search size={16} aria-hidden="true" />
            <input placeholder={screen.searchPlaceholder} />
          </div>
          {screen.filters?.map((f) => (
            <button key={f} type="button" className="filter-button">
              {f} <ChevronDown size={14} />
            </button>
          ))}
        </div>
        <div className="table-wrap table-wrap--wide">
          <table>
            <thead>
              <tr>
                {screen.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screen.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={screen.columns.length}
                    style={{
                      textAlign: "center",
                      color: "var(--text-muted)",
                      padding: 48,
                    }}
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                screen.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>
                        <CellContent
                          col={screen.columns[j] ?? ""}
                          val={cell}
                          basePath={path}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination total={screen.totalItems} />
      </div>
    </div>
  );
}

// ── Form Page ─────────────────────────────────────────────────────────────────

function FormPage({ path }: { path: string }) {
  const form = formDefs[path];
  const backPath = path.replace(/\/(add|edit)$/, "");

  if (!form) {
    return (
      <div className="page-stack">
        <Link
          href={portalLink(backPath)}
          className="text-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,51,102,0.08)",
            padding: "8px 14px",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <p style={{ color: "var(--text-muted)" }}>
          Form not configured for: {path}
        </p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href={portalLink(backPath)}
          className="text-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(0,51,102,0.08)",
            minHeight: 36,
            padding: "6px 14px",
            borderRadius: 8,
          }}
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <h2 className="page-title">{form.title}</h2>
      </div>

      <div className="form-card">
        <div className="form-grid">
          {form.fields.map((field) => (
            <div
              key={field.label}
              className={field.type === "textarea" ? "textarea-field" : "field"}
              style={field.fullWidth ? { gridColumn: "1 / -1" } : undefined}
            >
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select
                  style={{
                    minHeight: 42,
                    border: "1px solid var(--stroke-200)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: "var(--text)",
                    background: "white",
                    font: "inherit",
                  }}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea placeholder={field.placeholder} />
              ) : field.type === "readonly" ? (
                <input
                  type="text"
                  value={field.placeholder ?? ""}
                  readOnly
                  style={{
                    background: "var(--surface-muted)",
                    cursor: "default",
                  }}
                  onChange={() => {}}
                />
              ) : field.type === "file" ? (
                <input type="file" accept=".pdf" />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>
        <div className="form-actions">
          <Link href={portalLink(backPath)} className="secondary-button">
            Cancel
          </Link>
          <button type="submit" className="primary-button">
            {form.submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Portal Component ─────────────────────────────────────────────────────

export default function EutthanPortal() {
  const pathname = usePathname();
  const path = normalizePath(pathname);

  const [role, setRole] = useState<Role | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("eutthan_role");
    const valid: readonly string[] = DEMO_CREDENTIALS.map((c) => c.role);
    const role: Role | null = valid.includes(stored ?? "") ? (stored as Role) : null;
    setRole(role);
    setHydrated(true);
  }, []);

  function handleLogin(username: string, password: string): string | null {
    for (const cred of DEMO_CREDENTIALS) {
      if (username === cred.username && password === cred.demoPin) {
        localStorage.setItem("eutthan_role", cred.role);
        setRole(cred.role);
        return null;
      }
    }
    return "Invalid username or password. Please try again.";
  }

  function handleLogout() {
    localStorage.removeItem("eutthan_role");
    setRole(null);
  }

  if (!hydrated) return null;
  if (!role) return <LoginPage onLogin={handleLogin} />;

  const navItems = role === "admin" ? adminNavItems : ministryNavItems;
  const userName = role === "admin" ? "Admin User" : "Shivendra";
  const roleLabel = role === "admin" ? "Super Admin" : "Ministry";

  function renderContent() {
    if (path === "/" || path === "/dashboard") {
      return role === "admin" ? <AdminDashboard /> : <MinistryDashboard />;
    }
    if (path === "/map-ministry" || path === "/map-schema") {
      return <MapPage path={path} />;
    }
    if (path === "/reports/statement-10a") {
      return <Statement10APage />;
    }
    if (path === "/reports/financial-summary") {
      return <FinancialSummaryPage />;
    }
    if (path === "/pfms-logs") {
      return <PfmsLogsPage />;
    }
    if (path === "/ministry/physical-progress-data") {
      return <PhysicalProgressPage />;
    }
    if (path.endsWith("/add") || path.endsWith("/edit")) {
      return <FormPage path={path} />;
    }
    if (tableScreens[path]) {
      return <TablePage path={path} />;
    }
    return (
      <div className="page-stack">
        <h2 className="page-title">Page Not Found</h2>
        <p style={{ color: "var(--text-muted)" }}>
          The path <code>{path}</code> could not be found.
        </p>
        <Link
          href={portalLink("/dashboard")}
          className="primary-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <a href="#eu-main-content" className="eu-skip-link">Skip to main content</a>
      <TopBar onLogout={handleLogout} />
      <Masthead name={userName} roleLabel={roleLabel} />
      <div className="workspace">
        <Sidebar navItems={navItems} path={path} />
        <main id="eu-main-content" className="content" tabIndex={-1}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
