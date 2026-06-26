import { SERVICES } from "@/lib/constants";
import Link from "next/link";

export const metadata = { title: "Leistungen" };

export default function LeistungenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-grey mb-2">Unsere Leistungen</h1>
      <p className="text-brand-grey/80 mb-10 max-w-2xl">
        Als GTÜ-Vertragspartner bieten wir ein umfassendes Spektrum an amtlichen
        und sachverständigen Leistungen rund ums Kfz.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {SERVICES.map((s) => (
          <article
            key={s.title}
            className="rounded-xl border border-brand-muted/40 p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-brand mb-2">{s.title}</h2>
            <p className="text-brand-grey/80 text-sm leading-relaxed">{s.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-brand-light p-8 text-center">
        <h2 className="text-xl font-bold text-brand-grey mb-2">
          HU / AU Termin vereinbaren
        </h2>
        <p className="text-sm text-brand-grey/80 mb-4">
          Buchen Sie Ihren Wunschtermin online – einfach und schnell.
        </p>
        <Link
          href="/termin"
          className="inline-block rounded-md bg-brand px-6 py-3 text-white font-semibold hover:bg-brand-dark"
        >
          Online-Termin buchen
        </Link>
      </div>
    </div>
  );
}
