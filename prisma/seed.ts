import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { BUSINESS, DEFAULT_WEEKLY } from "../src/lib/constants";

const prisma = new PrismaClient();

const GERMAN_HOLIDAYS = [
  { date: "2025-01-01", name: "Neujahr" },
  { date: "2025-04-18", name: "Karfreitag" },
  { date: "2025-04-21", name: "Ostermontag" },
  { date: "2025-05-01", name: "Tag der Arbeit" },
  { date: "2025-05-29", name: "Christi Himmelfahrt" },
  { date: "2025-06-09", name: "Pfingstmontag" },
  { date: "2025-06-19", name: "Fronleichnam (NRW)" },
  { date: "2025-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2025-11-01", name: "Allerheiligen (NRW)" },
  { date: "2025-12-25", name: "1. Weihnachtstag" },
  { date: "2025-12-26", name: "2. Weihnachtstag" },
  { date: "2026-01-01", name: "Neujahr" },
  { date: "2026-04-03", name: "Karfreitag" },
  { date: "2026-04-06", name: "Ostermontag" },
  { date: "2026-05-01", name: "Tag der Arbeit" },
  { date: "2026-05-14", name: "Christi Himmelfahrt" },
  { date: "2026-05-25", name: "Pfingstmontag" },
  { date: "2026-06-04", name: "Fronleichnam (NRW)" },
  { date: "2026-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2026-11-01", name: "Allerheiligen (NRW)" },
  { date: "2026-12-25", name: "1. Weihnachtstag" },
  { date: "2026-12-26", name: "2. Weihnachtstag" },
  { date: "2027-01-01", name: "Neujahr" },
  { date: "2027-03-26", name: "Karfreitag" },
  { date: "2027-03-29", name: "Ostermontag" },
  { date: "2027-05-01", name: "Tag der Arbeit" },
  { date: "2027-05-06", name: "Christi Himmelfahrt" },
  { date: "2027-05-17", name: "Pfingstmontag" },
  { date: "2027-05-27", name: "Fronleichnam (NRW)" },
  { date: "2027-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2027-11-01", name: "Allerheiligen (NRW)" },
  { date: "2027-12-25", name: "1. Weihnachtstag" },
  { date: "2027-12-26", name: "2. Weihnachtstag" },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      businessEmail: BUSINESS.email,
      businessPhone: BUSINESS.phone,
      businessName: BUSINESS.name,
    },
    create: {
      id: "default",
      businessEmail: BUSINESS.email,
      businessPhone: BUSINESS.phone,
      businessName: BUSINESS.name,
    },
  });

  for (const [dayOfWeek, schedule] of Object.entries(DEFAULT_WEEKLY)) {
    await prisma.weeklySchedule.upsert({
      where: { dayOfWeek: Number(dayOfWeek) },
      update: schedule,
      create: { dayOfWeek: Number(dayOfWeek), ...schedule },
    });
  }

  for (const h of GERMAN_HOLIDAYS) {
    await prisma.holiday.upsert({
      where: { date: new Date(h.date) },
      update: { name: h.name },
      create: { date: new Date(h.date), name: h.name },
    });
  }

  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    await prisma.bookingMonth.upsert({
      where: {
        year_month: { year: d.getFullYear(), month: d.getMonth() + 1 },
      },
      update: {},
      create: {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        isOpen: i === 0,
      },
    });
  }

  console.log("Seed abgeschlossen.");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
