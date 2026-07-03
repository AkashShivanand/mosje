# Design Audit — User Guide

**For anyone.** You do not need to be technical, write any files, or run any commands.
You describe what you want in plain English; the assistant does everything else.

---

## What this does

It compares a **live website** to its **Figma design**, screen by screen, and tells you where the
build drifts from the design — wrong colours, fonts, spacing, radii, off-token components — across
every screen and every user role. It produces a documented report you can hand to developers.

It is honest about its limits: the fast machine pass is labelled **MACHINE-DRAFT** and is *not* a
legal accessibility/compliance certificate. The things only a human can judge (keyboard use, screen
readers, local-language content, brand sign-off) are clearly marked as still needing a person.

---

## Run an audit — just ask

### The portal that's already set up (NHAPOA)
Paste this into a chat with the assistant, in the project:

> **Run a design audit on the NHAPOA portal and give me the report.**

That's the whole thing. It logs in as every role, captures every screen, checks every element, and
gives you the report.

### Any other website
Fill in the blanks and paste it. The assistant sets everything up for you automatically.

```
Run a design audit on our <portal name>.

Design (Figma): <paste the Figma link>
Live site: <paste the website URL>   (admin login page: <paste URL> — only if it's separate)

Logins (skip this line if the site is public):
<Role name> = <username> / <password>
<Role name> = <username> / <password>

Just compare the built site to the Figma design and give me the report.
```

The only things it ever needs from you: **the design, the site, and the logins.**

---

## What you get

Everything lands in `tools/design-audit/projects/<name>/out/`:

| File | What it is |
|------|-----------|
| `…-MACHINE-DRAFT.pdf` | The report — cover summary + per-screen findings, each pinned on the screenshot |
| `coverage-ledger.json` | Proof every design screen was reached (or an honest list of what wasn't) |
| `conformance.json` | The full list of off-design-token elements + the DS-adoption score |
| `audit-master.json` | The machine-readable source of the report |

---

## How to read the report (the cover)

- **DS-ADOPTION %** — how much of the build uses the official design-system tokens. Higher is better.
  A low number means developers are hand-rolling styles instead of using the design system.
- **FRAMES COVERED / UNMAPPED** — how many design screens were matched to a live screen. **UNMAPPED
  is coverage debt** (a designed screen nobody could reach/capture).
- **COVERAGE GATE: PASS/FAIL** — FAIL means at least one design screen was never reached. Fix that
  before trusting completeness.
- **BUILD-ONLY** — screens that exist in the build but not the design (usually fine; they go to a
  separate design-suggestions list, not counted as defects).
- **FINDINGS** — the count of issues, split by severity (Blocker / Major / Minor / Nit).

Each finding card is stamped:
- **🤖 machine** — checked deterministically by the tool. Trustworthy for what it measures.
- **👤 human** — needs a person to confirm (judgment, accessibility experience, content, brand).

The status badge is **MACHINE-DRAFT** until a human signs off the 👤 items — then it can become
**CERTIFIED**. The report *cannot* print CERTIFIED on its own; that's deliberate.

---

## What a human still needs to do (to reach CERTIFIED)

The machine draft covers ~70% of the checks. A reviewer then does the rest (~1 hour once, less as the
design system gets adopted):

1. **Confirm the flagged judgment calls** (right component? right icon? hierarchy?).
2. **Accessibility pass** — actually navigate by keyboard and listen with a screen reader.
3. **Content pass** — real data, Hindi/RTL text, truncation, missing translations.
4. **Brand / GIGW sign-off** — emblem, official logos, mandatory government elements.

Only after these is the portal genuinely "certified."

---

## Common questions

**Do I need to install anything?** No. The first run auto-installs the browser and PDF tools (that
run takes a couple of extra minutes; later runs are fast).

**Where do the passwords go? Are they safe?** Into a `secrets.json` file that is **git-ignored** — it
never gets uploaded or committed. You give the logins in chat once; the assistant stores them locally.

**A login failed — what now?** Government/UAT sites often rate-limit rapid logins. Just ask the
assistant to "retry that role" after a couple of minutes. If the login form is unusual, the assistant
auto-detects it; tell it the exact login page URL if it can't.

**It says MACHINE-DRAFT, not CERTIFIED — is that a bug?** No. That's the honesty rule: a machine can't
certify accessibility. It stays MACHINE-DRAFT until a person signs the human checks.

**Can I audit a site with no Figma / no design system?** Yes. Say so — the tool falls back to checking
the build's *internal consistency* (flagging outliers) instead of comparing to a design.

**How do I re-run after developers fix things?** Just ask again: "re-run the NHAPOA audit." It
re-checks everything and you compare the new numbers.

---

## For maintainers

The plain-English flow above is powered by a small, config-driven engine. See **`HOW-IT-WORKS.md`**
for the model and architecture, and **`README.md`** for the engine reference and manual commands.
