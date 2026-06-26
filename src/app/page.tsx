import Link from "next/link";
import Image from "next/image";
import { Shield, Clock, MapPin, Phone } from "lucide-react";
import { BUSINESS, SERVICES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <section className="relative bg-brand-grey text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Kfz-Werkstatt"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 md:py-32">
          <p className="text-brand text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
            {BUSINESS.tagline}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
            {BUSINESS.name}
          </h1>
          <p className="mt-2 text-base sm:text-lg text-white/90">{BUSINESS.subtitle} Wesseling</p>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-xl">
            Amtliche Hauptuntersuchung (HU/AU) – schnell, zuverlässig und mit
            Online-Terminbuchung.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/termin"
              className="rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark transition-colors text-center"
            >
              Jetzt Termin buchen
            </Link>
            <Link
              href="/leistungen"
              className="rounded-md border border-white/40 px-6 py-3 font-semibold hover:bg-white/10 transition-colors text-center"
            >
              Unsere Leistungen
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "GTÜ-Vertragspartner",
              text: "Amtliche Prüfungen im Namen der GTÜ – gleichwertig mit TÜV und DEKRA.",
            },
            {
              icon: Clock,
              title: "Online-Termin",
              text: "Buchen Sie Ihren Wunschtermin bequem online in 30-Minuten-Slots.",
            },
            {
              icon: MapPin,
              title: "Zentral in Wesseling",
              text: "Industriestraße 43 – gut erreichbar mit Parkplätzen vor Ort.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-brand-light bg-brand-light/50 p-6"
            >
              <Icon className="text-brand mb-3" size={28} />
              <h3 className="font-semibold text-brand-grey mb-2">{title}</h3>
              <p className="text-sm text-brand-grey/80">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-light py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-brand-grey mb-8 text-center">
            Unsere Leistungen im Überblick
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-lg p-5 shadow-sm border border-brand-muted/30 hover:border-brand/30 transition-colors"
              >
                <h3 className="font-semibold text-brand mb-1">{s.title}</h3>
                <p className="text-sm text-brand-grey/80">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/leistungen" className="text-brand font-semibold hover:underline">
              Alle Leistungen ansehen →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden">
          <Image
            src="/images/fahrzeugpruefung.jpg"
            alt="Fahrzeugprüfung"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brand-grey mb-4">
            Mehr Service für Sicherheit
          </h2>
          <p className="text-brand-grey/80 leading-relaxed mb-4">
            Als GTÜ-Vertragspartner führen wir amtliche Hauptuntersuchungen und
            Abgasuntersuchungen für alle Fahrzeugklassen durch. Unser erfahrenes
            Team sorgt für einen reibungslosen Ablauf – mit oder ohne Termin.
          </p>
          <p className="text-brand-grey/80 leading-relaxed mb-6">
            Mit der Online-Terminbuchung sparen Sie Wartezeit und können Ihren
            Besuch optimal planen.
          </p>
          <a
            href={`tel:${BUSINESS.phoneLink}`}
            className="inline-flex items-center gap-2 text-brand font-semibold"
          >
            <Phone size={18} />
            {BUSINESS.phone}
          </a>
        </div>
      </section>

      <section className="bg-brand text-white py-14">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Termin online buchen</h2>
          <p className="text-white/85 mb-6 max-w-lg mx-auto">
            Wählen Sie Datum und Uhrzeit – wir bestätigen Ihren Termin per E-Mail.
          </p>
          <Link
            href="/termin"
            className="inline-block rounded-md bg-white text-brand px-8 py-3 font-semibold hover:bg-brand-light transition-colors"
          >
            Zum Terminkalender
          </Link>
        </div>
      </section>
    </>
  );
}
