/**
 * Live vendor portal  ⟷  our clone's form schema — a mechanical field-level diff.
 *
 * The clone was transcribed by hand from a walkthrough of eanudaan-user-dev.mosje.in on
 * 2026-08-22. The vendor has moved since (SHRESHTA Mode 2, a 24-role officer hierarchy), and a
 * hand transcription of a moving target drifts silently: the design audit judged the RENDERED
 * portal against WCAG and GIGW and could not have caught a step that our clone shows on the wrong
 * branch. This compares what the portal actually rendered — from the capture bundle — against
 * what our schema declares, and prints every difference.
 *
 *   node --experimental-strip-types tools/design-audit/projects/e-anudaan/clone-parity.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LIVE = join(HERE, "captures/live");
const REPO = join(HERE, "../../../..");
const { WIZARDS, visibleDocuments } = await import(
  join(REPO, "apps/hub/src/lib/e-anudaan/form-schema.ts")
);

const norm = (t) => (t || "").replace(/\s+/g, " ").replace(/\*/g, "").trim().toLowerCase();
/** Live step titles carry a trailing "Fields marked * are mandatory." — schema titles do not. */
const stepTitle = (t) => norm((t || "").split(".")[0]);

/** Every captured wizard state, grouped scheme → branch → step. */
function liveStates() {
  const out = {};
  for (const f of readdirSync(LIVE).filter((f) => f.endsWith("-ARRIVED.json"))) {
    const d = JSON.parse(readFileSync(join(LIVE, f), "utf8"));
    const m = /^NGO-([A-Z0-9]+(?:-M2)?)-(NEW|RENEWAL)?-?S(\d+)-(.+)-ARRIVED\.json$/.exec(f);
    if (!m) continue;
    const [, scheme, branch = "ONLY", n, slugTitle] = m;
    ((out[scheme] ??= {})[branch] ??= []).push({
      n: Number(n),
      slugTitle,
      url: d.url,
      fields: (d.fields || []).filter((x) => x.type !== "hidden"),
      // The step line the page itself printed, e.g. "Step 6 of 7 — Document Uploads".
      stepLine: (d.rows || []).map((r) => r.text || "").find((t) => /Step \d+ of \d+/.test(t)) || "",
    });
  }
  for (const s of Object.values(out)) for (const b of Object.values(s)) b.sort((a, x) => a.n - x.n);
  return out;
}

const SCHEME_KEY = { NAPDDR: "NAPDDR", AVYAY: "AVYAY", "SHRESHTA-M2": "SHRESHTA_M2" };
const BRANCH_VALUES = {
  NEW: { case_type: "New project" },
  RENEWAL: { case_type: "Ongoing / Renewal of an existing project" },
  ONLY: {},
};

const live = liveStates();
const findings = [];
const say = (s = "") => console.log(s);

say("# e-Anudaan — live portal vs our clone\n");
say(`Generated ${new Date().toISOString().slice(0, 10)} from \`captures/live\` and \`form-schema.ts\`.\n`);

for (const [liveScheme, branches] of Object.entries(live)) {
  const code = SCHEME_KEY[liveScheme];
  const w = WIZARDS[code];
  if (!w) { say(`## ${liveScheme}\n\n**No schema for this scheme.**\n`); continue; }

  for (const [branch, steps] of Object.entries(branches)) {
    say(`## ${code}${branch === "ONLY" ? "" : ` — ${branch.toLowerCase()} branch`}\n`);

    // ── step count ────────────────────────────────────────────────────────────
    const advertised = /Step \d+ of (\d+)/.exec(steps[0]?.stepLine || "")?.[1];
    const liveTotal = advertised ? Number(advertised) : steps.length;
    const ours = w.steps.length;
    if (liveTotal !== ours) {
      findings.push(`${code}/${branch}: step count`);
      say(`**✗ Step count.** Live shows **${liveTotal}**; our schema declares **${ours}**.\n`);
    } else {
      say(`✓ Step count: ${liveTotal}.\n`);
    }

    // ── step titles ───────────────────────────────────────────────────────────
    const liveTitles = steps.map((s) => stepTitle(s.slugTitle.replace(/-/g, " ")));
    const ourTitles = w.steps.map((s) => norm(s.title));
    const missing = ourTitles.filter((t) => !liveTitles.some((l) => l.includes(t) || t.includes(l)));
    const extra = liveTitles.filter((l) => !ourTitles.some((t) => l.includes(t) || t.includes(l)));
    if (missing.length) {
      findings.push(`${code}/${branch}: steps we render that live did not`);
      say(`**✗ We declare steps live did not show here:** ${missing.join(" · ")}\n`);
    }
    if (extra.length) {
      findings.push(`${code}/${branch}: steps live shows that we lack`);
      say(`**✗ Live showed steps we do not declare:** ${extra.join(" · ")}\n`);
    }

    // ── fields, step by step ──────────────────────────────────────────────────
    const ourFields = w.steps.flatMap((st) =>
      (st.sections || []).flatMap((sec) => (sec.fields || []).map((f) => ({ ...f, step: st.title })))
    );
    const values = BRANCH_VALUES[branch];
    const ourVisible = ourFields.filter(
      (f) => !f.showWhen || f.showWhen.equals.includes(values[f.showWhen.field])
    );
    const liveFields = steps.flatMap((s) => s.fields);
    const liveLabels = liveFields.map((f) => norm(f.label)).filter(Boolean);

    const weShowTheyDont = ourVisible.filter(
      (f) => f.label && !liveLabels.some((l) => l.includes(norm(f.label)) || norm(f.label).includes(l))
    );
    if (weShowTheyDont.length) {
      findings.push(`${code}/${branch}: ${weShowTheyDont.length} field(s) we show and live does not`);
      say(`**✗ Fields we render on this branch that live did not:**\n`);
      for (const f of weShowTheyDont.slice(0, 25))
        say(`  - \`${f.name}\` "${f.label}" — ${f.step}${f.required ? " · **required**" : ""}`);
      say("");
    }

    // ── documents ─────────────────────────────────────────────────────────────
    const uploads = steps.find((s) => /document|upload/i.test(s.slugTitle));
    if (uploads) {
      const counter = /(\d+)\s*\/\s*(\d+)\s+uploaded/i.exec(
        JSON.parse(readFileSync(join(LIVE, `NGO-${liveScheme}-${branch === "ONLY" ? "" : branch + "-"}S${String(uploads.n).padStart(2, "0")}-${uploads.slugTitle}-ARRIVED.json`), "utf8"))
          .rows.map((r) => r.text || "").join("\n")
      );
      const liveDocs = counter ? Number(counter[2]) : uploads.fields.filter((f) => f.type === "file").length;
      const ourDocs = visibleDocuments(w, values).length;
      if (liveDocs !== ourDocs) {
        findings.push(`${code}/${branch}: document count`);
        say(`**✗ Documents.** Live requires **${liveDocs}**; our schema declares **${ourDocs}**.\n`);
      } else {
        say(`✓ Documents: ${liveDocs}.\n`);
      }
    }
  }
}

say("---\n");
say(findings.length ? `## ${findings.length} gap(s)\n\n${findings.map((f) => `- ${f}`).join("\n")}`
                    : "## No gaps.");
