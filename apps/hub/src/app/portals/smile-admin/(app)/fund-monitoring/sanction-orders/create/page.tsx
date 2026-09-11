"use client";

import { useState } from "react";
import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { STATES } from "@/lib/smile-admin/states";
import { formatINR } from "@/lib/smile-admin/utils";
import { Button, Checkbox, DataTable, Icon, Input, Label, type DataTableColumn } from "@mosje/design-system";

interface Coverage extends Record<string, unknown> {
  id: number;
  state: string;
  district: string;
}

const DISTRICTS: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Thane", "Pune", "Nagpur", "Nashik"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Mangaluru"],
  Delhi: ["New Delhi", "South Delhi", "East Delhi"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Tamil Nadu": ["Chennai", "Coimbatore"],
};

const FIELD = "h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

export default function NewSanctionOrderPage() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [instalment, setInstalment] = useState("1st");
  const [phase, setPhase] = useState("Phase 1");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [bankOnRecord, setBankOnRecord] = useState(false);
  const [coverage, setCoverage] = useState<Coverage[]>([]);

  const districts = state ? (DISTRICTS[state] ?? [`${state} district 1`]) : [];

  function addDistrict() {
    if (!state || !district) return;
    if (coverage.some((c) => c.state === state && c.district === district)) return;
    setCoverage((c) => [...c, { id: c.length + 1, state, district }]);
    setDistrict("");
  }

  const columns: DataTableColumn<Coverage>[] = [
    { key: "id", header: "#", className: "w-10 tabular-nums text-ink-hint" },
    { key: "state", header: "State / UT", sortable: true },
    { key: "district", header: "District", sortable: true },
    {
      key: "actions",
      header: "",
      noExport: true,
      className: "text-right",
      render: (r) => (
        <Button
          size="sm"
          variant="danger"
          appearance="text"
          onClick={() => setCoverage((c) => c.filter((x) => x.id !== r.id))}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Fund Monitoring", href: "/portals/smile-admin/fund-monitoring" }, { label: "New Sanction Order" }]}
        eyebrow="Fund Monitoring"
        title="New Sanction Order"
        subtitle="Under Secretary / Section Officer sanction order entry. One sanction can cover multiple States/UTs and districts."
      />

      <form
        className="space-y-lg"
        onSubmit={(e) => {
          // A prototype: the sanction is not filed anywhere, and pretending it
          // was would be worse than saying so.
          e.preventDefault();
        }}
      >
        <section className="space-y-md rounded-lg border border-stroke-200 bg-white p-lg shadow-xs">
          <h2 className="text-title-2 text-ink">Sanction</h2>
          <div className="grid gap-md md:grid-cols-2">
            <div className="space-y-xs">
              <Label htmlFor="so-amount">Sanctioned amount (₹)</Label>
              <Input
                id="so-amount"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 5000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {amount ? (
                <p className="text-label-2 text-ink-muted">{formatINR(Number(amount))}</p>
              ) : null}
            </div>
            <div className="space-y-xs">
              <Label htmlFor="so-date">Sanction date</Label>
              <Input id="so-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-xs">
              <Label htmlFor="so-instalment">Installment</Label>
              <select id="so-instalment" value={instalment} onChange={(e) => setInstalment(e.target.value)} className={FIELD}>
                {["1st", "2nd", "3rd"].map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <Label htmlFor="so-phase">Phase</Label>
              <select id="so-phase" value={phase} onChange={(e) => setPhase(e.target.value)} className={FIELD}>
                {["Phase 1", "Phase 2", "Phase 3"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-md rounded-lg border border-stroke-200 bg-white p-lg shadow-xs">
          <div>
            <h2 className="text-title-2 text-ink">Coverage</h2>
            <p className="text-body-2 text-ink-muted">
              Add every district this sanction covers. One sanction may cover more than one State/UT.
            </p>
          </div>
          <div className="grid items-end gap-md md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-xs">
              <Label htmlFor="so-state">State / UT</Label>
              <select
                id="so-state"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setDistrict("");
                }}
                className={FIELD}
              >
                <option value="">Select state…</option>
                {STATES.map((s) => (
                  <option key={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <Label htmlFor="so-district">District</Label>
              <select id="so-district" value={district} onChange={(e) => setDistrict(e.target.value)} className={FIELD} disabled={!state}>
                <option value="">Select district…</option>
                {districts.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <Button type="button" appearance="outlined" onClick={addDistrict} disabled={!state || !district}>
              <Icon name="add" size={14} /> Add District
            </Button>
          </div>

          {coverage.length > 0 ? (
            <DataTable
              columns={columns}
              data={coverage}
              total={coverage.length}
              showPageSizes={false}
              caption="Districts covered by this sanction"
              emptyLabel="No district added yet."
            />
          ) : (
            <p className="rounded-md border border-dashed border-stroke-300 px-md py-lg text-center text-body-2 text-ink-muted">
              No district added yet. A sanction cannot be submitted without at least one.
            </p>
          )}

          <Checkbox
            checked={bankOnRecord}
            onChange={(e) => setBankOnRecord(e.target.checked)}
            label="Bank details of the covered districts are available / on record"
          />
        </section>

        <section className="space-y-md rounded-lg border border-stroke-200 bg-white p-lg shadow-xs">
          <h2 className="text-title-2 text-ink">Sanction order document</h2>
          <div className="space-y-xs">
            <Label htmlFor="so-file">Signed sanction order (PDF)</Label>
            <input
              id="so-file"
              type="file"
              accept="application/pdf"
              className="block w-full text-body-2 text-ink-muted file:mr-md file:rounded-md file:border file:border-stroke-300 file:bg-white file:px-md file:py-xs file:text-label-1 file:text-ink"
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-sm">
          <Button type="submit" disabled={!amount || !date || coverage.length === 0}>
            Review &amp; Submit
          </Button>
          <Link href="/portals/smile-admin/fund-monitoring" className="text-label-1 text-ink-muted hover:text-ink">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
