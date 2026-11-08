
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import PageHeader from "@/components/PageHeader";
import NoteCard from "@/components/NoteCard";
import { requireUserSession } from "@/lib/auth/user-session";
import { appPrisma } from "@/lib/app-prisma";

export const instant = false;

export default async function NotesPage() {
  const session = await requireUserSession();

  const notes = await appPrisma.note.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader showLogout />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <PageHeader
          eyebrow="My Workspace"
          title="Semua Catatan"
          description="Kelola catatan akademik, personal, dan produktivitasmu dalam satu tempat."
        />

        <div className="mb-6">
          <Link
            href="/notes/new"
            className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Buat catatan baru
          </Link>
        </div>

        <section
          aria-label="Daftar catatan"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              category={note.category ?? "Lainnya"}
              description={note.content}
              updated={note.updatedAt.toLocaleDateString("id-ID")}
            />
          ))}
        </section>

        {notes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              Belum ada catatan
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Mulai buat catatan pertamamu.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
