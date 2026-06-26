import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-light">
      <AdminNav />
      {children}
    </div>
  );
}

async function AdminNav() {
  const session = await getAdminSession();

  return (
    <header className="bg-brand-grey text-white">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <span className="font-semibold">Admin – Daitan Engineering</span>
        {session && (
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="hover:text-brand-muted">
              Übersicht
            </Link>
            <Link href="/admin/kalender" className="hover:text-brand-muted">
              Kalender
            </Link>
            <Link href="/admin/termine" className="hover:text-brand-muted">
              Termine
            </Link>
            <Link href="/admin/einstellungen" className="hover:text-brand-muted">
              Einstellungen
            </Link>
            <LogoutButton />
          </nav>
        )}
      </div>
    </header>
  );
}
