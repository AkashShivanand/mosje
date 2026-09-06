"use client";

import * as React from "react";
import Link from "next/link";
import { CitizenShell } from "@/components/nhapoa/citizen-shell";
import { Button, Field, TextInput } from "@/components/nhapoa/ui";
import { RESCUE_GENDERS } from "@/lib/nhapoa/citizen-data";
import { STATES, DISTRICTS } from "@/lib/nhapoa/store/seed";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { Icon , Textarea, Select, Card} from "@mosje/design-system";

export default function RegisterRescuePage() {
  const { createRescue } = useNhapoa();
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [pincode, setPincode] = React.useState("");
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [problem, setProblem] = React.useState("");
  const [refNo, setRefNo] = React.useState<string | null>(null);

  const canSubmit = !!name && verified && !!state && !!problem;

  function submit() {
    const r = createRescue({
      name,
      mobile,
      location: [address, district, state, pincode].filter(Boolean).join(", "),
      problem,
    });
    setRefNo(r.refNo);
  }

  if (refNo) {
    return (
      <CitizenShell>
        <Card className="mx-auto max-w-xl p-10 text-center">
          <Icon name="check_circle" size={56} className="mx-auto text-approve" />
          <h1 className="mt-4 text-headline-1 text-ink">Rescue request submitted</h1>
          <p className="mt-2 text-body-2 text-ink-muted">Help is being arranged. Keep your reference ID to follow up.</p>
          <p className="mt-5 rounded-lg bg-surface-muted px-4 py-3 font-mono text-title-1 text-navy">{refNo}</p>
          <Link href="/portals/nhapoa" className="mt-6 inline-block rounded-lg bg-navy px-5 py-2.5 text-label-1 font-semibold text-white hover:bg-navy-800">Back to Home</Link>
        </Card>
      </CitizenShell>
    );
  }

  return (
    <CitizenShell>
      <div className="mb-6">
        <h1 className="text-headline-1 text-ink">Register a Rescue</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Quick distress report. Only a few fields — name, mobile (we&apos;ll send an OTP), location, and the problem.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <p className="mb-6 text-label-3 uppercase text-ink-hint">Rescue Details · all fields are mandatory</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name" required><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" /></Field>
          <Field label="Gender"><Select options={[...RESCUE_GENDERS].map((value) => ({ value, label: value }))} placeholder="Select gender" value={gender} onChange={(e) => setGender(e.target.value)} /></Field>

          <Field label="Mobile No." required className="sm:col-span-2">
            <div className="flex gap-2">
              <TextInput inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} placeholder="Enter 10-digit Mobile Number" />
              {!verified ? (
                <Button type="button" variant="outline" onClick={() => (otpSent ? setVerified(true) : setOtpSent(true))} disabled={!/^\d{10}$/.test(mobile)}>
                  {otpSent ? "Verify" : "Send OTP"}
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg bg-approve-bg px-3 text-label-1 font-semibold text-approve-fg"><Icon name="check_circle" size={16} /> Verified</span>
              )}
            </div>
            {otpSent && !verified && <p className="mt-2 text-body-3 text-ink-hint">You&apos;ll receive a 6-digit OTP. Click Verify (demo: auto-verifies).</p>}
          </Field>

          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-label-3 uppercase text-ink-hint">Location</p>
              <button type="button" className="inline-flex items-center gap-1 text-label-2 font-semibold text-navy hover:underline"><Icon name="location_on" size={14} /> Use my current location</button>
            </div>
          </div>
          <Field label="Pincode"><TextInput inputMode="numeric" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} placeholder="6-digit Pincode" /></Field>
          <Field label="State" required><Select options={[...STATES].map((value) => ({ value, label: value }))} placeholder="Select State" value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }} /></Field>
          <Field label="District"><Select options={[...DISTRICTS[state] ?? ["District 1", "District 2"]].map((value) => ({ value, label: value }))} placeholder={state ? "Select District" : "Select state first"} value={district} onChange={(e) => setDistrict(e.target.value)} /></Field>
          <Field label="Full Address"><TextInput value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, landmark, locality" /></Field>

          <Field label="Problem" required className="sm:col-span-2">
            <Textarea rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Briefly describe what's happening" />
          </Field>
        </div>

        <div className="mt-8 flex justify-end border-t border-line pt-6">
          <Button type="button" onClick={submit} disabled={!canSubmit}>
            <Icon name="verified" size={16} /> Verify Mobile &amp; Continue
          </Button>
        </div>
      </Card>
    </CitizenShell>
  );
}
