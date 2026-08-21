import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";

export function SamaveshJusticeBanner() {
  return (
    <section className="bg-[#f7f2ec] border-y border-amber-200/60 overflow-hidden">
      <div className="sa-container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-12">
          {/* Left Text */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <Image
                src="/website/images/samavesh.png"
                alt="SAMAVESH Emblem"
                width={48}
                height={48}
                className="h-10 w-auto"
              />
              <span className="text-[18px] font-bold tracking-wide text-amber-900">
                SAMAVESH
              </span>
            </div>

            <h2 className="mt-4 text-[34px] sm:text-[42px] font-extrabold leading-[1.1] text-[#2c1810] tracking-tight">
              Justice. Equality. Dignity.
            </h2>

            <p className="mt-3 text-[15px] sm:text-[17px] leading-relaxed text-[#4a3528] max-w-xl">
              SAMAVESH brings transparency, accountability, and seamless digital access to every scheme, scholarship, and empowerment vertical across India.
            </p>

            <div className="mt-6">
              <Link
                href="/website/samavesh-citizen-portals"
                className={buttonClasses("primary", "filled", "md", "bg-[#1e1b18] text-white hover:bg-black rounded-lg px-6 py-2.5")}
              >
                Explore
                <span className="ds-btn__icon" aria-hidden="true">
                  <Icon name="arrow_forward" size={16} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Citizen Group Photo */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg h-[260px] sm:h-[300px]">
              <Image
                src="/website/images/portal-banner-images.png"
                alt="Diverse Indian Citizens represented by SAMAVESH"
                fill
                className="object-contain object-right-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
