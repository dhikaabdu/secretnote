import Link from "next/link";
import { Suspense } from "react";
import ItemList from "./item-list";

export default function PraktikumModul06Page() {
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

        <Suspense
          fallback={
            <p className="mt-5 text-gray-500">
              Memuat data praktikum...
            </p>
          }
        >
          <ItemList />
        </Suspense>

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
