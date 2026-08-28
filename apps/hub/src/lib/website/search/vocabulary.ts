/**
 * Citizen words for administrative things.
 *
 * This is the single highest-value part of the search and the easiest to skip.
 * The catalogue calls something "Pre-matric scholarship to the children of those
 * engaged in occupations involving cleaning and prone to health hazards". A
 * parent looking for it types "school money", "scholarship for my son", or
 * "छात्रवृत्ति". A search that only matches the official title finds nothing, and
 * the reader concludes the Department does not do that thing — which is worse
 * than having no search at all.
 *
 * WHY RULES AND NOT A PER-SCHEME LIST. There are 141 schemes, 1,624 documents and
 * 175 organisation pages in the ingested catalogue, and hand-writing keywords for
 * each would be stale within one ingest. Instead each rule declares a CONCEPT —
 * the words that mean it in the catalogue, and the words a citizen uses for it —
 * and an entry inherits every concept its title or description matches. A newly
 * ingested scholarship gets scholarship words on the day it lands, with nobody
 * editing anything.
 *
 * WHERE THESE CAME FROM. The concept axes (`education`, `money`, `home`,
 * `health`, `safety`, `skills`) and the audiences are the ones the chatbot's
 * scheme finder already reasons in (`lib/chatbot/finder.ts`), so the two features
 * name the same things the same way. The Hindi is written in both Devanagari and
 * Roman transliteration because a citizen on a shared device very often cannot
 * type Devanagari and writes "chhatravritti".
 *
 * PHASE 1 OF MULTI-LANGUAGE, deliberately. `[DBIM 9.iii]` wants search in the
 * user's own language. The tempting shortcut is to machine-translate the query
 * through the Bhashini runtime and search the English index, which loses exactly
 * the proper nouns that make a search work ("Ambedkar", "NSFDC", "NAMASTE").
 * Indexing Hindi synonyms here gets most of the value at almost no cost. Building
 * a real per-language index waits for page content to be translated at build
 * time. See `docs/integrations/bhashini.md`.
 */

export interface VocabularyRule {
  /** What this concept is called here, for debugging and for the gate's report. */
  concept: string;
  /**
   * Lower-cased substrings. If a title or description contains ANY of these, the
   * entry inherits `citizen`. Substrings, not words, so "scholarship" also
   * catches "scholarships".
   */
  match: string[];
  /** The words a citizen actually types. Added verbatim to `keywords`. */
  citizen: string;
}

