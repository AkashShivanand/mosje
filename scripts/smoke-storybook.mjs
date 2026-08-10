#!/usr/bin/env node
/**
 * Storybook smoke test — every story must actually render.
 *
 * The coverage gate (`check-storybook-coverage.mjs`) only asks whether a story
 * FILE exists. That is the weaker half of the promise: a story that satisfies
 * the counter but throws in the canvas is worse than no story at all, because
 * the gate then reports green while the documentation is blank.
 *
 * So this mounts every story in a real browser and fails on any of:
 *
 *   - an uncaught exception during render (React error, undefined prop, …)
 *   - a console error (React key/prop warnings escalate here deliberately —
 *     they are nearly always a story passing the wrong shape)
 *   - an EMPTY canvas: a story whose root has no rendered element and no text.
 *     This is the failure the build cannot see — `render: () => undefined`
 *     compiles perfectly and documents nothing.
 *
 * It deliberately does NOT use @storybook/test-runner: that pulls in Jest, a
 * second test runner and its own Playwright pin, for a job that is one page
 * visit per story. Playwright is already a root devDependency (`test:e2e`), so
 * this adds nothing to the install.
 *
 *   node scripts/smoke-storybook.mjs                 # builds if needed, then runs
 *   node scripts/smoke-storybook.mjs --skip-build    # reuse storybook-static
 *   node scripts/smoke-storybook.mjs --only=components-alert
 */

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const STATIC_DIR = path.join(ROOT, "apps/storybook/storybook-static");
const SKIP_BUILD = process.argv.includes("--skip-build");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice("--only=".length);

/**
 * Console noise that is not a defect in the story. Keep this list short and
 * justified — every entry is a class of error this gate can no longer catch.
 */
const IGNORED_CONSOLE = [
  // Storybook's own telemetry/analytics are disabled but still probe.
  /storybook.*telemetry/i,
  // Geolocation is denied by default in headless Chromium; GeoPhotoInput asks
  // for it on purpose and handles the refusal — that path is the story.
  /geolocation/i,
  // Fonts are loaded by the hub, not by the static Storybook bundle.
  /failed to (load|decode) .*font/i,
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function serve(dir) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let file = path.join(dir, decodeURIComponent(url.pathname));
    if (url.pathname === "/" || url.pathname.endsWith("/")) file = path.join(file, "index.html");
    if (!file.startsWith(dir) || !existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

if (!SKIP_BUILD || !existsSync(path.join(STATIC_DIR, "index.json"))) {
  console.log("• building Storybook…");
  execFileSync("npm", ["run", "build", "--prefix", "apps/storybook"], {
    stdio: "inherit",
    cwd: ROOT,
  });
}

const index = JSON.parse(readFileSync(path.join(STATIC_DIR, "index.json"), "utf8"));
let stories = Object.values(index.entries).filter((e) => e.type === "story");
if (ONLY) stories = stories.filter((s) => s.id.includes(ONLY));

if (stories.length === 0) {
  console.error("\n✖ storybook smoke: no stories found to run.\n");
  process.exit(1);
}

const { server, port } = await serve(STATIC_DIR);
const browser = await chromium.launch();
const failures = [];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  for (const story of stories) {
    const problems = [];
    const onError = (err) => problems.push(`threw: ${err.message.split("\n")[0]}`);
    const onConsole = (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
      problems.push(`console.error: ${text.split("\n")[0].slice(0, 200)}`);
    };

    page.on("pageerror", onError);
    page.on("console", onConsole);

    try {
      await page.goto(
        `http://127.0.0.1:${port}/iframe.html?viewMode=story&id=${encodeURIComponent(story.id)}`,
        { waitUntil: "load", timeout: 30_000 },
      );
      // Storybook signals a finished render on the document body.
      await page
        .waitForFunction(() => document.body.classList.contains("sb-show-main"), null, {
          timeout: 20_000,
        })
        .catch(() => problems.push("never finished rendering (no sb-show-main)"));

      // Storybook's own error screens.
      if (await page.locator("#error-message").count()) {
        const msg = (await page.locator("#error-message").innerText()).trim();
        if (msg) problems.push(`storybook error: ${msg.split("\n")[0]}`);
      }
      if (await page.locator(".sb-nopreview").isVisible().catch(() => false)) {
        problems.push("no preview rendered");
      }

      // The empty-canvas check: something must actually be on screen.
      //
      // "On screen" is not "inside #storybook-root". Modal, SideSheet, Lightbox
      // and Tooltip render through a portal attached to <body>, which leaves the
      // root legitimately empty — so count the portalled subtrees too, or this
      // check would fail exactly the components most worth smoke-testing.
      const canvas = await page.evaluate(() => {
        const roots = [];
        const root = document.querySelector("#storybook-root");
        if (root) roots.push(root);
        for (const child of document.body.children) {
          if (child === root) continue;
          if (child.id === "storybook-docs") continue;
          if (["SCRIPT", "STYLE", "LINK", "TEMPLATE"].includes(child.tagName)) continue;
          // Storybook's own chrome — the error display, the "no preview" panel
          // and the loader — is always in the markup, hidden. Counting it would
          // make every empty canvas look populated, which is the one thing this
          // check exists to catch.
          if ([...child.classList].some((c) => c.startsWith("sb-"))) continue;
          roots.push(child);
        }
        return roots.reduce(
          (acc, el) => ({
            elements: acc.elements + el.querySelectorAll("*").length,
            text: acc.text + (el.innerText ?? "").trim().length,
          }),
          { elements: 0, text: 0 },
        );
      });
      // The preview decorator alone contributes one wrapper element, so a story
      // that rendered nothing still shows 1. Require more than the wrapper.
      if (canvas.elements <= 1 && canvas.text === 0) {
        problems.push("rendered an empty canvas");
      }
    } catch (err) {
      problems.push(`navigation failed: ${err.message.split("\n")[0]}`);
    } finally {
      page.off("pageerror", onError);
      page.off("console", onConsole);
    }

    if (problems.length) {
      failures.push({ id: story.id, title: story.title, name: story.name, problems });
      process.stdout.write("✖");
    } else {
      process.stdout.write("·");
    }
  }
  process.stdout.write("\n");
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\n✖ storybook smoke: ${failures.length} of ${stories.length} stories failed to render:\n`);
  for (const f of failures) {
    console.error(`    ${f.title} › ${f.name}  (${f.id})`);
    for (const p of f.problems) console.error(`      · ${p}`);
  }
  console.error(
    "\n  A story that satisfies the coverage counter but throws in the canvas is\n" +
      "  worse than no story: the gate reports green while the docs are blank.\n",
  );
  process.exit(1);
}

console.log(`✔ storybook smoke: all ${stories.length} stories rendered.`);
