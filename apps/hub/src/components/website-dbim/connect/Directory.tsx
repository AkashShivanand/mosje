import { getDbimDirectory } from "@/lib/website-dbim/connect";
import { DirectoryList } from "./DirectoryList";
import "./connect.css";

/**
 * The Department's telephone directory in the DBIM design — the reference's
 * /connect/directory (and /ministry/directory, which is the same list).
 *
 * Reads the register on the server (`getOfficialsByOrganisation("MoSJE")`, 162
 * officers) and hands the client leaf only the fields it prints. Loading and error
 * cannot occur: the register is imported JSON resolved at render.
 */
export function DbimDirectory() {
  return <DirectoryList rows={getDbimDirectory()} />;
}
