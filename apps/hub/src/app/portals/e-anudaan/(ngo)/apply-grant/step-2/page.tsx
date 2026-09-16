import { ChooseSchemeFirst } from "@/components/e-anudaan/choose-scheme-first";

/**
 * An application route with no scheme in the path. The live portal answers "Please choose a
 * scheme first." here, so the clone does too.
 */
export default function ApplyGrantNoSchemePage() {
  return <ChooseSchemeFirst />;
}
