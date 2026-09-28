import Image from "next/image";

import { DBIM_CAMPAIGNS } from "@/lib/website-dbim/assets";
import { DBIM_SCHOLARSHIP_POSTER } from "@/lib/website-dbim/social";
import { INFOGRAPHICS } from "@/lib/website/infographics";
import { DbimInfographicTile } from "./InfographicTile";
import "./home-bottom.css";

/**
 * The posts row under the social band (`.centralimg-layout-2-3`): two CCPS central
 * posts — the MyGov DPDP Rules 2025 consultation and the scholarship video — then the
 * Department's infographic (DBIM 3.0 §7.3 xii and xiii, Figures 62–63).
 *
 * The third slot held the Social Audit MIS portal poster until 28 Sep 2026; that
 * portal is now an Important Link (lib/website-dbim/utility.ts). Any other design that
 * takes the infographics takes them in this same row (lib/website/infographics.ts).
 *
 * On the band's four-column grid at ≥1280: the image spans two columns, the video
 * one, the infographic one. The video streams from the Government's media host and
 * fetches nothing until the reader presses play (the file is ~960 MB). The source
 * publishes no captions, so none can be offered.
 */
export function DbimCampaigns() {
  const { myGovDpdp, scholarshipVideo } = DBIM_CAMPAIGNS;
  const infographic = INFOGRAPHICS[0];
  return (
    <section className="db-hb-campaigns" aria-label="Central Posts and Infographics">
      <div className="db-hb-campaigns__pair">
        <a className="db-hb-campaigns__link" href={myGovDpdp.href} target="_blank" rel="noopener noreferrer">
          <Image
            className="db-hb-campaigns__dpdp"
            src={myGovDpdp.src}
            alt={myGovDpdp.alt}
            width={640}
            height={245}
            sizes="(min-width: 1280px) 50vw, 100vw"
          />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <div className="db-hb-campaigns__video">
          <video
            controls
            preload="none"
            poster={DBIM_SCHOLARSHIP_POSTER}
            title={scholarshipVideo.title}
            aria-label={scholarshipVideo.title}
          >
            <source src={scholarshipVideo.src} type="video/mp4" />
          </video>
        </div>
      </div>
      {infographic ? <DbimInfographicTile infographic={infographic} /> : null}
    </section>
  );
}
