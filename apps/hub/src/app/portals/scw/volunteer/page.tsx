"use client";

import * as React from "react";
import { UserShell } from "@/components/scw/user-shell";
import { Button, Field, TextInput } from "@/components/scw/ui";
import { INDIAN_STATES } from "@/lib/scw/states";
import { VOLUNTEER_INTERESTS } from "@/lib/scw/mock-data";
import { cn } from "@/lib/scw/utils";
import { Checkbox, CheckboxGroup, RadioGroup , Select, Card} from "@mosje/design-system";

const GENDERS = ["Male", "Female", "Transgender"] as const;
type VolunteerKind = "individual" | "organisation";

export default function VolunteerRegistrationPage() {
  const [kind, setKind] = React.useState<VolunteerKind>("individual");

  return (
    <UserShell>
      <Card className="mx-auto max-w-4xl p-6 sm:p-8">
        <h1 className="text-headline-1 text-ink">Join as a Volunteer</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          Tell us about yourself and how you would like to contribute.
        </p>

        <RadioGroup
          className="mt-6"
          legend="Registering As"
          name="volunteer-kind"
          orientation="horizontal"
          options={[
            { value: "individual", label: "Individual" },
            { value: "organisation", label: "Organisation" },
          ]}
          value={kind}
          onChange={(v) => setKind(v as VolunteerKind)}
        />

        <form className="mt-8 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Full Name" required>
              <TextInput type="text" placeholder="Enter your full name" />
            </Field>
            <Field label="Gender" required>
              <Select options={[...GENDERS].map((value) => ({ value, label: value }))} placeholder="Select gender" />
            </Field>
            <Field label="Date of Birth" required>
              <TextInput type="date" />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="State" required>
              <Select options={[...INDIAN_STATES].map((value) => ({ value, label: value }))} placeholder="Select state" />
            </Field>
            <Field label="District" required>
              <Select options={[].map((value) => ({ value, label: value }))} placeholder="Select district" />
            </Field>
            <Field label="Pincode" required>
              <TextInput type="text" placeholder="Enter pincode" />
            </Field>
          </div>

          {/* Full address */}
          <Field label="Full Address" required>
            <textarea
              rows={3}
              placeholder="Enter your full address"
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
            />
          </Field>

          {/* Row 3 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Mobile Number" required>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-line bg-slate-50 px-3.5 text-label-1 text-ink-muted">
                  +91
                </span>
                <TextInput
                  type="tel"
                  placeholder="Enter mobile number"
                  className="rounded-l-none"
                />
              </div>
            </Field>
            <Field label="Email Address" required>
              <TextInput type="email" placeholder="Enter email address" />
            </Field>
          </div>

          <CheckboxGroup
            legend="Areas of Interest / Skills"
            hint="Select all that apply."
            name="interests"
            required
            orientation="horizontal"
            options={VOLUNTEER_INTERESTS.map((interest) => ({ value: interest, label: interest }))}
          />

          <Checkbox
            name="consent"
            required
            label="I consent to share my profile details with registered Old Age Homes and MoSJE coordinators for volunteer matching purposes."
          />

          {/* Footer actions */}
          <div className={cn("flex items-center justify-end gap-3 pt-2")}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save and Continue</Button>
          </div>
        </form>
      </Card>
    </UserShell>
  );
}
