// Block (tehsil / taluka / CD-block) master data for Mass Pledge reporting.
//
// PROVENANCE — read before extending:
//   This is a CURATED SUBSET, not the LGD directory. It carries real block
//   names for a representative set of districts so every demo login resolves to
//   a genuine place, but it is not exhaustive: LGD lists roughly 7,000 blocks
//   nationally and this file has a few hundred.
//
//   Two known gaps, both deliberate:
//     1. `STATE_DISTRICTS` in `../states.ts` only covers 18 of the 36 States/UTs.
//        The other 18 have no districts seeded at all, so they can have no
//        blocks here either. That gap predates this module.
//     2. Within the 18, we seed 2–3 districts each, not all of them.
//
//   Replacing this with the full LGD import is a mechanical swap: keep the
//   shape, replace the data. Nothing else reads the literal contents.
//
// Assumption A9 (block logins) depends on this file. See `masters.ts`.

/** state → district → blocks. Districts absent here simply have no blocks yet. */
export const STATE_DISTRICT_BLOCKS: Record<string, Record<string, string[]>> = {
  "Uttar Pradesh": {
    Lucknow: [
      "Bakshi Ka Talab",
      "Chinhat",
      "Gosainganj",
      "Kakori",
      "Mal",
      "Malihabad",
      "Mohanlalganj",
      "Sarojini Nagar",
    ],
    Varanasi: [
      "Arajiline",
      "Baragaon",
      "Chiraigaon",
      "Cholapur",
      "Harahua",
      "Kashi Vidyapeeth",
      "Pindra",
      "Sevapuri",
    ],
    Agra: ["Achhnera", "Bah", "Etmadpur", "Fatehabad", "Kheragarh", "Kiraoli", "Pinahat", "Shamsabad"],
  },

  "Madhya Pradesh": {
    Bhopal: ["Berasia", "Phanda"],
    Indore: ["Depalpur", "Indore", "Mhow", "Sanwer"],
    Gwalior: ["Bhitarwar", "Dabra", "Ghatigaon", "Morar"],
  },

  Chhattisgarh: {
    Raipur: ["Abhanpur", "Arang", "Dharsiwa", "Tilda"],
    Durg: ["Dhamdha", "Durg", "Patan"],
    Bilaspur: ["Bilha", "Kota", "Masturi", "Takhatpur"],
  },

  Punjab: {
    Amritsar: [
      "Ajnala",
      "Chogawan",
      "Harsha Chhina",
      "Jandiala Guru",
      "Majitha",
      "Rayya",
      "Tarsikka",
      "Verka",
    ],
    Ludhiana: [
      "Dehlon",
      "Doraha",
      "Jagraon",
      "Khanna",
      "Ludhiana-1",
      "Ludhiana-2",
      "Machhiwara",
      "Pakhowal",
      "Samrala",
      "Sidhwan Bet",
      "Sudhar",
    ],
    Patiala: ["Bhunerheri", "Ghanaur", "Nabha", "Patiala", "Rajpura", "Samana", "Sanaur"],
  },

  Rajasthan: {
    Jaipur: [
      "Amber",
      "Bassi",
      "Chaksu",
      "Dudu",
      "Jamwa Ramgarh",
      "Jhotwara",
      "Kotputli",
      "Phagi",
      "Sambhar",
      "Sanganer",
      "Shahpura",
      "Viratnagar",
    ],
    Jodhpur: ["Balesar", "Bhopalgarh", "Bilara", "Luni", "Osian", "Phalodi", "Shergarh"],
    Udaipur: ["Badgaon", "Girwa", "Gogunda", "Jhadol", "Kherwara", "Kotra", "Mavli", "Sarada"],
  },

  Maharashtra: {
    Pune: [
      "Ambegaon",
      "Baramati",
      "Bhor",
      "Daund",
      "Haveli",
      "Indapur",
      "Junnar",
      "Khed",
      "Maval",
      "Mulshi",
      "Purandar",
      "Shirur",
      "Velhe",
    ],
    Nashik: [
      "Baglan",
      "Chandwad",
      "Deola",
      "Dindori",
      "Igatpuri",
      "Kalwan",
      "Malegaon",
      "Nandgaon",
      "Nashik",
      "Niphad",
      "Peint",
      "Sinnar",
      "Surgana",
      "Trimbakeshwar",
      "Yeola",
    ],
    Thane: ["Ambarnath", "Bhiwandi", "Kalyan", "Murbad", "Shahapur", "Thane", "Ulhasnagar"],
  },

  Gujarat: {
    Ahmedabad: [
      "Bavla",
      "Daskroi",
      "Detroj-Rampura",
      "Dhandhuka",
      "Dholka",
      "Mandal",
      "Sanand",
      "Viramgam",
    ],
    Surat: ["Bardoli", "Choryasi", "Kamrej", "Mahuva", "Mandvi", "Mangrol", "Olpad", "Palsana", "Umarpada"],
    Vadodara: ["Dabhoi", "Desar", "Karjan", "Padra", "Savli", "Sinor", "Vadodara", "Waghodia"],
  },

  Haryana: {
    Gurugram: ["Farrukhnagar", "Gurugram", "Pataudi", "Sohna"],
    Karnal: ["Assandh", "Gharaunda", "Indri", "Karnal", "Nilokheri", "Nissing"],
    Hisar: ["Adampur", "Agroha", "Barwala", "Hansi", "Hisar-I", "Hisar-II", "Narnaund", "Uklana"],
  },

  Karnataka: {
    Bengaluru: ["Anekal", "Bangalore East", "Bangalore North", "Bangalore South"],
    Mysuru: [
      "H.D. Kote",
      "Hunsur",
      "Krishnarajanagara",
      "Mysuru",
      "Nanjangud",
      "Periyapatna",
      "Saragur",
      "T. Narasipura",
    ],
    Belagavi: [
      "Athani",
      "Bailhongal",
      "Belagavi",
      "Chikodi",
      "Gokak",
      "Hukkeri",
      "Khanapur",
      "Raibag",
      "Ramdurg",
      "Saundatti",
    ],
  },

  "West Bengal": {
    Hooghly: [
      "Arambagh",
      "Balagarh",
      "Chanditala-I",
      "Chinsurah-Magra",
      "Dhaniakhali",
      "Goghat-I",
      "Haripal",
      "Jangipara",
      "Khanakul-I",
      "Pandua",
      "Polba-Dadpur",
      "Pursurah",
      "Singur",
      "Tarakeswar",
    ],
    Nadia: [
      "Chakdaha",
      "Hanskhali",
      "Haringhata",
      "Kaliganj",
      "Krishnanagar-I",
      "Nabadwip",
      "Nakashipara",
      "Ranaghat-I",
      "Santipur",
    ],
    Bankura: [
      "Bankura-I",
      "Bankura-II",
      "Barjora",
      "Bishnupur",
      "Chhatna",
      "Gangajalghati",
      "Indpur",
      "Joypur",
      "Kotulpur",
      "Mejia",
      "Onda",
      "Patrasayer",
      "Ranibandh",
      "Saltora",
      "Simlapal",
      "Sonamukhi",
      "Taldangra",
    ],
  },

  Bihar: {
    Patna: [
      "Athmalgola",
      "Bakhtiarpur",
      "Barh",
      "Belchhi",
      "Bihta",
      "Bikram",
      "Danapur",
      "Daniyawan",
      "Dulhin Bazar",
      "Fatuha",
      "Ghoswari",
      "Khusrupur",
      "Maner",
      "Masaurhi",
      "Mokama",
      "Naubatpur",
      "Paliganj",
      "Pandarak",
      "Patna Sadar",
      "Phulwari Sharif",
      "Punpun",
      "Sampatchak",
    ],
    Gaya: [
      "Amas",
      "Atri",
      "Barachatti",
      "Belaganj",
      "Bodh Gaya",
      "Dobhi",
      "Fatehpur",
      "Gurua",
      "Imamganj",
      "Khizarsarai",
      "Konch",
      "Manpur",
      "Mohanpur",
      "Paraiya",
      "Sherghati",
      "Tekari",
      "Wazirganj",
    ],
    Muzaffarpur: [
      "Aurai",
      "Bandra",
      "Bochaha",
      "Gaighat",
      "Kanti",
      "Katra",
      "Kurhani",
      "Marwan",
      "Minapur",
      "Motipur",
      "Musahri",
      "Paroo",
      "Sahebganj",
      "Sakra",
      "Saraiya",
    ],
  },

  Assam: {
    Kamrup: [
      "Boko",
      "Bongaon",
      "Chayani Barduar",
      "Chhaygaon",
      "Goroimari",
      "Hajo",
      "Kamalpur",
      "Rampur",
      "Rani",
      "Sualkuchi",
    ],
    Nagaon: ["Batadraba", "Dolongghat", "Juria", "Kaliabor", "Kathiatoli", "Lawkhowa", "Raha", "Rupahihat"],
    Dibrugarh: ["Barbaruah", "Joypur", "Khowang", "Lahowal", "Panitola", "Tengakhat", "Tingkhong"],
  },

  "Tamil Nadu": {
    Coimbatore: [
      "Annur",
      "Karamadai",
      "Kinathukadavu",
      "Madukkarai",
      "Perianaickenpalayam",
      "Pollachi North",
      "Pollachi South",
      "Sarcarsamakulam",
      "Sulur",
      "Thondamuthur",
    ],
    Madurai: [
      "Alanganallur",
      "Chellampatti",
      "Kallikudi",
      "Kottampatti",
      "Madurai East",
      "Madurai West",
      "Melur",
      "Sedapatti",
      "T. Kallupatti",
      "Thirumangalam",
      "Thiruparankundram",
      "Usilampatti",
      "Vadipatti",
    ],
    Salem: [
      "Attur",
      "Ayothiapattinam",
      "Gangavalli",
      "Kadayampatti",
      "Kolathur",
      "Konganapuram",
      "Mecheri",
      "Nangavalli",
      "Omalur",
      "Panamarathupatti",
      "Pethanaickenpalayam",
      "Sankari",
      "Tharamangalam",
      "Valapady",
      "Veerapandi",
    ],
  },

  Telangana: {
    Hyderabad: [
      "Ameerpet",
      "Bahadurpura",
      "Charminar",
      "Golconda",
      "Himayathnagar",
      "Khairatabad",
      "Marredpally",
      "Nampally",
      "Saidabad",
      "Secunderabad",
      "Shaikpet",
      "Tirumalagiri",
    ],
    Karimnagar: [
      "Chigurumamidi",
      "Choppadandi",
      "Gangadhara",
      "Ganneruvaram",
      "Huzurabad",
      "Jammikunta",
      "Karimnagar",
      "Kothapalli",
      "Manakondur",
      "Ramadugu",
      "Saidapur",
      "Shankarapatnam",
      "Thimmapur",
      "Veenavanka",
    ],
    "Warangal Urban": ["Hanamkonda", "Hasanparthy", "Kazipet", "Khila Warangal", "Velair", "Warangal"],
  },

  "Andhra Pradesh": {
    Visakhapatnam: [
      "Anandapuram",
      "Bheemunipatnam",
      "Gajuwaka",
      "Padmanabham",
      "Pendurthi",
      "Visakhapatnam Rural",
      "Visakhapatnam Urban",
    ],
    Guntur: [
      "Guntur East",
      "Guntur West",
      "Medikonduru",
      "Pedakakani",
      "Pedanandipadu",
      "Phirangipuram",
      "Prathipadu",
      "Tadikonda",
      "Thullur",
      "Vatticherukuru",
    ],
    Kurnool: ["Gudur", "Kallur", "Kodumur", "Kurnool", "Orvakal", "Veldurthi"],
  },

  "Jammu and Kashmir": {
    Srinagar: ["Chanapora", "Eidgah", "Khanyar", "Lal Bazar", "Pantha Chowk", "Srinagar", "Zadibal"],
    Jammu: ["Bhalwal", "Bishnah", "Dansal", "Jammu", "Marh", "R.S. Pura", "Satwari"],
    Baramulla: ["Baramulla", "Boniyar", "Kunzer", "Pattan", "Rafiabad", "Rohama", "Sopore", "Tangmarg", "Uri"],
  },

  Kerala: {
    Ernakulam: [
      "Aluva",
      "Angamaly",
      "Edappally",
      "Koovappady",
      "Kothamangalam",
      "Mulanthuruthy",
      "Muvattupuzha",
      "Palluruthy",
      "Parakkadavu",
      "Paravur",
      "Vadavucode",
      "Vazhakulam",
      "Vypin",
    ],
    Thiruvananthapuram: [
      "Athiyannoor",
      "Chirayinkeezhu",
      "Kazhakuttom",
      "Kilimanoor",
      "Nedumangad",
      "Nemom",
      "Parassala",
      "Perumkadavila",
      "Pothencode",
      "Vamanapuram",
      "Vellanad",
    ],
    Thrissur: [
      "Anthikad",
      "Chalakudy",
      "Chavakkad",
      "Cherpu",
      "Irinjalakuda",
      "Kodakara",
      "Mathilakam",
      "Mullassery",
      "Ollukkara",
      "Pazhayannur",
      "Puzhakkal",
      "Thalikulam",
      "Vellangallur",
      "Wadakkanchery",
    ],
  },

  Delhi: {
    "New Delhi": ["Chanakya Puri", "Connaught Place", "Parliament Street", "Vasant Vihar"],
    "South Delhi": ["Defence Colony", "Hauz Khas", "Kalkaji", "Mehrauli", "Saket"],
    "West Delhi": ["Patel Nagar", "Punjabi Bagh", "Rajouri Garden", "Vikas Puri"],
  },
};

/** Blocks seeded for a district. Empty when the district is not yet covered. */
export function blocksFor(state: string, district: string): string[] {
  return STATE_DISTRICT_BLOCKS[state]?.[district] ?? [];
}

/** Districts that have at least one seeded block, for a given state. */
export function districtsWithBlocks(state: string): string[] {
  return Object.keys(STATE_DISTRICT_BLOCKS[state] ?? {}).sort();
}

/** True when the district has seeded blocks — drives the "pending LGD" notice. */
export function hasBlocks(state: string, district: string): boolean {
  return blocksFor(state, district).length > 0;
}

/** Honest coverage numbers, surfaced on the assumptions page. */
export function blockCoverage(): { states: number; districts: number; blocks: number } {
  const states = Object.keys(STATE_DISTRICT_BLOCKS);
  let districts = 0;
  let blocks = 0;
  for (const state of states) {
    const byDistrict = STATE_DISTRICT_BLOCKS[state] ?? {};
    for (const district of Object.keys(byDistrict)) {
      districts += 1;
      blocks += (byDistrict[district] ?? []).length;
    }
  }
  return { states: states.length, districts, blocks };
}
