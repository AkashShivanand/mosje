# Government standards — consult `docs/guidelines/` (MANDATORY)

**`docs/guidelines/` is the standards library for this estate.** It holds the four Government
of India standards MoSJE builds against, each as a source PDF plus a faithful, greppable
markdown transcription:

| Folder | Standard | Binding? |
| --- | --- | --- |
| `GIGW-3.0/` | Guidelines for Indian Government Websites and Apps | **Mandatory** |
| `DBIM-3.0/` | Digital Brand Identity Manual v3 | **Mandatory (brand)** |
| `UX4G-3.0/` | UX4G Design System 3.0 | **Recommended** |
| `GuDApps/` | Guidelines for Development of e-Governance Applications | Best practice |

Read `docs/guidelines/README.md` first — it carries the routing table ("I'm about to pick a
colour → read this"), the precedence ladder, and the register of deliberate divergences.

## The rule

1. **Consult the library before building or reviewing UI**, not after. For any page, component
   or portal screen, the relevant section is read *before* the first line of code — the same
   way the DS audit in `CLAUDE.md` happens before implementation, and alongside it.
2. **Follow what can be followed without regressing the shipping design system.** That is the
   whole instruction, and it splits three ways:

   | Class | What it looks like | What you do |
   | --- | --- | --- |
   | **Accessibility / legal** | Contrast, `lang`, one `<h1>`, heading order, keyboard operation, visible focus, 44×44px targets, 16px body minimum, alt text, rem sizing | **Adopt. No exceptions.** If the design system conflicts, the design system changes. |
   | **Structural** | Base-4 spacing, radius and elevation scales, z-index ladder, semantic token roles, error-message formula, consent rules, P-01…P-09 journey patterns | **Adopt**, unless the DS already satisfies it another way. Express it in `--sa-*` token names, never `--ux4g-*`. |
   | **Brand / aesthetic** | UX4G's violet primary, its amber secondary, its exact shadow values, its default icon variant | **Do not adopt.** DBIM and the SAMAVESH design system set MoSJE's brand. |

3. **Never weaken a requirement to make something pass.** If a guideline is genuinely not
   followed, that is a decision, and a decision gets written down.
4. **Record every divergence** in the "Known, deliberate divergences" table in
   `docs/guidelines/README.md`, in the same change that creates it. Five are already recorded
   (UX4G's violet primary, the icon variant, the un-installed package, the token namespace, the
   code-only `dbim` mode). An undocumented conflict gets rediscovered later as a bug.
5. **Cite the clause.** Every compliance claim, review finding or commit rationale names its
   source: `[GIGW 5.2]`, `[DBIM 3.7]`, `[UX4G Typography §2.7]`, `[GuDApps 4]`. A finding with
   no clause is an opinion.

## Source vs. gate — don't confuse them

- `docs/guidelines/` is the **source**: what the standards actually say.
- `docs/compliance/COMPLIANCE-CHECKLIST.md` is the **gate**: the enforceable merge of them, with
  the MoSJE DBIM audit's known failures marked ⚠️.
- `.claude/skills/gov-compliance/SKILL.md` **operates** the gate, in build mode and audit mode.

Audit work runs through the skill. This rule is about the half that comes first — having read
the source before you had an opinion.

## Keeping the library current

- **UX4G has no PDF and no release tags.** It is a live site, so `UX4G-3.0/` carries a capture
  date instead of a version. It goes stale silently. Re-capture from the Sources table at the
  bottom of `UX4G_3.0_Design_System.md`, and re-run
  `node tools/ux4g-conformance/extract-ux4g-tokens.mjs` for the token half — that diff is the
  upgrade surface.
- **Adding a standard** follows the folder shape documented at the bottom of
  `docs/guidelines/README.md`: underscored filenames, a README, a transcription opening with a
  fidelity note, and a row in the index table.
- **Don't scatter copies.** Our own work products about these standards (`docs/ux4g/`,
  `docs/compliance/`, `tools/ux4g-conformance/`) stay where they are. `docs/guidelines/` holds
  the sources only.
