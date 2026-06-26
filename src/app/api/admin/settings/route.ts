import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const schedule = await prisma.weeklySchedule.findMany({
    orderBy: { dayOfWeek: "asc" },
  });
  const holidays = await prisma.holiday.findMany({
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ settings, schedule, holidays });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.type === "settings") {
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: { businessEmail: body.businessEmail },
    });
  }

  if (body.type === "schedule") {
    for (const day of body.schedule) {
      await prisma.weeklySchedule.update({
        where: { dayOfWeek: day.dayOfWeek },
        data: day,
      });
    }
  }

  if (body.type === "holiday") {
    await prisma.holiday.create({
      data: { date: new Date(body.date), name: body.name },
    });
  }

  if (body.type === "deleteHoliday") {
    await prisma.holiday.delete({ where: { id: body.id } });
  }

  return NextResponse.json({ ok: true });
}
