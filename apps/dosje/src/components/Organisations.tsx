import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@mosje/design-system";

interface Organisation {
  abbr: string;
  name: string;
  href: string;
}

const organisations: Organisation[] = [
  {
    abbr: "NCSC",
    name: "National Commission for Scheduled Castes",
    href: "/organisation/national-commission-for-scheduled-castes",
  },
  {
    abbr: "NCSK",
    name: "National Commission for Safai Karamcharis",
    href: "/organisation/national-commission-for-safai-karamcharis",
  },
  {
    abbr: "NCBC",
    name: "National Commission for Backward Classes",
    href: "/organisation/national-commission-for-backward-classes-ncbc",
  },
  {
    abbr: "DWBDNC",
    name: "Development and Welfare Board for De-notified, Nomadic, and Semi-Nomadic Communities",
    href: "/organisation/development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
  },
  {
    abbr: "SCW",
    name: "Senior Citizens Welfare",
    href: "/organisation/senior-citizens-welfarescw",
  },
  {
    abbr: "PM-AJAY",
    name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna",
    href: "/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay",
  },
  {
    abbr: "SMILE",
    name: "National Portal for Transgender Persons",
    href: "/organisation/national-portal-for-transgender-persons",
  },
  {
    abbr: "NOS",
    name: "National Overseas Scholarship",
    href: "/organisation/national-overseas-scholarship",
  },
  {
    abbr: "NMBA",
    name: "Nasha Mukt Bharat Abhiyaan",
    href: "/organisation/nasha-mukt-bharat-abhiyaan",
  },
  {
    abbr: "NSFDC",
    name: "National Scheduled Castes Finance and Development Corporation",
    href: "/organisation/national-scheduled-castes-finance-and-development-corporation",
  },
  {
    abbr: "NSKFDC",
    name: "National Safai Karamcharis Finance and Development Corporation",
    href: "/organisation/national-safai-karamcharis-finance-development-corporation",
  },
  {
    abbr: "NBCFDC",
    name: "National Backward Classes Finance and Development Corporation",
    href: "/organisation/national-backward-classes-financeand-development-corporationnbcfdc",
  },
];

export function Organisations() {
  return (
    <section className="bg-[#f9fafb]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-gov-blue-dark">
            Our Organisations
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[16px] text-ink-muted">
            The Ministry of Social Justice and Empowerment works through key
            organisations that drive social inclusion, economic empowerment, and
            equal opportunity across India.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {organisations.map((org) => (
            <li key={org.abbr}>
              <Link href={org.href} className="group block h-full">
                <Card className="flex h-full items-start gap-3 p-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-gov-blue px-1 text-center text-[11px] font-bold leading-none text-white">
                    {org.abbr}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[14px] font-medium leading-snug text-ink">
                      {org.name}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 flex-none text-gray-400 transition-colors group-hover:text-gov-blue" />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
