import Image from "next/image";

import { DBIM_CAMPAIGNS } from "@/lib/website-dbim/assets";
import { DBIM_SCHOLARSHIP_POSTER } from "@/lib/website-dbim/social";
import "./home-bottom.css";

/**
 * The campaign row under the social band (`.centralimg-layout-2-3`): two central
 * Government campaigns — the MyGov DPDP Rules 2025 consultation and the scholarship
 * video — and the Department's Social Audit MIS portal.
 *
 * On the band's four-column grid at ≥1280: the image spans two columns, the video
 * one, the portal tile one. The video streams from the Government's media host and
 * fetches nothing until the reader presses play (the file is ~960 MB). The source
 * publishes no captions, so none can be offered.
 */
export function DbimCampaigns() {
  const { myGovDpdp, scholarshipVideo, socialAudit } = DBIM_CAMPAIGNS;
  return (
    <section className="db-hb-campaigns" aria-label="Campaigns">
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
      <a className="db-hb-campaigns__link db-hb-campaigns__audit" href={socialAudit.href} target="_blank" rel="noopener noreferrer">
        <Image src={socialAudit.src} alt={socialAudit.alt} width={405} height={331} sizes="(min-width: 1280px) 25vw, 100vw" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  );
}
