"use client";

import * as React from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CatalogueScreen,
  ChecklistScreen,
  ChooserScreen,
  ConfirmationScreen,
  DecisionScreen,
  DescriptionList,
  FormField,
  FormScreen,
  FormSection,
  GalleryScreen,
  Icon,
  InboxScreen,
  Input,
  OverviewScreen,
  RecordScreen,
  ReportScreen,
  ReviewScreen,
  ScreenBody,
  SearchScreen,
  Select,
  SettingsScreen,
  StatusScreen,
  Textarea,
  WizardScreen,
  WorklistScreen,
  type ScreenStatus,
  type WorklistColumn,
} from "@mosje/design-system";

/**
 * The specimens every screen-template page renders.
 *
 * One demo register, shared, because five pages showing five different sets of
 * make-believe applications teaches a reader that the data is arbitrary. It is
 * the same five records throughout, drawn from the E-Anudaan handoff's own
 * dashboard.
 */
interface Application extends Record<string, unknown> {
  id: string;
  project: string;
  requested: string;
  status: string;
  updated: string;
}

const APPLICATIONS: Application[] = [
  { id: "DL/2016/0104728", project: "Hostel — North West Delhi", requested: "₹45.20 Lakh", status: "In Review", updated: "14 Aug 2026" },
  { id: "DL/2016/0104728/01", project: "IPSrC Senior Citizen Home — Krishna", requested: "₹1.24 Cr", status: "In Review", updated: "12 Aug 2026" },
  { id: "DL/2016/0104728/02", project: "SHRESHTA Class 9 School Support", requested: "₹12.50 Lakh", status: "Sanctioned", updated: "10 Aug 2026" },
];

const TONE: Record<string, "info" | "success" | "warning"> = {
  "In Review": "info",
  Sanctioned: "success",
  "Needs Action": "warning",
};

const COLUMNS: WorklistColumn<Application>[] = [
  { key: "project", header: "Project Details", priority: 1 },
  { key: "id", header: "LSGY ID", priority: 3 },
  {
    key: "status",
    header: "Status",
    priority: 2,
    render: (row) => <Badge status={TONE[row.status] ?? "info"}>{row.status}</Badge>,
  },
  { key: "requested", header: "Requested", priority: 2 },
  { key: "updated", header: "Last Updated", priority: 3 },
];

export function WorklistSpecimen(): React.JSX.Element {
  return (
    <WorklistScreen
      /* 2, not 1: the documentation page already owns the page's h1. */
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="My Applications"
      meta="Grant-in-aid applications submitted by Harijan Sevak Sangh."
      columns={COLUMNS}
      rows={APPLICATIONS}
      getRowId={(row) => row.id}
      noun="application"
      actions={<Button iconLeft={<Icon name="add" size={20} />}>New Application</Button>}
      filters={
        <>
          <Select aria-label="Filter by scheme" defaultValue="">
            <option value="">All schemes</option>
            <option value="avyay">AVYAY</option>
          </Select>
          <Select aria-label="Filter by status" defaultValue="">
            <option value="">All statuses</option>
            <option value="review">In Review</option>
          </Select>
        </>
      }
    />
  );
}

/** The six states, side by side. This is the specimen that matters most. */
export function StatesSpecimen(): React.JSX.Element {
  const states: { status: ScreenStatus; label: string }[] = [
    { status: "idle", label: "Idle — nothing asked yet" },
    { status: "loading", label: "Loading — in the shape of the result" },
    { status: "empty", label: "Empty — the register holds nothing" },
    { status: "filtered", label: "Filtered — the reader excluded everything" },
    { status: "error", label: "Error — one sentence, and the retry" },
  ];
  return (
    <div style={{ display: "grid", gap: "var(--sa-padding-24)" }}>
      {states.map((s) => (
        <div key={s.status}>
          <p
            style={{
              fontSize: "var(--sa-type-label-2-size)",
              color: "var(--sa-text-neutral-subtle)",
              marginBottom: "var(--sa-padding-8)",
            }}
          >
            {s.label}
          </p>
          <ScreenBody
            status={s.status}
            skeleton="table"
            onRetry={() => undefined}
            onClearFilters={() => undefined}
          >
            <div />
          </ScreenBody>
        </div>
      ))}
    </div>
  );
}

