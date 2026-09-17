/**
 * Which sample file the demo dock places into a document slot, for each thing that can happen to it.
 *
 * The files are generated (`tools/e-anudaan-samples/generate.mjs`, listed in sample-files.generated.ts).
 * This module decides, for one checklist document: which document TYPE it is (the sample "subject"),
 * which checks it can fail (doc-checks.ts), and the file that trips each — fetched as it is, fetched
 * and renamed where only the name decides (the outage, the dropped connection), or built in the
 * browser where only the bytes decide (an empty file, one over the size limit).
 *
 * Every placement goes through the upload step's real path — the size and type rule, the byte
 * checks, the transfer, the automatic check — so what the reviewer sees is what an applicant with
 * that file would see.
 */

import { CHECK_BY_ID, DOC_CHECKS, checkApplies, type CheckId, type CheckOutcome } from "./doc-checks.ts";
import { topicsOfFile, topicsOfTitle } from "./document-centre.ts";
import { SAMPLE_FILES } from "./sample-files.generated.ts";

export const SAMPLE_BASE = "/e-anudaan/sample-documents";
/** The event the dock dispatches; the upload step places each file into its slot. */
export const DEMO_PLACE_SAMPLES_EVENT = "e-anudaan:demo-place-samples";

/** Over the 5 MB limit every e-Anudaan checklist states, and never committed to the repository. */
const OVERSIZE_KB = 6 * 1024;

export interface SamplePlacement {
  n: number;
  /** Where the bytes come from; `null` for an empty file. */
  url: string | null;
  /** The name it is uploaded under — the checker reads the check from it. */
  fileName: string;
  /** Pad the file to this size, for the size limit. */
  padToKb?: number;
}

export interface DemoPlaceSamplesDetail {
  scheme: string;
  placements: SamplePlacement[];
}

/**
 * Placements waiting for the upload step to mount. The dock can be used from any step of the form;
 * it writes here, moves to Upload Documents, and the step places them as it opens.
 */
export const DEMO_PENDING_SAMPLES_KEY = "e-anudaan.demo.pending-samples";

export interface SampleChoice {
  id: "valid" | "valid-scan" | CheckId;
  label: string;
  outcome: "passes" | CheckOutcome;
  /** Where to fetch it, and what to call it; `n` is filled in by the caller. */
  source: Omit<SamplePlacement, "n">;
}

const SUBJECT_STEMS = [...new Set(SAMPLE_FILES.filter((f) => f.check === "valid").map((f) => f.stem))];
const has = (file: string) => SAMPLE_FILES.some((f) => f.file === file);
const url = (file: string) => `${SAMPLE_BASE}/${file}`;

/**
 * The document type a checklist title asks for: the subject sharing the most topics with it, and
 * among equals the one claiming fewest topics the title does not name.
 */
export function subjectForTitle(title: string): string | undefined {
  const wanted = topicsOfTitle(title);
  let best: { stem: string; score: number; extra: number } | undefined;
  for (const stem of SUBJECT_STEMS) {
    const topics = topicsOfFile(stem);
    const score = [...topics].filter((t) => wanted.has(t)).length;
    const extra = topics.size - score;
    if (score === 0) continue;
    if (!best || score > best.score || (score === best.score && extra < best.extra)) best = { stem, score, extra };
  }
  // A slot that names no document type — "Any other document as requested" — takes a covering note.
  return best?.stem ?? (wanted.size === 0 ? "justification-note" : undefined);
}

/** A valid file of a DIFFERENT type — what "wrong document" means. */
function otherSubject(stem: string): string {
  const mine = topicsOfFile(stem);
  return SUBJECT_STEMS.find((s) => s !== stem && ![...topicsOfFile(s)].some((t) => mine.has(t))) ?? "pan-card";
}

