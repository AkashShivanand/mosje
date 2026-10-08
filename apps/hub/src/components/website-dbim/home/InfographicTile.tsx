import Image from "next/image";
import Link from "next/link";

import { infographicText, type Infographic } from "@/lib/website/infographics";
import { dbimHref } from "@/lib/website-dbim/nav";

/**
 * The Infographics slot of the home page's posts row (DBIM 3.0 §7.3 xiii), beside
 * the two central posts.
 *
 * DS Audit: next/image ✅ · next/link ✅ — no DS component: a plain picture link.
 *
 * The slot is a quarter of the row and about 300px square, so the tile shows the
 * whole picture, uncropped, and opens the Beneficiary Dashboard the picture is drawn
 * from — as dosje.gov.in's own tile does (read 8 Oct 2026). Until then it opened the
 * image full size in a Lightbox; the dashboard is the full-size version, with every
 * figure as text. The picture's alt text is generated from the same list it was drawn
 * from, so a screen reader hears every number the picture shows.
 */
export function DbimInfographicTile({ infographic }: { infographic: Infographic }) {
  return (
    <Link href={dbimHref("/dashboard")} className="db-hb-campaigns__infographic">
      <Image
        src={infographic.src}
        alt={infographicText(infographic)}
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 992px) 33vw, 100vw"
      />
      <span className="sr-only"> Open the {infographic.source.label}</span>
    </Link>
  );
}
