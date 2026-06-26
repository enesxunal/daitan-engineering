# GTÜ Kfz-Prüfstelle Wesseling

Website mit Online-Terminbuchung für HU/AU.

## Schnellstart

```bash
npm install
npm run db:setup
npm run dev
```

Öffnen: http://localhost:3000

### Admin Panel

- URL: http://localhost:3000/admin
- Login: `admin@example.com` / `admin123` (siehe `.env`)

## Funktionen

- **Öffentliche Website** (Deutsch): Startseite, Leistungen, Über uns, Kontakt, Impressum, Datenschutz
- **Online-Terminbuchung**: 30-Minuten-Slots, 1 Prüfspur
- **Fahrzeugauswahl**: Marken & Modelle aus Datenbank
- **E-Mail**: Bestätigung, Stornierung, Änderung (Resend – optional)
- **Admin**: Kalender (Monat freigeben, Tage schließen, Sonderzeiten), Terminliste, Einstellungen

## Umgebungsvariablen

Kopieren Sie `.env.example` nach `.env` und passen Sie an:

| Variable | Beschreibung |
|----------|-------------|
| `DATABASE_URL` | SQLite (lokal) oder PostgreSQL (Produktion) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin-Zugang |
| `RESEND_API_KEY` | E-Mail-Versand (optional, simuliert ohne Key) |
| `EMAIL_FROM` | Absender-Adresse |
| `NEXT_PUBLIC_BASE_URL` | Website-URL für E-Mail-Links |

## Deployment (Vercel + GitHub)

1. Repository auf GitHub pushen
2. In Vercel importieren
3. Umgebungsvariablen setzen
4. Für Produktion: PostgreSQL (z.B. Neon/Supabase) statt SQLite

## Morgen ergänzen

- [ ] Domain & E-Mail vom Kunden
- [ ] Echte Fotos (AI) statt Stock-Bilder
- [ ] Impressum-Daten vervollständigen
