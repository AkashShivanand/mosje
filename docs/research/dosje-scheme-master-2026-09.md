# The Department's schemes, mapped to the people it serves and to what it provides

> **Generated** from `dosje-scheme-master-2026-09.json` by `tools/service-discovery/build-data.mjs`
> on 2026-09-09. Edit the JSON, not this file.

## 1. Why this exists

The service-discovery options reviewed on 8 September 2026 carried a figure of 134
schemes, taken from the beta site's own Schemes list. The review found that list untrustworthy:
it counts guideline documents, status tables, State schemes and a list of offences as
schemes of the Department. This master starts again from the Department's own published
record and nothing else.

## 2. Sources

| Key | Document |
|---|---|
| **AR** | Department of Social Justice and Empowerment, *Annual Report 2025-26*, Chapter 3 "Schemes & Organizations" and §1.2 "Mandate and Mission" — socialjustice.gov.in/writereaddata/UploadFile/71441776233188.pdf |
| **SBE** | *Notes on Demands for Grants 2026-27*, Demand No. 93, Department of Social Justice and Empowerment — indiabudget.gov.in/doc/eb/sbe93.pdf |
| **PIB** | *Year-End Review 2025: Overview of Schemes and Key Achievements of the Department of Social Justice and Empowerment*, PIB release 2209488, 29 December 2025 |
| **SJ** | socialjustice.gov.in/schemes/\<n\> — the Department's legacy site, scheme pages |
| **DOSJE** | dosje.gov.in organisation pages — used only to confirm portal names |

**What was not used.** `apps/hub/src/content/website/schemes.json`, the scrape of the beta site's
Schemes list, and the beta site's pagination count.

## 3. The people the Department serves — the left-hand side

The Department's mandate (AR §1.2) names twelve groups: Scheduled Castes (SCs); Other Backward Classes (OBCs); Senior Citizens; Victims of Alcoholism and Substance Abuse; Transgender Persons; Persons engaged in Beggary; De-notified, Nomadic and Semi-Nomadic Tribes (DNTs); Manual Scavengers; Sewer & Septic Tank workers; Waste Pickers; Economically Backward Classes (EBCs); Economically Weaker Sections (EWS).

The finder presents them as 11 personas. Three are not in the mandate's list and
each says why it is here:

| Persona | On the screen | Why it is a persona |
|---|---|---|
| **Students** | From Class I to Ph.D. and study abroad, from the groups the Department serves | cross-cutting — every scholarship names a community and a stage; a student looks for the stage first. Listed after the mandate groups, with the other two personas the schemes rather than the mandate name. Source: the scholarship records in AR ch.3 (§3.2–3.5, §3.19–3.22, §3.27) each name students of the groups the Department serves. |
| **Scheduled Castes** | As notified under Article 341 of the Constitution | Scheduled Castes (SCs) |
| **Other Backward Classes** | Including Economically Backward Classes | Other Backward Classes (OBCs); Economically Backward Classes (EBCs) |
| **De-notified, Nomadic and Semi-Nomadic Tribes** | Communities listed as DNT, NT or SNT | De-notified, Nomadic and Semi-Nomadic Tribes (DNTs) |
| **Safai Karamcharis** | Manual scavengers, sewer and septic tank workers, waste pickers, and their dependants | Manual Scavengers; Sewer & Septic Tank workers; Waste Pickers |
| **Senior Citizens** | Aged 60 years or above | Senior Citizens |
| **Transgender Persons** | As defined in the Transgender Persons (Protection of Rights) Act, 2019 | Transgender Persons |
| **Persons Affected by Substance Use** | The person, and their family | Victims of Alcoholism and Substance Abuse |
| **Persons Engaged in Begging** | Rescue, shelter and rehabilitation | Persons engaged in Beggary |
| **Victims of Atrocities** | Under the PCR Act, 1955 and the SC/ST (PoA) Act, 1989 | served through the PCR-PoA scheme (AR §3.9) and the National Helpline Against Atrocities |
| **Voluntary Organisations** | NGOs, CBOs and institutions applying for grant-in-aid | delivery partners under AVYAY, NAPDDR, SHRESHTA, SMILE and PM-AJAY (AR §3.39) |

**Persons with disabilities** are not in the mandate and no DoSJE surface names them. Their
schemes are the Department of Empowerment of Persons with Disabilities', a separate Department
of the same Ministry since 2012 (see §7).

