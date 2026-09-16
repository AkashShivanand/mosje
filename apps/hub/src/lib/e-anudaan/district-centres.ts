/**
 * Where a district is, for the two things a project move needs without a map service:
 *
 *   - "Use Current Location" names the district, its headquarters town and PIN from the position
 *     the browser reports, so the applicant only adds the building and street;
 *   - the PMU is told when the position recorded with a request is far from the project's own
 *     district. A position in Pune was accepted for a Delhi project without a word (verify bug 8,
 *     16 Sep 2026).
 *
 * The prototype calls no geocoding service, so this is a bundled lookup of the districts the
 * register holds projects in: each district headquarters' approximate coordinates, its head post
 * office PIN, and a radius that roughly covers the district. A district not listed here cannot be
 * checked, and the screens say so rather than guessing.
 *
 * Coordinates are the headquarters towns' published positions, rounded to four places; radii are
 * deliberately generous (a false "far away" flag costs a PMU officer's time, a missed one only
 * returns the request to the check it would have had anyway).
 */

export interface DistrictCentre {
  state: string;
  district: string;
  /** The district headquarters town. */
  headquarters: string;
  pin: string;
  lat: number;
  lng: number;
  /** Roughly how far the district reaches from its headquarters, in km. */
  radiusKm: number;
}

export const DISTRICT_CENTRES: readonly DistrictCentre[] = [
  { state: "Delhi", district: "North West Delhi", headquarters: "Kanjhawala", pin: "110081", lat: 28.7041, lng: 77.1025, radiusKm: 20 },
  { state: "Delhi", district: "South East Delhi", headquarters: "Defence Colony", pin: "110024", lat: 28.5672, lng: 77.26, radiusKm: 15 },
  { state: "Gujarat", district: "Ahmedabad", headquarters: "Ahmedabad", pin: "380001", lat: 23.0225, lng: 72.5714, radiusKm: 60 },
  { state: "Tamil Nadu", district: "Kallakurichi", headquarters: "Kallakurichi", pin: "606202", lat: 11.7384, lng: 78.9639, radiusKm: 50 },
  { state: "Tamil Nadu", district: "Madurai", headquarters: "Madurai", pin: "625001", lat: 9.9252, lng: 78.1198, radiusKm: 50 },
  { state: "Uttar Pradesh", district: "Barabanki", headquarters: "Nawabganj", pin: "225001", lat: 26.926, lng: 81.188, radiusKm: 50 },
  { state: "Uttar Pradesh", district: "Hardoi", headquarters: "Hardoi", pin: "241001", lat: 27.3965, lng: 80.1311, radiusKm: 60 },
  { state: "Maharashtra", district: "Pune", headquarters: "Pune", pin: "411001", lat: 18.5204, lng: 73.8567, radiusKm: 80 },
  { state: "Maharashtra", district: "Thane", headquarters: "Thane", pin: "400601", lat: 19.2183, lng: 72.9781, radiusKm: 50 },
  { state: "Rajasthan", district: "Jaipur", headquarters: "Jaipur", pin: "302001", lat: 26.9124, lng: 75.7873, radiusKm: 70 },
  { state: "Karnataka", district: "Belagavi", headquarters: "Belagavi", pin: "590001", lat: 15.8497, lng: 74.4977, radiusKm: 80 },
  { state: "Madhya Pradesh", district: "Rewa", headquarters: "Rewa", pin: "486001", lat: 24.5362, lng: 81.3037, radiusKm: 60 },
  { state: "Odisha", district: "Koraput", headquarters: "Koraput", pin: "764020", lat: 18.811, lng: 82.7105, radiusKm: 70 },
];

/** Great-circle distance in km (haversine). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function centreOf(state: string, district: string): DistrictCentre | undefined {
  return DISTRICT_CENTRES.find((c) => c.state === state && c.district === district);
}

/** The listed district a position falls inside, if any — the nearest one whose radius reaches it. */
export function districtAt(lat: number, lng: number): (DistrictCentre & { km: number }) | undefined {
  return DISTRICT_CENTRES.map((c) => ({ ...c, km: distanceKm({ lat, lng }, c) }))
    .filter((c) => c.km <= c.radiusKm)
    .sort((a, b) => a.km - b.km)[0];
}

export type LocationCheck =
  /** No coordinates were recorded with the request. */
  | { kind: "no-position" }
  /** The project's district is not in the bundled lookup. */
  | { kind: "unchecked" }
  | { kind: "within"; km: number; centre: DistrictCentre }
  /** Outside the project's district. `nearest` names where the position does fall, when listed. */
  | { kind: "far"; km: number; centre: DistrictCentre; nearest?: DistrictCentre };

/** Is a recorded position inside the project's own district? */
export function checkLocation(
  project: { state: string; district: string },
  position: { latitude?: number; longitude?: number },
): LocationCheck {
  if (position.latitude === undefined || position.longitude === undefined) return { kind: "no-position" };
  const centre = centreOf(project.state, project.district);
  if (!centre) return { kind: "unchecked" };
  const km = Math.round(distanceKm({ lat: position.latitude, lng: position.longitude }, centre));
  if (km <= centre.radiusKm) return { kind: "within", km, centre };
  return { kind: "far", km, centre, nearest: districtAt(position.latitude, position.longitude) };
}

/** "about 1,160 km from North West Delhi" */
export function farLine(check: Extract<LocationCheck, { kind: "far" }>): string {
  const where = check.nearest ? ` It falls in ${check.nearest.district}, ${check.nearest.state}.` : "";
  return `The recorded position is about ${check.km.toLocaleString("en-IN")} km from ${check.centre.district}, outside the project's district.${where}`;
}

/**
 * What "Use Current Location" can fill without a map service: the locality line for the district
 * the position is in, when that is the project's own district. The building and street stay the
 * applicant's to add. `undefined` when the position is not in the project's district or the
 * district is not listed — the caller then fills nothing and says why.
 */
export function addressFromPosition(project: { state: string; district: string }, lat: number, lng: number): string | undefined {
  const check = checkLocation(project, { latitude: lat, longitude: lng });
  if (check.kind !== "within") return undefined;
  const c = check.centre;
  const town = c.headquarters === c.district ? "" : `${c.headquarters}, `;
  return `${town}${c.district}, ${c.state} ${c.pin}`;
}
