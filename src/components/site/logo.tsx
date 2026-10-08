import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/images";

export function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <Link href="/" aria-label="HRSAT home" className="inline-flex shrink-0 items-center">
      <Image src={img("logo")} alt="HRSAT — Human Rights Satellite" width={180} height={120} priority
        className={`${className} w-auto object-contain`} />
    </Link>
  );
}
