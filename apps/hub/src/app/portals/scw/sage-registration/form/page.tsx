"use client";

import * as React from "react";
import { Download, Eye, Plus } from "lucide-react";
import { UserShell } from "@/components/scw/user-shell";
import {
  Button,
  Card,
  DataTable,
  Field,
  Stepper,
  TextInput,
} from "@/components/scw/ui";

const STEPS = [
  "Company Information",
  "Product / Service",
  "Team & Founders",
  "Financial & Investors",
  "Achievements",
  "Review & Submit",
];

/* ----------------------------------------------------------- helpers */
function ReadonlyField({
  label,
  value,
  required,
  className,
}: {
  label: string;
  value: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field label={label} required={required} className={className}>
      <TextInput value={value} disabled readOnly />
    </Field>
  );
}

function ReadonlyTextarea({
  label,
  value,
  required,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <textarea
        value={value}
        disabled
        readOnly
        rows={3}
        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15 disabled:opacity-100"
      />
    </Field>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-sm font-bold text-ink">{children}</h3>;
}

function DocumentRow({ label, filename }: { label: string; filename: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="mt-0.5 text-xs text-ink-hint">{filename}</div>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline"
      >
        <Download className="h-4 w-4" />
        Download
      </button>
    </div>
  );
}

/* ----------------------------------------------------------- steps */
function StepCompanyInformation() {
  return (
    <div className="space-y-8">
      <section>
        <GroupTitle>Company Details</GroupTitle>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <ReadonlyField label="Company Name" value="iuutrt" required />
          <ReadonlyField label="Date of Incorporation" value="28/10/2008" required />
          <ReadonlyField label="Company's Operation in India since Year" value="2015" required />
          <ReadonlyField label="Type of Company" value="OPC (One Person Company)" required />
          <ReadonlyField
            label="Startup company's authorised representative"
            value="Founder"
            required
          />
          <ReadonlyField label="Registered Office Address" value="kmlhjk" required />
        </div>
      </section>

      <section>
        <GroupTitle>Corporate Information</GroupTitle>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <ReadonlyField label="Founder Name" value="sai" required />
          <ReadonlyField label="Mobile Number" value="7780454557" required />
          <ReadonlyField label="Email" value="malluvikram333@gmail.com" required />
          <ReadonlyField label="Number of Employees" value="12" />
          <ReadonlyField label="DIPP ID" value="DIPP123456" />
          <ReadonlyField label="Startup registered with DIPP" value="Yes" required />
          <ReadonlyField label="Incubated" value="Yes" required />
          <ReadonlyField label="Website URL" value="https://example.com" />
          <ReadonlyField label="Incubator Details" value="—" />
        </div>
      </section>

      <section>
        <GroupTitle>Business Information</GroupTitle>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <ReadonlyTextarea
            label="Objective & Strategy"
            value="Building affordable assistive technology for senior citizens across India."
            required
          />
          <ReadonlyTextarea
            label="Why funds required under SAGE"
            value="To scale manufacturing and expand distribution to underserved regions."
            required
          />
        </div>
      </section>

      <section>
        <GroupTitle>Financial Snapshot</GroupTitle>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <ReadonlyField label="Present Paid-up Capital (₹)" value="10,00,000" required />
          <ReadonlyField label="Amount of loans from banks (₹)" value="0" required />
        </div>
      </section>

      <section>
        <GroupTitle>Document Uploads</GroupTitle>
        <div className="space-y-3">
          <DocumentRow label="Paid-up Capital Proof" filename="TESTING_DATA.pdf" />
          <DocumentRow label="Investor Pitch Presentation" filename="images.pdf" />
        </div>
      </section>
    </div>
  );
}

function StepProductService() {
  return (
    <section>
      <GroupTitle>Product / Service List</GroupTitle>
      <DataTable
        columns={[
          { key: "name", label: "Product/Service Name" },
          { key: "year", label: "Launch Year" },
          { key: "actions", label: "Actions", className: "text-right" },
        ]}
      >
        <tr>
          <td className="px-6 py-4 text-ink">zxcvbnm</td>
          <td className="px-6 py-4 text-ink-muted">2022</td>
          <td className="px-6 py-4 text-right">
            <button
              type="button"
              className="inline-flex items-center text-navy hover:text-navy-800"
              aria-label="View product"
            >
              <Eye className="h-4 w-4" />
            </button>
          </td>
        </tr>
      </DataTable>
    </section>
  );
}

function StepTeamFounders() {
  return (
    <section>
      <GroupTitle>Member List</GroupTitle>
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "designation", label: "Designation" },
          { key: "contact", label: "Contact" },
          { key: "email", label: "Email" },
          { key: "experience", label: "Experience" },
          { key: "actions", label: "Actions", className: "text-right" },
        ]}
      >
        <tr>
          <td className="px-6 py-4 text-ink">sai</td>
          <td className="px-6 py-4 text-ink-muted">ceo</td>
          <td className="px-6 py-4 text-ink-muted">7780454557</td>
          <td className="px-6 py-4 text-ink-muted">malluvikram333@gmail.com</td>
          <td className="px-6 py-4 text-ink-muted">4</td>
          <td className="px-6 py-4 text-right">
            <button
              type="button"
              className="inline-flex items-center text-navy hover:text-navy-800"
              aria-label="View member"
            >
              <Eye className="h-4 w-4" />
            </button>
          </td>
        </tr>
      </DataTable>
    </section>
  );
}

