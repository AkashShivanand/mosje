# Service Discovery — where every piece of data came from

Generated 2026-09-09 by `tools/service-discovery/build-data.mjs` from
`docs/research/dosje-scheme-master-2026-09.json`. This is the reference for anyone who later asks
"where did that come from?". Nothing on any screen, slide or Figma frame comes from anywhere else.
The beta website's own Schemes list was **not** used: the 8 September 2026 review found it counts
guideline pages, status tables and State schemes as Department schemes.

## 1. The documents

| Code | Document |
|---|---|
| **AR** | Department of Social Justice and Empowerment, Annual Report 2025-26 — socialjustice.gov.in/writereaddata/UploadFile/71441776233188.pdf (Chapter 3 for the schemes, §1.2 for the mandate) |
| **SBE** | Notes on Demands for Grants 2026-27, Demand No. 93, Department of Social Justice and Empowerment — indiabudget.gov.in/doc/eb/sbe93.pdf |
| **PIB** | Press Information Bureau, Year-End Review 2025 of the Department, release 2209488 (29 December 2025), and the individual releases cited by number |
| **SJ** | socialjustice.gov.in/schemes/<n> — the Department's legacy site, one page per scheme |
| **DOSJE** | dosje.gov.in — the Department's organisation pages, used only for portal and helpline names |

Every row below cites at least one of these. A figure (an amount, an age, an income ceiling)
appears on a screen only when a source states it; where two sources disagree the figure is left
off and the disagreement is in §7.

## 2. The groups a citizen chooses from

| On the screen | Taken from |
|---|---|
| Students | cross-cutting — every scholarship names a community and a stage; a student looks for the stage first. Listed after the mandate groups, with the other two personas the schemes rather than the mandate name. Source: the scholarship records in AR ch.3 (§3.2–3.5, §3.19–3.22, §3.27) each name students of the groups the Department serves. |
| Scheduled Castes | Scheduled Castes (SCs) (AR §1.2) |
| Other Backward Classes | Other Backward Classes (OBCs); Economically Backward Classes (EBCs) (AR §1.2) |
| De-notified, Nomadic and Semi-Nomadic Tribes | De-notified, Nomadic and Semi-Nomadic Tribes (DNTs) (AR §1.2) |
| Safai Karamcharis | Manual Scavengers; Sewer & Septic Tank workers; Waste Pickers (AR §1.2) |
| Senior Citizens | Senior Citizens (AR §1.2) |
| Transgender Persons | Transgender Persons (AR §1.2) |
| Persons Affected by Substance Use | Victims of Alcoholism and Substance Abuse (AR §1.2) |
| Persons Engaged in Begging | Persons engaged in Beggary (AR §1.2) |
| Victims of Atrocities | served through the PCR-PoA scheme (AR §3.9) and the National Helpline Against Atrocities |
| Voluntary Organisations | delivery partners under AVYAY, NAPDDR, SHRESHTA, SMILE and PM-AJAY (AR §3.39) |

The mandate itself, AR §1.2, names: Scheduled Castes (SCs); Other Backward Classes (OBCs); Senior Citizens; Victims of Alcoholism and Substance Abuse; Transgender Persons; Persons engaged in Beggary; De-notified, Nomadic and Semi-Nomadic Tribes (DNTs); Manual Scavengers; Sewer & Septic Tank workers; Waste Pickers; Economically Backward Classes (EBCs); Economically Weaker Sections (EWS).

## 3. The kinds of support

| On the screen | What it covers | Source |
|---|---|---|
| Scholarships and Fellowships | Pre-matric to Ph.D., and study abroad | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Residential Schools, Hostels and Coaching | Top-class schools, hostels and free coaching for competitive examinations | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Loans and Credit | Concessional loans, interest subvention and venture capital through the Department's corporations | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Skill Training and Livelihood | Free training with stipend, self-employment support, village development | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Care, Shelter and Health | Old-age homes, shelter homes, assistive devices and health cover | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| De-addiction and Counselling | Treatment centres, the 14446 helpline and Nasha Mukt Bharat Abhiyaan | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Protection, Relief and Grievance | Relief to atrocity victims, the 14566 helpline, and the Commissions' grievance portals | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Grants to Voluntary Organisations | Grant-in-aid through the e-Anudaan portal | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Housing and Settlement | A house or a plot, and the roads, drainage and common works of a village or basti | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |
| Awards and Recognition | Merit awards for examination results, national awards for service, and academic chairs | AR Chapter 3 — the sections of the schemes tagged with it (see §5) |

## 4. Portals, helplines and places to apply

A link is shown on a screen only where the site answered when checked on 2026-09-09
(HTTPS request from the design workstation; a link is shown only where the site answered 200). The rest are named in words.

