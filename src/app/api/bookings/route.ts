import { NextRequest, NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { parseDateOnly, isSlotAvailable, slotEndTime } from "@/lib/scheduling";
import { sendBookingConfirmation } from "@/lib/email";
import { getServiceLabel, SERVICES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      serviceType,
      date,
      startTime,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !serviceType ||
      !date ||
      !startTime
    ) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich." },
        { status: 400 },
      );
    }

    if (!SERVICES.some((s) => s.id === serviceType)) {
      return NextResponse.json(
        { error: "Ungültige Leistungsart." },
        { status: 400 },
      );
    }

    const bookingDate = parseDateOnly(date);

    if (!(await isSlotAvailable(bookingDate, startTime))) {
      return NextResponse.json(
        { error: "Dieser Termin ist nicht mehr verfügbar." },
        { status: 409 },
      );
    }

    const endTime = slotEndTime(startTime);

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        serviceType,
        date: startOfDay(bookingDate),
        startTime,
        endTime,
      },
    });

    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    const serviceLabel = getServiceLabel(serviceType);

    await sendBookingConfirmation(
      {
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        serviceType: serviceLabel,
        cancelToken: booking.cancelToken,
        manageToken: booking.manageToken,
      },
      settings?.businessEmail || "",
    );

    return NextResponse.json({ ok: true, id: booking.id });
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 },
    );
  }
}
