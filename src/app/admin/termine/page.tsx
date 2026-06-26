"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { getServiceLabel } from "@/lib/constants";

type Booking = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  serviceType: string;
};

export default function AdminTerminePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("CONFIRMED");

  useEffect(() => {
    fetch(`/api/admin/bookings?status=${filter}`)
      .then((r) => {
        if (r.status === 401) router.push("/admin/login");
        return r.json();
      })
      .then(setBookings);
  }, [filter, router]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-grey">Termine</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="CONFIRMED">Bestätigt</option>
          <option value="CANCELLED">Storniert</option>
          <option value="COMPLETED">Abgeschlossen</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-light">
            <tr>
              <th className="text-left p-3">Datum</th>
              <th className="text-left p-3">Zeit</th>
              <th className="text-left p-3">Kunde</th>
              <th className="text-left p-3">Kontakt</th>
              <th className="text-left p-3">Leistung</th>
              <th className="text-left p-3">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">
                  {format(new Date(b.date), "dd.MM.yyyy", { locale: de })}
                </td>
                <td className="p-3">
                  {b.startTime}–{b.endTime}
                </td>
                <td className="p-3">
                  {b.firstName} {b.lastName}
                </td>
                <td className="p-3">
                  <a href={`tel:${b.phone}`} className="block">
                    {b.phone}
                  </a>
                  <a href={`mailto:${b.email}`} className="text-brand text-xs">
                    {b.email}
                  </a>
                </td>
                <td className="p-3">{getServiceLabel(b.serviceType)}</td>
                <td className="p-3">
                  {b.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateStatus(b.id, "COMPLETED")}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      Erledigt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