| Route | Shown as | Link | Source |
|---|---|---|---|
| `nsp` | National Scholarship Portal | https://scholarships.gov.in | AR §3.20, §3.21 — merit lists prepared on the National Scholarship Portal |
| `state` | the State's scholarship portal | named only | SJ 25 — awardees are selected by the State Government/UT to which the applicant belongs |
| `nos` | the NOS portal | https://nosmsje.gov.in | SJ 28 — apply online on the portal https://nosmsje.gov.in |
| `ugc` | the UGC | https://www.ugc.gov.in | SBE 8.01 — the implementing agency of this scheme is UGC |
| `nbcfdc` | NBCFDC | https://nbcfdc.gov.in | AR §3.36 — lending through State Channelising Agencies and banks; NFOBC nodal agency |
| `nsfdc` | NSFDC | https://nsfdc.nic.in | AR §3.34; SJ 34 |
| `nskfdc` | NSKFDC | named only — nskfdc.nic.in refused the connection | AR §3.35; SJ 37 |
| `canara` | Canara Bank | named only | AR §3.24 — implemented through the Canara Bank |
| `shreshta` | the SHRESHTA entrance test (NTA) | named only | AR §3.10; PIB |
| `pmajay` | the PM-AJAY portal | https://pmajay.dosje.gov.in | SJ 104 |
| `district` | the District administration | named only | AR §3.9 — Central assistance released to States/UTs; relief is administered locally |
| `nhaa` | Helpline 14566 | tel:14566 | PIB 1780979 (13 Dec 2021); DOSJE organisation page NHAA |
| `ncsc` | the NCSC grievance portal | https://ncsc.nic.in | AR §3.27 |
| `ncsk` | the NCSK | named only | AR §3.28 |
| `namaste` | the urban local body (NAMASTE) | named only | AR §3.11 — profiling through the NAMASTE application; NAMASTE cards issued by ULBs/PRIs |
| `bank` | the lending bank | named only | AR §3.25 |
| `ifci` | IFCI Venture | named only | PIB — IFCI manages the fund |
| `pmdaksh` | the PM-DAKSH portal | named only | AR §3.13 — implemented by the three corporations through selected training institutes — the portal address was not confirmed on 9 September 2026, so no link is shown |
| `alimco` | an ALIMCO camp | named only | AR §3.14 C — implemented by ALIMCO as Central Nodal Agency |
| `elderline` | Elderline 14567 | tel:14567 | AR §3.14 D |
| `eanudaan` | the e-Anudaan portal | https://grants-msje.gov.in | AR §3.39 — grants-msje.gov.in |
| `nmba` | Helpline 14446, or the nearest centre | tel:14446 | AR §3.15 — toll-free helpline 14446; nmba.dosje.gov.in |
| `smile` | the shelter home (urban local body) | named only | AR §3.16 — implemented in 181 cities through District Administrations and ULBs |
| `tgportal` | the National Portal for Transgender Persons | named only | AR §3.17; DOSJE organisation page — the portal address was not confirmed on 9 September 2026, so no link is shown |
| `seed` | the SEED portal | named only — seed.dosje.gov.in did not resolve | SJ 109 |
| `institution` | the school or college | named only | AR §3.22 — assistance to States/UTs and institutions for construction |
| `wcd` | the District Magistrate (WCD) | named only | AR §3.26 |
| `daf` | Dr. Ambedkar Foundation | named only | AR §3.31 |
| `nisd` | a NISD-affiliated institute | named only | AR §3.14 F |

The persona band on the One Tap option shows one of these per group:

| Group | Band | Source |
|---|---|---|
| Students | National Scholarship Portal — Scholarships from pre-matric to post-matric, in one place | AR §3.20, §3.21 |
| Scheduled Castes | NSFDC — Concessional loans for Scheduled Castes, through the State channelising agency | AR §3.34; SJ 34 |
| Other Backward Classes | NBCFDC — Concessional loans and skill training for Other Backward Classes | AR §3.36 |
| De-notified, Nomadic and Semi-Nomadic Tribes | the SEED portal — Coaching, health insurance, housing and livelihood for DNT communities | SJ 109 |
| Safai Karamcharis | NSKFDC — Loans and skill training for Safai Karamcharis and their dependants | AR §3.35; SJ 37 |
| Senior Citizens | Elderline 14567 — Toll-free helpline for senior citizens | AR §3.14 D |
| Transgender Persons | the National Portal for Transgender Persons — Certificate of identity and welfare support for transgender persons | AR §3.17 |
| Persons Affected by Substance Use | Helpline 14446, or the nearest centre — Toll-free helpline for de-addiction and counselling | AR §3.15 |
| Victims of Atrocities | Helpline 14566 — National Helpline Against Atrocities, round the clock | PIB 1780979 |
| Voluntary Organisations | the e-Anudaan portal — Grant-in-aid applications for voluntary organisations | AR §3.39 |

## 5. The schemes — every field, and its source