/** Everything that can happen to this document, each with the file that makes it happen. */
export function sampleChoices(title: string): SampleChoice[] {
  const stem = subjectForTitle(title);
  if (!stem) return [];
  const topics = topicsOfTitle(title);
  const valid = `${stem}--valid.pdf`;
  const out: SampleChoice[] = [{ id: "valid", label: "Correct Document", outcome: "passes", source: { url: url(valid), fileName: valid } }];
  if (has(`${stem}--valid.jpg`)) {
    out.push({ id: "valid-scan", label: "Correct Document, Scanned as JPG", outcome: "passes", source: { url: url(`${stem}--valid.jpg`), fileName: `${stem}--valid.jpg` } });
  }

  for (const check of DOC_CHECKS) {
    if (!checkApplies(check.id, topics)) continue;
    // A slot that takes any document cannot be given the wrong one.
    if (check.id === "wrong-document" && topics.size === 0) continue;
    const named = (file: string, as = `${stem}--${check.id}${file.slice(file.lastIndexOf("."))}`) => ({ url: url(file), fileName: as });
    let source: SampleChoice["source"] | undefined;
    switch (check.id) {
      case "file-type": source = named("sample--file-type.docx"); break;
      case "file-size": source = { ...named(valid), padToKb: OVERSIZE_KB }; break;
      case "file-empty": source = { url: null, fileName: `${stem}--file-empty.pdf` }; break;
      case "file-locked": source = named("sample--file-locked.pdf"); break;
      // A picture's bytes under a PDF's name.
      case "file-unreadable": source = named("registration-certificate--valid.jpg", `${stem}--file-unreadable.pdf`); break;
      case "upload-interrupted": source = named(valid); break;
      case "check-unavailable": source = named(valid); break;
      case "placeholder": source = named("specimen--placeholder.pdf", "specimen--placeholder.pdf"); break;
      case "wrong-document": {
        const other = `${otherSubject(stem)}--valid.pdf`;
        source = named(other, other);
        break;
      }
      default:
        if (has(`${stem}--${check.id}.pdf`)) source = named(`${stem}--${check.id}.pdf`);
    }
    if (source) out.push({ id: check.id, label: CHECK_BY_ID[check.id].label, outcome: check.outcome, source });
  }
  return out;
}

/** Correct files everywhere. */
export function everyDocumentPasses(docs: readonly { n: number; title: string }[]): SamplePlacement[] {
  return docs.flatMap((d) => {
    const c = sampleChoices(d.title)[0];
    return c ? [{ n: d.n, ...c.source }] : [];
  });
}

/**
 * A different failure in every slot, so one click shows as many of the checks as the checklist can
 * hold. Each document takes the first failure it can show that no earlier document has shown; a
 * document with nothing new left repeats one of its own.
 */
export function everyCheckAtOnce(docs: readonly { n: number; title: string }[]): SamplePlacement[] {
  const shown = new Set<string>();
  return docs.flatMap((d, i) => {
    const failures = sampleChoices(d.title).filter((c) => c.outcome !== "passes");
    if (!failures.length) return [];
    // The rarer checks first: the ones only this kind of document can fail.
    const ordered = [...failures].sort((a, b) => rarity(a.id) - rarity(b.id));
    const pick = ordered.find((c) => !shown.has(c.id)) ?? failures[i % failures.length]!;
    shown.add(pick.id);
    return [{ n: d.n, ...pick.source }];
  });
}

function rarity(id: SampleChoice["id"]): number {
  const row = CHECK_BY_ID[id as CheckId];
  return row ? (row.appliesTo === "any" ? 100 : row.appliesTo.length) : 1000;
}

/** The same failure in every slot that can show it. */
export function checkEverywhere(docs: readonly { n: number; title: string }[], id: SampleChoice["id"]): SamplePlacement[] {
  return docs.flatMap((d) => {
    const c = sampleChoices(d.title).find((x) => x.id === id);
    return c ? [{ n: d.n, ...c.source }] : [];
  });
}
