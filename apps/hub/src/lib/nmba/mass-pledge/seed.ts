// Seeded Mass Pledge submissions — the demo baseline.
//
// Covers every status (approved / pending at both tiers / returned), both
// verification tags, and all five reporter kinds, so the dashboard, approvals
// inbox and public counter all have something real to render on first load.
//
// Photographs: a prototype cannot ship real event photographs, so each seeded
// record carries a generated SVG tile that reads as a stand-in rather than a
// broken image. Photos attached through the UI are real uploads, downscaled by
// GeoPhotoInput. Nothing here is presented as an actual photograph of an event.

import type { GeoPhoto } from "@mosje/design-system";
import { EVENT_DATE } from "./masters";
import type { MassPledgeSubmission } from "./types";

/**
 * A labelled placeholder tile as a data-URL, so seeded galleries render as
 * something deliberate. Real uploads never go through here.
 */
function seedPhoto(
  id: string,
  caption: string,
  lat: number | null,
  lng: number | null,
  hue: number,
): GeoPhoto {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 42% 46%)"/><stop offset="1" stop-color="hsl(${hue + 24} 46% 32%)"/>
</linearGradient></defs>
<rect width="320" height="240" fill="url(#g)"/>
<circle cx="160" cy="96" r="30" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="4"/>
<path d="M104 150h112M104 172h78" stroke="rgba(255,255,255,.5)" stroke-width="6" stroke-linecap="round"/>
<text x="160" y="216" font-family="Noto Sans, sans-serif" font-size="13" fill="rgba(255,255,255,.9)" text-anchor="middle">${caption}</text>
</svg>`;
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return {
    id,
    thumbDataUrl: dataUrl,
    viewDataUrl: dataUrl,
    originalName: `${caption.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`,
    originalBytes: 2_400_000,
    mime: "image/jpeg",
    lat,
    lng,
    accuracyM: lat === null ? null : 12,
    source: lat === null ? "UNAVAILABLE" : "EXIF",
    capturedAt: `${EVENT_DATE}T11:20:00.000Z`,
  };
}

export const SEED_SUBMISSIONS: MassPledgeSubmission[] = [
  // ── Maharashtra: a full three-tier chain, ending approved ─────────────────
  {
    id: "mp-seed-001",
    reporterKind: "ADMIN_TIER",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T12:05:00.000Z`,
    state: "Maharashtra",
    district: "Pune",
    block: "Haveli",
    coordinatingMinistry: "Ministry of Social Justice & Empowerment",
    counts: { youth: 820, women: 410, others: 265 },
    photos: [
      seedPhoto("mp-seed-001-p1", "Haveli block pledge", 18.5204, 73.8567, 210),
      seedPhoto("mp-seed-001-p2", "Haveli school assembly", 18.5219, 73.8553, 196),
    ],
    reportingOfficerName: "Sunil Kamble",
    reportingOfficerDesignation: "Block Development Officer",
    contactNo: "9890005678",
    contactVerified: true,
    declarationAccepted: true,
    status: "APPROVED",
    verification: "VERIFIED",
    locationUnavailable: false,
    createdBy: "9890005678",
    history: [
      {
        at: `${EVENT_DATE}T12:05:00.000Z`,
        actorAccountId: "9890005678",
        actorDisplayName: "Sunil Kamble (Haveli BNO)",
        actorRole: "BLOCK",
        action: "SUBMITTED",
      },
      {
        at: `${EVENT_DATE}T14:40:00.000Z`,
        actorAccountId: "9890001234",
        actorDisplayName: "Anjali Desai (Pune DNO)",
        actorRole: "DISTRICT",
        action: "APPROVED",
      },
      {
        at: `${EVENT_DATE}T17:15:00.000Z`,
        actorAccountId: "9890123456",
        actorDisplayName: "Anjali Patil (Maharashtra SNO)",
        actorRole: "STATE",
        action: "APPROVED",
      },
    ],
  },

  // ── Sitting in the District inbox ─────────────────────────────────────────
  {
    id: "mp-seed-002",
    reporterKind: "ADMIN_TIER",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T13:22:00.000Z`,
    state: "Maharashtra",
    district: "Pune",
    block: "Mulshi",
    coordinatingMinistry: "Ministry of Social Justice & Empowerment",
    counts: { youth: 310, women: 180, others: 95 },
    photos: [seedPhoto("mp-seed-002-p1", "Mulshi gram sabha", 18.5089, 73.4903, 158)],
    reportingOfficerName: "Prakash Shinde",
    reportingOfficerDesignation: "Block Development Officer",
    contactNo: "9890005699",
    contactVerified: true,
    declarationAccepted: true,
    status: "PENDING_DISTRICT",
    verification: "VERIFIED",
    locationUnavailable: false,
    createdBy: "9890005699",
    history: [
      {
        at: `${EVENT_DATE}T13:22:00.000Z`,
        actorAccountId: "9890005699",
        actorDisplayName: "Prakash Shinde (Mulshi BNO)",
        actorRole: "BLOCK",
        action: "SUBMITTED",
      },
    ],
  },

  // ── Sitting in the State inbox ────────────────────────────────────────────
  {
    id: "mp-seed-003",
    reporterKind: "ADMIN_TIER",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T15:10:00.000Z`,
    state: "Maharashtra",
    district: "Pune",
    coordinatingMinistry: "Ministry of Social Justice & Empowerment",
    counts: { youth: 1240, women: 690, others: 430 },
    photos: [seedPhoto("mp-seed-003-p1", "Pune district event", 18.5204, 73.8567, 22)],
    reportingOfficerName: "Anjali Desai",
    reportingOfficerDesignation: "District Social Welfare Officer",
    contactNo: "9890001234",
    contactVerified: true,
    declarationAccepted: true,
    status: "PENDING_STATE",
    verification: "VERIFIED",
    locationUnavailable: false,
    createdBy: "9890001234",
    history: [
      {
        at: `${EVENT_DATE}T15:10:00.000Z`,
        actorAccountId: "9890001234",
        actorDisplayName: "Anjali Desai (Pune DNO)",
        actorRole: "DISTRICT",
        action: "SUBMITTED",
      },
    ],
  },

  // ── Returned with remarks, awaiting correction ────────────────────────────
  {
    id: "mp-seed-004",
    reporterKind: "ADMIN_TIER",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T11:48:00.000Z`,
    state: "Maharashtra",
    district: "Nashik",
    block: "Igatpuri",
    coordinatingMinistry: "Ministry of Youth Affairs & Sports",
    counts: { youth: 260, women: 140, others: 60 },
    photos: [seedPhoto("mp-seed-004-p1", "Igatpuri rally", null, null, 292)],
    reportingOfficerName: "Vaishali More",
    reportingOfficerDesignation: "Block Development Officer",
    contactNo: "9890005712",
    contactVerified: true,
    declarationAccepted: true,
    status: "RETURNED",
    verification: "VERIFIED",
    locationUnavailable: true,
    createdBy: "9890005712",
    history: [
      {
        at: `${EVENT_DATE}T11:48:00.000Z`,
        actorAccountId: "9890005712",
        actorDisplayName: "Vaishali More (Igatpuri BNO)",
        actorRole: "BLOCK",
        action: "SUBMITTED",
      },
      {
        at: `${EVENT_DATE}T16:02:00.000Z`,
        actorAccountId: "9890001299",
        actorDisplayName: "Ravi Pawar (Nashik DNO)",
        actorRole: "DISTRICT",
        action: "RETURNED",
        remarks:
          "The attached photograph carries no location and the youth figure looks high for a single block. Please re-attach a geo-tagged photograph and confirm the count.",
      },
    ],
  },

  // ── A State filing directly (top of chain, approved on submit) ────────────
  {
    id: "mp-seed-005",
    reporterKind: "ADMIN_TIER",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T18:30:00.000Z`,
    state: "Kerala",
    counts: { youth: 2450, women: 1380, others: 870 },
    photos: [seedPhoto("mp-seed-005-p1", "Kerala state function", 8.5241, 76.9366, 140)],
    reportingOfficerName: "Latha Menon",
    reportingOfficerDesignation: "Secretary, Social Justice Department",
    contactNo: "9847001122",
    contactVerified: true,
    declarationAccepted: true,
    status: "APPROVED",
    verification: "VERIFIED",
    locationUnavailable: false,
    createdBy: "9847001122",
    history: [
      {
        at: `${EVENT_DATE}T18:30:00.000Z`,
        actorAccountId: "9847001122",
        actorDisplayName: "Latha Menon (Kerala SNO)",
        actorRole: "STATE",
        action: "SUBMITTED",
      },
    ],
  },

  {
    id: "mp-seed-006",
    reporterKind: "ADMIN_TIER",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T17:55:00.000Z`,
    state: "Punjab",
    district: "Amritsar",
    block: "Ajnala",
    coordinatingMinistry: "Ministry of Health & Family Welfare",
    counts: { youth: 540, women: 300, others: 160 },
    photos: [seedPhoto("mp-seed-006-p1", "Ajnala block pledge", 31.844, 74.762, 258)],
    reportingOfficerName: "Harpreet Singh",
    reportingOfficerDesignation: "Block Development Officer",
    contactNo: "9815002233",
    contactVerified: true,
    declarationAccepted: true,
    status: "APPROVED",
    verification: "VERIFIED",
    locationUnavailable: false,
    createdBy: "9815002233",
    history: [
      {
        at: `${EVENT_DATE}T17:55:00.000Z`,
        actorAccountId: "9815002233",
        actorDisplayName: "Harpreet Singh (Ajnala BNO)",
        actorRole: "BLOCK",
        action: "SUBMITTED",
      },
      {
        at: `${EVENT_DATE}T19:10:00.000Z`,
        actorAccountId: "9815009900",
        actorDisplayName: "Manjit Kaur (Amritsar DNO)",
        actorRole: "DISTRICT",
        action: "APPROVED",
      },
      {
        at: `${EVENT_DATE}T20:05:00.000Z`,
        actorAccountId: "9815001100",
        actorDisplayName: "Gurdeep Sandhu (Punjab SNO)",
        actorRole: "STATE",
        action: "APPROVED",
      },
    ],
  },

  // ── The four non-geographic reporters: self-declared, no chain ────────────
  {
    id: "mp-seed-007",
    reporterKind: "LINE_MINISTRY",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T16:20:00.000Z`,
    entityName: "Ministry of Education",
    counts: { youth: 3200, women: 1450, others: 980 },
    photos: [seedPhoto("mp-seed-007-p1", "Ministry pledge ceremony", 28.6139, 77.209, 210)],
    reportingOfficerName: "Meera Raghavan",
    reportingOfficerDesignation: "Deputy Secretary",
    contactNo: "9810007001",
    contactVerified: true,
    declarationAccepted: true,
    status: "APPROVED",
    verification: "SELF_DECLARED",
    locationUnavailable: false,
    createdBy: "9810007001",
    history: [
      {
        at: `${EVENT_DATE}T16:20:00.000Z`,
        actorAccountId: "9810007001",
        actorDisplayName: "Meera Raghavan (Ministry of Education)",
        actorRole: "ENTITY",
        action: "SUBMITTED",
      },
    ],
  },

  {
    id: "mp-seed-008",
    reporterKind: "SPIRITUAL_ORG",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T14:05:00.000Z`,
    entityName: "Brahma Kumaris",
    counts: { youth: 1850, women: 2100, others: 640 },
    photos: [seedPhoto("mp-seed-008-p1", "Community pledge gathering", 24.5925, 72.7156, 34)],
    reportingOfficerName: "Devendra Joshi",
    reportingOfficerDesignation: "National Coordinator",
    contactNo: "9810007002",
    contactVerified: true,
    declarationAccepted: true,
    status: "APPROVED",
    verification: "SELF_DECLARED",
    locationUnavailable: false,
    createdBy: "9810007002",
    history: [
      {
        at: `${EVENT_DATE}T14:05:00.000Z`,
        actorAccountId: "9810007002",
        actorDisplayName: "Devendra Joshi (Brahma Kumaris)",
        actorRole: "ENTITY",
        action: "SUBMITTED",
      },
    ],
  },

  {
    id: "mp-seed-009",
    reporterKind: "HEI",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T13:40:00.000Z`,
    entityName: "Delhi University",
    counts: { youth: 4100, women: 1200, others: 380 },
    photos: [seedPhoto("mp-seed-009-p1", "Campus pledge", 28.6889, 77.2122, 176)],
    reportingOfficerName: "Ritu Sharma",
    reportingOfficerDesignation: "Dean of Student Welfare",
    contactNo: "9810007003",
    contactVerified: true,
    declarationAccepted: true,
    status: "APPROVED",
    verification: "SELF_DECLARED",
    locationUnavailable: false,
    createdBy: "9810007003",
    history: [
      {
        at: `${EVENT_DATE}T13:40:00.000Z`,
        actorAccountId: "9810007003",
        actorDisplayName: "Ritu Sharma (Delhi University)",
        actorRole: "ENTITY",
        action: "SUBMITTED",
      },
    ],
  },

  {
    id: "mp-seed-010",
    reporterKind: "GIA",
    eventDate: EVENT_DATE,
    submittedAt: `${EVENT_DATE}T12:50:00.000Z`,
    entityName: "Muktangan Rehabilitation Centre",
    counts: { youth: 140, women: 85, others: 60 },
    photos: [seedPhoto("mp-seed-010-p1", "Rehabilitation centre pledge", 18.5089, 73.8553, 118)],
    reportingOfficerName: "Anand Kulkarni",
    reportingOfficerDesignation: "Project Director",
    contactNo: "9810007004",
    contactVerified: true,
    declarationAccepted: true,
    status: "APPROVED",
    verification: "SELF_DECLARED",
    locationUnavailable: false,
    createdBy: "9810007004",
    history: [
      {
        at: `${EVENT_DATE}T12:50:00.000Z`,
        actorAccountId: "9810007004",
        actorDisplayName: "Anand Kulkarni (Muktangan Rehabilitation Centre)",
        actorRole: "ENTITY",
        action: "SUBMITTED",
      },
    ],
  },
];