**Left off.** *Economically Weaker Sections* are named in the mandate but no scheme in
Chapter 3 or the Demand for Grants serves EWS as such, so there is nothing to show. *Women
and girls* are a reservation inside schemes — 30% of Top Class slots, 50% of the overseas
interest subsidy, the NSKFDC women's loan schemes — not a target group of any scheme, so the
finder does not ask about gender.

## 4. What the Department provides — the right-hand side

| Offering | What it covers |
|---|---|
| **Scholarships and Fellowships** | Pre-matric to Ph.D., and study abroad |
| **Residential Schools, Hostels and Coaching** | Top-class schools, hostels and free coaching for competitive examinations |
| **Loans and Credit** | Concessional loans, interest subvention and venture capital through the Department's corporations |
| **Skill Training and Livelihood** | Free training with stipend, self-employment support, village development |
| **Care, Shelter and Health** | Old-age homes, shelter homes, assistive devices and health cover |
| **De-addiction and Counselling** | Treatment centres, the 14446 helpline and Nasha Mukt Bharat Abhiyaan |
| **Protection, Relief and Grievance** | Relief to atrocity victims, the 14566 helpline, and the Commissions' grievance portals |
| **Grants to Voluntary Organisations** | Grant-in-aid through the e-Anudaan portal |

## 5. The mapping — persona × offering, counted in records

| | Scholarships and Fellowships | Schools, Hostels and Coaching | Loans and Credit | Skill Training and Livelihood | Care, Shelter and Health | De-addiction and Counselling | Protection, Relief and Grievance | Grants to Voluntary Organisations |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Students | 13 | 5 | 1 | 1 | 1 | · | · | · |
| Scheduled Castes | 6 | 2 | 3 | 2 | 1 | · | 3 | · |
| Other Backward Classes | 6 | 3 | 4 | 1 | · | · | · | · |
| De-notified, Nomadic and Semi-Nomadic Tribes | 5 | 2 | · | 2 | 1 | · | · | · |
| Safai Karamcharis | 1 | · | 3 | 2 | 1 | · | 1 | · |
| Senior Citizens | · | · | · | 1 | 3 | · | 1 | · |
| Transgender Persons | · | · | · | 1 | 1 | · | 1 | · |
| Persons Affected by Substance Use | · | · | · | · | · | 1 | · | · |
| Persons Engaged in Begging | · | · | · | 1 | 1 | · | · | · |
| Victims of Atrocities | · | · | · | · | · | · | 2 | · |
| Voluntary Organisations | · | · | · | · | · | · | · | 5 |

A cell is the number of records below that name the persona AND provide the offering. A dot
means none. **No cell in this table is shown on any screen** — the counts exist so the design
team can see the empty cells, and the screens show the schemes themselves.

## 6. The schemes — 38 records

