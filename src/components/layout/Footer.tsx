import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { BUSINESS, OPENING_HOURS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-brand-grey text-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <Image
            src="/gtu-logo-white.svg"
            alt="GTÜ Logo"
            width={140}
            height={28}
            className="mb-4 -ml-1"
          />
          <p className="text-sm text-white/80 leading-relaxed">
            {BUSINESS.name}
            <br />
            {BUSINESS.subtitle}
            <br />
            Ihr Partner für amtliche Kfz-Prüfungen in Wesseling.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Kontakt</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>
                {BUSINESS.address}
                <br />
                {BUSINESS.city}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <a href={`tel:${BUSINESS.phoneLink}`} className="hover:text-white">
                {BUSINESS.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">
                {BUSINESS.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <span className="leading-relaxed">
                {OPENING_HOURS.map((row) => (
                  <span key={row.days} className="block">
                    {row.days}: {row.hours}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Links</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link href="/leistungen" className="hover:text-white">
                Leistungen
              </Link>
            </li>
            <li>
              <Link href="/termin" className="hover:text-white">
                Online-Termin
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-white">
                Anfahrt
              </Link>
            </li>
            <li>
              <Link href="/impressum" className="hover:text-white">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-white">
                Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 text-center text-xs text-white/60 py-4">
        © {new Date().getFullYear()} {BUSINESS.name}. GTÜ-Vertragspartner.
      </div>
    </footer>
  );
}
