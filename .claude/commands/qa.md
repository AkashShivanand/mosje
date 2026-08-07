---
description: Visual QA — diff a built page in the clone against its live original at desktop and mobile widths.
argument-hint: "<live-url> [local-url, default http://localhost:3007]"
allowed-tools: Read, Bash, mcp__Claude_in_Chrome__navigate, mcp__Claude_in_Chrome__browser_batch, mcp__Claude_in_Chrome__computer, mcp__Claude_in_Chrome__resize_window, mcp__Claude_in_Chrome__tabs_context_mcp
---

Visual-QA the local build against the live original.

- Live original: **$1**
- Local build: **${2:-http://localhost:3007}** (ensure the dev server is running via `preview_start` / `.claude/launch.json`; start it if needed)

Steps:
1. Open both URLs in the browser (Chrome MCP). Confirm both load.
2. At **1440px (desktop)** then **390px (mobile)**: scroll both top-to-bottom in matching increments, capturing screenshots of each section.
3. Compare section by section. For every discrepancy note: section, what differs (spacing, color, font-size, image, layout, missing/extra element), and the likely `file:line` in the component.
4. Test interactivity on the local build: nav dropdowns, tabs, carousel, ticker, modals — confirm they work and match the original's interaction model.
5. Output a prioritized discrepancy list (most visually obvious first) with the fix for each. Don't edit unless asked.

Honor `prefers-reduced-motion` and don't flag dynamic content (tickers, feeds) that legitimately differs per load.
