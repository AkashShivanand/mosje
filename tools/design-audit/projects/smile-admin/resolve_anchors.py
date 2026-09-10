#!/usr/bin/env python3
"""SMILE-Beggary's anchor specs. The resolver itself lives in engine/anchors.py so every portal
gets the same lookup rules and the same recorded fields — tag, role and bg are what the claim
gates reason about."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(HERE)), "engine"))
import anchors as A

LIVE = os.path.join(HERE, "captures", "live")

ANCHORS = {
 # ---- screen-specific ----
 "S01": dict(slug="SUPER-ADMIN-DASHBOARD",     text="BENEFICIARY PROFILE", tag="h2"),
 "S02": dict(slug="SUPER-ADMIN-DASHBOARD",     text="2,444", fs=32),
 "S03": dict(slug="SUPER-ADMIN-DASHBOARD",     text="PROGRAMME OVERVIEW", fs=12),
 "S04": dict(slug="SUPER-ADMIN-DASHBOARD",     text="State Users"),
 "S05": dict(slug="SUPER-ADMIN-USERS",         text="Onboard New Users"),
 "S06": dict(slug="SUPER-ADMIN-USERS",         text="Name", tag="th", ymax=500),
 "S07": dict(slug="SUPER-ADMIN-USERS",         tag="select", nth=0, ymin=340, ymax=430),
 "S08": dict(slug="SUPER-ADMIN-CONSENT",       text="Access Control", fs=12),
 "S09": dict(slug="SUPER-ADMIN-CONSENT",       tag="input", ymin=240, ymax=330),
 "S10": dict(slug="SUPER-ADMIN-CONSENT",       text="Document", fs=12, ymax=400),
 "S11": dict(slug="SUPER-ADMIN-CONSENT",       text="JANKALYAN PARISHAD", why="the link is rendered inside the table cell; the cell is the element captured"),
 "S12": dict(slug="SUPER-ADMIN-NOTIFICATIONS", text="No notifications match the current filters"),
 "S13": dict(slug="SUPER-ADMIN-NOTIFICATIONS", tag="select", nth=0, ymin=330, ymax=420),
 "S14": dict(slug="SUPER-ADMIN-PERSONS",       text="Beneficiary List", fs=24),
 "S15": dict(slug="SUPER-ADMIN-PERSONS",       text="\u00a9 2026 Copyright", chrome=True),
 # ---- globals, each pinned on a representative screen ----
 "G01": dict(slug="SUPER-ADMIN-DASHBOARD",     text="Programme Overview", tag="h1"),
 "G02": dict(slug="SUPER-ADMIN-USERS",         text="1", tag="button", ymin=980, ymax=1020, xmin=1080, xmax=1140),
 "G03": dict(slug="SUPER-ADMIN-USERS",         text="Showing"),
 "G04": dict(slug="SUPER-ADMIN-USERS",         text="Username", tag="th"),
 "G05": dict(slug="SUPER-ADMIN-NOTIFICATIONS", text="Total Notifications", fs=11, why="the KPI card has no text of its own; anchored to its label"),
 "G06": dict(slug="SUPER-ADMIN-PERSONS",       text="Male", ymax=400, why="the icon tile carries no text node; anchored to the label beside it"),
 "G07": dict(slug="SUPER-ADMIN-PERSONS",       text="Download All (CSV)", tag="button", why="the export control is the button itself; anchored to its label"),
 "G08": dict(slug="SUPER-ADMIN-USERS",         text="A", fs=18, chrome=True, xmax=1440),
 "G09": dict(slug="SUPER-ADMIN-USERS",         tag="button", chrome=True, ymax=40, xmin=1180, xmax=1250),
 "G10": dict(slug="SUPER-ADMIN-USERS",         text="Privacy Policy", chrome=True),
 "G11": dict(slug="SUPER-ADMIN-USERS",         text="City Profiling", chrome=True),
 # ---- globals found by the element diff ----
 "G12": dict(slug="SUPER-ADMIN-USERS",         text="Users", fs=24),
 "G13": dict(slug="SUPER-ADMIN-USERS",         text="Onboard portal users", fs=14),
 "G14": dict(slug="SUPER-ADMIN-USERS",         text="Access Control", fs=12),
 "G15": dict(slug="SUPER-ADMIN-USERS",         text="Terms & Conditions", chrome=True),
 "G16": dict(slug="SUPER-ADMIN-CONSENT",       text="Uploaded", fs=12),
 "G17": dict(slug="SUPER-ADMIN-CONSENT",       text="Access Control", fs=12),
 "G18": dict(slug="SUPER-ADMIN-PERSONS",       text="Data:", fs=12, why="the selector's own text is the label being reported"),
 "G19": dict(slug="SUPER-ADMIN-SURVEYOR-MAPPED", tag="select", ymin=380, ymax=470),

 # ---- the form, dialog and tab states (batch 5) ----
 "S18": dict(slug="SUPER-ADMIN-SHELTER-HOMES-BENEFICIARIES", text="Swashraya (Shelter Home) Persons", tag="h1"),
 "S19": dict(slug="SUPER-ADMIN-SHELTER-HOMES-BENEFICIARIES", text="Swashraya (Shelter Home) Type", tag="th"),
 "S20": dict(slug="SUPER-ADMIN-MASTER-SETTING",  text="Active Tab"),
 "S21": dict(slug="SUPER-ADMIN-MASTER-SETTING",  text="Actions", tag="th"),
 "S22": dict(slug="SUPER-ADMIN-COMPREHENSIVE-REHAB-DATA", text="Captured On", tag="th"),
 "S23": dict(slug="SUPER-ADMIN-COMPREHENSIVE-REHAB-SKILL-TRAINING", text="Shelter Name", tag="th"),
 "S24": dict(slug="SUPER-ADMIN-COMPREHENSIVE-REHAB-SKILL-TRAINING", text="Duration of Skill and Training", tag="th"),
 "S25": dict(slug="SUPER-ADMIN-CITY-PROFILING",  text="Fund Utilised", ymax=400, why="the card is the container; anchored to the label that names it"),
 "S26": dict(slug="SUPER-ADMIN-CITY-PROFILING",  text="Fund Disbursed", tag="th"),
 "S27": dict(slug="SUPER-ADMIN-CITY-PROFILING",  text="Total Identified/Surveyed", tag="th", why="the pill is drawn on the cell value; anchored to the column header that names it"),
 "S28": dict(slug="SUPER-ADMIN-CITY-PROFILING",  text="Number of Cities/Districts", tag="th"),
 "S29": dict(slug="SUPER-ADMIN-PERFORMANCE-STATS", text="KPI 1", ymax=400, why="the KPI card is the container; anchored to its 'KPI 1' label"),
 "S30": dict(slug="SUPER-ADMIN-USERS-ADD-USER",  text="First Name", tag="label"),
 "S31": dict(slug="SUPER-ADMIN-USERS-ADD-USER",  text="Select Role", tag="label", why="the finding is about the card's WIDTH; anchored to a field inside it"),
 "S32": dict(slug="SUPER-ADMIN-USERS-ADD-USER",  text="Email ID", tag="label"),
 "S33": dict(slug="SUPER-ADMIN-SHELTER-HOMES-ADD", text="Shelter Name", tag="label"),
 "S34": dict(slug="SUPER-ADMIN-SHELTER-HOMES-ADD", text="Type", tag="label", ymin=560, ymax=650),
 # the amber banner carries no text node in the extraction; measured 30px above the first label
 "S35": dict(slug="SUPER-ADMIN-SHELTER-HOMES-ADD", text="Shelter Name", tag="label", dx=300, dy=-30, w=40, h=20, why="the banner has no text node in the extraction; offset 30px above the first label"),
 "S36": dict(slug="SUPER-ADMIN-SHELTER-HOMES-ADD", text="Address", tag="label"),
 "S37": dict(slug="SUPER-ADMIN-ROLES-NEW-ROLE",  text="Role Name", tag="label"),
 "S38": dict(slug="SUPER-ADMIN-ROLES-NEW-ROLE",  text="Create New Role", tag="h2"),
 "S39": dict(slug="SUPER-ADMIN-ROLES-NEW-ROLE",  text="After creating the role", tag="p"),
 "S40": dict(slug="SUPER-ADMIN-ROLES",           text="Role Management", tag="h1"),
 "S41": dict(slug="SUPER-ADMIN-ROLES",           text="Super Admin", ymin=440, ymax=500, why="the card header band carries no text of its own; anchored to the role name on it"),
 "S42": dict(slug="SUPER-ADMIN-CITY-PROFILING-L2-DISTRICTS", text="Fund Disbursed", ymax=400, why="the card is the container; anchored to the label that names it"),
 "S43": dict(slug="SUPER-ADMIN-SHELTER-HOMES-BENEFICIARIES", text="Gender", tag="th"),
 "S16": dict(slug="SUPER-ADMIN-PERSONS", text="APPROVED_BY_IA"),
 "S17": dict(slug="SUPER-ADMIN-SURVEYOR-MAPPED", text="Total Mappings"),
 "S44": dict(slug="SUPER-ADMIN-USERS",  text="Username", tag="th", why="the header BAND has no text; anchored to a header cell sitting on it"),
 "S45": dict(slug="SUPER-ADMIN-PERSONS", text="IDENTIFIED", ymin=600, ymax=660),
 # ---- the sign-in surface. chrome=True because the brand panel sits left of the content column ----
 "L01": dict(slug="SIGNIN-LOGIN", text="Log in to your account", tag="h2"),
 "L02": dict(slug="SIGNIN-LOGIN", text="SAMAVESH", fs=30, chrome=True),
 "L03": dict(slug="SIGNIN-LOGIN", text="Forgot Password?", tag="a"),
 "L04": dict(slug="SIGNIN-LOGIN", text="Justice. Equality. Dignity.", chrome=True),
 "L05": dict(slug="SIGNIN-LOGIN", text="Signing into", chrome=True),
 "L06": dict(slug="SIGNIN-LOGIN", text="Email or Mobile Number", tag="label"),
 "L08": dict(slug="SIGNIN-LOGIN", text="Remember me", tag="label"),
 "L09": dict(slug="SIGNIN-CHOOSE-PORTAL", text="Log in to your account", tag="h2"),
}



if __name__ == "__main__":
    A.resolve(ANCHORS, LIVE, out_path=os.path.join(HERE, "sheet", "anchors.json"))