export function RecordSpecimen(): React.JSX.Element {
  return (
    <RecordScreen
      /* 2, not 1: the documentation page already owns the page's h1. */
      headingLevel={2}
      breadcrumb={[{ label: "My Applications", href: "#" }, { label: "DL/2016/0104728" }]}
      eyebrow="SHRESHTA MODE 2"
      title="Hostel — North West Delhi"
      meta="Application DL/2016/0104728 · submitted 14 August 2026"
      status={<Badge status="info">In Review</Badge>}
      facts={[
        { label: "Grant Requested", value: "₹45.20 Lakh" },
        { label: "Financial Year", value: "2026–27" },
        { label: "Beneficiaries", value: "50" },
        { label: "State", value: "Delhi" },
      ]}
      tabs={[
        {
          id: "details",
          label: "Details",
          render: () => (
            <Card>
              <CardBody>
                <DescriptionList
                  columns={2}
                  items={[
                    { term: "Organisation", value: "Harijan Sevak Sangh" },
                    { term: "NGO-Darpan ID", value: "LGN/2016/0104728" },
                  ]}
                />
              </CardBody>
            </Card>
          ),
        },
        { id: "documents", label: "Documents", render: () => <Card><CardBody>17 documents on file.</CardBody></Card> },
        { id: "history", label: "History", render: () => <Card><CardBody>Submitted 14 August 2026.</CardBody></Card> },
      ]}
    />
  );
}

export function WizardSpecimen(): React.JSX.Element {
  const [step, setStep] = React.useState(1);
  const steps = [
    { label: "Application Type" },
    { label: "Organisation Details" },
    { label: "Project Details" },
    { label: "Grant Sought & Declaration" },
    { label: "Upload Documents" },
    { label: "Review & Submit" },
  ];
  return (
    <WizardScreen
      /* 2, not 1: the documentation page already owns the page's h1. */
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="AVYAY — Atal Vayo Abhyuday Yojana"
      description="Provide all necessary information below and complete each section to register for AVYAY."
      steps={steps}
      current={step}
      draft={{ savedAt: "18 Aug 2026", onResume: () => undefined, onStartFresh: () => undefined }}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
      onSubmit={() => undefined}
    >
      <Card>
        <CardBody>The current step&rsquo;s fields go here, as FormSections.</CardBody>
      </Card>
    </WizardScreen>
  );
}

export function OverviewSpecimen(): React.JSX.Element {
  return (
    <OverviewScreen
      /* 2, not 1: the documentation page already owns the page's h1. */
      headingLevel={2}
      title="Good afternoon, Harijan"
      meta="Last updated 14 August 2026 at 1:34 pm"
      actions={<Button iconLeft={<Icon name="add" size={20} />}>New Application</Button>}
      kpis={[
        { label: "Total Applications", value: "68" },
        { label: "In Review", value: "31" },
        { label: "Needs Action", value: "0" },
        { label: "Sanctioned", value: "36" },
      ]}
      panels={[
        <Card key="a"><CardBody>Application Status — donut with counts.</CardBody></Card>,
        <Card key="b"><CardBody>Financial Summary — ₹24.37 Cr requested, ₹13.70 Cr sanctioned.</CardBody></Card>,
      ]}
      recent={<Card><CardBody>Recent Applications — table with a View All.</CardBody></Card>}
    />
  );
}

/* ---------------------------------------------------------------------------
   The remaining fourteen.

   Same register throughout — Harijan Sevak Sangh's grant-in-aid applications,
   taken from the E-Anudaan handoff's own dashboard — because fourteen pages
   showing fourteen different sets of make-believe data teaches a reader that
   the data is arbitrary and the templates are interchangeable. They are not.
   ------------------------------------------------------------------------- */

