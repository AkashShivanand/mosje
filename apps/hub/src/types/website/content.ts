export interface ContentSection {
  heading: string | null;
  html: string;
}

export interface SectionRecord {
  slug: string;
  title: string;
  sourceUrl: string;
  sections: ContentSection[];
  featuredImage?: string;
  website?: string;
  category?: string;
  targetGroup?: string[];
}

export interface FileRecord {
  slug: string;
  title: string;
  sourceUrl: string;
  date?: string;
  category?: string;
  fileUrl?: string;
}

/*
 * RICH RECORD COLLECTIONS — mirrors of apps/hub/scripts/ingest/schema.mjs, which
 * validates every ingested record with `.strict()` so these types cannot drift
 * from the JSON silently. File and image URLs are the LIVE dosje.gov.in /
 * CloudFront URLs; nothing here has been mirrored locally.
 */

/** Common to every record: the REST identity and publish date. */
interface RecordBase {
  slug: string;
  title: string;
  /** The record's page on dosje.gov.in. */
  sourceUrl: string;
  /** Publish date, YYYY-MM-DD. */
  date?: string;
}

/** A photo/video on an event or gallery page. */
export interface MediaItem {
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  /** YYYY-MM-DD where the site printed a parseable date, else its text. */
  date?: string;
  caption?: string;
  poster?: string;
  kind?: "file" | "youtube";
}

export interface LabelledFile {
  label?: string;
  url: string;
  fileType?: string;
}

/** documents · scheme-documents · suo-moto-disclosure */
export interface DocumentRecord extends RecordBase {
  /** A listing-page type where the record has one, else its first type. */
  category?: string;
  /** Every documents-type term on the record. */
  types?: string[];
  /** Organisation abbreviation, e.g. "NCSK". */
  organisation?: string;
  organisations?: string[];
  year?: string;
  fileUrl?: string;
  fileType?: string;
  /** As printed by the site, e.g. "0.11 MB". */
  fileSize?: string;
  /** Where the record links another host instead of uploading a file. */
  externalUrl?: string;
  fileUrlHi?: string;
  fileSizeHi?: string;
  /** YYYY-MM-DD where parseable. */
  publishStart?: string;
  publishEnd?: string;
  scheme?: string;
  schemeUrl?: string;
  commission?: string;
  states?: string[];
  /** component_status term, e.g. "Active" / "Archived". */
  status?: string;
  serialNumber?: string;
  tags?: string[];
}

export interface EventRecord extends RecordBase {
  categories?: string[];
  galleryCategories?: string[];
  organisation?: string;
  startDate?: string;
  endDate?: string;
  /** The date/time line exactly as the site prints it. */
  when?: string;
  location?: string;
  mode?: string;
  status?: string;
  organizer?: string;
  email?: string;
  mobile?: string;
  totalHours?: string;
  /** Sanitised HTML. */
  descriptionHtml?: string;
  pdfUrl?: string;
  pdfUrlHi?: string;
  imageUrl?: string;
  photos?: MediaItem[];
  videos?: MediaItem[];
  links?: string[];
}

export interface GalleryRecord extends RecordBase {
  /** "Photos" | "Videos" | "News". */
  type?: string;
  categories?: string[];
  organisation?: string;
  description?: string;
  source?: string;
  sourceLink?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  images?: MediaItem[];
  videos?: MediaItem[];
}

export interface OfficialRecord extends RecordBase {
  /** "Leadership" | "Member". */
  officialType?: string;
  organisation?: string;
  organisationName?: string;
  organisationUrl?: string;
  designation?: string;
  designationTerms?: string[];
  group?: string;
  commission?: string;
  imageUrl?: string;
  tenure?: string;
  intercom?: string;
  phoneOffice?: string;
  phoneResidence?: string;
  email?: string;
  address?: string;
  socialLinks?: string[];
  workAllocationHtml?: string;
  additionalInfoHtml?: string;
  menuOrder?: number;
}

export interface CpioRecord extends RecordBase {
  organisation?: string;
  office?: string;
  name?: string;
  designation?: string;
  email?: string;
}

export interface BookingRecord extends RecordBase {
  category?: string;
  description?: string;
  rating?: string;
  rates?: { label?: string; rate?: string }[];
  note?: string;
  contacts?: { email?: string; phone?: string }[];
  imageUrl?: string;
  images?: string[];
  documents?: LabelledFile[];
}

export interface UpdateRecord extends RecordBase {
  status?: string;
  organisation?: string;
  /** Sanitised HTML. */
  bodyHtml?: string;
  attachments?: LabelledFile[];
  videos?: MediaItem[];
}

export interface SewerDeathCaseRecord extends RecordBase {
  name: string;
  state?: string;
  district?: string;
  dateOfDeath?: string;
  paymentStatus?: string;
  /** As printed, e.g. "1,000,000". */
  amount?: string;
  amountInr?: number;
}
