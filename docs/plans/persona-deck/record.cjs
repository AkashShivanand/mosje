/* Records a walkthrough of each service-discovery option as video.
   Real clicks on a real page — nothing is faked or animated for the camera.

   node docs/plans/persona-deck/record.cjs [name] [--base http://localhost:3007]

   Static options are read from the repo's prototypes folder; the assistant and
   the design-system finder are recorded against the running hub. Output goes to
   docs/plans/persona-deck/assets/video/<name>.mp4 with a poster <name>.png. */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../../..');
const PROTO = path.join(ROOT, 'apps/hub/public/prototypes/service-discovery');
const OUT = path.join(__dirname, 'assets/video');
const W = 1440, H = 900;
const argv = process.argv.slice(2);
const only = argv.find(a => !a.startsWith('--'));
const base = (argv.find(a => a.startsWith('--base=')) || '--base=http://localhost:3007').slice(7);

/** Move the pointer visibly, then click — so a viewer can follow the cursor. */
async function tap(p, sel, { nth = 0, pause = 900 } = {}) {
  const el = p.locator(sel).nth(nth);
  await el.waitFor({ state: 'visible', timeout: 15000 });
  await el.scrollIntoViewIfNeeded();
  const box = await el.boundingBox();
  if (box) await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 22 });
  await p.waitForTimeout(260);
  await el.click();
  await p.waitForTimeout(pause);
}
const scroll = async (p, dy, pause = 1500) => { await p.mouse.wheel(0, dy); await p.waitForTimeout(pause); };

const WALKS = {
  'home-a': { url: 'file://' + path.join(PROTO, 'home-a.html'), run: async p => {
    await p.waitForTimeout(1600);
    for (let i = 0; i < 4; i++) await tap(p, '#next', { pause: 1050 });
    await tap(p, '#prev', { pause: 1400 });
    await p.waitForTimeout(1200);
  }},
  'home-b': { url: 'file://' + path.join(PROTO, 'home-b.html'), run: async p => {
    await p.waitForTimeout(1700);
    await tap(p, '.opt-card[data-id="sc"]', { pause: 900 });            // Scheduled Castes
    await tap(p, '#next', { pause: 1200 });
    await tap(p, '.opt-card[data-id="scholarship"]', { pause: 900 });   // Scholarships
    await tap(p, '#next', { pause: 2400 });                             // the schemes
    await scroll(p, 360, 1800);
    await scroll(p, -360, 900);
    await tap(p, '#again', { pause: 1200 });
    await tap(p, '.opt-card[data-id="senior"]', { pause: 900 });        // Senior Citizens
    await tap(p, '#next', { pause: 1200 });
    await tap(p, '#skip', { pause: 2400 });                             // skip — everything for the group
    await p.waitForTimeout(1200);
  }},
  'home-c': { url: 'file://' + path.join(PROTO, 'home-c.html'), run: async p => {
    await p.waitForTimeout(1600);
    await tap(p, '.chip[data-g="sc"]', { pause: 1500 });
    await scroll(p, 420, 1600);
    await scroll(p, -420, 700);
    await tap(p, '.chip[data-g="senior"]', { pause: 1600 });
    await tap(p, '.chip[data-g="tg"]', { pause: 1800 });
    await tap(p, '.chip[data-g="ngo"]', { pause: 2000 });
    await p.waitForTimeout(800);
  }},
  'scheme-a': { url: 'file://' + path.join(PROTO, 'scheme-a.html'), run: async p => {
    await p.waitForTimeout(1600);
    await tap(p, '.face-btn[data-g="safai"]', { pause: 1500 });
    await tap(p, '.face-btn[data-g="tg"]', { pause: 1500 });
    await tap(p, '.face-btn[data-g="senior"]', { pause: 1600 });
    await scroll(p, 300, 1500);
  }},
  'scheme-b': { url: 'file://' + path.join(PROTO, 'scheme-b.html'), run: async p => {
    await p.waitForTimeout(1700);
    await tap(p, '.face-btn[data-g="obc"]', { pause: 1600 });
    await scroll(p, 320, 1400);
    await scroll(p, -320, 600);
    await tap(p, '.face-btn[data-g="ngo"]', { pause: 1600 });
    await tap(p, '#reset', { pause: 1400 });
  }},
  'finder': { url: base + '/explorations/service-discovery/home-page', run: async p => {
    await p.waitForTimeout(2200);
    await tap(p, 'button:has-text("two questions"), [role="tab"]:has-text("two questions"), :text("Find Schemes for You — two questions")', { pause: 1400 });
    const sec = p.locator('.xsf').first();
    await sec.scrollIntoViewIfNeeded();
    await p.waitForTimeout(900);
    await tap(p, '.xsf input[value="student"]', { pause: 1000 });
    await tap(p, '.xsf button:has-text("Continue")', { pause: 1300 });
    await tap(p, '.xsf input[value="scholarship"]', { pause: 1000 });
    await tap(p, '.xsf button:has-text("Show Schemes")', { pause: 2400 });
    await scroll(p, 420, 1800);
  }},
  'assistant': { url: base + '/prototypes/service-discovery/assistant', run: async p => {
    /* The demo rail and the accessibility widget are estate chrome, not the
       page; the recording shows the site as a citizen would see it. */
    await p.addStyleTag({ content: '.ds-demodock,#uw-widget-custom-trigger,[id^="uw-"],.uwy{display:none!important}' });
    await p.waitForTimeout(2000);
    await tap(p, 'button[aria-label="Samajik Sahayak, chat assistant"]', { pause: 1600 });
    const quick = label => p.locator('button', { hasText: label }).last();
    for (const label of ['Which scheme applies to me?', 'Scheduled Castes', 'Loans and Credit']) {
      const b = quick(label);
      await b.waitFor({ state: 'visible', timeout: 15000 });
      const box = await b.boundingBox();
      if (box) await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 20 });
      await p.waitForTimeout(250);
      await b.click();
      await p.waitForTimeout(1900);
    }
    await p.waitForTimeout(2600);
  }},
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, walk] of Object.entries(WALKS)) {
    if (only && only !== name) continue;
    const b = await chromium.launch();
    const dir = path.join(OUT, '_' + name);
    fs.rmSync(dir, { recursive: true, force: true });
    const ctx = await b.newContext({
      viewport: { width: W, height: H },
      recordVideo: { dir, size: { width: W, height: H } },
    });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.goto(walk.url, { waitUntil: 'networkidle' });
    /* The Next dev badge is tooling, not the page. */
    await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' }).catch(() => {});
    let failed = null;
    try { await walk.run(p); } catch (e) { failed = String(e); }
    await p.screenshot({ path: path.join(OUT, name + '.png') });
    await ctx.close(); await b.close();
    const webm = fs.readdirSync(dir).find(f => f.endsWith('.webm'));
    if (webm) {
      execSync(`ffmpeg -v error -y -i "${path.join(dir, webm)}" -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart "${path.join(OUT, name + '.mp4')}"`);
      fs.rmSync(dir, { recursive: true, force: true });
    }
    console.log(name, '· errors:', errs.length ? errs : 'none', failed ? '· FAILED: ' + failed : '');
  }
})();
