import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";

export function SamaveshBanner() {
  return (
    <section className="bg-saffron text-white">
      <div className="sa-container flex min-h-[76px] flex-wrap items-center gap-4 py-2">
        <Image
          src="/website/images/samavesh.png"
          alt="SAMAVESH"
          width={120}
          height={120}
          className="h-12 w-auto"
          style={{ width: "auto" }}
        />
        <div className="flex items-center gap-4">
          <span className="text-[28px] font-semibold leading-none tracking-[0.5px]">
            SAMAVESH
          </span>
          <span className="hidden h-9 w-px bg-white/40 sm:block" />
          <span className="text-[15px] leading-snug">
            Single Access Mechanism for All Verticals of Empowerment &amp; Social
            Harmony
          </span>
        </div>
        <Link
          href="/website/samavesh-citizen-portals"
          className={buttonClasses("success", "filled", "sm", "ml-auto")}
        >
          Explore
          <span className="ds-btn__icon" aria-hidden="true"><Icon name="arrow_forward" size={16} /></span>
        </Link>
      </div>
    </section>
  );
}
