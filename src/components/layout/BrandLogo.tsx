import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  variant?: "header" | "footer";
  asLink?: boolean;
};

export function BrandLogo({ variant = "header", asLink = true }: BrandLogoProps) {
  const isFooter = variant === "footer";

  const content = (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <Image
        src="/daitan-logo.svg"
        alt="Daitan Engineering"
        width={154}
        height={52}
        className={`w-auto shrink-0 ${
          isFooter
            ? "h-9 sm:h-10 brightness-0 invert"
            : "h-8 sm:h-9"
        }`}
        priority={!isFooter}
      />
      <div
        className={`shrink-0 ${isFooter ? "bg-white/10 rounded-md p-1.5" : "border border-brand-muted/30 rounded-md p-1 bg-brand-light/30"}`}
        title="GTÜ-Vertragspartner"
      >
        <Image
          src={isFooter ? "/gtu-logo-white.svg" : "/gtu-logo.svg"}
          alt="GTÜ Vertragspartner"
          width={72}
          height={28}
          className="h-5 sm:h-6 w-auto"
        />
      </div>
    </div>
  );

  if (!asLink) return content;

  return (
    <Link href="/" className="flex items-center shrink-0 -ml-1 sm:-ml-2">
      {content}
    </Link>
  );
}
