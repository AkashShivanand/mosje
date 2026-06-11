#!/usr/bin/env python3
"""Keep-alive authenticated capture. Opens ONE headful browser; you log in once; it then captures
every screen for that role IN THE SAME live session (so sessionStorage-based auth survives).
Per screen: full-page 2x screenshot + computed CSS for a generic element set + functional probe + axe.

Usage:
  python3 _cap_authed.py --role admin --screens screens.admin.json \
      --login-url https://eutthan-admin-uat.mosje.in/login --out captures/live \
      --login-marker /login --timeout 300
"""
import json, os, argparse
from playwright.sync_api import sync_playwright

PROPS = ["font-family","font-size","font-weight","line-height","letter-spacing","color",
         "background-color","border-top-width","border-color","border-radius","padding",
         "height","width","box-shadow","text-align"]

TARGETS = {  # name -> ordered selector fallbacks
  "topbar":     ["header", "[class*=header i]", "[class*=topbar i]", "nav"],
  "sidebar":    ["aside", "[class*=sidebar i]", "[class*=side-nav i]", "[class*=drawer i]"],
  "page_title": ["h1", "h2", "[class*=title i]", "[class*=heading i]"],
  "primary_btn":["button[type=submit]", ".btn-primary", "[class*=primary i] button", "button"],
  "table_head": ["thead th", "table th", "[role=columnheader]"],
  "table_cell": ["tbody td", "table td", "[role=cell]"],
  "input":      ["input:not([type=hidden])", "select", "textarea"],
  "label":      ["label", "[class*=label i]"],
  "card":       [".card", "[class*=card i]", "[class*=panel i]"],
  "body":       ["body"],
}

def css_for(page, sel_list):
    js = """(sels)=>{let el=null;for(const s of sels){try{const e=document.querySelector(s);if(e){el=e;break;}}catch(_){}}
      if(!el)return null;const s=getComputedStyle(el);const o={};
      %s.forEach(p=>o[p]=s.getPropertyValue(p));
      o.text=(el.innerText||el.value||'').slice(0,40);o.tag=el.tagName.toLowerCase();return o;}""" % json.dumps(PROPS)
    return page.evaluate(js, sel_list)

def functional(page):
    return page.evaluate("""()=>{
      const a=[...document.querySelectorAll('a')];
      const broken=a.filter(x=>{const h=(x.getAttribute('href')||'').trim();
        return h===''||h==='#'||h.startsWith('javascript:');}).length;
      const fakeBtns=[...document.querySelectorAll('p,span,div')].filter(e=>{
        const c=getComputedStyle(e).cursor; return c==='pointer'&&e.onclick&&!e.closest('a,button');}).length;
      const inputs=[...document.querySelectorAll('input:not([type=hidden])')];
      const unlabeled=inputs.filter(i=>!i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).length;
      return {anchors:a.length, broken_links:broken, fake_clickable:fakeBtns,
              inputs:inputs.length, inputs_unlabeled:unlabeled,
              buttons:document.querySelectorAll('button').length,
              forms:document.querySelectorAll('form').length,
              h1:document.querySelectorAll('h1').length};}""")

def axe(page, url):
    try:
        page.add_script_tag(url="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js")
        page.wait_for_timeout(400)
        return page.evaluate("""async()=>{const r=await axe.run(document,{resultTypes:['violations']});
          return r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,
            tags:v.tags.filter(t=>t.startsWith('wcag')),nodes:v.nodes.length,
            sample:(v.nodes[0]&&v.nodes[0].html||'').slice(0,120)}));}""")
    except Exception as e:
        return [{"error": str(e)[:140]}]

def wait_login(page, marker, timeout):
    print(f">>> Waiting up to {timeout}s for you to log in...")
    w=0
    while w<timeout:
        if marker not in page.url:
            try: page.wait_for_load_state("networkidle", timeout=8000)
            except Exception: pass
            page.wait_for_timeout(1500); print(f">>> Authenticated ({page.url})"); return True
        page.wait_for_timeout(2000); w+=2
    print(">>> Login wait timed out."); return False

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--role", required=True)
    ap.add_argument("--screens", required=True)
    ap.add_argument("--login-url", required=True)
    ap.add_argument("--out", default="captures/live")
    ap.add_argument("--login-marker", default="/login")
    ap.add_argument("--timeout", type=int, default=300)
    a=ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    screens=json.load(open(a.screens))
    summary={}
    with sync_playwright() as p:
        b=p.chromium.launch(headless=False)
        ctx=b.new_context(viewport={"width":1440,"height":960}, device_scale_factor=2)
        page=ctx.new_page()
        page.goto(a.login_url, wait_until="networkidle", timeout=30000)
        print(f"\n>>> Browser open. Log in as the {a.role.upper()} user.")
        if not wait_login(page, a.login_marker, a.timeout):
            b.close(); print("ABORTED: not authenticated"); return
        for s in screens:
            slug=s["slug"]
            try:
                page.goto(s["url"], wait_until="networkidle", timeout=45000)
                page.wait_for_timeout(2500)
                if a.login_marker in page.url:  # got bounced — session lost
                    summary[slug]="BOUNCED-TO-LOGIN"; print(f"  {slug}: bounced to login!"); continue
                page.screenshot(path=f"{a.out}/{slug}.png", full_page=True)
                styles={k:css_for(page,v) for k,v in TARGETS.items()}
                json.dump(styles, open(f"{a.out}/{slug}.styles.json","w"), indent=2)
                func=functional(page); json.dump(func, open(f"{a.out}/{slug}.functional.json","w"), indent=2)
                vio=axe(page, s["url"]); json.dump(vio, open(f"{a.out}/{slug}.axe.json","w"), indent=2)
                summary[slug]={"func":func,"axe":len([v for v in vio if 'id' in v])}
                print(f"  {slug}: ok | links {func['broken_links']} broken / {func['anchors']} | "
                      f"unlabeled inputs {func['inputs_unlabeled']}/{func['inputs']} | axe {summary[slug]['axe']}")
            except Exception as e:
                summary[slug]=f"ERROR: {str(e)[:120]}"; print(f"  {slug}: ERROR {str(e)[:120]}")
        json.dump(summary, open(f"{a.out}/_summary.{a.role}.json","w"), indent=2)
        b.close()
    print(f"\n>>> {a.role} capture complete: {sum(1 for v in summary.values() if isinstance(v,dict))}/{len(screens)} screens.")

if __name__=="__main__":
    main()
