"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/toast";
import { STATES, STATE_DISTRICTS } from "@/lib/states";
import { cn } from "@/lib/utils";

interface PledgeFormProps {
  onSuccess?: () => void;
}

export function PledgeForm({ onSuccess }: PledgeFormProps) {
  const { toast } = useToast();
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const districts = state ? (STATE_DISTRICTS[state] ?? []) : [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast("Pledge recorded. Download your certificate below.", "success");
      onSuccess?.();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">
      <h3 className="text-base font-semibold text-ink">Take the Pledge</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" required>
          <input
            type="text"
            name="name"
            required
            placeholder="Enter your full name"
            className={inputCls}
          />
        </Field>
        <Field label="Age" required>
          <input
            type="number"
            name="age"
            required
            min={1}
            max={120}
            placeholder="Age"
            className={inputCls}
          />
        </Field>
        <Field label="Mobile Number" required>
          <input
            type="tel"
            name="mobile"
            required
            pattern="[0-9]{10}"
            placeholder="10-digit mobile number"
            className={inputCls}
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className={inputCls}
          />
        </Field>
        <Field label="State" required>
          <select
            name="state"
            required
            value={state}
            onChange={(e) => { setState(e.target.value); setDistrict(""); }}
            className={selectCls}
          >
            <option value="">Select State</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="District">
          <select
            name="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!state}
            className={cn(selectCls, !state && "opacity-50")}
          >
            <option value="">Select District</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "I Take this Pledge"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";
const selectCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";
