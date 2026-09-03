---
paths:
  - "packages/design-system/**"
  - "apps/hub/src/app/design-system/**"
  - "docs/design-handoffs/**"
---

# The Index is part of the library, not a picture of it (MANDATORY)

**The SAMAVESH Figma library has an `Index` page — 66 cards, one per content page,
each with a preview, a status and a link. It is the only place anyone can see the
whole library at once, which means a stale Index is worse than no Index: it is a
directory that confidently sends people to the wrong place.**

Any change to the library's PAGES updates the Index in the same session. Not
later, not in a follow-up ticket. The same session.

---

## 1. What "stale" cost, the first time

The Index was built on 3 September 2026 and was wrong within a day. It was not
neglect — three separate, entirely reasonable pieces of work landed:

| What happened in the library | What the Index said |
|---|---|
| `Buttons` split into `Button`, `Icon Button`, `Button Group` | one card, `Buttons`, linking to a page that no longer existed |
| `Link` added | nothing |
| `Inputs` split into `Input Field`, `Input Area`, `Select` | one card, `Inputs`, dead |
| `OTP Input` and `Bot Check` added | nothing |
| `Close Button` deprecated | a card presenting it as current |

**Eleven pages the Index did not know about, and three cards pointing at pages
that had gone.** Every one of those changes was good work. None of them was
wrong. The Index was simply not treated as part of the library.

A second class of staleness is quieter and worth naming: **159 nodes were
repointed to different shadow styles, which changed how Buttons, Chips, Navbar,
Close Button and Card render.** No page was added or renamed, so nothing looked
out of date — but eight card previews were pictures of a library that no longer
existed.

---

## 2. The trigger — when this rule fires

Run the procedure in §3 whenever any of these happens:

- a page is **added**, **renamed**, **split**, **merged** or **retired**
- a page's **status changes** — it gains a `— Documentation` frame, publishes its
  first master, or is deprecated
- **a master's appearance changes** in a way a card preview would show: a restyle,
  a token swap, a variant becoming the default
- a page's **group** changes — it moves from Forms & Inputs to Actions, say

The last two are the ones people miss, because nothing about them *looks* like an
Index change.

---

## 3. The procedure

Work in the Figma file, on the `Index` page. Every step is checkable, and the
final step is what proves the work.

1. **Recount, do not recall.** Walk `figma.root.children`, excluding the four
   divider pages, the ten empty group-label pages, `Thumbnail` and `Index`
   itself. That count is the number of content pages.
2. **Diff pages against cards.** Collect every card name from the grids under
   `Groups`. Two lists must come back empty: pages with no card, and cards with
   no page. `Changelog & Governance` is the one deliberate exclusion — it is an
   empty page, and it is recorded as an open item on `Index — Component record`.
3. **Add, remove and regroup cards** so the two lists are empty. A card carries
   four things and all four are mandatory: a **preview**, the **page name**, a
   **status chip**, and a **NODE hyperlink** to that page's landing frame
   (`<Name> — Documentation` where one exists, else its first section or frame).
4. **Refresh the previews that changed** — and only those. Several cards carry a
   deliberately hand-corrected preview (`Sidebar`, `Get Started`, `Side Sheet`
   and `Portal Login Template` are top-cropped; `Ticker` and `SAMAVESH Banner`
   are left-cropped at natural size; `Cursor` is composed from real cursor
   instances; `Divider` uses its white specimen frame). **A blanket re-export
   destroys all of them.**
5. **Update the stat line** — pages, components, and the date it was counted.
   The date is not decoration: it tells the next reader how much to trust the
   rest.
6. **Update the group header counts.** Derive them from what is on the page, not
   from what you meant to put there.
7. **Verify.** The pass condition is all of: zero pages with no card, zero cards
   with no page, zero cards with no preview, zero dead links, and — because the
   Index is a documentation surface — zero unbound fills, zero unstyled text and
   zero raw spacing values. See `documentation-ds-linkage.md`.
8. **Record anything you could not fix** on `Index — Component record`, in the
   shape that frame already uses: open items only, each naming its evidence.

---

## 4. The status ladder — derived, never invented

There is no status field in Figma. Every chip is read off the page itself, which
is why the Index doubles as a progress view nobody has to maintain:

| Chip | Means | Decided by |
|---|---|---|
| **Ready** | Built, and its page explains it | publishes a master **and** has a `— Documentation` frame |
| **Published** | Placeable; page not written | publishes a master, no documentation frame |
| **Older format** | Still on the pre-2.0 page shape | no documentation frame, never had masters |
| **Reference** | Something to read, nothing to place | no master on the page |
| **Deprecated** | Superseded; place nothing new | the page or its master says so |

**Do not hand-assign a chip.** If a page's status seems wrong, the fix is on that
page — write its documentation frame, publish its master — not on the Index.

---

## 5. Copy on a card

Two lines, and the second one is one sentence.

- **The name is the page name, exactly.** Including a `⛔` prefix if the page
  carries one. A card that renames its page is a card nobody can search for.
- **The purpose is what the page holds**, in the register of
  `ui-restraint-and-copy.md`: plain, formal, one line. "Single-line text entry,
  with hint, error and character count." Not "Powerful, flexible text input."
- **Say what it is, not what it is for**, when the two differ — `Cursor` is
  "cursor art, for documenting an interaction", not "cursors".

---

## 6. Why there is no gate yet, and what one would look like

This estate's own lesson is that a rule without a gate is worth nothing after
three weeks — `ds-documentation-standard.md` measured exactly that. So the honest
statement is that **this rule is currently advisory, and it will decay**.

A gate is possible and should be built. It cannot be an offline check: the Index
indexes *Figma pages*, and the repository has no idea what pages the file has.
It has to be the same secret-guarded shape `tools/figma-doc-parity/check.mjs`
already uses for its `--verify-figma` mode:

1. `GET /v1/files/{key}?depth=1` — the page list, one cheap call.
2. `GET /v1/files/{key}/nodes?ids={indexPageId}` — the Index subtree, to read
   the card names out of the grids.
3. Fail when either difference is non-empty, printing the page names.

It needs `FIGMA_ACCESS_TOKEN`, so it runs where `check:code-connect` and
`check:figma-docs:live` already run, and skips with a notice when the secret is
absent. Until that exists, §3 is a checklist a human or an agent runs by hand.

---

## Checklist

- [ ] Content pages recounted from the file, not recalled
- [ ] Zero pages without a card; zero cards without a page
- [ ] Every card has a preview, a name, a status chip and a live NODE link
- [ ] Only genuinely-changed previews re-exported; the hand-corrected ones intact
- [ ] Stat line updated, including the date it was counted
- [ ] Group header counts derived from the page
- [ ] Status chips derived from evidence, not assigned
- [ ] Zero unbound fills, unstyled text or raw spacing on the Index
- [ ] Anything unfixed written onto `Index — Component record`
