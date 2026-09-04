import Link from "next/link";
import { UserShell } from "@/components/scw/user-shell";
import { Button, Card } from "@/components/scw/ui";
import { Checkbox } from "@mosje/design-system";

const ESSENTIAL_CRITERIA = [
  "Being incorporated or registered in India for less than ten years from its date of incorporation.",
  "Annual turnover not exceeding Rs 25 crores in any of the preceding financial years.",
  "Incorporated as a Company (Private / Public).",
  "It is not formed by splitting up or reconstructing a business already in existence.",
];

export default function SageRegistrationLandingPage() {
  return (
    <UserShell>
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-ink">SAGE Initiative</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          The Seniorcare Ageing Growth Engine (SAGE) identifies, evaluates, and supports
          innovative products and services for senior citizens.
        </p>

        {/* Eligibility Criteria nested card */}
        <div className="mt-6 rounded-2xl border border-line p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">Eligibility Criteria</h2>

          <div className="mt-5">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-hint">
              Category Requirement (Must meet either A or B)
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              a) Innovative ideas awarded in National level innovation challenges such as Smart
              India Hackathons (of M/o Education) or such other innovative drives – proposing to
              set up companies&apos; products and services aimed at the welfare of the elderly in
              India.
            </p>

            <div className="my-4 flex justify-center">
              <span className="inline-flex items-center rounded-full bg-navy px-4 py-1.5 text-xs font-bold text-white">
                OR
              </span>
            </div>

            <p className="text-sm leading-relaxed text-ink-muted">
              b) Start-ups already functioning in the elderly segment in India proposing to expand
              operations. All the startups fulfilling the startup norms as per guidelines by the
              Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of
              Commerce, Govt. of India are eligible for applying.
            </p>
          </div>

          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-hint">
              Essential Criteria (Both A &amp; B must meet all)
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
              {ESSENTIAL_CRITERIA.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <Checkbox
          className="mt-6"
          name="eligibility"
          required
          label="I confirm that my organization meets the SAGE eligibility criteria mentioned above."
        />

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Link href="/portals/scw/sage-registration/form">
            <Button variant="primary">Save and Continue</Button>
          </Link>
        </div>
      </Card>
    </UserShell>
  );
}
