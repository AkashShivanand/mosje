// Screenshot a page of the DBIM clone and put it beside the reference capture.
//
//   node compare.mjs --ref <refDir> --out <outDir> <clonePath> <refStem> [--width 1440|390] [--crop y0:y1]
//
//   clonePath  path inside the DBIM tree, e.g. /ministry/our-team  ("/" = home)
//   refStem    reference shot name, e.g. ministry_our_team  (see <refDir>/shots)
//
// Writes <outDir>/<refStem>@<width>.clone.png and <refStem>@<width>.pair.png
// (reference left, clone right, same width, cropped to --crop if given).
// The clone is read at http://localhost:3018/website-dbim — the worktree's dev server.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const ref = opt("--ref"); const out = opt("--out"); const width = Number(opt("--width", "1440")); const crop = opt("--crop");
const base = opt("--base", "http://localhost:3018/website-dbim");
const [clonePath, refStem] = args;
if (!ref || !out || !clonePath || !refStem) { console.error("usage: compare.mjs --ref DIR --out DIR <clonePath> <refStem> [--width N] [--crop y0:y1]"); process.exit(2); }
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 } });
// Accept nothing: the cookie banner is dismissed the way the reference capture dismissed it.
await ctx.addCookies([{ name: "dbim-cookie-consent", value: "declined", url: "http://localhost:3018" }]);
const p = await ctx.newPage();
await p.goto(base + (clonePath === "/" ? "" : clonePath), { waitUntil: "networkidle", timeout: 120000 });
await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
await p.waitForTimeout(800);
const clonePng = path.join(out, `${refStem}@${width}.clone.png`);
await p.screenshot({ path: clonePng, fullPage: true });
await browser.close();

const refPng = path.join(ref, "shots", `${refStem}@${width}.png`);
const pairPng = path.join(out, `${refStem}@${width}.pair.png`);
execFileSync("python3", ["-c", `
import sys
from PIL import Image, ImageDraw
a=Image.open(sys.argv[1]).convert('RGB'); b=Image.open(sys.argv[2]).convert('RGB'); crop=sys.argv[4]
if crop:
    y0,y1=map(int,crop.split(':')); a=a.crop((0,y0,a.width,min(y1,a.height))); b=b.crop((0,y0,b.width,min(y1,b.height)))
h=max(a.height,b.height); c=Image.new('RGB',(a.width+b.width+20,h+30),'white'); d=ImageDraw.Draw(c)
c.paste(a,(0,30)); c.paste(b,(a.width+20,30)); d.text((6,8),'REFERENCE',fill='red'); d.text((a.width+26,8),'CLONE',fill='red')
c.save(sys.argv[3])
`, refPng, clonePng, pairPng, crop || ""]);
console.log(pairPng);
