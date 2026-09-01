/**
 * `jspdf-autotable` sets `lastAutoTable` on the jsPDF instance at runtime and
 * ships no type augmentation for it — `autoTable()` is declared as returning
 * `void`. Declaring it here turns an unchecked `as unknown as` cast into a
 * contract the compiler enforces, and puts the assumption somewhere the next
 * major upgrade will encounter it.
 *
 * `export.test.ts` asserts it is actually populated after a table is drawn.
 */
import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    /** Set by jspdf-autotable after each table it draws. */
    lastAutoTable?: { finalY?: number };
  }
}
