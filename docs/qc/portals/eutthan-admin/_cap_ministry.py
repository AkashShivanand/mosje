#!/usr/bin/env python3
"""Ministry keep-alive capture with nav auto-discovery (we don't have ministry live URLs).
Log in once as ministry; it captures the landing page, discovers sidebar/nav routes, and captures each."""
import json, os, re
from playwright.sync_api import sync_playwright

LOGIN="https://eutthan-admin-uat.mosje.in/login"
OUT="captures/live"; MARKER="/login"; TIMEOUT=360
os.makedirs(OUT, exist_ok=True)
PROPS=["font-family","font-size","font-weight","line-height","letter-spacing","color",
       "background-color","border-top-width","border-color","border-radius","padding",
       "height","width","box-shadow","text-align"]
TARGETS={"topbar":["header","[class*=header i]","nav"],"sidebar":["aside","[class*=sidebar i]","[class*=side-nav i]"],
  "page_title":["h1","h2","[class*=title i]"],"primary_btn":["button[type=submit]",".btn-primary","button"],
  "table_head":["thead th","table th"],"table_cell":["tbody td","table td"],
  "input":["input:not([type=hidden])","select","textarea"],"label":["label"],
  "card":[".card","[class*=card i]"],"body":["body"]}

def css_for(page,sels):
    return page.evaluate("""(sels)=>{let el=null;for(const s of sels){try{const e=document.querySelector(s);if(e){el=e;break;}}catch(_){}}
      if(!el)return null;const s=getComputedStyle(el);const o={};%s.forEach(p=>o[p]=s.getPropertyValue(p));
      o.text=(el.innerText||el.value||'').slice(0,40);o.tag=el.tagName.toLowerCase();return o;}"""%json.dumps(PROPS),sels)

def functional(page):
    return page.evaluate("""()=>{const a=[...document.querySelectorAll('a')];
      const broken=a.filter(x=>{const h=(x.getAttribute('href')||'').trim();return h===''||h==='#'||h.startsWith('javascript:');}).length;
      const inputs=[...document.querySelectorAll('input:not([type=hidden])')];
      const unlabeled=inputs.filter(i=>!i.labels?.length&&!i.getAttribute('aria-label')&&!i.getAttribute('aria-labelledby')).length;
      return {anchors:a.length,broken_links:broken,inputs:inputs.length,inputs_unlabeled:unlabeled,
        buttons:document.querySelectorAll('button').length,forms:document.querySelectorAll('form').length,
        h1:document.querySelectorAll('h1').length};}""")

def axe(page):
    try:
        page.add_script_tag(url="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js"); page.wait_for_timeout(400)
        return page.evaluate("""async()=>{const r=await axe.run(document,{resultTypes:['violations']});
          return r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,tags:v.tags.filter(t=>t.startsWith('wcag')),nodes:v.nodes.length,sample:(v.nodes[0]&&v.nodes[0].html||'').slice(0,120)}));}""")
    except Exception as e: return [{"error":str(e)[:120]}]

def slugify(url):
    p=re.sub(r'https?://[^/]+','',url).split('?')[0].strip('/')
    return ("MIN-"+(p.replace('/','-') or "DASHBOARD")).upper()[:40]

def cap(page,slug):
    page.wait_for_timeout(2200)
    page.screenshot(path=f"{OUT}/{slug}.png", full_page=True)
    json.dump({k:css_for(page,v) for k,v in TARGETS.items()}, open(f"{OUT}/{slug}.styles.json","w"), indent=2)
    f=functional(page); json.dump(f, open(f"{OUT}/{slug}.functional.json","w"), indent=2)
    json.dump(axe(page), open(f"{OUT}/{slug}.axe.json","w"), indent=2)
    return f

with sync_playwright() as p:
    b=p.chromium.launch(headless=False)
    ctx=b.new_context(viewport={"width":1440,"height":960}, device_scale_factor=2)
    page=ctx.new_page(); page.goto(LOGIN, wait_until="networkidle", timeout=30000)
    print(">>> Browser open. Log in as the MINISTRY user (shivendra).")
    w=0
    while w<TIMEOUT and MARKER in page.url: page.wait_for_timeout(2000); w+=2
    if MARKER in page.url: print("ABORTED: not authenticated"); b.close(); raise SystemExit
    try: page.wait_for_load_state("networkidle", timeout=8000)
    except Exception: pass
    page.wait_for_timeout(1500)
    landing=page.url; print(f">>> Authenticated. Landing: {landing}")
    summary={}
    # discover nav routes
    links=page.evaluate("""()=>{const set={};document.querySelectorAll('aside a[href], nav a[href], [class*=sidebar i] a[href], [class*=menu i] a[href]').forEach(a=>{
        const h=a.getAttribute('href')||'';const t=(a.innerText||'').trim();
        if(h&&!h.startsWith('#')&&!h.startsWith('http')&&!h.startsWith('javascript')) set[h]=t;});return set;}""")
    routes=list(dict.fromkeys([landing]+[ "https://eutthan-admin-uat.mosje.in"+(h if h.startswith('/') else '/'+h) for h in links.keys()]))
    print(f">>> Discovered {len(routes)} ministry routes:")
    for r in routes: print("   ", slugify(r), r, "|", links.get(re.sub(r'https?://[^/]+','',r),''))
    seen=set()
    for url in routes:
        slug=slugify(url)
        if slug in seen: continue
        seen.add(slug)
        try:
            page.goto(url, wait_until="networkidle", timeout=45000)
            if MARKER in page.url: summary[slug]="BOUNCED"; print(f"  {slug}: bounced"); continue
            f=cap(page,slug); summary[slug]={"func":f}
            print(f"  {slug}: ok | links {f['broken_links']}/{f['anchors']} | unlabeled {f['inputs_unlabeled']}/{f['inputs']}")
        except Exception as e: summary[slug]=f"ERR {str(e)[:100]}"; print(f"  {slug}: ERR {str(e)[:100]}")
    json.dump(summary, open(f"{OUT}/_summary.ministry.json","w"), indent=2)
    b.close()
    print(f"\n>>> ministry capture complete: {sum(1 for v in summary.values() if isinstance(v,dict))} screens.")
