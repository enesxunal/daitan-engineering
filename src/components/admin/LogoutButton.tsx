"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button onClick={logout} className="hover:text-brand-muted">
      Abmelden
    </button>
  );
}