function StepFinancialInvestors() {
  return (
    <div className="space-y-8">
      <section>
        <GroupTitle>Investors List</GroupTitle>
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-hint">
          No Investor Added yet
        </div>
      </section>

      <section>
        <GroupTitle>Financial Details</GroupTitle>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <ReadonlyField label="Financial Year" value="2015" required />
          <ReadonlyField label="Audited Annual Turnover (₹)" value="98,76,78,987" required />
          <ReadonlyField
            label="Annual Revenue from Product/Service (₹)"
            value="8,78,98,76,789"
            required
          />
          <ReadonlyField label="Designation" value="kjbhjjhbv" />
          <ReadonlyField label="Experience" value="3-5 years" required />
          <ReadonlyField label="Blacklisted by Government?" value="No" required />
          <ReadonlyField label="Legal Cases Against Company?" value="No" required />
          <ReadonlyField label="Funding Received from Agencies?" value="No" required />
        </div>
      </section>

      <section>
        <GroupTitle>Documents</GroupTitle>
        <div className="space-y-3">
          <DocumentRow
            label="Upload Financial Statement (Balance Sheet / P&L)"
            filename="TESTING_DATA.pdf"
          />
          <DocumentRow label="Upload Financial Projections Document" filename="images.pdf" />
        </div>
      </section>
    </div>
  );
}

function StepAchievements() {
  return (
    <section>
      <GroupTitle>Award List</GroupTitle>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brandwash text-navy">
          <Plus className="h-6 w-6" />
        </div>
        <div className="mt-4 text-sm font-semibold text-ink">No Award Added yet</div>
        <div className="mt-1 text-sm text-ink-hint">No awards were added.</div>
      </div>
    </section>
  );
}

function StepReviewSubmit() {
  return (
    <section>
      <GroupTitle>Review & Submit</GroupTitle>
      <div className="rounded-2xl border border-line bg-surface-muted p-6">
        <p className="text-sm text-ink-muted">Review your application before submission.</p>
        <p className="mt-3 text-sm text-ink">
          This application has been approved and submitted. All sections are read-only and no
          further changes can be made.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- page */
export default function SageRegistrationFormPage() {
  const [step, setStep] = React.useState(0);
  const done = Array.from({ length: step }, (_, i) => i);
  const isLast = step === STEPS.length - 1;

  return (
    <UserShell user={{ name: "vikram", email: "vikrammallu123@gmail.com", initials: "V" }}>
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-ink">SAGE Registration</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your application has been approved. Fields are read-only.
        </p>

        <div className="mt-4 rounded bg-approve-bg p-3 text-sm font-medium text-approve-fg">
          Read-only view — application approved. No changes can be made.
        </div>

        <div className="mt-8">
          <Stepper steps={STEPS} current={step} done={done} />
        </div>

        <div className="mt-10">
          {step === 0 && <StepCompanyInformation />}
          {step === 1 && <StepProductService />}
          {step === 2 && <StepTeamFounders />}
          {step === 3 && <StepFinancialInvestors />}
          {step === 4 && <StepAchievements />}
          {step === 5 && <StepReviewSubmit />}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            ← Back
          </Button>
          {!isLast && (
            <Button variant="primary" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
              Next →
            </Button>
          )}
        </div>
      </Card>
    </UserShell>
  );
}
