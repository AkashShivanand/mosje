# HANDOFF — Service discovery

**For:** a session picking this up to polish the UI and the prototypes.
**Written:** 8 September 2026. **Status:** options drawn and in the register; one branch unmerged and behind main.

---

## 1. The problem, in one paragraph

`dosje.gov.in` publishes **134** schemes. A citizen who does not already know a
scheme by name has no reliable route to the ones meant for them. The site *has* a
Target Group filter and it works perfectly — the data behind it was never
populated. Everything in this activity follows from that one fact.

---

## 2. The evidence

**Use 134** — the site's own figure, and what `registry.ts` already says. Earlier
drafts of this activity used 141; that was wrong twice over and is corrected here.

<details open>
<summary><b>Where the numbers come from — read before quoting any of them</b></summary>

`apps/hub/src/content/website/schemes.json` is a scrape of every URL under
`/schemes-and-services/`. It is **not** a count of live schemes:

| | |
|---|---:|
| Records in the export today (generated 2026-08-24) | **140** |
| Records in the earlier export this activity first used (2026-06-13) | 141 |
| Of those 140: titles that are not schemes — NAMASTE guidelines ×3, two "Status of…" pages, a Loan Schemes Flyer, an achievements table, and similar | −14 |
| Duplicate titles | −2 (one extra copy each) |
| **Distinct scheme records left** | **125** |
| Records with no content at all | 22 |
| **The site's own published figure** | **134** |

So 141 was a stale read of a URL count. Quote **134**, and treat 125 as the number
of distinct scheme records the export can actually support analysis on.
</details>

### Which groups the Department serves, and whether its filter finds them

Two earlier drafts counted a group as "served" if the words appeared **anywhere in
the body text**. That method proved unsafe — see the disability row below — so the
table now counts only schemes that **name the group in their own title**, which is
a claim nobody has to take on trust.

| Group | Schemes naming it in the title | Tagged so the filter finds them |
|---|---:|---:|
| Students / learners | 46 | 50 |
| DNT / VJNT / nomadic | 19 | 14 |
| **Scheduled Castes** | **18** | **5** |
| **OBC / EBC** | **10** | **4** |
| Senior citizens | 6 | 9 |
| **Women and girls** | **6** | **0** |
| Sanitation workers | 4 | 13 |
| **Victims of atrocities** | **2** | **0** |
| **Affected by drugs or alcohol** | **2** | **0** |
| **Transgender persons** | **1** (SMILE) | **0** |
| NGOs / voluntary organisations | 0 in title * | 0 |

\* **The NGO row is a cataloguing failure, not an absence.** The Department plainly
serves voluntary organisations — Grants-in-Aid to NGOs is one of its divisions, with
its own guidelines, screening minutes, blacklist and the e-Anudaan portal, all linked
from the site footer. None of it is in the schemes collection, which is why the row
reads zero. The same is true of the transgender row: SMILE and the National Portal for
Transgender Persons exist, filed as organisations rather than schemes.

**How to read it.** Title-matching is a floor, not a census — where the tagged
column is *higher* (sanitation workers, senior citizens, students) the tagging is
doing real work and the floor simply misses schemes that describe the group without
naming it. The finding is the rows where it runs the other way:

> **Eighteen schemes say "Scheduled Caste" or "SC students" in their own title.
> Filtering for Scheduled Castes returns five.** Ten name OBC or EBC; the filter
> returns four. Six name women or girls; the filter returns none. No inference is
> required — the scheme's own title names the group, and the filter does not find it.

Two structural facts, on the 125 distinct records:

- **21 carry no target group at all** — reachable only by knowing the URL.
- **Only 2 carry more than one group.** So a Scheduled Caste student must choose
  between filtering by community or by student; the two cannot be combined into a
  truthful answer. This is the single most important fact in the whole activity.

### ⚠ Correction: the Department does **not** serve persons with disabilities

An earlier draft of this table carried a row reading *"Persons with disabilities —
10 addressed, 0 tagged"*. **That was wrong and it has been removed.** Every one of
those matches was incidental:

| Where "disability" appeared | What it actually was |
|---|---|
| AVYAY, Rashtriya Vayoshri Yojana | "age-related disability/infirmity" — *senior citizen* schemes |
| PoA / PCR Act scheme | "disability arising out of untouchability" — a legal term |
| PM-YASASVI (×2) | "Disability certificate, if applicable" in a document checklist |
| Group Loan Scheme, Loan Schemes Flyer | PwD listed among many groups in an NBCFDC target list |
| Integrated Programme for Senior Citizens | an implementing NGO whose *name* contains "Handicapped" |
| Upgradation of Merit of SC Students | allowances for students with disabilities *among SCs* |

Persons with disabilities are served by the **Department of Empowerment of Persons
with Disabilities (DEPwD)**, a separate department of the same Ministry, at
`depwd.gov.in`. DoSJE has essentially no PwD schemes, and the finding is the
opposite of what that row implied: **people looking for disability support arrive
at the wrong department's website and are given no signpost.** That is why the
five-question option routes them out, and it is the right behaviour.

### Other findings from the same audit

