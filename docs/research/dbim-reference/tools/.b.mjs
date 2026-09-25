import { chromium } from "playwright";
const [path, sels, width = "1440"] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +width, height: 900 } })).newPage();
await p.goto("http://localhost:3018/website-dbim" + path, { waitUntil: "networkidle" });
for (const s of sels.split("|")) {
  const r = await p.$$eval(s, (els) => els.slice(0, 3).map((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `[${Math.round(r.x)},${Math.round(r.y + scrollY)},${Math.round(r.width)},${Math.round(r.height)}] fs=${cs.fontSize} lh=${cs.lineHeight} fw=${cs.fontWeight} mt=${cs.marginTop} mb=${cs.marginBottom} pt=${cs.paddingTop}`; }));
  console.log(s, "→", r.join("  ") || "none");
}
await b.close();