export function ChooserSpecimen(): React.JSX.Element {
  const [scheme, setScheme] = React.useState<string | undefined>();
  return (
    <ChooserScreen
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="Select a Scheme"
      meta="Applications for 2026–27 close on 31 March 2027."
      legend="Which scheme are you applying under?"
      options={[
        {
          id: "avyay",
          label: "AVYAY — Atal Vayo Abhyuday Yojana",
          description: "Grant-in-aid for senior citizens' homes, day-care centres and mobile medicare units.",
          meta: "7 steps",
        },
        {
          id: "napddr",
          label: "NAPDDR — National Action Plan for Drug Demand Reduction",
          description: "Support for de-addiction centres, community peer-led interventions and outreach.",
          meta: "3 steps",
        },
        {
          id: "shreshta",
          label: "SHRESHTA Mode 2 — Residential Education Support",
          description: "Assistance to voluntary organisations running residential schools and hostels.",
          meta: "6 steps",
        },
        {
          id: "pmajay",
          label: "PM-AJAY — Adarsh Gram Component",
          description: "Village development grants under the Adarsh Gram component.",
          unavailableReason: "Applications for 2026–27 have closed.",
        },
      ]}
      value={scheme}
      onChange={setScheme}
      onContinue={() => undefined}
      onBack={() => undefined}
    />
  );
}

export function FormSpecimen(): React.JSX.Element {
  return (
    <FormScreen
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="Organisation Contact Details"
      meta="These details are used for all correspondence about your applications."
      onSubmit={() => undefined}
      onCancel={() => undefined}
      submitLabel="Save Changes"
      dirty
    >
      <FormSection title="Correspondence Address" columns={2}>
        <FormField label="Address Line 1" required>
          {(p) => <Input {...p} defaultValue="Kingsway Camp" />}
        </FormField>
        <FormField label="District" required>
          {(p) => <Input {...p} defaultValue="North West Delhi" />}
        </FormField>
        <FormField label="PIN Code" required>
          {(p) => <Input {...p} defaultValue="110009" inputMode="numeric" />}
        </FormField>
        <FormField label="Telephone">
          {(p) => <Input {...p} defaultValue="011 2766 1234" />}
        </FormField>
      </FormSection>
    </FormScreen>
  );
}

export function ChecklistSpecimen(): React.JSX.Element {
  return (
    <ChecklistScreen
      headingLevel={2}
      eyebrow="AVYAY · STEP 5 OF 7"
      title="Upload Documents"
      meta="Each document must be a PDF under 5 MB."
      groups={[
        {
          id: "org",
          title: "Organisation Documents",
          items: [
            {
              id: "reg",
              label: "Registration certificate",
              description: "Issued by the Registrar of Societies.",
              state: "attached",
              fileName: "HSS-registration-1932.pdf",
              actions: <Button appearance="text" size="sm">Replace</Button>,
            },
            {
              id: "darpan",
              label: "NGO-Darpan acknowledgement",
              state: "review",
              fileName: "darpan-LGN-2016-0104728.pdf",
              findings: ["Being checked against the NGO-Darpan register."],
            },
            {
              id: "pan",
              label: "PAN card of the organisation",
              state: "rejected",
              fileName: "pan-scan.pdf",
              findings: [
                "The scan is not readable at the PAN number.",
                "Upload a colour scan at 300 dpi or higher.",
              ],
              actions: <Button appearance="outlined" size="sm">Upload again</Button>,
            },
          ],
        },
        {
          id: "fin",
          title: "Financial Records",
          description: "For the last three completed financial years.",
          items: [
            { id: "audit", label: "Audited accounts 2025–26", state: "missing", actions: <Button size="sm">Upload</Button> },
            { id: "fcra", label: "FCRA certificate", required: false, state: "missing" },
          ],
        },
      ]}
    />
  );
}

