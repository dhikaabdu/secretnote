import Link from "next/link";

export default function CatalogItemNotFound() {
  return (
    <main id="content" className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Item tidak ditemukan</h1>
      <p className="mt-2 text-slate-600">
        Item tersebut tidak tersedia atau memiliki ID yang tidak valid.
      </p>
      <Link
        href="/catalog"
        className="mt-5 inline-block font-semibold text-indigo-700 hover:underline"
      >
        Kembali ke katalog
      </Link>
    </main>
  );
}
