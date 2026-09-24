/* DS Audit: Footer ✅ existing. The portal's slim navy band, with the department's
   own credit line and the two policy links the live portal carries. */

import { Footer } from "@mosje/design-system";

export function DistrictFooter() {
  return (
    <Footer
      copyright="© 2026 — Department of Social Justice & Empowerment. Content owned by MoSJE. Designed, developed and hosted by NIC."
      links={[
        { label: "Terms & Conditions", href: "/portals/pm-ajay/terms" },
        { label: "Privacy Policy", href: "/portals/pm-ajay/privacy" },
      ]}
    />
  );
}
