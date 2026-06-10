"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  Accessibility,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Contrast,
  Edit3,
  ExternalLink,
  Eye,
  FileDown,
  FileSpreadsheet,
  FileText,
  Globe2,
  LogIn,
  Menu,
  MoreVertical,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  adminDashboardSummary as dashboardSummary,
  adminNavItems as navItems,
  adminProgressCards as progressCards,
  expenditureLegend,
  formRoutes,
  loginCards,
  tableScreens,
  type TableScreen,
} from "@/lib/eutthan/portal-data";

const BASE = "/portals/eutthan-admin";
const defaultPath = "/dashboard";

function normalizePath(pathname: string): string {
  const p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) || "/" : pathname;
  if (p === "/") return defaultPath;
  // Only collapse /edit to the parent when there's no dedicated formRoute for it
  if (p.endsWith("/edit") && !formRoutes[p]) return p.replace("/edit", "");
  return p;
}

export function EutthanPortal() {
  const pathname = usePathname();
  const activePath = normalizePath(pathname);

  if (
    activePath === "/login" ||
    activePath === "/otp-login" ||
    activePath === "/forget-password" ||
    activePath === "/reset-password"
  ) {
    return <LoginScreen mode={activePath} />;
  }

  const screen = tableScreens[activePath];
  const form = formRoutes[activePath];

  return (
    <div className="app-shell">
      <TopBar />
      <Masthead />
      <div className="workspace">
        <Sidebar activePath={activePath} />
        <main id="main-content" className="content" tabIndex={-1}>
          {activePath === "/dashboard" ? <Dashboard /> : null}
          {screen ? <TablePage screen={screen} activePath={activePath} /> : null}
          {form ? <FormPage form={form} /> : null}
          {!screen && !form && activePath !== "/dashboard" ? <Dashboard /> : null}
        </main>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-left">
        <button className="mobile-menu" aria-label="Open navigation">
          <Menu size={22} />
        </button>
        <span className="flag" aria-hidden="true">
          <span />
        </span>
        <a href="#main-content" className="goi-link">
          Government of India <ExternalLink size={12} />
        </a>
      </div>
      <nav className="top-actions" aria-label="Accessibility and language controls">
        <a href="#main-content">Skip to Main Content</a>
        <span className="divider" />
        <button>A<sup>-</sup></button>
        <button>A</button>
        <button>A<sup>+</sup></button>
        <span className="divider" />
        <button aria-label="Toggle contrast">
          <Contrast size={16} />
        </button>
        <span className="divider" />
        <button aria-label="Accessibility options">
          <Accessibility size={16} />
        </button>
        <span className="divider" />
        <button className="language">
          <Globe2 size={16} /> English <ChevronDown size={14} />
        </button>
      </nav>
    </header>
  );
}

function Masthead() {
  return (
    <section className="masthead" aria-label="Portal masthead">
      <div className="brand-block">
        <Image src="/images/emblem.svg" alt="Government of India emblem" width={52} height={74} priority />
        <div>
          <div className="brand-meta">
            <span className="beta">BETA</span>
            <span>Government of India</span>
          </div>
          <h1>Ministry of Social Justice &amp; Empowerment</h1>
        </div>
      </div>
      <div className="profile">
        <span className="avatar">AU</span>
        <span>
          <strong>Admin User</strong>
          <small>(Super Admin)</small>
        </span>
      </div>
    </section>
  );
}

function Sidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="sidebar" aria-label="Portal navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          activePath === item.href ||
          item.children?.some((child) => child.href === activePath) ||
          (item.href !== "/dashboard" && activePath.startsWith(item.href));
        return (
          <div key={item.href}>
            <Link href={BASE + item.href} className={clsx("nav-item", isActive && "active")}>
              <Icon size={22} />
              <span>{item.label}</span>
              {item.children ? <ChevronRight className="nav-caret" size={18} /> : null}
            </Link>
            {item.children && isActive ? (
              <div className="subnav">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={BASE + child.href}
                    className={clsx(activePath === child.href && "active")}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </aside>
  );
}

function Dashboard() {
  return (
    <div className="page-stack">
      <h2 className="page-title">Dashboard</h2>
      <section className="summary-grid" aria-label="Dashboard summary">
        {dashboardSummary.map((metric, index) => (
          <article className="summary-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong className={index === 1 ? "primary-value" : undefined}>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Progress Report of Financial Year 2026-2027</h3>
          <button className="select-button">
            2026-2027 <ChevronDown size={16} />
          </button>
        </div>
        <div className="progress-grid">
          {progressCards.map((metric) => (
            <article className="stat-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="chart-panel">
        <h3>Top 6 Ministries / Department Expenditure 2026-2027</h3>
        <div className="chart-row">
          <div className="donut" aria-label="Donut chart showing top ministry expenditure" />
          <ul className="legend">
            {expenditureLegend.map(([label, color]) => (
              <li key={label}>
                <span style={{ background: color }} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function TablePage({ screen, activePath }: { screen: TableScreen; activePath: string }) {
  const isMapTabs = screen.variant === "map-tabs";
  const isExpenditure = screen.variant === "expenditure";
  const isReport = activePath.startsWith("/reports/");
  const isMinistriesDashboard = activePath === "/ministries-dashboard";
  const isRefresh = screen.addLabel === "Trigger Refresh" || isMinistriesDashboard;
  const isExportAction = isReport || screen.addLabel?.startsWith("Download") || screen.addLabel?.startsWith("Export");

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        <div className="table-actions">
          {/* Export buttons for report screens */}
          {isExportAction ? (
            <div className="export-buttons">
              <button className="icon-button" aria-label="Export CSV">
                <FileSpreadsheet size={16} /> CSV
              </button>
              <button className="icon-button" aria-label="Export Excel">
                <FileSpreadsheet size={16} /> Excel
              </button>
              <button className="icon-button" aria-label="Export PDF">
                <FileText size={16} /> PDF
              </button>
              <button className="icon-button" aria-label="Print">
                <Printer size={16} /> Print
              </button>
            </div>
          ) : null}
          {/* Trigger Refresh for expenditure screens */}
          {isRefresh ? (
            <button className="secondary-button">
              <RefreshCw size={16} /> Trigger Refresh
            </button>
          ) : null}
          {/* Add / Map button (non-report, non-refresh) */}
          {screen.addLabel && !isExportAction && !isRefresh ? (
            <Link className="primary-button" href={`${BASE}${activePath}/add`}>
              <Plus size={16} />
              {screen.addLabel}
            </Link>
          ) : null}
        </div>
      </div>

      {/* Map tabs (map-ministry / map-schema) */}
      {isMapTabs ? (
        <div className="map-tabs" role="tablist">
          <Link
            href={`${BASE}/map-ministry`}
            role="tab"
            aria-selected={activePath === "/map-ministry"}
            className={clsx("map-tab", activePath === "/map-ministry" && "active")}
          >
            Map Ministry
          </Link>
          <Link
            href={`${BASE}/map-schema`}
            role="tab"
            aria-selected={activePath === "/map-schema"}
            className={clsx("map-tab", activePath === "/map-schema" && "active")}
          >
            Map Schema
          </Link>
        </div>
      ) : null}

      <section className="data-card">
        <div className="toolbar">
          <label className="search-field">
            <Search size={18} />
            <input aria-label="Search" placeholder={screen.searchPlaceholder} />
          </label>
          {screen.filters?.map((filter) => (
            <button className="filter-button" key={filter}>
              {filter}
              {filter.includes("2026") ? <X size={16} /> : <ChevronDown size={16} />}
            </button>
          ))}
        </div>
        <div className={clsx("table-wrap", isExpenditure && "table-wrap--wide")}>
          <table>
            <thead>
              <tr>
                {screen.columns.map((column, index) => (
                  <th key={`${column}-${index}`}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screen.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className={rowIndex === 0 || rowIndex === 4 ? "selected-row" : undefined}>
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`}>
                      <CellValue value={cell} activePath={activePath} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination totalItems={screen.totalItems} />
      </section>

      {/* Statement 10A: Transfer Entry sub-section */}
      {activePath === "/reports/statement-10a" ? <TransferEntrySection /> : null}
    </div>
  );
}

function TransferEntrySection() {
  return (
    <section className="data-card" aria-label="Transfer Entry Details">
      <div className="panel-head">
        <h3>Transfer Entry Details</h3>
        <div className="export-buttons">
          <button className="icon-button" aria-label="Export CSV">
            <FileSpreadsheet size={16} /> CSV
          </button>
          <button className="icon-button" aria-label="Export Excel">
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button className="icon-button" aria-label="Export PDF">
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>
      <div className="table-wrap table-wrap--wide">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Ministry/Department</th>
              <th>Scheme Name</th>
              <th>Grant No.</th>
              <th>Transfer Entry (Cr.)</th>
              <th>Entry Date</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Dept of Agriculture and Farmers Welfare</td>
              <td>Crop Insurance Scheme</td>
              <td>001</td>
              <td>0.00</td>
              <td>08 Jun 2026</td>
              <td>—</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Ministry of New and Renewable Energy</td>
              <td>PM Surya Ghar Muft Bijli Yojana</td>
              <td>079</td>
              <td>0.00</td>
              <td>08 Jun 2026</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CellValue({ value, activePath }: { value: string; activePath: string }) {
  if (value === "checked") {
    return (
      <span className="checkbox checked" aria-label="Current financial year">
        <Check size={14} />
      </span>
    );
  }
  if (value === "menu") return <MoreVertical size={20} aria-label="More actions" />;
  if (value === "Active" || value === "Success") return <span className="badge success">{value}</span>;
  if (value === "Inactive" || value === "Failed") return <span className="badge danger">{value}</span>;
  if (value === "Pending") return <span className="badge warning">{value}</span>;
  if (value === "Yes") return <span className="badge success">{value}</span>;
  if (value === "No") return <span className="badge neutral">{value}</span>;
  if (value === "Unmap") {
    return (
      <button className="text-action text-action--danger">
        Unmap <X size={14} />
      </button>
    );
  }
  if (value.includes("Edit Delete")) {
    return (
      <span className="row-actions">
        <Link href={`${BASE}${activePath}/edit`} className="text-action">
          Edit <Edit3 size={14} />
        </Link>
        <button className="text-action text-action--danger">
          Delete <Trash2 size={14} />
        </button>
      </span>
    );
  }
  if (value === "Edit") {
    return (
      <Link href={`${BASE}${activePath}/edit`} className="text-action">
        Edit <Edit3 size={14} />
      </Link>
    );
  }
  if (value === "View") {
    return (
      <button className="text-action">
        View <Eye size={14} />
      </button>
    );
  }
  if (value === "Map") {
    return (
      <button className="text-action">
        Map <Edit3 size={14} />
      </button>
    );
  }
  if (value === "Retry") {
    return (
      <button className="text-action">
        Retry <RefreshCw size={14} />
      </button>
    );
  }
  if (value === "Download") {
    return (
      <button className="text-action">
        Download <FileDown size={14} />
      </button>
    );
  }
  return <>{value}</>;
}

function Pagination({ totalItems }: { totalItems: number }) {
  const pages =
    totalItems > 100
      ? ["1", "2", "3", "4", "5", "6", "...", String(Math.ceil(totalItems / 10))]
      : ["1"];
  return (
    <div className="pagination">
      <div className="pages">
        <button aria-label="Previous page" disabled>
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, index) => (
          <button key={`${page}-${index}`} className={index === 0 ? "current" : undefined}>
            {page}
          </button>
        ))}
        <button aria-label="Next page">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="page-size">
        <span>Showing</span>
        <button>
          10 <ChevronDown size={16} />
        </button>
        <span>of {totalItems} items</span>
      </div>
    </div>
  );
}

function FormPage({
  form,
}: {
  form: { title: string; subtitle: string; icon: React.ComponentType<{ size?: number }> };
}) {
  const Icon = form.icon;
  const isEdit = form.title.toLowerCase().includes("edit");
  return (
    <div className="page-stack">
      <h2 className="page-title">{form.title}</h2>
      <section className="form-card">
        <div className="form-intro">
          <span>
            <Icon size={24} />
          </span>
          <div>
            <h3>{form.title}</h3>
            <p>{form.subtitle}</p>
          </div>
        </div>
        <div className="form-grid">
          <Field label="Name / Title" placeholder={isEdit ? "Existing record" : "Enter details"} />
          <Field label="Financial Year" placeholder={isEdit ? "2026-2027" : "2026-2027"} />
          <Field label="Ministry / Department" placeholder={isEdit ? "Pre-filled ministry" : "Select ministry"} />
          <Field label="Status" placeholder={isEdit ? "Active" : "Active"} />
        </div>
        <label className="textarea-field">
          Remarks
          <textarea placeholder="Add remarks for audit trail" />
        </label>
        <div className="form-actions">
          <button className="secondary-button">Cancel</button>
          <button className="primary-button">{isEdit ? "Update" : "Save"}</button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="field">
      {label}
      <input placeholder={placeholder} />
    </label>
  );
}

function LoginScreen({ mode }: { mode: string }) {
  const title =
    mode === "/forget-password"
      ? "Forgot password"
      : mode === "/reset-password"
      ? "Reset password"
      : mode === "/otp-login"
      ? "OTP login"
      : "Admin login";
  return (
    <div className="login-screen">
      <TopBar />
      <main className="login-card">
        <div className="login-brand">
          <Image src="/images/emblem.svg" alt="Government of India emblem" width={58} height={82} />
          <div>
            <span className="beta">BETA</span>
            <h1>E-Utthan Portal</h1>
            <p>Ministry of Social Justice &amp; Empowerment</p>
          </div>
        </div>
        <section className="login-panel">
          <div>
            <h2>{title}</h2>
            <p>Sign in to manage E-Utthan schemes, ministry mapping, PFMS logs and reports.</p>
          </div>
          <label className="field">
            User ID
            <input placeholder="Enter user ID" />
          </label>
          <label className="field">
            Password / OTP
            <input placeholder="Enter secure credential" type="password" />
          </label>
          <Link className="primary-button wide" href={BASE + "/dashboard"}>
            <LogIn size={16} /> Continue
          </Link>
        </section>
        <div className="login-feature-grid">
          {loginCards.map(([heading, copy]) => (
            <article key={heading}>
              <CircleUserRound size={18} />
              <strong>{heading}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
