/* ds-exempt-start(hindi-source): translation strings are DATA; rendered Hindi is marked with lang by the provider */
/**
 * PROTOTYPE HINDI — the home page and its menus, bundled so the language
 * switch visibly works on a deployment with no Bhashini credentials.
 *
 * Standing instruction, 22 Sep 2026: "It's the prototype website, so CCPS
 * subscription and Bhashini key won't be used here — just mock the features."
 * This table is that mock. It is kept apart from `fallback.ts` on purpose:
 * that file is the permanent chrome glossary and says it must stay small;
 * this one is scaffolding for the prototype, and on a deployment with
 * Bhashini configured the API answers first for anything not protected.
 *
 * Organisation and scheme names are their established Hindi titles as the
 * Department publishes them, not renderings. The rest are plain, formal
 * Hindi in the register of a Government of India page; before the site goes
 * live they are replaced by Bhashini's output reviewed by the Official
 * Language Division.
 */
export const PROTOTYPE_HI: Readonly<Record<string, string>> = {
  // Navigation and menus
  About: "परिचय",
  "About the Department": "विभाग के बारे में",
  "Who’s Who": "कौन क्या है",
  Divisions: "प्रभाग",
  "Citizen’s Charter": "नागरिक चार्टर",
  "Official Language": "राजभाषा",
  Directory: "निर्देशिका",
  Schemes: "योजनाएँ",
  "Find a Scheme": "योजना खोजें",
  "For Students": "विद्यार्थियों के लिए",
  "For Beneficiaries": "लाभार्थियों के लिए",
  "For Researchers": "शोधकर्ताओं के लिए",
  "For Government Officials": "सरकारी अधिकारियों के लिए",
  "Apply and Track Online": "ऑनलाइन आवेदन करें और स्थिति देखें",
  Dashboard: "डैशबोर्ड",
  Organisations: "संगठन",
  Commissions: "आयोग",
  "Finance and Development Corporations": "वित्त एवं विकास निगम",
  "Foundations and Autonomous Bodies": "प्रतिष्ठान एवं स्वायत्त निकाय",
  "Scheme Portals": "योजना पोर्टल",
  "Reports and Publications": "रिपोर्ट एवं प्रकाशन",
  "Annual Reports": "वार्षिक रिपोर्ट",
  Publications: "प्रकाशन",
  Newsletter: "समाचार पत्रिका",
  "Research and Evaluation Studies": "शोध एवं मूल्यांकन अध्ययन",
  "Acts, Rules and Policies": "अधिनियम, नियम एवं नीतियाँ",
  "Acts and Rules": "अधिनियम एवं नियम",
  Policies: "नीतियाँ",
  "Circulars and Notifications": "परिपत्र एवं अधिसूचनाएँ",
  Notices: "सूचनाएँ",
  "Forms and Resources": "प्रपत्र एवं संसाधन",
  "Forms and Templates": "प्रपत्र एवं प्रारूप",
  Resources: "संसाधन",
  MoU: "समझौता ज्ञापन",
  Advices: "परामर्श",
  "Right to Information": "सूचना का अधिकार",
  RTI: "सूचना का अधिकार",
  "Suo Motu Disclosure": "स्वतः प्रकटीकरण",
  "Parliament Questions": "संसदीय प्रश्न",
  Miscellaneous: "विविध",
  "Tenders & Vacancies": "निविदाएँ एवं रिक्तियाँ",
  Tenders: "निविदाएँ",
  Vacancies: "रिक्तियाँ",
  "Grants to Voluntary Organisations": "स्वैच्छिक संगठनों को अनुदान",
  Media: "मीडिया",
  "Latest Updates": "नवीनतम जानकारी",
  Events: "कार्यक्रम",
  "Photo Gallery": "फ़ोटो गैलरी",
  Contact: "संपर्क",
  "Contact Us": "संपर्क करें",
  "Public Information Officers": "लोक सूचना अधिकारी",
  Feedback: "प्रतिक्रिया",
  Help: "सहायता",

  // Organisations — their Hindi titles
  "National Commission for Scheduled Castes": "राष्ट्रीय अनुसूचित जाति आयोग",
  "National Commission for Safai Karamcharis": "राष्ट्रीय सफाई कर्मचारी आयोग",
  "National Commission for Backward Classes": "राष्ट्रीय पिछड़ा वर्ग आयोग",
  "National Scheduled Castes Finance and Development Corporation": "राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम",
  "National Safai Karamcharis Finance and Development Corporation": "राष्ट्रीय सफाई कर्मचारी वित्त एवं विकास निगम",
  "National Backward Classes Finance and Development Corporation": "राष्ट्रीय पिछड़ा वर्ग वित्त एवं विकास निगम",
  "Dr. Ambedkar Foundation": "डॉ. अम्बेडकर प्रतिष्ठान",
  "Dr. Ambedkar International Centre": "डॉ. अम्बेडकर अंतरराष्ट्रीय केंद्र",
  "Babu Jagjivan Ram National Foundation": "बाबू जगजीवन राम राष्ट्रीय प्रतिष्ठान",
  "Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities":
    "विमुक्त, घुमंतू एवं अर्ध-घुमंतू समुदायों के लिए विकास एवं कल्याण बोर्ड",
  "National Institute of Social Defence": "राष्ट्रीय सामाजिक रक्षा संस्थान",
  "Senior Citizens Welfare": "वरिष्ठ नागरिक कल्याण",
  "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana": "प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना",
  "National Portal for Transgender Persons": "ट्रांसजेंडर व्यक्तियों के लिए राष्ट्रीय पोर्टल",
  "National Overseas Scholarship": "राष्ट्रीय प्रवासी छात्रवृत्ति",
  "Nasha Mukt Bharat Abhiyaan": "नशा मुक्त भारत अभियान",
  "National Helpline Against Atrocities": "अत्याचार के विरुद्ध राष्ट्रीय हेल्पलाइन",

  // Language dialog
  "Translation is provided by Bhashini, the Government of India's national language platform.":
    "अनुवाद भाषिणी द्वारा उपलब्ध कराया जाता है, जो भारत सरकार का राष्ट्रीय भाषा मंच है।",
  Current: "वर्तमान",
  "Live site": "मुख्य साइट",

  // Home page
  // About — the Department's mandate, and the Ministers (names as the Ministry writes them in Hindi)
  "The Department of Social Justice & Empowerment (DoSJE) is mandated to ensure the empowerment and welfare of India’s most vulnerable groups, including Scheduled Castes, OBCs, Senior Citizens, Transgender Persons, and victims of substance abuse. It implements various targeted schemes for their social, educational, and economic development.":
    "सामाजिक न्याय और अधिकारिता विभाग (DoSJE) का दायित्व भारत के सबसे वंचित वर्गों — अनुसूचित जातियों, अन्य पिछड़ा वर्गों, वरिष्ठ नागरिकों, ट्रांसजेंडर व्यक्तियों और नशे से पीड़ित व्यक्तियों — का सशक्तिकरण और कल्याण सुनिश्चित करना है। विभाग उनके सामाजिक, शैक्षिक और आर्थिक विकास के लिए विभिन्न लक्षित योजनाएँ लागू करता है।",
  "Dr. Virendra Kumar": "डॉ. वीरेन्द्र कुमार",
  "Shri Ramdas Athawale": "श्री रामदास आठवले",
  "Shri B. L. Verma": "श्री बी. एल. वर्मा",
  "Union Minister of Social Justice and Empowerment": "केंद्रीय सामाजिक न्याय और अधिकारिता मंत्री",
  "Minister of State for Social Justice and Empowerment": "सामाजिक न्याय और अधिकारिता राज्य मंत्री",
  "Search schemes and services": "योजनाएँ और सेवाएँ खोजें",
  "Find Schemes, Services and Support": "योजनाएँ, सेवाएँ और सहायता खोजें",
  "For Scheduled Castes, Other Backward Classes, senior citizens, transgender persons and every group the Department serves.":
    "अनुसूचित जातियों, अन्य पिछड़ा वर्गों, वरिष्ठ नागरिकों, ट्रांसजेंडर व्यक्तियों और उन सभी समूहों के लिए जिनकी सेवा विभाग करता है।",
  "Search schemes, services and documents": "योजनाएँ, सेवाएँ और दस्तावेज़ खोजें",
  "File a Grievance": "शिकायत दर्ज करें",
  "Call a Helpline": "हेल्पलाइन पर कॉल करें",
  "Tenders and Vacancies": "निविदाएँ एवं रिक्तियाँ",
  "Divisions of the Department": "विभाग के प्रभाग",
  "Scheduled Caste Welfare": "अनुसूचित जाति कल्याण",
  "Welfare of the Other Backward Classes": "अन्य पिछड़ा वर्ग कल्याण",
  "Social Defence": "सामाजिक रक्षा",
  "Drug Division": "नशा निवारण प्रभाग",
  "Grants-in-Aid to NGOs": "गैर-सरकारी संगठनों को सहायता अनुदान",
  "Statistics Division": "सांख्यिकी प्रभाग",
  "Plan Division": "योजना प्रभाग",
  "View Dashboard": "डैशबोर्ड देखें",
  "Schemes and Services": "योजनाएँ एवं सेवाएँ",
  "Major schemes of the Department and where to apply for them.": "विभाग की प्रमुख योजनाएँ और उनके लिए आवेदन कहाँ करें।",
  "View All Schemes": "सभी योजनाएँ देखें",
  "Browse by Kind of Support": "सहायता के प्रकार के अनुसार देखें",
  "Scholarships and Fellowships": "छात्रवृत्ति एवं अध्येतावृत्ति",
  "Residential Schools, Hostels and Coaching": "आवासीय विद्यालय, छात्रावास एवं कोचिंग",
  "Loans and Credit": "ऋण एवं वित्त",
  "Skill Training and Livelihood": "कौशल प्रशिक्षण एवं आजीविका",
  "Care, Health and Shelter": "देखभाल, स्वास्थ्य एवं आश्रय",
  "De-addiction and Counselling": "नशा मुक्ति एवं परामर्श",
  "Protection, Relief and Grievance": "संरक्षण, राहत एवं शिकायत निवारण",
  "Housing and Settlement": "आवास एवं पुनर्वास",
  "Awards and Recognition": "पुरस्कार एवं सम्मान",
  "What’s New": "नया क्या है",
  "Updates, circulars, notices and results from the Department.": "विभाग की नवीनतम जानकारी, परिपत्र, सूचनाएँ और परिणाम।",
  "View All Updates": "सभी जानकारी देखें",
  "View All Tenders": "सभी निविदाएँ देखें",
  "View All Vacancies": "सभी रिक्तियाँ देखें",
  "Organisations & Scheme Portals": "संगठन एवं योजना पोर्टल",
  "The commissions, corporations and bodies that work with the Department, and the portals of its national schemes.":
    "विभाग के साथ कार्य करने वाले आयोग, निगम और निकाय, तथा उसकी राष्ट्रीय योजनाओं के पोर्टल।",
  "The national campaign for a drug-free India. Take the pledge, volunteer as a Nasha Mukti Mitr, or find a de-addiction centre near you.":
    "नशा मुक्त भारत के लिए राष्ट्रीय अभियान। प्रतिज्ञा लें, नशा मुक्ति मित्र के रूप में स्वयंसेवा करें, या अपने निकट नशा मुक्ति केंद्र खोजें।",
  "Take the Pledge": "प्रतिज्ञा लें",
  "Find a De-addiction Centre": "नशा मुक्ति केंद्र खोजें",
  "Recent Documents": "हाल के दस्तावेज़",
  "The documents the Department has most recently published.": "विभाग द्वारा हाल ही में प्रकाशित दस्तावेज़।",
  "Find Schemes for You": "अपने लिए योजनाएँ खोजें",
  "Choose the group you belong to, and see the schemes of the Department for it.":
    "अपना समूह चुनें और उसके लिए विभाग की योजनाएँ देखें।",
  Students: "विद्यार्थी",
  "Scheduled Castes": "अनुसूचित जातियाँ",
  "Other Backward Classes": "अन्य पिछड़ा वर्ग",
  "De-notified, Nomadic and Semi-Nomadic Tribes": "विमुक्त, घुमंतू एवं अर्ध-घुमंतू जनजातियाँ",
  "Safai Karamcharis": "सफाई कर्मचारी",
  "Senior Citizens": "वरिष्ठ नागरिक",
  "Transgender Persons": "ट्रांसजेंडर व्यक्ति",
  "Persons Affected by Substance Use": "नशे से प्रभावित व्यक्ति",
  "Persons Engaged in Begging": "भिक्षावृत्ति में लगे व्यक्ति",
  "Victims of Atrocities": "अत्याचार पीड़ित",
  "Voluntary Organisations": "स्वैच्छिक संगठन",
  "Information by Role": "भूमिका के अनुसार जानकारी",
  "Events and Media": "कार्यक्रम एवं मीडिया",
  "Recent events, press coverage and photographs of the Department and its organisations.":
    "विभाग और उसके संगठनों के हाल के कार्यक्रम, समाचार और तस्वीरें।",
  "View All Events": "सभी कार्यक्रम देखें",
  "Press and Photographs": "समाचार एवं तस्वीरें",
  "View Gallery": "गैलरी देखें",
  "Follow the Department": "विभाग से जुड़ें",
  "Official accounts of the Department of Social Justice & Empowerment.": "सामाजिक न्याय और अधिकारिता विभाग के आधिकारिक खाते।",
  "Official channel": "आधिकारिक चैनल",
  "National Helplines": "राष्ट्रीय हेल्पलाइन",
  "Toll-free from any phone in India.": "भारत में किसी भी फ़ोन से निःशुल्क।",
  "Drug de-addiction counselling and referral": "नशा मुक्ति परामर्श एवं रेफ़रल",
  Elderline: "एल्डरलाइन",
  "National helpline for senior citizens": "वरिष्ठ नागरिकों के लिए राष्ट्रीय हेल्पलाइन",
  "For Scheduled Castes and Scheduled Tribes": "अनुसूचित जातियों और अनुसूचित जनजातियों के लिए",
  "Need Support?": "सहायता चाहिए?",
  "Write to the Department, or lodge a grievance on CPGRAMS.": "विभाग को लिखें, या CPGRAMS पर शिकायत दर्ज करें।",
  Call: "कॉल करें",
};
/* ds-exempt-end */
