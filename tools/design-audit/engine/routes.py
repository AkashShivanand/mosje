"""A crawl finds what the navigation links. It cannot find what the navigation omits.

This is the gap that produced the SMILE Beggary miss. `discover_routes` reads the
anchors on the page, so a route the sidebar does not link is invisible to it — and
absence from the crawl was then read as absence from the portal. Three screens were
recorded as "the live portal does not serve this" when it served all three:

    /do-list                    Implementing Authority / Nodal Officers
    /ia-approvals               Pending IA Approvals
    /shelter-homes/checklist    Swashraya (Shelter Home) Facility Checklist

Two more were worse than missing. `/surveyors` and `/master-setting/shelter-homes`
were treated as duplicate routes onto screens that already existed, and redirected
away — so the clone actively hid a surveyor register and a shelter master that the
live portal serves.

Nothing about the crawl was broken. It answered the question it was asked. The fix
is to also ask a second question: **of the routes we have been told exist, which did
the crawl not reach?** A route named in the config is PROBED whether or not anything
links to it, and one that is named but yields nothing is reported rather than
quietly dropped.

Declared routes come from two places, unioned:

  * `live.declaredRoutes`      — routes every role should be probed for
  * `<role>.declaredRoutes`    — routes only that role can see

Both are ordinary lists of paths. `skipRoutes` still wins over both: a route
deliberately excluded stays excluded however it was named.
"""

from typing import Dict, Iterable, List, Optional, Sequence, Tuple

#: How a route came to be in the capture list. Recorded per route so a run can say
#: which screens the navigation would never have led anyone to.
LINKED = "linked"
DECLARED = "declared"
CARRIED = "carried"
LANDING = "landing"


def _clean(paths: Iterable[str]) -> List[str]:
    """Normalise to leading-slash paths, drop empties and duplicates, keep order."""
    out: List[str] = []
    for p in paths or []:
        if not isinstance(p, str):
            continue
        p = p.strip().split("#")[0].split("?")[0]
        if not p:
            continue
        if not p.startswith("/"):
            p = "/" + p
        if len(p) > 1:
            p = p.rstrip("/")
        if p not in out:
            out.append(p)
    return out


def declared_for(cfg: dict, role: Optional[dict] = None) -> List[str]:
    """Every route declared for this role — the project's list plus the role's own.

    `skipRoutes` is applied here rather than at the call site, so a declared route
    that is also skipped cannot slip back in through the declaration.
    """
    live = cfg.get("live", {}) or {}
    declared = _clean(live.get("declaredRoutes", []))
    if role:
        for r in _clean(role.get("declaredRoutes", [])):
            if r not in declared:
                declared.append(r)
    skip = set(_clean(live.get("skipRoutes", [])))
    return [r for r in declared if r not in skip]


def merge(discovered: Sequence[str], declared: Sequence[str],
          landing: Optional[str] = None) -> Tuple[List[str], Dict[str, str]]:
    """Combine what the crawl found with what the config declares.

    Returns the route list to capture, and how each route got there. The crawl's
    order is preserved — it reflects the navigation, which is the order a reader
    meets the screens — and declared-only routes follow it.
    """
    origins: Dict[str, str] = {}
    routes: List[str] = []

    if landing:
        for l in _clean([landing]):
            routes.append(l)
            origins[l] = LANDING

    for r in _clean(discovered):
        if r not in origins:
            routes.append(r)
            origins[r] = LINKED

    for r in _clean(declared):
        if r not in origins:
            routes.append(r)
            origins[r] = DECLARED

    return routes, origins


def add_carried(routes: List[str], origins: Dict[str, str], carried: Sequence[str]) -> List[str]:
    """Fold in routes seen in a previous run. Returns the ones actually added."""
    added = []
    for r in _clean(carried):
        if r not in origins:
            routes.append(r)
            origins[r] = CARRIED
            added.append(r)
    return added


def report(origins: Dict[str, str], captured_paths: Iterable[str],
           declared: Sequence[str]) -> dict:
    """What the navigation would have hidden, and what a declaration failed to reach.

    `unlinked` is the finding this module exists for: a route that EXISTS and was
    captured, but which nothing on the site links to. It is not an error — plenty of
    real screens are reached by a button — but it is the set a link-following crawl
    would have missed, and a run that does not name it invites the same mistake again.

    `unreachable` is a declared route that produced no capture. That IS a problem:
    either the declaration is wrong, or a screen the audit was told to cover is down.
    """
    captured = set(_clean(captured_paths))
    declared_set = set(_clean(declared))

    unlinked = sorted(r for r in captured
                      if origins.get(r) == DECLARED and r in declared_set)
    unreachable = sorted(r for r in declared_set if r not in captured)
    linked = sorted(r for r in captured if origins.get(r) in (LINKED, LANDING))

    return {
        "declared": sorted(declared_set),
        "linked": linked,
        "unlinked": unlinked,
        "unreachable": unreachable,
        "counts": {
            "declared": len(declared_set),
            "captured": len(captured),
            "linked": len(linked),
            "unlinked": len(unlinked),
            "unreachable": len(unreachable),
        },
        # A declared route that captured nothing fails the run. An unlinked one does
        # not — it is information, and the whole point of having probed it.
        "gate": "FAIL" if unreachable else "PASS",
        "note": (
            "DECLARED = a route named in audit.config.json, probed whether or not anything "
            "links to it. UNLINKED = captured, but no anchor on the site points at it — the "
            "set a link-following crawl would have missed. UNREACHABLE = declared and captured "
            "nothing: either the declaration is wrong or the screen is down. Declaring a route "
            "is how a screen the navigation omits stays in the audit."
        ),
    }


def summarise(rep: dict) -> str:
    """One block for the run log. Silent when there is nothing to say."""
    lines = []
    c = rep["counts"]
    if c["unlinked"]:
        lines.append(
            f"  {c['unlinked']} declared route(s) reached that NOTHING links to — a crawl "
            f"alone would have missed them: {', '.join(rep['unlinked'][:8])}"
            + (" …" if c["unlinked"] > 8 else "")
        )
    if c["unreachable"]:
        lines.append(
            f"  ! {c['unreachable']} declared route(s) captured NOTHING: "
            f"{', '.join(rep['unreachable'][:8])}" + (" …" if c["unreachable"] > 8 else "")
        )
    return "\n".join(lines)
