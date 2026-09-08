/* Records the assistant walkthrough from the hub route that runs the design
   system's own Chatbot — not a standalone imitation of it. Real clicks, real
   component, nothing animated for the camera. */
const { chromium } = require('playwright');
const path = require('path');
const OUT = '/private/tmp/claude-502/-Users-akashk-Documents-Projects-MoSJE/e6a25eff-90f9-4ba8-b636-cbf7abbb150b/scratchpad/video';
const URL = 'http://localhost:3021/reports/service-discovery/assistant';

async function tap(p, label, pause = 1500) {
  const el = p.locator(`.ds-chatbot button:has-text("${label}")`).first();
  await el.waitFor({ state: 'visible', timeout: 12000 });
  const box = await el.boundingBox();
  if (box) await p.mouse.move(box.x + box.width/2, box.y + box.height/2, { steps: 20 });
  await p.waitForTimeout(240);
  await el.click();
  await p.waitForTimeout(pause);
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: path.join(OUT, 'assistant'), size: { width: 1440, height: 900 } },
  });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(URL, { waitUntil: 'networkidle' });
  // the demo dock is scaffolding for our own sessions, not part of the option
  /* Out of frame for this recording: demo scaffolding and the dev-server badge
     are ours rather than the option's, and the UX4G accessibility widget is
     third-party chrome that sits on every page of the estate — it is not part
     of what the assistant is being judged on. It stays on the real pages. */
  await p.addStyleTag({ content: [
    '.ds-demodock', 'nextjs-portal', '[data-nextjs-toast]',
    '#uw-widget-custom-trigger', '[class*="ux4g-accessibility"]', '[id^="uw-"]',
  ].join(',') + '{display:none !important}' });
  await p.waitForTimeout(1400);

  const launcher = p.locator('.ds-chatbot__launcher');
  const lb = await launcher.boundingBox();
  if (lb) await p.mouse.move(lb.x + lb.width/2, lb.y + lb.height/2, { steps: 24 });
  await p.waitForTimeout(300);
  await launcher.click();
  await p.waitForTimeout(2200);

  await tap(p, 'Which scheme applies to me?', 2600);
  await tap(p, 'Myself', 2200);
  await tap(p, 'Scheduled Caste', 2200);
  await tap(p, 'In college or beyond', 2200);
  await tap(p, 'Education and fees', 2200);
  await tap(p, 'Bihar', 3400);
  await p.waitForTimeout(2200);

  await ctx.close(); await b.close();
  console.log('assistant · errors:', errs.length ? errs : 'none');
})();
