import { NextRequest, NextResponse } from "next/server";
import { parseDateOnly, getAvailableSlots } from "@/lib/scheduling";

export async function GET(req: NextRequest) {
  const dateStr = req.nextUrl.searchParams.get("date");
  if (!dateStr) {
    return NextResponse.json({ error: "date erforderlich" }, { status: 400 });
  }

  const slots = await getAvailableSlots(parseDateOnly(dateStr));
  return NextResponse.json({ slots });
}
