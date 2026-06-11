#!/usr/bin/env python3
"""Calibration capture for the PUBLIC login screen: screenshot + computed CSS + functional probe + axe-core."""
import json, os
from playwright.sync_api import sync_playwright

URL = "https://eutthan-admin-uat.mosje.in/login"
OUT = "captures/live"
os.makedirs(OUT, exist_ok=True)

PROPS = ["font-family","font-size","font-weight","line-height","letter-spacing","color",
         "background-color","border-top-width","border-color","border-radius","padding",
         "height","width","box-shadow","text-align"]

def css(page, handle):
    if not handle: return None
    return page.evaluate(
        """(el)=>{const s=getComputedStyle(el);const o={};["""
        + ",".join(f'"{p}"' for p in PROPS) +
        """].forEach(p=>o[p]=s.getPropertyValue(p));o["text"]=(el.innerText||el.value||"").slice(0,40);
           o["tag"]=el.tagName.toLowerCase();return o;}""", handle)

def first(page, *sels):
    for s in sels:
        try:
            loc = page.locator(s)
            if loc.count() > 0:
                return loc.first.element_handle()
        except Exception: pass
    return None

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width":1440,"height":960}, device_scale_factor=2)
    page = ctx.new_page()
    page.goto(URL, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)

    # 1) screenshot
    page.screenshot(path=f"{OUT}/LOGIN.png", full_page=True)

    # 2) computed CSS per element
    targets = {
      "heading":     first(page, "h1", "h2", "text=Log In"),
      "subtitle":    first(page, "form p", "p"),
      "label_user":  first(page, "label"),
      "input_user":  first(page, "input[type=text]", "input:not([type=password]):not([type=checkbox])"),
      "input_pass":  first(page, "input[type=password]"),
      "btn_signin":  first(page, "button[type=submit]", "button:has-text('Sign In')", "button"),
      "link_forgot": first(page, "a:has-text('Forgot')", "text=Forgot Password"),
      "card":        first(page, "form"),
      "body":        first(page, "body"),
    }
    styles = {k: css(page, h) for k,h in targets.items()}
    json.dump(styles, open(f"{OUT}/LOGIN.styles.json","w"), indent=2)

    # 3) functional probe — required attrs + empty submit behaviour
    func = {}
    iu, ip = targets["input_user"], targets["input_pass"]
    func["username_required"] = bool(iu and iu.get_attribute("required") is not None)
    func["password_required"] = bool(ip and ip.get_attribute("required") is not None)
    func["username_type"] = iu.get_attribute("type") if iu else None
    func["password_toggle_present"] = page.locator("button:near(input[type=password]) , [aria-label*='password' i]").count() > 0
    func["autocomplete_user"] = iu.get_attribute("autocomplete") if iu else None
    func["autocomplete_pass"] = ip.get_attribute("autocomplete") if ip else None
    # empty submit
    before = page.url
    btn = targets["btn_signin"]
    if btn:
        try: btn.click(timeout=4000)
        except Exception as e: func["submit_click_error"]=str(e)[:120]
        page.wait_for_timeout(1500)
    func["url_changed_on_empty_submit"] = page.url != before
    # collect any visible error / validation text
    errs = page.evaluate("""()=>{const out=[];
      document.querySelectorAll('[class*=error i],[class*=invalid i],[role=alert],.text-danger,.error-message').forEach(e=>{
        const t=(e.innerText||'').trim(); if(t) out.push(t.slice(0,80));});
      // native validation
      document.querySelectorAll('input').forEach(i=>{ if(i.validationMessage) out.push('native:'+i.validationMessage.slice(0,60)); });
      return [...new Set(out)].slice(0,8);}""")
    func["validation_messages"] = errs
    json.dump(func, open(f"{OUT}/LOGIN.functional.json","w"), indent=2)

    # 4) axe-core accessibility
    axe = {"error": None, "violations": []}
    try:
        page.goto(URL, wait_until="networkidle", timeout=30000); page.wait_for_timeout(1500)
        page.add_script_tag(url="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js")
        page.wait_for_timeout(500)
        res = page.evaluate("""async()=>{const r=await axe.run(document,{resultTypes:['violations']});
          return r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,
            tags:v.tags.filter(t=>t.startsWith('wcag')),nodes:v.nodes.length,
            sample:(v.nodes[0]&&v.nodes[0].html||'').slice(0,120)}));}""")
        axe["violations"] = res
    except Exception as e:
        axe["error"] = str(e)[:160]
    json.dump(axe, open(f"{OUT}/LOGIN.axe.json","w"), indent=2)
    b.close()
    print("LOGIN captured. styles/functional/axe written.")
    print("functional:", json.dumps(func)[:400])
    print("axe violations:", len(axe["violations"]), "| ", [v["id"] for v in axe["violations"]])
