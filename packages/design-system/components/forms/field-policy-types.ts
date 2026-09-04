/**
 * Which side of the required/optional divide a form marks.
 *
 * - `required` — mark the mandatory fields with an asterisk. Right when most of
 *   the form is optional.
 * - `optional` — mark the optional fields with the word "optional" and leave
 *   the mandatory ones bare. Right when most of the form is mandatory, which on
 *   this estate is nearly every form: asterisking forty of forty-two fields
 *   marks nothing, it just adds forty asterisks.
 * - `none` — mark neither. Only defensible when every field is mandatory AND
 *   the form says so once, in prose, above the fields.
 *
 * In its own file because `field-copy.ts` needs it and `field-policy.tsx` needs
 * the copy — a cycle if either owned both.
 */
export type NecessityIndicator = "required" | "optional" | "none";
