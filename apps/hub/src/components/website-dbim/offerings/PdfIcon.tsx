import { DbimIcon } from "../ui/icons";

/**
 * The file-type marker for tender and scheme document rows: the DBIM Visual Library's
 * "PDF" icon at 24px (DBIM 3.0 §3.4), painted in currentColor so the stylesheet binds
 * it to the key colour. Decorative: the file type is also printed beside it.
 */
export function DbimPdfIcon() {
  return <DbimIcon name="pdf" size={24} className="db-pdf-icon" />;
}