export function ReviewSpecimen(): React.JSX.Element {
  const [agreed, setAgreed] = React.useState(false);
  return (
    <ReviewScreen
      headingLevel={2}
      eyebrow="AVYAY · STEP 7 OF 7"
      title="Review & Submit"
      intro="Check every answer before submitting. Once submitted, an application can only be changed if the department returns it for correction."
      sections={[
        {
          id: "org",
          title: "Organisation Details",
          editHref: "#",
          pairs: [
            { label: "Organisation", value: "Harijan Sevak Sangh" },
            { label: "NGO-Darpan ID", value: "LGN/2016/0104728" },
            { label: "Registration", value: "S/1932/DL" },
            { label: "Address", value: "Kingsway Camp, North West Delhi 110009", wide: true },
          ],
        },
        {
          id: "project",
          title: "Project Details",
          editHref: "#",
          pairs: [
            { label: "Project", value: "Senior Citizens' Home — Krishna Nagar" },
            { label: "Beneficiaries", value: "50" },
            { label: "Financial Year", value: "2026–27" },
          ],
        },
        {
          id: "grant",
          title: "Grant Sought",
          editHref: "#",
          pairs: [
            { label: "Amount Requested", value: "₹45.20 Lakh" },
            { label: "Own Contribution", value: "₹5.02 Lakh" },
          ],
        },
      ]}
      declaration={
        <ul>
          <li>The information given above is true to the best of my knowledge.</li>
          <li>The organisation has not been blacklisted by any Ministry or Department.</li>
        </ul>
      }
      declarationChecked={agreed}
      onDeclarationChange={setAgreed}
      onSubmit={() => undefined}
      onBack={() => undefined}
    />
  );
}

export function ConfirmationSpecimen(): React.JSX.Element {
  return (
    <ConfirmationScreen
      headingLevel={2}
      eyebrow="AVYAY"
      reference="DL/2026/AVY/0104728"
      submittedAt="6 September 2026 at 3:14 pm"
      intro="Your application has been received. Keep this reference number — you will need it for any correspondence about this application."
      facts={[
        { label: "Scheme", value: "AVYAY — Atal Vayo Abhyuday Yojana" },
        { label: "Financial Year", value: "2026–27" },
        { label: "Amount Requested", value: "₹45.20 Lakh" },
        { label: "Documents Attached", value: "9" },
      ]}
      nextSteps={[
        {
          title: "District Verification",
          description: "The District Social Welfare Officer verifies the organisation's records and the project site.",
          when: "Within 30 working days",
        },
        {
          title: "State Recommendation",
          description: "The State Government forwards its recommendation to the Ministry.",
        },
        {
          title: "Sanction",
          description: "The Ministry communicates the decision and, where sanctioned, the released amount.",
        },
      ]}
      actions={
        <>
          <Button iconLeft={<Icon name="download" size={20} />}>Download Receipt</Button>
          <Button appearance="outlined">Track This Application</Button>
        </>
      }
      support="For help, contact the E-Anudaan helpdesk on 1800 11 0001, Monday to Friday, 9.30 am to 6 pm."
    />
  );
}

export function DecisionSpecimen(): React.JSX.Element {
  /* Pre-selected on the irreversible verdict, because the warning it raises is
     the whole point of this template and a specimen that starts unselected
     demonstrates everything except that. */
  const [verdict, setVerdict] = React.useState<string | undefined>("reject");
  return (
    <DecisionScreen
      headingLevel={2}
      eyebrow="PROGRAMME DIVISION"
      title="Hostel — North West Delhi"
      meta="Application DL/2016/0104728 · Harijan Sevak Sangh"
      status={<Badge status="info">Awaiting Decision</Badge>}
      legend="What is your decision on this application?"
      options={[
        { id: "approve", label: "Recommend for sanction", description: "Forwards the application to the Finance Division." },
        { id: "return", label: "Return for correction", description: "The applicant may correct and resubmit within 15 days." },
        {
          id: "reject",
          label: "Reject",
          description: "Closes the application.",
          irreversibleNote:
            "A rejected application cannot be reopened. The organisation must apply again in the next cycle.",
        },
      ]}
      value={verdict}
      onChange={setVerdict}
      record={
        <Card>
          <CardBody>
            <DescriptionList
              columns={2}
              items={[
                { term: "Organisation", value: "Harijan Sevak Sangh" },
                { term: "NGO-Darpan ID", value: "LGN/2016/0104728" },
                { term: "Amount Requested", value: "₹45.20 Lakh" },
                { term: "Beneficiaries", value: "50" },
                { term: "District Verification", value: "Completed 28 August 2026" },
                { term: "Documents", value: "9 of 9 accepted" },
              ]}
            />
          </CardBody>
        </Card>
      }
      remarks={
        <FormField label="Remarks" hint="Recorded on the application and visible to the applicant.">
          {(p) => <Textarea {...p} rows={3} />}
        </FormField>
      }
      onSubmit={() => undefined}
      onCancel={() => undefined}
    />
  );
}

