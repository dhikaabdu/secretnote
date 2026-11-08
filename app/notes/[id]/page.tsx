
import { notFound } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { requireUserSession } from "@/lib/auth/user-session";
import { appPrisma } from "@/lib/app-prisma";

export const instant = false;

type NoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailPage({
  params,
}: NoteDetailPageProps) {
  const session = await requireUserSession();
  const { id } = await params;

  const note = await appPrisma.note.findFirst({
    where: {
      id,
      userId: session.userId,
    },
  });

  if (!note) {
    notFound();
  }

  return (
    <>
      <AppHeader showLogout />

      <main className="mx-auto max-w-3xl p-6">
        <Link
          href="/notes"
          className="mb-6 inline-block text-sm font-semibold text-indigo-600 hover:underline"
        >
          ← Kembali ke daftar catatan
        </Link>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-600">
            {note.category ?? "Lainnya"}
          </p>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            {note.title}
          </h1>

          <p className="mt-2 text-xs text-slate-500">
            Terakhir diperbarui:{" "}
            {note.updatedAt.toLocaleString("id-ID")}
          </p>

          <div className="mt-6 whitespace-pre-wrap break-words text-slate-700">
            {note.content}
          </div>
        </article>
      </main>
    </>
  );
}
