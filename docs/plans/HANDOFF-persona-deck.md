# Handoff — the Persona / Options Deck

**Read this first in the new session. Everything needed to start is here.**

---

## The task

Turn the existing persona and information-architecture research into a **PowerPoint deck**, send it,
then walk the Secretary ("Sir") through it in person.

## Who asked, and in what words

Raised on the review call of **3 September 2026** (`umt-qefg-fzj`). The lead's instruction:

> *"सर ने ये बोला है कि एक PPT बनाओ, then present to me … डॉक्यूमेंट है, ऑप्शंस ऑन थीं, उसको बस
> स्लाइड्स में प्लेस करो और एक डेक इनको भेजते हैं और एक दिन आ जाना, वो इनको दिखा देंगे।"*

Three things follow from that:

1. **The content already exists.** He asked to *place the existing options into slides* — not to
   research or rewrite. Do not start a new analysis.
2. **The deck goes out first, the meeting comes after.** So it has to read on its own, without a
   presenter.
3. It had already been sent once as a document and sat unactioned; email reminders had been sent.
   The PPT is the second attempt at getting a decision.

**Owner is unconfirmed.** Prakash Mehta raised the persona question on the call and the lead
answered him. It may be his, yours, or shared. **Confirm before building.**

---

## Source

`docs/research/website-ia-persona-discoverability-2026-08.md` — *"Finding What You're Entitled To"*,
358 lines, dated 20 August 2026. There is an HTML companion beside it.

It already contains everything the deck needs:

| Section | What's in it |
|---|---|
| §0 | Scope, method, and a **stated limits** block — no user research was done; the export is dated |
| §1 | **15 personas** (P1–P15) and the offerings inventory; §1.3 is the coverage matrix — the central finding |
| §2 | Four benchmarks — myScheme, DEPwD, National Scholarship Portal, GOV.UK |
| §3 | **Nine diagnoses, D1–D9** |
| §4 | **Nine recommendations, R1–R9**, each mapped to the diagnoses it closes |
| §4.1 | Three redesigned journeys — Meena 17, Ramesh 42, Lata 34 — each as today vs recommended |
| §5 | **Roadmap, Phases 0–4**, with Phase 1 named as the critical path |

The headline finding, and the line the deck should open on: the Department publishes 141 schemes;
its own filter finds five of the thirty-two serving Scheduled Castes and none of the twenty-three
serving women and girls. **The filter is not broken — the data behind it was never populated.**

---

## Format

**PowerPoint (.pptx).** The Ministry cannot take HTML — established earlier in this project when
the governance note had to be rebuilt as a Word document. Use the `anthropic-skills:pptx` skill.

There is no LibreOffice, Word, Pages or pandoc on this machine. macOS `qlmanage` will render page
one only:

```bash
qlmanage -t -s 1400 -o <outdir> deck.pptx
```

Verify the rest structurally (unzip, parse the XML) and **say plainly in the summary that slides
beyond the first were not visually checked.**

---

## Proposed outline — 13 slides

Confirm before building; this is a starting point, not a decision.

1. Title — what was reviewed, when, by whom
2. The question: can a citizen find what they are entitled to?
3. Today — two live ministry sites with divergent taxonomies (D1)
4. The five findings that matter (D2, D3, D4, D6, D7), one line each
5. The evidence — the coverage matrix from §1.3
6. Three journeys as they run today
7. **The options** — R2, R3, R4 framed as the decision being asked for
8–10. One slide per option: what changes, what it costs, what it needs from the Department
11. The same three journeys, after
12. Roadmap — Phases 0–4, with Phase 1 named as the constraint
13. What we need decided, and by whom

---

## Standing constraints

- **No figure that is not in the source document**, and every number keeps its date.
- **Carry §0's limits onto a slide.** No user research was conducted; the content export is dated.
  Dropping that would misrepresent the work to the Secretary.
- Government register, Title Case titles — see `.claude/rules/ui-restraint-and-copy.md`.
- Noto Sans is the estate typeface, but **it may not be installed on the Ministry's machines.**
  Prefer Calibri body / Georgia headings, as used in the two Word documents already delivered.
- The deck is a **decision aid**, not a report. If a slide does not move the Secretary toward one
  of the three options, it does not belong.

---

## Related work already delivered (context, not input)

In `docs/plans/`, all uncommitted:

- `Content Maintenance Responsibilities - dosje.gov.in.docx` — the roles mapping, Workstream A
- `Repeated Content and Design Inconsistencies - dosje.gov.in.docx` — the revised Document A §01
- `2026-09-07-dosje-page-ownership-inventory.csv` — 146-row ownership inventory
- `2026-09-03-dosje-governance-and-cms-plan-of-action.md` — the plan the deck sits inside
- `2026-09-07-dosje-roles-and-responsibility-mapping.md` / `.html`

**None of these belong in the deck.** They answer a different question (who maintains the site).
The deck answers whether a citizen can find what they are entitled to. Keep them apart.

---

## Open questions to settle first

1. **Who owns the deck** — you, Prakash, or both?
2. **Audience beyond the Secretary** — is it presented onward to the Ministry, or internal only?
3. **Does the Secretary want all three options, or a single recommendation?** The source
   recommends R1–R9 as a programme; the call described "options". Those are different decks.

---

## Branch

The shared working tree moves between sessions — it was `fix/eanudaan-live-parity`, then
`ds/system-completeness`, and is now `ds/template-migration-01`, each with other sessions'
uncommitted files in it. **Do not switch or stash.** Take a worktree:

```bash
git worktree add <scratchpad>/wt-persona-deck -b design/persona-deck main
```

Nothing from this workstream has been committed yet.