export const VOCABULARY: VocabularyRule[] = [
  {
    concept: "scholarship",
    match: ["scholarship", "pre-matric", "prematric", "post-matric", "postmatric", "stipend", "merit award", "fellowship"],
    citizen:
      "scholarship scolarship scholership school money study money fees help fee waiver student money money for studies my son my daughter छात्रवृत्ति chhatravritti chatravriti शिक्षा shiksha पढ़ाई padhai स्कूल school फीस fees",
  },
  {
    concept: "loan",
    match: ["loan", "credit", "microfinance", "micro finance", "micro credit", "term loan", "interest subsidy", "guarantee scheme"],
    citizen:
      "loan lone business loan money to start business capital finance borrow interest emi ऋण rin कर्ज karz लोन loan उधार udhaar व्यवसाय vyavsay",
  },
  {
    concept: "hostel",
    match: ["hostel", "ashram shala", "ashram school", "residential"],
    citizen:
      "hostel place to stay accommodation boarding stay while studying छात्रावास chhatravas हॉस्टल hostel रहने ka intezaam",
  },
  {
    concept: "housing",
    match: ["housing", "house", "basti development", "shelter", "home for"],
    citizen:
      "house home housing pakka house roof shelter rent आवास awas घर ghar मकान makan किराया kiraya",
  },
  {
    concept: "coaching",
    match: ["coaching", "free coaching", "centre of excellence", "civil service", "competitive exam"],
    citizen:
      "coaching free coaching exam preparation upsc ias competitive exam tuition classes कोचिंग coaching तैयारी taiyari परीक्षा pariksha",
  },
  {
    concept: "skills-jobs",
    match: ["skill development", "skill", "training", "employment", "swarozgar", "self-employment", "self employment", "entrepreneur", "vocational"],
    citizen:
      "job jobs work employment training skill course learn a trade start a business self employment naukri रोजगार rozgar स्वरोजगार swarozgar नौकरी naukri कौशल kaushal प्रशिक्षण prashikshan",
  },
  {
    concept: "senior-citizens",
    match: ["senior citizen", "old age", "elderly", "avyay", "vayo", "geriatric", "elderline", "ipsrc", "pension"],
    citizen:
      "old age elderly senior citizen my parents my mother my father pension old age home care for elderly वरिष्ठ नागरिक varishth nagrik बुजुर्ग buzurg बुढ़ापा budhapa पेंशन pension वृद्धाश्रम vridhashram",
  },
  {
    concept: "women",
    match: ["mahila", "women", "girls", "girl child", "widow"],
    citizen:
      "women woman girl girls ladies widow female महिला mahila लड़की ladki बेटी beti विधवा vidhwa स्त्री stri",
  },
  {
    concept: "drugs",
    match: ["drug", "de-addiction", "deaddiction", "substance abuse", "nasha", "nmba", "addiction"],
    citizen:
      "drugs addiction de addiction rehab rehabilitation nasha mukti alcohol my son is addicted help with addiction नशा nasha नशामुक्ति nashamukti शराब sharab इलाज ilaj पुनर्वास punarvas",
  },
  {
    concept: "sanitation-workers",
    match: ["safai", "karamchari", "sanitation", "manual scavenging", "namaste", "unclean occupation", "cleaning and prone", "nskfdc"],
    citizen:
      "safai karamchari sanitation worker sweeper manual scavenger cleaning work sewer septic tank सफाई कर्मचारी safai karamchari मैला ढोने manual scavenging",
  },
  {
    concept: "marriage",
    match: ["inter-caste marriage", "inter caste marriage", "marriage", "vivah"],
    citizen:
      "marriage inter caste marriage wedding incentive for marriage विवाह vivah शादी shaadi अंतरजातीय antarjatiya",
  },
  {
    concept: "atrocity-legal",
    match: ["atrocit", "protection of civil rights", "legal aid", "prevention of atrocities", "relief to the"],
    citizen:
      "atrocity caste discrimination legal aid lawyer case police complaint relief compensation victim अत्याचार atyachar कानूनी सहायता kanooni sahayata मुआवजा muavza शिकायत shikayat",
  },
  {
    concept: "health",
    match: ["medical aid", "health", "treatment", "hospital", "medical"],
    citizen:
      "medical treatment hospital illness surgery medicine health स्वास्थ्य swasthya इलाज ilaj अस्पताल aspatal दवा dawa",
  },
  {
    concept: "ngo-grants",
    match: ["voluntary organisation", "grant-in-aid", "grant in aid", "ngo", "grants to"],
    citizen:
      "ngo grant funding for ngo voluntary organisation society trust apply for grant अनुदान anudaan संस्था sanstha स्वयंसेवी swayamsevi",
  },
  {
    concept: "transgender",
    match: ["transgender", "garima greh", "smile"],
    citizen:
      "transgender trans third gender kinnar garima greh ट्रांसजेंडर transgender किन्नर kinnar",
  },
  {
    concept: "begging-destitute",
    match: ["begging", "beggar", "destitute", "shelter home", "smile"],
    citizen:
      "begging beggar homeless destitute street shelter भीख bheekh भिक्षावृत्ति bhikshavritti बेघर beghar",
  },
  {
    concept: "dnt",
    match: ["denotified", "de-notified", "nomadic", "dnt", "vimukt", "vjnt", "gadia lohar", "seed"],
    citizen:
      "denotified tribe nomadic semi nomadic dnt nt vimukta jati विमुक्त जाति vimukta jati घुमंतू ghumantu",
  },
  {
    concept: "sc",
    match: ["scheduled caste", "sc student", " scs", "(scs)", "nsfdc"],
    citizen:
      "sc scheduled caste dalit harijan अनुसूचित जाति anusuchit jati दलित dalit",
  },
  {
    concept: "obc",
    match: ["backward class", "obc", "ebc", "nbcfdc"],
    citizen:
      "obc other backward class backward class ebc अन्य पिछड़ा वर्ग anya pichhda varg पिछड़ा pichhda",
  },
  {
    concept: "documents-forms",
    match: ["form", "application", "annexure", "proforma", "template"],
    citizen:
      "form application form download form apply how to apply फॉर्म form आवेदन aavedan प्रपत्र prapatra",
  },
  {
    concept: "rules-policy",
    match: ["act", "rule", "guideline", "circular", "notification", "policy", "order"],
    citizen:
      "rules act law policy guidelines circular order government order notification कानून kanoon नियम niyam अधिनियम adhiniyam परिपत्र paripatra आदेश aadesh",
  },
  {
    concept: "tender",
    match: ["tender", "bid", "quotation", "eoi", "expression of interest"],
    citizen: "tender bid contract procurement quotation निविदा nivida टेंडर tender ठेका theka",
  },
  {
    concept: "vacancy",
    match: ["vacancy", "recruitment", "appointment", "deputation", "post of"],
    citizen:
      "job vacancy recruitment government job apply for job hiring career भर्ती bharti नौकरी naukri रिक्ति rikti रोजगार rozgar",
  },
  {
    concept: "contact",
    match: ["directory", "who's who", "contact", "telephone", "officials", "office"],
    citizen:
      "contact phone number telephone email address who to contact officer directory संपर्क sampark फोन phone पता pata अधिकारी adhikari",
  },
  {
    concept: "rti",
    match: ["right to information", "rti", "suo moto", "disclosure", "public information"],
    citizen:
      "rti right to information file rti public information officer pio appeal सूचना का अधिकार suchna ka adhikar आरटीआई rti",
  },
  {
    concept: "report",
    match: ["annual report", "report", "publication", "statistics", "evaluation study"],
    citizen:
      "annual report report statistics data publication study रिपोर्ट report वार्षिक varshik आंकड़े aankde",
  },
];

/**
 * Every citizen phrase this vocabulary knows, for the "did you mean" fallback and
 * for the popular-search chips. Derived, so a new rule shows up in both without
 * a second edit.
 */
export const CITIZEN_TERMS: string[] = Array.from(
  new Set(VOCABULARY.flatMap((rule) => rule.citizen.split(/\s+/)).filter((w) => w.length > 3)),
);

/**
 * The citizen words that apply to a piece of text.
 *
 * Matching is on the catalogue's own language (`match`), never on the citizen
 * words — otherwise a rule that mentions "money" would pull in every rule that
 * says "money", and every entry would end up tagged with everything.
 */
export function citizenKeywordsFor(...text: (string | undefined)[]): string {
  const haystack = text.filter(Boolean).join(" ").toLowerCase();
  const hits = VOCABULARY.filter((rule) => rule.match.some((m) => haystack.includes(m)));
  return hits.map((rule) => rule.citizen).join(" ");
}
