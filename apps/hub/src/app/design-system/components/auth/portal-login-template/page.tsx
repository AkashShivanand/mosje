import type { Metadata } from "next";
import {
  DocsTabs,
  PropsTable,
  DoDont,
  A11yChecklist,
  StatusBadge,
  CodeBlock,
  FeedbackBar,
} from "@/components/design-system/docs-kit/index";
import { figmaUrl } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Portal Login Template",
  description: "A pre-configured template composing role-based login tabs (Citizen, Officer, State Admin), OTP verification, Captcha validation, and DigiLocker SSO integration.",
};

/* ── Layout primitives ── */
const sectionStyle: React.CSSProperties = {
  marginTop: "var(--sa-section-48)",
  scrollMarginTop: "var(--docs-anchor-offset)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-1-size)",
  lineHeight: "var(--sa-type-headline-1-lh)",
  fontWeight: 700,
  color: "var(--sa-text-neutral-base)",
  marginBottom: "var(--sa-stack-16)",
  paddingBottom: "var(--sa-padding-8)",
  borderBottom: "1px solid var(--sa-border-neutral-subtle)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: 1.7,
  maxWidth: "68ch",
};

export default function PortalLoginTemplateDocPage(): React.JSX.Element {
  return (
    <article className="docs-article" style={{ maxWidth: "1024px", margin: "0 auto", paddingBottom: "var(--sa-section-56)" }}>
      {/* ── Header ── */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 800, color: "var(--sa-text-neutral-base)", margin: 0 }}>
            Portal Login Template
          </h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          {"A pre-configured template composing role-based login tabs (Citizen, Officer, State Admin), OTP verification, Captcha validation, and DigiLocker SSO integration."}
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)", display: "flex", gap: "var(--sa-inline-12)", flexWrap: "wrap" }}>
          <a
            className="docs-page-header__link"
            href={figmaUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Figma Component Spec <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ── Tabbed Content ── */}
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <>
                <section style={sectionStyle}>
                  <h2 id="overview" style={h2Style}>Overview & Purpose</h2>
                  <p style={proseStyle}>
                    {"Portal Login Template is designed to enforce consistent interaction, visual hierarchy, and government compliance across all MoSJE digital properties."}
                  </p>
                  
                  <div
                    style={{
                      marginTop: "var(--sa-stack-24)",
                      padding: "var(--sa-padding-32)",
                      background: "var(--sa-bg-neutral-subtler)",
                      borderRadius: "var(--sa-shape-8)",
                      border: "1px solid var(--sa-border-neutral-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--sa-stack-16)",
                    }}
                  >
                    <div style={{ fontSize: "var(--sa-type-label-3-size)", fontWeight: 700, color: "var(--sa-text-neutral-subtle)", textTransform: "uppercase" }}>
                      Live Component Specimen
                    </div>
                    <div style={{ background: "var(--sa-bg-neutral-base)", padding: "var(--sa-padding-20)", borderRadius: "var(--sa-shape-6)", border: "1px solid var(--sa-border-neutral-subtle)" }}>
                      <div style={{ padding: "var(--sa-padding-24)", border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-8)", background: "var(--sa-bg-neutral-base)" }}><div style={{ display: "flex", gap: "var(--sa-stack-8)", marginBottom: "var(--sa-stack-16)", borderBottom: "1px solid var(--sa-border-neutral-subtle)", paddingBottom: "var(--sa-padding-8)" }}><span style={{ fontWeight: 600, color: "var(--sa-text-brand-primary-base)" }}>Citizen Login</span><span style={{ color: "var(--sa-text-neutral-subtle)" }}>·</span><span style={{ color: "var(--sa-text-neutral-subtle)" }}>Officer Login</span></div><p style={{ margin: 0, color: "var(--sa-text-neutral-base)" }}>Standardized MoSJE Portal Role Switcher & Authentication Form</p></div>
                    </div>
                  </div>
                </section>

                <section style={sectionStyle}>
                  <h2 id="guidelines" style={h2Style}>Usage Guidelines</h2>
                  <DoDont
                    cards={[
                      {
                        type: "do",
                        label: "Configure role tabs to match your portal user personas.",
                        preview: (
                          <div style={{ padding: "var(--sa-padding-16)", textAlign: "center", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-text-neutral-base)" }}>
                            Recommended Practice
                          </div>
                        ),
                      },
                      {
                        type: "dont",
                        label: "Do not mix citizen and administrative login forms in a single un-tabbed container.",
                        preview: (
                          <div style={{ padding: "var(--sa-padding-16)", textAlign: "center", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-text-neutral-subtle)" }}>
                            Anti-pattern
                          </div>
                        ),
                      },
                    ]}
                  />
                </section>
              </>
            ),
          },
          {
            id: "code",
            label: "Code",
            content: (
              <>
                <section style={sectionStyle}>
                  <h2 id="installation" style={h2Style}>Installation & Import</h2>
                  <CodeBlock>{`import { PortalLoginTemplate } from "@mosje/design-system";`}</CodeBlock>
                </section>

                <section style={sectionStyle}>
                  <h2 id="props" style={h2Style}>Props Reference</h2>
                  <PropsTable props={[
  {
    "name": "roles",
    "type": "PortalRoleTab[]",
    "required": true,
    "description": "Array of user login role configurations."
  },
  {
    "name": "onSubmit",
    "type": "(payload: LoginSubmitPayload) => void",
    "required": true,
    "description": "Callback triggered on successful form submission."
  },
  {
    "name": "ssoProviders",
    "type": "string[]",
    "default": "[\"DigiLocker\", \"MeriPehchaan\"]",
    "description": "List of enabled single sign-on providers."
  }
]} />
                </section>

                <section style={sectionStyle}>
                  <h2 id="example" style={h2Style}>Code Example</h2>
                  <CodeBlock>{`<div style={{ padding: "var(--sa-padding-24)", border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-8)", background: "var(--sa-bg-neutral-base)" }}><div style={{ display: "flex", gap: "var(--sa-stack-8)", marginBottom: "var(--sa-stack-16)", borderBottom: "1px solid var(--sa-border-neutral-subtle)", paddingBottom: "var(--sa-padding-8)" }}><span style={{ fontWeight: 600, color: "var(--sa-text-brand-primary-base)" }}>Citizen Login</span><span style={{ color: "var(--sa-text-neutral-subtle)" }}>·</span><span style={{ color: "var(--sa-text-neutral-subtle)" }}>Officer Login</span></div><p style={{ margin: 0, color: "var(--sa-text-neutral-base)" }}>Standardized MoSJE Portal Role Switcher & Authentication Form</p></div>`}</CodeBlock>
                </section>
              </>
            ),
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <>
                <section style={sectionStyle}>
                  <h2 id="wcag" style={h2Style}>WCAG 2.2 AA & GIGW 3.0 Compliance</h2>
                  <p style={proseStyle}>
                    This component satisfies all mandatory Government of India Guidelines for Web Portals (GIGW 3.0) and WCAG 2.2 Level AA requirements.
                  </p>
                  <A11yChecklist items={[
  {
    "criterion": "4.1.2 Name, Role, Value",
    "level": "AA",
    "description": "Role switcher tabs use standard WAI-ARIA tablist semantics."
  },
  {
    "criterion": "2.4.7 Focus Visible",
    "level": "AA",
    "description": "High contrast 3px focus ring on all credential fields."
  }
]} />
                </section>

                <section style={sectionStyle}>
                  <h2 id="keyboard" style={h2Style}>Keyboard Navigation</h2>
                  <div style={{ overflowX: "auto" }}>
                    <table className="props-table">
                      <thead>
                        <tr>
                          <th scope="col">Key</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><kbd style={{ fontFamily: "var(--sa-font-mono)", padding: "var(--sa-padding-2) var(--sa-padding-6)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}>ArrowLeft / ArrowRight</kbd></td>
                          <td>{"Switches between Citizen, Officer, and Admin login tabs."}</td>
                        </tr>
                        <tr>
                          <td><kbd style={{ fontFamily: "var(--sa-font-mono)", padding: "var(--sa-padding-2) var(--sa-padding-6)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}>Space / Enter</kbd></td>
                          <td>{"Activates selected SSO provider button."}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ),
          },
        ]}
      />

      {/* ── Feedback & Continuous Improvement ── */}
      <FeedbackBar componentName="Portal Login Template" />
    </article>
  );
}
