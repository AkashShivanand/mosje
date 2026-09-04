import * as React from "react";
import type { Metadata } from "next";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  Badge,
  Alert,
  Loader,
  EmptyState,
  Stepper,
  MetricCard,
  Avatar,
  Icon,
} from "@mosje/design-system";
import { Callout, DoDont, StatusBadge } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Page Patterns",
  description:
    "Approved page-level scaffolds for MoSJE portals and websites — Dashboard, Portal Login, Form Wizard, Data Tables, and Empty States.",
};

/* ── Shared layout helpers ── */
const sectionStyle: React.CSSProperties = {
  marginTop: "var(--sa-section-48)",
  scrollMarginTop: "var(--sa-section-48)",
};
const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 700,
  color: "var(--sa-text-neutral-base)",
  marginBottom: "var(--sa-stack-16)",
  paddingBottom: "var(--sa-padding-8)",
  borderBottom: "1px solid var(--sa-border-neutral-subtle)",
};
const h3Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
  fontWeight: 600,
  color: "var(--sa-text-neutral-base)",
  marginTop: "var(--sa-stack-24)",
  marginBottom: "var(--sa-stack-8)",
};
const proseStyle: React.CSSProperties = {
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "var(--sa-container-measure)",
};
const preStyle: React.CSSProperties = {
  background: "var(--sa-bg-neutral-subtler)",
  border: "1px solid var(--sa-border-neutral-subtle)",
  borderRadius: "var(--sa-shape-8)",
  padding: "var(--sa-padding-20)",
  fontSize: "var(--sa-type-body-3-size)",
  fontFamily: "var(--sa-font-mono)",
  overflowX: "auto",
  lineHeight: "var(--sa-type-body-3-lh)",
  color: "var(--sa-text-neutral-base)",
};

