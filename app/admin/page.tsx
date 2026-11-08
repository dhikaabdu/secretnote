import Link from "next/link";
import { requireRole } from "@/lib/auth/user-session";

export const instant = false;

export default async function AdminPage() {
  const session = await requireRole(["ADMIN"]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Selamat datang, {session.username}.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Manajemen Pengguna
        </h2>

        <p className="mt-2 text-gray-600">
          Halaman administrasi untuk mengelola akun dan hak akses pengguna
          SecretNote.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Role aktif: {session.role}
        </p>
      </section>

      <Link
        href="/notes"
        className="mt-6 inline-block text-sm font-semibold text-violet-600 hover:underline"
      >
        Kembali ke catatan
      </Link>
    </main>
  );
}