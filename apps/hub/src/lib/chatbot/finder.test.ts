// Tests for the scheme finder.
//
// Two kinds of thing are pinned here. The first is the arithmetic: a filter that
// silently narrows when it was told to widen would make "Skip this" a lie, and a
// citizen who skips a question they cannot answer would be shown fewer schemes
// for admitting they don't know. The second is the GOVERNANCE: this widget is
// not allowed to tell anyone they are entitled to anything, and that is enforced
// by reading every string it can emit rather than by remembering to be careful.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  SCHEMES,
  constrainingAnswer,
  finderAdvance,
  finderCurrent,
  finderSessionAnswer,
  finderSessionStart,
  finderSessionSubmit,
  finderStart,
  finderSubmit,
  isOffsite,
  matchSchemes,
  readIntent,
  type Audience,
  type FinderAnswers,
  type FinderSession,
  type FinderState,
  type FinderTurn,
} from "./finder.ts";
import { CHATBOT_SCRIPT } from "./content.ts";

/* -- helpers ---------------------------------------------------------------- */

const state = (over: Partial<FinderState> = {}): FinderState => ({
  step: "state",
  answers: {},
  shown: 0,
  ...over,
});

/** Press a suggestion and insist the finder owned it. */
function advance(from: FinderState, id: string): FinderTurn {
  const turn = finderAdvance(from, id);
  assert.ok(turn, `the finder should own "${id}"`);
  return turn;
}

/* -- 1. a completed run filters, and finds something ------------------------ */

test("a completed five-answer run returns a non-empty, correctly filtered set", () => {
  const answers: FinderAnswers = {
    audienceFor: "self",
    who: "sc",
    stage: "college",
    needs: ["education"],
    state: "MH",
  };
  const found = matchSchemes(answers);

  assert.ok(found.length > 0, "an SC student in college looking for education finds schemes");
  for (const s of found) {
    assert.ok(s.who.includes("sc"), `${s.id} is tagged for Scheduled Castes`);
    assert.ok(
      s.stage.includes("college") || s.stage.includes("any"),
      `${s.id} covers the college stage`,
    );
    assert.ok(s.need.includes("education"), `${s.id} answers an education need`);
    assert.ok(
      ["Central", "Corporation", "MH"].includes(s.jurisdiction),
      `${s.id} runs in Maharashtra`,
    );
  }
  assert.ok(found.length < SCHEMES.length, "and it is genuinely a subset, not the whole list");
});

test("walking the wizard end to end reaches results, not a dead end", () => {
  let turn = finderStart();
  for (const id of ["f:for:self", "f:who:sc", "f:stage:college", "f:need:education", "f:needs:done", "f:state:MH"]) {
    turn = advance(turn.state, id);
  }
  assert.equal(turn.state.step, "results");
  assert.ok(turn.say.length > 1, "a lead line and at least one scheme");
  assert.ok(turn.quickReplies.length > 0, "and somewhere to go next");
});

/* -- 2. skipping widens, and can never empty the list ------------------------ */

test("skipping every question returns the whole catalogue, never zero", () => {
  let turn = finderStart();
  for (let i = 0; i < 5; i += 1) turn = advance(turn.state, "f:skip");

  assert.equal(turn.state.step, "results");
  assert.equal(matchSchemes(turn.state.answers).length, SCHEMES.length);
  assert.ok(SCHEMES.length > 0);
});

test("a skip at any single step can only leave the count the same or higher", () => {
  const answered: FinderAnswers = { who: "sc", stage: "college", needs: ["education"], state: "MH" };
  const before = matchSchemes(answered).length;

  for (const axis of ["who", "stage", "needs", "state"] as const) {
    const skipped = matchSchemes({ ...answered, [axis]: undefined });
    assert.ok(
      skipped.length >= before,
      `skipping ${axis} widened from ${before} to ${skipped.length}`,
    );
  }
});

test("the running count never reads zero as a result of skipping", () => {
  let turn = finderStart();
  const counts: number[] = [];
  for (const id of ["f:for:self", "f:skip", "f:skip", "f:skip", "f:skip"]) {
    turn = advance(turn.state, id);
    counts.push(matchSchemes(turn.state.answers).length);
  }
  assert.ok(
    counts.every((n) => n === SCHEMES.length),
    `skipping held the count at the full catalogue, got ${counts.join(", ")}`,
  );
});

/* -- 3. multi-valued tagging, found under every axis ------------------------- */

test("a record tagged for two audiences is returned under both, independently", () => {
  const both = SCHEMES.filter((s) => s.who.length > 1);
  assert.ok(both.length > 0, "the catalogue has multi-audience records at all");

  for (const scheme of both) {
    for (const who of scheme.who) {
      const found = matchSchemes({ who });
      assert.ok(
        found.some((s) => s.id === scheme.id),
        `${scheme.id} should be findable under "${who}"`,
      );
    }
  }
});

