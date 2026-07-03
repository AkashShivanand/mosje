#!/usr/bin/env python3
"""Load + resolve a per-project audit.config.json. Project-agnostic: the engine reads
this config and nothing else about the project. Passwords come from a gitignored
secrets.json (or env), never from the committed config."""
import json, os

ENGINE_DIR = os.path.dirname(os.path.abspath(__file__))
TOOL_DIR = os.path.dirname(ENGINE_DIR)
PROJECTS_DIR = os.path.join(TOOL_DIR, "projects")

def project_dir(project):
    return os.path.join(PROJECTS_DIR, project)

def load(project):
    """Return (cfg, paths). cfg is the parsed config with secrets merged into roles."""
    pdir = project_dir(project)
    cfg = json.load(open(os.path.join(pdir, "audit.config.json")))
    # merge secrets (gitignored) into roles by name
    secrets = {}
    spath = os.path.join(pdir, "secrets.json")
    if os.path.exists(spath):
        secrets = {k: v for k, v in json.load(open(spath)).items() if not k.startswith("_")}
    for role in cfg.get("live", {}).get("roles", []):
        if role.get("auth") == "none":
            continue
        if "pass" not in role:
            env_key = f"AUDIT_PW_{project}_{role['name']}".upper().replace("-", "_")
            role["pass"] = os.environ.get(env_key) or secrets.get(role["name"])
    paths = {
        "project": pdir,
        "inputs": os.path.join(pdir, "inputs"),
        "captures": os.path.join(pdir, "captures"),
        "captures_live": os.path.join(pdir, "captures", "live"),
        "captures_figma": os.path.join(pdir, "captures", "figma"),
        "auth": os.path.join(pdir, "captures", ".auth"),
        "out": os.path.join(pdir, "out"),
    }
    for p in paths.values():
        os.makedirs(p, exist_ok=True)
    return cfg, paths

def figma_url(cfg, node):
    tmpl = cfg.get("figma", {}).get("urlTemplate")
    if not tmpl or not node:
        return None
    return tmpl.replace("{node}", str(node).replace(":", "-"))
