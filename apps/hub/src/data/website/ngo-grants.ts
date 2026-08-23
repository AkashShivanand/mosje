/**
 * Grants-in-Aid to NGOs — the enforcement and screening records.
 *
 * The Important Links rail names eleven pages under this division; the estate built five.
 * These are the records behind three of the six that were missing, transcribed from the
 * Department's published tables rather than invented, because an NGO checking whether it
 * is on the suspended list needs the real register.
 *
 * `action` is the Department's own wording, kept verbatim — it carries the order number,
 * the date and, in a handful of cases, the fact that a DIFFERENT ministry took the action
 * (Rashtriya Mahila Kosh, or the Ministry of Law and Justice). Discarding it to fit a tidy
 * enum would lose the citation an affected organisation needs.
 *
 * `status` is the normalised state derived from it, and exists so the table can be filtered
 * and badged. It is a reading of `action`, never a replacement for it. Where the two
 * disagree, `action` is authoritative.
 */

export interface GrantDocument {
  title: string;
  /** Publication date as the Department prints it, e.g. "26 Jan 2024". */
  date: string;
  fileSize: string;
  fileUrl?: string;
}

/** What the Ministry did. Derived from `action`; see the note above. */
export type NgoEnforcementStatus =
  | "blacklisted"
  | "grant-stopped"
  | "recovery-sought"
  | "other";

export interface NgoEnforcementRecord {
  name: string;
  /** The Department's verbatim wording, including any order number. */
  action: string;
  status: NgoEnforcementStatus;
}

export const SCREENING_COMMITTEE_MINUTES: GrantDocument[] = [
  {
    title: "Minutes of the Meeting of the Screening Committee held on 21st July 2016 to consider new project proposals under the Scheme for Prevention of Alcoholism and Substance (Drugs) Abuse",
    date: "29 Mar 2017",
    fileSize: "5.59 MB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Minutes-SC-Meeting-21072016.pdf",
  },
  {
    title: "Minutes of the Meeting of the Screening Committee held on 11th November 2016 to consider new project proposals under the Scheme for Prevention of Alcoholism and Substance (Drugs) Abuse",
    date: "29 Mar 2017",
    fileSize: "456.31 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/SC-MOM-11112016636263985846240869.pdf",
  },
  {
    title: "Minutes of the Meeting of the Screening Committee held on 3rd March 2017 to consider new project proposals under the Scheme for Prevention of Alcoholism and Substance (Drugs) Abuse",
    date: "29 Mar 2017",
    fileSize: "4.14 MB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Minutes-of-SC-Meeting-03032017.pdf",
  },
  {
    title: "Minutes of the Meeting of the Screening Committee held on 23rd October, 2018 to consider new project proposals under the Scheme for Prevention of Alcoholism and Substance (Drugs) Abuse",
    date: "18 Dec 2018",
    fileSize: "586.61 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Minutes-23-October-2018.pdf",
  },
];

export const DE_BLACKLISTED_NGO_ORDERS: GrantDocument[] = [
  {
    title: "Samaj Sewa Sansthan, Dr B R Ambedkar Hostel Siddharth Nagar barabanki – De-Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India (order no.11020(18)/2/2011-SCD-III)",
    date: "26 Jan 2024",
    fileSize: "31.11 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/de-blacklist-SSS.pdf",
  },
  {
    title: "Vivek Education Society, Halasur Village Sathnur Hobli Ramanagar Dist. Karnatka – De-Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India (order no.11020(10)/3/2013-SCD-III)",
    date: "26 Jan 2024",
    fileSize: "18.88 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/corri_deblacklist_ngo_30818.pdf",
  },
  {
    title: "Manohar Bal Mandir Samiti, 108, Setia Colony, SGNR, Gali No. 4, Sri Ganga Nagar, Rajasthan - 335001 – De-Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India (order no.11020/237/2010-SCD-III)",
    date: "26 Jan 2024",
    fileSize: "86.47 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/manohar_deblacklist_ngo-301018.pdf",
  },
  {
    title: "Prasasvi Sansthan, 38, Royal Society, Bajrang Nagar Kota, Rajsthan-324005 – De-Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India (order no.1102(16)/1/2013-SCD-III)",
    date: "26 Jan 2024",
    fileSize: "30.15 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/deblack17122018.pdf",
  },
  {
    title: "Nirashit Mahila Bal Vikas gramodyog Shiksha Samiti, Pai bagh, Bharatpur Rajasthan-321001 – De-Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India (order no.11020(16)/17/2013-SCD-III)",
    date: "26 Jan 2024",
    fileSize: "1.03 MB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/Nirashrit_Mahila_Bal_Vikas_Gramadyog.pdf",
  },
];

