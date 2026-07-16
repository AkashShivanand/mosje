// De-addiction Centre (Nasha Mukti Kendra) reference data for the public locator map
// on the DoSJE home page. Content sourced from the legacy Nasha Mukt Bharat Abhiyaan
// site (https://nmba.dosje.gov.in/). The national totals are the published figures;
// the coordinates below are a representative seed set across states for the map. A full
// geocoded dataset can replace DEADDICTION_CENTRES without touching the component.

export type CentreType = "IRCA" | "CPLI" | "ODIC" | "DDAC" | "ATF";

export interface DeAddictionCentre {
  type: CentreType;
  name: string;
  address: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
}

// Published centre-type meta: full name, map colour, and national count (768 total).
export const CENTRE_TYPE_META: Record<
  CentreType,
  { label: string; short: string; color: string; count: number }
> = {
  IRCA: {
    label: "Integrated Rehabilitation Centre for Addicts",
    short: "Inpatient counselling & treatment",
    color: "#0373DF",
    count: 348,
  },
  DDAC: {
    label: "District De-addiction Centre",
    short: "One-stop centre — all services",
    color: "#7C3AED",
    count: 145,
  },
  ATF: {
    label: "Addiction Treatment Facility",
    short: "Medical treatment facility",
    color: "#DC2626",
    count: 154,
  },
  ODIC: {
    label: "Outreach & Drop-in Centre",
    short: "Screening, assessment & counselling",
    color: "#D97706",
    count: 76,
  },
  CPLI: {
    label: "Community Peer Led Intervention",
    short: "Youth-focused prevention",
    color: "#16A34A",
    count: 45,
  },
};

export const CENTRE_TYPE_ORDER: CentreType[] = ["IRCA", "DDAC", "ATF", "ODIC", "CPLI"];

export const TOTAL_CENTRES = 768;
export const HELPLINE = "14446";

// Live campaign counters (legacy site).
export const PLEDGE_STATS = {
  ePledges: "25,20,056", // general e-pledges
  ePledgesRaw: 2520056,
  recoveredPledges: "6,60,523", // recovered-user pledges
  recoveredPledgesRaw: 660523,
  individualsReached: "23 crore+",
  youthReached: "7.81 crore",
  womenReached: "5.24 crore",
  institutions: "17 lakh",
};

