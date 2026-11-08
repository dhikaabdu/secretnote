
import Link from "next/link";
import { requireRole } from "@/lib/auth/user-session";
import { appPrisma } from "@/lib/app-prisma";
import DeleteUserButton from "./delete-user-button";

export const instant = false;

export default async function AdminPage() {
  const session = await requireRole(["ADMIN"]);

  const users = await appPrisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
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

      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Manajemen Pengguna
        </h2>

        <p className="mt-2 text-gray-600">
          Kelola akun dan hak akses pengguna SecretNote.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Total pengguna: {users.length}
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold">
            Daftar Pengguna
          </h2>
        </div>

        {users.length === 0 ? (
          <p className="p-6 text-gray-500">
            Belum ada pengguna terdaftar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Tanggal Registrasi</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4 font-medium">
                      {user.username}
                    </td>

                    <td className="px-5 py-4">
                      {user.email}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {user.createdAt.toLocaleDateString("id-ID")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/${user.id}/edit`}
                          className="font-semibold text-violet-600 hover:underline"
                        >
                          Edit
                        </Link>

                        {user.id === session.userId ? (
                          <span className="text-xs text-gray-400">
                            Akun Anda
                          </span>
                        ) : (
                          <DeleteUserButton
                            userId={user.id}
                            username={user.username}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Link
        href="/notes"
        className="mt-6 inline-block text-sm font-semibold text-violet-600 hover:underline"
      >
        ← Kembali ke catatan
      </Link>
    </main>
  );
}
