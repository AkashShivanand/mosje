import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { parseShadow, ELEVATION } from "../build/shadow.mjs";

/**
 * Elevation is the one part of the system with NO variable to check.
 *
 * A shadow is a composite, Figma variables hold only COLOR/FLOAT/STRING/BOOLEAN, so `shadow.*`
 * and `elevation.*` reach Figma as effect STYLES. Everything that makes the variable layer
 * trustworthy — the payload, the checksums, the round-trip test — sees none of it. Without this
 * file, a shadow could be changed in `primitive.json` and the Figma styles would keep the old
 * geometry indefinitely, exactly as the six pre-existing `Shadows/shadow-*` styles already had:
 * not one of them matched the token source, and nothing noticed for as long as they existed.
 *
 * So the record in `reference/figma-live.json` under `$effectStyles.generated` is a transcript
 * of a VERIFIED read of the library, and this asserts the token source still produces it.
 */

const root = new URL("..", import.meta.url).pathname;
const primitive = JSON.parse(readFileSync(root + "src/primitive.json", "utf8"));
const semantic = JSON.parse(readFileSync(root + "src/semantic.json", "utf8"));
const live = JSON.parse(readFileSync(root + "reference/figma-live.json", "utf8"));

/** The same formatting the recorder uses — one implementation, so a format change cannot alias a value change. */
const fmt = (e) =>
  `${e.type === "INNER_SHADOW" ? "inset " : ""}${e.offset.x}/${e.offset.y}/${e.radius}/${e.spread} rgba(${
    [e.color.r, e.color.g, e.color.b].map((v) => Math.round(v * 255)).join(",")},${+e.color.a.toFixed(4)})`;

test("the ELEVATION map and the token source name the same steps", () => {
  // build/shadow.mjs carries its own list so the sync script does not have to parse DTCG.
  // That is a second copy of a mapping, which is exactly how the codeSyntax drift started —
  // so it is asserted against the source rather than trusted.
  const fromSource = Object.entries(semantic.elevation)
    .filter(([k]) => !k.startsWith("$"))
    .map(([name, v]) => [name, String(v.$value).replace(/^\{shadow\.|\}$/g, "")]);
  const fromMap = ELEVATION.map(([name, step]) => [name, step]);
  assert.deepEqual(
    fromMap,
    fromSource,
    "build/shadow.mjs ELEVATION disagrees with elevation.* in src/semantic.json — they must " +
      "name the same elevations, in the same order, pointing at the same shadow steps",
  );
});

test("every shadow step the elevations point at exists", () => {
  const missing = ELEVATION.filter(([, step]) => primitive.shadow[step] === undefined);
  assert.deepEqual(missing.map(([n, s]) => `${n} -> shadow.${s}`), []);
});

test("the Figma effect styles still match what the token source produces", () => {
  const recorded = live.$effectStyles?.generated;
  assert.ok(recorded, "reference/figma-live.json has no $effectStyles.generated — re-record it");

  const drift = [];
  for (const [name, step] of ELEVATION) {
    const key = "elevation/" + name;
    const want = parseShadow(primitive.shadow[step].$value).map(fmt);
    const have = recorded[key];
    if (!have) { drift.push(`${key} — in the token source but not recorded in the library`); continue; }
    if (JSON.stringify(have) !== JSON.stringify(want)) {
      drift.push(`${key}\n      library: ${have.join("  +  ") || "(none)"}\n      tokens : ${want.join("  +  ") || "(none)"}`);
    }
  }
  for (const key of Object.keys(recorded)) {
    if (!ELEVATION.some(([n]) => "elevation/" + n === key)) {
      drift.push(`${key} — recorded in the library but no longer in the token source`);
    }
  }

  assert.deepEqual(
    drift,
    [],
    `${drift.length} elevation style(s) have drifted from the tokens:\n    ${drift.join("\n    ")}\n\n` +
      `A shadow changed in src/primitive.json but the Figma effect styles were not re-pushed. ` +
      `Push them, re-read the library, and re-record $effectStyles.generated — do NOT edit the ` +
      `record to match the source, which would assert a state the library is not in.`,
  );
});

