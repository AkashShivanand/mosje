// Render each section (cover + each screen) as ONE page sized exactly to its content,
// then merge into a single PDF. Dynamic page height = no blank space, no card splits.
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const { PDFDocument } = require("pdf-lib");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = __dirname;

(async () => {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, "report-sections.json"), "utf8"));
  const { css, sections, width, out } = data;
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new", protocolTimeout: 300000,
    args: ["--allow-file-access-from-files", "--no-sandbox", "--disable-gpu"],
  });
  const merged = await PDFDocument.create();
  let failed = [];
  async function renderSection(i) {
    // large image-heavy pages can exceed networkidle0/30s → use 'load' + a generous timeout, retry once
    const tmp = path.join(BASE, `.sec_${i}.html`);
    fs.writeFileSync(tmp,
      `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${sections[i]}</body></html>`);
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(180000); page.setDefaultTimeout(180000);
    await page.setViewport({ width, height: 800, deviceScaleFactor: 2 });
    await page.goto("file://" + tmp, { waitUntil: "load", timeout: 180000 });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await new Promise(r => setTimeout(r, 150));   // let images paint
    const h = await page.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height));
    const bytes = await page.pdf({
      width: width + "px", height: (h + 1) + "px", printBackground: true,
      pageRanges: "1", margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    const src = await PDFDocument.load(bytes);
    const [pg] = await merged.copyPages(src, [0]);
    merged.addPage(pg);
    await page.close();
    fs.unlinkSync(tmp);
  }
  for (let i = 0; i < sections.length; i++) {
    try { await renderSection(i); }
    catch (e) {
      console.error(`section ${i} render failed (${String(e).slice(0,80)}); retrying once…`);
      try { await renderSection(i); }
      catch (e2) { console.error(`section ${i} failed again — skipping`); failed.push(i); }
    }
  }
  await browser.close();
  fs.writeFileSync(out, await merged.save());
  console.log("merged", merged.getPageCount(), "dynamic pages" + (failed.length ? ` (skipped ${failed.length}: ${failed})` : ""));
  if (failed.length) process.exit(2);
})().catch(e => { console.error(e); process.exit(1); });
