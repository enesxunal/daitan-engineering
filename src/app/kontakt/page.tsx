import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { BUSINESS, OPENING_HOURS } from "@/lib/constants";

export const metadata = { title: "Kontakt" };

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-grey mb-2">Kontakt & Anfahrt</h1>
      <p className="text-brand-grey/80 mb-10">
        So erreichen Sie {BUSINESS.name} – Ihre GTÜ Kfz-Prüfstelle in Wesseling.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex gap-4">
            <MapPin className="text-brand shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-semibold text-brand-grey">Adresse</h2>
              <p className="text-sm text-brand-grey/80 mt-1">
                {BUSINESS.name}
                <br />
                {BUSINESS.subtitle}
                <br />
                {BUSINESS.address}
                <br />
                {BUSINESS.city}
              </p>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand text-sm font-medium mt-2 inline-block hover:underline"
              >
                Route in Google Maps →
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <Phone className="text-brand shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-semibold text-brand-grey">Telefon</h2>
              <a
                href={`tel:${BUSINESS.phoneLink}`}
                className="text-sm text-brand-grey/80 hover:text-brand"
              >
                {BUSINESS.phone}
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <Mail className="text-brand shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-semibold text-brand-grey">E-Mail</h2>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="text-sm text-brand-grey/80 hover:text-brand"
              >
                {BUSINESS.email}
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock className="text-brand shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-semibold text-brand-grey">Öffnungszeiten</h2>
              <ul className="text-sm text-brand-grey/80 mt-1 space-y-1">
                {OPENING_HOURS.map((row) => (
                  <li key={row.days}>
                    {row.days}: {row.hours}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-80 md:h-full min-h-[320px] bg-brand-light">
          <iframe
            title="Standort Karte"
            src="https://maps.google.com/maps?q=Industriestraße+43,+50389+Wesseling&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