export const BLACKLISTING_ORDERS: GrantDocument[] = [
  {
    title: "Blacklisting of Chaubisee Vikas Sangh for project at Old society wali main gali, Rohtak",
    date: "19 Jul 2024",
    fileSize: "149.21 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/85491721367247.pdf",
  },
  {
    title: "Blacklisting of Chaubisee Vikas Sangh for project at Meham, Rohtak, Haryana",
    date: "19 Jul 2024",
    fileSize: "142.00 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/34191721367327.pdf",
  },
  {
    title: "Blacklisting of Haryana Nav Yuvak Kala Sangham Rohtak",
    date: "19 Jul 2024",
    fileSize: "137.96 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/63281721367463.pdf",
  },
  {
    title: "Blacklisting of Shri Mahila Bal Kalyan and Apang Punarvasan Vikas Mandal Dhule",
    date: "7 Jun 2024",
    fileSize: "804.26 KB",
    fileUrl: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/11821717743592.pdf",
  },
];

export const NGO_ENFORCEMENT_REGISTER: NgoEnforcementRecord[] = [
  {
    name: "Association of Moral Guide and Service to Poor [AMGALAS], At/P.O.Distt.Nayagarh, Orissa",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Asha Bal Mandir Shiksha Samiti, Plot No.1, B.Krishnapuri, Jaipur-1",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Social Welfare Society, 2-A, Main Road, Tittagudi, Tamil Nadu",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Bhartiya Samajothan Sewa Sansthan, Nehru Nagar, Chakiyawa, Deoria, Uttar Pradesh",
    action: "Blacklisted on 27.08.2002 {No.36-19(4)/2001-DD-II}",
    status: "blacklisted",
  },
  {
    name: "Shaheed Abdul Hameed Education Institute, Dherwha, Khatipura, Ward No.60, Dist.Yuvatmal, Maharashtra",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Shradha, Pakyong, East Sikkim",
    action: "The state Government asked to recover grants and sieze the assets created out of Government Funds",
    status: "recovery-sought",
  },
  {
    name: "Akhil Bharatiya Samaj Kalyan Prathisthan, Sewa Puri, Deoria, U.P",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Anjuman Madrasa Islamia, Urai Jalaun, U.P",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "National Institute of Social Welfare, 5/13/43B, Behind Gurudwara, Khawaspura, Faizabad, U.P.",
    action: "Blacklisted (DP-I) Drugs",
    status: "blacklisted",
  },
  {
    name: "Sarvodaya Gram Avam Mahila Vikas Sansthan, M.Rampur, U.P",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Ambedkar Shiksha Prasarak Samiti, Nilchlaul, Maharajganj, U.P.",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Abhinav Sewa Sansthan, Dwarika Ganj, Sultanpur, U.P",
    action: "Blacklisted 04.05.2000-(DP-I)",
    status: "blacklisted",
  },
  {
    name: "U.P.Rana Beni Madhav Jan Kalyan Samiti, Rai Bareily, U.P",
    action: "Based on the DMs report that the Secretary of the organization has forged his signature, all grants have been discontinued. State government was asked to enquire into the matter and submit a factual report.",
    status: "grant-stopped",
  },
  {
    name: "Jan Sewa Sansthan, Vill. + P.O.: Kaundhiyara, Distt.: Allahabad, Uttar Pradesh",
    action: "Blacklisted(DD-II) dated 23.08.2001",
    status: "blacklisted",
  },
  {
    name: "Gramin Vikas Sangathan, Gaya, Bihar (under Scheme for Spl.School for MR Children & Scheme for Rehabilitation Centre for Mentally Retarded",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Nandini Bal Vikas and Gramin Gramodhyog Sewa Samiti, Vill.Parbati, P.O-Harwanshpur, Distt.Gonda, U.P",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Orissa Association of the Deaf, Plot No.105/A, Palashpalli, Aerodrome Area, Bhubaneshwar, Pin-751009.",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Suparna Women Welfare AssociationH.N. 1-3-290, Vijaynagar Layout MPCL, Karnataka",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Bhanu Education Society, No.2, Ist Main 11th Cross 80 feet Road, Kangery Satellite Town, Karnataka",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Sri Durga Education Society, D.No.17-105, Sundaraiyet street, Chittoor - District, Andhra Pradesh",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Saheed Abdul Hameed Education Institute, Cherwha, Khatipura, Ward No.60, Distt.: Yuvatmal, Maharashta",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Rashtriya Samaj Kalyan Sansthan, B-405, Gopal Tower, 50 Ram Tirath Marg, Lucknow, UP",
    action: "Blacklisted (01.06.2000-DD-II)",
    status: "blacklisted",
  },
  {
    name: "Jan Kalyan Avam Nari Uthan Samiti, 104, Sahebganj, Faizabad - District, UP",
    action: "Blacklisted (02.11.2000-DP-I) from DRUGs Abuse",
    status: "blacklisted",
  },
  {
    name: "Propkari Sansthan, LS-2/648, Sector-F, Janakipuram, Lucknow, UP",
    action: "Blacklisted (16.08.2000-SD) Street Children Project",
    status: "blacklisted",
  },
  {
    name: "Hyderabad Karnataka Dalit Women's Education Society Sedam Madina Complex, J.K. Road,District ,Gulbarga, Karnataka-585102.",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Manav Shiksha Prasar Samiti, 280/69, Tilak Nagar, Baghambari Road, Allahabad, UP",
    action: "Blacklisted (11.08.2000-SD) Street Children Project",
    status: "blacklisted",
  },
  {
    name: "Chetna Public School Shikshan Samiti, B-22, Sanjay Colony Nehru Nagar, Jaipur",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Social Welfare Charitable Trust, 638-A, Barkat Nagar Tonk Phatak, Jaipur, Rajasthan",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Apanga Mahila Mandal Amravati, Kamala Jadhav, Maharashtra",
    action: "Blacklisted (09-05-2001) ADIP Scheme",
    status: "blacklisted",
  },
  {
    name: "Savitribai Jyotirao Phule Samaj Sewa Sansthan Tarhala, Tarhala, Taluk Magroolpir, Distt. Akola, Maharashtra.",
    action: "Blacklisted (09-05-2001) ADIP Scheme",
    status: "blacklisted",
  },
  {
    name: "Rajiv Gandhi Memorial Pre-examination Coaching Centre, Near Ram Mandir, Bidar-585041",
    action: "Blacklisted (MC)",
    status: "blacklisted",
  },
  {
    name: "Independent Pre-examination Coaching Centre, 1, Muniyappa Layout, New Police Station Road, K.R. Puram, Bangalore",
    action: "Blacklisted (MC)",
    status: "blacklisted",
  },
  {
    name: "Asha Bhavan, Boa Vista, , Bastora, Goa - 403507.",
    action: "Blacklisted (DP-III)",
    status: "blacklisted",
  },
  {
    name: "Social Service Society for Poor People, 1/2909, Tharaka Ramapuram, Dharamavaram - 515671",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Learning in the Field of Training (LIFT), Flat No.302, Rocky Apartments Venkatreddy Colony, Secunderbad, AP",
    action: "Blacklisted (31.07.2000-SD) Street Children Project",
    status: "blacklisted",
  },
  {
    name: "Jambuvant Maharaj Shikshan Sanstha, Banjara Colony, Khokadpura, Aurangabad, Maharashtra",
    action: "Blacklisted (DD-II) 11th September 2001",
    status: "blacklisted",
  },
  {
    name: "Mercy Minority Educational Society, 13-2-668, Ist Cross, Ramchandra Nagar, Anantpur, AP",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Adarsh Mahila Mandali, MIG-II 50, APHB Colony, Anantpur-District, Andhra Pradesh-515001.",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Cultural Action in Rural Development, Pamidi, Anantpur-Distt., AP",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Sangameshwara Educational Society, D.No.11-292-A2-02, 4th Cross, Aravind Nagar, Anantpur-Distt., AP",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Bal Vikas Avam Mahila Kalyan Parishad, Distt. Gonda, UP",
    action: "Blacklisted ( 05.09.2000-DD-II)",
    status: "blacklisted",
  },
  {
    name: "Bhagini Niketan, 10/Tulsi Marg, Baug Colony, Near Core House Ambawadi, Ahmedabad, Gujarat",
    action: "Blacklisted (Street Children)",
    status: "blacklisted",
  },
  {
    name: "Yuvajana Vikalangula Samkeshma, Sangam Kummara, Palam Road, Vinukonda, Guntur, Andhra Pradesh-522647",
    action: "Blacklisted (20.04.2001-Street Children)",
    status: "blacklisted",
  },
  {
    name: "Awadh Sansthan, Ramghat, Ayodhaya, Faizabad, Uttar Pradesh",
    action: "Blacklisted (20.04.2001-Street Children)",
    status: "blacklisted",
  },
  {
    name: "Akshar Sarvajanik Vachanalaya, Ambikanagar, Malkapur, Akola, Maharashtra",
    action: "Blacklisted (09.05.2001-ADIP Scheme)",
    status: "blacklisted",
  },
  {
    name: "Apanga Association, Nandgaon, Khandeswa, Amrawati, Maharashtra",
    action: "Blacklisted (09.05.2001-ADIP Scheme)",
    status: "blacklisted",
  },
  {
    name: "Ambedkar Gramodyog Seva Sansthan Ram Janki Nagar, Gorakhpur, UP",
    action: "Blacklisted (17.07.2001-SCD-IIl) vide their letter no.11020/263/99-SCD-III",
    status: "blacklisted",
  },
  {
    name: "Christ Rural Development Educational Society, Distt.: Anantpur, Andhra Pradesh",
    action: "Blacklisted (20.11.2000-SD) from Older Person scheme",
    status: "blacklisted",
  },
  {
    name: "Mother India, Gorantla - 515231. Anantpur - District, Andhra Pradesh",
    action: "Blacklisted (20.11.2000-SD) from Older Person scheme",
    status: "blacklisted",
  },
  {
    name: "Prabhat Antarrashtriya, M.D.1, L.D.A Colony, Kanpur Road, Lucknow, UP",
    action: "Blacklisted (01.08.2001-DD-II)",
    status: "blacklisted",
  },
  {
    name: "Sewa Lok Kalyan Samiti, Tarangini Marg, Elidco Colony, Bangla Bazar, P.O.: Bhadrakh, Lucknow, UP",
    action: "Blacklisted (01.08.2001-DD-II)",
    status: "blacklisted",
  },
  {
    name: "Sarva Kalyan Sansthan, 564/44, Guru Nanak Nagar, Alambagh, Lucknow, UP",
    action: "Blacklisted (03.08.2001-DD-II)",
    status: "blacklisted",
  },
  {
    name: "Anant Ashram, L.D.-9, Sector - F, LDA Colony, Kanpur Road, Lucknow, UP",
    action: "Blacklisted (03.08.2001-DD-II)",
    status: "blacklisted",
  },
  {
    name: "Karunodaya Sewa Sansthan, Vill.: Barkacha, P.O. Box No.11, Distt.: Mirzapur, Uttar Pradesh",
    action: "Blacklisted (03.07.2001-DP-I) from DRUGs Scheme",
    status: "blacklisted",
  },
  {
    name: "Harijan Kalyan Samiti, Karoli Lathori, P.O.: Tandwa Jalal, Tehsil: Allapur, Distt.: Ambedkar Nagar, UP",
    action: "Blacklisted (01.08.2001-DP-I) from DRUGS scheme",
    status: "blacklisted",
  },
  {
    name: "Society for Planning Urban and Rural Development, Bangalore, Karnataka",
    action: "Stopped further GIA - SD(NGO)- 23.08.2001",
    status: "grant-stopped",
  },
  {
    name: "Street Elfins Education & Development Society, No.6, Ist Cross Street Lake Area, Nungambakkam, Chennai, TN",
    action: "Stopping of further GIA-SD(NGO)- 23.08.200",
    status: "grant-stopped",
  },
  {
    name: "Akhil Bhartiya Samaj Kalyan Evam Mahila Vikas Sewa Sansthan, Vill. + PO: Chakiyawa, Distt.: Deoria, Uttar Pradesh",
    action: "Blacklisted on 27.08.2002 {No.22-19(27)/2001-DD-II}",
    status: "blacklisted",
  },
  {
    name: "Delhi Education Centre, Zia Sarai, New Delhi",
    action: "Stopping of further GIA-MC",
    status: "grant-stopped",
  },
  {
    name: "Uni Gramodhyog Rachnatmak Samiti, At + PO: Gadavero. Tal.: Muli, Distt.: Surendranagar, Gujarat",
    action: "Blacklisted on 25.09.01 {No.11020/920/99-SCD-III}",
    status: "blacklisted",
  },
  {
    name: "Jan Kalyan Samaj Vikas Sanstha, Osmanabad, Maharashtra",
    action: "Blacklisted (Drugs - abuse)",
    status: "blacklisted",
  },
  {
    name: "International Mission of Dr. Ambedkar Education Society, Nagpur, Maharashtra",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Tantrik Prashikshan Sansthan, Amravati, Maharashtra",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Shiv Shakti Education Society, Nagpur, Maharashtra",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Enmasse Counselling Technical Centre, 157, Alwarpet Street, Chennai, Tamil Nadu",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Murlidhar Shiksha Kalyan Samiti, Rustampur, Jounpur, Uttar Pradesh",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Vivekanand Anath Ashram, Vill. & Post - Kamlai, PS: Intahar, Distt.: Uttar Dinajpur, West Bengal",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Shri Ballabh Shiksha Prasar Samiti, Tikamgarh.",
    action: "State Govt. has been requested for recovery of grant.",
    status: "recovery-sought",
  },
  {
    name: "Aradhana Gramin Seva Samiti, Tikamgarh, Madhya Pradesh",
    action: "State Govt. has been requested for recovery of grant.",
    status: "recovery-sought",
  },
  {
    name: "Geeta Gramin Samaj Sewa Samiti, Tikamgarh, Madhya Pradesh State",
    action: "Govt. has been requested for recovery of grant.",
    status: "recovery-sought",
  },
  {
    name: "Shiv Samaj Kalyan Samiti, Tikamgarh, Madhya Pradesh",
    action: "State Govt. has been requested for recovery of grant.",
    status: "recovery-sought",
  },
  {
    name: "Sadhna Gramin Seva Samiti, Tikamagarh, Madhya Pradesh",
    action: "State Govt. has been requested for recovery of grant.",
    status: "recovery-sought",
  },
  {
    name: "Kamla Mahila Avam Bal Kalyan Samiti, 9 Mandi, Tiraha Pilakhua, Distt. Gahaziabad, Uttar Pradesh",
    action: "State Govt. has been requested for recovery of grant.",
    status: "recovery-sought",
  },
  {
    name: "Shri Bhavani Mahila Seva Sangh, 11/125, Shanti Apartment Nr.Pragatinagar Naranpura, Ahmedabad",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Shri Prem Bhikshuk All India Voluntary Organisation for weaker Section, Kurukshetra, Haryana-132118",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Shri Damodaran Sanjeevaiah Memorial High School, Sector -6, Bhilai Nagar, Distt. Durg, Chattisgarh",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Bhrigumuni Gramodyog Sansthan, MIG-28, Sector-E, Aliganj Lucknow, UP",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Talagarada Harijan Sahi Mahila Samiti, At Gaikanpali, PO Taparia, Via-Gopalpur, Dist.Sundergarh, Orissa",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Awadh Samajik Uttahan Samiti, 12/53, Indira Nagar, Lucknow, UP",
    action: "Stop further grant in aid",
    status: "grant-stopped",
  },
  {
    name: "Social & Economic Development Institution-India \"Gaurav\", C-2116, Indira Nagar, Lucknow, UP",
    action: "Stop further grant in aid",
    status: "grant-stopped",
  },
  {
    name: "Akhil Bharatiya Azad Seva Sansthan, Azad Villa, Daliganj, Lucknow-20, UP",
    action: "Stop further grant in aid",
    status: "grant-stopped",
  },
  {
    name: "Mahila Mukti Wahini, Alkapuri, Gardanibag, Patna-800002, Bihar",
    action: "Stop further grant in aid",
    status: "grant-stopped",
  },
  {
    name: "Rural Rehabilitation Centre, Siddheshwar Nagar, Behind Waghapur(Tekdi) Yavatmal-1, Maharashtra",
    action: "Deposit the assets created out of Ministry's grants",
    status: "recovery-sought",
  },
  {
    name: "Lok Kalyan Shikshan Sanstha, Railtoly, Pal Chowk, Post and District Godia-441614, Maharashtra",
    action: "Deposit the assets created out of Ministry's grants",
    status: "recovery-sought",
  },
  {
    name: "Vikas Charitable Society, A-Block, 25 Feet Main Road, 1st pusta, Sonia Vihar, Delhi-94",
    action: "Stop further grant in aid & recover grants",
    status: "grant-stopped",
  },
  {
    name: "Ayush Foundation, D-4, Panchvati Apartments, Panchvati Cross Road, Ellis Bridge, Ahmedabad, Gujarat",
    action: "Blacklisted and stop further grants",
    status: "blacklisted",
  },
  {
    name: "Kisan Mahila Gramodyog Sansthan, Hariaoudh Nagar, P.O. Hirapatti, Block Palhani, Tehsil Sadar, Azamgarh, Uttar Pradesh",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Om Hari Bahudeshiya Sikshan Sanstha, Kaneri/Pandhari, Tal-Lakhanii, Bhandara (Maharastra)",
    action: "Blacklisted",
    status: "blacklisted",
  },
  {
    name: "Kinder Haus Organisation, Road-cum Railway Bridge, Kovvur, West Godavari District, Andhra Pradesh",
    action: "Blacklisted vide order No. 11020/384/2006-SCD-III dated 02/07/2013",
    status: "blacklisted",
  },
  {
    name: "Saint Sainath Modern Public Shiksha Samiti, G-5/1, Sunder Nagri, Nand Nagri, Delhi-110093",
    action: "Blacklisted vide order No. 11012/24-04/2009-10(BC NGO)(Pt.) dated 12/08/2013",
    status: "blacklisted",
  },
  {
    name: "Rural Welfare Trust, Graama Iyakkam, Pudukattampur, Thiruppathur Sivagangai, Tamil Nadu-630210",
    action: "Blacklisted by Rastriya Mahila Kosh, Ministry of Women and Child Development, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Chitragupt Shikshan Sansthan Evam Viklang Vidyalaya, Sakalpur, Varanasi, Uttar Pradesh",
    action: "Blacklisted vide order No.4-1(129)/2011/DD-I dated 15/09/2014",
    status: "blacklisted",
  },
  {
    name: "PATHWAYS, H. No. 56, D Block, Rajpur Khurd, Chattarpur, New Delhi - 110074",
    action: "Blacklisted by Rastriya Mahila Kosh, Ministry of Women and Child Development, Govt. of India. vide order No.RMK/BLACKLISTING/LEGAL/DELHI/MLS/12/03/6082 dated 25/09/2014",
    status: "blacklisted",
  },
  {
    name: "PAHAL, Barrage Road Near Railway Station, Kathgodam, Nainital, Uttaranchal - 263126",
    action: "Blacklisted by Rastriya Mahila Kosh, Ministry of Women and Child Development, Govt. of India. vide order No.RMK/BLACKLISTING/LEGAL/UA/MLS/09/20/5096 dated 15/09/2014",
    status: "blacklisted",
  },
  {
    name: "Dhalopar Rural Development Centre, Village - Dhalopar, P.O. Asalkandi, District - Karimganj, Assam",
    action: "Blacklisted by the Ministry of Social Justice and Empowerment, Govt. of India. vide Order No.4-1(69)/2012/DD-I dated 05.11.2014",
    status: "blacklisted",
  },
  {
    name: "R.T. Nagar Educational Trust Soorappana Halli, Kudur Bobli,Magadi Taluk, Ramnagar District, Karnataka.",
    action: "Blacklisted by the Ministry of Social Justice and Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Biswadhara, Plot No. 451/1803, Nausahi, Nayapalli, Bhubneswar, Orissa",
    action: "Blacklisted by the Ministry of Law and Justice, Govt. of India. vide Letter No.13011(1)(iii)/2001-Leg.1 dated 10.02.2015",
    status: "blacklisted",
  },
  {
    name: "Shri Gopal Shikshan and Samaj Seva Samiti, Morena, Madhya Pradesh",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Kamla Swasthya Evam Shiksha Prasarak Samiti, Morena, Madhya Pradesh",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Pawan Gramin Samaj Sewa Samiti, Morena, Madhya Pradesh",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Shri Sharda Mahila Vignana Samiti, Andhra Pradesh",
    action: "Blacklisted on 24.02.2015 (vide order no. 15-1(2)/2014-15/Ag.I) by the Ministry of Social Justice & Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Akansha Bahuddesiya Sansthan, Jalgaon, Maharashtra",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Sri Sirdi Sai Baba Sikhshana Sounstana Vill-Bemalkheda, Tq. Humnabad, Distt- Bidar, Karnataka",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Orissa Multipurpose Development Centre, 9/22, MIG-II, BDA Colony,Chandrasekharpur,Bhubaneshwar- Odisha",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.",
    status: "blacklisted",
  },
  {
    name: "Social Transpermation and Rural Technology,Ranga Reddy,Telangana",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11013/237/2012-DP-III)",
    status: "blacklisted",
  },
  {
    name: "Vivek Education Society,Nayanhalli Village,Chokkahalli Cross,Chikaballpur,Karnataka",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020(10)/7/2011-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Gautam Education Society,Bangalore Urban Karnatka",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020/207/2010-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Shanti Sarvodya Sansthan,Gonda,UP",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020/218/2010-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Pawan Sewa Sansthan,Gonda,UP",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020(18)/11/2013-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Kinder Haus Road-Cum-Rail Bridg Kavour,West Godavari District Andra Pardesh",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020/14/2010-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Baba Organisation for Social Organisation,Door No.MIGH-19,A.P Housing Board Colony,Kukatpaily Hyderabad A.P",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020/14/2010-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Indrani Ram Pamidipaga Raj Rao Memorial Society for Social Justic,Door No.10-84-7/5,Amravathi Plot Chemhupet,Tenali,Andhra Pardesh",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020(18)/11/2013-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Sawan Education Society,House No.78-7-171/2/2,Road No.1,Old Bowinpally,Telangana",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020/14/2010-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Nirashrit Mahila Bal Vikas Gramodyog Shiksha Samiti Trust,Adarsh Colony,Bharatpur,Rjasthan-321001",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020(16)/17/2013-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Manohar Bal Mandir Samiti,108 Setia Colony,SGNR,Gali no.4.Sri Gnaga Nagar,Rjasthan-324005",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020/237/2010-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Prasasvi Sansthan,38,Royal Society,Bajrang Nagar,Kota,Rjasthan-324005",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020(16)/1/2013-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Ankita Bal Vidhya,38,Royal Society,Bajrang Nagar,Kota,Rjasthan-324005",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020(16)/5/2013-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Gyandeep Public School Samiti Trust Ward No. 13Pilibangan,Rajasthan-335803",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.11020(16)/1/2011-SCD-III)",
    status: "blacklisted",
  },
  {
    name: "Andhra Pradesh Girijana Sevak Sangh, 13-148, Chandamama Peta Nandigama, Krishna District-521185, Andhra Pradesh",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no.13011/6(5)/2012-DP-III)",
    status: "blacklisted",
  },
  {
    name: "Orissa Multipurpose Development Centre, 9/22, MIG-II, BDA Colony, Chandrasekharpur, Bhubaneshwar-16, Odisha",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no. 15-18(16)/2014-15/Ag-I/Sr. C.-I",
    status: "blacklisted",
  },
  {
    name: "Johns Daycare and Boarding for Senior Citizens Association, G-106, Adarsh Enclave, Aya Nagar, Phase-6, New Delhi - 110047.",
    action: "Blacklisted by the Ministry of Social Justice & Empowerment, Govt. of India.(order no. 15-4(3)/2015-16/Ag-I/Sr. C.-I",
    status: "blacklisted",
  },
];
