#!/usr/bin/env python3
"""Prepare every paired screen for the Figma review sheet — not just super-admin's.

sheet/<SLUG>.design.png / .build.png for all 63 pairs, plus sheet/all_rows.json carrying the
row order, the links, the image sizes and the numbered issue list the reviewer edits.

Roles share design frames: /users is one frame whatever role is looking at it. So a row for
another role reuses the SAME design image (and, in Figma, the same image hash) — only the build
side is that role's own capture.
"""
import json, os, shutil, struct, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F

LIVE = os.path.join(HERE, "captures", "live")
FIG = os.path.join(HERE, "captures", "figma")
OUT = os.path.join(HERE, "sheet")
DESIGN_FILE = "evmNmlK8g4VYwJVu2FwSGV"
BASE = "https://smile-admin-dev.mosje.in"

# finding screen-name -> the capture slug its row belongs to
SCREEN_SLUG = {
    "Dashboard": "SUPER-ADMIN-DASHBOARD",
    "Users": "SUPER-ADMIN-USERS",
    "Consent Forms": "SUPER-ADMIN-CONSENT",
    "Notifications": "SUPER-ADMIN-NOTIFICATIONS",
    "Beneficiary List": "SUPER-ADMIN-PERSONS",
    "Surveyor Mappings": "SUPER-ADMIN-SURVEYOR-MAPPED",
    "Shelter Occupants": "SUPER-ADMIN-SHELTER-HOMES-BENEFICIARIES",
    "Master Settings": "SUPER-ADMIN-MASTER-SETTING",
    "Rehab Data": "SUPER-ADMIN-COMPREHENSIVE-REHAB-DATA",
    "Skill & Training": "SUPER-ADMIN-COMPREHENSIVE-REHAB-SKILL-TRAINING",
    "City Profiling": "SUPER-ADMIN-CITY-PROFILING",
    "City Profiling — district list": "SUPER-ADMIN-CITY-PROFILING-L2-DISTRICTS",
    "Performance Statistics": "SUPER-ADMIN-PERFORMANCE-STATS",
    "Onboard New User": "SUPER-ADMIN-USERS-ADD-USER",
    "Add Shelter Home": "SUPER-ADMIN-SHELTER-HOMES-ADD",
    "Create New Role": "SUPER-ADMIN-ROLES-NEW-ROLE",
    "Roles": "SUPER-ADMIN-ROLES",
    "Sign In": "SIGNIN-LOGIN",
    "Choose Portal": "SIGNIN-CHOOSE-PORTAL",
}
# the sign-in frames are named by node id in the pairing, which is no use to a reviewer
NICE = {
    "SIGNIN-LOGIN": "Sign In",
    "SIGNIN-DEFAULT": "Sign In (landing)",
    "SIGNIN-CHOOSE-PORTAL": "Choose Portal",
    "SIGNIN-IMPLEMENTING-AGENCY-OTP": "Sign In — Implementing Agency (OTP)",
}
ROLE_ORDER = ["signin", "super-admin", "central-authority", "us-so", "nisd"]


def png_size(p):
    with open(p, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))


def main():
    pairs = json.load(open(os.path.join(HERE, "sheet", "pairing.json")))["paired"]
    issues = collections.defaultdict(list)
    for f in F.SCREEN + F.DIFF2 + F.SCREEN2 + F.SCREEN3 + F.LOGIN:
        if f[1] != "Screen":
            continue
        slug = SCREEN_SLUG.get(f[2])
        if not slug:
            print(f"   ! no row for finding {f[0]} on screen {f[2]!r}")
            continue
        issues[slug].append(f)

    # one design png per design node
    design_for_node = {}
    for p in pairs:
        cand = os.path.join(FIG, f"{p['slug']}.png")
        if os.path.exists(cand):
            design_for_node.setdefault(p["node_id"], cand)

    rows, missing = [], []
    pairs.sort(key=lambda p: (ROLE_ORDER.index(p["role"]) if p["role"] in ROLE_ORDER else 9,
                              p["route"]))
    for p in pairs:
        slug = p["slug"]
        b_src = os.path.join(LIVE, f"{slug}.png")
        d_src = design_for_node.get(p["node_id"])
        if not (d_src and os.path.exists(b_src)):
            missing.append(slug)
            continue
        d_dst = os.path.join(OUT, f"{slug}.design.png")
        b_dst = os.path.join(OUT, f"{slug}.build.png")
        if not os.path.exists(d_dst) or os.path.getsize(d_dst) != os.path.getsize(d_src):
            shutil.copyfile(d_src, d_dst)
        if not os.path.exists(b_dst) or os.path.getsize(b_dst) != os.path.getsize(b_src):
            shutil.copyfile(b_src, b_dst)
        dw, dh = png_size(d_dst)
        bw, bh = png_size(b_dst)
        mine = issues.get(slug, [])
        if mine:
            txt = "\n".join(f"{i}. {f[0]} · {f[5]}" for i, f in enumerate(mine, 1))
            txt += "\n\nAdd anything you see here. The global findings are listed once at the top."
        else:
            txt = ("No screen-specific finding beyond the Global set.\n\n"
                   "Add anything you see here.")
        rows.append(dict(
            slug=slug, role=p["role"], route=p["route"],
            title=NICE.get(slug) or p["name"].split("/", 1)[-1],
            node=p["node_id"],
            designSrc=os.path.relpath(d_dst, HERE), buildSrc=os.path.relpath(b_dst, HERE),
            designNode=p["node_id"],
            figmaUrl=f"https://www.figma.com/design/{DESIGN_FILE}/MoSJE-Portal--Handoff-?node-id={p['node_id'].replace(':', '-')}",
            liveUrl=p["route"] if p["route"].startswith("http") else BASE + p["route"],
            dh=round(dh * 688 / dw), bh=round(bh * 688 / bw), dw=dw, bw=bw,
            issues=txt, issueIds=[f[0] for f in mine]))
    json.dump(rows, open(os.path.join(OUT, "all_rows.json"), "w"), indent=1)
    byrole = collections.Counter(r["role"] for r in rows)
    print(f"{len(rows)} rows -> sheet/all_rows.json  {dict(byrole)}")
    if missing:
        print(f"   ! {len(missing)} pairs missing an image: {missing}")
    odd = [r["slug"] for r in rows if r["dw"] != 1440 or r["bw"] != 1440]
    if odd:
        print(f"   ! not 1440 wide: {odd}")
    print(f"   rows carrying screen findings: {sum(1 for r in rows if r['issueIds'])}")


if __name__ == "__main__":
    main()
