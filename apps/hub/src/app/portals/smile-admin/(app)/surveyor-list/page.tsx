"use client";

import SurveyorsPage from "../surveyors/page";

/**
 * The live portal serves the same Surveyors register at `/surveyor-list` and at
 * `/surveyors`. It renders the screen rather than redirecting, because a
 * redirect would change the address in the reader's bar and break a bookmark
 * the live portal honours.
 */
export default function Page() {
  return <SurveyorsPage />;
}
