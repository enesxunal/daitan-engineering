export const BRAND = {
  red: "#DA1F3D",
  grey80: "#555555",
  grey60: "#888888",
  grey: "#C2C4C6",
  grey10: "#F2F2F2",
  white: "#FFFFFF",
} as const;

export const BUSINESS = {
  name: "Daitan Engineering",
  subtitle: "GTÜ Kfz-Prüfstelle",
  tagline: "GTÜ-Vertragspartner",
  address: "Industriestraße 43",
  city: "50389 Wesseling",
  country: "Deutschland",
  phone: "01573 7657704",
  phoneLink: "+4915737657704",
  email: "info@daitan-engineering.de",
  domain: "daitan-engineering.de",
  taxNumber: "224/5313/4303",
  mapsUrl: "https://maps.app.goo.gl/z9tNsRjLyBF6HU19A",
  slotMinutes: 30,
  changeDeadlineHours: 1,
} as const;

export type ScheduleDay = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  openTime2?: string | null;
  closeTime2?: string | null;
};

/** JS getDay(): 0=So, 1=Mo … 6=Sa */
export const DEFAULT_WEEKLY: Record<number, ScheduleDay> = {
  0: { isOpen: false, openTime: "08:00", closeTime: "17:00" },
  1: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
  2: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
  3: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
  4: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
  5: {
    isOpen: true,
    openTime: "08:00",
    closeTime: "12:00",
    openTime2: "14:30",
    closeTime2: "18:00",
  },
  6: { isOpen: true, openTime: "09:00", closeTime: "14:00" },
};

export const OPENING_HOURS = [
  { days: "Montag – Donnerstag", hours: "08:00 – 17:00 Uhr" },
  { days: "Freitag", hours: "08:00 – 12:00 & 14:30 – 18:00 Uhr" },
  { days: "Samstag", hours: "09:00 – 14:00 Uhr" },
  { days: "Sonntag", hours: "Geschlossen" },
] as const;

export const SERVICES = [
  {
    id: "hu-au",
    title: "Hauptuntersuchung HU / AU",
    description:
      "Amtliche Hauptuntersuchung und Abgasuntersuchung für Ihr Fahrzeug – schnell, zuverlässig und termingerecht.",
    icon: "shield",
  },
  {
    id: "einzelabnahme",
    title: "Einzelabnahme",
    description:
      "Abnahme von Änderungen und Umbauten am Fahrzeug nach § 19.3 StVZO.",
    icon: "wrench",
  },
  {
    id: "oldtimer",
    title: "Oldtimerservice",
    description:
      "Begutachtung und Abnahme von Oldtimer-Fahrzeugen durch erfahrene Prüfingenieure.",
    icon: "car",
  },
  {
    id: "gsp",
    title: "GSP / GAP / GWP",
    description: "Gasprüfungen für Wohnmobile, Camper und Gasanlagen.",
    icon: "flame",
  },
] as const;

export const BOOKING_SERVICE_IDS = SERVICES.map((s) => s.id);

export function getServiceLabel(id: string): string {
  return SERVICES.find((s) => s.id === id)?.title ?? id;
}
