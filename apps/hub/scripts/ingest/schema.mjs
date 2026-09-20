import { z } from "zod";

export const sectionSchema = z.object({
  heading: z.string().nullable(),
  html: z.string(),
});

export const sectionRecordSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  sections: z.array(sectionSchema),
  featuredImage: z.string().optional(),
  website: z.string().optional(),
  category: z.string().optional(),
  targetGroup: z.array(z.string()).optional(),
});

export const collectionFileSchema = z.array(sectionRecordSchema);

export const fileRecordSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  date: z.string().optional(),
  category: z.string().optional(),
  fileUrl: z.string().url().optional(),
});

export const fileCollectionFileSchema = z.array(fileRecordSchema);

// ── Rich collections ─────────────────────────────────────────────────────────
// `.strict()` so a field added to a transform without a schema (and therefore
// without a TypeScript type in src/types/website/content.ts) fails the ingest.

const base = {
  slug: z.string().min(1),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
};
const url = z.string().url();
const str = z.string().min(1);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const documentRecordSchema = z.object({
  ...base,
  category: str.optional(),
  types: z.array(str).optional(),
  organisation: str.optional(),
  organisations: z.array(str).optional(),
  year: str.optional(),
  fileUrl: url.optional(),
  fileType: str.optional(),
  fileSize: str.optional(),
  externalUrl: url.optional(),
  fileUrlHi: url.optional(),
  fileSizeHi: str.optional(),
  publishStart: str.optional(),
  publishEnd: str.optional(),
  scheme: str.optional(),
  schemeUrl: url.optional(),
  commission: str.optional(),
  states: z.array(str).optional(),
  status: str.optional(),
  serialNumber: str.optional(),
  tags: z.array(str).optional(),
}).strict();

const mediaItem = z.object({
  url,
  thumbnailUrl: url.optional(),
  alt: str.optional(),
  date: str.optional(),
  caption: str.optional(),
  poster: url.optional(),
  kind: z.enum(["file", "youtube"]).optional(),
}).strict();

export const eventRecordSchema = z.object({
  ...base,
  categories: z.array(str).optional(),
  galleryCategories: z.array(str).optional(),
  organisation: str.optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  when: str.optional(),
  location: str.optional(),
  mode: str.optional(),
  status: str.optional(),
  organizer: str.optional(),
  email: str.optional(),
  mobile: str.optional(),
  totalHours: str.optional(),
  descriptionHtml: str.optional(),
  pdfUrl: url.optional(),
  pdfUrlHi: url.optional(),
  imageUrl: url.optional(),
  photos: z.array(mediaItem).optional(),
  videos: z.array(mediaItem).optional(),
  links: z.array(url).optional(),
}).strict();

export const galleryRecordSchema = z.object({
  ...base,
  type: str.optional(),
  categories: z.array(str).optional(),
  organisation: str.optional(),
  description: str.optional(),
  source: str.optional(),
  sourceLink: url.optional(),
  imageUrl: url.optional(),
  thumbnailUrl: url.optional(),
  images: z.array(mediaItem).optional(),
  videos: z.array(mediaItem).optional(),
}).strict();

export const officialRecordSchema = z.object({
  ...base,
  officialType: str.optional(),
  organisation: str.optional(),
  organisationName: str.optional(),
  organisationUrl: url.optional(),
  designation: str.optional(),
  designationTerms: z.array(str).optional(),
  group: str.optional(),
  commission: str.optional(),
  imageUrl: url.optional(),
  tenure: str.optional(),
  intercom: str.optional(),
  phoneOffice: str.optional(),
  phoneResidence: str.optional(),
  email: str.optional(),
  address: str.optional(),
  socialLinks: z.array(url).optional(),
  workAllocationHtml: str.optional(),
  additionalInfoHtml: str.optional(),
  menuOrder: z.number().optional(),
}).strict();

export const cpioRecordSchema = z.object({
  ...base,
  organisation: str.optional(),
  office: str.optional(),
  name: str.optional(),
  designation: str.optional(),
  email: str.optional(),
}).strict();

const labelledFile = z.object({ label: str.optional(), url, fileType: str.optional() }).strict();

export const bookingRecordSchema = z.object({
  ...base,
  category: str.optional(),
  description: str.optional(),
  rating: str.optional(),
  rates: z.array(z.object({ label: str.optional(), rate: str.optional() }).strict()).optional(),
  note: str.optional(),
  contacts: z.array(z.object({ email: str.optional(), phone: str.optional() }).strict()).optional(),
  imageUrl: url.optional(),
  images: z.array(url).optional(),
  documents: z.array(labelledFile).optional(),
}).strict();

export const updateRecordSchema = z.object({
  ...base,
  status: str.optional(),
  organisation: str.optional(),
  bodyHtml: str.optional(),
  attachments: z.array(labelledFile).optional(),
  videos: z.array(mediaItem).optional(),
}).strict();

export const sewerCaseRecordSchema = z.object({
  ...base,
  name: str,
  state: str.optional(),
  district: str.optional(),
  dateOfDeath: str.optional(),
  paymentStatus: str.optional(),
  amount: str.optional(),
  amountInr: z.number().optional(),
}).strict();
