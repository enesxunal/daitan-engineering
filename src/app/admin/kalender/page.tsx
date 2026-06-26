"use client";

import { useCallback, useEffect, useState } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  isSameMonth,
} from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type DayInfo = {
  date: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  isClosedOverride: boolean;
  hasCustomHours: boolean;
  holiday: string | null;
};

export default function AdminKalenderPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [days, setDays] = useState<DayInfo[]>([]);
  const [selected, setSelected] = useState<DayInfo | null>(null);
  const [hours, setHours] = useState({ open: "09:00", close: "17:00" });

  const load = useCallback(async () => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1;
    const res = await fetch(`/api/admin/calendar?year=${y}&month=${m}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setIsMonthOpen(data.isMonthOpen);
    setDays(data.days || []);
  }, [currentMonth, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleMonth() {
    await fetch("/api/admin/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggleMonth",
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
        isOpen: !isMonthOpen,
      }),
    });
    load();
  }

  async function toggleDayClosed(date: string, closed: boolean) {
    await fetch("/api/admin/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setDayClosed", date, isClosed: closed }),
    });
    load();
    setSelected(null);
  }

  async function saveHours() {
    if (!selected) return;
    await fetch("/api/admin/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "setDayHours",
        date: selected.date,
        openTime: hours.open,
        closeTime: hours.close,
      }),
    });
    load();
    setSelected(null);
  }

  async function resetDay() {
    if (!selected) return;
    await fetch("/api/admin/calendar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resetDay", date: selected.date }),
    });
    load();
    setSelected(null);
  }

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const dayMap = new Map(days.map((d) => [d.date, d]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-grey">Kalender</h1>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isMonthOpen}
            onChange={toggleMonth}
            className="accent-brand"
          />
          Monat für Buchungen freigeben
        </label>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
              <ChevronLeft />
            </button>
            <span className="font-semibold capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: de })}
            </span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const info = dayMap.get(dateStr);
              const isOpen = info?.isOpen;
              const isHoliday = !!info?.holiday;

              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    if (info) {
                      setSelected(info);
                      setHours({
                        open: info.openTime || "09:00",
                        close: info.closeTime || "17:00",
                      });
                    }
                  }}
                  className={`aspect-square rounded-lg text-xs p-1 border transition-colors ${
                    !isSameMonth(day, currentMonth)
                      ? "invisible"
                      : isHoliday
                        ? "bg-orange-100 border-orange-300"
                        : isOpen
                          ? "bg-green-50 border-green-200 hover:border-brand"
                          : "bg-red-50 border-red-200"
                  } ${selected?.date === dateStr ? "ring-2 ring-brand" : ""}`}
                >
                  <div className="font-medium">{format(day, "d")}</div>
                  {info?.hasCustomHours && (
                    <div className="text-[10px] text-brand">Sonderzeit</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 text-xs text-brand-grey/70">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-50 border border-green-200" />
              Offen
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-50 border border-red-200" />
              Geschlossen
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-orange-100 border border-orange-300" />
              Feiertag
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          {selected ? (
            <div className="space-y-4">
              <h2 className="font-semibold">
                {format(new Date(selected.date), "dd.MM.yyyy", { locale: de })}
              </h2>
              {selected.holiday && (
                <p className="text-sm text-orange-600">Feiertag: {selected.holiday}</p>
              )}
              <p className="text-sm text-brand-grey/70">
                Standard: {selected.openTime} – {selected.closeTime}
              </p>

              <button
                onClick={() =>
                  toggleDayClosed(selected.date, !selected.isClosedOverride)
                }
                className="w-full rounded-lg border py-2 text-sm hover:bg-brand-light"
              >
                {selected.isClosedOverride ? "Tag öffnen" : "Tag schließen"}
              </button>

              <div className="space-y-2">
                <p className="text-sm font-medium">Sonderöffnungszeiten</p>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => setHours({ ...hours, open: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => setHours({ ...hours, close: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
                <button
                  onClick={saveHours}
                  className="w-full bg-brand text-white rounded-lg py-2 text-sm font-semibold"
                >
                  Zeiten speichern
                </button>
                <button
                  onClick={resetDay}
                  className="w-full text-sm text-brand-grey/70 hover:underline"
                >
                  Auf Standard zurücksetzen
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-grey/60">
              Wählen Sie einen Tag, um Öffnungszeiten anzupassen oder den Tag zu
              schließen.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
