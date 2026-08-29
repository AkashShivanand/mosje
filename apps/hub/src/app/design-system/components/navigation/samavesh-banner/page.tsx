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
import { SamaveshBanner } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "SAMAVESH Banner — Design System",
  description:
    "Top identity banner and portal discovery drawer implementing Figma node 7116:33784 & 7298:29968.",
};

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

const PROPS = [
  {
    name: "defaultOpen",
    type: "boolean",
    default: "false",
    description: "Initial expanded state for uncontrolled usage.",
  },
  {
    name: "isOpen",
    type: "boolean",
    default: "undefined",
    description: "Controlled open/closed state of the portal exploration drawer.",
  },
  {
    name: "onToggle",
    type: "(open: boolean) => void",
    default: "undefined",
    description: "Callback invoked when the explore drawer is expanded or collapsed.",
  },
  {
    name: "portals",
    type: "SamaveshBannerPortalItem[]",
    default: "DEFAULT_SAMAVESH_PORTALS",
    description: "Array of portal cards to display inside the expanded accordion drawer.",
  },
  {
    name: "drawerTitle",
    type: "string",
    default: '"Choose a portal to visit"',
    description: "Heading text displayed inside the open drawer.",
  },
  {
    name: "viewAllHref",
    type: "string",
    default: '"/website/samavesh-citizen-portals"',
    description: "URL destination for the full portal directory link.",
  },
  {
    name: "viewAllLabel",
    type: "string",
    default: '"View all citizen portals"',
    description: "Label for the full portal directory link.",
  },
  {
    name: "title",
    type: "string",
    default: '"SAMAVESH"',
    description: "Main bold title in the header bar.",
  },
  {
    name: "subline",
    type: "string",
    default: '"Single Access Mechanism for All Verticals of Empowerment & Social Harmony"',
    description: "Descriptive tagline shown beside the title.",
  },
  {
    name: "exploreLabel",
    type: "string",
    default: '"Explore"',
    description: "Text on the toggle button.",
  },
];

export default function SamaveshBannerDocPage(): React.JSX.Element {
  return (
    <article
      className="docs-article"
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        paddingBottom: "var(--sa-section-56)",
      }}
    >
      {/* ── Header ── */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sa-stack-12)",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "var(--sa-type-display-1-size)",
              fontWeight: 800,
              color: "var(--sa-text-neutral-base)",
              margin: 0,
            }}
          >
            SAMAVESH Banner
          </h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          {
            "Top identity banner and interactive portal exploration drawer for the MoSJE estate, connecting citizens directly to ministry portals including SCW, SMILE, NOS, and NMBA."
          }
        </p>
        <div
          style={{
            marginTop: "var(--sa-stack-16)",
            display: "flex",
            gap: "var(--sa-inline-12)",
            flexWrap: "wrap",
          }}
        >
          <a
            className="docs-page-header__link"
            href={figmaUrl("7116-33784")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Figma Component (7116:33784)
          </a>
        </div>
      </header>

      {/* ── Interactive Specimen ── */}
      <section style={sectionStyle} aria-labelledby="specimen-heading">
        <h2 id="specimen-heading" style={h2Style}>
          Interactive Specimen
        </h2>
        <div
          style={{
            borderRadius: "var(--sa-shape-16)",
            border: "1px solid var(--sa-border-neutral-subtle)",
            overflow: "hidden",
            backgroundColor: "var(--sa-bg-neutral-base)",
          }}
        >
          <SamaveshBanner defaultOpen={true} />
        </div>
      </section>

      {/* ── Usage Tabs ── */}
      <section style={sectionStyle} aria-labelledby="usage-heading">
        <h2 id="usage-heading" style={h2Style}>
          Implementation & Guidelines
        </h2>
        <DocsTabs
          tabs={[
            {
              id: "design",
              label: "Design",
              content: (
                <>
                  <section style={sectionStyle}>
                    <h2 id="overview" style={h2Style}>Overview & Principles</h2>
                    <p style={proseStyle}>
                      The SAMAVESH banner acts as the unified gateway across the
                      digital estate. It provides immediate branding recognition with
                      the India Saffron ground and national emblem logo, paired with
                      an accessible expandable accordion drawer for instant navigation
                      to core public-facing services.
                    </p>
                  </section>

                  <section style={sectionStyle}>
                    <h2 id="guidelines" style={h2Style}>Usage Guidelines</h2>
                    <DoDont
                      cards={[
                        {
                          type: "do",
                          label: "Use the unified @mosje/design-system SamaveshBanner on all required pages.",
                          preview: (
                            <div style={{ padding: "var(--sa-padding-16)", textAlign: "center", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-text-neutral-base)" }}>
                              Recommended Practice
                            </div>
                          ),
                        },
                        {
                          type: "dont",
                          label: "Do not hand-roll raw HTML/CSS header banners with hardcoded hex colors or static links.",
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
                    <CodeBlock>{`import { SamaveshBanner } from "@mosje/design-system";`}</CodeBlock>
                  </section>

                  <section style={sectionStyle}>
                    <h2 id="props" style={h2Style}>Props Reference</h2>
                    <PropsTable props={PROPS} />
                  </section>

                  <section style={sectionStyle}>
                    <h2 id="example" style={h2Style}>Code Example</h2>
                    <CodeBlock>{`<SamaveshBanner
  drawerTitle="Choose a portal to visit"
  viewAllHref="/website/samavesh-citizen-portals"
/>`}</CodeBlock>
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
                    <A11yChecklist
                      items={[
                        {
                          criterion: "2.1.1 Keyboard Navigation",
                          level: "A",
                          description:
                            "The Explore toggle is a native button with full keyboard focus indicators, and pressing Escape automatically closes the open drawer.",
                        },
                        {
                          criterion: "4.1.2 Name, Role, Value",
                          level: "A",
                          description:
                            "aria-expanded and aria-controls accurately communicate the drawer state to screen readers.",
                        },
                        {
                          criterion: "1.4.3 Contrast (Minimum)",
                          level: "AA",
                          description:
                            "White text and badges against India Saffron (#ff671f) and dark green / saffron headings meet 4.5:1+ text contrast requirements.",
                        },
                      ]}
                    />
                  </section>
                </>
              ),
            },
          ]}
        />
      </section>

      {/* ── Props Table ── */}
      <section style={sectionStyle} aria-labelledby="props-heading">
        <h2 id="props-heading" style={h2Style}>
          Component Props
        </h2>
        <PropsTable props={PROPS} />
      </section>

      {/* ── Feedback Bar ── */}
      <div style={{ marginTop: "var(--sa-section-48)" }}>
        <FeedbackBar />
      </div>
    </article>
  );
}
