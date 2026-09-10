#!/usr/bin/env python3
"""Turn the working finding list into the FINAL, publishable set.

Two rules the reviewer set on 2026-09-10:
  1. Design bugs only. Copy, wording, naming and policy items are not raised here.
  2. Filters are one soft global note — "use the relevant filter options and follow the design" —
     not a per-screen demand that the build match the design's filter list exactly.

Everything dropped is recorded with its reason, so the next run does not re-raise it.
IDs follow the house nomenclature (NHAPOA): <PREFIX>-GLOBAL-NNN, <PREFIX>-AUTH-NNN,
<PREFIX>-<ROLE>-<SCREEN>-NNN.
"""
import json, os, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F

PREFIX = "SMB"

# --- rule 1: content, wording and policy are out of scope for this report -------------------
DROPPED = {
    "G10": "Policy, not a design difference — no accessibility statement in EITHER the design or "
           "the build. Raised with the GIGW compliance work instead.",
    "G17": "Content — which section name the breadcrumb uses is a vocabulary decision, not a "
           "design defect.",
    "S08": "Content — same class as G17: the breadcrumb's parent label.",
    "S15": "Content — the footer year (2025 in the design, 2026 in the build).",
    "S18": "Content — the screen is called 'Shelter Occupants' in the design and 'Swashraya "
           "(Shelter Home) Persons' in the build. A naming decision.",
    "S28": "Content — four column headers worded differently.",
    "S40": "Content — the page is called Roles in the design and Role Management in the build.",
    "L07": "Content — the password placeholder wording.",
    # --- rule 2: filters ---------------------------------------------------------------------
    "S07": "Filters — folded into the single global note.",
    "S09": "Filters — folded into the single global note.",
    "S13": "Filters — folded into the single global note.",
    # --- withdrawn on re-checking -------------------------------------------------------------
    "S03": "WITHDRAWN — the build has the shared KPI container after all.",
    "L10": "WITHDRAWN — the portal names are orange in the design too, so there is no difference.",
}

# --- rewrites decided in the same pass ------------------------------------------------------
REWRITE = {
 "G19": ("Minor", "Components & States",
   "The filter row does not match the design's",
   "Each list screen carries a named filter row — All States/UT, All Districts, All IAs/NGOs, All "
   "Statuses, and where relevant All Genders and All Ages. Measured on IA List, Beneficiary List, "
   "Survey Locations and Surveyor Mappings.",
   "The filter sets differ from screen to screen and from the design: some screens offer a search "
   "box and one or two unlabelled dropdowns, Users has two filters the design does not, and "
   "Notifications filters by Type and Channel where the design filters by geography.",
   "Use the relevant filter options for each screen and follow the design where it applies. This "
   "is one note for the whole portal, not a demand that every screen match the designed list "
   "exactly — the filter sets are still being settled."),
 "S16": ("Major", "Color & Token",
   "Every status chip is the same blue, where the design colour-codes them",
   "Status is colour-coded so the column can be scanned: IDENTIFIED blue #1558b0 on #d2e3fc, "
   "SUBMITTED navy #002b55 on #c8dbf0, REHABILITATION and MOBILIZED green #27682a on #c8e6c9, "
   "UNDER MOBILIZATION amber #8c571f on #ffe4bf.",
   "Every chip renders in the same blue — #1d4ed8 on #eff6ff — so IDENTIFIED, APPROVED_BY_IA, "
   "MOBILIZED and REHABILITATED are visually identical.",
   "Colour-code the statuses as the design does. A status column where every value looks the same "
   "cannot be scanned, which is the only reason it is a column."),
 "L01": ("Major", "Typography",
   "A second typeface appears on the sign-in screen",
   "Every string on the designed sign-in frames is Noto Sans.",
   "Four elements render in Plus Jakarta Sans — the 'Log in to your account' heading, the Log In "
   "button, 'Implementing Agency?' and 'Sign in with OTP' — measured on the live page. Everything "
   "around them is Noto Sans, so the panel is set in two typefaces at once.",
   "Set all four to Noto Sans. The estate mandates it on every government property, and this is "
   "the first screen anyone sees."),
 "L09": ("Major", "Components & States",
   "The role selector on the sign-in panel is not in the build",
   "The Choose Portal frame's login panel reads 'Log in to your account / Select your role to "
   "continue', with a 'Your role' field set to Super Admin above the email and password fields.",
   "There is no role selector. The panel goes straight from the heading to Email or Mobile "
   "Number. (The portal drawer itself matches — both design and build present the portals as a "
   "right-hand drawer with orange titles.)",
   "Confirm whether the role is chosen at sign-in or derived from the account. If it is derived, "
   "remove the selector from the design frame; if it is chosen, build it."),
 "S30": ("Minor", "Components & States",
   "Last Name is marked required in the design and not in the build",
   "All five fields carry a red asterisk: Full Name, Last Name, Email Address, Contact Number, "
   "Select Role.",
   "Four carry one; Last Name does not, so the form does not say whether it is mandatory until "
   "submit. (The four labels are also worded differently — Full Name / Email Address / Contact "
   "Number against First Name / Email ID / Mobile Number — but wording is content and is not "
   "raised in this report.)",
   "Mark Last Name required, or make the design agree that it is optional."),
}

