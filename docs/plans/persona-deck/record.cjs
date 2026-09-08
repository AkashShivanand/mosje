/* Records a walkthrough of each prototype option as video.
   Real clicks on a real page — nothing is faked or animated for the camera. */
const { chromium } = require('playwright');
const path = require('path');
const PROTO = '/private/tmp/claude-502/-Users-akashk-Documents-Projects-MoSJE/e6a25eff-90f9-4ba8-b636-cbf7abbb150b/scratchpad/proto';
const OUT   = '/private/tmp/claude-502/-Users-akashk-Documents-Projects-MoSJE/e6a25eff-90f9-4ba8-b636-cbf7abbb150b/scratchpad/video';
const W = 1440, H = 900;

/** Move the pointer visibly, then click — so a viewer can follow the cursor. */
async function tap(p, sel, { nth = 0, pause = 900 } = {}) {
  const el = p.locator(sel).nth(nth);
  await el.waitFor({ state: 'visible', timeout: 8000 });
  const box = await el.boundingBox();
  if (box) await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 22 });
  await p.waitForTimeout(260);
  await el.click();
  await p.waitForTimeout(pause);
}

const WALKS = {
  'home-a': async p => {
    await p.waitForTimeout(1600);
    for (let i = 0; i < 4; i++) await tap(p, '#next', { pause: 1050 });
    await tap(p, '#prev', { pause: 1400 });
    await p.waitForTimeout(1200);
  },
  'home-b': async p => {
    await p.waitForTimeout(1700);
    await tap(p, '.opt-card', { nth: 0, pause: 800 });        // Myself
    await tap(p, '#next', { pause: 1000 });
    await tap(p, '.opt-card', { nth: 0, pause: 1100 });       // Scheduled Caste — count falls
    await tap(p, '#next', { pause: 900 });
    await tap(p, '.opt-card', { nth: 1, pause: 1100 });       // In college or beyond
    await tap(p, '#next', { pause: 900 });
    await tap(p, '.opt-card', { nth: 0, pause: 1100 });       // Education and fees
    await tap(p, '#next', { pause: 900 });
    await tap(p, '.opt-card', { nth: 0, pause: 900 });        // Bihar
    await tap(p, '#next', { pause: 2600 });                   // results
    await p.mouse.wheel(0, 340); await p.waitForTimeout(1900);
  },
  'home-c': async p => {
    await p.waitForTimeout(1600);
    await tap(p, '.chip', { nth: 0, pause: 1500 });           // Scheduled Caste
    await tap(p, '.chip', { nth: 4, pause: 1500 });           // Senior citizen
    await tap(p, '.chip', { nth: 8, pause: 2100 });           // Person with disability → DEPwD
    await p.waitForTimeout(1200);
  },
  'scheme-a': async p => {
    await p.waitForTimeout(1600);
    await tap(p, '.face-btn', { nth: 1, pause: 1500 });       // Scheduled Caste
    await tap(p, '.face-btn', { nth: 5, pause: 1500 });       // Senior citizen
    await p.mouse.wheel(0, 300); await p.waitForTimeout(1600);
  },
  'scheme-b': async p => {
    await p.waitForTimeout(1700);
    await tap(p, 'input[data-id="sc"]', { pause: 1300 });     // Scheduled Caste
    await tap(p, 'input[data-id="college"]', { pause: 1300 });// + in college
    await tap(p, 'input[data-id="edu"]', { pause: 1900 });    // + education — filters combine
    await p.mouse.wheel(0, 260); await p.waitForTimeout(1800);
  },
  'chatbot': async p => {
    await p.waitForTimeout(1500);
    await tap(p, '#launch', { pause: 1700 });
    for (const n of [0, 0, 0, 1, 0, 0]) {
      await tap(p, '#quick button', { nth: n, pause: 1500 });
    }
    await p.waitForTimeout(3200);
  },
};

(async () => {
  const only = process.argv[2];
  for (const [name, walk] of Object.entries(WALKS)) {
    if (only && only !== name) continue;
    const b = await chromium.launch();
    const ctx = await b.newContext({
      viewport: { width: W, height: H },
      recordVideo: { dir: path.join(OUT, name), size: { width: W, height: H } },
    });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(PROTO, name + '.html'));
    await walk(p);
    await ctx.close(); await b.close();
    console.log(name, '· errors:', errs.length ? errs : 'none');
  }
})();