test("the pre-existing Shadows/* divergence stays recorded until it is resolved", () => {
  // Six effect styles predate the sync and none matches the token source. They are deliberately
  // NOT corrected (published library, unknowable consumers), so the only thing keeping them from
  // being forgotten is this record — and a record nothing checks is how they got lost the first time.
  const pre = live.$effectStyles?.preExisting;
  assert.ok(pre, "the pre-existing Shadows/* divergence is no longer recorded");
  for (const name of ["Shadows/shadow-xs", "Shadows/shadow-s", "Shadows/shadow-md",
                      "Shadows/shadow-lg", "Shadows/shadow-xl", "Shadows/shadow-2xl"]) {
    assert.ok(pre[name], `${name} dropped out of the divergence record without being resolved`);
  }
});

test("the focus styles stay recorded, with their geometry caveat", () => {
  // These are NOT generated from tokens — they are authored in Figma with their colours BOUND to
  // `color/transparent/<family>/48`, which is why they cannot rot into literals the way the
  // Shadows/* did. So there is nothing to regenerate and compare; what there IS to protect is the
  // written reason they look different from the build.
  //
  // Each is a single flush 4px spread, while the build renders a 2px ring held 2px off the control.
  // That is a LIMITATION (a drop shadow cannot leave a transparent gap without painting the
  // backdrop), and the next person to notice it will otherwise "fix" it into a two-layer style
  // that is correct on the default surface and wrong on every other.
  const focus = live.$effectStyles?.focus;
  assert.ok(focus, "the Focus States/* record is gone from reference/figma-live.json");
  assert.match(
    focus.geometryDivergence ?? "",
    /transparent gap/,
    "the focus geometry caveat has lost the reason the gap is absent — without it the divergence " +
      "reads as a bug and someone will 'correct' it",
  );
  for (const family of ["primary", "secondary", "success", "danger", "warning", "neutral"]) {
    const key = `Focus States/${family[0].toUpperCase()}${family.slice(1)} - Active Shadow`;
    assert.ok(focus.styles?.[key], `${key} dropped out of the focus record`);
    assert.match(
      focus.styles[key],
      new RegExp(`color/transparent/${family}/48`),
      `${key} no longer records which variable its colour is bound to`,
    );
  }
});

test("parseShadow handles the shapes this ramp actually uses", () => {
  assert.deepEqual(parseShadow("none"), [], "`none` is an empty effect list, not a failure");
  assert.deepEqual(parseShadow(""), []);

  const one = parseShadow("0 2px 3px 1px rgba(31, 36, 40, 0.12)");
  assert.equal(one.length, 1);
  assert.deepEqual(one[0].offset, { x: 0, y: 2 });
  assert.equal(one[0].radius, 3);
  assert.equal(one[0].spread, 1);
  assert.equal(Math.round(one[0].color.r * 255), 31);
  assert.equal(one[0].color.a, 0.12);

  // Two layers, and NEGATIVE spread — both are in the real ramp, and a comma-split that did not
  // respect the brackets in rgba() would tear a colour in half instead.
  const two = parseShadow("0 4px 6px -1px rgba(31, 36, 40, 0.10), 0 2px 4px -2px rgba(31, 36, 40, 0.06)");
  assert.equal(two.length, 2);
  assert.equal(two[0].spread, -1);
  assert.equal(two[1].spread, -2);
  assert.equal(two[1].radius, 4);

  // Spread is optional in CSS and defaults to 0.
  assert.equal(parseShadow("0 4px 4px rgba(0,0,0,0.5)")[0].spread, 0);

  assert.throws(() => parseShadow("0 2px 3px"), /no colour/, "a layer with no colour is a bug, not a default");
});
