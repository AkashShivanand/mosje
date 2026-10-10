import Image from "next/image";

import { DBIM_CAMPAIGNS } from "@/lib/website-dbim/assets";
import { INFOGRAPHICS } from "@/lib/website/infographics";
import { DbimInfographicTile } from "./InfographicTile";
import "./home-bottom.css";

/**
 * The posts row under the social band (`.centralimg-layout-2-3`): two CCPS central
 * posts — MyGov's Make in India post and its BRICS India 2026 video, as dosje.gov.in
 * carries them on 8 Oct 2026 — then the Department's infographic, drawn from the
 * Beneficiary Dashboard and opening it (DBIM 3.0 §7.3 xii and xiii, Figures 62–63).
 *
 * The third slot held the Social Audit MIS portal poster until 28 Sep 2026; that
 * portal is now an Important Link (lib/website-dbim/utility.ts). Any other design that
 * takes the infographics takes them in this same row (lib/website/infographics.ts).
 *
 * On the band's four-column grid at ≥1280: the image spans two columns, the video
 * one, the infographic one. The live post is not a link, so neither is this one. The
 * video streams from the Government's media host and fetches nothing until the reader
 * presses play (the file is ~255 MB). The source publishes no captions, so none can be
 * offered.
 */
export function DbimCampaigns() {
  const { centralPost, video } = DBIM_CAMPAIGNS;
  const infographic = INFOGRAPHICS[0];
  return (
    <section className="db-hb-campaigns" aria-label="Central Posts and Infographics">
      <div className="db-hb-campaigns__pair">
        <Image
          className="db-hb-campaigns__post"
          src={centralPost.src}
          alt={centralPost.alt}
          width={centralPost.width}
          height={centralPost.height}
          sizes="(min-width: 1280px) 50vw, 100vw"
        />
        <div className="db-hb-campaigns__video">
          <video
            controls
            preload="none"
            poster={video.poster}
            title={video.title}
            aria-label={video.title}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
      </div>
      {infographic ? <DbimInfographicTile infographic={infographic} /> : null}
    </section>
  );
}
