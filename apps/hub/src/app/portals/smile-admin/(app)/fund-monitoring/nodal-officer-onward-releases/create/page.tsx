"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { IMPLEMENTING_AGENCIES } from "@/lib/smile-admin/mis-reports";
import { SANCTION_ORDERS } from "@/lib/smile-admin/mock-data";
import { formatINR } from "@/lib/smile-admin/utils";
import { Button, Input, Label } from "@mosje/design-system";

const RELEASED = SANCTION_ORDERS.filter((o) => o.status === "Approved");
const FIELD = "h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

export default function OnwardReleasePage() {
  const [orderId, setOrderId] = useState("");
  const [agency, setAgency] = useState("");
  const [amount, setAmount] = useState("");

  const order = useMemo(() => RELEASED.find((o) => o.id === orderId), [orderId]);
  const agenciesInState = useMemo(
    () => (order ? IMPLEMENTING_AGENCIES.filter((a) => a.state === order.state) : IMPLEMENTING_AGENCIES),
    [order],
  );

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Fund Monitoring", href: "/portals/smile-admin/fund-monitoring" }, { label: "Release Onwards" }]}
        eyebrow="Fund Monitoring"
        title="Release Onwards"
        subtitle="Onward release of NISD funds to an Implementing Authority / NGO / Institute in your district."
      />

      <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
        <section className="space-y-md rounded-lg border border-stroke-200 bg-white p-lg shadow-xs">
          <h2 className="text-title-2 text-ink">Released order</h2>
          <div className="grid gap-md md:grid-cols-2">
            <div className="space-y-xs">
              <Label htmlFor="or-order">Select released order</Label>
              <select id="or-order" value={orderId} onChange={(e) => setOrderId(e.target.value)} className={FIELD} required>
                <option value="">Select released order…</option>
                {RELEASED.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} — {o.state} — {formatINR(o.amount, true)}
                  </option>
                ))}
              </select>
            </div>
            {order ? (
              <dl className="grid grid-cols-2 gap-sm rounded-md bg-neutral-50 p-md text-body-2">
                <dt className="text-ink-muted">Scheme</dt>
                <dd className="text-ink">{order.scheme}</dd>
                <dt className="text-ink-muted">State</dt>
                <dd className="text-ink">{order.state}</dd>
                <dt className="text-ink-muted">Sanctioned</dt>
                <dd className="tabular-nums text-ink">{formatINR(order.amount, true)}</dd>
                <dt className="text-ink-muted">Sanction date</dt>
                <dd className="text-ink">{order.date}</dd>
              </dl>
            ) : null}
          </div>
        </section>

        <section className="space-y-md rounded-lg border border-stroke-200 bg-white p-lg shadow-xs">
          <div>
            <h2 className="text-title-2 text-ink">Recipient</h2>
            <p className="text-body-2 text-ink-muted">
              {order
                ? `Agencies onboarded in ${order.state}.`
                : "Choose a released order first — the recipient list is the agencies onboarded in that State/UT."}
            </p>
          </div>
          <div className="grid gap-md md:grid-cols-2">
            <div className="space-y-xs">
              <Label htmlFor="or-agency">Implementing Authority / NGO / Institute</Label>
              <select id="or-agency" value={agency} onChange={(e) => setAgency(e.target.value)} className={FIELD} disabled={!order} required>
                <option value="">Select agency…</option>
                {agenciesInState.map((a) => (
                  <option key={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <Label htmlFor="or-amount">Amount to release (₹)</Label>
              <Input
                id="or-amount"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 2500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!order}
                required
              />
              {order && amount && Number(amount) > order.amount ? (
                <p className="text-label-2 text-danger-600">
                  More than the sanctioned {formatINR(order.amount, true)}.
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-sm">
          <Button
            type="submit"
            disabled={!order || !agency || !amount || Number(amount) > (order?.amount ?? 0)}
          >
            Submit 1 Onward Release
          </Button>
          <Link href="/portals/smile-admin/fund-monitoring" className="text-label-1 text-ink-muted hover:text-ink">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
