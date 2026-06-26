import { BookingWidget } from "@/components/booking/BookingWidget";
import { BUSINESS } from "@/lib/constants";

export const metadata = { title: "Online-Termin" };

export default function TerminPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-grey mb-2 text-center">
        Online-Termin buchen
      </h1>
      <p className="text-brand-grey/80 text-center mb-8 text-sm">
        Wählen Sie Datum, Uhrzeit und Leistungsart für Ihren Termin bei{" "}
        {BUSINESS.name}. Änderung oder Stornierung bis 1 Stunde vorher per
        E-Mail-Link möglich.
      </p>
      <BookingWidget />
    </div>
  );
}
