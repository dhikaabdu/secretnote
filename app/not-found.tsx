import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main id="content" className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 text-center sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 text-slate-600">
          Alamat yang kamu buka tidak tersedia.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-semibold text-indigo-700 hover:underline"
        >
          Kembali ke dashboard
        </Link>
      </main>
    </>
  );
}
