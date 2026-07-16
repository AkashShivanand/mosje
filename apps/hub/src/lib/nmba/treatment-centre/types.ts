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

/** A peer volunteer working under a CPLI peer educator. */
export type Volunteer = {
  name: string;
  age: number;
  phone: string;
  status: "Active" | "Inactive";
  joinedOn: string;
};

/** CPLI training session attended by a peer educator's volunteer group. */
export type TrainingRecord = {
  id: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  numberOfVolunteers: number;
  location: string;
  detailsAndOutcomes: string;
  remarks?: string;
  /** Data-URLs of uploaded training photos (1 required by the form). */
  photoUrls?: string[];
};

/** CPLI peer-educator record. */
export type PeerEducator = {
  id: string;
  name: string;
  numberOfVolunteers: number;
  address: string;
  /**
   * Roster of volunteers. Optional: seeded educators omit it and a stable
   * roster is derived from `numberOfVolunteers`; once volunteers are uploaded
   * for an educator this holds the real (persisted) list so the upload and the
   * "View Volunteers" screen stays in sync within the session.
   */
  volunteers?: Volunteer[];
  /**
   * Training records. Optional: seeded educators omit it and a stable list is
   * derived from the educator id; once records are added/edited this holds the
   * live list so the training sub-page stays in sync within the session.
   */
  trainings?: TrainingRecord[];
};

/** Follow-up visit row (IRCA + ODIC). */
export type FollowUp = {
  id: string;
  registrationNumber: string;
  name: string;
  followUpDate: string;
  followUpNumber: number;
  status: string;
  /** ODIC follow-up clinical fields (captured on the Follow-up ODIC form). */
  interventionTypes?: string[];
  medicalDetails?: string;
  psychosocial?: string;
  referralMadeTo?: string;
  nextFollowUpDate?: string;
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
  hotspot: string;
  awarenessDate: string;
  venueName: string;
  peopleAttended: number;
  /** Photo(s) of the awareness generation programme (data URL + file name). */
  photoUrl?: string;
  photoName?: string;
};

/** Allowed designation values for staff — matches the live portal's select options. */
export type StaffDesignation =
  | "PROJECT COORDINATOR CUM VOCATIONAL COUNSELLOR"
  | "DOCTOR"
  | "COUNSELLOR / SOCIAL WORKER / PSYCHOLOGIST"
  | "NURSE"
  | "PROFESSIONAL PERSON EDUCATOR";

/** Staff member row (shared). */
export type StaffMember = {
  id: string;
  designation: StaffDesignation;
  name: string;
  mobile: string;
  education: string;
};

/** Centre activity row (shared). */
export type CentreActivity = {
  id: string;
  activity: string;
  /** NMBA activity category (from the activity-category master). */
  category?: string;
  date: string;
  location: string;
  beneficiaries: number;
};

/** Allowed event values for Saptah/Activity form. */
export type SaptahEventType =
  | "International Day Against Drug Abuse and Illicit Trafficking"
  | "Nasha Mukt Bharat Saptah 2026";

/** A single image or video attached to a Saptah activity. */
export type SaptahMedia = {
  /** Path/URL (seed data) or data-URL (in-session uploads). */
  url: string;
  type: "image" | "video";
  /** Caption / original file name. */
  name?: string;
  /** Poster frame for videos. */
  poster?: string;
};

/** Nasha Mukt Bharat Saptah 2026 / awareness activity row (shared). */
export type SaptahEvent = {
  id: string;
  /** Which campaign this activity belongs to. */
  event: SaptahEventType;
  /** Specific activity type from the dropdown (34 options). */
  activity: string;
  date: string;
  coordinatingDept: string;
  totalParticipants: number;
  maleParticipants: number;
  femaleParticipants: number;
  numEducationalInstitutions: number;
  isCompleted: "Completed" | "Not Completed";
  /** Attached images/videos — an activity can have several. */
  media?: SaptahMedia[];
  latitude?: string;
  longitude?: string;
  createdAt?: string;
};

/** Album/category a centre photo belongs to. */
export type CenterPhotoCategory =
  | "Infrastructure"
  | "Counselling & Therapy"
  | "Awareness & Events"
  | "Wellness & Recreation"
  | "Staff & Team"
  | "Community Outreach";

/** A single photo or video in the Centre's media gallery. */
export type CenterPhoto = {
  id: string;
  /** Path/URL (seed data) or data-URL (in-session uploads). */
  url: string;
  type: "image" | "video";
  /** Poster frame for videos. */
  poster?: string;
  /** Human-readable caption / title. */
  caption: string;
  /** Album this item is grouped under. */
  category: CenterPhotoCategory;
  /** ISO date (yyyy-mm-dd) the photo was taken / uploaded. */
  date: string;
  /** Role or name of the uploader. */
  uploadedBy?: string;
  /** Pinned as a highlight / cover image. */
  featured?: boolean;
};

/** The authenticated treatment-centre session (stored in a cookie). */
export type TCSession = {
  projectId: string;
  role: TCRole;
  centerId: number;
  centerName: string;
};