| Scheme | Type | Names | Provides | What it provides | Whom it names | Where to apply | Sources |
|---|---|---|---|---|---|---|---|
| Post Matric Scholarship for Scheduled Castes<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | Scheduled Castes, Students | Scholarships and Fellowships | Compulsory non-refundable fees, including tuition, and an academic allowance for the whole course after Class X. | SC students studying at the post-matric stage; parent or guardian income up to ₹2.5 lakh a year. | the State's scholarship portal; National Scholarship Portal | AR §3.1, SBE 26, PIB, SJ 25 |
| Pre-Matric Scholarship for Scheduled Castes and Others<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | Scheduled Castes, Safai Karamcharis, Students | Scholarships and Fellowships | An academic allowance of ₹3,500 a year for day scholars and ₹7,000 or ₹8,000 for hostellers. | SC students in Class IX and X with family income up to ₹2.5 lakh; and children in Class I to X of manual scavengers, tanners and flayers, waste pickers and hazardous-cleaning workers, with no income limit. | the State's scholarship portal; National Scholarship Portal | AR §3.2, SBE 27, PIB |
| National Fellowship for Scheduled Caste Students<br><small>SHREYAS for SCs</small> | Central Sector | Scheduled Castes, Students | Scholarships and Fellowships | A Ph.D. fellowship with contingency and house rent allowance; 2,000 new fellowships a year. | SC students who have qualified UGC NET-JRF or UGC-CSIR NET-JRF, for Ph.D. at a UGC-recognised institution. | the UGC | AR §3.3, SBE 8.01, PIB |
| National Overseas Scholarship for SCs and Others<br><small>SHREYAS for SCs</small> | Central Sector | Scheduled Castes, DNT, Nomadic and Semi-Nomadic Tribes, Students | Scholarships and Fellowships | Tuition, maintenance and contingency allowances, visa, insurance and air passage for a Master's or Ph.D. abroad; 125 slots a year, 30% for women. | Students from Scheduled Castes, DNT, NT and SNT communities, landless agricultural labourers and traditional artisans; family income up to ₹8 lakh; age up to 35; admission to a top-500 QS-ranked university. | the NOS portal | AR §3.4, SBE 8.04, PIB, SJ 28 |
| Top Class Education for Scheduled Caste Students<br><small>SHREYAS for SCs</small> | Central Sector | Scheduled Castes, Students | Scholarships and Fellowships | Full tuition and non-refundable charges, plus an academic allowance of ₹86,000 in the first year and ₹41,000 in each later year, at 274 notified institutions. | SC students with family income up to ₹8 lakh admitted to a notified institution; 30% of slots for SC girl students. | National Scholarship Portal | AR §3.5, SBE 8.03, PIB |
| Free Coaching for SCs, OBCs and PM CARES Children<br><small>SHREYAS for SCs</small> | Central Sector | Scheduled Castes, Other Backward Classes, Students | Schools, Hostels and Coaching | Course fee up to ₹75,000 and a stipend of ₹4,000 a month for up to 12 months of coaching for competitive and entrance examinations. | SC and OBC students with family income up to ₹8 lakh, and beneficiaries of the PM CARES for Children scheme with no income or caste condition. | National Scholarship Portal | AR §3.6, SBE 8.02, PIB |
| SHRESHTA — Residential Education for Students in High Schools in Targeted Areas | Central Sector | Scheduled Castes, Students, Voluntary Organisations | Schools, Hostels and Coaching, Grants to Voluntary Organisations | Mode I: full tuition and hostel fees at a top private residential school from Class 9 or 11 to Class 12. Mode II: grant-in-aid to NGO-run residential schools and hostels for SC students. | Meritorious SC students selected through the National Entrance Test for SHRESHTA; and voluntary organisations running schools and hostels for SC students. | the SHRESHTA entrance test (NTA); the e-Anudaan portal | AR §3.10, SBE 9, PIB |
| Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | Scheduled Castes | Skill Training and Livelihood | Development of SC-dominated villages as Adarsh Gram; grants-in-aid for district and State livelihood and infrastructure projects; hostels in higher-education institutions. | Scheduled Caste communities, through the State Government and District administration; 100% centrally funded. | the PM-AJAY portal | AR §3.7, SBE 28, PIB, SJ 104 |
| Implementation of the PCR Act, 1955 and the SC/ST (PoA) Act, 1989<br><small>Umbrella Scheme for Development of Scheduled Castes</small> | Centrally Sponsored | Victims of Atrocities, Scheduled Castes | Protection, Relief and Grievance | Relief and rehabilitation of atrocity victims and their dependants; an incentive for inter-caste marriages where one spouse is a Scheduled Caste; SC/ST Protection Cells, special police stations and exclusive special courts. | Victims of atrocities under the two Acts, and their dependants, through the State Government. | Helpline 14566; the District administration | AR §3.9, SBE 29, PIB |
| National Helpline Against Atrocities — 14566 | Helpline | Victims of Atrocities, Scheduled Castes | Protection, Relief and Grievance | A toll-free, round-the-clock helpline in Hindi, English and regional languages that registers complaints under the PoA Act and follows them to an FIR. | Anyone reporting an atrocity against a member of a Scheduled Caste or Scheduled Tribe. | Helpline 14566 | PIB 1780979, DOSJE NHAA |
| NCSC e-Grievance Management Portal | Grievance | Scheduled Castes | Protection, Relief and Grievance | Lodging and tracking of a complaint about deprivation of the rights and safeguards of Scheduled Castes, with SMS and e-mail updates at each stage. | Any member of a Scheduled Caste with a grievance about a safeguard. | the NCSC grievance portal | AR §3.27, PIB |
| National Action for Mechanised Sanitation Ecosystem (NAMASTE) | Central Sector | Safai Karamcharis | Care, Shelter and Health, Skill Training and Livelihood, Loans and Credit | Profiling and a NAMASTE card; PPE kits and safety training; health cover under Ayushman Bharat PM-JAY; capital subsidy for sanitation vehicles and equipment under Swachhta Udyami Yojana; skill training with stipend for manual scavengers and dependants. | Sewer and septic tank workers, waste pickers, and manual scavengers and their dependants. | the urban local body (NAMASTE); NSKFDC | AR §3.11, SBE 17, PIB, SJ 37 |
| NSKFDC Concessional Loans | Corporation | Safai Karamcharis | Loans and Credit | Concessional loans for income-generating activities and education, with priority to women through Mahila Samridhi Yojana and Mahila Adhikarita Yojana. | Safai Karamcharis including waste pickers, manual scavengers, and their dependants. | NSKFDC | AR §3.35, PIB |
| National Commission for Safai Karamcharis | Grievance | Safai Karamcharis | Protection, Relief and Grievance | Investigation of grievances of Safai Karamcharis, and pursuit of compensation in sewer and septic tank death and disability cases. | Safai Karamcharis and the families of sewer and septic tank workers. | the NCSK | AR §3.28, PIB |
| NSFDC Concessional Loans | Corporation | Scheduled Castes | Loans and Credit | Micro finance up to ₹1.40 lakh, term loans up to ₹50 lakh and education loans up to ₹40 lakh at concessional interest, through State Channelising Agencies and banks. | Scheduled Caste families within the Corporation's income ceiling. | NSFDC | AR §3.34, PIB, SJ 34 |
| NBCFDC Concessional Loans | Corporation | Other Backward Classes | Loans and Credit | Individual loans up to ₹25 lakh, group loans up to ₹25 lakh per self-help group, and education loans up to ₹25 lakh at concessional interest. | Members of Backward Classes with annual family income up to ₹3 lakh. | NBCFDC | AR §3.36, PIB |
| VISVAS Yojana — Interest Subvention | Central Sector | Scheduled Castes, Other Backward Classes, Safai Karamcharis | Loans and Credit | A 5% interest subvention, paid by direct benefit transfer, on income-generating loans up to ₹5 lakh for individuals and ₹10 lakh for self-help groups. | SC and OBC borrowers with family income up to ₹3 lakh, and Safai Karamcharis with no income limit, holding standard loan accounts. | the lending bank | AR §3.25, SBE 10, PIB |
| Venture Capital Fund for SCs and for Backward Classes, with ASIIM | Central Sector | Scheduled Castes, Other Backward Classes | Loans and Credit | Concessional finance from ₹10 lakh to ₹15 crore for SC enterprises and ₹20 lakh to ₹15 crore for Backward Class enterprises; equity up to ₹30 lakh for SC youth start-ups under ASIIM. | SC and Backward Class entrepreneurs and start-ups. | IFCI Venture | AR §3.12, SBE 12, PIB |
| PM-DAKSH — Skill Training | Central Sector | Scheduled Castes, Other Backward Classes, DNT, Nomadic and Semi-Nomadic Tribes, Safai Karamcharis | Skill Training and Livelihood | Free skill training, from up-skilling to long-term courses, with a stipend or boarding and lodging, and placement support. | Persons aged 18 to 45 from Scheduled Castes, DNTs and sanitation work with no income limit; OBCs with family income up to ₹3 lakh; EBCs up to ₹1 lakh. | the PM-DAKSH portal | AR §3.13, SBE 11, PIB<br>**Note.** SBE 11 records that the scheme is merged with PM Kaushal Vikas Yojana from 2026-27. The record stands for 2025-26 and must be reviewed before the surface launches. |
| Integrated Programme for Senior Citizens<br><small>Atal Vayo Abhyuday Yojana</small> | Centrally Sponsored | Senior Citizens, Voluntary Organisations | Care, Shelter and Health, Grants to Voluntary Organisations | Grant-in-aid to organisations running senior citizen homes, continuous care homes and day-care centres that give free shelter, food, medical care and recreation. | Indigent senior citizens; and organisations working in old-age care for at least two years. | the e-Anudaan portal | AR §3.14 A, SBE 31, PIB |
| Rashtriya Vayoshri Yojana<br><small>Atal Vayo Abhyuday Yojana</small> | Central Sector | Senior Citizens | Care, Shelter and Health | Free physical aids and assistive devices for age-related disability or infirmity, distributed through ALIMCO camps. | Senior citizens aged 60 or above, holding Aadhaar, who are BPL or have a monthly income of not more than ₹15,000. | an ALIMCO camp | AR §3.14 C, SBE 18, PIB |
| Elderline — National Helpline for Senior Citizens, 14567<br><small>Atal Vayo Abhyuday Yojana</small> | Helpline | Senior Citizens | Care, Shelter and Health, Protection, Relief and Grievance | Free information, guidance, emotional support and field intervention in cases of abuse and rescue, in every State and UT. | All senior citizens. | Elderline 14567 | AR §3.14 D, PIB |
| Training of Geriatric Caregivers<br><small>Atal Vayo Abhyuday Yojana</small> | Central Sector | Senior Citizens | Skill Training and Livelihood | Certified training in geriatric care at medical and nursing colleges and NISD-affiliated institutes, to create a pool of professional caregivers. | Persons aged 18 or above with the qualification the job role requires. | a NISD-affiliated institute | AR §3.14 F, PIB |
| National Action Plan for Drug Demand Reduction and Nasha Mukt Bharat Abhiyaan<br><small>Umbrella Programme for Development of Other Vulnerable Groups</small> | Centrally Sponsored | Affected by Substance Use, Voluntary Organisations | De-addiction and Counselling, Grants to Voluntary Organisations | Integrated Rehabilitation Centres for Addicts, Outreach and Drop-In Centres, District De-Addiction Centres and Addiction Treatment Facilities in government hospitals; the toll-free de-addiction helpline 14446; grant-in-aid to the voluntary organisations that run the centres. | Persons dependent on alcohol or drugs and their families; and NGOs running de-addiction and outreach centres. | Helpline 14446, or the nearest centre; the e-Anudaan portal | AR §3.15, SBE 32, PIB |
| SMILE — Comprehensive Rehabilitation of Persons Engaged in Begging<br><small>SMILE</small> | Central Sector | Engaged in Begging | Care, Shelter and Health, Skill Training and Livelihood | Survey and identification, outreach and rescue, shelter homes with food, clothing, counselling and medical aid, and rehabilitation through education, skilling and self-employment; in 181 cities. | Persons engaged in begging, and their children. | the shelter home (urban local body) | AR §3.16, SBE 15.01, PIB, SJ 99 |
| SMILE — Comprehensive Rehabilitation for Welfare of Transgender Persons<br><small>SMILE</small> | Central Sector | Transgender Persons, Voluntary Organisations | Care, Shelter and Health, Skill Training and Livelihood, Protection, Relief and Grievance, Grants to Voluntary Organisations | A certificate of identity through the National Portal for Transgender Persons; Garima Greh shelter homes; health cover under Ayushman Bharat PM-JAY; skill development and entrepreneurship training; Transgender Protection Cells in the States. | Transgender persons holding a certificate of identity issued through the National Portal; and CBOs and NGOs able to run a shelter home. | the National Portal for Transgender Persons; the e-Anudaan portal | AR §3.17, SBE 15.02, PIB, SJ 99 |
| PM-YASASVI Pre-Matric Scholarship for OBC, EBC and DNT Students<br><small>PM-YASASVI</small> | Centrally Sponsored | Other Backward Classes, DNT, Nomadic and Semi-Nomadic Tribes, Students | Scholarships and Fellowships | A consolidated academic allowance of ₹4,000 a year, paid by direct benefit transfer. | OBC, EBC and DNT students in Class IX and X in Government schools, with family income up to ₹2.5 lakh. | the State's scholarship portal; National Scholarship Portal | AR §3.18, SBE 30.02, PIB, SJ 101 |
| PM-YASASVI Post-Matric Scholarship for OBC, EBC and DNT Students<br><small>PM-YASASVI</small> | Centrally Sponsored | Other Backward Classes, DNT, Nomadic and Semi-Nomadic Tribes, Students | Scholarships and Fellowships | An academic allowance of ₹5,000 to ₹20,000 a year by category of course, for study after Class X. | OBC, EBC and DNT students at the post-matric stage, with family income up to ₹2.5 lakh. | the State's scholarship portal; National Scholarship Portal | AR §3.19, SBE 30.01, PIB, SJ 101 |
| PM-YASASVI Top Class School Education for OBC, EBC and DNT Students<br><small>PM-YASASVI</small> | Centrally Sponsored | Other Backward Classes, DNT, Nomadic and Semi-Nomadic Tribes, Students | Scholarships and Fellowships, Schools, Hostels and Coaching | Tuition, hostel and other school charges up to ₹75,000 a year in Class 9 and 10 and ₹1,25,000 a year in Class 11 and 12, at shortlisted top schools; 30% of scholarships for girls. | OBC, EBC and DNT students admitted to a shortlisted school, with household income under ₹2.5 lakh; selected on the National Scholarship Portal merit list. | National Scholarship Portal | AR §3.20, SBE 30.05, PIB |
| PM-YASASVI Top Class College Education for OBC, EBC and DNT Students<br><small>PM-YASASVI</small> | Centrally Sponsored | Other Backward Classes, DNT, Nomadic and Semi-Nomadic Tribes, Students | Scholarships and Fellowships | Full tuition and non-refundable charges, living expenses of ₹3,000 a month, ₹5,000 a year for books, and a one-time laptop allowance of ₹45,000, at IIMs, IITs, AIIMS, NITs, NLUs and other notified institutions. | OBC, EBC and DNT students with family income up to ₹2.5 lakh admitted to a notified institution; 30% of slots for girl students. | National Scholarship Portal | AR §3.21, SBE 30.04, PIB |
| Construction of Hostels for OBC Boys and Girls<br><small>PM-YASASVI</small> | Centrally Sponsored | Other Backward Classes, Students | Schools, Hostels and Coaching | Central assistance to States, UTs and NIRF-ranked institutions to build hostels for OBC students near Government schools, colleges and universities. | OBC students from rural areas, through the institution or State that builds the hostel. | the school or college | AR §3.22, SBE 30.03, PIB |
| National Fellowship for OBC Students<br><small>SHREYAS for OBCs and EBCs</small> | Central Sector | Other Backward Classes, Students | Scholarships and Fellowships | A Junior and Senior Research Fellowship at UGC rates for M.Phil. and Ph.D.; 1,000 fellowships a year, 750 in humanities and social sciences and 250 in science. | OBC students who have qualified UGC NET-JRF or UGC-CSIR NET-JRF. | NBCFDC | AR §3.23, SBE 13.01, PIB |
| Dr. Ambedkar Interest Subsidy on Education Loans for Overseas Studies for OBCs and EBCs<br><small>SHREYAS for OBCs and EBCs</small> | Central Sector | Other Backward Classes, Students | Scholarships and Fellowships, Loans and Credit | The full interest for the moratorium period on an education loan of up to ₹20 lakh for a Master's, M.Phil. or Ph.D. abroad; half of the assistance reserved for women. | OBC candidates within the creamy-layer limit and EBC candidates with family income up to ₹5 lakh, admitted to an approved course abroad. | Canara Bank | AR §3.24, SBE 13.02 |
| Scheme for Economic Empowerment of DNTs (SEED) | Central Sector | DNT, Nomadic and Semi-Nomadic Tribes, Students | Schools, Hostels and Coaching, Care, Shelter and Health, Skill Training and Livelihood | Free coaching for competitive examinations; health insurance through Ayushman Bharat; livelihood support through self-help groups; and financial assistance for housing through PM Awas Yojana. | Members of De-notified, Nomadic and Semi-Nomadic communities holding a DNT certificate. | the SEED portal | AR §3.30, SBE 14, PIB, SJ 109 |
| Special Scholarship under PM CARES for Children | Central Sector | Students | Scholarships and Fellowships | ₹20,000 a year for a child in Class 1 to 12: a monthly allowance of ₹1,000 and an academic allowance of ₹8,000 for fees, books, uniform and equipment. | Children who lost both parents, or their legal guardian or surviving parent, to COVID-19, identified by the District Magistrate under the PM CARES for Children scheme. | the District Magistrate (WCD) | AR §3.26, SBE 25 |
| Dr. Ambedkar Medical Aid Scheme<br><small>Dr. Ambedkar Foundation</small> | Foundation | Scheduled Castes | Care, Shelter and Health | Medical treatment for serious ailments requiring surgery of the kidney, heart, liver, brain, cancer or other life-threatening disease. | SC and ST patients with annual family income under ₹3 lakh. | Dr. Ambedkar Foundation | AR §3.31, PIB |
| Dr. Ambedkar National Merit Awards for Class 10 and Class 12<br><small>Dr. Ambedkar Foundation</small> | Foundation | Scheduled Castes, Students | Scholarships and Fellowships | Cash awards of ₹40,000 to ₹60,000 for the top three SC and ST students of each recognised Board in Class 10, with a separate award for the highest-scoring girl; awards for SC students in Class 12 in four streams. | SC and ST students who scored at least 50% in a recognised Board's secondary examination; SC students in the senior secondary examination. | Dr. Ambedkar Foundation | AR §3.31, PIB |
| e-Anudaan — Grant-in-Aid to Voluntary Organisations | Portal | Voluntary Organisations | Grants to Voluntary Organisations | Online application, processing and sanction of grant-in-aid for five Department schemes, with NGO Darpan verification and PFMS payment. | Voluntary organisations registered on NGO Darpan applying under AVYAY, NAPDDR, SHRESHTA Mode II, SMILE and the Department's other grant schemes. | the e-Anudaan portal | AR §3.39 |

