import Link from "next/link";
import { ambilDaftarItem } from "@/lib/praktikum-data";

export default async function PraktikumModul06Page() {
  const items = await ambilDaftarItem();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          SecretNote · Praktikum Modul 6
        </p>

        <h1 className="mt-2 text-3xl font-bold">Katalog Item</h1>

        <p className="mt-3 text-gray-600">
          Halaman praktikum untuk mempelajari Prisma ORM dan PostgreSQL
          melalui data Item dan Ulasan.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold">Data Praktikum</h2>

        <p className="mt-2 text-gray-600">
          Data berikut diambil langsung dari database PostgreSQL.
        </p>

        {items.length === 0 ? (
          <p className="mt-5 text-gray-500">
            Belum ada data Item. Jalankan seed terlebih dahulu.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{item.judul}</h3>
                    <p className="text-sm text-gray-500">
                      Kategori: {item.kategori}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.tersedia
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.tersedia ? "Tersedia" : "Tidak tersedia"}
                  </span>
                </div>

                <p className="mt-3 text-gray-700">{item.deskripsi}</p>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <h4 className="font-medium">
                    Ulasan ({item.ulasan.length})
                  </h4>

                  {item.ulasan.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500">
                      Belum ada ulasan.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {item.ulasan.map((ulasan) => (
                        <li
                          key={ulasan.id}
                          className="rounded-md bg-gray-50 p-3 text-sm"
                        >
                          <p className="font-medium">
                            {ulasan.nama} · Nilai {ulasan.nilai}/5
                          </p>
                          <p className="mt-1 text-gray-600">
                            {ulasan.komentar}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/praktikum-modul-06"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Halaman Praktikum
          </Link>

          <Link
            href="/catalog"
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Katalog SecretNote
          </Link>
        </div>
      </section>
    </main>
  );
}