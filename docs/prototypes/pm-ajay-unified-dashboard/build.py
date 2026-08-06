#!/usr/bin/env python3
"""Assemble the shareable, fully self-contained PM-AJAY prototype.

Inlines the National Emblem SVG as a data URI so the built file can be emailed,
opened offline, or dropped on any host without a second request.

    python3 docs/prototypes/pm-ajay-unified-dashboard/build.py
"""
import base64
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parents[2]

SRC = HERE / "index.src.html"
OUT = HERE / "pm-ajay-unified-dashboard.html"
EMBLEM = REPO / "apps/hub/public/design-system/national-emblem.svg"


def main() -> int:
    for path in (SRC, EMBLEM):
        if not path.exists():
            print(f"missing: {path}", file=sys.stderr)
            return 1

    emblem_uri = "data:image/svg+xml;base64," + base64.b64encode(
        EMBLEM.read_bytes()
    ).decode("ascii")

    html = SRC.read_text(encoding="utf-8")
    if "{{EMBLEM}}" not in html:
        print("source has no {{EMBLEM}} placeholder", file=sys.stderr)
        return 1
    html = html.replace("{{EMBLEM}}", emblem_uri)

    OUT.write_text(html, encoding="utf-8")
    print(f"built {OUT.relative_to(REPO)}  ({OUT.stat().st_size / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
