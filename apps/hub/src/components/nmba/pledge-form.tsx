"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/nmba/toast";
import { STATES, STATE_DISTRICTS } from "@/lib/nmba/states";
import { Button, Input, Select, FormField } from "@mosje/design-system";

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
        <FormField label="Full Name" id="pledge-name" required>
          {(control) => (
            <Input
              {...control}
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
            />
          )}
        </FormField>

        <FormField label="Age" id="pledge-age" required>
          {(control) => (
            <Input
              {...control}
              type="number"
              name="age"
              required
              min={1}
              max={120}
              placeholder="Age"
            />
          )}
        </FormField>

        <FormField label="Mobile Number" id="pledge-mobile" required>
          {(control) => (
            <Input
              {...control}
              type="tel"
              name="mobile"
              required
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
            />
          )}
        </FormField>

        <FormField label="Email Address" id="pledge-email">
          {(control) => (
            <Input
              {...control}
              type="email"
              name="email"
              placeholder="your@email.com"
            />
          )}
        </FormField>

        <FormField label="State" id="pledge-state" required>
          {(control) => (
            <Select
              {...control}
              name="state"
              required
              value={state}
              onChange={(e) => { setState(e.target.value); setDistrict(""); }}
            >
              <option value="">Select State</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          )}
        </FormField>

        <FormField label="District" id="pledge-district">
          {(control) => (
            <Select
              {...control}
              name="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
            >
              <option value="">Select District</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          )}
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        iconRight={<ArrowRight className="h-4 w-4" />}
      >
        {submitting ? "Submitting…" : "I Take this Pledge"}
      </Button>
    </form>
  );
}
