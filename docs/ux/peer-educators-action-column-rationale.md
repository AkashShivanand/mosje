# Action Column Redesign — Rationale

**Module:** NMBA Treatment Centre · CPLI → Peer Educators
**Audience:** Ministry / Department review
**Decision:** Replace the five coloured action buttons with two inline icons plus a labelled "More actions" menu.

---

## Summary

The current screen shows five full-colour buttons in every row — *Upload Volunteers, View Training, View Volunteers, Edit, Delete*. The proposed design keeps everything that works (clear labels, large targets, an unmistakable Delete) and removes what those five buttons cost: visual noise, mobile breakage, decorative colour, and accessibility gaps.

Nothing is taken away. The labels still exist — on the menu items and in every control's screen-reader name.

---

## What the current design does well (and we kept)

- **Every action is labelled** — discoverable, low cognitive load.
- **Large click targets** and a **clearly red Delete**.

Both are preserved: 36px targets, a red destructive tone, and visible text on every option.

---

## What the five-button row costs — and how the new design fixes it

| Criterion (what matters to the client) | Current: 5 colour-filled buttons | Proposed: 2 inline icons + labelled menu |
| --- | --- | --- |
| Visual hierarchy | Four identical green buttons compete; nothing is primary | Delete (red) and Edit (amber) stand out; routine actions recede |
| Colour use (DBIM) | Green = "success/go" applied to View and Edit; saturated green + red on every row | Colour encodes meaning (danger / edit / neutral) — DBIM's restrained identity |
| Data scannability | The eye fights five loud buttons per row to read the record | Quiet rows; the data is the focus, not the chrome |
| Mobile / smaller screens | Roughly five wide buttons force horizontal scroll or squeeze columns | Compact; the record stays readable on a phone |
| Scalability | A sixth action breaks the row layout | Actions added to the menu indefinitely — no layout change |
| Accessibility (GIGW 3.0 / WCAG 2.1 AA) | Labels present, but focus indicators, contrast hierarchy and keyboard semantics are not guaranteed | Visible 3:1 focus rings, AA contrast, full keyboard menu (arrows / Home / End / Escape, focus return) |
| Estate consistency | One-off per page | One pattern reused across all twenty portals |

---

## The likely objection — and the answer

**"You have hidden actions behind a menu — that is a click we did not have before."**

True, and the design accounts for it:

1. The two most frequent, destructive-sensitive actions — **Edit and Delete — stay visible and one click away.**
2. The three secondary actions are one **predictable, labelled** click away. This is **progressive disclosure**, the standard pattern in modern government and enterprise admin tables (GOV.UK, USWDS, DBIM-aligned systems).
3. It is a deliberate trade: **one extra click on occasional actions** in exchange for **every row being scannable on every screen** — a net gain for operators who spend their day reading these tables.

It is also tunable. If usage shows a secondary action is used constantly, it is promoted back inline. If maximum discoverability is required for low-digital-literacy users, labels can be surfaced on the inline controls too. The pattern flexes; a fixed wall of buttons does not.

---

## Standards alignment

- **GIGW 3.0** — conformant to its WCAG 2.1 Level AA basis: accessible names, visible focus, AA contrast, keyboard operability, and finger-sized targets.
- **DBIM** — restrained, consistent identity; colour carries meaning rather than decoration.
- **Design-system reuse** — the action pattern and the underlying data table are shared components, so the same accessibility and brand guarantees apply across the whole MoSJE estate.

---

## Recommendation

Adopt the proposed pattern. It preserves the strengths of the current screen, resolves its accessibility and mobile shortcomings, aligns with GIGW and DBIM, and scales to future actions without redesign.