## 7. What the beta site lists that this master does not

| Listed on the beta site | Why it is not here |
|---|---|
| List of 46 offences under the SC and ST PoA Act, 1989 | A reference list, not a scheme. Shown as a scheme on the beta site and questioned on the 8 September call. |
| Guidelines of NAMASTE; Revised Guidelines of NAMASTE; Revised guidelines for Waste Pickers under NAMASTE | Guideline documents of one scheme, listed three times as schemes. |
| Status of Loan Application…; Status of SRMS as on 30 April 2018; Financial & Physical Achievements of NSKFDC upto 2018; Data of Central Assistance released… | Status tables and achievement reports, not schemes. |
| Ashram Shalas; CM Housing Rent Scheme; Gadia Lohar Scheme; Post SSC Scholarship for Boys/Girls; Savitribai Phule Scholarship for VJNT/SBC; Vimukt Jati Hostel Scheme; Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship; Mukhyamantri Vimukt Ghumantu… Swarozgar Yojana; and the other VJNT/SBC entries | State Government schemes, mostly Maharashtra's and Rajasthan's, catalogued without their State. None appears in the Department's Annual Report or Demand for Grants. |
| Credit Enhancement Guarantee Scheme for SCs | Listed on the legacy site; no line in the Demand for Grants 2026-27 and no section in the Annual Report 2025-26. Left off until the Department confirms it is live. |
| Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS) | Subsumed into NAMASTE from 2023-24 (AR §3.11). Its components appear under the NAMASTE record. |
| Babu Jagjivan Ram Chhatrawas Yojana; Pradhan Mantri Adarsh Gram Yojana; Special Central Assistance to SCSP | Merged into PM-AJAY in 2021-22 (AR §3.7). |
| Persons with disabilities — DDRS, ADIP, SIPDA, disability scholarships, UDID | Schemes of the Department of Empowerment of Persons with Disabilities, a separate Department of the same Ministry since 2012. Outside DoSJE's mandate (AR §1.2), so not shown on any DoSJE surface. |

