import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status") || "CONFIRMED";
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  const bookings = await prisma.booking.findMany({
    where: {
      status: status as "CONFIRMED" | "CANCELLED" | "COMPLETED",
      ...(from && to
        ? {
            date: {
              gte: new Date(from),
              lte: new Date(to),
            },
          }
        : {}),
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(bookings);
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();
  await prisma.booking.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
