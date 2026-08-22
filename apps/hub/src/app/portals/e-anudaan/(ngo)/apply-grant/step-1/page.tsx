import { Alert, Button } from "@mosje/design-system";
import Link from "next/link";

/**
 * `/apply-grant/step-1` with no scheme in the path. The live portal answers
 * "Please choose a scheme first." here, so the clone does too.
 */
export default function ApplyGrantNoSchemePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Alert status="warning" title="Please choose a scheme first.">
        <Link href="/portals/e-anudaan/apply-grant">
          <Button appearance="outlined" size="sm">
            Back to Select Grant Scheme
          </Button>
        </Link>
      </Alert>
    </div>
  );
}
