import { BUSINESS } from "@/lib/constants";

export const metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-sm max-w-none">
      <h1 className="text-3xl font-bold text-brand-grey mb-6">Impressum</h1>

      <h2 className="text-lg font-semibold text-brand-grey mt-6">Angaben gemäß § 5 TMG</h2>
      <p className="text-brand-grey/80">
        {BUSINESS.name}
        <br />
        {BUSINESS.subtitle}
        <br />
        {BUSINESS.address}
        <br />
        {BUSINESS.city}
      </p>

      <h2 className="text-lg font-semibold text-brand-grey mt-6">Kontakt</h2>
      <p className="text-brand-grey/80">
        Telefon: {BUSINESS.phone}
        <br />
        E-Mail:{" "}
        <a href={`mailto:${BUSINESS.email}`} className="text-brand">
          {BUSINESS.email}
        </a>
        <br />
        Web: {BUSINESS.domain}
      </p>

      <h2 className="text-lg font-semibold text-brand-grey mt-6">Steuernummer</h2>
      <p className="text-brand-grey/80">{BUSINESS.taxNumber}</p>

      <h2 className="text-lg font-semibold text-brand-grey mt-6">
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
      </h2>
      <p className="text-brand-grey/80">
        {BUSINESS.name}
        <br />
        {BUSINESS.address}, {BUSINESS.city}
      </p>

      <h2 className="text-lg font-semibold text-brand-grey mt-6">Haftungsausschluss</h2>
      <p className="text-brand-grey/80 text-sm leading-relaxed">
        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
        Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
        keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG
        für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
        verantwortlich.
      </p>
    </div>
  );
}
