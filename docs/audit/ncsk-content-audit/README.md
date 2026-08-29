# NCSK content audit — working data

Nine JSON files recording the content audit of the **National Commission for Safai
Karamcharis** estate: what the legacy site published, what the live site publishes,
what this prototype holds, and where the three diverge.

They are an **audit record, not runtime content.** Nothing in `apps/hub` imports
them and nothing should — if a page needs one of these figures, the figure belongs
in `apps/hub/src/content/website/`, shaped like the content that ships.

## Why they are here and not where they were written

They arrived in `apps/hub/src/content/website/` — the directory the hub serves
website content from — and sat there with **zero consumers**, 760 KB of analysis
beside the six files that actually render.

That is not merely untidy. `tools/website-links/check.mjs` walks every `.json` in
that directory looking for anchors that point nowhere, so a stale href inside a
file nothing ships could fail the estate's build. Analysis data earns no such
power over a deploy. Moving it here removes that, and `docs/audit/` already held
`findings-all.json`, so the precedent was set.

## The files

| File | What it holds |
|---|---|
| `ncsk_legacy_sitemap.json` | Every URL on the legacy NCSK site |
| `ncsk_live_sitemap.json` | Every URL on the current live site |
| `ncsk_prototype_sitemap.json` | Every route this prototype serves |
| `ncsk_3estates_master_matrix.json` | The three sitemaps aligned, page by page |
| `ncsk_parity_analysis.json` | Where the three diverge |
| `ncsk_gap_analysis.json` | What is missing from the prototype |
| `ncsk_legacy_documents_inventory.json` | Documents published on the legacy site |
| `scraped_live_org_details.json` | Organisation details scraped from the live site |
| `live_org_extracted_details.json` | Those details after extraction |

## One thing this audit found that is now live

`ncsk/rajya-sabha-questions` shipped as a single paragraph. The audit had captured
the real table behind it — nine parliamentary questions with House, question number,
date and subject — and that table is now in `organisation.json`.

Its "Document" column was dropped rather than carried across. Every entry pointed at
`parliament-qa-sample.pdf`, a demonstration stand-in, and the estate already has 21
such links under review; adding nine more to a decision not yet taken would have been
the wrong way to land a content improvement. The cells read "Not available" until the
real papers are located.
