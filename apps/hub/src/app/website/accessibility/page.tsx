import { permanentRedirect } from "next/navigation";

/**
 * The accessibility statement's canonical address is /website/accessibility-statement
 * (issue MAN-01: the address GIGW auditors and the classic footer look for). This
 * older address answers with a permanent redirect so links to it keep working and
 * search engines move to the canonical one. Done here rather than in next.config,
 * which every engineer on the redesign shares.
 */
export default function Page(): never {
  permanentRedirect("/website/accessibility-statement");
}
