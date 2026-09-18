// Rich collection kinds: how each one's page is parsed, transformed and validated.
import {
  parseDocumentPage, parseEventPage, parseGalleryPage, parseOfficialPage,
  parseCpioPage, parseBookingPage, parseUpdateContent, parseSewerCasePage,
} from "./detail-extract.mjs";
import {
  transformDocumentRecord, transformEventRecord, transformGalleryRecord, transformOfficialRecord,
  transformCpioRecord, transformBookingRecord, transformUpdateRecord, transformSewerCaseRecord,
} from "./transform.mjs";
import {
  documentRecordSchema, eventRecordSchema, galleryRecordSchema, officialRecordSchema,
  cpioRecordSchema, bookingRecordSchema, updateRecordSchema, sewerCaseRecordSchema,
} from "./schema.mjs";

// detail: "page"    — fetch the record's public page and run parsePage(html)
//         "content" — parse the REST `content.rendered` (no page fetch)
//         "listing" — documents: the library listing, with page fallback
export const KINDS = {
  document: { detail: "page", parsePage: parseDocumentPage, transform: transformDocumentRecord, schema: documentRecordSchema },
  event: { detail: "page", parsePage: parseEventPage, transform: transformEventRecord, schema: eventRecordSchema, media: true },
  gallery: { detail: "page", parsePage: parseGalleryPage, transform: transformGalleryRecord, schema: galleryRecordSchema, media: true },
  official: { detail: "page", parsePage: parseOfficialPage, transform: transformOfficialRecord, schema: officialRecordSchema, media: true },
  cpio: { detail: "page", parsePage: parseCpioPage, transform: transformCpioRecord, schema: cpioRecordSchema },
  booking: { detail: "page", parsePage: parseBookingPage, transform: transformBookingRecord, schema: bookingRecordSchema, media: true },
  update: { detail: "content", parseContent: parseUpdateContent, transform: transformUpdateRecord, schema: updateRecordSchema },
  "sewer-case": { detail: "page", parsePage: parseSewerCasePage, transform: transformSewerCaseRecord, schema: sewerCaseRecordSchema },
};
