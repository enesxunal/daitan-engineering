import {
  format,
  isBefore,
  parse,
  startOfDay,
  subHours,
} from "date-fns";
import { de } from "date-fns/locale";
import { prisma } from "./prisma";
import { BUSINESS, DEFAULT_WEEKLY, type ScheduleDay } from "./constants";

export function parseDateOnly(dateStr: string): Date {
  return startOfDay(parse(dateStr, "yyyy-MM-dd", new Date()));
}

export function formatDateDE(date: Date): string {
  return format(date, "EEEE, d. MMMM yyyy", { locale: de });
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} – ${end} Uhr`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateSlots(openTime: string, closeTime: string): string[] {
  const slots: string[] = [];
  let current = timeToMinutes(openTime);
  const end = timeToMinutes(closeTime);

  while (current + BUSINESS.slotMinutes <= end) {
    slots.push(minutesToTime(current));
    current += BUSINESS.slotMinutes;
  }

  return slots;
}

function getRangesFromSchedule(schedule: ScheduleDay): { open: string; close: string }[] {
  if (!schedule.isOpen) return [];
  const ranges = [{ open: schedule.openTime, close: schedule.closeTime }];
  if (schedule.openTime2 && schedule.closeTime2) {
    ranges.push({ open: schedule.openTime2, close: schedule.closeTime2 });
  }
  return ranges;
}

export function generateSlotsForDay(schedule: ScheduleDay): string[] {
  const ranges = getRangesFromSchedule(schedule);
  const slots: string[] = [];
  for (const range of ranges) {
    slots.push(...generateSlots(range.open, range.close));
  }
  return slots.sort();
}

export function slotEndTime(startTime: string): string {
  return minutesToTime(timeToMinutes(startTime) + BUSINESS.slotMinutes);
}

export async function getDaySchedule(date: Date): Promise<ScheduleDay> {
  const dayOfWeek = date.getDay();
  const weekly =
    (await prisma.weeklySchedule.findUnique({ where: { dayOfWeek } })) ||
    DEFAULT_WEEKLY[dayOfWeek];

  const override = await prisma.dayOverride.findUnique({
    where: { date: startOfDay(date) },
  });

  if (override?.isClosed) {
    return { isOpen: false, openTime: "", closeTime: "" };
  }

  const holiday = await prisma.holiday.findUnique({
    where: { date: startOfDay(date) },
  });
  if (holiday) return { isOpen: false, openTime: "", closeTime: "" };

  if (override?.openTime && override?.closeTime) {
    return {
      isOpen: true,
      openTime: override.openTime,
      closeTime: override.closeTime,
      openTime2: override.openTime2,
      closeTime2: override.closeTime2,
    };
  }

  if (!weekly.isOpen) return { isOpen: false, openTime: "", closeTime: "" };

  return {
    isOpen: weekly.isOpen,
    openTime: weekly.openTime,
    closeTime: weekly.closeTime,
    openTime2: weekly.openTime2,
    closeTime2: weekly.closeTime2,
  };
}

export async function isMonthOpen(year: number, month: number) {
  const record = await prisma.bookingMonth.findUnique({
    where: { year_month: { year, month } },
  });
  return record?.isOpen ?? false;
}

export async function getAvailableSlots(date: Date): Promise<string[]> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (!(await isMonthOpen(year, month))) return [];

  const schedule = await getDaySchedule(date);
  if (!schedule.isOpen) return [];

  const allSlots = generateSlotsForDay(schedule);

  const bookings = await prisma.booking.findMany({
    where: {
      date: startOfDay(date),
      status: "CONFIRMED",
    },
    select: { startTime: true },
  });

  const taken = new Set(bookings.map((b) => b.startTime));
  const now = new Date();

  return allSlots.filter((slot) => {
    if (taken.has(slot)) return false;
    const slotDateTime = parse(
      `${format(date, "yyyy-MM-dd")} ${slot}`,
      "yyyy-MM-dd HH:mm",
      new Date(),
    );
    return isBefore(now, slotDateTime);
  });
}

export function canModifyBooking(date: Date, startTime: string): boolean {
  const slotDateTime = parse(
    `${format(date, "yyyy-MM-dd")} ${startTime}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );
  const deadline = subHours(slotDateTime, BUSINESS.changeDeadlineHours);
  return isBefore(new Date(), deadline);
}

export async function isSlotAvailable(
  date: Date,
  startTime: string,
  excludeBookingId?: string,
): Promise<boolean> {
  const schedule = await getDaySchedule(date);
  if (!schedule.isOpen) return false;

  const allSlots = generateSlotsForDay(schedule);
  if (!allSlots.includes(startTime)) return false;

  const booking = await prisma.booking.findFirst({
    where: {
      date: startOfDay(date),
      startTime,
      status: "CONFIRMED",
      ...(excludeBookingId ? { NOT: { id: excludeBookingId } } : {}),
    },
  });

  if (booking) return false;

  const now = new Date();
  const slotDateTime = parse(
    `${format(date, "yyyy-MM-dd")} ${startTime}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );
  return isBefore(now, slotDateTime);
}
