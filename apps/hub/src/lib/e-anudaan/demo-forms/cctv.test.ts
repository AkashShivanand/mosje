/**
 * The CCTV module's fills against the module's own validation: the correct fill passes, and each
 * rule preset trips exactly one rule — one message — and no two presets trip the same one.
 *
 * Run: node --test src/lib/e-anudaan/demo-forms/cctv.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { certificateFileProblem, validateCamera, validateRecords, validateUptime, type UptimeErrors } from "../cctv.ts";
import { CCTV_CAMERA, CCTV_CERTIFICATE, CCTV_RECORDS, CCTV_UPTIME, cameraValuesOf, certificateFileOf, recordsValuesOf, uptimeValuesOf } from "./cctv.ts";
import type { DemoFormDef } from "./index.ts";

const now = new Date(2026, 8, 17, 12);

/** Every rule a result reports, as `field: message` — two fields can share one sentence. */
function messages(errors: UptimeErrors | Partial<Record<string, string>>): string[] {
  const { outageErrors, ...rest } = errors as UptimeErrors;
  const flat = Object.entries(rest).filter((e): e is [string, string] => typeof e[1] === "string").map(([k, m]) => `${k}: ${m}`);
  const outage = Object.values(outageErrors ?? {}).flatMap((o) =>
    Object.entries(o).filter((e): e is [string, string] => !!e[1]).map(([k, m]) => `outage ${k}: ${m}`),
  );
  return [...flat, ...outage];
}

function check(form: DemoFormDef, run: (values: Readonly<Record<string, string>>) => string[]) {
  const seen = new Map<string, string>();
  for (const preset of form.presets) {
    const out = run(preset.values);
    if (preset.valid) {
      assert.deepEqual(out, [], `${form.id} · the correct fill trips ${out.join(" | ")}`);
      continue;
    }
    assert.equal(out.length, 1, `${form.id} · ${preset.id} should trip one rule, trips ${out.length}: ${out.join(" | ")}`);
    const rule = out[0]!;
    assert.ok(!seen.has(rule), `${form.id} · ${preset.id} trips the same rule as ${seen.get(rule)}`);
    seen.set(rule, preset.id);
  }
}

test("camera: the correct fill passes and each preset trips its own rule", () => {
  check(CCTV_CAMERA, (v) => {
    const res = validateCamera(cameraValuesOf(v, now), "c1", now);
    return res.ok ? [] : messages(res.errors);
  });
});

test("installation certificate: the correct file passes and each preset is refused for its own reason", () => {
  check(CCTV_CERTIFICATE, (v) => {
    const problem = certificateFileProblem(certificateFileOf(v));
    return problem ? [problem.replace(/^\S+ /, "")] : [];
  });
});

test("retention and storage: the correct fill passes and each preset trips its own rule", () => {
  check(CCTV_RECORDS, (v) => {
    const res = validateRecords(recordsValuesOf(v));
    return res.ok ? [] : messages(res.errors);
  });
});

test("uptime declaration: the correct fill passes and each preset trips its own rule", () => {
  check(CCTV_UPTIME, (v) => {
    const res = validateUptime(uptimeValuesOf(v, now), now);
    return res.ok ? [] : messages(res.errors);
  });
});

test("an outage's days fall in the declared month, or either side of it when a preset says so", () => {
  const v = uptimeValuesOf({ month: "last", outage: "yes", from: "before:28", to: "after:2", reason: "x" }, now);
  assert.equal(v.month, "2026-08");
  assert.deepEqual([v.outages[0]!.from, v.outages[0]!.to], ["2026-07-28", "2026-09-02"]);
});
