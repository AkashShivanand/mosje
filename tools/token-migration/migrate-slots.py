#!/usr/bin/env python3
"""
Move the older `--sa-color-*` semantic tier onto the slot grammar.

This is the second half of the vocabulary consolidation. The first retired `--ds-*`; this one
retires the flat semantic names that sat beside the slots saying the same thing — `--sa-color-
text-default` next to `--sa-text-neutral-base`, both #1e2124. Two names for one value is the
condition that made the last two documentation bugs possible.

SCOPE, measured rather than assumed. Of 1,186 `--sa-color-*` references in source:
  · 162  palette ramps and alpha  — legitimate Tier 2, the palette itself. LEFT ALONE.
  ·  31  brand identity constants — navy, saffron, yellow. No slot form. LEFT ALONE.
  · 993  the older semantic tier  — 21 distinct tokens. THIS IS THE TARGET.

SAFETY. A replacement is applied only where the target is VALUE-IDENTICAL in the slot the CSS
property implies. Where no value-identical slot token exists the usage is left untouched and
reported, because the alternative is a silent visual change:

  --sa-color-action-primary-default is #0373df (primaryScale/500). The slot ladder's
  bg/brand/primary/bolder is #005eb9 (/600). Migrating it as a BACKGROUND would repaint every
  primary button across 20 portals — and improve its contrast from 4.64:1 to 6.36:1, which is
  a design decision, not a rename. It is left for a human.

Run with --apply to write. Without it, reports only.
"""
import os, re, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSS = os.path.join(ROOT, "packages/tokens/dist/tokens.css")

SKIPDIR = {"node_modules", "dist", "storybook-static", ".next", "out", "coverage",
           ".git", "worktrees", "_backups", "Incoming"}
SKIPFILE = {"tokens.css", "tokens.ts", "ux4g.css", "tailwind-preset.cjs"}


def load():
    css = open(CSS, encoding="utf8").read()
    i = css.index(":root {"); j = css.index("{", i); k = css.index("\n}", j)
    decl = dict(re.findall(r"(--[\w-]+):\s*([^;]+);", css[j:k]))

    def resolve(n, depth=0):
        v = decl.get(n)
        if v is None or depth > 16:
            return None
        v = v.strip()
        m = re.fullmatch(r"var\((--[\w-]+)\)", v)
        return resolve(m.group(1), depth + 1) if m else v

    return decl, resolve


DECL, RESOLVE = load()

SLOT_PREFIX = {"bg": "--sa-bg-", "text": "--sa-text-", "border": "--sa-border-",
               "icon": "--sa-icon-", "on": "--sa-on-"}

# Which slot a CSS property implies. Anything not listed has no slot and is skipped.
PROP_SLOT = {}
for p in ("color", "-webkit-text-fill-color", "caret-color", "text-decoration-color"):
    PROP_SLOT[p] = "text"
for p in ("background", "background-color", "backgroundcolor"):
    PROP_SLOT[p] = "bg"
for p in ("border", "border-color", "bordercolor", "border-top", "border-bottom", "border-left",
          "border-right", "bordertop", "borderbottom", "borderleft", "borderright",
          "outline", "outline-color", "outlinecolor", "border-top-color", "border-bottom-color"):
    PROP_SLOT[p] = "border"
for p in ("fill", "stroke"):
    PROP_SLOT[p] = "icon"

# The 21 tokens in scope. Ramps, alpha, a11y and brand constants are deliberately absent.
IN_SCOPE = [n for n in DECL
            if n.startswith("--sa-color-")
            and not re.search(r"Scale-\d+$", n)
            and "-transparent-" not in n
            and "-a11y-" not in n
            and not n.startswith("--sa-color-brand-")]

# `text/onPrimary` is the measured-ink contract, which is the system's strongest safety
# property — it must land on the `on/*` token, not on a neutral that happens to share #ffffff.
EXPLICIT = {("--sa-color-text-onPrimary", "text"): "--sa-on-bg-brand-primary-bolder"}

# Prefer the most specific slot name when several share a value: a role name beats a link state.
PREFERENCE = ("--sa-text-neutral-", "--sa-text-brand-", "--sa-text-status-",
              "--sa-bg-status-", "--sa-bg-brand-", "--sa-bg-neutral-",
              "--sa-border-status-", "--sa-border-brand-", "--sa-border-neutral-",
              "--sa-icon-status-", "--sa-icon-brand-", "--sa-icon-neutral-", "--sa-on-")


def target_for(name, slot):
    """The value-identical slot token, or None if there isn't one."""
    if name not in IN_SCOPE or slot not in SLOT_PREFIX:
        return None
    if (name, slot) in EXPLICIT:
        return EXPLICIT[(name, slot)]
    value = RESOLVE(name)
    if value is None:
        return None
    cands = [n for n in DECL if n.startswith(SLOT_PREFIX[slot]) and RESOLVE(n) == value]
    if not cands:
        return None
    for pref in PREFERENCE:
        hit = sorted(c for c in cands if c.startswith(pref))
        if hit:
            return hit[0]
    return sorted(cands)[0]


DECL_RE = re.compile(r"(?P<prop>[-a-zA-Z]+)\s*:\s*(?P<val>[^;{}\n]*)")
TOKEN_RE = re.compile(r"--sa-color-[A-Za-z0-9-]+")

applied = collections.Counter()
skipped = collections.Counter()


def migrate(text):
    def in_decl(m):
        prop = m.group("prop").strip().lower()
        val = m.group("val")
        if "--sa-color-" not in val:
            return m.group(0)
        slot = PROP_SLOT.get(prop)

        def sub(t):
            name = t.group(0)
            if name not in IN_SCOPE:
                return name
            if slot is None:
                skipped[(name, f"property '{prop}' implies no slot")] += 1
                return name
            tgt = target_for(name, slot)
            if not tgt:
                skipped[(name, f"no value-identical {slot} slot token")] += 1
                return name
            applied[(name, tgt)] += 1
            return tgt

        return m.group(0).replace(val, TOKEN_RE.sub(sub, val))

    text = DECL_RE.sub(in_decl, text)
    for t in TOKEN_RE.finditer(text):
        if t.group(0) in IN_SCOPE:
            skipped[(t.group(0), "no property context")] += 1
    return text


def walk():
    for r, dirs, fs in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIPDIR]
        if "/public/storybook/" in r + "/" or "/.claude/" in r + "/":
            continue
        for f in fs:
            if f.endswith((".tsx", ".ts", ".css")) and f not in SKIPFILE:
                yield os.path.join(r, f)


def main():
    apply = "--apply" in sys.argv
    touched = []
    for p in walk():
        src = open(p, encoding="utf8").read()
        if "--sa-color-" not in src:
            continue
        out = migrate(src)
        if out != src:
            touched.append(os.path.relpath(p, ROOT))
            if apply:
                open(p, "w", encoding="utf8").write(out)

    print(f"{'APPLIED' if apply else 'DRY RUN'}: {len(touched)} files")
    print(f"  migrated to the slot grammar : {sum(applied.values())} refs, "
          f"{len(set(a for a, _ in applied))} distinct tokens")
    print(f"  LEFT ALONE                   : {sum(skipped.values())} refs\n")
    print("  applied:")
    for (a, b), c in applied.most_common(12):
        print(f"    {c:4d}  {a}  ->  {b}")
    print("\n  left alone, and why:")
    for (a, why), c in skipped.most_common(12):
        print(f"    {c:4d}  {a}  ({why})")


if __name__ == "__main__":
    main()
