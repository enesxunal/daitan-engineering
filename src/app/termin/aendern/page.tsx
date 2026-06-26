"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

type BookingInfo = {
  date: string;
  startTime: string;
  serviceType: string;
  canModify: boolean;
};

function AendernContent() {
  const token = useSearchParams().get("token");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Ungültiger Link.");
      setLoading(false);
      return;
    }
    fetch(`/api/bookings/manage?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setBooking(data);
          if (!data.canModify) setError("Änderung nur bis 1 Stunde vorher möglich.");
        }
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (!newDate) return;
    fetch(`/api/availability/slots?date=${newDate}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []));
  }, [newDate]);

  async function submit() {
    setLoading(true);
    const res = await fetch("/api/bookings/manage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, date: newDate, startTime: newTime }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error);
    else setDone(true);
  }

  if (loading && !booking) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
        <h1 className="text-xl font-bold mb-2">Termin geändert</h1>
        <p className="text-sm text-brand-grey/80">
          Sie erhalten eine Bestätigung per E-Mail.
        </p>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/" className="text-brand hover:underline">
          Zur Startseite
        </Link>
      </div>
    );
  }

  const date = booking ? new Date(booking.date as string) : new Date();

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-brand-grey mb-6">Termin ändern</h1>

      <div className="rounded-lg border p-5 mb-6 text-sm space-y-1">
        <p>
          <strong>Aktuell:</strong>{" "}
          {format(date, "dd.MM.yyyy", { locale: de })} um {booking?.startTime} Uhr
        </p>
        <p>
          {booking?.serviceType}
        </p>
      </div>

      {error && booking && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      {booking?.canModify && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Neues Datum</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                setNewTime("");
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          {slots.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Neue Uhrzeit</label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewTime(s)}
                    className={`rounded-lg border py-2 text-sm ${
                      newTime === s
                        ? "border-brand bg-brand text-white"
                        : "hover:border-brand"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            disabled={!newDate || !newTime || loading}
            onClick={submit}
            className="w-full rounded-lg bg-brand py-3 text-white font-semibold hover:bg-brand-dark disabled:opacity-50"
          >
            Termin ändern
          </button>
        </div>
      )}
    </div>
  );
}

export default function AendernPage() {
  return (
    <Suspense>
      <AendernContent />
    </Suspense>
  );
}
