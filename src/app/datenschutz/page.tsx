import { BUSINESS } from "@/lib/constants";

export const metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-grey mb-6">
        Datenschutzerklärung
      </h1>

      <div className="space-y-6 text-sm text-brand-grey/85 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-brand-grey mb-2">
            1. Verantwortlicher
          </h2>
          <p>
            {BUSINESS.name}
            <br />
            {BUSINESS.address}, {BUSINESS.city}
            <br />
            Telefon: {BUSINESS.phone}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-grey mb-2">
            2. Online-Terminbuchung
          </h2>
          <p>
            Bei der Online-Terminbuchung erheben wir folgende personenbezogene
            Daten: Name, Telefonnummer, E-Mail-Adresse sowie die gewählte
            Leistungsart. Diese Daten werden ausschließlich zur Terminverwaltung
            und Kommunikation mit Ihnen verwendet.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-grey mb-2">
            3. E-Mail-Benachrichtigungen
          </h2>
          <p>
            Nach der Buchung erhalten Sie eine Bestätigungs-E-Mail. Über Links in
            der E-Mail können Sie Ihren Termin bis 1 Stunde vorher ändern oder
            stornieren.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-grey mb-2">
            4. Speicherdauer
          </h2>
          <p>
            Termindaten werden so lange gespeichert, wie es für die
            Terminverwaltung erforderlich ist, und anschließend gelöscht, sofern
            keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-grey mb-2">
            5. Ihre Rechte
          </h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und
            Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Wenden
            Sie sich hierzu an uns unter der oben genannten Kontaktadresse.
          </p>
        </section>
      </div>

      <p className="text-xs text-brand-grey/60 mt-8">
        Platzhalter – bitte vor Go-Live von einem Anwalt prüfen lassen.
      </p>
    </div>
  );
}
