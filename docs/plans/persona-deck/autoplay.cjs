/**
 * pptxgenjs writes the media part and its relationships correctly but emits no
 * <p:timing>, so a video sits on the slide click-to-play. This adds the timing
 * tree PowerPoint uses for "Start: Automatically" — one media call per slide,
 * triggered at delay 0 on the main sequence, targeting that slide's video shape.
 *
 * Run after build.cjs. Idempotent: a slide that already has <p:timing> is left alone.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PPTX = process.argv[2] || "MoSJE-Service-Discovery-Options.pptx";
const WORK = ".autoplay-unpack";

function durationMs(mediaFile) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${mediaFile}"`
  ).toString().trim();
  return Math.round(parseFloat(out) * 1000);
}

/** The timing tree for one media object, started automatically with the slide. */
function timingXml(spid, durMs) {
  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>` +
    `<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>` +
    `<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>` +
    `<p:par><p:cTn id="5" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" display="0" nodeType="afterEffect">` +
    `<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>` +
    `<p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="6" dur="${durMs}" fill="hold"/>` +
    `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:cmd>` +
    `</p:childTnLst></p:cTn></p:par>` +
    `</p:childTnLst></p:cTn></p:par>` +
    `</p:childTnLst></p:cTn></p:par>` +
    `</p:childTnLst></p:cTn></p:seq>` +
    `</p:childTnLst></p:cTn></p:par></p:tnLst>` +
    `<p:bldLst/></p:timing>`;
}

execSync(`rm -rf ${WORK} && mkdir -p ${WORK}`);
execSync(`cd ${WORK} && unzip -q ../"${PPTX}"`);

const slideDir = path.join(WORK, "ppt/slides");
let touched = 0;
for (const f of fs.readdirSync(slideDir).filter(n => /^slide\d+\.xml$/.test(n))) {
  const p = path.join(slideDir, f);
  let xml = fs.readFileSync(p, "utf8");
  if (!xml.includes("<a:videoFile")) continue;
  if (xml.includes("<p:timing>")) { console.log(f, "already has timing — left alone"); continue; }

  // the <p:pic> that carries the video, and its shape id
  const pic = xml.match(/<p:pic>(?:(?!<\/p:pic>)[\s\S])*?<a:videoFile[\s\S]*?<\/p:pic>/);
  if (!pic) { console.warn(f, "video present but no <p:pic> — skipped"); continue; }
  const spid = pic[0].match(/<p:cNvPr id="(\d+)"/)?.[1];
  if (!spid) { console.warn(f, "no shape id — skipped"); continue; }

  // duration from the media part this slide actually points at
  const num = f.match(/\d+/)[0];
  const rels = fs.readFileSync(path.join(slideDir, `_rels/slide${num}.xml.rels`), "utf8");
  const rid = xml.match(/<a:videoFile r:link="(rId\d+)"/)[1];
  const target = rels.match(new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"`))[1];
  const media = path.join(WORK, "ppt", target.replace(/^\.\.\//, ""));

  xml = xml.replace("</p:sld>", timingXml(spid, durationMs(media)) + "</p:sld>");
  fs.writeFileSync(p, xml);
  console.log(`${f}  spid=${spid}  ${durationMs(media)}ms  → autoplay`);
  touched++;
}

execSync(`cd ${WORK} && rm -f ../"${PPTX}" && zip -Xqr ../"${PPTX}" .`);
execSync(`rm -rf ${WORK}`);
console.log(`\n${touched} slides set to play automatically.`);
