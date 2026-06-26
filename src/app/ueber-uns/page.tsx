import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

export const metadata = { title: "Über uns" };

export default function UeberUnsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-grey mb-6">Über uns</h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
          <Image
            src="/images/werkstatt.jpg"
            alt="Kfz-Prüfstelle"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4 text-brand-grey/85 leading-relaxed">
          <p>
            Willkommen bei <strong>{BUSINESS.name}</strong> – Ihrem
            GTÜ-Vertragspartner und Kfz-Prüfstelle in Wesseling.
          </p>
          <p>
            Als Ingenieur- und Sachverständigenbüro führen wir amtliche
            Hauptuntersuchungen (HU) und Abgasuntersuchungen (AU) für alle
            Fahrzeugklassen durch. Unser erfahrenes Team steht Ihnen mit
            Kompetenz und Zuverlässigkeit zur Seite.
          </p>
          <p>
            „Mehr Service für Sicherheit" – das ist unser Anspruch. Mit der
            Online-Terminbuchung möchten wir Ihnen den Besuch so angenehm wie
            möglich gestalten.
          </p>
        </div>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        {[
          { title: "Kompetenz", text: "Erfahrene Prüfingenieure mit langjähriger Expertise." },
          { title: "Zuverlässigkeit", text: "Termingerechte Prüfungen ohne lange Wartezeiten." },
          { title: "Service", text: "Persönliche Beratung und Online-Terminbuchung." },
        ].map((item) => (
          <div key={item.title} className="rounded-lg bg-brand-light p-5">
            <h3 className="font-semibold text-brand mb-1">{item.title}</h3>
            <p className="text-sm text-brand-grey/80">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/termin" className="text-brand font-semibold hover:underline">
          Jetzt Termin vereinbaren →
        </Link>
      </div>
    </div>
  );
}