- **Two live ministry sites.** `dosje.gov.in` (SAMAVESH, WordPress, marked BETA) and
  `socialjustice.gov.in` (legacy, NIC) run in parallel with different navigation and
  partly different content. PM-SURAJ, TAPAS, DAMS, PM-AGY, Ageing with Dignity,
  Development Action Plan for SCs and e-ANUDAAN are on socialjustice and not findable
  on dosje — a search there for "SURAJ" returns an NSFDC FAQ and a crafts-mela tender.
- **Search matches document tags, not schemes.** A search for "disability" returns 19
  results, one of them a scheme (an *elderly* scheme tagged "Disability Aid"); the rest
  match tags like "disability arising from untouchability" — including a 2015 annual report.
- **State schemes sit unlabelled in a central catalogue.** Most of the DNT list is
  state schemes — Maharashtra's VJNT/SBC scholarships, Haryana's Mukhyamantri Vimukt
  Ghumantu Swarozgar Yojana, Rajasthan's Gadia Lohar Scheme — with nothing on the row
  to say a citizen elsewhere cannot apply.
- **The same programme is filed under two content types.** NMBA, SMILE-Beggary and the
  National Portal for Transgender Persons sit in the nav under "Scheme Specific Thematic
  Portals" but do **not** appear in the schemes collection at all. This is why the
  transgender row above reads 1 — the programme exists, but not as a findable scheme.
- **Nothing answers a task.** Six of seven top-level nav items name things the Ministry
  has. Nothing answers *am I eligible*, *how do I apply*, *where is my application*,
  *how do I complain*. Grievance is a footer link out to pgportal.gov.in.
- **Compliance.** GIGW 3.0's stated key thrust is "user-centric information architecture";
  its mandatory checkpoint 21 requires myScheme integration. Neither is met.
  `dosje.gov.in/accessibility/` 404s, and both sites return HTTP 200 for pages that
  do not exist.

---

## 3. The one thing every option depends on

An **eligibility model** on every scheme record, **multi-valued on every axis**:

| Axis | Values |
|---|---|
| `community / situation` | sc · obc · dnt · safai · women · senior · trans · destitute · drugs · atrocity · ngo |
| `stage` | school · college · working · senior · any |
| `need` | education · money · home · health · safety · skills |
| `jurisdiction` | Central · a named State · Corporation |
| `applyVia` | portal URL **and** the offline route, plus documents required |

A scheme must be findable under *every* value that applies, at once. That is the
whole point, and it is the reason the existing single-valued tagging cannot give a
truthful answer. **Every option is a view over this model. None works before it exists.**

---

## 4. What exists in the repo now

Reachable at **`/explorations/service-discovery`** — not linked from the public site.

| Path | What it is |
|---|---|
| `apps/hub/src/lib/explorations/registry.ts` | The register. Surfaces → modules → options. Read its header comment first: an option is **never deleted**; a loser becomes `superseded` and says what beat it. |
| `apps/hub/src/components/explorations/ExplorationViewer.tsx` | Maps `surface/module/option` → a prototype component. |
| `apps/hub/src/components/explorations/service-discovery/options.tsx` | Frames each prototype in a `<Stage>` — an **iframe on a fixed 1440×900 canvas, scaled** to the viewer's width. Full-page layouts are not reflowed. |
| `apps/hub/public/prototypes/service-discovery/` | The prototypes themselves — static HTML. `core.css` (tokens + shell), `data.js` (GROUPS, STAGES, NEEDS, SCHEMES, SIGNPOST), `shell.js` (`mountShell(activeNav)`), `personas/`, `emblem.png`. |
| `apps/hub/src/app/prototypes/service-discovery/assistant/` | The assistant option — a real route rendering the design system's own `Chatbot`, not a mock. |

`chatbot.html` in that folder is **dead** — superseded by the assistant route, referenced
by nothing. Left in place rather than deleted without asking.

### The register today — 4 modules, 9 live options

| Module | Option | id |
|---|---|---|
| **The home page** | Explore User Personas (the panel already live) | `personas` |
| | Find Support for You — five questions | `five-questions` |
| | Find Schemes for You — one tap | `one-tap` |
| | What You Need to Do — four tasks | `tasks` |
| | Ask in Your Own Words — plain-language search | `search` |
| **The Schemes page** | Pictures of the nine groups, with cards | `pictures` |
| | Filter panel with a table of schemes | `filter-table` |
| **Leaving for another site** | The link goes straight out (`live: false` — the estate already does this) | `straight-out` |
| | One screen that names the destination | `interstitial` |
| **The assistant** | Samajik Sahayak — the same five questions, in chat | `samajik-sahayak` |

---

## 5. Branch state — read this before touching anything

**`feat/service-discovery-more-options`** — commit `76448566`, **local only, not pushed,
no PR**, checked out in a worktree at
`/private/tmp/claude-502/.../279d7c40-.../scratchpad/wt-sd-options`.

It adds `tasks`, `search` and the whole `hand-off` module, plus two design-system fixes.

