import { permanentRedirect } from "next/navigation";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DBIM_REGISTERS, registerPath } from "@/lib/website-dbim/division-registers";

type Props = { params: Promise<{ rest?: string[] }> };

/**
 * Ministry › Our Division was removed on 9 Oct 2026: neither socialjustice.gov.in nor
 * dosje.gov.in has the section, and both carry the divisions as Important Links groups.
 * Its addresses stay answerable — a register keeps its page under Important Links, and
 * everything else opens Important Links, where the division now is.
 */
export default async function DbimOurDivisionRedirect({ params }: Props) {
  const [, register] = (await params).rest ?? [];
  const r = register ? DBIM_REGISTERS.find((x) => x.slug === register) : undefined;
  permanentRedirect(dbimHref(r ? registerPath(r) : "/important-links"));
}
