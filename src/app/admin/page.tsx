import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { getServiceLabel } from "@/lib/constants";

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = await prisma.booking.findMany({
    where: { status: "CONFIRMED", date: { gte: today } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    take: 10,
  });

  const todayCount = await prisma.booking.count({
    where: { status: "CONFIRMED", date: today },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-grey mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Heute" value={String(todayCount)} sub="Termine" />
        <StatCard
          label="Kommende"
          value={String(upcoming.length)}
          sub="Bestätigt"
        />
        <Link
          href="/admin/kalender"
          className="rounded-xl bg-brand text-white p-5 flex items-center justify-center font-semibold hover:bg-brand-dark"
        >
          Kalender verwalten →
        </Link>
      </div>

      <h2 className="font-semibold text-brand-grey mb-3">Nächste Termine</h2>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-light">
            <tr>
              <th className="text-left p-3">Datum</th>
              <th className="text-left p-3">Uhrzeit</th>
              <th className="text-left p-3">Kunde</th>
              <th className="text-left p-3">Leistung</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-brand-grey/60">
                  Keine anstehenden Termine
                </td>
              </tr>
            ) : (
              upcoming.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">
                    {format(b.date, "dd.MM.yyyy", { locale: de })}
                  </td>
                  <td className="p-3">{b.startTime}</td>
                  <td className="p-3">
                    {b.firstName} {b.lastName}
                  </td>
                  <td className="p-3">{getServiceLabel(b.serviceType)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl bg-white border p-5">
      <p className="text-sm text-brand-grey/60">{label}</p>
      <p className="text-3xl font-bold text-brand">{value}</p>
      <p className="text-xs text-brand-grey/60">{sub}</p>
    </div>
  );
}