# id -> (role token, screen token) for the house nomenclature
SCREEN_ID = {
 "Dashboard": ("SA", "DASHBOARD"), "Users": ("SA", "USERS"), "Consent Forms": ("SA", "CONSENT"),
 "Notifications": ("SA", "NOTIF"), "Beneficiary List": ("SA", "PERSONS"),
 "Shelter Occupants": ("SA", "SHELTEROCC"), "Master Settings": ("SA", "MASTER"),
 "Rehab Data": ("SA", "REHAB"), "Skill & Training": ("SA", "SKILL"),
 "City Profiling": ("SA", "CITY"), "City Profiling — district list": ("SA", "CITYL2"),
 "Performance Statistics": ("SA", "PERF"), "Onboard New User": ("SA", "ADDUSER"),
 "Add Shelter Home": ("SA", "ADDSHELTER"), "Create New Role": ("SA", "NEWROLE"),
 "Roles": ("SA", "ROLES"), "Surveyor Mappings": ("SA", "SURVEYORS"),
 "Sign In": ("AUTH", None), "Choose Portal": ("AUTH", None),
}
SEV_ORDER = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}


def main():
    src = F.GLOBAL + F.SCREEN + F.LOGIN + F.DIFF + F.DIFF2 + F.SCREEN2 + F.SCREEN3
    kept, dropped = [], []
    for f in src:
        fid = f[0]
        if fid in DROPPED:
            dropped.append({"old": fid, "screen": f[2], "title": f[5], "reason": DROPPED[fid]})
            continue
        sev, cat, title, design, build, fix = (REWRITE[fid] if fid in REWRITE
                                               else (f[3], f[4], f[5], f[6], f[7], f[8]))
        kept.append(dict(old=fid, scope=f[1], screen=f[2], sev=sev, cat=cat,
                         title=title, design=design, build=build, fix=fix))
    for w in getattr(F, "WITHDRAWN", []):
        dropped.append({"old": w[0], "screen": w[2], "title": w[5], "reason": DROPPED.get(w[0], "Withdrawn on re-checking.")})

    # number: globals first (by severity), then the auth surface, then screens in reading order
    globals_ = sorted([k for k in kept if k["scope"] == "Global"], key=lambda k: (SEV_ORDER[k["sev"]], k["old"]))
    for i, k in enumerate(globals_, 1):
        k["id"] = f"{PREFIX}-GLOBAL-{i:03d}"
    per_screen = collections.defaultdict(list)
    for k in kept:
        if k["scope"] == "Global":
            continue
        per_screen[k["screen"]].append(k)
    for screen, items in per_screen.items():
        role, tok = SCREEN_ID[screen]
        items.sort(key=lambda k: (SEV_ORDER[k["sev"]], k["old"]))
        base = f"{PREFIX}-{role}" + (f"-{tok}" if tok else "")
        for i, k in enumerate(items, 1):
            k["id"] = f"{base}-{i:03d}"
    # the auth surface numbers across both its frames, so re-number it as one set
    auth = sorted([k for k in kept if k["scope"] != "Global"
                   and SCREEN_ID.get(k["screen"], ("", ""))[0] == "AUTH"],
                  key=lambda k: (SEV_ORDER[k["sev"]], k["old"]))
    for i, k in enumerate(auth, 1):
        k["id"] = f"{PREFIX}-AUTH-{i:03d}"

    counts = collections.Counter(k["sev"] for k in kept)
    out = {"prefix": PREFIX, "kept": kept, "dropped": dropped, "counts": dict(counts)}
    json.dump(out, open(os.path.join(HERE, "findings_final.json"), "w"), indent=1)
    print(f"{len(kept)} findings kept  ({dict(counts)}), {len(dropped)} dropped")
    print(f"  globals {len(globals_)}, auth {len(auth)}, screens {sum(len(v) for v in per_screen.values()) - len(auth)}")
    for d in dropped:
        print(f"   - {d['old']:<4} {d['title'][:56]}")


if __name__ == "__main__":
    main()
