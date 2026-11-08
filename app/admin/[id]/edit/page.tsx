
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth/user-session";
import { appPrisma } from "@/lib/app-prisma";
import EditUserForm from "./edit-user-form";

export const instant = false;

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({
  params,
}: EditUserPageProps) {
  await requireRole(["ADMIN"]);

  const { id } = await params;

  const user = await appPrisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link
        href="/admin"
        className="text-sm font-semibold text-violet-600 hover:underline"
      >
        ← Kembali ke Manajemen Pengguna
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Edit Pengguna
        </h1>

        <p className="mt-2 text-gray-600">
          Perbarui informasi akun dan hak akses pengguna.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <EditUserForm user={user} />
      </section>
    </main>
  );
}
