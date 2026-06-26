import { Resend } from "resend";
import { formatDateDE, formatTimeRange } from "./scheduling";
import { BUSINESS } from "./constants";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail =
  process.env.EMAIL_FROM ||
  `Daitan Engineering <${BUSINESS.email}>`;

function baseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://daitan-engineering.de";
}

function deadlineText() {
  return BUSINESS.changeDeadlineHours === 1
    ? "1 Stunde vorher"
    : `${BUSINESS.changeDeadlineHours} Stunden vorher`;
}

type BookingEmailData = {
  firstName: string;
  lastName: string;
  email: string;
  date: Date;
  startTime: string;
  endTime: string;
  serviceType: string;
  phone: string;
  cancelToken: string;
  manageToken: string;
};

function bookingDetailsHtml(data: BookingEmailData) {
  return `
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Telefon:</strong> ${data.phone}</p>
    <p><strong>E-Mail:</strong> ${data.email}</p>
    <p><strong>Leistung:</strong> ${data.serviceType}</p>
    <p><strong>Termin:</strong> ${formatDateDE(data.date)}</p>
    <p><strong>Uhrzeit:</strong> ${formatTimeRange(data.startTime, data.endTime)}</p>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log("[E-Mail Simulation]", { to, subject, html });
    return { ok: true, simulated: true };
  }

  const result = await resend.emails.send({ from: fromEmail, to, subject, html });
  return { ok: !result.error, error: result.error };
}

export async function sendBookingConfirmation(
  data: BookingEmailData,
  businessEmail: string,
) {
  const cancelUrl = `${baseUrl()}/termin/stornieren?token=${data.cancelToken}`;
  const manageUrl = `${baseUrl()}/termin/aendern?token=${data.manageToken}`;

  const customerHtml = `
    <h2>Ihr Termin bei ${BUSINESS.name}</h2>
    <p>Vielen Dank, ${data.firstName}! Ihr Termin wurde bestätigt.</p>
    ${bookingDetailsHtml(data)}
    <p><a href="${manageUrl}">Termin ändern</a> (bis ${deadlineText()})</p>
    <p><a href="${cancelUrl}">Termin stornieren</a></p>
    <p>Bei Fragen: ${BUSINESS.phone}</p>
  `;

  const adminHtml = `
    <h2>Neue Terminbuchung</h2>
    ${bookingDetailsHtml(data)}
  `;

  await sendEmail(data.email, `Terminbestätigung – ${BUSINESS.name}`, customerHtml);

  const notifyEmail = businessEmail || BUSINESS.email;
  await sendEmail(
    notifyEmail,
    `Neue Buchung: ${data.firstName} ${data.lastName}`,
    adminHtml,
  );
}

export async function sendBookingCancelled(
  data: BookingEmailData,
  businessEmail: string,
  byCustomer: boolean,
) {
  const subject = byCustomer
    ? `Stornierung: ${data.firstName} ${data.lastName}`
    : `Ihr Termin wurde storniert`;

  const html = `
    <h2>Termin storniert</h2>
    ${bookingDetailsHtml(data)}
    ${byCustomer ? "<p>Der Termin wurde vom Kunden storniert.</p>" : "<p>Ihr Termin wurde storniert.</p>"}
  `;

  await sendEmail(data.email, subject, html);
  if (byCustomer) {
    const notifyEmail = businessEmail || BUSINESS.email;
    await sendEmail(notifyEmail, subject, html);
  }
}

export async function sendBookingUpdated(
  data: BookingEmailData,
  businessEmail: string,
) {
  const cancelUrl = `${baseUrl()}/termin/stornieren?token=${data.cancelToken}`;
  const manageUrl = `${baseUrl()}/termin/aendern?token=${data.manageToken}`;

  const html = `
    <h2>Termin aktualisiert</h2>
    <p>Ihr Termin wurde erfolgreich geändert.</p>
    ${bookingDetailsHtml(data)}
    <p><a href="${manageUrl}">Erneut ändern</a> (bis ${deadlineText()})</p>
    <p><a href="${cancelUrl}">Termin stornieren</a></p>
  `;

  await sendEmail(data.email, `Termin geändert – ${BUSINESS.name}`, html);
  const notifyEmail = businessEmail || BUSINESS.email;
  await sendEmail(
    notifyEmail,
    `Termin geändert: ${data.firstName} ${data.lastName}`,
    html,
  );
}
