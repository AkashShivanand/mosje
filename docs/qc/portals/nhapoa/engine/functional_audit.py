#!/usr/bin/env python3
"""Functional audit pass: broken links, basic form presence, and axe-core accessibility.

Reads screens.json (same file as capture.py) and writes functional/<SLUG>.json per screen:
  { links: [{href, status, redirectedTo}], forms: [{selector, fields, hasSubmit}],
    console: [...], a11y: [{id, impact, help, nodes}] }

This automates the mechanical parts. You still do the judgment + manual a11y checks
(keyboard order, focus traps, touch targets, contrast spot-checks) — see references/functional-audit.md.

Usage:  python3 functional_audit.py [--screens screens.json] [--state .qc/storage-state.json] [--out functional]
Requires: pip install playwright ; playwright install chromium  (axe-core injected from CDN)
"""
import json, os, argparse
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright

AXE = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--screens", default="screens.json")
    ap.add_argument("--state", default=".qc/storage-state.json")
    ap.add_argument("--out", default="functional")
    a = ap.parse_args()
    screens = json.load(open(a.screens)); os.makedirs(a.out, exist_ok=True)
    state = a.state if os.path.exists(a.state) else None
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for s in screens:
            ctx = browser.new_context(viewport={"width": s.get("width",1440), "height": 900}, storage_state=state)
            page = ctx.new_page()
            console = []
            page.on("console", lambda m: console.append({"type": m.type, "text": m.text[:300]}) if m.type in ("error","warning") else None)
            page.on("requestfailed", lambda r: console.append({"type":"requestfailed","text":f"{r.method} {r.url} :: {r.failure}"}))
            page.goto(s["url"], wait_until="networkidle"); page.wait_for_timeout(1000)
            # links
            hrefs = page.eval_on_selector_all("a[href]", "els => els.map(e => ({href: e.href, text: e.innerText.trim().slice(0,40)}))")
            base = urlparse(s["url"]); links = []
            seen = set()
            for l in hrefs:
                u = l["href"]
                if not u.startswith("http") or u in seen: continue
                seen.add(u)
                if urlparse(u).netloc != base.netloc: continue   # internal only by default
                try:
                    resp = ctx.request.get(u)
                    links.append({"href": u, "text": l["text"], "status": resp.status})
                except Exception as e:
                    links.append({"href": u, "text": l["text"], "status": f"ERR {e}"})
            # forms
            forms = page.eval_on_selector_all("form", """els => els.map((f,i) => ({
                selector: 'form:nth-of-type('+(i+1)+')',
                fields: [...f.querySelectorAll('input,select,textarea')].map(x => ({name:x.name||x.id, type:x.type, required:x.required})),
                hasSubmit: !!f.querySelector('[type=submit],button')
            }))""")
            # a11y via axe-core
            a11y = []
            try:
                page.add_script_tag(url=AXE)
                res = page.evaluate("async () => await axe.run(document, {resultTypes:['violations']})")
                for v in res.get("violations", []):
                    a11y.append({"id": v["id"], "impact": v.get("impact"), "help": v["help"],
                                 "nodes": [n["target"] for n in v.get("nodes", [])[:5]]})
            except Exception as e:
                a11y.append({"id": "axe-error", "impact": None, "help": str(e), "nodes": []})
            out = {"links": links, "forms": forms, "console": console, "a11y": a11y}
            json.dump(out, open(os.path.join(a.out, f"{s['slug']}.json"), "w"), indent=2)
            broken = [l for l in links if not (isinstance(l["status"], int) and l["status"] < 400)]
            print(f"{s['slug']}: {len(links)} links ({len(broken)} broken), {len(forms)} forms, "
                  f"{len([c for c in console if c['type']=='error'])} console errors, {len(a11y)} a11y violations")
            ctx.close()
        browser.close()

if __name__ == "__main__":
    main()
