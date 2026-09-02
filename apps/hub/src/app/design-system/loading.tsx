/**
 * The documentation's own loading state.
 *
 * A skeleton in the SHAPE of a documentation page — a title, a summary measure,
 * and a specimen well — rather than a spinner in a void, so the layout does not
 * move when the page arrives. `role="status"` tells a screen reader the wait is
 * deliberate; without it the segment is simply silent while it loads.
 */
export default function DesignSystemLoading() {
  return (
    <article className="docs-article cdp" role="status" aria-label="Loading the page">
      <span className="ds-sr-only">Loading the documentation page</span>
      <header className="cdp__header" aria-hidden="true">
        <div className="cdp-skel cdp-skel--title" />
        <div className="cdp-skel cdp-skel--line" />
        <div className="cdp-skel cdp-skel--line cdp-skel--short" />
      </header>
      <div className="cdp__section" aria-hidden="true">
        <div className="cdp-skel cdp-skel--heading" />
        <div className="cdp-skel cdp-skel--specimen" />
      </div>
    </article>
  );
}
