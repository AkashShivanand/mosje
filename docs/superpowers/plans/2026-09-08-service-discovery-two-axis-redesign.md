# Service Discovery — Two-Axis Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the service-discovery options, their recordings, the Figma frames and the decision deck on a validated master of the Department's schemes, in the shape the 8 September 2026 review asked for: persona × offering, no counts, no unvalidated claim.

**Architecture:** One scheme master (`docs/research/dosje-scheme-master-2026-09.json`, sourced only from the Department's Annual Report 2025-26, its Demand for Grants 2026-27 and the PIB Year-End Review 2025) generates the prototype data, a typed module for the assistant, and the research document. Every surface — six static prototypes, the assistant route, the Figma frames, the deck — reads that one list. The finder is two questions (persona, offering); the one-tap row is persona-first; the Schemes page filters on the same two axes.

**Tech Stack:** Static HTML prototypes (Noto Sans, `core.css` tokens), Next 16 route for the assistant, Playwright for recordings, Figma Plugin API through `use_figma`, pptxgenjs for the deck.

**Spec:** the review transcript `/Users/akashk/Documents/gemini-code-1788887649037.md` and its analysis in this session; `docs/plans/HANDOFF-service-discovery.md` §6–7 for the standing rules.

## Global Constraints

- **No count of schemes on any screen, frame or slide.** Not a total, not a running match count, not a per-filter count. Pagination controls may show page numbers.
- **No figure that a cited source does not state.** Where sources conflict the surface shows nothing and `conflicts` in the master records it.
- **Nothing states that a person is eligible.** "Whom it names" is the wording; the sanctioning authority decides.
- **Two axes only:** persona (the citizen) and offering (what the Department provides). No stage-of-life, no State, no gender, no "who is this for".
- **Government register, Title Case titles, Noto Sans, tokens from `core.css`.** `.claude/rules/ui-restraint-and-copy.md`.
- **The persona sequence opens on a female figure** — Students leads, per the review.
- **Every option is the section alone** on a 1440×900 canvas, as the viewer scales it.
- **Branch:** `feat/sd-options-landed`. Stage explicit paths; never `git add -A`.

---

### Task 1: The scheme master and its generator ✅ done in this session

**Files:**
- Create: `docs/research/dosje-scheme-master-2026-09.json` — 38 records, 11 personas, 8 offerings, 29 apply routes, exclusions, conflicts
- Create: `tools/service-discovery/build-data.mjs`
- Generate: `apps/hub/public/prototypes/service-discovery/data.js`, `apps/hub/src/lib/explorations/service-discovery-master.ts`, `docs/research/dosje-scheme-master-2026-09.md`

**Interfaces (Produces):** in `data.js` — `PERSONAS`, `OFFERINGS`, `SCHEMES`, `ROUTES`, `SIGNPOST`, `GROUPS` (alias), `GROUP_LABEL`, `OFFER_LABEL`, `markHTML(id)`, `matchSchemes({who, offer})`, `offersFor(who)`, `routeLabel(id)`. In the TS module — `SD_PERSONAS`, `SD_OFFERINGS`, `SD_SCHEMES`, `SD_ROUTES`, `SD_SIGNPOST`, `sdMatch(who?, offer?)`, `sdOffersFor(who)`.

- [x] Master written with a source per record
- [x] Generator validates ids, sources, and rejects a count in prose
- [x] `node tools/service-discovery/build-data.mjs` runs clean

### Task 2: Home Option B — the two-question finder

**Files:**
- Modify: `apps/hub/public/prototypes/service-discovery/home-b.html` (rewrite the script and the copy; keep the stylesheet block)

**Interfaces (Consumes):** `PERSONAS`, `SIGNPOST`, `offersFor`, `matchSchemes`, `ROUTES`, `markHTML`.

- [ ] **Step 1: Replace the question list** with two entries:

```js
const Q = [
  { k:'who',   t:'Who Is Looking for Support?', h:'Choose the one that describes you. Persons with disabilities are directed to the department that serves them.',
    o:PERSONAS.map(g=>({id:g.id,l:g.label,s:g.sub})).concat([{id:SIGNPOST.id,l:SIGNPOST.label,s:SIGNPOST.sub}]) },
  { k:'offer', t:'What Kind of Support?', h:'Only what the Department provides for that group is listed. Skip this to see all of it.',
    o:() => offersFor(ans.who).map(o=>({id:o.id,l:o.label,s:o.sub})) },
];
```

- [ ] **Step 2: Render options** — 4-column grid of `.opt-card`, each with `markHTML` for personas; choosing `pwd` on question 1 jumps straight to the signpost.
- [ ] **Step 3: Results** — heading "Schemes That Name You"; chips for the two answers; one `.res` card per scheme with `name`, umbrella tag, `provides`, "Whom it names: …", and a button "Apply on {routeLabel(apply[0])}". No match count. Empty state: "The Department's record has no scheme for that group and that kind of support together. Remove the second answer to see everything for the group."
- [ ] **Step 4: Copy check** — lede "Two short questions. Nothing you answer is stored." Note keeps the "sanctioning authority decides" sentence.
- [ ] **Step 5: View at 1440×900** with Playwright; assert no digit-followed-by "scheme" text on the page.

### Task 3: Home Option C — one tap, persona first

**Files:**
- Modify: `apps/hub/public/prototypes/service-discovery/home-c.html`

- [ ] **Step 1: Strip** — the ROUTES object, the `128`-style count, "Apply now" on every row.
- [ ] **Step 2: Rows grouped by offering** for the selected persona: for each `offersFor(sel)` heading, the schemes from `matchSchemes({who:sel, offer})`, each row: name, `provides`, and one link "Scheme page →" with a small "Apply on {route}" meta line.
- [ ] **Step 3: Footer** — "All Schemes for {persona} →" to `scheme-b.html?g=`.
- [ ] **Step 4: Persona strip** — chips from `PERSONAS` in master order, default `student`.
- [ ] **Step 5: View at 1440×900**; the panel must fit within 900px for the default persona (page the rows at 6 if it does not).

### Task 4: Schemes page Options A and B — two filters

**Files:**
- Modify: `apps/hub/public/prototypes/service-discovery/scheme-a.html`, `scheme-b.html`

- [ ] **Step 1 (A):** faces row = `PERSONAS` marks + "All"; beneath it a chip row of `OFFERINGS`; cards from `matchSchemes`, 9 per page with a pager; card shows umbrella tag, name, `provides`, "Know more →".
- [ ] **Step 2 (B):** filter panel = "Who It Is For" checkboxes (`PERSONAS`) and "What It Provides" checkboxes (`OFFERINGS`); **no per-filter counts** — a filter that would leave nothing is greyed with `aria-disabled`; table columns Scheme · What It Provides · Whom It Names · Type; 10 rows per page with a pager; applied chips; empty state names the filters.
- [ ] **Step 3:** remove the "19 schemes" style header everywhere; View at 1440×900.

### Task 5: Option A panel, the tasks, the search and the hand-off read the new data

**Files:**
- Modify: `home-a.html` (persona list = `PERSONAS`, opens on Students), `home-d.html` (drop the STAGES routes block; the "check" task opens the two questions), `home-e.html` (`s.who.includes`), `handoff.html` (no change unless it reads SCHEMES), `chatbot.html` (dead — leave)

- [ ] Each page loads without a console error under Playwright.

### Task 6: The assistant — two questions in chat

**Files:**
- Modify: `apps/hub/src/app/prototypes/service-discovery/assistant/page.tsx`
- Consumes: `SD_PERSONAS`, `sdOffersFor`, `sdMatch`, `SD_ROUTES`

- [ ] **Step 1:** STEPS = persona quick replies (labels from `SD_PERSONAS`, plus "Persons with disabilities"), then offerings from `sdOffersFor(persona)`, then a result bubble naming up to three schemes **without a count** and quick replies "Open {name}" / "Start over".
- [ ] **Step 2:** copy — "two short questions"; the note stays.
- [ ] **Step 3:** `npm run typecheck -w apps/hub` clean.

### Task 7: The register and the option viewer

**Files:**
- Modify: `apps/hub/src/lib/explorations/registry.ts` (surface summary without the 134 sentence; `finder` and `five-questions` entries superseded by `two-questions`; option titles), `apps/hub/src/components/explorations/service-discovery/options.tsx` (titles)

- [ ] `npm run typecheck -w apps/hub` and `npm run lint -w apps/hub` clean.

### Task 8: Recordings

**Files:**
- Create: `docs/plans/persona-deck/record.cjs` (rewrite paths to the repo prototypes; walks for home-a, home-b, home-c, scheme-a, scheme-b, assistant at `http://localhost:3007/prototypes/service-discovery/assistant`)
- Output: `docs/plans/persona-deck/assets/video/*.mp4` and a poster `.png` per video

- [ ] Each walk is real clicks; assistant recorded against the running hub.
- [ ] Every video opened and checked for a count on screen.

### Task 9: Figma — the frames, in sections

**Files:** Figma file `SVMfm1KApR7KYHSbwNBnOM`, page holding frame `4632:158550`.

- [ ] Load `figma:figma-use` (mandatory) and `figma:figma-generate-design`.
- [ ] Build a new top-level frame **"Service Discovery — 9 Sep 2026"** with sections: `1 · Concept — Persona × Offering` (the two masters as lists, LHS/RHS, and the filtration sentence), `2 · Home Page` (A persona panel, B two questions, C one tap — each option a frame plus its annotation), `3 · Schemes Page` (A, B), `4 · The Assistant`, `5 · Placement on the Home Page` (a 1440 home wireframe marking where each option sits).
- [ ] Every fill, text and radius bound to SAMAVESH variables/styles (`3FF5l0SMNIwdpZrKkeyPTm`); no literal that merely equals a token.
- [ ] The old frame is renamed "Service Discovery — superseded 8 Sep 2026" and kept.
- [ ] Screenshot every section; check no count survives.

### Task 10: The deck

**Files:**
- Modify: `docs/plans/persona-deck/build.cjs` — new order: Title · Concept (LHS/RHS) · Home Page: three options and placement · Home A · Home B · Home C · Schemes Page: two options · Schemes A · Schemes B · Assistant · What Has to Be Done First (the masters, tagging, development estimate) · Safeguards · Recommendation. Remove "134", "Sent ahead of the meeting", "five questions", "Find offerings for you".
- Output: `docs/plans/MoSJE-Service-Discovery-Options.pptx`, built in the scratch `deckbuild` with the videos embedded.

- [ ] Render each slide to PNG and read every one at full size before calling it done.

### Task 11: Commit, summary

- [ ] Stage explicit paths; commit per task group; `npm run ci:fast`.
- [ ] Before/after page: `docs/audit/service-discovery-2026-09-09-before-after.html` from the `before/` screenshots and the new ones.
