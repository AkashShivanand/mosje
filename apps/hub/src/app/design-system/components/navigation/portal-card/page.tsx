import type { Metadata } from "next";
import {
  DocsTabs,
  PropsTable,
  A11yChecklist,
  StatusBadge,
  CodeBlock,
  FeedbackBar,
} from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import { PortalCard } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Portal Card — Design System",
  description:
    "One portal in a grid of them — org mark, short code, full name, and a note when the portal is not built yet.",
};

const sectionStyle: React.CSSProperties = {
  marginTop: "var(--sa-section-48)",
  scrollMarginTop: "var(--docs-anchor-offset)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-1-size)",
  lineHeight: "var(--sa-type-headline-1-lh)",
  fontWeight: "var(--sa-font-weight-bold)",
  color: "var(--sa-text-neutral-base)",
  marginBottom: "var(--sa-stack-16)",
  paddingBottom: "var(--sa-padding-8)",
  borderBottom: "1px solid var(--sa-border-neutral-subtle)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "var(--sa-container-measure)",
};


export default function PortalCardPage() {
  return (
    <article className="docs-article">
      <header>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", lineHeight: "var(--sa-type-display-1-lh)", fontWeight: "var(--sa-font-weight-medium)", color: "var(--sa-text-neutral-base)", margin: 0 }}>
            Portal Card
          </h1>
          <StatusBadge status="New" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          {
            "One portal in a grid of them \u2014 org mark, short code, full name. Used by the SAMAVESH banner drawer. It was extracted to end two surfaces drawing the same object two ways, and both have adopted it: the banner drawer uses the compact variant, /portals the detailed one. See \u201cWhen to use it, and when not\u201d."
          }
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)", display: "flex", gap: "var(--sa-inline-12)", flexWrap: "wrap" }}>
          <a className="docs-page-header__link" href={figmaUrl(FIGMA_NODES.portalCard)} target="_blank" rel="noopener noreferrer">
            Figma Component Spec <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section style={sectionStyle} aria-labelledby="specimen-heading">
        <h2 id="specimen-heading" style={h2Style}>Interactive Specimen</h2>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--sa-inline-16)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {/* No `logoSrc` anywhere: the mark is resolved from the route through
              the OrgLogo registry, which is the only place a mark's path lives. */}
          <li style={{ display: "flex" }}>
            <PortalCard code="SCW" name="Senior Citizens Welfare" href="/portals/scw" />
          </li>
          <li style={{ display: "flex" }}>
            <PortalCard code="NMBA" name="Nasha Mukt Bharat Abhiyaan" href="/portals/nmba" />
          </li>
          <li style={{ display: "flex" }}>
            <PortalCard
              code="SMILE"
              name="Beggary Rehabilitation"
              href="/portals/smile-admin"
              selected
            />
          </li>
          {/* The `external` cue, which no live portal exercises yet — so without a
              specimen here nobody would see it until the first one shipped. */}
          <li style={{ display: "flex" }}>
            <PortalCard
              code="NCSC"
              name="National Commission for Scheduled Castes"
              href="https://ncsc.nic.in/"
              org="ncsc"
              external
            />
          </li>
        </ul>

        <h3 style={{ ...h2Style, fontSize: "var(--sa-type-headline-2-size)", marginTop: "var(--sa-section-32)" }}>
          variant=&quot;detailed&quot;
        </h3>
        <p style={proseStyle}>
          {
            "The same card with room to explain itself \u2014 for /portals, where the reader is choosing rather than finding. Nothing about the rule, the ground, the tile or the code changes."
          }
        </p>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--sa-inline-16)",
            listStyle: "none",
            margin: "var(--sa-stack-16) 0 0",
            padding: 0,
          }}
        >
          <li style={{ display: "flex" }}>
            <PortalCard
              variant="detailed"
              code="PM-AJAY"
              name="Pradhan Mantri Anusuchit Jaati Abhyuday Yojana"
              href="/portals/pm-ajay"
              description="Adarsh Gram, Grants-in-Aid and Hostel components for Scheduled Caste habitations."
              category="Schemes &amp; scholarships"
            />
          </li>
          <li style={{ display: "flex" }}>
            <PortalCard
              variant="detailed"
              code="NMBA"
              name="Nasha Mukt Bharat Abhiyaan"
              href="/portals/nmba"
              description="Substance-use prevention: treatment centres, outreach and district reporting."
              category="Social defence &amp; welfare"
            />
          </li>
        </ul>
      </section>

      <section style={sectionStyle} aria-labelledby="usage-heading">
        <h2 id="usage-heading" style={h2Style}>Implementation &amp; Guidelines</h2>
        <DocsTabs
          tabs={[
            {
              id: "design",
              label: "Design",
              content: (
                <section style={sectionStyle}>
                  <h2 id="overview" style={h2Style}>When to use it, and when not</h2>
                  <p style={proseStyle}>
                    {
                      "It is deliberately DUMB: it takes strings and renders them. Which portals to show, and whether one is built, belongs to the caller reading the estate registry — a card that looked up its own status would put that query in three places again."
                    }
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    {
                      "It is NOT a generic link card. The accent slot expects a short code and the palette is bound to SAMAVESH saffron. Reach for Card for general content."
                    }
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    {
                      "A planned card is a different shape, not a dimmed one — dashed border, no fill, no elevation. A card that merely looked faded would still read as something you can press, and pressing it is exactly what shipped a 404 to citizens on every page of the website."
                    }
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    {
                      "KNOWN GAP — the duplication this was extracted to end is only half closed. The banner drawer adopted it; the /portals directory still renders its own portals-gw__card with its own stylesheet, so there are currently three cards for one object rather than one. The stop is deliberate: the gateway card carries an org line, a description, a category chip and a CTA row that this component has no slot for, so consolidating means deciding whether Portal Card grows a denser variant or the gateway keeps a distinct card for a genuinely denser context. That is a design call. Make it before anything adds a fourth."
                    }
                  </p>
                </section>
              ),
            },
            {
              id: "code",
              label: "Code",
              content: (
                <section style={sectionStyle}>
                  <h2 id="example" style={h2Style}>Code Example</h2>
                  <CodeBlock>{`<ul>
  <li>
    <PortalCard
      code="SCW"
      name="Senior Citizens Welfare"
      href="/portals/scw"
      logoSrc="/design-system/org-logos/scw.png"
    />
  </li>
  <li>
    <PortalCard code="NOS" name="National Overseas Scholarship" planned />
  </li>
</ul>`}</CodeBlock>
                </section>
              ),
            },
            {
              id: "a11y",
              label: "Accessibility",
              content: (
                <section style={sectionStyle}>
                  <h2 id="a11y-heading" style={h2Style}>Accessibility</h2>
                  <A11yChecklist
                    items={[
                      {
                        criterion: "4.1.2 Name, Role, Value",
                        level: "A",
                        description:
                          "Wrap it in a real <li>. NEVER put role=\"listitem\" on the card — an explicit role REPLACES the implicit link one, and screen readers then announce list items with no links between them. That shipped once.",
                      },
                      {
                        criterion: "1.4.11 Non-text Contrast",
                        level: "AA",
                        description:
                          "The border is saffronDark, not the brand saffron: it is the card's ONLY boundary, so the 3:1 threshold applies. saffronDark measures 6.02:1 on the drawer's peach ground and 6.60:1 on white; bright saffron would be 2.91:1.",
                      },
                      {
                        criterion: "2.4.4 Link Purpose",
                        level: "A",
                        description:
                          "The code and the full name are both inside the link, so its accessible name is “SCW Senior Citizens Welfare” rather than a bare abbreviation.",
                      },
                      {
                        criterion: "3.2.5 Change on Request",
                        level: "AAA",
                        description:
                          "`external` opens a new tab. Pair it with a visible cue in your own layout — a new window should be announced before it opens.",
                      },
                    ]}
                  />
                </section>
              ),
            },
          ]}
        />
      </section>

      <section style={sectionStyle} aria-labelledby="props-heading">
        <h2 id="props-heading" style={h2Style}>Component Props</h2>
        {/*
          GENERATED, not typed. This page was held back from the template migration
          as "the estate's best", and its hand-written table had drifted furthest of
          any in the catalogue: it documented `logoSrc`, `planned` and `note` — none
          of which the component has — and omitted seven that it does, including
          `variant`, `selected`, `org`, `description` and `category`, four of which
          its own specimen demonstrates on screen a few lines above.
        */}
        <PropsTable from="PortalCardProps" />
      </section>

      <div style={{ marginTop: "var(--sa-section-48)" }}>
        <FeedbackBar />
      </div>
    </article>
  );
}
