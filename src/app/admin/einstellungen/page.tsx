"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

type ScheduleDay = {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

type Holiday = { id: string; date: string; name: string };

export default function AdminEinstellungenPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (r.status === 401) router.push("/admin/login");
        return r.json();
      })
      .then((data) => {
        setEmail(data.settings?.businessEmail || "");
        setSchedule(data.schedule || []);
        setHolidays(data.holidays || []);
      });
  }, [router]);

  async function saveSettings() {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "settings", businessEmail: email }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function saveSchedule() {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "schedule", schedule }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addHoliday() {
    if (!newHoliday.date || !newHoliday.name) return;
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "holiday", ...newHoliday }),
    });
    setNewHoliday({ date: "", name: "" });
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    setHolidays(data.holidays || []);
  }

  async function deleteHoliday(id: string) {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "deleteHoliday", id }),
    });
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-brand-grey">Einstellungen</h1>

      {saved && (
        <p className="text-green-600 text-sm bg-green-50 rounded px-3 py-2">
          Gespeichert!
        </p>
      )}

      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold">Benachrichtigungs-E-Mail</h2>
        <input
          type="email"
          placeholder="info@beispiel.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={saveSettings}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Speichern
        </button>
      </section>

      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold">Standard-Öffnungszeiten</h2>
        {schedule.map((day, i) => (
          <div key={day.dayOfWeek} className="flex items-center gap-3 text-sm">
            <span className="w-8 font-medium">{DAY_NAMES[day.dayOfWeek]}</span>
            <input
              type="checkbox"
              checked={day.isOpen}
              onChange={(e) => {
                const next = [...schedule];
                next[i] = { ...day, isOpen: e.target.checked };
                setSchedule(next);
              }}
            />
            <input
              type="time"
              value={day.openTime}
              disabled={!day.isOpen}
              onChange={(e) => {
                const next = [...schedule];
                next[i] = { ...day, openTime: e.target.value };
                setSchedule(next);
              }}
              className="border rounded px-2 py-1"
            />
            <span>–</span>
            <input
              type="time"
              value={day.closeTime}
              disabled={!day.isOpen}
              onChange={(e) => {
                const next = [...schedule];
                next[i] = { ...day, closeTime: e.target.value };
                setSchedule(next);
              }}
              className="border rounded px-2 py-1"
            />
          </div>
        ))}
        <button
          onClick={saveSchedule}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Zeiten speichern
        </button>
      </section>

      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold">Feiertage & Schließtage</h2>
        <ul className="text-sm space-y-1 max-h-48 overflow-y-auto">
          {holidays.map((h) => (
            <li key={h.id} className="flex justify-between items-center py-1">
              <span>
                {new Date(h.date).toLocaleDateString("de-DE")} – {h.name}
              </span>
              <button
                onClick={() => deleteHoliday(h.id)}
                className="text-red-600 text-xs hover:underline"
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="date"
            value={newHoliday.date}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, date: e.target.value })
            }
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="text"
            placeholder="Bezeichnung"
            value={newHoliday.name}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, name: e.target.value })
            }
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={addHoliday}
            className="bg-brand text-white px-3 py-1 rounded text-sm"
          >
            +
          </button>
        </div>
      </section>
    </div>
  );
}
