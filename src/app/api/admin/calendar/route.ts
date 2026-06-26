import { NextRequest, NextResponse } from "next/server";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getDaySchedule } from "@/lib/scheduling";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));

  const monthRecord = await prisma.bookingMonth.findUnique({
    where: { year_month: { year, month } },
  });

  const start = startOfMonth(new Date(year, month - 1));
  const days = eachDayOfInterval({ start, end: endOfMonth(start) });

  const overrides = await prisma.dayOverride.findMany({
    where: {
      date: { gte: start, lte: endOfMonth(start) },
    },
  });

  const holidays = await prisma.holiday.findMany({
    where: {
      date: { gte: start, lte: endOfMonth(start) },
    },
  });

  const dayDetails = await Promise.all(
    days.map(async (day) => {
      const schedule = await getDaySchedule(day);
      const dateStr = format(day, "yyyy-MM-dd");
      const override = overrides.find(
        (o) => format(o.date, "yyyy-MM-dd") === dateStr,
      );
      const holiday = holidays.find(
        (h) => format(h.date, "yyyy-MM-dd") === dateStr,
      );

      return {
        date: dateStr,
        isOpen: schedule.isOpen,
        openTime: schedule.openTime,
        closeTime: schedule.closeTime,
        isClosedOverride: override?.isClosed ?? false,
        hasCustomHours: !!(override?.openTime && override?.closeTime),
        holiday: holiday?.name || null,
      };
    }),
  );

  return NextResponse.json({
    isMonthOpen: monthRecord?.isOpen ?? false,
    days: dayDetails,
  });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.action === "toggleMonth") {
    await prisma.bookingMonth.upsert({
      where: { year_month: { year: body.year, month: body.month } },
      update: { isOpen: body.isOpen },
      create: { year: body.year, month: body.month, isOpen: body.isOpen },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "setDayClosed") {
    const date = new Date(body.date);
    await prisma.dayOverride.upsert({
      where: { date },
      update: { isClosed: body.isClosed, openTime: null, closeTime: null },
      create: { date, isClosed: body.isClosed },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "setDayHours") {
    const date = new Date(body.date);
    await prisma.dayOverride.upsert({
      where: { date },
      update: {
        isClosed: false,
        openTime: body.openTime,
        closeTime: body.closeTime,
      },
      create: {
        date,
        isClosed: false,
        openTime: body.openTime,
        closeTime: body.closeTime,
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "resetDay") {
    const date = new Date(body.date);
    await prisma.dayOverride.deleteMany({ where: { date } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