> ### It is behind `main` and will conflict.
> PR **#409** (`fix/service-discovery-deck-feedback`) landed after this branch was cut and
> touches **seven of the same files**. First action in the new session:
>
> ```
> git -C <worktree> merge origin/main
> ```
>
> Expect conflicts in `home-b.html`, `home-c.html`, `scheme-a.html`, `scheme-b.html`,
> `ExplorationViewer.tsx`, `options.tsx`, `registry.ts`. **Main wins on content decisions**
> — see §6.

If the worktree has been cleaned up, the branch still exists locally; re-create a
worktree from it rather than starting again.

---

## 6. Decisions that landed after this branch, and bind the polish

From commit `2f9fde4e`, Shailendra's read of the deck:

1. **No scheme counts on prototype screens.** "A scheme count on a prototype screen is a
   number the reader will take as published, and none of ours were meant to be." The
   `134 schemes published`, the running `of 26 still match`, and the `N schemes shown`
   headers all came off.
2. **Per-filter counts on the Schemes page stay** — they are computed from the listed
   schemes, change as filters combine, and are the only thing that warns a reader before
   an empty result.
3. **Option C is "Find Schemes for You"**, not "Find Offerings for You" — on the screen,
   in the register, and in the prototype's `<title>`. "Offerings" is the site's section
   name, not what a citizen is looking for.

> **⚠ The two new screens on the unmerged branch violate rule 1.** `home-d.html` prints
> "N of M schemes are open at this stage" and `home-e.html` prints "Schemes · N shown"
> and "All N schemes listed for …". **Strip these during the merge.** They were written
> before that decision existed.

---

## 7. Design rules that bind the polish

- **Noto Sans, always.** A prototype renders **inside an iframe**, so the hub's `next/font`
  never reaches it. `core.css` now loads the face itself — do not remove that `@import`,
  or every option silently returns to system-ui.
- **Tokens, never literals.** `core.css` holds the palette (including the persona panel's
  own gradient). No prototype page should contain a colour literal; there are currently none.
- **Title Case for all titles** — headings, card titles, page `<title>`. `.claude/rules/ui-restraint-and-copy.md`.
- **Government register.** Plain, formal, factual. Say "the Department", never "we". No
  marketing voice, no literary cadence. Nothing on screen that explains the pipeline
  rather than answering the citizen's question.
- **Routes, not rulings.** No screen and no message may state that a person is eligible.
  The standing line is that a scheme *lists* them as its target group and the sanctioning
  authority decides. `apps/hub/src/lib/chatbot/content.ts` sets this rule out at length —
  read its header before writing any assistant copy.
- **Leaving the estate is always announced.** No button hands a citizen to another site
  silently; one screen names the destination and what will be asked for there.
- **WCAG 2.2 AA + GIGW.** Real `<button>`s for anything clickable, visible focus, keyboard
  operable. An earlier round of these prototypes used `div` + `tabindex` and was not
  keyboard-operable.

---

## 8. Suggested order for the polish session

1. Merge `origin/main` into the branch; resolve the seven conflicts with main winning on
   content decisions (§6).
2. Strip the scheme counts from `home-d.html` and `home-e.html`.
3. Visual pass on all nine options at 1440×900 — that is the canvas the viewer scales, and
   anything taller than 900px is cut off inside the iframe.
4. Check every option against §7, especially keyboard operation and the Title Case rule.
5. Push and open a PR.

### Open questions for the Ministry, not for design

- **Scope:** is this catalogue DoSJE only, or the whole Ministry? The Schemes-page option
  shows DEPwD schemes in the list while the home-page questions route persons with
  disabilities *away* to DEPwD. Both are defensible; they cannot both ship.
- Confirmation of group tags on each scheme — only the administering division can give this.
- Approval of the wording of the community question, which asks a citizen to state caste category.
- Verified helpline numbers. Only **Elderline 14567** is treated as confirmed; every other
  contact names an office instead.

---

## 9. Where the rest of the material is

| Thing | Where |
|---|---|
| Full IA audit and diagnosis (the source of §2) | `docs/research/website-ia-persona-discoverability-2026-08.md` and `.html` |
| Ministry decision note | `docs/research/service-discovery-decision-note-2026-08.html` |
| Figma — finalised options | file `SVMfm1KApR7KYHSbwNBnOM` (MoSJE WIP), frame `4632:158550` "Service Discovery" |
| Figma — design system source of truth | file `Ds5qx61QsI0ZkYSrLKxo0A` (MoSJE Handoff), Home frame `8137:48670` |
| Interactive option canvas (14 artboards) | https://claude.ai/code/artifact/ff52fe6d-7704-423b-96ba-ef44012cdff5 |
| Decision note, published | https://claude.ai/code/artifact/e7951260-4d77-422e-bc23-e56a3cc44fb4 |

**A note on the Figma palette.** The Handoff library publishes values that differ slightly
from the code tokens — Primary/700 `#014b92` against `#004b96`, Secondary `#f97316` against
saffron `#ff671f`, Stroke `#e2e6ea` against `#dcdee1`. **The code tokens are the contract**
(`packages/tokens`); the prototypes follow those. The drift is worth raising, but do not
"fix" code to match Figma without a decision.
