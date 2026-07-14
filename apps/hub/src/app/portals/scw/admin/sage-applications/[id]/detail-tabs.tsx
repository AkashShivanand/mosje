"use client";

import * as React from "react";
import { FieldGrid, SectionTitle } from "@/components/scw/ui";
import { cn } from "@/lib/scw/utils";

type SageDetail = {
  company: [string, string][];
  product: [string, string][];
};

const TABS = [
  "Company Information",
  "Product / Service",
  "Team & Founders",
  "Financial & Investors",
  "Achievements",
] as const;

type Tab = (typeof TABS)[number];

export function DetailTabs({ detail }: { detail: SageDetail }) {
  const [active, setActive] = React.useState<Tab>("Company Information");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-x-6 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "-mb-px border-b-2 px-1 py-3 text-sm font-medium transition-colors",
              active === tab
                ? "border-navy text-navy"
                : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Company Information" && (
        <div>
          <SectionTitle>COMPANY DETAILS</SectionTitle>
          <FieldGrid items={detail.company} />
        </div>
      )}

      {active === "Product / Service" && (
        <div>
          <SectionTitle>PRODUCT / SERVICE</SectionTitle>
          <FieldGrid items={detail.product} />
        </div>
      )}

      {active === "Team & Founders" && (
        <div className="py-16 text-center text-sm text-ink-hint">No team data.</div>
      )}

      {active === "Financial & Investors" && (
        <div className="space-y-10">
          <div>
            <SectionTitle>FINANCIAL INFORMATION</SectionTitle>
            <div className="text-sm text-ink-hint">No financial information.</div>
          </div>
          <div>
            <SectionTitle>INVESTORS</SectionTitle>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-ink-muted">
                    <th className="px-6 py-3 font-semibold">Investor Name</th>
                    <th className="px-6 py-3 font-semibold">Investment Amount</th>
                    <th className="px-6 py-3 font-semibold">Share %</th>
                    <th className="px-6 py-3 font-semibold">Nature of Investment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-6 text-center text-ink-hint" colSpan={4}>
                      No investors.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {active === "Achievements" && (
        <div>
          <SectionTitle>AWARDS &amp; RECOGNITIONS</SectionTitle>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink-muted">
                  <th className="px-6 py-3 font-semibold">Award Name</th>
                  <th className="px-6 py-3 font-semibold">Year</th>
                  <th className="px-6 py-3 font-semibold">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="px-6 py-3 text-ink">NA</td>
                  <td className="px-6 py-3 text-ink"></td>
                  <td className="px-6 py-3 text-ink">India</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
