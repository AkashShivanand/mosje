#!/usr/bin/env python3
"""Create a reusable Playwright session for capture. Tries the right method for the situation.

Usage:
  # Method A — manual (best for SSO / MFA / captcha; you log in by hand):
  python3 auth_login.py <login_url> --mode manual

  # Method B — credentials from ENV (simple username/password forms; secrets never written):
  QC_USER=... QC_PASS=... python3 auth_login.py <login_url> --mode creds \
      --user-sel "#username" --pass-sel "#password" --submit-sel "button[type=submit]"

  # (Public sites need no session at all — skip this script; capture.py runs without state.)

All methods persist ONLY the resulting cookies + localStorage to --state (default
.qc/storage-state.json). Credentials are read from the environment and never saved. Add the state
dir (e.g. .qc/) to .gitignore.

Requires: pip install playwright ; playwright install chromium
"""
import sys, os, argparse
from playwright.sync_api import sync_playwright

def _wait_for_login(page, login_marker, success_marker, timeout):
    """Poll until the browser leaves the login page (or hits a success marker).
    Works without a terminal — for headless-agent contexts where stdin has no TTY."""
    print(f">>> Waiting up to {timeout}s for you to finish logging in (polling the URL)...")
    waited = 0
    while waited < timeout:
        url = page.url
        left_login = login_marker and (login_marker not in url)
        hit_success = success_marker and (success_marker in url)
        if left_login or hit_success:
            try: page.wait_for_load_state("networkidle", timeout=8000)
            except Exception: pass
            page.wait_for_timeout(1500)
            print(f">>> Detected authenticated session (URL: {url})")
            return True
        page.wait_for_timeout(2000); waited += 2
    print(">>> Timeout — saving whatever session state exists.")
    return False

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("login_url")
    ap.add_argument("--mode", choices=["manual", "creds"], default="manual")
    ap.add_argument("--state", default=".qc/storage-state.json")
    ap.add_argument("--user-sel", default="input[type=text],input[type=email],#username")
    ap.add_argument("--pass-sel", default="input[type=password],#password")
    ap.add_argument("--submit-sel", default="button[type=submit],[type=submit]")
    ap.add_argument("--login-marker", default="login",
                    help="substring expected in the login URL; once it's gone, login is assumed done")
    ap.add_argument("--success-marker", default="",
                    help="optional substring whose presence in the URL confirms login (e.g. /dashboard)")
    ap.add_argument("--timeout", type=int, default=300, help="seconds to wait for manual login")
    a = ap.parse_args()
    os.makedirs(os.path.dirname(a.state) or ".", exist_ok=True)
    headless = a.mode == "creds"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        page.goto(a.login_url, wait_until="networkidle")
        if a.mode == "manual":
            print("\n>>> A browser window is open. Log in as the target user.")
            if sys.stdin and sys.stdin.isatty():
                print(">>> Press Enter here when authenticated (or just finish — it auto-detects).")
                try: input()
                except EOFError: _wait_for_login(page, a.login_marker, a.success_marker, a.timeout)
            else:
                _wait_for_login(page, a.login_marker, a.success_marker, a.timeout)
        else:  # creds — fill the form from env vars
            user, pw = os.environ.get("QC_USER"), os.environ.get("QC_PASS")
            if not (user and pw):
                print("ERROR: set QC_USER and QC_PASS in the environment for --mode creds.")
                browser.close(); sys.exit(2)
            page.fill(a.user_sel.split(",")[0], user)
            page.fill(a.pass_sel.split(",")[0], pw)
            try:
                page.click(a.submit_sel.split(",")[0])
            except Exception:
                page.keyboard.press("Enter")
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(1500)
        ctx.storage_state(path=a.state)
        print(f"Saved session -> {a.state}")
        browser.close()

if __name__ == "__main__":
    main()
