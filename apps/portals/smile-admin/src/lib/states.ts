// State id mapping aligned with the live SMILE Admin app values.
export interface StateInfo {
  id: number;
  name: string;
  short?: string;
  // The TopoJSON we use names states using these conventional spellings.
  topoName?: string;
}

export const STATES: StateInfo[] = [
  { id: 1, name: "Andhra Pradesh", topoName: "Andhra Pradesh" },
  { id: 2, name: "Arunachal Pradesh", topoName: "Arunachal Pradesh" },
  { id: 3, name: "Assam", topoName: "Assam" },
  { id: 4, name: "Bihar", topoName: "Bihar" },
  { id: 5, name: "Chhattisgarh", topoName: "Chhattisgarh" },
  { id: 6, name: "Goa", topoName: "Goa" },
  { id: 7, name: "Gujarat", topoName: "Gujarat" },
  { id: 8, name: "Haryana", topoName: "Haryana" },
  { id: 9, name: "Himachal Pradesh", topoName: "Himachal Pradesh" },
  { id: 10, name: "Jharkhand", topoName: "Jharkhand" },
  { id: 11, name: "Karnataka", topoName: "Karnataka" },
  { id: 12, name: "Kerala", topoName: "Kerala" },
  { id: 13, name: "Madhya Pradesh", topoName: "Madhya Pradesh" },
  { id: 14, name: "Maharashtra", topoName: "Maharashtra" },
  { id: 15, name: "Manipur", topoName: "Manipur" },
  { id: 16, name: "Meghalaya", topoName: "Meghalaya" },
  { id: 17, name: "Mizoram", topoName: "Mizoram" },
  { id: 18, name: "Nagaland", topoName: "Nagaland" },
  { id: 19, name: "Odisha", topoName: "Odisha" },
  { id: 20, name: "Punjab", topoName: "Punjab" },
  { id: 21, name: "Rajasthan", topoName: "Rajasthan" },
  { id: 22, name: "Sikkim", topoName: "Sikkim" },
  { id: 23, name: "Tamil Nadu", topoName: "Tamil Nadu" },
  { id: 24, name: "Telangana", topoName: "Telangana" },
  { id: 25, name: "Tripura", topoName: "Tripura" },
  { id: 26, name: "Uttar Pradesh", topoName: "Uttar Pradesh" },
  { id: 27, name: "Uttarakhand", topoName: "Uttarakhand" },
  { id: 28, name: "West Bengal", topoName: "West Bengal" },
  { id: 30, name: "Andaman & Nicobar Islands", topoName: "Andaman and Nicobar Islands" },
  { id: 31, name: "Chandigarh", topoName: "Chandigarh" },
  { id: 32, name: "Dadra & Nagar Haveli and Daman & Diu", topoName: "Dadra and Nagar Haveli and Daman and Diu" },
  { id: 33, name: "Delhi", topoName: "Delhi" },
  { id: 34, name: "Jammu & Kashmir", topoName: "Jammu and Kashmir" },
  { id: 35, name: "Ladakh", topoName: "Ladakh" },
  { id: 36, name: "Lakshadweep", topoName: "Lakshadweep" },
  { id: 37, name: "Puducherry", topoName: "Puducherry" },
];

export const DISTRICTS_BY_STATE: Record<number, { id: number; name: string }[]> = {
  14: [
    { id: 1401, name: "Mumbai" },
    { id: 1402, name: "Thane" },
    { id: 1403, name: "Pune" },
    { id: 1404, name: "Nagpur" },
    { id: 1405, name: "Nashik" },
    { id: 1406, name: "Aurangabad" },
    { id: 1407, name: "Solapur" },
  ],
  33: [
    { id: 3301, name: "New Delhi" },
    { id: 3302, name: "Central Delhi" },
    { id: 3303, name: "South Delhi" },
    { id: 3304, name: "East Delhi" },
    { id: 3305, name: "North Delhi" },
  ],
  7: [
    { id: 701, name: "Ahmedabad" },
    { id: 702, name: "Surat" },
    { id: 703, name: "Vadodara" },
    { id: 704, name: "Rajkot" },
  ],
  11: [
    { id: 1101, name: "Bengaluru Urban" },
    { id: 1102, name: "Mysuru" },
    { id: 1103, name: "Mangaluru" },
  ],
};
