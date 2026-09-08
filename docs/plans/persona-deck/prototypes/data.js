/* Real MoSJE schemes, tagged on the four axes the eligibility model proposes.
   Titles are the Department's own, taken from apps/hub/src/content/website/schemes.json.
   Tagging shows the post-Stage-1 state — the whole point of the options. */
const GROUPS = [
  { id:'sc',      label:'Scheduled Caste',        sub:'As listed in the Presidential Order' },
  { id:'obc',     label:'OBC or EBC',             sub:'Other and Economically Backward Class' },
  { id:'dnt',     label:'DNT, nomadic or semi-nomadic', short:'DNT and nomadic', sub:'De-notified and nomadic communities' },
  { id:'safai',   label:'Sanitation or waste work', short:'Sanitation work', sub:'You or a parent does cleaning or sewer work' },
  { id:'senior',  label:'Senior citizen',         sub:'Aged 60 years or above' },
  { id:'tg',      label:'Transgender person',     sub:'Covered under the SMILE umbrella' },
  { id:'drug',    label:'Affected by substance use', short:'Substance use', sub:'For the person or their family' },
  { id:'student', label:'Student',                sub:'In school, college or beyond' },
  { id:'ngo',     label:'NGO or voluntary organisation', short:'Voluntary organisation', sub:'Applying for grant-in-aid' },
];

/* Asked in the finder so the Department's boundary can be named, but not shown as one
   of its personas — disability is served by DEPwD, a different department. */
const SIGNPOST = { id:'pwd', label:'Person with disability', sub:'Served by a different department' };
const STAGES = [
  { id:'school',  label:'In school' },
  { id:'college', label:'In college or beyond' },
  { id:'working', label:'Of working age' },
  { id:'senior',  label:'A senior citizen' },
];
const NEEDS = [
  { id:'edu',   label:'Education and fees' },
  { id:'work',  label:'Money to start or run work' },
  { id:'home',  label:'A home' },
  { id:'care',  label:'Health and care' },
  { id:'legal', label:'Safety and legal help' },
  { id:'skill', label:'Skills and a job' },
];
const STATES = ['Bihar','Maharashtra','Uttar Pradesh','Rajasthan','Tamil Nadu','West Bengal','Karnataka','Gujarat'];

