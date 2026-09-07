import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { GallerySpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Gallery Screen — Design System",
  description: "A managed media collection: grid or list, the same actions in both, and a lightbox.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "Closing the lightbox returns focus to the tile that opened it.",
    status: "verified",
    evidence: "Each tile registers its button in a ref array; the close handler focuses triggers.current[index] before clearing the open index.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The layout toggle is a group of buttons carrying aria-pressed, not a pair of links pretending to be a switch.",
    status: "verified",
    evidence: "Rendered as div[role=group][aria-label=\"Layout\"] over buttons with aria-pressed bound to the current layout.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The pressed layout is marked by a fill and a weight change, never colour alone.",
    status: "verified",
    evidence: "The aria-pressed rule sets background, border-color and font-weight together.",
  },
  {
    criterion: "1.2.2 Captions (Prerecorded)",
    level: "A",
    description:
      "A video with speech needs a WebVTT track. The component cannot author one, and does not suppress the warning when it is missing.",
    status: "partial",
    evidence: "Inherited from Lightbox, which omits the track element and warns once per source in development. Compliance still depends on the caller supplying captions.",
  },
];

export default function GalleryScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Gallery Screen"
      status="Beta"
      summary={"Media a reader manages. Grid and list are one capability at two densities — the toggle changes how much fits, never what can be done."}
      figma={{
        absent:
          "Absent. No media or gallery surface is drawn on the handoff page.",
      }}
      specimen={<GallerySpecimen />}
      propsFrom="GalleryScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Site inspection photographs, event media, a beneficiary's uploaded evidence.",
          "Anything the reader browses visually and acts on individually.",
        ],
        avoid: [
          "A required document checklist — that is Checklist Screen.",
          "A document listing with no visual content — that is Catalogue Screen.",
        ],
      }}
      related={[
        { label: "Lightbox", href: "/design-system/components/feedback/lightbox", reason: "the viewer" },
        { label: "Media Gallery Input", href: "/design-system/components/forms/media-gallery-input", reason: "the upload side" },
        { label: "Catalogue Screen", href: "/design-system/components/templates/catalogue-screen", reason: "the non-visual listing" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-density">
            <h2 id="cdp-density" className="cdp__h2">Density, Not Capability</h2>
            <p>
              Every per-item action is present in both layouts. A toggle that also removes controls
              is a toggle readers learn to distrust, and it strands anyone who chose the denser view
              for a reason.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-alt">
            <h2 id="cdp-alt" className="cdp__h2">Alt Text and Captions Are the Caller&rsquo;s</h2>
            <Callout type="warning" title="The warning is not suppressed">
              Lightbox warns in development when a video arrives with no WebVTT track, because it
              cannot author captions and WCAG 1.2.2 requires them. A gallery of departmental event
              footage is exactly where that gets skipped.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<GalleryScreen
  title="Site Photographs"
  label="Photographs from the Krishna Nagar site inspection"
  items={media.map((m) => ({
    id: m.id,
    type: m.kind,
    src: m.url,
    thumbnail: m.thumbUrl,
    alt: m.description,
    caption: m.description,
    meta: formatDate(m.takenAt),
    actions: canManage ? <Button size="sm" appearance="text">Remove</Button> : undefined,
  }))}
  layout={searchParams.get("view") === "list" ? "list" : "grid"}
  onLayoutChange={(v) => router.replace(\`?view=\${v}\`)}
/>`}</CodeBlock>
        </section>
      }
    />
  );
}
