export function buildReport({ collection, sitemapCount, kept, skipped }) {
  const accounted = kept + skipped;
  const missing = Math.max(0, sitemapCount - accounted);
  return { collection, sitemapCount, kept, skipped, missing, ok: missing === 0 };
}

export function formatReport(reports) {
  const lines = ["", "Sync verification report", "========================"];
  for (const r of reports) {
    const status = r.ok ? "OK " : "GAP";
    lines.push(`[${status}] ${r.collection}: live ${r.sitemapCount}, kept ${r.kept}, skipped ${r.skipped}, missing ${r.missing}`);
  }
  return lines.join("\n");
}
