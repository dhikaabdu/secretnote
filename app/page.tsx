
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import PageHeader from "@/components/PageHeader";
import NoteCard from "@/components/NoteCard";
import CategoryBadge from "@/components/CategoryBadge";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <PageHeader
          eyebrow="Personal workspace"
          title="Semua catatanmu, satu ruang."
          description="Simpan ide, rencana, dan catatan pribadi dalam satu tempat yang dirancang dengan perhatian pada keamanan informasi."
        />

        <section
          aria-label="Ringkasan catatan"
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total catatan</p>
            <p className="mt-3 text-2xl font-bold">03</p>
            <p className="mt-2 text-xs text-slate-500">Data contoh</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Kategori</p>
            <p className="mt-3 text-2xl font-bold">03</p>
            <p className="mt-2 text-xs text-slate-500">
              Pengelompokan catatan
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Perlindungan</p>
            <p className="mt-3 text-xl font-bold">Direncanakan</p>
            <p className="mt-2 text-xs text-slate-500">
              Enkripsi pada tahap berikutnya
            </p>
          </article>
        </section>

        <section aria-labelledby="recent-notes-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 id="recent-notes-heading" className="text-xl font-bold text-slate-900">
                Catatan terbaru
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Contoh tampilan catatan SecretNote.
              </p>
            </div>

            <Link
              href="/notes"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.title} {...note} />
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CategoryBadge category="Akademik" />
          <CategoryBadge category="Personal" />
          <CategoryBadge category="Produktivitas" />
          <Link
            href="/notes/new"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Buat catatan
          </Link>
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs leading-6 text-slate-500">
          SecretNote · Secure Personal Notes
          <br />
          Versi awal menggunakan data contoh dan belum menyimpan atau
          mengenkripsi catatan secara nyata.
        </footer>
      </main>
    </div>
  );
}
