import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return NextResponse.json(
      { error: "Ungültige Anmeldedaten." },
      { status: 401 },
    );
  }

  await createAdminSession(admin.id);
  return NextResponse.json({ ok: true });
}
