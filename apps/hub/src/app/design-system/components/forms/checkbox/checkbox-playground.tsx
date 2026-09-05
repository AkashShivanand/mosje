"use client";
import * as React from "react";
import { Checkbox, CheckboxGroup, Icon, Input } from "@mosje/design-system";

const panel: React.CSSProperties = {
  padding: "var(--sa-padding-32)",
  background: "var(--sa-bg-neutral-subtler)",
  borderRadius: "var(--sa-shape-8)",
  display: "grid",
  gap: "var(--sa-stack-32)",
  maxWidth: 640,
  margin: "0 auto",
};
const stack: React.CSSProperties = { display: "grid", gap: "var(--sa-stack-12)" };
const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--sa-type-label-3-size)",
  lineHeight: "var(--sa-type-label-3-lh)",
  letterSpacing: "var(--sa-type-label-tracking)",
  textTransform: "uppercase",
  color: "var(--sa-text-neutral-subtle)",
};

/** Every state the control can be in, running — never a screenshot. */
export function CheckboxPlayground(): React.JSX.Element {
  const [agreed, setAgreed] = React.useState(false);
  const [claims, setClaims] = React.useState<string[]>(["hostel"]);
  const [docs, setDocs] = React.useState<string[]>([]);
  const [report, setReport] = React.useState<string[]>(["napddr"]);

  return (
    <div style={panel}>
      <div style={stack}>
        <p style={eyebrow}>Sizes — the box is 16 · 20 · 24; the hit area is 24 · 44 · 48</p>
        <Checkbox size="sm" defaultChecked label="Small" />
        <Checkbox size="md" defaultChecked label="Medium (default)" />
        <Checkbox size="lg" defaultChecked label="Large" />
      </div>

      <div style={stack}>
        <p style={eyebrow}>States</p>
        <Checkbox
          label="I have read the scheme guidelines"
          description="The guidelines open in a new tab and take about ten minutes to read."
          checked={agreed}
          onCheckedChange={setAgreed}
          error={agreed ? undefined : "Confirm you have read the guidelines to continue"}
        />
        <Checkbox label="Aadhaar is seeded to the bank account" required />
        <Checkbox label="Verified by the district officer" readOnly defaultChecked />
        <Checkbox label="Verified by the district officer" disabled />
        <Checkbox label="Send updates by SMS" labelPlacement="start" defaultChecked />
        <Checkbox indeterminate label="Some districts selected" />
      </div>

      <div style={stack}>
        <p style={eyebrow}>Card variant</p>
        <Checkbox
          variant="card"
          icon={<Icon name="apartment" />}
          label="Hostel Accommodation"
          description="Babu Jagjivan Ram Chhatrawas Yojana. Apply through the institution, not directly."
          defaultChecked
        />
        <Checkbox
          variant="card"
          icon={<Icon name="school" />}
          label="Post-Matric Scholarship"
          description="Class XI upwards, including degree and professional courses."
        />
      </div>

      <div style={stack}>
        <p style={eyebrow}>Card variant, detailed — the scheme tile, several at once</p>
        <CheckboxGroup
          legend="Schemes Covered by the Report"
          name="report"
          variant="card"
          cardLayout="detailed"
          value={report}
          onChange={setReport}
          options={[
            {
              value: "napddr",
              label: "NAPDDR - National Action Plan for Drug Demand Reduction",
              description: "Prevention, treatment, rehabilitation, social-reintegration and aftercare for persons affected by substance abuse across vulnerable districts.",
              meta: "Target: Persons affected by substance abuse",
              icon: <Icon name="workspace_premium" size={40} />,
            },
            {
              value: "avyay",
              label: "AVYAY - Atal Vayo Abhyuday Yojana",
              description: "An umbrella scheme covering Integrated Programme for Senior Citizens (IPSrC), maintenance of Old Age Homes / Continuous Care Homes, Rashtriya Vayoshri Yojana, and Silver Economy support.",
              meta: "Target: Senior citizens",
              icon: <Icon name="workspace_premium" size={40} />,
            },
          ]}
        />
      </div>

      <div style={stack}>
        <p style={eyebrow}>Group with select all</p>
        <CheckboxGroup
          legend="Assistance Applied For"
          name="claims"
          selectAll="Select all schemes"
          hint="Select every scheme the applicant is claiming under."
          value={claims}
          onChange={setClaims}
          options={[
            { value: "hostel", label: "Hostel Accommodation" },
            { value: "scholarship", label: "Post-Matric Scholarship" },
            { value: "device", label: "Assistive Device" },
            { value: "skill", label: "Skill Development Training", disabled: true },
          ]}
        />
      </div>

      <div style={stack}>
        <p style={eyebrow}>Group with an exclusive option</p>
        <CheckboxGroup
          legend="Documents Enclosed"
          name="documents"
          required
          value={docs}
          onChange={setDocs}
          error={docs.length ? undefined : "Select the documents enclosed, or None of These"}
          options={[
            { value: "caste", label: "Caste certificate" },
            { value: "income", label: "Income certificate" },
            { value: "aadhaar", label: "Aadhaar card" },
            { value: "none", label: "None of these", exclusive: true },
          ]}
        />
      </div>

      <div style={stack}>
        <p style={eyebrow}>Arrangements the master grid does not show</p>
        <Checkbox size="sm" label="Include archived records" description="Records closed before April 2024." />
        <Checkbox label="I agree to the conditions of the scheme" invalid />
        <Checkbox label="Row 14 selected" hideLabel />
        <CheckboxGroup
          legend="Days Available"
          name="days"
          orientation="horizontal"
          options={[
            { value: "mon", label: "Monday" },
            { value: "tue", label: "Tuesday" },
            { value: "wed", label: "Wednesday" },
            { value: "thu", label: "Thursday" },
          ]}
        />
        <CheckboxGroup
          legend="Assistance Applied For"
          name="locked"
          disabled
          defaultValue={["hostel"]}
          hint="Locked after submission."
          options={[
            { value: "hostel", label: "Hostel Accommodation" },
            { value: "scholarship", label: "Post-Matric Scholarship" },
            { value: "device", label: "Assistive Device" },
          ]}
        />
        <CheckboxGroup
          legend="Other Support Received"
          name="support"
          defaultValue={["state"]}
          options={[
            { value: "central", label: "Central scheme" },
            {
              value: "state",
              label: "State scheme",
              reveal: <Input aria-label="Name of the state scheme" placeholder="As printed on the sanction letter" />,
            },
            { value: "ngo", label: "NGO support" },
            { value: "none", label: "None", exclusive: true },
          ]}
        />
      </div>
    </div>
  );
}
