# SMILE Beggary (Admin) — captures

The paired screenshots the report is built from. 66 screens, one file per side.

| Folder | What is in it |
|---|---|
| `figma/<SCREEN>.png` | the design frame, exported from the Figma handoff file |
| `live/<SCREEN>.png` | the live page at a locked 1440 viewport |

`<SCREEN>` is the capture slug — role prefix, then screen, then the state where a
screen has more than one:

```
SUPER-ADMIN-DASHBOARD              CENTRAL-AUTHORITY-USERS
SUPER-ADMIN-USERS-ADD-USER-MODAL   US-SO-FUND-MONITORING
SUPER-ADMIN-PERMISSIONS-EXPANDED   SIGNIN-CHOOSE-PORTAL
```

`audit-master.json` points at these paths, so `python3 generate_pdf.py` rebuilds
the report from this folder. Rename or move a file and the report loses that
panel — re-point the master in the same change.

These are the same images that back the Figma review sheet and the pinned report
in the Design QC file. `tools/design-audit/projects/smile-admin/sheet/` holds a
working copy under the names `<SCREEN>.design.png` / `<SCREEN>.build.png`; that
folder is a run artefact and is deliberately not in git. This folder is the
permanent one.