// Representative seed centres across states. Coordinates are district/city centroids.
export const DEADDICTION_CENTRES: DeAddictionCentre[] = [
  { type: "IRCA", name: "Integrated Rehab Centre, New Delhi", address: "Sector 12, New Delhi - 110001", state: "Delhi", district: "New Delhi", lat: 28.6139, lng: 77.209 },
  { type: "DDAC", name: "District De-addiction Centre, Central Delhi", address: "Daryaganj, New Delhi - 110002", state: "Delhi", district: "Central Delhi", lat: 28.6438, lng: 77.2415 },
  { type: "IRCA", name: "Integrated Rehab Centre, Mumbai", address: "Andheri East, Mumbai - 400069", state: "Maharashtra", district: "Mumbai", lat: 19.1197, lng: 72.8484 },
  { type: "ATF", name: "Addiction Treatment Facility, Pune", address: "Shivajinagar, Pune - 411005", state: "Maharashtra", district: "Pune", lat: 18.5308, lng: 73.8475 },
  { type: "ODIC", name: "Outreach & Drop-in Centre, Nagpur", address: "Sitabuldi, Nagpur - 440012", state: "Maharashtra", district: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { type: "CPLI", name: "Community Peer Intervention, Bengaluru", address: "Residency Road, Bengaluru - 560025", state: "Karnataka", district: "Bengaluru Urban", lat: 12.9716, lng: 77.5946 },
  { type: "DDAC", name: "District De-addiction Centre, Mysuru", address: "Nazarbad, Mysuru - 570010", state: "Karnataka", district: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { type: "ODIC", name: "Outreach & Drop-in Centre, Chennai", address: "Anna Salai, Chennai - 600002", state: "Tamil Nadu", district: "Chennai", lat: 13.0827, lng: 80.2707 },
  { type: "ATF", name: "Addiction Treatment Facility, Coimbatore", address: "R S Puram, Coimbatore - 641002", state: "Tamil Nadu", district: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { type: "ODIC", name: "Outreach & Drop-in Centre, Hyderabad", address: "Banjara Hills, Hyderabad - 500034", state: "Telangana", district: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { type: "CPLI", name: "Community Peer Intervention, Kolkata", address: "Park Street, Kolkata - 700016", state: "West Bengal", district: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { type: "IRCA", name: "Integrated Rehab Centre, Howrah", address: "Shibpur, Howrah - 711102", state: "West Bengal", district: "Howrah", lat: 22.5958, lng: 88.2636 },
  { type: "DDAC", name: "District De-addiction Centre, Jaipur", address: "Tonk Road, Jaipur - 302015", state: "Rajasthan", district: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { type: "ATF", name: "Addiction Treatment Facility, Jodhpur", address: "Ratanada, Jodhpur - 342011", state: "Rajasthan", district: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { type: "DDAC", name: "District De-addiction Centre, Lucknow", address: "Hazratganj, Lucknow - 226001", state: "Uttar Pradesh", district: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { type: "IRCA", name: "Integrated Rehab Centre, Kanpur", address: "Civil Lines, Kanpur - 208001", state: "Uttar Pradesh", district: "Kanpur Nagar", lat: 26.4499, lng: 80.3319 },
  { type: "ODIC", name: "Outreach & Drop-in Centre, Varanasi", address: "Sigra, Varanasi - 221010", state: "Uttar Pradesh", district: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { type: "ATF", name: "Addiction Treatment Facility, Amritsar", address: "Ranjit Avenue, Amritsar - 143001", state: "Punjab", district: "Amritsar", lat: 31.634, lng: 74.8723 },
  { type: "DDAC", name: "District De-addiction Centre, Ludhiana", address: "Civil Lines, Ludhiana - 141001", state: "Punjab", district: "Ludhiana", lat: 30.901, lng: 75.8573 },
  { type: "IRCA", name: "Integrated Rehab Centre, Jalandhar", address: "Model Town, Jalandhar - 144003", state: "Punjab", district: "Jalandhar", lat: 31.326, lng: 75.5762 },
  { type: "CPLI", name: "Community Peer Intervention, Chandigarh", address: "Sector 32, Chandigarh - 160030", state: "Chandigarh", district: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { type: "DDAC", name: "District De-addiction Centre, Ahmedabad", address: "Navrangpura, Ahmedabad - 380009", state: "Gujarat", district: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { type: "ODIC", name: "Outreach & Drop-in Centre, Surat", address: "Athwa, Surat - 395007", state: "Gujarat", district: "Surat", lat: 21.1702, lng: 72.8311 },
  { type: "IRCA", name: "Integrated Rehab Centre, Bhopal", address: "Arera Colony, Bhopal - 462016", state: "Madhya Pradesh", district: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { type: "DDAC", name: "District De-addiction Centre, Indore", address: "Vijay Nagar, Indore - 452010", state: "Madhya Pradesh", district: "Indore", lat: 22.7196, lng: 75.8577 },
  { type: "ATF", name: "Addiction Treatment Facility, Patna", address: "Boring Road, Patna - 800001", state: "Bihar", district: "Patna", lat: 25.5941, lng: 85.1376 },
  { type: "ODIC", name: "Outreach & Drop-in Centre, Guwahati", address: "Zoo Road, Guwahati - 781024", state: "Assam", district: "Kamrup Metropolitan", lat: 26.1445, lng: 91.7362 },
  { type: "IRCA", name: "Integrated Rehab Centre, Imphal", address: "Thangmeiband, Imphal - 795001", state: "Manipur", district: "Imphal West", lat: 24.817, lng: 93.9368 },
  { type: "DDAC", name: "District De-addiction Centre, Thiruvananthapuram", address: "Vellayambalam, Thiruvananthapuram - 695010", state: "Kerala", district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { type: "CPLI", name: "Community Peer Intervention, Bhubaneswar", address: "Saheed Nagar, Bhubaneswar - 751007", state: "Odisha", district: "Khordha", lat: 20.2961, lng: 85.8245 },
  { type: "ATF", name: "Addiction Treatment Facility, Srinagar", address: "Rajbagh, Srinagar - 190008", state: "Jammu and Kashmir", district: "Srinagar", lat: 34.0837, lng: 74.7973 },
  { type: "DDAC", name: "District De-addiction Centre, Dehradun", address: "Rajpur Road, Dehradun - 248001", state: "Uttarakhand", district: "Dehradun", lat: 30.3165, lng: 78.0322 },
];
