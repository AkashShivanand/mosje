"use client";

import * as React from "react";
import { Button } from "@mosje/design-system";

/**
 * A CLIENT COMPONENT, AND THAT IS THE POINT OF THE FILE.
 *
 * `preserveFocus` takes the native `disabled` attribute off and takes its three jobs
 * back by hand, two of which are event handlers. A Server Component cannot attach
 * those, so rendering this specimen inline on the (server) docs page threw
 * "Event handlers cannot be passed to Client Component props" — and took the whole
 * page down with it, tabs and all, which is how it was found.
 *
 * That constraint is real and belongs to the prop, not to this page: any control using
 * `preserveFocus` has to live in a client component. It is documented on the page and
 * in the prop's own docstring.
 */
export function PreserveFocusDemo(): React.JSX.Element {
  return (
    <p>
      <Button variant="primary" disabled data-testid="btn-hard-disabled">
        Disabled &mdash; out of the tab order
      </Button>{" "}
      <Button variant="primary" disabled preserveFocus data-testid="btn-soft-disabled">
        Disabled &mdash; still findable
      </Button>
    </p>
  );
}
