// Treatment-Centre (Patient Data Monitoring System) — domain types.
// Structure cloned from the legacy NMBA treatment-centre portal (inventoried
// 2026-06-22). All records that use these types are SYNTHETIC — no real PII.

export type TCRole = "IRCA" | "ODIC" | "CPLI" | "DDAC" | "US";

export type RegistrationProgress = "Completed" | "In Progress" | "Pending";

/** A single repeatable drug-use row inside the IRCA/ODIC registration form. */
export type DrugUseRow = {
  drug: string;
  ageOfFirstUse: string;
  reason: string;
  usedLast3Months: "Yes" | "No" | "";
  dailyUse: "Yes" | "No" | "";
  durationMonths: string;
};

/** IRCA clinical patient record (the richest entity). */
export type Patient = {
  id: string;
  registrationNumber: string;
  registrationProgress: RegistrationProgress;
  treatmentCenter: string;
  name: string;
  gender: string;
  age: number;
  dateOfAdmission: string;
  currentAddress: string;
  permanentAddress: string;
  state: string;
  district: string;
  placeOfResidence: string;
  maritalStatus: string;
  livingArrangements: string;
  education: string;
  occupation: string;
  employment: string;
  income: string;
  category: string;
  contactNumber: string;
  governmentId: string;
  governmentIdNumber?: string;
  photoUrl?: string;
  drugUse: DrugUseRow[];
  provisionalDiagnosis: string;
  /** Optional clinical detail answers (injecting/sexual/ASSIST/treatment/misc), label → value. */
  clinicalDetails?: Record<string, string>;

  // Tab 1: Clinical History
  withdrawalSymptoms?: string[];
  psychiatricSymptoms?: string[];
  chronicProblems?: string[];
  otherMedicalProblems?: string[];
  headInjury?: string;
  previousDrugTreatment?: string;
  prevTreatmentYear?: string;
  prevTreatmentDuration?: string;
  prevTreatmentCenter?: string;
  treatmentReceivedTypes?: string[];
  relapseReason?: string;
  relapseReasonOther?: string;

  // Tab 2: Dosage Log
  dosageLog?: Array<{
    date: string;
    complaints: string;
    medication: string;
    changeReason: string;
    remarks: string;
  }>;

  // Tab 3: Counselling
  individualCounselling?: Array<{
    sessionNo: string;
    date: string;
    issues: string;
  }>;
  groupCounselling?: Array<{
    sessionNo: string;
    date: string;
    issues: string;
  }>;
  familyCounselling?: Array<{
    sessionNo: string;
    date: string;
    issues: string;
  }>;

  // Tab 4: Referral & Home Visit
  referralServices?: string[];
  referralOtherSpecify?: string;
  referralRemark?: string;
  homeVisits?: Array<{
    date: string;
    purpose: string;
    outcome: string;
  }>;

  // Tab 5: Diagnosis & Discharge
  finalDiagnosis?: string;
  medicalComorbidity?: string;
  psychiatricComorbidity?: string;
  neurologicalCondition?: string;
  dischargeMotivation?: string;
  dischargeMedication?: string;
  dischargeRemark?: string;
  dischargeDate?: string;
  followUpDate?: string;
};

/** ODIC outreach / drop-in-centre beneficiary record. */
export type Beneficiary = {
  id: string;
  registrationNumber: string;
  registrationProgress: RegistrationProgress;
  name: string;
  gender: string;
  age: number;
  dateOfRegistration: string;
  referredBy: string;
  state: string;
  district: string;
  placeOfResidence: string;
  contactNumber: string;
  category: string;
  governmentId?: string;
  governmentIdNumber?: string;
  drugUse?: DrugUseRow[];
  kind: "Outreach" | "Drop-in Centre";
  /** Optional demographics captured at registration (address/education/etc.), label → value. */
  details?: Record<string, string>;
};

/** CPLI peer-educator record. */
export type PeerEducator = {
  id: string;
  name: string;
  numberOfVolunteers: number;
  address: string;
};

/** Follow-up visit row (IRCA + ODIC). */
export type FollowUp = {
  id: string;
  registrationNumber: string;
  name: string;
  followUpDate: string;
  followUpNumber: number;
  status: string;
};

/** Readmission row (IRCA). */
export type Readmission = {
  id: string;
  registrationNumber: string;
  name: string;
  readmissionDate: string;
  reason: string;
};

/** Awareness-generation programme row (IRCA + ODIC). */
export type AwarenessProgramme = {
  id: string;
  activity: string;
  date: string;
  location: string;
  participants: number;
};

/** Staff member row (shared). */
export type StaffMember = {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  contactNumber: string;
};

/** Centre activity row (shared). */
export type CentreActivity = {
  id: string;
  activity: string;
  date: string;
  location: string;
  beneficiaries: number;
};

/** Nasha Mukt Bharat Saptah 2026 event row (shared). */
export type SaptahEvent = {
  id: string;
  eventName: string;
  date: string;
  location: string;
  participants: number;
  coordinatingDept?: string;
  maleParticipants?: number;
  femaleParticipants?: number;
  educationalInstitutions?: string;
  completionStatus?: string;
  mediaUrl?: string;
  latitude?: string;
  longitude?: string;
};

/** The authenticated treatment-centre session (stored in a cookie). */
export type TCSession = {
  projectId: string;
  role: TCRole;
  centerId: number;
  centerName: string;
};