| Scheme | Type | Who it names | What it gives | Where to apply | Sources |
|---|---|---|---|---|---|
| **Post Matric Scholarship for Scheduled Castes**<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | SC students studying at the post-matric stage; parent or guardian income up to ₹2.5 lakh a year. | Compulsory non-refundable fees, including tuition, and an academic allowance for the whole course after Class X. | the State's scholarship portal; National Scholarship Portal | AR §3.1; SBE 26; PIB; SJ 25 |
| **Pre-Matric Scholarship for Scheduled Castes and Others**<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | SC students in Class IX and X with family income up to ₹2.5 lakh; and children in Class I to X of manual scavengers, tanners and flayers, waste pickers and hazardous-cleaning workers, with no income limit. | An academic allowance of ₹3,500 a year for day scholars and ₹7,000 or ₹8,000 for hostellers. | the State's scholarship portal; National Scholarship Portal | AR §3.2; SBE 27; PIB |
| **National Fellowship for Scheduled Caste Students**<br><small>SHREYAS for SCs</small> | Central Sector | SC students who have qualified UGC NET-JRF or UGC-CSIR NET-JRF, for Ph.D. at a UGC-recognised institution. | A Ph.D. fellowship with contingency and house rent allowance; 2,000 new fellowships a year. | the UGC | AR §3.3; SBE 8.01; PIB |
| **National Overseas Scholarship for SCs and Others**<br><small>SHREYAS for SCs</small> | Central Sector | Students from Scheduled Castes, DNT, NT and SNT communities, landless agricultural labourers and traditional artisans; family income up to ₹8 lakh; age up to 35; admission to a top-500 QS-ranked university. | Tuition, maintenance and contingency allowances, visa, insurance and air passage for a Master's or Ph.D. abroad; 125 slots a year, 30% for women. | the NOS portal | AR §3.4; SBE 8.04; PIB; SJ 28 |
| **Top Class Education for Scheduled Caste Students**<br><small>SHREYAS for SCs</small> | Central Sector | SC students with family income up to ₹8 lakh admitted to a notified institution; 30% of slots for SC girl students. | Full tuition and non-refundable charges, plus an academic allowance of ₹86,000 in the first year and ₹41,000 in each later year, at 274 notified institutions. | National Scholarship Portal | AR §3.5; SBE 8.03; PIB |
| **Free Coaching for SCs, OBCs and PM CARES Children**<br><small>SHREYAS for SCs</small> | Central Sector | SC and OBC students with family income up to ₹8 lakh, and beneficiaries of the PM CARES for Children scheme with no income or caste condition. | Course fee up to ₹75,000 and a stipend of ₹4,000 a month for up to 12 months of coaching for competitive and entrance examinations. | National Scholarship Portal | AR §3.6; SBE 8.02; PIB |
| **SHRESHTA — Residential Education for Students in High Schools in Targeted Areas** | Central Sector | Meritorious SC students selected through the National Entrance Test for SHRESHTA; and voluntary organisations running schools and hostels for SC students. | Mode I: full tuition and hostel fees at a top private residential school from Class 9 or 11 to Class 12. Mode II: grant-in-aid to NGO-run residential schools and hostels for SC students. | the SHRESHTA entrance test (NTA); the e-Anudaan portal | AR §3.10; SBE 9; PIB |
| **Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)**<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | Scheduled Caste communities, through the State Government and District administration; 100% centrally funded. | Development of SC-dominated villages as Adarsh Gram; grants-in-aid for district and State livelihood and infrastructure projects; hostels in higher-education institutions. | the PM-AJAY portal | AR §3.7; SBE 28; PIB; SJ 104 |
| **Implementation of the PCR Act, 1955 and the SC/ST (PoA) Act, 1989**<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | Victims of atrocities under the two Acts, and their dependants, through the State Government. | Relief and rehabilitation of atrocity victims and their dependants; an incentive for inter-caste marriages where one spouse is a Scheduled Caste; SC/ST Protection Cells, special police stations and exclusive special courts. | Helpline 14566; the District administration | AR §3.9; SBE 29; PIB |
| **National Helpline Against Atrocities — 14566** | Helpline | Anyone reporting an atrocity against a member of a Scheduled Caste or Scheduled Tribe. | A toll-free, round-the-clock helpline in Hindi, English and regional languages that registers complaints under the PoA Act and follows them to an FIR. | Helpline 14566 | PIB 1780979; DOSJE NHAA |
| **NCSC e-Grievance Management Portal** | Grievance | Any member of a Scheduled Caste with a grievance about a safeguard. | Lodging and tracking of a complaint about deprivation of the rights and safeguards of Scheduled Castes, with SMS and e-mail updates at each stage. | the NCSC grievance portal | AR §3.27; PIB |
| **National Action for Mechanised Sanitation Ecosystem (NAMASTE)** | Central Sector | Sewer and septic tank workers, waste pickers, and manual scavengers and their dependants. | Profiling and a NAMASTE card; PPE kits and safety training; health cover under Ayushman Bharat PM-JAY; capital subsidy for sanitation vehicles and equipment under Swachhta Udyami Yojana; skill training with stipend for manual scavengers and dependants. | the urban local body (NAMASTE); NSKFDC | AR §3.11; SBE 17; PIB; SJ 37 |
| **NSKFDC Concessional Loans** | Corporation | Safai Karamcharis including waste pickers, manual scavengers, and their dependants. | Concessional loans for income-generating activities and education, with priority to women through Mahila Samridhi Yojana and Mahila Adhikarita Yojana. | NSKFDC | AR §3.35; PIB |
| **National Commission for Safai Karamcharis** | Grievance | Safai Karamcharis and the families of sewer and septic tank workers. | Investigation of grievances of Safai Karamcharis, and pursuit of compensation in sewer and septic tank death and disability cases. | the NCSK | AR §3.28; PIB |
| **NSFDC Concessional Loans** | Corporation | Scheduled Caste families within the Corporation's income ceiling. | Micro finance up to ₹1.40 lakh, term loans up to ₹50 lakh and education loans up to ₹40 lakh at concessional interest, through State Channelising Agencies and banks. | NSFDC | AR §3.34; PIB; SJ 34 |
| **NBCFDC Concessional Loans** | Corporation | Members of Backward Classes with annual family income up to ₹3 lakh. | Individual loans up to ₹25 lakh, group loans up to ₹25 lakh per self-help group, and education loans up to ₹25 lakh at concessional interest. | NBCFDC | AR §3.36; PIB |
| **VISVAS Yojana — Interest Subvention** | Central Sector | SC and OBC borrowers with family income up to ₹3 lakh, and Safai Karamcharis with no income limit, holding standard loan accounts. | A 5% interest subvention, paid by direct benefit transfer, on income-generating loans up to ₹5 lakh for individuals and ₹10 lakh for self-help groups. | the lending bank | AR §3.25; SBE 10; PIB |
| **Venture Capital Fund for SCs and for Backward Classes, with ASIIM** | Central Sector | SC and Backward Class entrepreneurs and start-ups. | Concessional finance from ₹10 lakh to ₹15 crore for SC enterprises and ₹20 lakh to ₹15 crore for Backward Class enterprises; equity up to ₹30 lakh for SC youth start-ups under ASIIM. | IFCI Venture | AR §3.12; SBE 12; PIB |
| **PM-DAKSH — Skill Training** | Central Sector | Persons aged 18 to 45 from Scheduled Castes, DNTs and sanitation work with no income limit; OBCs with family income up to ₹3 lakh; EBCs up to ₹1 lakh. | Free skill training, from up-skilling to long-term courses, with a stipend or boarding and lodging, and placement support. | the PM-DAKSH portal | AR §3.13; SBE 11; PIB |
| **Integrated Programme for Senior Citizens**<br><small>Atal Vayo Abhyuday Yojana</small> | Centrally Sponsored | Indigent senior citizens; and organisations working in old-age care for at least two years. | Grant-in-aid to organisations running senior citizen homes, continuous care homes and day-care centres that give free shelter, food, medical care and recreation. | the e-Anudaan portal | AR §3.14 A; SBE 31; PIB |
| **Rashtriya Vayoshri Yojana**<br><small>Atal Vayo Abhyuday Yojana</small> | Central Sector | Senior citizens aged 60 or above, holding Aadhaar, who are BPL or have a monthly income of not more than ₹15,000. | Free physical aids and assistive devices for age-related disability or infirmity, distributed through ALIMCO camps. | an ALIMCO camp | AR §3.14 C; SBE 18; PIB |
| **Elderline — National Helpline for Senior Citizens, 14567**<br><small>Atal Vayo Abhyuday Yojana</small> | Helpline | All senior citizens. | Free information, guidance, emotional support and field intervention in cases of abuse and rescue, in every State and UT. | Elderline 14567 | AR §3.14 D; PIB |
| **Training of Geriatric Caregivers**<br><small>Atal Vayo Abhyuday Yojana</small> | Central Sector | Persons aged 18 or above with the qualification the job role requires. | Certified training in geriatric care at medical and nursing colleges and NISD-affiliated institutes, to create a pool of professional caregivers. | a NISD-affiliated institute | AR §3.14 F; PIB |
| **National Action Plan for Drug Demand Reduction and Nasha Mukt Bharat Abhiyaan**<br><small>Umbrella Programme for Development of Other Vulnerable Groups</small> | Centrally Sponsored | Persons dependent on alcohol or drugs and their families; and NGOs running de-addiction and outreach centres. | Integrated Rehabilitation Centres for Addicts, Outreach and Drop-In Centres, District De-Addiction Centres and Addiction Treatment Facilities in government hospitals; the toll-free de-addiction helpline 14446; grant-in-aid to the voluntary organisations that run the centres. | Helpline 14446, or the nearest centre; the e-Anudaan portal | AR §3.15; SBE 32; PIB |
| **SMILE — Comprehensive Rehabilitation of Persons Engaged in Begging**<br><small>SMILE</small> | Central Sector | Persons engaged in begging, and their children. | Survey and identification, outreach and rescue, shelter homes with food, clothing, counselling and medical aid, and rehabilitation through education, skilling and self-employment; in 181 cities. | the shelter home (urban local body) | AR §3.16; SBE 15.01; PIB; SJ 99 |
| **SMILE — Comprehensive Rehabilitation for Welfare of Transgender Persons**<br><small>SMILE</small> | Central Sector | Transgender persons holding a certificate of identity issued through the National Portal; and CBOs and NGOs able to run a shelter home. | A certificate of identity through the National Portal for Transgender Persons; Garima Greh shelter homes; health cover under Ayushman Bharat PM-JAY; skill development and entrepreneurship training; Transgender Protection Cells in the States. | the National Portal for Transgender Persons; the e-Anudaan portal | AR §3.17; SBE 15.02; PIB; SJ 99 |
| **PM-YASASVI Pre-Matric Scholarship for OBC, EBC and DNT Students**<br><small>PM-YASASVI</small> | Centrally Sponsored | OBC, EBC and DNT students in Class IX and X in Government schools, with family income up to ₹2.5 lakh. | A consolidated academic allowance of ₹4,000 a year, paid by direct benefit transfer. | the State's scholarship portal; National Scholarship Portal | AR §3.18; SBE 30.02; PIB; SJ 101 |
| **PM-YASASVI Post-Matric Scholarship for OBC, EBC and DNT Students**<br><small>PM-YASASVI</small> | Centrally Sponsored | OBC, EBC and DNT students at the post-matric stage, with family income up to ₹2.5 lakh. | An academic allowance of ₹5,000 to ₹20,000 a year by category of course, for study after Class X. | the State's scholarship portal; National Scholarship Portal | AR §3.19; SBE 30.01; PIB; SJ 101 |
| **PM-YASASVI Top Class School Education for OBC, EBC and DNT Students**<br><small>PM-YASASVI</small> | Centrally Sponsored | OBC, EBC and DNT students admitted to a shortlisted school, with household income under ₹2.5 lakh; selected on the National Scholarship Portal merit list. | Tuition, hostel and other school charges up to ₹75,000 a year in Class 9 and 10 and ₹1,25,000 a year in Class 11 and 12, at shortlisted top schools; 30% of scholarships for girls. | National Scholarship Portal | AR §3.20; SBE 30.05; PIB |
| **PM-YASASVI Top Class College Education for OBC, EBC and DNT Students**<br><small>PM-YASASVI</small> | Centrally Sponsored | OBC, EBC and DNT students with family income up to ₹2.5 lakh admitted to a notified institution; 30% of slots for girl students. | Full tuition and non-refundable charges, living expenses of ₹3,000 a month, ₹5,000 a year for books, and a one-time laptop allowance of ₹45,000, at IIMs, IITs, AIIMS, NITs, NLUs and other notified institutions. | National Scholarship Portal | AR §3.21; SBE 30.04; PIB |
| **Construction of Hostels for OBC Boys and Girls**<br><small>PM-YASASVI</small> | Centrally Sponsored | OBC students from rural areas, through the institution or State that builds the hostel. | Central assistance to States, UTs and NIRF-ranked institutions to build hostels for OBC students near Government schools, colleges and universities. | the school or college | AR §3.22; SBE 30.03; PIB |
| **National Fellowship for OBC Students**<br><small>SHREYAS for OBCs and EBCs</small> | Central Sector | OBC students who have qualified UGC NET-JRF or UGC-CSIR NET-JRF. | A Junior and Senior Research Fellowship at UGC rates for M.Phil. and Ph.D.; 1,000 fellowships a year, 750 in humanities and social sciences and 250 in science. | NBCFDC | AR §3.23; SBE 13.01; PIB |
| **Dr. Ambedkar Interest Subsidy on Education Loans for Overseas Studies for OBCs and EBCs**<br><small>SHREYAS for OBCs and EBCs</small> | Central Sector | OBC candidates within the creamy-layer limit and EBC candidates with family income up to ₹5 lakh, admitted to an approved course abroad. | The full interest for the moratorium period on an education loan of up to ₹20 lakh for a Master's, M.Phil. or Ph.D. abroad; half of the assistance reserved for women. | Canara Bank | AR §3.24; SBE 13.02 |
| **Scheme for Economic Empowerment of DNTs (SEED)** | Central Sector | Members of De-notified, Nomadic and Semi-Nomadic communities holding a DNT certificate. | Free coaching for competitive examinations; health insurance through Ayushman Bharat; livelihood support through self-help groups; and financial assistance for housing through PM Awas Yojana. | the SEED portal | AR §3.30; SBE 14; PIB; SJ 109 |
| **Special Scholarship under PM CARES for Children** | Central Sector | Children who lost both parents, or their legal guardian or surviving parent, to COVID-19, identified by the District Magistrate under the PM CARES for Children scheme. | ₹20,000 a year for a child in Class 1 to 12: a monthly allowance of ₹1,000 and an academic allowance of ₹8,000 for fees, books, uniform and equipment. | the District Magistrate (WCD) | AR §3.26; SBE 25 |
| **Dr. Ambedkar Medical Aid Scheme**<br><small>Dr. Ambedkar Foundation</small> | Foundation | SC and ST patients with annual family income under ₹3 lakh. | Medical treatment for serious ailments requiring surgery of the kidney, heart, liver, brain, cancer or other life-threatening disease. | Dr. Ambedkar Foundation | AR §3.31; PIB |
| **Dr. Ambedkar National Merit Awards for Class 10 and Class 12**<br><small>Dr. Ambedkar Foundation</small> | Foundation | SC and ST students who scored at least 50% in a recognised Board's secondary examination; SC students in the senior secondary examination. | Cash awards of ₹40,000 to ₹60,000 for the top three SC and ST students of each recognised Board in Class 10, with a separate award for the highest-scoring girl; awards for SC students in Class 12 in four streams. | Dr. Ambedkar Foundation | AR §3.31; PIB |
| **e-Anudaan — Grant-in-Aid to Voluntary Organisations** | Portal | Voluntary organisations registered on NGO Darpan applying under AVYAY, NAPDDR, SHRESHTA Mode II, SMILE and the Department's other grant schemes. | Online application, processing and sanction of grant-in-aid for five Department schemes, with NGO Darpan verification and PFMS payment. | the e-Anudaan portal | AR §3.39 |

