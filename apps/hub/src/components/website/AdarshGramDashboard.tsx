import * as React from "react";
import { MetricCard, DonutChart, Icon } from "@mosje/design-system";

export function AdarshGramDashboard() {
  return (
    <section className="mt-12 flex flex-col gap-6 p-6 rounded-2xl bg-surface-muted/50 border border-ui-200">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-ink">
            Live Scheme Dashboard
          </h3>
          <p className="text-sm text-ink-muted mt-1">
            Real-time insights from pmagy.gov.in
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-ui-200 shadow-sm text-xs font-semibold text-primary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Data
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-xl bg-surface border border-ui-200 shadow-sm p-4 hover:shadow-md transition-shadow">
          <DonutChart
            title="Declared Adarsh Grams"
            value={17946}
            max={47247}
            center="38%"
            centerSub="Goal"
            color="var(--sa-color-success)"
          />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            label="Villages Covered"
            value="47,247"
            icon={<Icon name="location_city" />}
          />
          <MetricCard
            label="Works Completed"
            value="47,367"
            icon={<Icon name="construction" />}
          />
          <MetricCard
            label="SC Population Covered"
            value="4.03 Cr"
            icon={<Icon name="groups" />}
          />
          <MetricCard
            label="Gap Funds Released"
            value="₹1,201 Cr"
            icon={<Icon name="currency_rupee" />}
          />
        </div>
      </div>
    </section>
  );
}
