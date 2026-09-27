import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimVacancyGrid } from "@/components/website-dbim/offerings/VacancyGrid";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { dbimVacancies } from "@/lib/website-dbim/offerings";
import "@/components/website-dbim/offerings/offerings.css";

export const metadata: Metadata = {
  title: "Vacancies | Department of Social Justice and Empowerment",
};

/** Offerings › Vacancies — circulars published in the last twelve months; older ones are in the Archives. */
export default function DbimVacanciesPage() {
  return (
    <DbimPage title="Vacancies" crumbs={[{ label: "Offerings", path: "/offerings" }]} path="/offerings/vacancies" tabs={DBIM_MENU[1]!.children}>
      <DbimVacancyGrid vacancies={dbimVacancies()} />
    </DbimPage>
  );
}