test("Mahila Adhikarita Yojana answers to sanitation work and to women alike", () => {
  const id = "mahila-adhikarita-yojana-may";
  for (const who of ["safai", "women"] as Audience[]) {
    assert.ok(matchSchemes({ who }).some((s) => s.id === id), `not found under ${who}`);
  }
});

test("an SC girl in class 11 is reachable on every axis that applies to her", () => {
  const axes: FinderAnswers[] = [
    { who: "sc" },
    { stage: "school" },
    { needs: ["education"] },
    { who: "sc", stage: "school", needs: ["education"] },
  ];
  for (const answers of axes) {
    assert.ok(matchSchemes(answers).length > 0, `${JSON.stringify(answers)} found nothing`);
  }
});

/* -- 4. disability leaves this Department --------------------------------- */

test("a person with a disability gets the DEPwD route and no scheme list", () => {
  const turn = advance(state({ step: "who" }), "f:who:depwd");

  assert.equal(turn.state.step, "depwd");
  assert.equal(turn.say.length, 1, "it says one thing and stops");
  assert.match(turn.say[0]!, /depwd\.gov\.in/);
  assert.match(turn.say[0]!, /different department/);
  for (const s of SCHEMES) {
    assert.ok(!turn.say.some((line) => line.includes(s.name)), `named ${s.name}`);
  }
});

test("typing about disability routes the same way as pressing it", () => {
  assert.equal(readIntent("my son has a disability"), "depwd");
  assert.equal(readIntent("divyang certificate"), "depwd");
  const turn = finderSessionSubmit(finderSessionStart(CHATBOT_SCRIPT), CHATBOT_SCRIPT, "UDID card");
  assert.match(finderCurrent(turn).messages.at(-1)!.text, /depwd\.gov\.in/);
});

/* -- 5. zero results names the answer that caused it ------------------------ */

test("zero results names the constraining answer and what dropping it recovers", () => {
  const answers: FinderAnswers = { who: "trans", needs: ["education"] };
  assert.equal(matchSchemes(answers).length, 0, "this combination is genuinely empty");

  const cause = constrainingAnswer(answers);
  assert.ok(cause, "something is doing it");
  assert.ok(cause.recovers > 0);

  const turn = advance(state({ step: "state", answers }), "f:state:MH");
  assert.equal(turn.state.step, "empty");
  assert.ok(turn.say.length >= 2, "never a single bare line");
  assert.ok(
    turn.say.some((line) => line.includes("the kind of help") || line.includes("the community")),
    `the axis at fault is named: ${turn.say.join(" | ")}`,
  );
  assert.ok(
    turn.say.some((line) => line.includes("transgender persons") || line.includes("education")),
    `and so is the answer they actually gave: ${turn.say.join(" | ")}`,
  );
  assert.ok(!turn.say.some((line) => /no results/i.test(line)), '"no results found" is banned');
  assert.ok(turn.quickReplies.length > 0, "and there is always a way onward");
});

test("dropping the named answer actually recovers schemes", () => {
  const answers: FinderAnswers = { who: "trans", needs: ["education"] };
  const cause = constrainingAnswer(answers)!;
  const turn = advance(state({ step: "empty", answers }), `f:drop:${cause.axis}`);
  assert.equal(turn.state.step, "results");
  assert.equal(matchSchemes(turn.state.answers).length, cause.recovers);
});

/* -- 6. free text matches words, not fragments of words --------------------- */

test('"safai ka kaam" resolves to sanitation work', () => {
  assert.equal(readIntent("safai ka kaam"), "safai");
  assert.equal(readIntent("I clean sewer lines"), "safai");
});

test('"confirmation number" does NOT resolve to atrocity', () => {
  assert.notEqual(readIntent("confirmation number"), "atrocity");
  assert.notEqual(readIntent("first attempt"), "atrocity");
  assert.notEqual(readIntent("firm registration"), "atrocity");
  // ...while the word on its own still does, which is the point of the boundary.
  assert.equal(readIntent("I filed an FIR"), "atrocity");
});

test("the documented synonyms all resolve", () => {
  const expected: ReadonlyArray<readonly [string, string]> = [
    ["pension", "senior"],
    ["budhapa", "senior"],
    ["safai", "safai"],
    ["manhole", "safai"],
    ["nasha", "drugs"],
    ["daaru", "drugs"],
    ["chhatravriti", "education"],
    ["fees", "education"],
    ["padhai", "education"],
    ["divyang", "depwd"],
    ["viklang", "depwd"],
    ["anudaan", "ngo"],
    ["NGO", "ngo"],
  ];
  for (const [word, intent] of expected) {
    assert.equal(readIntent(word), intent, `"${word}" should read as ${intent}`);
  }
});