Codes: AR, SBE, PIB, SJ, DOSJE as in §1. "AR §3.n" is a section of Chapter 3 of the Annual
Report; "SBE n.nn" is a line item in the Demand for Grants; "SJ n" is the legacy site's scheme page
number; "PIB n" is a release number.

## 6. What the beta site lists that is not here, and why

| Listed there | Why it is not here |
|---|---|
| List of 46 offences under the SC and ST PoA Act, 1989 | A reference list, not a scheme. Shown as a scheme on the beta site and questioned on the 8 September call. |
| Guidelines of NAMASTE; Revised Guidelines of NAMASTE; Revised guidelines for Waste Pickers under NAMASTE | Guideline documents of one scheme, listed three times as schemes. |
| Status of Loan Application…; Status of SRMS as on 30 April 2018; Financial & Physical Achievements of NSKFDC upto 2018; Data of Central Assistance released… | Status tables and achievement reports, not schemes. |
| Ashram Shalas; CM Housing Rent Scheme; Gadia Lohar Scheme; Post SSC Scholarship for Boys/Girls; Savitribai Phule Scholarship for VJNT/SBC; Vimukt Jati Hostel Scheme; Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship; Mukhyamantri Vimukt Ghumantu… Swarozgar Yojana; and the other VJNT/SBC entries | State Government schemes, mostly Maharashtra's and Rajasthan's, catalogued without their State. None appears in the Department's Annual Report or Demand for Grants. |
| Credit Enhancement Guarantee Scheme for SCs | Listed on the legacy site; no line in the Demand for Grants 2026-27 and no section in the Annual Report 2025-26. Left off until the Department confirms it is live. |
| Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS) | Subsumed into NAMASTE from 2023-24 (AR §3.11). Its components appear under the NAMASTE record. |
| Babu Jagjivan Ram Chhatrawas Yojana; Pradhan Mantri Adarsh Gram Yojana; Special Central Assistance to SCSP | Merged into PM-AJAY in 2021-22 (AR §3.7). |
| Persons with disabilities — DDRS, ADIP, SIPDA, disability scholarships, UDID | Schemes of the Department of Empowerment of Persons with Disabilities, a separate Department of the same Ministry since 2012. Outside DoSJE's mandate (AR §1.2), so not shown on any DoSJE surface. |

