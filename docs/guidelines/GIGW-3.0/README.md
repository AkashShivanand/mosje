# GIGW 3.0 — Guidelines for Indian Government Websites and Apps

**GIGW is the binding one.** It is NIC/MeitY's standard for Government of India websites and
applications, covering quality, accessibility, cybersecurity and lifecycle management, and it is
what STQC certifies against. Everything else in this folder is brand or best practice; this is
the compliance floor.

| | |
| --- | --- |
| Publisher | National Informatics Centre (NIC), MeitY |
| Version | 3.0 |
| Binding? | **Mandatory.** Accessibility (WCAG 2.1 AA) is a legal requirement for GoI properties. |
| Source | guidelines.india.gov.in |

## Files

| File | What it is |
| --- | --- |
| `GIGW_3.0.md` | Faithful transcription. Each guideline keeps its original **Statement / Benefit / Government organisation action / Developer action / Evaluator action / Reference** structure — that structure is the point, so don't flatten it when quoting. |
| `GIGW_3.0.pdf` | The original. |
| `supplementary/Compliance-and-Certification-Handbook.pdf` | The certification process — what an evaluator actually checks, and how CQW certification is obtained. |
| `supplementary/Creating-Accessible-Documents.pdf` | How to produce accessible PDFs and office documents. Directly relevant: the estate publishes a lot of downloadable documents, and an inaccessible PDF fails GIGW just as a page would. |

## The four focus areas

| Area | What it covers |
| --- | --- |
| **Quality** | Structure, content currency, navigation, mandatory pages, search, performance |
| **Accessibility** | WCAG 2.1 AA — semantic HTML, keyboard operation, visible focus, contrast, alt text, ARIA |
| **Cybersecurity** | Secure development, auditing, VAPT, hosting |
| **Lifecycle management** | Ownership, review cycles, archival, the "Last Updated" stamp |

## Using it

- **Building:** §5.2 (accessibility guidelines and attributes) is the section to have open while
  writing any component. Pair it with `../UX4G-3.0/UX4G_3.0_Design_System.md` §6, which restates
  the same WCAG criteria in design-system terms with concrete specs (focus-ring geometry, the
  ARIA set, the keyboard map).
- **Auditing:** run the `accessibility-auditor` agent or the `/a11y` command; both work the
  checklist derived from this document. Every finding cites `[GIGW n.n]`.
- **Certification:** the governance items — STQC CQW certification, VAPT, Web Information
  Manager designation — are **process, not code**. Report them separately from build findings;
  no amount of correct markup satisfies them.

## Mandatory pages

GIGW requires these to exist and be reachable. Missing any one is a hard fail, independent of
how good the rest of the site is:

Contact · Feedback · Help · Sitemap · Search · Terms and Conditions · Privacy Policy ·
Copyright Policy · Hyperlinking Policy · Accessibility Statement · RTI · a "Last Updated" stamp.
