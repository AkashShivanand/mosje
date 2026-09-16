/**
 * The shape of one changelog line, shared by the page, the pending-entry
 * reader and the release script.
 *
 * It lived inside `page.tsx` until 2026-09-16, which was fine while the page
 * was the only thing that knew about it. It is not any more: a branch now
 * writes a JSON file instead of editing the page, and `scripts/changelog-release.mjs`
 * folds those files into a numbered release. Three readers, one shape.
 */
export interface ChangeEntry {
  /**
   * `Breaking` was missing until 2026-09-02, so across ninety-four releases
   * nothing was ever marked as breaking — including the retirement of the
   * `--ds-*` token contract, which is the most severe change a token system can
   * make and which a consumer could only discover by their application
   * silently losing its styles. A changelog that cannot say what broke is a
   * list of news, not a release note.
   */
  kind: "Breaking" | "Added" | "Changed" | "Fixed" | "Removed";
  text: string;
  /** Required in spirit on `Breaking`: where a consumer goes to migrate. */
  migration?: string;
}

export interface Release {
  version: string;
  date: string;
  current?: boolean;
  changes: ChangeEntry[];
}

/** The five `kind` values, as data, so a script can validate against them. */
export const CHANGE_KINDS: ReadonlyArray<ChangeEntry["kind"]> = [
  "Breaking",
  "Added",
  "Changed",
  "Fixed",
  "Removed",
];

/** What the not-yet-numbered release is called on the page and in the anchor. */
export const UNRELEASED = "Unreleased";
