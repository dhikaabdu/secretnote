
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import PageHeader from "@/components/PageHeader";
import NoteCard from "@/components/NoteCard";

const notes = [
  {
    title: "Ide Proyek Semester 5",
    category: "Akademik",
    description: "Catatan rencana dan target pengembangan proyek.",
    updated: "Hari ini",
  },
  {
    title: "Catatan Pribadi",
    category: "Personal",
    description: "Tempat menyimpan pengingat dan hal penting.",
    updated: "Kemarin",
  },
  {
    title: "Daftar Pekerjaan",
    category: "Produktivitas",
    description: "Hal-hal yang perlu diselesaikan minggu ini.",
    updated: "2 hari lalu",
  },
];

export default function NotesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

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
            <NoteCard key={note.title} {...note} />
          ))}
        </section>

        <p className="mt-8 text-sm text-slate-500">
          Saat ini daftar menggunakan data contoh, belum tersimpan permanen.
        </p>
      </div>
    </main>
  );
}
