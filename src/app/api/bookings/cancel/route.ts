import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingCancelled } from "@/lib/email";
import { getServiceLabel } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token fehlt" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { cancelToken: token },
  });

  if (!booking || booking.status !== "CONFIRMED") {
    return NextResponse.json({ error: "Termin nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({
    firstName: booking.firstName,
    lastName: booking.lastName,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    serviceType: getServiceLabel(booking.serviceType),
  });
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Token fehlt" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { cancelToken: token },
  });

  if (!booking || booking.status !== "CONFIRMED") {
    return NextResponse.json({ error: "Termin nicht gefunden." }, { status: 404 });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const serviceLabel = getServiceLabel(booking.serviceType);

  await sendBookingCancelled(
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
    true,
  );

  return NextResponse.json({ ok: true });
}
