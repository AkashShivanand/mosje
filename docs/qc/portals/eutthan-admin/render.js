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
    executablePath: CHROME, headless: "new",
    args: ["--allow-file-access-from-files", "--no-sandbox", "--disable-gpu"],
  });
  const merged = await PDFDocument.create();
  for (let i = 0; i < sections.length; i++) {
    const tmp = path.join(BASE, `.sec_${i}.html`);
    fs.writeFileSync(tmp,
      `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${sections[i]}</body></html>`);
    const page = await browser.newPage();
    await page.setViewport({ width, height: 800, deviceScaleFactor: 2 });
    await page.goto("file://" + tmp, { waitUntil: "networkidle0" });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
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
  await browser.close();
  fs.writeFileSync(out, await merged.save());
  console.log("merged", merged.getPageCount(), "dynamic pages");
})().catch(e => { console.error(e); process.exit(1); });