export function CatalogueSpecimen(): React.JSX.Element {
  return (
    <CatalogueScreen
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="Scheme Guidelines & Circulars"
      meta="Published by the Department of Social Justice & Empowerment."
      noun="document"
      registerTotal={212}
      page={1}
      totalPages={22}
      onPageChange={() => undefined}
      items={[
        {
          id: "1",
          title: "AVYAY Scheme Guidelines, revised 2026",
          meta: "No. 20-11/2026-SD · 14 August 2026",
          kind: "PDF · 2.4 MB",
          href: "#",
          download: true,
          badge: "Revised",
        },
        {
          id: "2",
          title: "NAPDDR Grant-in-Aid Application Format",
          meta: "No. 18-4/2026-DDR · 2 August 2026",
          kind: "PDF · 640 KB",
          href: "#",
          download: true,
        },
        {
          id: "3",
          title: "SHRESHTA Mode 2 — List of Sanctioned Institutions",
          meta: "No. 11-9/2026-SCD · 21 July 2026",
          kind: "Excel · 812 KB",
          href: "#",
          download: true,
        },
        {
          id: "4",
          title: "Utilisation Certificate Format (GFR 12-A)",
          meta: "Ministry of Finance",
          kind: "PDF · 210 KB",
          href: "#",
          external: true,
        },
      ]}
    />
  );
}

