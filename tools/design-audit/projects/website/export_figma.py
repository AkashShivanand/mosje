#!/usr/bin/env python3
"""Export every exported-before handoff frame as PNG from the Figma REST API.

Reads inputs/figma-frames.json (frames with a `slug`), batches the image render calls, downloads
each image promptly (the render URLs expire), and verifies every PNG is complete. Idempotent: a
frame whose PNG is already on disk and complete is skipped.

  FIGMA_ACCESS_TOKEN must be set in the environment. It is never printed.
  python3 export_figma.py
"""
import json, os, time, urllib.request, urllib.error

BASE = os.path.dirname(os.path.abspath(__file__))
KEY = "Ds5qx61QsI0ZkYSrLKxo0A"
OUT = os.path.join(BASE, "captures", "figma")
TOKEN = os.environ["FIGMA_ACCESS_TOKEN"]


def complete(p):
    try:
        with open(p, "rb") as fh:
            fh.seek(-12, 2)
            return fh.read()[4:8] == b"IEND"
    except OSError:
        return False


def fetch(url, dst):
    """Download with retries: the export ran over a connection that dropped twice (EADDRNOTAVAIL,
    read timeout) and a single failure used to abort the whole run."""
    for attempt in range(5):
        try:
            with urllib.request.urlopen(url, timeout=120) as r, open(dst, "wb") as fh:
                fh.write(r.read())
            if complete(dst):
                return True
        except (OSError, urllib.error.URLError):
            pass
        time.sleep(5 * (attempt + 1))
    return False


def api(url):
    for attempt in range(6):
        req = urllib.request.Request(url, headers={"X-Figma-Token": TOKEN})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(int(e.headers.get("Retry-After", 30)) + 2)
                continue
            raise
        except OSError:
            time.sleep(10 * (attempt + 1))
    raise RuntimeError("rate-limited too many times")


def main():
    frames = [f for f in json.load(open(os.path.join(BASE, "inputs", "figma-frames.json")))
              if f.get("slug")]
    todo = [f for f in frames if not complete(os.path.join(OUT, f["slug"] + ".png"))]
    print(f"frames with a slug: {len(frames)}; to export: {len(todo)}")
    for scale in (1, 2):
        batch_src = [f for f in todo if (2 if f.get("kind") == "mobile" else 1) == scale]
        for i in range(0, len(batch_src), 8):
            batch = batch_src[i:i + 8]
            ids = ",".join(f["node_id"] for f in batch)
            res = api(f"https://api.figma.com/v1/images/{KEY}?ids={ids}&format=png&scale={scale}")
            for f in batch:
                url = (res.get("images") or {}).get(f["node_id"])
                if not url:
                    print("  no render:", f["slug"])
                    continue
                dst = os.path.join(OUT, f["slug"] + ".png")
                if not fetch(url, dst):
                    print("  failed after retries:", f["slug"])
            print(f"  scale {scale}: {min(i + 8, len(batch_src))}/{len(batch_src)}", flush=True)
            time.sleep(2)
    bad = [f["slug"] for f in frames if not complete(os.path.join(OUT, f["slug"] + ".png"))]
    print("missing or incomplete after export:", len(bad), bad[:10])


if __name__ == "__main__":
    main()
