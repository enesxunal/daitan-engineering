"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

const links = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/termin", label: "Online-Termin" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-brand text-white text-center text-xs sm:text-sm py-1.5 px-3 font-medium tracking-wide">
        <span className="hidden sm:inline">Daitan Engineering · GTÜ Kfz-Prüfstelle Wesseling</span>
        <span className="sm:hidden">Daitan Engineering · GTÜ Wesseling</span>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
        <BrandLogo variant="header" />

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand ${
                pathname === link.href ? "text-brand" : "text-brand-grey"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/termin"
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
          >
            Termin buchen
          </Link>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-brand-grey shrink-0"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t px-4 py-4 flex flex-col gap-1 bg-white">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-3 text-sm font-medium border-b border-brand-light last:border-0 ${
                pathname === link.href ? "text-brand" : "text-brand-grey"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/termin"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white text-center hover:bg-brand-dark"
          >
            Termin buchen
          </Link>
        </nav>
      )}
    </header>
  );
}
