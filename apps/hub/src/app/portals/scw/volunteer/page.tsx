"use client";

import * as React from "react";
import { UserShell } from "@/components/scw/user-shell";
import { Button, Card, Field, Select, TextInput } from "@/components/scw/ui";
import { INDIAN_STATES } from "@/lib/scw/states";
import { VOLUNTEER_INTERESTS } from "@/lib/scw/mock-data";
import { cn } from "@/lib/scw/utils";

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

        {/* Individual / Organisation radio toggle */}
        <div className="mt-6 flex flex-wrap gap-6">
          {(
            [
              ["individual", "Individual"],
              ["organisation", "Organisation"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="inline-flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="volunteer-kind"
                checked={kind === value}
                onChange={() => setKind(value)}
                className="h-4 w-4 accent-navy"
              />
              <span className="text-label-1 text-ink">{label}</span>
            </label>
          ))}
        </div>

        <form className="mt-8 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Full Name" required>
              <TextInput type="text" placeholder="Enter your full name" />
            </Field>
            <Field label="Gender" required>
              <Select options={GENDERS} placeholder="Male" />
            </Field>
            <Field label="Date of Birth" required>
              <TextInput type="date" />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="State" required>
              <Select options={INDIAN_STATES} placeholder="Select state" />
            </Field>
            <Field label="District" required>
              <Select options={[]} placeholder="Select district" />
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

          {/* Areas of interest */}
          <div>
            <p className="mb-3 text-label-1 text-ink">
              Areas of Interest / Skills (Select all that apply)
              <span className="ml-0.5 text-red-500">*</span>
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {VOLUNTEER_INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="inline-flex cursor-pointer items-center gap-2.5"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-navy"
                  />
                  <span className="text-body-2 text-ink">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Consent */}
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded accent-navy"
            />
            <span className="text-body-2 text-ink-muted">
              I consent to share my profile details with registered Old Age
              Homes and MoSJE coordinators for volunteer matching purposes.
            </span>
          </label>

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