/* benefit = what you get · runBy = who runs it · juris = Central | State | Corporation */
const SCHEMES = [
  { t:'Post-Matric Scholarship for SC Students', g:['sc','student'], s:['college'], n:['edu'],
    benefit:'Scholarship', runBy:'MoSJE', juris:'Central',
    need:'Caste certificate, family income under ₹2.5 lakh a year, and proof of college admission.', apply:'National Scholarship Portal' },
  { t:'Pre-Matric Scholarship for SC Students (Class IX and X)', g:['sc','student'], s:['school'], n:['edu'],
    benefit:'Scholarship', runBy:'MoSJE', juris:'Central',
    need:'Headmaster certification, academic records, and proof of residence.', apply:'National Scholarship Portal' },
  { t:'Central Sector Scholarship of Top Class Education for SC Students', g:['sc','student'], s:['college'], n:['edu'],
    benefit:'Full tuition', runBy:'MoSJE', juris:'Central',
    need:'Admission to a listed premier institution, and an income certificate.', apply:'National Scholarship Portal' },
  { t:'National Fellowship for Scheduled Caste Students', g:['sc','student'], s:['college'], n:['edu'],
    benefit:'Monthly stipend', runBy:'UGC for MoSJE', juris:'Central',
    need:'Registration in an M.Phil or Ph.D programme.', apply:'UGC portal' },
  { t:'SHRESHTA — Residential Education for SC Students', g:['sc','student'], s:['school'], n:['edu'],
    benefit:'Residential schooling', runBy:'MoSJE', juris:'Central',
    need:'Class VIII pass, and family income under ₹2.5 lakh a year.', apply:'SHRESHTA portal' },
  { t:'Credit Enhancement Guarantee Scheme for the Scheduled Castes', g:['sc'], s:['working'], n:['work'],
    benefit:'Credit guarantee', runBy:'IFCI for MoSJE', juris:'Central',
    need:'A registered SC-owned enterprise and a lending bank.', apply:'IFCI' },
  { t:'Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)', g:['sc'], s:['working'], n:['home','work'],
    benefit:'Village and livelihood grant', runBy:'State government', juris:'Central',
    need:'Applied through the village or district administration.', apply:'Where to apply near you' },
  { t:'NSFDC Term Loan', g:['sc'], s:['working'], n:['work'],
    benefit:'Concessional loan', runBy:'NSFDC', juris:'Corporation',
    need:'Caste certificate and a State Channelising Agency in your State.', apply:'Where to apply near you' },
  { t:'PM Young Achievers Scholarship Award Scheme (PM-YASASVI)', g:['obc','student'], s:['school','college'], n:['edu'],
    benefit:'Scholarship', runBy:'MoSJE', juris:'Central',
    need:'Class IX or XI, and family income under ₹2.5 lakh a year.', apply:'National Scholarship Portal' },
  { t:'National Fellowship for OBC Students (NF-OBC)', g:['obc','student'], s:['college'], n:['edu'],
    benefit:'Monthly stipend', runBy:'UGC for MoSJE', juris:'Central',
    need:'Registration in an M.Phil or Ph.D programme.', apply:'UGC portal' },
  { t:'Construction of Hostels for OBC Boys and Girls', g:['obc','student'], s:['school','college'], n:['edu','home'],
    benefit:'Hostel place', runBy:'State government', juris:'Central',
    need:'Applied through the institution.', apply:'Where to apply near you' },
  { t:'Scheme for Economic Empowerment of DNTs (SEED)', g:['dnt'], s:['working','college'], n:['edu','work','care','home'],
    benefit:'Coaching, insurance, housing', runBy:'DWBDNC', juris:'Central',
    need:'DNT, VJNT or NT-SNT certificate.', apply:'SEED portal' },
  { t:'DNT Employment Scheme', g:['dnt'], s:['working'], n:['skill','work'],
    benefit:'Livelihood support', runBy:'DWBDNC', juris:'Central',
    need:'Community certificate and a bank account.', apply:'DWBDNC' },
  { t:'National Action for Mechanised Sanitation Ecosystem (NAMASTE)', g:['safai'], s:['working'], n:['skill','work','care'],
    benefit:'Safety equipment and capital subsidy', runBy:'NSKFDC', juris:'Central',
    need:'Profiling as a sewer or septic-tank worker.', apply:'NAMASTE portal' },
  { t:'Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS)', g:['safai'], s:['working'], n:['work','skill'],
    benefit:'Capital subsidy and training', runBy:'NSKFDC', juris:'Central',
    need:'Identification as a manual scavenger or dependant.', apply:'NSKFDC' },
  { t:'Swachhta Udyami Yojana', g:['safai'], s:['working'], n:['work'],
    benefit:'Concessional loan', runBy:'NSKFDC', juris:'Corporation',
    need:'A sanitation-related business proposal.', apply:'Where to apply near you' },
  { t:'Pre-matric Scholarship for Children of Those in Unclean Occupations', g:['safai','sc','student'], s:['school'], n:['edu'],
    benefit:'Scholarship', runBy:'MoSJE', juris:'Central',
    need:'Parent’s occupation certificate.', apply:'National Scholarship Portal' },
  { t:'Atal Vayo Abhyuday Yojana (AVYAY)', g:['senior'], s:['senior'], n:['care','home'],
    benefit:'Care, shelter and support', runBy:'MoSJE with States', juris:'Central',
    need:'Aged 60 or above.', apply:'Where to apply near you' },
  { t:'Rashtriya Vayoshri Yojana (RVY)', g:['senior'], s:['senior'], n:['care'],
    benefit:'Assistive aids, free', runBy:'ALIMCO', juris:'Central',
    need:'Aged 60 or above, BPL or low income.', apply:'ALIMCO camp' },
  { t:'Integrated Programme for Senior Citizens (IPSrC)', g:['senior'], s:['senior'], n:['care','home'],
    benefit:'Shelter, food, medical care', runBy:'Voluntary organisations', juris:'Central',
    need:'Aged 60 or above.', apply:'Where to apply near you' },
  { t:'Elderline — 14567', g:['senior'], s:['senior'], n:['care','legal'],
    benefit:'Helpline', runBy:'MoSJE', juris:'Central',
    need:'Nothing. Call 14567, toll free.', apply:'Call 14567' },
  { t:'Support for Marginalised Individuals for Livelihood and Enterprise (SMILE)', g:['tg'], s:['working'], n:['skill','care','home'],
    benefit:'Identity, shelter and skilling', runBy:'MoSJE', juris:'Central',
    need:'Application for a Transgender Identity Certificate.', apply:'National Portal for Transgender Persons' },
  { t:'National Action Plan for Drug Demand Reduction (NAPDDR)', g:['drug'], s:['working','college'], n:['care'],
    benefit:'De-addiction and counselling', runBy:'MoSJE', juris:'Central',
    need:'Nothing. Walk in, or call 14446.', apply:'Nearest centre' },
  { t:'Grant-in-Aid to Voluntary Organisations (e-Anudaan)', g:['ngo'], s:['working'], n:['work'],
    benefit:'Grant-in-aid', runBy:'MoSJE', juris:'Central',
    need:'Registration, audited accounts and Darpan ID.', apply:'e-Anudaan' },
  { t:'Centrally Sponsored Scheme under the PoA Act, 1989', g:['sc'], s:['working','college','school'], n:['legal'],
    benefit:'Relief and legal aid', runBy:'State government', juris:'Central',
    need:'A registered case under the Act.', apply:'District administration' },
  { t:'Mahila Samridhi Yojana (MSY)', g:['sc','obc'], s:['working'], n:['work'],
    benefit:'Micro-credit for women', runBy:'NSFDC / NBCFDC', juris:'Corporation',
    need:'Woman applicant, through a State Channelising Agency.', apply:'Where to apply near you' },
];

const GROUP_LABEL = Object.fromEntries(GROUPS.map(g => [g.id, g.label]));

/* The live site's Target Group filter, counted on dosje.gov.in on 8 September 2026.
   Kept here so the prototype can show today's state honestly where it needs to. */
const LIVE_FILTER = {
  total: 134,
  values: { 'Students':50, 'Sanitation Workers':16, 'DNT':14, 'Senior Citizens':9, 'OBC':6,
            'Scheduled Castes':5, 'Business':4, 'Small business':4, 'BPL':1, 'Homeowners':1, 'Medium business':1 },
  untagged: 23,
};

function matchSchemes({ group, stage, need, state }) {
  return SCHEMES.filter(s => {
    if (group && !s.g.includes(group)) return false;
    if (stage && !s.s.includes(stage)) return false;
    if (need  && !s.n.includes(need))  return false;
    return true;
  });
}
