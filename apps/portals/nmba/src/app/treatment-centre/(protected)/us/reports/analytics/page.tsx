"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { PieChart, BarChart, type ChartDatum } from "@/components/treatment-centre/tc-charts";
import { DRUGS } from "@/lib/treatment-centre/master-data";

function tally(values: string[]): ChartDatum[] {
  const map = new Map<string, number>();
  for (const v of values) {
    const key = v || "Not specified";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

export default function USAnalyticsReportPage() {
  const store = useTCStore();

  const allGenders = React.useMemo(() => {
    const pGenders = store.patients.map((p) => p.gender);
    const bGenders = store.beneficiaries.map((b) => b.gender);
    return tally([...pGenders, ...bGenders]);
  }, [store.patients, store.beneficiaries]);

  const allResidence = React.useMemo(() => {
    const pRes = store.patients.map((p) => p.placeOfResidence);
    const bRes = store.beneficiaries.map((b) => b.placeOfResidence);
    return tally([...pRes, ...bRes]);
  }, [store.patients, store.beneficiaries]);

  const allTreatment = React.useMemo(() => {
    const pTreatment = store.patients.map((p) => {
      const val = p.previousDrugTreatment || p.clinicalDetails?.["Previous treatment"] || "No";
      return val === "Yes" ? "Previously Treated" : "First-time Treatment";
    });
    const bTreatment = store.beneficiaries.map((b) => {
      const val = b.details?.["Previous treatment"] || b.details?.["Previous Treatment"] || "No";
      return val === "Yes" ? "Previously Treated" : "First-time Treatment";
    });
    return tally([...pTreatment, ...bTreatment]);
  }, [store.patients, store.beneficiaries]);

  const allDrugs = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of store.patients) {
      for (const row of p.drugUse) {
        if (!row.drug) continue;
        const short = DRUGS.find((d) => d.label === row.drug)?.label.split(",")[0] ?? row.drug;
        map.set(short, (map.get(short) ?? 0) + 1);
      }
    }
    for (const b of store.beneficiaries) {
      if (b.drugUse) {
        for (const row of b.drugUse) {
          if (!row.drug) continue;
          const short = DRUGS.find((d) => d.label === row.drug)?.label.split(",")[0] ?? row.drug;
          map.set(short, (map.get(short) ?? 0) + 1);
        }
      }
    }
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [store.patients, store.beneficiaries]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-navy px-5 py-3.5 text-white">
        <h1 className="text-lg font-bold">Analytical Reports Dashboard</h1>
        <p className="text-xs text-white/70">Consolidated analytics across all state treatment centres and portals.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section aria-label="Gender Distribution" className="rounded-xl border border-line bg-white p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-semibold text-ink mb-4">Gender Distribution</h3>
          <PieChart data={allGenders} title="Gender distribution" />
          <div className="mt-4 border-t border-line pt-2 text-xs flex flex-col gap-1 text-ink-muted">
            {allGenders.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span className="font-semibold text-navy">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Residence Distribution" className="rounded-xl border border-line bg-white p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-semibold text-ink mb-4">Residence Classification</h3>
          <PieChart data={allResidence} title="Residence distribution" />
          <div className="mt-4 border-t border-line pt-2 text-xs flex flex-col gap-1 text-ink-muted">
            {allResidence.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span className="font-semibold text-navy">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Treatment Type Distribution" className="rounded-xl border border-line bg-white p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-semibold text-ink mb-4">Treatment History Split</h3>
          <PieChart data={allTreatment} title="Treatment history split" />
          <div className="mt-4 border-t border-line pt-2 text-xs flex flex-col gap-1 text-ink-muted">
            {allTreatment.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span className="font-semibold text-navy">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section aria-label="Drug Distribution" className="rounded-xl border border-line bg-white p-5 shadow-xs">
        <h3 className="text-base font-semibold text-ink mb-4">Substance Abuse Distribution</h3>
        <BarChart data={allDrugs} title="Substance Abuse Distribution" yLabel="Number of Incidents" />
      </section>
    </div>
  );
}
