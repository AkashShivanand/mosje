"use client";

import * as React from "react";
import { AccountMenu } from "@mosje/design-system";

/**
 * The functions here sit *inside* the `items` array rather than on a JSX
 * attribute, which is why this one is easy to miss: it looks like plain data.
 * A Server Component still cannot serialise it, and the build fails on the
 * prerender rather than on typecheck.
 *
 * The handlers are no-ops. A reader clicking "Sign Out" in a documentation
 * specimen should not be signed out of anything.
 */
export function AccountMenuSpecimen(): React.JSX.Element {
  return (
    <AccountMenu
      account={{ name: "Dr. R. Sharma", role: "State Admin" }}
      items={[
        { label: "My Profile", onSelect: () => {} },
        { label: "Sign Out", onSelect: () => {} },
      ]}
    />
  );
}