export default function PatternsPage(): React.JSX.Element {
  return (
    <>
      {/* ── Page header ── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Page Patterns</h1>
          <p className="docs-page-header__desc">
            Approved page-level scaffolds for MoSJE portals and websites. These
            patterns encode the decisions that every team would otherwise have to
            re-make — grid layout, component order, responsive behaviour, and
            accessibility landmarks. Use them without deviation unless a specific
            documented exception applies.
          </p>
        </div>
      </header>

      <Callout type="info" title="The golden rule">
        These patterns are constraints, not suggestions. Consistent scaffolds
        across 20+ portals mean that any citizen navigating from PM-AJAY to SMILE
        encounters the same mental model and can orient instantly.
      </Callout>

      {/* ═══════════════════════════════════════════════
          § 1 — Dashboard Scaffold
      ═══════════════════════════════════════════════ */}
      <section style={sectionStyle} id="dashboard">
        <h2 style={h2Style}>Dashboard Scaffold</h2>
        <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-16)", flexWrap: "wrap" }}>
          <StatusBadge status="Stable" />
          <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)", alignSelf: "center" }}>
            Portal variant · Authenticated
          </span>
        </div>
        <p style={proseStyle}>
          The canonical layout for every MoSJE portal dashboard. Three rows —
          KPI metrics, charts, data table — with a sticky{" "}
          <code>SiteHeader</code>, collapsible <code>SidebarNav</code>, and a
          slim <code>Footer</code>.
        </p>

        {/* Live preview */}
        <div
          style={{
            marginTop: "var(--sa-padding-20)",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-8)",
            overflow: "hidden",
            background: "var(--sa-bg-neutral-subtler)",
          }}
        >
          {/* Mock chrome */}
          <div
            style={{
              background: "var(--sa-bg-brand-primary-bolder)",
              padding: "var(--sa-padding-12) var(--sa-padding-20)",
              display: "flex",
              alignItems: "center",
              gap: "var(--sa-stack-12)",
            }}
          >
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "color-mix(in oklab, var(--sa-on-bg-brand-primary-bolder) 30%, transparent)" }} />
            <span style={{ color: "var(--sa-on-bg-brand-primary-bolder)", fontWeight: 700, fontSize: "var(--sa-type-body-1-size)" }}>
              PM-AJAY — Dashboard
            </span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "var(--sa-inline-8)" }}>
              <Avatar initials="AK" size={32} />
            </div>
          </div>
          {/* Mock body */}
          <div style={{ display: "flex" }}>
            {/* Sidebar stub */}
            <div
              style={{
                width: 200,
                minHeight: 320,
                background: "var(--sa-bg-neutral-base)",
                borderRight: "1px solid var(--sa-border-neutral-subtle)",
                padding: "var(--sa-padding-16)",
                flexShrink: 0,
              }}
            >
              {["Dashboard", "Applications", "Reports", "Settings"].map((item, i) => (
                <div
                  key={item}
                  style={{
                    padding: "var(--sa-padding-8) var(--sa-padding-12)",
                    borderRadius: "var(--sa-shape-6)",
                    background: i === 0 ? "var(--sa-bg-brand-primary-subtler)" : "transparent",
                    color: i === 0 ? "var(--sa-text-brand-primary-base)" : "var(--sa-text-neutral-subtle)",
                    fontSize: "var(--sa-type-body-2-size)",
                    fontWeight: i === 0 ? 600 : 400,
                    marginBottom: "var(--sa-stack-4)",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            {/* Main content */}
            <div style={{ flex: 1, padding: "var(--sa-padding-20)" }}>
              {/* Row 1: MetricCards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "var(--sa-stack-16)",
                  marginBottom: "var(--sa-padding-20)",
                }}
              >
                {[
                  { label: "Applications", value: "12,438", change: { direction: "up" as const, percent: 14 } },
                  { label: "Approved", value: "9,821", change: { direction: "up" as const, percent: 8 } },
                  { label: "Pending Review", value: "2,104", change: { direction: "down" as const, percent: 3 } },
                  { label: "Disbursed (₹ Cr)", value: "487", change: { direction: "up" as const, percent: 22 } },
                ].map((m) => (
                  <MetricCard
                    key={m.label}
                    label={m.label}
                    value={m.value}
                    changeLabel={`${m.change.direction === "up" ? "+" : "-"}${m.change.percent}%`}
                    changeDirection={m.change.direction}
                  />
                ))}
              </div>
              {/* Row 2: Chart stubs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "var(--sa-stack-16)",
                  marginBottom: "var(--sa-padding-20)",
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Applications</CardTitle>
                    <CardSubtitle>Jan – Jun 2026</CardSubtitle>
                  </CardHeader>
                  <CardBody>
                    <div
                      style={{
                        height: 80,
                        background: "var(--sa-bg-neutral-subtler)",
                        borderRadius: "var(--sa-shape-6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--sa-text-neutral-subtle)",
                        fontSize: "var(--sa-type-body-2-size)",
                      }}
                    >
                      BarChart
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>By Category</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div
                      style={{
                        height: 80,
                        background: "var(--sa-bg-neutral-subtler)",
                        borderRadius: "var(--sa-shape-6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--sa-text-neutral-subtle)",
                        fontSize: "var(--sa-type-body-2-size)",
                      }}
                    >
                      PieChart
                    </div>
                  </CardBody>
                </Card>
              </div>
              {/* Row 3: Table stub */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="primary" appearance="outlined" size="sm">Export CSV</Button>
                </CardHeader>
                <CardBody>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--sa-type-body-2-size)" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid var(--sa-border-neutral-base)" }}>
                          {["Applicant", "Scheme", "District", "Status", "Date"].map((col) => (
                            <th
                              key={col}
                              style={{
                                textAlign: "left",
                                padding: "var(--sa-padding-8) var(--sa-padding-12)",
                                color: "var(--sa-text-neutral-subtle)",
                                fontWeight: 700,
                                fontSize: "var(--sa-type-label-3-size)",
                                lineHeight: "var(--sa-type-label-3-lh)",
                                textTransform: "uppercase",
                                letterSpacing: "var(--sa-type-caps-tracking)",
                              }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Ramesh Kumar", "PM-AJAY", "Jaipur", "Approved", "2026-06-20"],
                          ["Sunita Devi", "SMILE", "Patna", "Pending", "2026-06-19"],
                          ["Arjun Singh", "Scholarship", "Lucknow", "Under Review", "2026-06-18"],
                        ].map(([name, scheme, dist, status, date]) => (
                          <tr key={name} style={{ borderBottom: "1px solid var(--sa-border-neutral-subtle)" }}>
                            <td style={{ padding: "var(--sa-padding-12)" }}>{name}</td>
                            <td style={{ padding: "var(--sa-padding-12)" }}>{scheme}</td>
                            <td style={{ padding: "var(--sa-padding-12)" }}>{dist}</td>
                            <td style={{ padding: "var(--sa-padding-12)" }}>
                              <Badge
                                status={
                                  status === "Approved"
                                    ? "success"
                                    : status === "Pending"
                                    ? "warning"
                                    : "info"
                                }
                              >
                                {status}
                              </Badge>
                            </td>
                            <td style={{ padding: "var(--sa-padding-12)", color: "var(--sa-color-text-muted)" }}>{date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        <h3 style={h3Style}>Code Scaffold</h3>
        <pre style={preStyle}>{`<SiteHeader variant="portal" sticky collapseOnScroll
  emblemSrc="/emblem.png"
  brandLines={{ line1: "Ministry of Social Justice", line2: "PM-AJAY" }}
  onToggleNav={() => setSidebarOpen(v => !v)}
  account={{ name: "Akash Kumar", email: "akash@gov.in" }}
/>

<div style={{ display: "flex" }}>
  <SidebarNav open={sidebarOpen} groups={NAV_GROUPS} />
  <article id="main-content" style={{ flex: 1, padding: "var(--sa-stack-24)" }}>

    {/* Row 1: KPI MetricCards — 4 col desktop, 2 tablet, 1 mobile */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--sa-stack-16)" }}>
      <MetricCard label="Applications" value="12,438" change={{ direction: "up", percent: 14 }} />
      {/* × 3 more */}
    </div>

    {/* Row 2: Charts — 2fr 1fr desktop, 1fr mobile */}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--sa-stack-16)", marginTop: "var(--sa-padding-20)" }}>
      <Card><BarChart data={monthlyData} /></Card>
      <Card><PieChart data={categoryData} /></Card>
    </div>

    {/* Row 3: DataTable — full width */}
    <Card style={{ marginTop: "var(--sa-padding-20)" }}>
      <DataTable columns={columns} data={rows} pagination />
    </Card>

  </article>
</div>

<Footer links={FOOTER_LINKS} />`}</pre>

        <h3 style={h3Style}>Rules</h3>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-24)" }}>
          <li>MetricCard grid: <code>repeat(auto-fill, minmax(240px, 1fr))</code>. Maximum 4 per row.</li>
          <li>Charts row: <code>2fr 1fr</code> on desktop — never split charts equally (the bar chart needs more width).</li>
          <li><code>SiteHeader</code> must be <code>sticky</code> on portal variant. <code>collapseOnScroll</code> is opt-in.</li>
          <li>When <code>collapseOnScroll</code> is on, sidebar <code>top</code> offset must use <code>var(--cmp-header-h)</code>, not a hardcoded pixel value.</li>
          <li>Always provide <code>id=&quot;main-content&quot;</code> on <code>&lt;main&gt;</code> for the SiteHeader skip link.</li>
        </ul>

        <DoDont
          cards={[
            {
              type: "do",
              preview: (
                <div style={{ fontSize: "var(--sa-type-body-2-size)", textAlign: "center" }}>
                  <div style={{ fontWeight: 700, color: "var(--sa-color-status-success)" }}>4 MetricCards</div>
                  <div style={{ color: "var(--sa-text-neutral-subtle)" }}>in equal-width columns</div>
                </div>
              ),
              label: "Use auto-fill grid so cards naturally wrap on narrow viewports.",
            },
            {
              type: "dont",
              preview: (
                <div style={{ fontSize: "var(--sa-type-body-2-size)", textAlign: "center" }}>
                  <div style={{ fontWeight: 700, color: "var(--sa-color-status-danger)" }}>8 MetricCards</div>
                  <div style={{ color: "var(--sa-text-neutral-subtle)" }}>cramped in one row</div>
                </div>
              ),
              label: "Never put more than 4 MetricCards in a single row — cognitive overload.",
            },
          ]}
        />
      </section>

      {/* ═══════════════════════════════════════════════
          § 2 — Portal Login Page
      ═══════════════════════════════════════════════ */}
      <section style={sectionStyle} id="login">
        <h2 style={h2Style}>Portal Login Page</h2>
        <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-16)", flexWrap: "wrap" }}>
          <StatusBadge status="Stable" />
          <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)", alignSelf: "center" }}>
            Portal variant · Public
          </span>
        </div>
        <p style={proseStyle}>
          All MoSJE portal login pages use the shared{" "}
          <code>PortalLoginShell</code> component. The shell handles layout,
          government branding, accessibility, and responsive behaviour. Only the
          slot content changes per portal.
        </p>

        {/* Live preview: login shell mock */}
        <div
          style={{
            marginTop: "var(--sa-padding-20)",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-8)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 340,
          }}
        >
          {/* Left: brand panel */}
          <div
            style={{
              background: "var(--sa-bg-brand-primary-bolder)",
              padding: "var(--sa-padding-32)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "var(--sa-stack-16)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "color-mix(in oklab, var(--sa-on-bg-brand-primary-bolder) 20%, transparent)", flexShrink: 0 }} />
              <div>
                <div style={{ color: "var(--sa-on-bg-brand-primary-bolder)", fontWeight: 700, fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)" }}>PM-AJAY</div>
                <div style={{ color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-bolder) 70%, transparent)", fontSize: "var(--sa-type-body-3-size)" }}>
                  Ministry of Social Justice & Empowerment
                </div>
              </div>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-bolder) 85%, transparent)", fontSize: "var(--sa-type-body-2-size)", lineHeight: "var(--sa-type-body-2-lh)" }}>
              PM Anudaan for Jobs and Aspirations for Youth — one portal for all beneficiary management.
            </p>
          </div>
          {/* Right: login form */}
          <div
            style={{
              background: "var(--sa-bg-neutral-base)",
              padding: "var(--sa-padding-32)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "var(--sa-stack-16)",
            }}
          >
            <h2 style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", fontWeight: 700, color: "var(--sa-color-text-default)", margin: 0 }}>
              Sign in
            </h2>
            {/* Tab pills */}
            <div style={{ display: "flex", gap: "var(--sa-stack-8)" }}>
              {["OTP Login", "Password"].map((tab, i) => (
                <div
                  key={tab}
                  style={{
                    padding: "var(--sa-padding-8) var(--sa-padding-16)",
                    borderRadius: "var(--sa-shape-full)",
                    background: i === 0 ? "var(--sa-bg-brand-primary-bolder)" : "transparent",
                    color: i === 0 ? "white" : "var(--sa-text-neutral-subtle)",
                    fontSize: "var(--sa-type-body-2-size)",
                    fontWeight: i === 0 ? 600 : 400,
                    border: i === 0 ? "none" : "1px solid var(--sa-border-neutral-subtle)",
                    cursor: "pointer",
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>
            {/* Form stub */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-12)" }}>
              <div
                style={{
                  border: "1px solid var(--sa-border-neutral-bolder-default)",
                  borderRadius: "var(--sa-shape-6)",
                  padding: "var(--sa-padding-12) var(--sa-padding-12)",
                  color: "var(--sa-text-neutral-subtle)",
                  fontSize: "var(--sa-type-body-2-size)",
                }}
              >
                Mobile number or Aadhaar
              </div>
              <Button variant="primary" appearance="filled">
                Send OTP →
              </Button>
            </div>
          </div>
        </div>

        <h3 style={h3Style}>Code</h3>
        <pre style={preStyle}>{`import { PortalLoginShell } from "@mosje/design-system";

<PortalLoginShell
  emblemSrc="/emblem.png"
  portalName="PM-AJAY"
  portalTagline="PM Anudaan for Jobs and Aspirations for Youth"
  tabs={[
    { label: "OTP Login", content: <OtpLoginForm /> },
    { label: "Password",  content: <PasswordForm /> },
  ]}
/>`}</pre>

        <Callout type="danger" title="Never rebuild the login layout">
          Do not build a bespoke login page per portal. The{" "}
          <code>PortalLoginShell</code> handles GIGW compliance, responsive
          layout, accessibility, and government branding. Only slot in the form
          content.
        </Callout>
      </section>

      {/* ═══════════════════════════════════════════════
          § 3 — Form Wizard
      ═══════════════════════════════════════════════ */}
      <section style={sectionStyle} id="wizard">
        <h2 style={h2Style}>Form Wizard (Multi-step Application)</h2>
        <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-16)", flexWrap: "wrap" }}>
          <StatusBadge status="Beta" />
          <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)", alignSelf: "center" }}>
            Portal variant · Authenticated
          </span>
        </div>
        <p style={proseStyle}>
          Scheme applications (SMILE, PM-AJAY, scholarships) require multi-step
          data collection. The <code>Wizard</code> + <code>FormSection</code> +{" "}
          <code>Stepper</code> trio provides the approved scaffold. The final
          step is always a <code>ReviewSection</code> — never go straight from
          data entry to submission.
        </p>

        {/* Live stepper preview */}
        <div
          style={{
            marginTop: "var(--sa-padding-20)",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-8)",
            overflow: "hidden",
            background: "var(--sa-bg-neutral-base)",
          }}
        >
          <div style={{ padding: "var(--sa-padding-20)", borderBottom: "1px solid var(--sa-border-neutral-subtle)" }}>
            <Stepper
              current={1}
              steps={[
                { label: "Personal Details" },
                { label: "Address" },
                { label: "Documents" },
                { label: "Review & Submit" },
              ]}
            />
          </div>
          <div style={{ padding: "var(--sa-padding-20)", display: "flex", flexDirection: "column", gap: "var(--sa-padding-16)" }}>
            <h3 style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", fontWeight: 700, color: "var(--sa-color-text-default)", margin: 0 }}>
              Address Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sa-stack-16)" }}>
              {["Street / Village", "District", "State", "PIN Code"].map((label) => (
                <div key={label}>
                  <label style={{ display: "block", fontSize: "var(--sa-type-label-1-size)", fontWeight: 600, color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-4)" }}>
                    {label}
                  </label>
                  <div
                    style={{
                      border: "1px solid var(--sa-border-neutral-bolder-default)",
                      borderRadius: "var(--sa-shape-6)",
                      padding: "var(--sa-padding-12) var(--sa-padding-12)",
                      color: "var(--sa-text-neutral-subtle)",
                      fontSize: "var(--sa-type-body-2-size)",
                    }}
                  >
                    {label === "State" ? "Rajasthan" : ""}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginTop: "var(--sa-stack-8)" }}>
              <Button appearance="outlined">← Previous</Button>
              <Button variant="primary" appearance="filled">Save & Continue →</Button>
            </div>
          </div>
        </div>

        <h3 style={h3Style}>Code</h3>
        <pre style={preStyle}>{`import { Wizard, FormSection, FormField, Input, Select, ReviewSection } from "@mosje/design-system";

<Wizard
  steps={["Personal", "Address", "Documents", "Review"]}
  currentStep={step}
>
  {step === 0 && (
    <FormSection title="Personal Details" description="Enter your legal name as on Aadhaar.">
      <FormField label="Full Name" required><Input /></FormField>
      <FormField label="Date of Birth"><Input type="date" /></FormField>
      <FormField label="Gender" required>
        <Select options={GENDER_OPTIONS} />
      </FormField>
    </FormSection>
  )}

  {step === 1 && (
    <FormSection title="Address Details">
      <FormField label="Street / Village"><Input /></FormField>
      <FormField label="District" required><Select options={DISTRICT_OPTIONS} /></FormField>
      <FormField label="State" required><Select options={STATE_OPTIONS} /></FormField>
      <FormField label="PIN Code" required><Input type="tel" maxLength={6} /></FormField>
    </FormSection>
  )}

  {step === 3 && (
    <ReviewSection
      title="Review your application"
      data={formData}  // All collected values
      onEdit={(stepIndex) => setStep(stepIndex)}
    />
  )}
</Wizard>`}</pre>

        <h3 style={h3Style}>Rules</h3>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-24)" }}>
          <li>Each step: <strong>3–6 FormFields</strong>. Never exceed 8 visible fields per step.</li>
          <li>Final step is always <code>&lt;ReviewSection&gt;</code> — show all entered values before submit.</li>
          <li>Show <code>&lt;Stepper&gt;</code> at the top of the wizard to communicate progress visually.</li>
          <li>Persist form state between steps using React state or <code>sessionStorage</code> — never re-fetch.</li>
          <li>Back button must restore previously entered values — never clear the form on step navigation.</li>
        </ul>
      </section>

      {/* ═══════════════════════════════════════════════
          § 4 — Data Table Pattern
      ═══════════════════════════════════════════════ */}
      <section style={sectionStyle} id="data-table">
        <h2 style={h2Style}>Data Table Pattern</h2>
        <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-16)", flexWrap: "wrap" }}>
          <StatusBadge status="Beta" />
        </div>
        <p style={proseStyle}>
          All MoSJE portals display tabular government data — application lists,
          beneficiary records, audit logs. The <code>DataTable</code> component
          provides sortable, paginated, keyboard-navigable tables that satisfy
          WCAG 2.1 AA out of the box.
        </p>

        <Alert status="info" style={{ marginTop: "var(--sa-padding-20)" }}>
          Always use <code>&lt;DataTable&gt;</code> for lists with more than 5 rows.
          Raw HTML <code>&lt;table&gt;</code> is only acceptable for small
          static summary tables.
        </Alert>

        <h3 style={h3Style}>Key Rules</h3>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-24)" }}>
          <li>Always provide a <code>caption</code> prop or <code>aria-label</code> on the table.</li>
          <li>Numeric columns must be <strong>right-aligned</strong> — header alignment must match column alignment.</li>
          <li>Zebra-stripe dense tables (&gt;15 rows) using <code>--sa-bg-neutral-subtler</code>.</li>
          <li>Status cells must use <code>&lt;Badge&gt;</code> with both colour <em>and</em> text — never colour alone.</li>
          <li>Export (CSV/PDF) is always a secondary action — never a primary button.</li>
          <li>Sort indicators must be visible keyboard-operable column header buttons.</li>
          <li>Use <code>sticky</code> headers for scrollable tables that exceed viewport height.</li>
        </ul>

        <DoDont
          cards={[
            {
              type: "do",
              preview: (
                <div style={{ fontSize: "var(--sa-type-body-2-size)" }}>
                  <Badge status="success">Approved</Badge>
                  <span style={{ marginLeft: "var(--sa-inline-8)", color: "var(--sa-color-text-muted)" }}>+ text label</span>
                </div>
              ),
              label: "Use Badge with both colour and text — colour + text satisfies WCAG 1.4.1.",
            },
            {
              type: "dont",
              preview: (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--sa-color-status-success)",
                    margin: "auto",
                  }}
                />
              ),
              label: "Never use colour alone to communicate status — fails colour-blind users.",
            },
          ]}
        />
      </section>

      {/* ═══════════════════════════════════════════════
          § 5 — Empty State Pattern
      ═══════════════════════════════════════════════ */}
      <section style={sectionStyle} id="empty-state">
        <h2 style={h2Style}>Empty State Pattern</h2>
        <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-16)", flexWrap: "wrap" }}>
          <StatusBadge status="Stable" />
        </div>
        <p style={proseStyle}>
          Empty states are not errors — they are opportunities to guide the user
          to their next action. Every data container that can be empty must
          render an <code>EmptyState</code> component, not a blank area or raw
          text.
        </p>

        {/* Live preview */}
        <div
          style={{
            marginTop: "var(--sa-padding-20)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--sa-padding-20)",
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>No Results (filtered)</CardTitle>
            </CardHeader>
            <CardBody>
              <EmptyState
                title="No applications match"
                description='Try adjusting your filters — clear "District: Jaipur" to see all records.'
                action={<Button appearance="outlined" size="sm">Clear filters</Button>}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>No Data (fresh portal)</CardTitle>
            </CardHeader>
            <CardBody>
              <EmptyState
                title="No applications yet"
                description="Once beneficiaries apply through the portal, their applications will appear here."
                action={<Button variant="primary" appearance="filled" size="sm">Add application manually</Button>}
              />
            </CardBody>
          </Card>
        </div>

        <h3 style={h3Style}>Rules</h3>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-24)" }}>
          <li>Always include: icon + heading + 1-sentence description + primary CTA.</li>
          <li>Use <code>variant=&quot;no-results&quot;</code> for search/filter empty states with a clear-filters action.</li>
          <li>Use <code>variant=&quot;no-data&quot;</code> for completely empty data containers with a create/add action.</li>
          <li>The heading must be constructive: <em>&quot;Add your first application&quot;</em> — not passive: <em>&quot;No applications found&quot;</em>.</li>
          <li>Never use red or warning colours for empty states — empty is not an error.</li>
          <li>A loading spinner is not an empty state — show <code>&lt;Loader&gt;</code> while data is fetching.</li>
        </ul>

        <DoDont
          cards={[
            {
              type: "do",
              preview: (
                <div style={{ textAlign: "center", padding: "var(--sa-stack-16)" }}>
                  <div style={{ marginBottom: "var(--sa-stack-8)", color: "var(--sa-text-neutral-subtle)" }}>
                    <Icon name="assignment" size={32} aria-hidden="true" />
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--sa-color-text-default)", marginBottom: "var(--sa-stack-4)" }}>No applications yet</div>
                  <div style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)", marginBottom: "var(--sa-stack-12)" }}>Add your first application to get started.</div>
                  <Button variant="primary" appearance="filled" size="sm">Add application</Button>
                </div>
              ),
              label: "Icon + heading + description + CTA. Constructive, actionable.",
            },
            {
              type: "dont",
              preview: (
                <div style={{ textAlign: "center", padding: "var(--sa-stack-16)", color: "var(--sa-color-text-muted)", fontSize: "var(--sa-type-body-2-size)" }}>
                  No data found.
                </div>
              ),
              label: "Never show only a plain text message with no action path — leaves users stuck.",
            },
          ]}
        />
      </section>

      {/* ═══════════════════════════════════════════════
          § 6 — Informational Page (Website)
      ═══════════════════════════════════════════════ */}
      <section style={sectionStyle} id="website-page">
        <h2 style={h2Style}>Informational Page (Website)</h2>
        <div style={{ display: "flex", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-16)", flexWrap: "wrap" }}>
          <StatusBadge status="Stable" />
          <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)", alignSelf: "center" }}>
            Website variant · Public
          </span>
        </div>
        <p style={proseStyle}>
          The standard page layout for all 13 informational websites in the
          MoSJE estate. Used for scheme overview pages, ministry pages, and
          commission home pages.
        </p>

        <h3 style={h3Style}>Section Order</h3>
        <ol style={{ ...proseStyle, paddingLeft: "var(--sa-padding-24)" }}>
          <li><strong>Hero</strong> — Scheme name, brief tagline, primary CTA (Apply / Know More).</li>
          <li><strong>Key Features / Overview</strong> — 3–4 feature cards or a brief prose section.</li>
          <li><strong>Eligibility / Beneficiaries</strong> — Who qualifies. Use a structured list or table.</li>
          <li><strong>How to Apply</strong> — Numbered step-by-step process (use <code>Stepper</code> in display mode).</li>
          <li><strong>Contact / Helpdesk</strong> — Helpline number, email, office address.</li>
          <li><strong>CTA Block</strong> — Repeat the primary action (Apply Online / Download Form).</li>
        </ol>

        <h3 style={h3Style}>Rules</h3>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-24)" }}>
          <li>Only <strong>one</strong> <code>&lt;h1&gt;</code> per page.</li>
          <li>All sections must have <code>id</code> attributes for deep-linking.</li>
          <li>Content max-width: <code>1280px</code>. Prose sections: <code>max-w-prose</code> (<code>65ch</code>).</li>
          <li>No decorative Indian tricolour stripes in headers, footers, or dividers.</li>
          <li>No hardcoded background colours on sections — use <code>--sa-bg-neutral-base</code> / <code>--sa-bg-neutral-subtler</code> alternating sections.</li>
        </ul>

        <Loader />
      </section>
    </>
  );
}
