#!/usr/bin/env python3
"""Analysis core (project-agnostic, deterministic):
  1. coverage ledger  — union of Figma frames + captured live routes; UNMAPPED = coverage debt.
  2. baseline         — pluggable: tokens | derived | internal (see README).
  3. conformance      — every element's computed CSS vs the baseline -> deviations + DS-adoption %.
  4. assemble         — audit-master.json (machine findings, 🤖), geometry-pinned, status MACHINE-DRAFT.

This is the anti-drift heart: it verifies every element every run, so it does not rely on
design-system inheritance that developers may not be following."""
import json, os, re, glob, collections, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C
import qc_geometry as G

def tohex(c):
    c = (c or "").strip()
    if c.startswith("#"): return c.lower()
    if "0, 0, 0, 0" in c or "rgba(0, 0, 0, 0)" in c: return "transparent"
    m = re.findall(r"\d+", c)
    return "#%02x%02x%02x" % (int(m[0]), int(m[1]), int(m[2])) if len(m) >= 3 else c

def norm(t): return re.sub(r"[^a-z0-9]", "", (t or "").lower())

# ---------- 1. coverage ledger ----------
def load_frames(paths, cfg):
    fp = os.path.join(paths["project"], cfg["figma"].get("framesFile", "inputs/figma-frames.json"))
    if os.path.exists(fp):
        try: return json.load(open(fp))
        except Exception: return []
    return []

def build_ledger(cfg, frames, captured, paths):
    cap_by_key = {}
    for c in captured:
        cap_by_key[norm(c["role"]) + norm(c["route"].split("/")[-1])] = c
    rows = []; mapped = unmapped = extra = 0
    used = set()
    for fr in frames:
        name = fr.get("name", "")
        parts = name.split("/")
        role = norm(parts[0]) if parts else ""
        screen = norm(parts[1]) if len(parts) > 1 else ""
        key = role + screen
        hit = cap_by_key.get(key) or next((c for k, c in cap_by_key.items() if screen and screen in k), None)
        status = "MAPPED" if hit else "UNMAPPED"
        if hit: mapped += 1; used.add(hit["slug"])
        else: unmapped += 1
        rows.append({"source": "figma", "frame": name, "figma_node": fr.get("node_id"),
                     "state": fr.get("state") or ("/" in name and name.split("/")[-1]) or "",
                     "live_capture": hit["slug"] if hit else None, "status": status,
                     "verdict": None})
    for c in captured:
        if c["slug"] not in used:
            extra += 1
            rows.append({"source": "live", "frame": None, "figma_node": None,
                         "live_capture": c["slug"], "route": c["route"],
                         "status": "EXTRA", "verdict": None})
    ledger = {"rows": rows, "stats": {"figma_frames": len(frames), "captured": len(captured),
              "mapped": mapped, "unmapped": unmapped, "extra_build_only": extra},
              "gate": "PASS" if unmapped == 0 else "FAIL",
              "note": "UNMAPPED rows are design frames with no matching live capture = coverage debt. "
                      "EXTRA rows are build-only screens (route to Design Suggestions, not findings)."}
    json.dump(ledger, open(os.path.join(paths["out"], "coverage-ledger.json"), "w"), indent=2)
    return ledger