## 7. Where the sources disagree

- **NSFDC income ceiling** — one source says AR §3.34: annual family income up to ₹3.00 lakh; another says SJ 34: annual family income up to ₹5.00 lakh. No figure is shown on any surface for NSFDC until the Corporation confirms which is current.
- **Elderline call volume** — one source says PIB: about 27.29 lakh calls; another says not stated in AR. No usage figure is shown; the helpline number is.
- **SMILE begging coverage** — one source says AR §3.16: 181 cities across 34 States/UTs; another says AR §3.16, same paragraph, and PIB: 32 States/UTs. The city count is shown; the States count is not.
- **Scheme count** — one source says Beta site pagination: 134; another says This master: 38 records — 28 schemes and sub-schemes, 3 corporation loan products, 2 Foundation schemes, 5 helplines, grievance and portal routes. No count appears on any screen, slide or frame. The number of records is stated only in the research document with its derivation.

## 8. What has not been verified

- The links listed as "named only" in §4: `tgportal` (address not published in AR; transgender.dosje.gov.in refused the connection); `seed` (seed.dosje.gov.in did not resolve); `nskfdc` (nskfdc.nic.in refused the connection); `nmba` (nmba.dosje.gov.in certificate expired); `pmdaksh` (pmdaksh.dosje.gov.in refused the connection).
- The State-level application route for the SC scholarships: the legacy site says the State
  selects, and some States use their own portals rather than the National Scholarship Portal.