export function SearchSpecimen(): React.JSX.Element {
  const [query, setQuery] = React.useState("");
  const matches = APPLICATIONS.filter(
    (a) => query.trim().length > 0 && a.project.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <SearchScreen
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="Search Applications"
      query={query}
      onQueryChange={setQuery}
      searchLabel="Search applications by project, reference number or organisation"
      placeholder="Try “hostel”"
      shownCount={matches.length}
      resultCount={matches.length}
      facets={
        <Select aria-label="Filter by financial year" defaultValue="">
          <option value="">All financial years</option>
          <option value="2026">2026–27</option>
        </Select>
      }
    >
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--sa-padding-12)" }}>
        {matches.map((a) => (
          <li key={a.id}>
            <Card>
              <CardBody>
                <strong>{a.project}</strong>
                <div style={{ color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)" }}>
                  {a.id} · {a.requested} · {a.status}
                </div>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </SearchScreen>
  );
}

export function InboxSpecimen(): React.JSX.Element {
  return (
    <InboxScreen
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="Notifications"
      label="Notifications"
      onMarkAllRead={() => undefined}
      events={[
        {
          id: "1",
          at: "2026-09-06T09:14:00+05:30",
          actor: "District Social Welfare Officer",
          actorRole: "North West Delhi",
          action: "Returned for correction",
          subject: "Application DL/2016/0104728",
          note: "The PAN scan is not readable at the PAN number.",
          tone: "warning",
          unread: true,
        },
        {
          id: "2",
          at: "2026-09-05T16:40:00+05:30",
          action: "Documents verified",
          subject: "Application DL/2016/0104728/02",
          tone: "success",
          unread: true,
        },
        {
          id: "3",
          at: "2026-09-04T11:02:00+05:30",
          actor: "Programme Division",
          action: "Recommended for sanction",
          subject: "Application DL/2016/0104728/01",
          tone: "success",
        },
      ]}
    />
  );
}

export function SettingsSpecimen(): React.JSX.Element {
  return (
    <SettingsScreen
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="Organisation Settings"
      sections={[
        {
          id: "identity",
          title: "Organisation Identity",
          description: "Drawn from NGO-Darpan when the account was created.",
          rows: [
            {
              id: "name",
              label: "Registered name",
              value: "Harijan Sevak Sangh",
              readOnlyReason: "Set from NGO-Darpan. Correct it there and it will update here.",
              onSave: () => undefined,
            },
            { id: "contact", label: "Contact person", value: "Ram Prakash", onSave: () => undefined },
            { id: "phone", label: "Telephone", value: "011 2766 1234", onSave: () => undefined },
          ],
        },
        {
          id: "bank",
          title: "Bank Details",
          description: "Used for the release of sanctioned grants.",
          rows: [
            { id: "acct", label: "Account number", value: "0110 1234 5678", onSave: () => undefined },
            { id: "ifsc", label: "IFSC", value: "SBIN0000691", onSave: () => undefined },
          ],
        },
      ]}
    />
  );
}

export function ReportSpecimen(): React.JSX.Element {
  return (
    <ReportScreen
      headingLevel={2}
      eyebrow="E-ANUDAAN"
      title="Grant Utilisation Statement"
      issuer="Department of Social Justice & Empowerment"
      generatedAt="6 September 2026"
      criteria={[
        { label: "Financial Year", value: "2026–27" },
        { label: "Scheme", value: "AVYAY" },
        { label: "State", value: "Delhi" },
      ]}
      exportActions={
        <>
          <Button appearance="outlined" size="sm" iconLeft={<Icon name="download" size={20} />}>
            Export CSV
          </Button>
          <Button appearance="outlined" size="sm" iconLeft={<Icon name="print" size={20} />}>
            Print
          </Button>
        </>
      }
      columns={[
        { key: "id", header: "Reference" },
        { key: "project", header: "Project" },
        { key: "requested", header: "Requested", numeric: true },
        { key: "status", header: "Status" },
      ]}
      rows={APPLICATIONS}
      getRowId={(row) => row.id}
      totals={(key) =>
        key === "id" ? "Total" : key === "requested" ? "₹1.82 Cr" : null
      }
      footnotes="Figures are as recorded in the E-Anudaan Management Information System on the date of generation."
    />
  );
}

export function GallerySpecimen(): React.JSX.Element {
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  /* A 1x1 transparent GIF. The specimen is about the LAYOUT — tile, caption,
     action set, the toggle — and a page of departmental photographs would make
     it about the photographs. */
  const px =
    "data:image/gif;base64,R0lGODlhAQABAIAAAMLDxwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
  return (
    <GalleryScreen
      headingLevel={2}
      eyebrow="AVYAY"
      title="Site Photographs"
      label="Photographs from the Krishna Nagar site inspection"
      layout={layout}
      onLayoutChange={setLayout}
      items={[
        { id: "1", type: "image", src: px, alt: "Dormitory block, east elevation", caption: "Dormitory block, east elevation", meta: "28 August 2026" },
        { id: "2", type: "image", src: px, alt: "Kitchen and dining hall", caption: "Kitchen and dining hall", meta: "28 August 2026" },
        { id: "3", type: "image", src: px, alt: "Medical room", caption: "Medical room", meta: "28 August 2026" },
        { id: "4", type: "image", src: px, alt: "Approach road", caption: "Approach road", meta: "28 August 2026" },
      ]}
    />
  );
}

export function StatusSpecimen(): React.JSX.Element {
  return (
    <StatusScreen
      kind="403"
      primaryAction={{ label: "Return to Dashboard", href: "#", icon: "dashboard" }}
      searchUrl={null}
    />
  );
}