# ---------- 2. baseline (pluggable) ----------
def load_baseline(cfg, captured, paths):
    mode = cfg.get("baseline", {}).get("mode", "internal")
    allow = {"colors": set(), "radii": set(), "fontSizes": set(), "fontFamilies": set()}
    src = os.path.join(paths["project"], cfg.get("baseline", {}).get("source", ""))
    if mode in ("tokens", "derived") and os.path.exists(src):
        t = json.load(open(src))
        allow["colors"] = {tohex(x) for x in t.get("colors", [])}
        allow["radii"] = {int(x) for x in t.get("radii", [])}
        allow["fontSizes"] = {int(x) for x in t.get("fontSizes", [])}
        allow["fontFamilies"] = {x for x in t.get("fontFamilies", [])}
        return mode, allow
    # internal-consistency: derive the dominant value set from the build itself
    ctr = {"colors": collections.Counter(), "radii": collections.Counter(),
           "fontSizes": collections.Counter(), "fontFamilies": collections.Counter()}
    for f in glob.glob(os.path.join(paths["captures_live"], "*.json")):
        for r in json.load(open(f)).get("rows", []):
            ctr["colors"][tohex(r.get("color"))] += 1
            ctr["radii"][r.get("radius")] += 1
            ctr["fontSizes"][r.get("fontSize")] += 1
            ctr["fontFamilies"][r.get("fontFamily")] += 1
    total = max(1, sum(ctr["fontSizes"].values()))
    # dominant = values used by >=2% of elements (the de-facto "system")
    for k in allow:
        allow[k] = {v for v, n in ctr[k].items() if v not in (None, "transparent") and n / total >= 0.02}
    return "internal", allow

# ---------- 3. conformance ----------
def conformance(cfg, captured, allow, mode, paths):
    dev = collections.defaultdict(lambda: {"count": 0, "screens": set(), "sample": None, "loc": None})
    total = conf = 0
    for c in captured:
        fp = os.path.join(paths["captures_live"], f"{c['slug']}.json")
        if not os.path.exists(fp): continue
        for r in json.load(open(fp)).get("rows", []):
            total += 1; ok = True
            checks = [("color", tohex(r.get("color")), allow["colors"]),
                      ("radius", r.get("radius"), allow["radii"]),
                      ("fontSize", r.get("fontSize"), allow["fontSizes"]),
                      ("fontFamily", r.get("fontFamily"), allow["fontFamilies"])]
            for prop, val, allowed in checks:
                if not allowed: continue
                if val in (None, "transparent", 0): continue
                if val not in allowed:
                    ok = False
                    d = dev[(prop, str(val))]
                    d["count"] += 1; d["screens"].add(c["slug"])
                    if d["sample"] is None:
                        d["sample"] = r.get("text", "")[:30]
                        d["loc"] = (c["slug"], r.get("x"), r.get("y"), r.get("w"), r.get("h"), c.get("pageH", 1000))
            if ok: conf += 1
    ds_adoption = round(100 * conf / max(1, total), 1)
    ranked = sorted(dev.items(), key=lambda kv: -kv[1]["count"])
    devlist = [{"prop": k[0], "value": k[1], "count": v["count"], "screens": len(v["screens"]),
                "sample": v["sample"], "loc": v["loc"]} for k, v in ranked]
    return {"mode": mode, "ds_adoption_pct": ds_adoption, "elements_checked": total,
            "elements_conformant": conf, "deviations": devlist}

# ---------- 4. assemble audit-master.json ----------
PROP_AXIS = {"color": "Color & Token", "radius": "Components & States",
             "fontSize": "Typography", "fontFamily": "Typography"}
PROP_TOKEN = {"color": "colour token", "radius": "radius token",
              "fontSize": "type-scale token", "fontFamily": "font-family token"}

