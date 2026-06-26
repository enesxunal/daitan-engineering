import { NextRequest, NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import {
  canModifyBooking,
  isSlotAvailable,
  parseDateOnly,
  slotEndTime,
} from "@/lib/scheduling";
import { sendBookingUpdated } from "@/lib/email";
import { getServiceLabel } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token fehlt" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { manageToken: token },
  });

  if (!booking || booking.status !== "CONFIRMED") {
    return NextResponse.json({ error: "Termin nicht gefunden." }, { status: 404 });
  }

  const canModify = canModifyBooking(booking.date, booking.startTime);

  return NextResponse.json({
    id: booking.id,
    firstName: booking.firstName,
    lastName: booking.lastName,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    serviceType: getServiceLabel(booking.serviceType),
    canModify,
  });
}

export async function PUT(req: NextRequest) {
  const { token, date, startTime } = await req.json();

  const booking = await prisma.booking.findUnique({
    where: { manageToken: token },
  });

  if (!booking || booking.status !== "CONFIRMED") {
    return NextResponse.json({ error: "Termin nicht gefunden." }, { status: 404 });
  }

  if (!canModifyBooking(booking.date, booking.startTime)) {
    return NextResponse.json(
      { error: "Änderung nur bis 1 Stunde vorher möglich." },
      { status: 403 },
    );
  }

  const newDate = parseDateOnly(date);

  if (
    booking.date.getTime() !== startOfDay(newDate).getTime() ||
    booking.startTime !== startTime
  ) {
    if (!(await isSlotAvailable(newDate, startTime, booking.id))) {
      return NextResponse.json(
        { error: "Neuer Termin nicht verfügbar." },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      date: startOfDay(newDate),
      startTime,
      endTime: slotEndTime(startTime),
    },
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const serviceLabel = getServiceLabel(updated.serviceType);

  await sendBookingUpdated(
    {
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      date: updated.date,
      startTime: updated.startTime,
      endTime: updated.endTime,
      serviceType: serviceLabel,
      cancelToken: updated.cancelToken,
      manageToken: updated.manageToken,
    },
    settings?.businessEmail || "",
  );

  return NextResponse.json({ ok: true });
}
