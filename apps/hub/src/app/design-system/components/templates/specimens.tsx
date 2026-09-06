"use client";

import * as React from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  Icon,
  OverviewScreen,
  RecordScreen,
  ScreenBody,
  Select,
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
