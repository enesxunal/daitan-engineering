"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Loader2, XCircle } from "lucide-react";
import Link from "next/link";

export default function StornierenContent() {
  const token = useSearchParams().get("token");
  const [booking, setBooking] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Ungültiger Link.");
      setLoading(false);
      return;
    }
    fetch(`/api/bookings/cancel?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setBooking(data);
        setLoading(false);
      });
  }, [token]);

  async function cancel() {
    setLoading(true);
    const res = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error);
    else setDone(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <XCircle className="text-brand mx-auto mb-4" size={48} />
        <h1 className="text-xl font-bold mb-2">Termin storniert</h1>
        <p className="text-sm text-brand-grey/80 mb-6">
          Ihr Termin wurde erfolgreich storniert.
        </p>
        <Link href="/termin" className="text-brand font-semibold hover:underline">
          Neuen Termin buchen
        </Link>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-red-600">{error || "Termin nicht gefunden."}</p>
      </div>
    );
  }

  const date = new Date(booking.date as string);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-brand-grey mb-6">Termin stornieren</h1>
      <div className="rounded-lg border p-5 mb-6 text-sm space-y-1">
        <p>
          <strong>Name:</strong> {booking.firstName} {booking.lastName}
        </p>
        <p>
          <strong>Datum:</strong>{" "}
          {format(date, "EEEE, d. MMMM yyyy", { locale: de })}
        </p>
        <p>
          <strong>Uhrzeit:</strong> {booking.startTime} – {booking.endTime} Uhr
        </p>
        <p>
          <strong>Leistung:</strong> {booking.serviceType}
        </p>
      </div>
      <button
        onClick={cancel}
        className="w-full rounded-lg bg-brand py-3 text-white font-semibold hover:bg-brand-dark"
      >
        Termin endgültig stornieren
      </button>
    </div>
  );
}