## 8. Where the sources disagree

| Field | One source says | Another says | What the surfaces do |
|---|---|---|---|
| NSFDC income ceiling | AR §3.34: annual family income up to ₹3.00 lakh | SJ 34: annual family income up to ₹5.00 lakh | No figure is shown on any surface for NSFDC until the Corporation confirms which is current. |
| Elderline call volume | PIB: about 27.29 lakh calls | not stated in AR | No usage figure is shown; the helpline number is. |
| SMILE begging coverage | AR §3.16: 181 cities across 34 States/UTs | AR §3.16, same paragraph, and PIB: 32 States/UTs | The city count is shown; the States count is not. |
| Scheme count | Beta site pagination: 134 | This master: 38 records — 28 schemes and sub-schemes, 3 corporation loan products, 2 Foundation schemes, 5 helplines, grievance and portal routes | No count appears on any screen, slide or frame. The number of records is stated only in the research document with its derivation. |

## 9. Open questions for the Department

- Whether the Department wants **Students** as a persona in its own right, or folded back into
  each community. The 8 September review asked for it on the persona screen.
- Whether **Victims of Atrocities** and **Persons Engaged in Begging** are to be named on a
  public home page, and in which words. Both are in the Department's own mandate.
- Confirmation from NSFDC of its **income ceiling** (see §8).
- Whether **PM-DAKSH** should be shown at all after its merger into PM-KVY from 2026-27.
- The application route for **Post-Matric and Pre-Matric SC** scholarships in each State — the
  legacy site says the State selects, and some States use their own portals rather than NSP.
