# MoSJE Architecture & Build Registry

The canonical map of the MoSJE digital estate and what's built vs. planned. Targets (13 sites, 20 portals, 33+ orgs/schemes) are from the project owner; the names below are seeded from the live `dosje.gov.in` (real) and marked where they still need confirmation.

## Two parts

| Part | Folder | What | Target | Status |
|------|--------|------|--------|--------|
| **Website** | `dosje/` | One unified informational site consolidating 13 legacy sites | 13 content domains → 1 site | Homepage **built** ✅ |
| **Portals** | `portals/` | Functional, authenticated workflow apps | 20 portals · 33+ orgs/schemes | pm-ajay dashboard built ✅ · smile-admin **pending recovery** ⏳ |

## Layout

```
MoSJE/
├── dosje/                  # the website (Next 16 · Tailwind v4 · shadcn · Noto Sans)
├── portals/                # functional portals (Next 15 · Tailwind v3 · Radix)
├── packages/
│   ├── design-system/      # shared, Figma-synced tokens + components (phase 2)
│   └── config/             # shared tailwind/eslint/tsconfig presets
├── docs/                   # BRDs, DBIM audit, research, architecture
├── Assets/  Documents/  Incoming/
└── .claude/                # workspace config (this setup)
```

---

## Part 1 — The unified website (`dosje/`): 13 content domains

The single site folds in the department + its commissions/bodies. **Built:** the DoSJE homepage (14 components). Remaining domains are added as pages/sections via the `clone-website` skill.

| # | Domain / source site | In nav as | Status |
|---|----------------------|-----------|--------|
| 1 | Department of Social Justice & Empowerment (home) | Home | ✅ built |
| 2 | NCSC — National Commission for Scheduled Castes | Associated Orgs | planned |
| 3 | NCSK — National Commission for Safai Karamcharis | Associated Orgs | planned |
| 4 | NCBC — National Commission for Backward Classes | Associated Orgs | planned |
| 5 | DWBDNC — Dev. & Welfare Board for DNT/Nomadic Communities | Associated Orgs | planned |
| 6 | DAF — Dr. Ambedkar Foundation | Associated Orgs | planned |
| 7 | DAIC — Dr. Ambedkar International Centre | Associated Orgs | planned |
| 8 | NISD — National Institute of Social Defence | Associated Orgs | planned |
| 9 | Senior Citizens Welfare | Associated Orgs | planned |
| 10–13 | _Remaining department/wing sites — confirm exact list_ | — | TBC |

> The "13" is the owner's figure; rows 10–13 need the canonical legacy-site list to fill in.

---

## Part 2 — The portals (`portals/`): 20 apps over 33+ orgs/schemes

Functional workflow apps. Seeded from the orgs/schemes surfaced on the live site; exact portal boundaries to be confirmed with the owner.

### Finance & development corporations
| Slug | Org | Status |
|------|-----|--------|
| `nsfdc` | National Scheduled Castes Finance & Development Corporation | planned |
| `nskfdc` | National Safai Karamcharis Finance & Development Corporation | planned |
| `nbcfdc` | National Backward Classes Finance & Development Corporation | planned |

### Schemes & scholarships
| Slug | Scheme | Status |
|------|--------|--------|
| `pm-ajay` | Pradhan Mantri Anusuchit Jaati Abhyuday Yojna | ✅ **built** — MIS dashboard (6 views · 60 KPIs · port 4124) |
| `nos` | National Overseas Scholarship | planned |
| `pm-yasasvi` | PM Young Achievers Scholarship (PM-YASASVI) | planned |
| `pre-matric-sc` | Pre-Matric Scholarship (SC & others) | planned |
| `post-matric-sc` | Post-Matric Scholarship (SC) | planned |
| `top-class-obc` | Top Class Education (OBC/EBC/DNT) | planned |

### Social defence & welfare
| Slug | Org/Programme | Status |
|------|---------------|--------|
| `smile-transgender` | SMILE — National Portal for Transgender Persons | planned |
| `smile-beggary` | SMILE — Beggary rehabilitation (admin portal) | ⏳ **was built — recover** |
| `nmba` | Nasha Mukt Bharat Abhiyaan | planned |
| `nisd` | National Institute of Social Defence (training) | planned |
| `senior-citizens` | Senior Citizens welfare services | planned |

### Commissions (grievance/workflow portals)
`ncsc`, `ncsk`, `ncbc`, `dwbdnc` — planned.

> ~14 identified above; the remaining portals to reach **20** and the full **33+ orgs/schemes** list should come from the owner's master list. Add rows as confirmed.

---

## Cross-cutting

- **Shared design system** (`packages/design-system`) is the linchpin — every site + portal renders from it, kept in Figma sync via Code Connect (`/sync-figma`). Extraction is phase 2.
- **Per-portal ports** start at 4123 and increment; record each in `.claude/launch.json`.
- **Standards:** DBIM (brand identity) + GIGW (gov web guidelines) + WCAG 2.1 AA. See `Documents/MoSJE DBIM Audit.pdf` — a future `gov-compliance` skill should encode its findings.
- **Build loop per property:** `clone-website` (or design from Figma) → `/review` → `/a11y` → `/qa` → ship.

_This registry is the source of truth for scope. Update statuses as properties are built._
