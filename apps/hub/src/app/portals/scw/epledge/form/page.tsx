import * as React from "react";
import Link from "next/link";
import { UserShell } from "@/components/scw/user-shell";
import { Field, TextInput } from "@/components/scw/ui";
import { INDIAN_STATES } from "@/lib/scw/states";
import { Icon, Select, Card, Button } from "@mosje/design-system";

const GENDERS = ["Male", "Female", "Transgender"] as const;

export default function PledgeFormPage() {
  return (
    <UserShell>
      {/* Banner */}
      <div className="scw-login-panel relative overflow-hidden rounded-2xl px-8 py-10 text-white">
        <p className="text-label-1 text-white/75">
          Government of India / Department of Social Justice &amp; Empowerment
        </p>
        <h1 className="mt-3 text-display-5 font-display">
          Ageing with <span className="text-saffron">DIGNITY</span>
        </h1>
        <p className="mt-3 text-title-1 text-white/90">
          Call Toll-Free - 14567
        </p>
      </div>

      {/* Overlapping form card */}
      <Card className="-mt-6 mx-auto max-w-3xl p-6 sm:p-8">
        <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full Name" required>
            <TextInput type="text" placeholder="Enter full name" />
          </Field>

          <Field label="Age" required>
            <TextInput type="number" placeholder="Enter age" />
          </Field>

          <Field label="Gender" required>
            <Select options={[...GENDERS].map((value) => ({ value, label: value }))} placeholder="Select Gender" />
          </Field>

          <Field label="State" required>
            <Select options={[...INDIAN_STATES].map((value) => ({ value, label: value }))} placeholder="Select State" />
          </Field>

          <Field label="District" required>
            <Select options={[].map((value) => ({ value, label: value }))} placeholder="Select District" />
          </Field>

          <Field label="Pincode" required>
            <TextInput type="text" placeholder="Enter pincode" />
          </Field>

          <Field label="Mobile Number" required>
            <TextInput type="tel" placeholder="Enter mobile number" />
          </Field>

          <Field label="Email Address">
            <TextInput type="email" placeholder="Enter email address" />
          </Field>

          {/* Footer actions */}
          <div className="mt-2 flex items-center justify-between gap-3 sm:col-span-2">
            <Link
              href="/portals/scw/epledge"
              className="rounded-lg border border-navy/30 px-4 py-2.5 text-label-1 text-navy transition-colors hover:bg-navy/5"
            >
              Back
            </Link>
            <Button type="submit">
              Send OTP
              <Icon name="arrow_forward" size={16} />
            </Button>
          </div>
        </form>
      </Card>
    </UserShell>
  );
}