def assemble(cfg, ledger, conf, paths, top_n=12):
    findings = []
    for i, d in enumerate(conf["deviations"][:top_n], 1):
        loc = d["loc"]; slug = loc[0]
        H = loc[5] or 1000
        xp = round(100 * (loc[1] + loc[3] / 2) / 1440) if loc[1] is not None else 50
        yp = round(100 * (loc[2] + loc[4] / 2) / H, 1) if loc[2] is not None else 50
        findings.append({
            "num": i, "id": f"{cfg['idPrefix']}-DSCONF-{i:03d}",
            "element": f"Off-token {d['prop']}: {d['value']}",
            "section": "ds-conformance", "axis": PROP_AXIS.get(d["prop"], "Color & Token"),
            "severity": "Major" if d["count"] >= 20 else ("Minor" if d["count"] >= 5 else "Nit"),
            "figma": f"Every element should use a {PROP_TOKEN[d['prop']]} from the design system.",
            "live": f"{d['count']} element(s) across {d['screens']} screen(s) render {d['prop']}={d['value']}, which is not a design-system token (first seen near \"{d['sample']}\").",
            "fix": f"Replace the raw {d['prop']} value with the correct design-system token, or add it to the token set if legitimately new.",
            "check": "🤖 machine", "liveImgO": f"captures/live/{slug}.png",
            "_lpct": (xp, yp)})
    screens = []
    if findings:
        screens.append({"slug": "GLOBAL-DSCONF",
            "name": "Global — Design-System Conformance (machine-verified every element)",
            "figmaImg": None, "liveImg": f"captures/live/{conf['deviations'][0]['loc'][0]}.png" if conf["deviations"] else None,
            "figmaUrl": None, "liveUrl": None,
            "note": f"DS-adoption: {conf['ds_adoption_pct']}% of {conf['elements_checked']} elements use design-system tokens. "
                    f"Baseline mode: {conf['mode']}. The full deviation table is in out/conformance.json. "
                    f"These are 🤖 machine checks — verify severity with a human before certifying.",
            "findings": findings})
    for sc in screens:
        G.finalize(sc, eng_dir=paths["captures"], base_dir=paths["project"])
    G.write_failures(paths["out"])
    master = {"portal": cfg["portal"], "idPrefix": cfg["idPrefix"],
              "generated": os.environ.get("AUDIT_DATE", "auto"),
              "status": "MACHINE-DRAFT",
              "figmaUrl": C.figma_url(cfg, cfg["figma"].get("rootNode")),
              "method": f"Machine pass (project-agnostic engine). Baseline={conf['mode']}. "
                        f"DS-adoption {conf['ds_adoption_pct']}%. Coverage gate={ledger['gate']}. "
                        f"🤖 machine checks only; human sign-off (👤) required before CERTIFIED.",
              "coverage": ledger["stats"], "coverage_gate": ledger["gate"],
              "ds_adoption_pct": conf["ds_adoption_pct"],
              "deferred": [], "screens": screens}
    json.dump(master, open(os.path.join(paths["out"], "audit-master.json"), "w"), indent=2)
    json.dump(conf, open(os.path.join(paths["out"], "conformance.json"), "w"), indent=2, default=str)
    return master

def run(project):
    cfg, paths = C.load(project)
    cap_path = os.path.join(paths["captures"], "_captured.json")
    if os.path.exists(cap_path):
        captured = json.load(open(cap_path))
    else:
        # rebuild the manifest from the extracted live JSON files on disk
        captured = []
        for f in sorted(glob.glob(os.path.join(paths["captures_live"], "*.json"))):
            if os.path.basename(f).startswith("_"): continue
            d = json.load(open(f))
            if not isinstance(d, dict) or "rows" not in d: continue
            slug = os.path.splitext(os.path.basename(f))[0]
            captured.append({"slug": slug, "role": d.get("role", slug.split("-")[0].lower()),
                             "route": d.get("route", "/" + slug.lower()), "url": d.get("url"),
                             "png": f"captures/live/{slug}.png", "pageH": d.get("pageH", 1000),
                             "rows": len(d.get("rows", []))})
    frames = load_frames(paths, cfg)
    ledger = build_ledger(cfg, frames, captured, paths)
    mode, allow = load_baseline(cfg, captured, paths)
    conf = conformance(cfg, captured, allow, mode, paths)
    master = assemble(cfg, ledger, conf, paths)
    print(f"coverage: {ledger['stats']} gate={ledger['gate']}")
    print(f"ds-adoption: {conf['ds_adoption_pct']}%  ({conf['elements_conformant']}/{conf['elements_checked']} elements)")
    print(f"deviations: {len(conf['deviations'])}  -> top {min(12,len(conf['deviations']))} as findings")
    return master

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(); ap.add_argument("--project", required=True)
    a = ap.parse_args(); run(a.project)
