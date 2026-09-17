/**
 * Every sample the demo dock can place, placed into every document slot of every scheme, does what
 * its label says: the correct document looks right, and each failure is the one it is named for —
 * judged by the same code an applicant's own file meets.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { deviceCheckOfBytes } from "./doc-checks.ts";
import { REFUSAL_OF, acceptFromNote, rejectionOf, simulateCheck } from "./document-centre.ts";
import { yearCheckedVerdict } from "./doc-verification.ts";
import { buildScenario } from "./demo-scenarios.ts";
import { visibleDocuments, WIZARDS } from "./form-schema.ts";
import { SAMPLE_FILES } from "./sample-files.generated.ts";
import { everyCheckAtOnce, sampleChoices, subjectForTitle, SAMPLE_BASE } from "./sample-files.ts";

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "../../../public");
const FY = "2026-27";
const FACTS = { organisationName: "Sankalp Seva Sansthan", registrationNumber: "MH/PUN/1860/51-54", financialYear: FY, ifsc: "SBIN0000001", accountNumber: "123456789012" };
const RULE = acceptFromNote("PDF / JPG / PNG · Max 5 MB per file");
const STATE_OF = { passes: "verified", invalid: "invalid", review: "review", unavailable: "unavailable" } as const;

test("every file in the manifest is on disk", () => {
  for (const f of SAMPLE_FILES) {
    const path = join(PUBLIC, SAMPLE_BASE, f.file);
    assert.ok(existsSync(path), `${f.file} is missing`);
  }
});

test("every document on every scheme's checklist has a sample of its own type", () => {
  for (const def of Object.values(WIZARDS)) {
    const { values } = buildScenario("complete", def);
    for (const d of visibleDocuments(def, values)) {
      assert.ok(subjectForTitle(d.title), `${def.code} · "${d.title}" has no sample`);
    }
  }
});

test("each sample, in each slot, gives the result its label promises", () => {
  let pairs = 0;
  const wrong: string[] = [];
  const expect = (ok: boolean, message: string) => { if (!ok) wrong.push(message); };
  for (const def of Object.values(WIZARDS)) {
    const { values } = buildScenario("complete", def);
    const checklist = visibleDocuments(def, values);
    for (const slot of checklist) {
      for (const choice of sampleChoices(slot.title)) {
        const { url, fileName, padToKb } = choice.source;
        const bytes = url ? new Uint8Array(readFileSync(join(PUBLIC, url))) : new Uint8Array();
        const sizeKb = padToKb ?? Math.ceil(bytes.length / 1024);
        const where = `${def.code} · "${slot.title}" · ${choice.id}`;

        if (choice.outcome === "refused") {
          const refused = rejectionOf({ name: fileName, sizeKb }, RULE) ?? (() => {
            const found = deviceCheckOfBytes(fileName, bytes);
            return found ? REFUSAL_OF[found] : null;
          })();
          expect(Boolean(refused), `${where} was not refused`);
          pairs++;
          continue;
        }
        expect(rejectionOf({ name: fileName, sizeKb }, RULE) === null, `${where} refused by type or size`);
        expect(deviceCheckOfBytes(fileName, bytes) === null, `${where} refused by its bytes`);
        if (choice.outcome === "failed") { pairs++; continue; } // the transfer, not the check

        const v = yearCheckedVerdict(
          simulateCheck({ slot, checklist, fileName, sizeKb, applicationFy: FY, facts: FACTS, checks: 0 }),
          slot.title, FY,
        );
        expect(v.state === STATE_OF[choice.outcome as keyof typeof STATE_OF], `${where} gave ${v.state}: ${v.summary}`);
        pairs++;
      }
    }
  }
  assert.deepEqual(wrong, []);
  assert.ok(pairs > 500, `only ${pairs} sample × slot pairs`);
});

test("every check at once puts a different failure in as many slots as it can", () => {
  const def = WIZARDS.SHRESHTA_M2;
  const { values } = buildScenario("complete", def);
  const docs = visibleDocuments(def, values);
  const placed = everyCheckAtOnce(docs);
  assert.equal(placed.length, docs.length);
  const kinds = new Set(placed.map((p) => p.fileName.replace(/^.*--/, "").replace(/\.\w+$/, "")));
  assert.ok(kinds.size >= Math.min(docs.length, 10), `only ${kinds.size} kinds across ${docs.length} documents`);
});
