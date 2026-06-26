import { NextRequest, NextResponse } from "next/server";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { getAvailableSlots, isMonthOpen } from "@/lib/scheduling";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));

  if (!year || !month) {
    return NextResponse.json({ error: "year und month erforderlich" }, { status: 400 });
  }

  if (!(await isMonthOpen(year, month))) {
    return NextResponse.json({ openDays: [] });
  }

  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  const openDays: string[] = [];

  for (const day of days) {
    const slots = await getAvailableSlots(day);
    if (slots.length > 0) {
      openDays.push(format(day, "yyyy-MM-dd"));
    }
  }

  return NextResponse.json({ openDays });
}