- Every row is to be confirmed by the division that owns the scheme before anything is built.

## 9. Cross-check against myScheme

myScheme (myscheme.gov.in, run by NeGD under MeitY) lists 85 schemes under "Ministry of Social
Justice and Empowerment" (captured 2026-09-09). myScheme (NeGD, MeitY) lists the whole Ministry — both Departments — and lists corporation loan products and umbrella components as separate schemes. Used as a cross-check only; nothing on a screen comes from it.

| myScheme entry | How it relates to this master |
|---|---|
| Persons With Disabilities Scheme In Colleges: Higher Education For Persons With Special Needs | DEPwD or disability — not this Department |
| Centrally Sponsored Scheme of Pre-matric Scholarship to Other Backward Classes (OBC) for Studies in India | Matches a record in the master |
| Green Business Scheme | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| The NSFDC Internship Scheme | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Venture Capital Fund for Scheduled Castes | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Dr Ambedkar Central Sector Scheme of Interest Subsidy on Educational Loans for Overseas Studies for Other Backward Classes (OBCs) and Economically Backward Classes (EBCs) | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Pre-Matric Scholarship for Scheduled Caste Students | Matches a record in the master |
| Post Matric Scholarship Students With Disabilities | DEPwD or disability — not this Department |
| Top Class Education For Scheduled Caste Students | Matches a record in the master |
| Pre Matric Scholarship For Students With Disabilities | DEPwD or disability — not this Department |
| Vanchit Ikai Samooh aur Vargon ki Aarthik Sahayata Yojana (VISVAS) for Individual | Matches a record in the master |
| NBCFDC General Loan Scheme | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Free Coaching for SCs, OBCs and beneficiaries of PM CARES Children Scheme | Matches a record in the master |
| PM-YASASVI: Top Class School Education for OBC, EBC and DNT Students | Matches a record in the master |
| PM-Special Training of Geriatric Caregivers | A component of an umbrella scheme the master carries as one record |
| Support for Marginalized Individuals for Livelihood and Enterprise (SMILE): Composite Medical Health for Transgender Persons | A component of an umbrella scheme the master carries as one record |
| Information, Monitoring, Evaluation and Social Audit (I-MESA): Project Monitoring Unit (PMU) | Monitoring and evaluation, not a citizen-facing scheme |
| AVYAY - National Action Plan for Senior Citizens: Health and Shelter for Senior Citizens | A component of an umbrella scheme the master carries as one record |
| Information-Monitoring, Evaluation, and Social Audit (I-MESA): Social Audit | Monitoring and evaluation, not a citizen-facing scheme |
| Vikaas-Day Care Scheme For Person with Disability Children | DEPwD or disability — not this Department |
| Top Class Education For Students With Disabilities | DEPwD or disability — not this Department |
| National Overseas Scholarship For Scheduled Caste Etc. Candidates | Matches a record in the master |
| National Overseas Scholarship For Students With Disabilities | DEPwD or disability — not this Department |
| Free Coaching for Students with Disabilities | DEPwD or disability — not this Department |
| Niramaya Health Insurance Scheme | DEPwD or disability — not this Department |
| Centrally Sponsored Scheme for Implementation of the Protection of Civil Rights Act, 1955 and the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989 | Matches a record in the master |
| Scheme of Assistance to State Scheduled Castes Development Corporations | Listed on myScheme; not in the Annual Report 2025-26 or the Demand for Grants — for the division to confirm |
| Ambedkar Social Innovation and Incubation Mission (ASIIM) | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Disha - Early Intervention and School Readiness Scheme | DEPwD or disability — not this Department |
| Free Coaching Scheme | Matches a record in the master |
| Pradhan Mantri Dakshta Aur Kushalta Sampann Hitgrahi (PM-DAKSH) | Matches a record in the master |
| Loan Based Schemes For Safai Karamchari - Education Loan | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Centrally Sponsored Scheme of Post-Matric Scholarship for OBC Students for studying in India | Matches a record in the master |
| Central Sector Scheme of National Fellowship for Providing Fellowship to Scheduled Caste Students to Pursue M.Phil. & PhD | Matches a record in the master |
| Education Loan Scheme | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| PM-YASASVI: Post-Matric Scholarship for OBC, EBC and DNT Students | Matches a record in the master |
| Garima Greh Shelter Homes For Transgender Persons | A component of an umbrella scheme the master carries as one record |
| Vocational Education and Training Loan Scheme | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Post-Matric Scholarship for SC students | Matches a record in the master |
| National Action Plan for Skill Development of Persons with Disabilities | DEPwD or disability — not this Department |
| Scheme For Residential Education For Students in High Schools in Targeted Areas (SHRESHTA): Mode 1 - SHRESHTA Schools (Best CBSE Private Residential Schools) | A component of an umbrella scheme the master carries as one record |
| Scheme For Residential Education For Students in High Schools in Targeted Areas (SHRESHTA): Mode 2 - NGO Operated Schools | A component of an umbrella scheme the master carries as one record |
| Scholarships for Higher Education for Young Achievers Scheme (SHREYAS) (OBC & Others) | Matches a record in the master |
| Samarth-Respite Care Scheme | DEPwD or disability — not this Department |
| Pre- Matric Scholarships Scheme for Scheduled Castes & Others | Matches a record in the master |
| New Swarnima Scheme For Women | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Pre-Matric Scholarships to the Children of Those Engaged in Occupations Involving Cleaning and Prone to Health Hazards | Matches a record in the master |
| National Fellowship for Students with Disabilities | DEPwD or disability — not this Department |
| Mahila Samriddhi Yojana | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Centrally Sponsored Scheme of Upgradation of Merit of Scheduled Caste Students | Listed on myScheme; not in the Annual Report 2025-26 or the Demand for Grants — for the division to confirm |
| Construction of Hostels for OBC Boys and Girls | Matches a record in the master |
| PM-YASASVI: Pre-Matric Scholarship for OBC, EBC and DNT Students | Matches a record in the master |
| SMILE - Comprehensive Rehabilitation For Welfare Of Transgender Persons | Matches a record in the master |
| PM-YASASVI: Top Class College Education for OBC, EBC and DNT Students | Matches a record in the master |
| Micro Credit Finance (NSFDC) | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Information, Monitoring, Evaluation and Social Audit (I-MESA): Evaluation and Studies | Monitoring and evaluation, not a citizen-facing scheme |
| Scheme for Economic Empowerment of De-notified, Nomadic and Semi-Nomadic Tribes - "Educational Empowerment" Component | A component of an umbrella scheme the master carries as one record |
| Gharaunda-Group Home for Adults Scheme | DEPwD or disability — not this Department |
| National Award for Individual Excellence | DEPwD or disability — not this Department |
| Divyangjan Kaushal Yojana | DEPwD or disability — not this Department |
| Dr. Ambedakar Centrally Sponsored Scheme of Post-Matric Scholarships for the Economically Backward Class (EBC) Students | Matches a record in the master |
| Assistance to Voluntary Organizations Working for Welfare of OBCs | Listed on myScheme; not in the Annual Report 2025-26 or the Demand for Grants — for the division to confirm |
| Self Employment Scheme For Rehabilitation Of Manual Scavengers | Matches a record in the master |
| Loan Based Schemes For Safai Karamchari - General Term Loan (GTL) | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Scheme for Supportive Money to the Parents of Transgender Children | A component of an umbrella scheme the master carries as one record |
| Rashtriya Parivar Sahayata Yojana | Listed on myScheme; not in the Annual Report 2025-26 or the Demand for Grants — for the division to confirm |
| Pradhan Mantri Adarsh Gram Yojana | A component of an umbrella scheme the master carries as one record |
| National Awards For Empowerment Of Persons With Disabilities: National Awards For Institutions Engaged In Empowering Persons With Disabilities: Divyangjano Ke Liye Sarvshrestha Placement Agency | DEPwD or disability — not this Department |
| Scheme of Assistance for the Prevention of Alcoholism & Substance (Drugs) Abuse and for Social Defence Services: General Grant-in-Aid Programme for Financial Assistance in the Field of Social Defence | Matches a record in the master |
| Credit Enhancement Guarantee Scheme For The Scheduled Castes | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Education Loan Scheme (NSFDC) | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Information, Monitoring, Evaluation and Social Audit (I-MESA): Central Smart Surveillance Unit (CSSU) | Monitoring and evaluation, not a citizen-facing scheme |
| Loan Based Schemes For Safai Karamchari - Sanitary Marts Scheme | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Scheme Of Assistance To Disabled Persons For Purchase/Fitting Of Aids/Appliances | DEPwD or disability — not this Department |
| Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) - Adarsh Gram | A component of an umbrella scheme the master carries as one record |
| National Awards For Empowerment Of Persons With Disabilities: Sugamya Bharat Abhiyan | DEPwD or disability — not this Department |
| Loan Based Schemes For Safai Karamchari - Swachhta Udyami Yojana – Swachhta Se Sampannta Ki Aur | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| Credit Based Schemes For SC - Term Loan (TL) | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
| National Awards For Empowerment Of Persons With Disabilities: Divyangjano Ke Liye Sarvshrestha Niyoktha | DEPwD or disability — not this Department |
| National Awards For Empowerment Of Persons With Disabilities (further categories) | DEPwD or disability — not this Department |
| Scheme of Grant-in-Aid to Voluntary and other Organizations Working for Scheduled Castes | Matches a record in the master |
| National Action for Mechanised Sanitation Ecosystem (NAMASTE) - "Emergency Response Sanitation Unit (ERSU) Formation and Functionalisation" | A component of an umbrella scheme the master carries as one record |
| Deen Dayal Disabled Rehabilitation Scheme | DEPwD or disability — not this Department |
| Vanchit Ikai Samooh aur Vargon ki Aarthik Sahayata Yojana (VISVAS) for Self-Help Groups | Matches a record in the master |
| Loan based Scheme for Pay and Use Community Toilets | A corporation loan or credit product — reported under NSFDC, NSKFDC, NBCFDC or the venture fund in the master |
