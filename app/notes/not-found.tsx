
import Link from "next/link";

export default function NotesNotFound() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">
        Catatan tidak ditemukan
      </h1>

      <p className="mt-2">
        Periksa alamat atau kembali ke daftar catatan.
      </p>

      <Link
        href="/notes"
        className="mt-4 inline-block underline"
      >
        Kembali ke My Notes
      </Link>
    </main>
  );
}
