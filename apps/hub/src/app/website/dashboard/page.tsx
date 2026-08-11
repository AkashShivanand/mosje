import type { Metadata } from "next";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { Icon } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Dashboard — DoSJE",
  description: "Key welfare metrics and scheme performance at a glance.",
};

interface Kpi {
  label: string;
  value: string;
  icon: string;
}

const KPIS: Kpi[] = [
  { label: "Cumulative Disbursement", value: "₹67,977 Cr", icon: "payments" },
  { label: "Beneficiaries Covered", value: "19.82 Cr", icon: "group" },
  { label: "Schemes & Programmes", value: "33+", icon: "grid_view" },
  { label: "Associated Organisations", value: "12", icon: "apartment" },
];

interface BarRow {
  label: string;
  value: string;
  percent: number;
}

const SCHEME_DISBURSEMENT: BarRow[] = [
  { label: "PM-AJAY", value: "₹21,450 Cr", percent: 100 },
  { label: "Post-Matric SC", value: "₹16,820 Cr", percent: 78 },
  { label: "Pre-Matric SC", value: "₹9,340 Cr", percent: 44 },
  { label: "NSFDC Loans", value: "₹6,210 Cr", percent: 29 },
  { label: "PM-YASASVI", value: "₹4,870 Cr", percent: 23 },
];

const BENEFICIARIES_BY_CATEGORY: BarRow[] = [
  { label: "SC", value: "9.12 Cr", percent: 100 },
  { label: "OBC", value: "7.04 Cr", percent: 77 },
  { label: "Senior Citizens", value: "2.38 Cr", percent: 26 },
  { label: "PwD / Others", value: "1.28 Cr", percent: 14 },
];

export default function DashboardPage() {
  return (
    <PageLayout
      title="Dashboard"
      breadcrumb={[{ label: "Dashboard" }]}
      description="Key welfare metrics and scheme performance at a glance."
      lastUpdated="06 Jun 2026"
    >
      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-12">
          {/* KPI stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map(({ label, value, icon: iconName }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[28px] font-bold leading-tight text-primary-dark">
                    {value}
                  </span>
                  <span className="rounded-lg bg-surface-muted p-2 text-primary">
                    <Icon name={iconName} size={20} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{label}</p>
              </div>
            ))}
          </div>

          {/* Bar panels */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Scheme-wise disbursement */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-dark">
                Scheme-wise Disbursement
              </h2>
              <p className="mt-1 text-xs text-gray-500">Cumulative, current financial year (illustrative)</p>
              <ul className="mt-5 space-y-4">
                {SCHEME_DISBURSEMENT.map(({ label, value, percent }) => (
                  <li key={label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-ink">{label}</span>
                      <span className="text-ink-muted">{value}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percent}%` }}
                        role="img"
                        aria-label={`${label}: ${value}`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Beneficiaries by category */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-dark">
                Beneficiaries by Category
              </h2>
              <p className="mt-1 text-xs text-gray-500">Cumulative coverage across schemes (illustrative)</p>
              <ul className="mt-5 space-y-4">
                {BENEFICIARIES_BY_CATEGORY.map(({ label, value, percent }) => (
                  <li key={label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-ink">{label}</span>
                      <span className="text-ink-muted">{value}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-saffron"
                        style={{ width: `${percent}%` }}
                        role="img"
                        aria-label={`${label}: ${value}`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            All figures shown are illustrative and for demonstration purposes only.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
