import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@mosje/design-system";

export function SamaveshBanner() {
  return (
    <section className="bg-saffron text-white">
      <div className="mx-auto flex min-h-[76px] max-w-[1280px] flex-wrap items-center gap-4 px-4 py-2">
        <Image
          src="/images/samavesh.png"
          alt="SAMAVESH"
          width={120}
          height={48}
          className="h-12 w-auto"
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
        <Button
          href="/samavesh-citizen-portals"
          variant="success"
          appearance="filled"
          size="sm"
          iconRight={<ArrowRight className="h-4 w-4" />}
          className="ml-auto"
        >
          Explore
        </Button>
      </div>
    </section>
  );
}
