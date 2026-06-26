"use client";

import { useCallback, useEffect, useState } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  startOfDay,
} from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { SERVICES } from "@/lib/constants";

type Step = "date" | "time" | "form" | "done";

export function BookingWidget() {
  const [step, setStep] = useState<Step>("date");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    serviceType: "",
  });

  const loadMonth = useCallback(async (date: Date) => {
    const res = await fetch(
      `/api/availability/month?year=${date.getFullYear()}&month=${date.getMonth() + 1}`,
    );
    const data = await res.json();
    setOpenDays(new Set(data.openDays || []));
  }, []);

  useEffect(() => {
    loadMonth(currentMonth);
  }, [currentMonth, loadMonth]);

  async function selectDate(dateStr: string) {
    setSelectedDate(dateStr);
    setLoading(true);
    setError("");
    const res = await fetch(`/api/availability/slots?date=${dateStr}`);
    const data = await res.json();
    setSlots(data.slots || []);
    setLoading(false);
    if ((data.slots || []).length === 0) {
      setError("An diesem Tag sind keine Termine verfügbar.");
    } else {
      setStep("time");
    }
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        date: selectedDate,
        startTime: selectedTime,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Fehler bei der Buchung.");
      return;
    }
    setStep("done");
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const today = startOfDay(new Date());

  return (
    <div className="rounded-xl border border-brand-muted/40 bg-white shadow-sm overflow-hidden">
      <div className="bg-brand text-white px-6 py-4">
        <h2 className="font-semibold text-lg">Online-Terminbuchung</h2>
        <p className="text-sm text-white/85">30 Minuten pro Termin</p>
      </div>

      <div className="p-4 sm:p-6">
        {step === "date" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                className="p-2 hover:bg-brand-light rounded"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: de })}
              </span>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-brand-light rounded"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-brand-grey/60 mb--2">
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
                <div key={d} className="py-1 font-medium">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: (days[0].getDay() + 6) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isPast = isBefore(day, today);
                const isOpen = openDays.has(dateStr) && !isPast;
                const inMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={dateStr}
                    disabled={!isOpen || !inMonth}
                    onClick={() => isOpen && selectDate(dateStr)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      !inMonth
                        ? "invisible"
                        : isOpen
                          ? "bg-brand-light hover:bg-brand hover:text-white text-brand-grey cursor-pointer"
                          : "text-brand-muted/50 cursor-not-allowed"
                    }`}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === "time" && (
          <>
            <button
              onClick={() => setStep("date")}
              className="text-sm text-brand mb-4 hover:underline"
            >
              ← Anderes Datum wählen
            </button>
            <p className="font-medium mb-3 capitalize">
              {selectedDate &&
                format(parseDate(selectedDate), "EEEE, d. MMMM yyyy", {
                  locale: de,
                })}
            </p>

            {loading ? (
              <Loader2 className="animate-spin text-brand mx-auto" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      setSelectedTime(slot);
                      setStep("form");
                    }}
                    className="rounded-lg border border-brand-muted/50 py-2 text-sm font-medium hover:border-brand hover:bg-brand-light transition-colors"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {step === "form" && (
          <>
            <button
              onClick={() => setStep("time")}
              className="text-sm text-brand mb-4 hover:underline"
            >
              ← Andere Uhrzeit wählen
            </button>
            <p className="text-sm text-brand-grey/80 mb-4">
              {selectedDate && format(parseDate(selectedDate), "dd.MM.yyyy")} um{" "}
              {selectedTime} Uhr
            </p>

            <form onSubmit={submitBooking} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Vorname *"
                  value={form.firstName}
                  onChange={(v) => setForm({ ...form, firstName: v })}
                  required
                />
                <Field
                  label="Nachname *"
                  value={form.lastName}
                  onChange={(v) => setForm({ ...form, lastName: v })}
                  required
                />
              </div>
              <Field
                label="Telefon *"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                required
              />
              <Field
                label="E-Mail *"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-brand-grey mb-1">
                  Leistungsart *
                </label>
                <select
                  required
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm({ ...form, serviceType: e.target.value })
                  }
                  className="w-full rounded-lg border border-brand-muted/50 px-3 py-2 text-sm"
                >
                  <option value="">Leistung wählen</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-brand py-3 text-white font-semibold hover:bg-brand-dark disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Termin verbindlich buchen
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-brand-grey mb-2">
              Termin bestätigt!
            </h3>
            <p className="text-sm text-brand-grey/80">
              Sie erhalten in Kürze eine Bestätigung per E-Mail.
            </p>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-grey mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-muted/50 px-3 py-2 text-sm"
      />
    </div>
  );
}

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
