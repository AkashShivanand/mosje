# NMBA — colour drift, measured

Read from the 50 capture colour inventories (`out/capture-bundle.json` -> `colorInventory`) on
2026-09-12. Every count is ELEMENTS that paint the colour, taken from the DOM — never sampled.

**This is evidence, not a finding.** The pairing is a heuristic: each build colour is matched to
its NEAREST design value within 24 points on one channel, so a pair can be coincidental — two
unrelated near-blacks, a lavender beside a blue. Read the deltas, and the `token?` column, which
says whether the design value is from the published token contract (`inputs/tokens.json`) or is
merely a colour that appears somewhere in the design frames.

- the token contract publishes **33** colours; the design frames use **17**, **40** distinct between them
- the build paints **92** distinct colours
- **27** of them are design values
- **31** more sit within 24 points of one — close enough to look right, far enough to
  be a different literal in the code

| elements | screens | build paints | nearest design value | delta | token? |
|---:|---:|---|---|---:|:---:|
| 1425 | 50 | `#9CA3AF` | `#94A3B8` | 9 | frame only |
| 201 | 1 | `#0A2C53` | `#002244` | 15 | yes |
| 200 | 1 | `#01001B` | `#0A0A0A` | 17 | frame only |
| 104 | 6 | `#D64539` | `#EC5042` | 22 | yes |
| 100 | 1 | `#DBEAFE` | `#D2E3FC` | 9 | yes |
| 93 | 4 | `#010019` | `#0A0A0A` | 15 | frame only |
| 88 | 1 | `#217A39` | `#2E7D32` | 13 | yes |
| 54 | 1 | `#EDE7F6` | `#E5EFF9` | 8 | yes |
| 48 | 2 | `#E5EAF2` | `#E5E7EB` | 7 | yes |
| 39 | 6 | `#DCFCE7` | `#E8F5E9` | 12 | yes |
| 24 | 9 | `#EEF0FF` | `#E8F0FE` | 6 | yes |
| 23 | 4 | `#CCCCCC` | `#D1D5DB` | 15 | yes |
| 23 | 8 | `#111827` | `#212529` | 16 | frame only |
| 18 | 3 | `#92400E` | `#8C571F` | 23 | frame only |
| 16 | 4 | `#EF4444` | `#EC5042` | 12 | yes |
| 16 | 4 | `#CED4DA` | `#D1D5DB` | 3 | yes |
| 10 | 7 | `#F3F5F8` | `#F3F4F6` | 2 | yes |
| 6 | 6 | `#FFF6E5` | `#FFF4E5` | 2 | yes |
| 6 | 6 | `#FDE8EF` | `#FDECEA` | 5 | yes |
| 6 | 6 | `#EEF1F4` | `#F3F4F6` | 5 | yes |
| 6 | 6 | `#E6F7FB` | `#E8F0FE` | 7 | yes |
| 6 | 6 | `#E5F1FB` | `#E5EFF9` | 2 | yes |
| 6 | 3 | `#333333` | `#212529` | 18 | frame only |
| 5 | 5 | `#010000` | `#000000` | 1 | frame only |
| 4 | 2 | `#FFFBEB` | `#FFF4E5` | 7 | yes |
| 4 | 4 | `#FAFAFA` | `#F9FAFB` | 1 | yes |
| 4 | 1 | `#E6F0F9` | `#E5EFF9` | 1 | yes |
| 3 | 3 | `#F4F4F4` | `#F3F4F6` | 2 | yes |
| 2 | 1 | `#1763C6` | `#1558B0` | 22 | yes |
| 1 | 1 | `#E5EAF0` | `#E5E7EB` | 5 | yes |
| 1 | 1 | `#1A2C47` | `#1F2937` | 16 | yes |

The estate's rule is that a colour is BOUND to a token, never typed. A literal that merely
EQUALS a token is already a defect; one that nearly equals it is that defect plus a visible
difference. The largest row here is a single grey on over a thousand elements.
