#!/usr/bin/env python3
"""
Retire the legacy `--ds-*` token vocabulary in favour of canonical Tier-2 `--sa-*` names.

The rule is alias-following, so the migration is value-preserving by construction:
every `--ds-X` is replaced by the token it already resolves to. The one exception is
the 44 legacy names that alias straight into Tier-1 `--sa-ref-*`, which design.md bans
in app code; those are mapped to a Tier-2 token of the SAME VALUE, chosen by the CSS
property at the call site (padding vs gap vs margin want different purpose scales).

Run with --apply to write. Without it, reports only.
"""
import re, os, sys, json, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOKENS_CSS = os.path.join(ROOT, "packages/tokens/dist/tokens.css")

SKIPDIR = {"node_modules", "dist", "storybook-static", ".next", "out", "coverage",
           ".git", "worktrees", "_backups", "Incoming", "tool-results"}
SKIPFILE = {"tokens.css", "tokens.ts", "ux4g.css", "tailwind-preset.cjs"}
EXTS = (".tsx", ".ts", ".css")


def load_tokens():
    css = open(TOKENS_CSS, encoding="utf8").read()
    i = css.index(":root {"); j = css.index("{", i); k = css.index("\n}", j)
    decl = dict(re.findall(r"(--[\w-]+):\s*([^;]+);", css[j:k]))

    def hop(n):
        m = re.fullmatch(r"var\((--[\w-]+)\)", decl.get(n, "").strip())
        return m.group(1) if m else None

    def resolve(n, d=0):
        v = decl.get(n)
        if v is None or d > 16:
            return None
        v = v.strip()
        m = re.fullmatch(r"var\((--[\w-]+)\)", v)
        return resolve(m.group(1), d + 1) if m else v

    return decl, hop, resolve


DECL, HOP, RESOLVE = load_tokens()

# ── property → which purpose scale a spacing value belongs to ──────────────
PAD = ("padding", "paddingtop", "paddingbottom", "paddingleft", "paddingright",
       "paddingblock", "paddinginline", "padding-top", "padding-bottom",
       "padding-left", "padding-right", "padding-block", "padding-inline")
STACK = ("gap", "rowgap", "row-gap", "margintop", "marginbottom", "margin-top",
         "margin-bottom", "marginblock", "margin-block", "top", "bottom", "height",
         "minheight", "min-height", "maxheight", "max-height", "translate")
INLINE = ("columngap", "column-gap", "marginleft", "marginright", "margin-left",
          "margin-right", "margininline", "margin-inline", "left", "right", "width",
          "minwidth", "min-width", "maxwidth", "max-width")

FAMILIES = {
    "padding": "--sa-padding-",
    "stack": "--sa-stack-",
    "inline": "--sa-inline-",
    "section": "--sa-section-",
}


def value_index(prefix):
    out = {}
    for n in DECL:
        if n.startswith(prefix):
            out.setdefault(RESOLVE(n), n)
    return out


VIDX = {k: value_index(v) for k, v in FAMILIES.items()}
SHAPE = value_index("--sa-shape-")
ELEV = value_index("--sa-elevation-")
MOTION = value_index("--sa-motion-")
FONT = {
    "--sa-ref-font-family-latin": "--sa-font-latin",
    "--sa-ref-font-family-display": "--sa-font-display",
    "--sa-ref-font-family-mono": "--sa-font-mono",
    "--sa-ref-font-family-devanagari": "--sa-font-devanagari",
}


def spacing_target(value, prop):
    """Pick the Tier-2 purpose scale for a spacing value, given the CSS property."""
    p = (prop or "").lower()
    if p in PAD:
        order = ["padding", "section", "stack", "inline"]
    elif p in INLINE:
        order = ["inline", "padding", "stack", "section"]
    elif p in STACK:
        order = ["stack", "section", "padding", "inline"]
    else:
        order = ["stack", "padding", "section", "inline"]
    for fam in order:
        hit = VIDX[fam].get(value)
        if hit:
            return hit
    return None


# ── tokens that are referenced but were never declared (live bugs) ─────────
DANGLING = {
    "--ds-space-2": ("stack", "8px"),   "--ds-space-3": ("stack", "12px"),
    "--ds-space-4": ("stack", "16px"),  "--ds-space-5": ("stack", "20px"),
    "--ds-space-6": ("stack", "24px"),  "--ds-space-8": ("stack", "32px"),
    "--ds-space-10": ("stack", "40px"), "--ds-space-12": ("stack", "48px"),
}
DANGLING_DIRECT = {
    "--ds-ink-hint": "--sa-text-neutral-subtle",
    "--ds-line": "--sa-border-neutral-subtle",
    "--ds-border-control": "--sa-border-neutral-bolder-default",
    "--ds-radius-pill": "--sa-shape-full",
    "--ds-danger-strong": "--sa-text-status-error-base",
    "--ds-text-label-2": "--sa-type-label-2-size",
    "--ds-leading-label-2": "--sa-type-label-2-lh",
    "--ds-leading-headline5": "--sa-type-headline-5-lh",
    "--ds-duration-normal": "--sa-motion-enter-duration",
}
# component-scoped locals: not tokens, but must lose the retired --ds- prefix
LOCAL_PREFIX = {
    "--ds-appsw-safe-area": "--cmp-appsw-safe-area",
    "--ds-appsw-sticky-offset": "--cmp-appsw-sticky-offset",
    "--ds-demodock-content-floor": "--cmp-demodock-content-floor",
    "--ds-demodock-bottom": "--cmp-demodock-bottom",
    "--ds-card-span": "--cmp-card-span",
    "--ds-header-h": "--cmp-header-h",
}

