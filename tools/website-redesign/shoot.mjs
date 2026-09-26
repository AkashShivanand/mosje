import { chromium } from "playwright";
const [,, outDir, ...paths] = process.argv;
const base = process.env.BASE ?? "http://localhost:3007";
const cookie = process.env.DESIGN;
const browser = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, "d"], [375, 812, "m"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  if (cookie) await ctx.addCookies([{ name: "sa-website-design", value: cookie, url: base }]);
  const page = await ctx.newPage();
  for (const p of paths) {
    try {
      await page.goto(base + p, { waitUntil: "networkidle", timeout: 90000 });
      // Walk the page so lazy images load before the full-page capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);
      const name = (p.replace(/^\/website\/?/, "") || "home").replace(/\//g, "_");
      await page.screenshot({ path: `${outDir}/${name}-${tag}.png`, fullPage: true });
      console.log("ok", tag, p);
    } catch (e) { console.log("fail", tag, p, e.message.slice(0, 120)); }
  }
  await ctx.close();
}
await browser.close();