test("a typed word starts a fresh search rather than refining the run on screen", () => {
  // Found in the browser: a half-finished run about sanitation work, then a
  // typed question about pensions, and the answer was "That leaves 1" because
  // the old answers were still applied. A count nobody can explain is worse
  // than a wider one.
  const midRun: FinderState = state({
    step: "needs",
    answers: { who: "safai", stage: "working", needs: ["money"], state: "UP" },
  });
  const turn = finderSubmit(midRun, "budhapa pension chahiye");

  assert.deepEqual(turn.state.answers, { who: "senior" }, "only the typed axis survives");
  assert.equal(
    matchSchemes(turn.state.answers).length,
    matchSchemes({ who: "senior" }).length,
  );
  assert.match(turn.say[0]!, /started fresh/, "and it says so rather than doing it quietly");
});

test("an unrecognised question is answered honestly and offers the five questions", () => {
  const session = finderSessionSubmit(
    finderSessionStart(CHATBOT_SCRIPT),
    CHATBOT_SCRIPT,
    "zzzz qqqq",
  );
  const frame = finderCurrent(session);
  assert.match(frame.messages.at(-2)!.text, /don't know that word yet/);
  assert.match(frame.messages.at(-1)!.text, /Question 1 of 5/);
  assert.ok(frame.quickReplies.length > 0);
});

/* -- 7. routes, not rulings ------------------------------------------------- */

/** Every string the module can put in front of a citizen, gathered by walking it. */
function everyOutput(): string[] {
  const out: string[] = [];
  for (const s of SCHEMES) {
    out.push(s.name, s.benefit, s.runBy, s.applyVia.label, s.applyVia.bring, ...s.docs);
  }

  const seen = new Set<string>();
  const queue: FinderState[] = [finderStart().state];
  out.push(...finderStart().say);

  while (queue.length > 0) {
    const from = queue.shift()!;
    const ids = new Set<string>([
      "f:skip",
      "f:restart",
      "f:list",
      "f:more",
      "f:change",
      ...(finderAdvance(from, "f:list")?.quickReplies ?? []).map((q) => q.id),
    ]);
    for (const id of ids) {
      const key = `${from.step}|${JSON.stringify(from.answers)}|${id}`;
      if (seen.has(key) || seen.size > 4000) continue;
      seen.add(key);
      const turn = finderAdvance(from, id);
      if (!turn) continue;
      out.push(...turn.say, ...turn.quickReplies.map((q) => q.label));
      queue.push(turn.state);
    }
  }
  return out;
}

test("nothing the finder can say contains a ruling on entitlement", () => {
  const banned = /\beligible\b|\beligibility\b|you qualify|you are entitled/i;
  for (const line of everyOutput()) {
    assert.ok(!banned.test(line), `a ruling slipped into: ${line}`);
  }
});

test("the results turn states who decides, not what the outcome is", () => {
  const turn = advance(state({ step: "state", answers: { who: "senior" } }), "f:state:MH");
  assert.match(turn.say.join(" "), /target group/);
  assert.match(turn.say.join(" "), /sanctioning authority/);
});

/* -- routes are real, and leaving the site is announced --------------------- */

test("every scheme id is a real entry in the site's own catalogue", () => {
  const raw = readFileSync(new URL("../../content/website/schemes.json", import.meta.url), "utf8");
  const catalogue = JSON.parse(raw) as ReadonlyArray<{ slug: string }>;
  const slugs = new Set(catalogue.map((s) => s.slug));

  for (const scheme of SCHEMES) {
    assert.ok(slugs.has(scheme.id), `"${scheme.id}" is not in schemes.json — invented?`);
  }
});

test("an on-site route points at a page this site actually serves", () => {
  for (const s of SCHEMES) {
    if (isOffsite(s.applyVia)) continue;
    assert.equal(s.applyVia.href, `/website/schemes-services/${s.id}`);
  }
});

test("opening a scheme that leaves the site says so before naming the destination", () => {
  const offsite = SCHEMES.find((s) => isOffsite(s.applyVia))!;
  const answers: FinderAnswers = {};
  const turn = advance(state({ step: "results", answers }), `f:open:${offsite.id}`);

  const leaving = turn.say.findIndex((line) => line.includes("leaves dosje.gov.in"));
  const destination = turn.say.findIndex((line) => line.includes(offsite.applyVia.href));
  assert.ok(leaving >= 0, "the leaving line is there");
  assert.ok(destination > leaving, "and it comes before the link, not after");
  assert.match(turn.say[leaving]!, /ready before you start/);
});

test("a result bubble never carries a link — opening one is a separate step", () => {
  const turn = advance(state({ step: "state", answers: { who: "safai" } }), "f:state:MH");
  for (const line of turn.say) {
    assert.ok(!/https?:\/\//.test(line), `a link leaked into a result bubble: ${line}`);
  }
});

test("opening a scheme gives all four things a person needs", () => {
  const turn = advance(state({ step: "results" }), "f:open:elderline");
  const all = turn.say.join(" ");
  assert.match(all, /what you get/);
  assert.match(all, /Who can apply/);
  assert.match(all, /What you'll need/);
  assert.match(all, /How to apply/);
});

/* -- the organisation branch ------------------------------------------------ */

test("an organisation skips the two questions about a person", () => {
  const turn = advance(finderStart().state, "f:for:org");
  assert.equal(turn.state.step, "needs", "it lands on Q4, not Q2");
  assert.equal(turn.state.answers.who, "ngo");
  assert.ok(matchSchemes(turn.state.answers).length > 0, "and grants exist to find");
  for (const s of matchSchemes(turn.state.answers)) {
    assert.ok(s.who.includes("ngo"), `${s.id} is a grant-side record`);
  }
});

/* -- 8. back and start over ------------------------------------------------- */

test("going back restores the previous state exactly, with no orphan messages", () => {
  let session: FinderSession = finderSessionStart(CHATBOT_SCRIPT);
  session = finderSessionAnswer(session, CHATBOT_SCRIPT, { id: "finder", label: "Which scheme applies to me?" });

  const atQ1 = finderCurrent(session);
  session = finderSessionAnswer(session, CHATBOT_SCRIPT, { id: "f:for:self", label: "Myself" });
  assert.notDeepEqual(finderCurrent(session).messages, atQ1.messages, "Q2 moved things on");

  session = finderSessionAnswer(session, CHATBOT_SCRIPT, { id: "f:back", label: "Go back" });
  const returned = finderCurrent(session);

  assert.deepEqual(returned.messages, atQ1.messages, "the transcript is exactly as it was");
  assert.deepEqual(returned.state, atQ1.state);
  assert.deepEqual(returned.quickReplies, atQ1.quickReplies);
  assert.ok(returned.quickReplies.length > 0, "and the question on screen is still answerable");
});

test("back from the very first frame is a no-op, not a crash or an empty panel", () => {
  const session = finderSessionStart(CHATBOT_SCRIPT);
  const after = finderSessionAnswer(session, CHATBOT_SCRIPT, { id: "f:back", label: "Go back" });
  assert.deepEqual(after, session);
  assert.ok(finderCurrent(after).messages.length > 0);
});

test("start over clears the answers and asks Q1 again, leaving nothing dangling", () => {
  let session: FinderSession = finderSessionStart(CHATBOT_SCRIPT);
  for (const press of [
    { id: "finder", label: "Which scheme applies to me?" },
    { id: "f:for:self", label: "Myself" },
    { id: "f:who:sc", label: "Scheduled Caste" },
    { id: "f:restart", label: "Start over" },
  ]) {
    session = finderSessionAnswer(session, CHATBOT_SCRIPT, press);
  }

  const frame = finderCurrent(session);
  assert.equal(frame.state.step, "for");
  assert.deepEqual(frame.state.answers, {});
  assert.match(frame.messages.at(-1)!.text, /Question 1 of 5/);
  assert.ok(frame.quickReplies.length > 0);
  // The history is kept: start over is a fresh question, not an erased session.
  assert.ok(frame.messages.length > 1);
});

test("every frame ends with a question that has something to press", () => {
  let session: FinderSession = finderSessionStart(CHATBOT_SCRIPT);
  for (const press of [
    { id: "finder", label: "Which scheme applies to me?" },
    { id: "f:for:self", label: "Myself" },
    { id: "f:who:safai", label: "Sanitation work" },
    { id: "f:stage:working", label: "Working age" },
    { id: "f:need:money", label: "money to work with" },
    { id: "f:needs:done", label: "That's all — show me" },
    { id: "f:state:UP", label: "Uttar Pradesh" },
  ]) {
    session = finderSessionAnswer(session, CHATBOT_SCRIPT, press);
    const frame = finderCurrent(session);
    assert.ok(frame.quickReplies.length > 0, `nothing to press after ${press.id}`);
    assert.equal(frame.messages.at(-1)!.from, "bot", `the bot had the last word after ${press.id}`);
  }
});

/* -- ids the finder does not own fall through to the script ----------------- */

test("a scripted suggestion still works inside the finder's session", () => {
  let session: FinderSession = finderSessionStart(CHATBOT_SCRIPT);
  session = finderSessionAnswer(session, CHATBOT_SCRIPT, { id: "otp", label: "I'm not receiving OTP." });
  const frame = finderCurrent(session);
  assert.match(frame.messages.at(-1)!.text, /OTP/);
  assert.ok(frame.quickReplies.length > 0);
});

test("the finder declines ids it does not own", () => {
  assert.equal(finderAdvance(state(), "grievance"), null);
  assert.equal(finderAdvance(state(), "documents"), null);
});
