import Image from "next/image";
import Link from "next/link";

export function PortalBanner() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <Link
          href="/website/samavesh-citizen-portals"
          className="block overflow-hidden rounded-xl"
          aria-label="Explore the SAMAVESH citizen portal"
        >
          <Image
            src="/website/images/portal-banner-images.png"
            alt="SAMAVESH citizen portal banner"
            width={1280}
            height={320}
            className="hidden h-auto w-full rounded-xl object-cover md:block"
          />
          <Image
            src="/website/images/Samavesh-Banner-Mobile.png"
            alt="SAMAVESH citizen portal banner"
            width={640}
            height={800}
            className="h-auto w-full rounded-xl object-cover md:hidden"
          />
        </Link>
      </div>
    </section>
  );
}