unresolved = collections.Counter()


def target_for(name, prop):
    if name in LOCAL_PREFIX:
        return LOCAL_PREFIX[name]
    if name in DANGLING_DIRECT:
        return DANGLING_DIRECT[name]
    if name in DANGLING:
        _, value = DANGLING[name]
        return spacing_target(value, prop)
    if name not in DECL:
        unresolved[name] += 1
        return None
    # follow the alias chain out of the legacy namespace entirely — several
    # --ds-text-* names hop to another --ds-* (the --ds-type-* ramp) first.
    t = HOP(name)
    seen = {name}
    while t is not None and t.startswith("--ds-") and t not in seen:
        seen.add(t)
        t = HOP(t)
    if t is None or t.startswith("--ds-"):
        unresolved[name] += 1
        return None
    if not t.startswith("--sa-ref-"):
        return t                                  # already canonical Tier 2
    value = RESOLVE(name)
    if t.startswith("--sa-ref-space-"):
        return spacing_target(value, prop)
    if t.startswith("--sa-ref-radius-"):
        return SHAPE.get(value)
    if t.startswith("--sa-ref-shadow-"):
        return ELEV.get(value)
    if t.startswith("--sa-ref-motion-"):
        return MOTION.get(value)
    if t.startswith("--sa-ref-font-family-"):
        return FONT.get(t)
    unresolved[name] += 1
    return None


DECL_RE = re.compile(r"(?P<prop>[-a-zA-Z]+)\s*:\s*(?P<val>[^;{}\n]*)")
TOKEN_RE = re.compile(r"--ds-[a-z0-9-]+")

stats = collections.Counter()
changed_tokens = collections.Counter()


def migrate_text(text):
    def in_decl(m):
        prop = m.group("prop")
        val = m.group("val")
        if "--ds-" not in val:
            return m.group(0)

        def sub(t):
            name = t.group(0)
            tgt = target_for(name, prop)
            if not tgt:
                stats["unresolved"] += 1
                return name
            stats["replaced"] += 1
            changed_tokens[(name, tgt)] += 1
            return tgt

        return m.group(0).replace(val, TOKEN_RE.sub(sub, val))

    text = DECL_RE.sub(in_decl, text)

    # second pass: anything left has no property context (template strings, JS)
    def loose(t):
        name = t.group(0)
        tgt = target_for(name, None)
        if not tgt:
            stats["unresolved"] += 1
            return name
        stats["replaced_no_context"] += 1
        changed_tokens[(name, tgt)] += 1
        return tgt

    return TOKEN_RE.sub(loose, text)


def walk():
    for r, dirs, fs in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIPDIR]
        if "/public/storybook/" in r + "/" or "/.claude/" in r + "/":
            continue
        for f in fs:
            if f.endswith(EXTS) and f not in SKIPFILE:
                yield os.path.join(r, f)


def main():
    apply = "--apply" in sys.argv
    touched = []
    for p in walk():
        src = open(p, encoding="utf8").read()
        if "--ds-" not in src:
            continue
        out = migrate_text(src)
        if out != src:
            touched.append(os.path.relpath(p, ROOT))
            if apply:
                open(p, "w", encoding="utf8").write(out)
    print(f"{'APPLIED' if apply else 'DRY RUN'}: {len(touched)} files")
    print(f"  replaced (with property context) : {stats['replaced']}")
    print(f"  replaced (no property context)   : {stats['replaced_no_context']}")
    print(f"  UNRESOLVED                       : {stats['unresolved']}")
    if unresolved:
        print("\n  unresolved tokens:")
        for n, c in unresolved.most_common():
            print(f"    {c:4d}  {n}")
    with open(os.path.join(ROOT, "tools/token-migration/mapping.json"), "w") as fh:
        json.dump({f"{a} -> {b}": c for (a, b), c in changed_tokens.most_common()}, fh, indent=1)
    print(f"\n  distinct mappings used: {len(changed_tokens)} (written to tools/token-migration/mapping.json)")


if __name__ == "__main__":
    main()
