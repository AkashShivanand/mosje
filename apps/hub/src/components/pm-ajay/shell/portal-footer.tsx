/* PM-AJAY's footer — one credit line for every screen in the portal.
   DS Audit: Footer ✅ existing. Nothing added.

   WHAT IT SAYS AND WHY. DBIM 3.0 §5.6 sets the lineage sentence for a Central
   Government Department verbatim — "The website belongs to Department of …,
   Ministry of …, Government of India" — and lists what a footer must carry:
   the website policies, help, and the date the content was last updated. GIGW 3.0
   §Q7 requires that date to be shown, and its lifecycle section requires the
   content owner to be named.

   The line this replaces was a template's: "© 2025 - Copyright UX4G. All rights
   reserved. Powered by NeGD | MeitY" on the live portal, and "© 2025 — …
   Designed, developed & hosted by NIC" in our own build — a year out of date, a
   copyright held by a design system, and two different developers named on two
   screens of one portal. Its two links went to "#".

   The developer credit follows what the Department publishes on its own website
   (NeGD, MeitY). If the MIS is in fact built or hosted by NIC, this is the one
   line to correct, and it is now in one file rather than two. */

/* The design system's Footer draws plain anchors and takes no `linkAs`: these four
   destinations are on the website, a different surface, so a document load is right. */
import { Footer } from "@mosje/design-system";

const WEBSITE = "/website";

export interface PortalFooterProps {
  /**
   * The date the content on this screen was last updated, as the department
   * would write it — "24 September 2026". DBIM §5.6 and GIGW Q7 both ask for it.
   */
  lastUpdated: string;
}

export function PortalFooter({ lastUpdated }: PortalFooterProps) {
  return (
    <Footer
      /* One sentence. DBIM §5.6 asks for the lineage and GIGW for the date; everything
         else a footer used to carry here — a developer credit, a ministry named twice, a
         copyright held by a design system — is not what a reader needs at the foot of a
         working screen. */
      copyright={
        <>
          This portal belongs to the Department of Social Justice &amp; Empowerment, Government of
          India. Last updated {lastUpdated}.
        </>
      }
      /* Every one of these is a page the estate actually publishes. The pair this
         replaces pointed at routes that do not exist, and before that at "#". */
      links={[
        { label: "Website Policies", href: `${WEBSITE}/terms-conditions` },
        { label: "Privacy Policy", href: `${WEBSITE}/privacy-policy` },
        { label: "Accessibility Statement", href: `${WEBSITE}/accessibility-statement` },
        { label: "Help", href: `${WEBSITE}/help` },
      ]}
    />
  );
}
